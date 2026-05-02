import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { KycStatus, OtpPurpose, UserRole, UserStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { randomInt } from 'crypto';
import { PrismaService } from '../prisma.service';
import { WhatsappService } from './whatsapp.service';

type RegisterPayload = {
  fullName: string;
  phone: string;
  country?: string;
  password: string;
};

type LoginPayload = {
  phone: string;
  password: string;
};

@Injectable()
export class AuthService {
  constructor(
  private readonly prisma: PrismaService,
  private readonly whatsappService: WhatsappService,
) {}

  private normalizePhone(phone: string): string {
    return phone.replace(/\s+/g, '').trim();
  }

  private normalizeText(value: string): string {
    return value.trim().replace(/\s+/g, ' ');
  }

  private splitFullName(fullName: string) {
    const cleanName = this.normalizeText(fullName);
    const parts = cleanName.split(' ');

    return {
      firstName: parts[0] ?? cleanName,
      lastName: parts.slice(1).join(' ') || null,
    };
  }

  private removeSensitiveUserFields(user: any) {
    if (!user) return null;

    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }

  private generateOtp(): string {
    return randomInt(100000, 999999).toString();
  }

  private async hashValue(value: string): Promise<string> {
    return bcrypt.hash(value, 12);
  }

  private async compareHash(value: string, hash: string): Promise<boolean> {
    return bcrypt.compare(value, hash);
  }

  private slugify(value: string): string {
    return value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private async generateUniqueMiniSiteSlug(fullName: string): Promise<string> {
    const baseSlug = this.slugify(fullName) || 'longricheur';
    let slug = baseSlug;
    let counter = 1;

    while (await this.prisma.miniSite.findUnique({ where: { slug } })) {
      counter += 1;
      slug = `${baseSlug}-${counter}`;
    }

    return slug;
  }

  private async createOtp(phone: string, purpose: OtpPurpose, userId?: string) {
    await this.prisma.otpCode.deleteMany({
      where: {
        phone,
        purpose,
        consumedAt: null,
      },
    });

    const otp = this.generateOtp();
    const codeHash = await this.hashValue(otp);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await this.prisma.otpCode.create({
      data: {
        userId,
        phone,
        codeHash,
        purpose,
        expiresAt,
      },
    });

   return {
  expiresAt,
  otp,
  devOtp: process.env.NODE_ENV === 'production' ? undefined : otp,
};
  }

  async register(payload: RegisterPayload) {
    if (!payload.fullName?.trim()) {
      throw new BadRequestException('Le nom complet est obligatoire.');
    }

    if (!payload.phone?.trim()) {
      throw new BadRequestException('Le numéro WhatsApp est obligatoire.');
    }

    if (!payload.password || payload.password.length < 6) {
      throw new BadRequestException(
        'Le mot de passe doit contenir au moins 6 caractères.',
      );
    }

    const phone = this.normalizePhone(payload.phone);
    const fullName = this.normalizeText(payload.fullName);
    const country = payload.country?.trim() || 'Cameroun';

    const existingUser = await this.prisma.user.findUnique({
      where: { phone },
    });

    if (existingUser) {
      throw new ConflictException('Ce numéro est déjà inscrit.');
    }

    const { firstName, lastName } = this.splitFullName(fullName);
    const passwordHash = await this.hashValue(payload.password);
    const miniSiteSlug = await this.generateUniqueMiniSiteSlug(fullName);

    const user = await this.prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          phone,
          passwordHash,
          firstName,
          lastName,
          role: UserRole.LONGRICHEUR,
          status: UserStatus.ACTIVE,
          isKycVerified: false,
          profile: {
            create: {
              country,
            },
          },
          kycProfile: {
            create: {
              status: KycStatus.NOT_STARTED,
            },
          },
          wallet: {
            create: {
              availableBalance: 0,
              pendingBalance: 0,
            },
          },
          miniSite: {
            create: {
              slug: miniSiteSlug,
              title: `Boutique Longrich de ${fullName}`,
              bio: null,
              isActive: false,
            },
          },
        },
        include: {
          profile: true,
          kycProfile: true,
          wallet: true,
          miniSite: true,
        },
      });

      await tx.auditLog.create({
        data: {
          userId: createdUser.id,
          action: 'AUTH_REGISTER',
          entity: 'User',
          entityId: createdUser.id,
          metadata: {
            phone,
            country,
            miniSiteSlug,
          },
        },
      });

      return createdUser;
    });

    const otpData = await this.createOtp(phone, OtpPurpose.REGISTER, user.id);
    
    // Envoi OTP via WhatsApp Cloud API
await this.whatsappService.sendOtp(phone, otpData.otp);

    return {
      success: true,
      message: 'Compte créé. Code de vérification envoyé.',
      data: {
        user: this.removeSensitiveUserFields(user),
        otpExpiresAt: otpData.expiresAt,
        devOtp: otpData.devOtp,
      },
    };
  }

  async verifyOtp(phone: string, code: string, purpose: OtpPurpose) {
    if (!phone?.trim()) {
      throw new BadRequestException('Le numéro est obligatoire.');
    }

    if (!code?.trim()) {
      throw new BadRequestException('Le code OTP est obligatoire.');
    }

    const normalizedPhone = this.normalizePhone(phone);

    const otpRecord = await this.prisma.otpCode.findFirst({
      where: {
        phone: normalizedPhone,
        purpose,
        consumedAt: null,
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!otpRecord) {
      throw new UnauthorizedException('Code invalide ou expiré.');
    }

    if (otpRecord.attempts >= 5) {
      throw new UnauthorizedException(
        'Trop de tentatives. Demandez un nouveau code.',
      );
    }

    const isValid = await this.compareHash(code, otpRecord.codeHash);

    if (!isValid) {
      await this.prisma.otpCode.update({
        where: { id: otpRecord.id },
        data: {
          attempts: {
            increment: 1,
          },
        },
      });

      throw new UnauthorizedException('Code invalide.');
    }

    const user = otpRecord.userId
      ? await this.prisma.user.update({
          where: { id: otpRecord.userId },
          data:
            purpose === OtpPurpose.REGISTER
              ? { phoneVerifiedAt: new Date() }
              : {},
          include: {
            profile: true,
            kycProfile: true,
            wallet: true,
            miniSite: true,
          },
        })
      : null;

    await this.prisma.otpCode.update({
      where: { id: otpRecord.id },
      data: {
        consumedAt: new Date(),
      },
    });

    return {
      success: true,
      message: 'Code vérifié avec succès.',
      data: {
        user: this.removeSensitiveUserFields(user),
      },
    };
  }

  async login(payload: LoginPayload) {
    if (!payload.phone?.trim()) {
      throw new BadRequestException('Le numéro est obligatoire.');
    }

    if (!payload.password?.trim()) {
      throw new BadRequestException('Le mot de passe est obligatoire.');
    }

    const phone = this.normalizePhone(payload.phone);

    const user = await this.prisma.user.findUnique({
      where: { phone },
      include: {
        profile: true,
        kycProfile: true,
        wallet: true,
        miniSite: true,
        subscriptions: {
          where: {
            isCurrent: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
    });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Identifiants incorrects.');
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('Compte inactif ou suspendu.');
    }

    const passwordOk = await this.compareHash(
      payload.password,
      user.passwordHash,
    );

    if (!passwordOk) {
      throw new UnauthorizedException('Identifiants incorrects.');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        lastLoginAt: new Date(),
      },
      include: {
        profile: true,
        kycProfile: true,
        wallet: true,
        miniSite: true,
        subscriptions: {
          where: {
            isCurrent: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
    });

    return {
      success: true,
      message: 'Connexion réussie.',
      data: {
        user: this.removeSensitiveUserFields(updatedUser),
      },
    };
  }
}