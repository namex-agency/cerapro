import 'dotenv/config';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

@Injectable()
export class AdminService {
  private getRequiredSuperAdminToken() {
    const token = process.env.SUPER_ADMIN_DELETE_TOKEN;

    if (!token || token.trim().length < 24) {
      throw new ForbiddenException(
        'Action super admin indisponible. Token de sécurité serveur manquant ou trop faible.',
      );
    }

    return token.trim();
  }

  private assertSuperAdminDeleteToken(token?: string) {
    const requiredToken = this.getRequiredSuperAdminToken();

    if (!token || token.trim() !== requiredToken) {
      throw new ForbiddenException(
        'Action refusée. Suppression définitive réservée au super admin CERAPRO.',
      );
    }
  }

  async createNotification(data: {
    userId: string;
    source: string;
    title: string;
    message: string;
    time?: string;
  }) {
    return prisma.notification.create({
      data: {
        userId: data.userId,
        source: data.source as any,
        title: data.title,
        message: data.message,
        time: data.time || 'Maintenant',
        read: false,
      },
    });
  }

  async getUsers() {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: 'desc',
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

    return users.map((user) => {
      const currentSubscription = user.subscriptions[0] ?? null;

      const selfieUrl = user.kycProfile?.selfieUrl ?? null;
      const cniFrontUrl = user.kycProfile?.cniFrontUrl ?? null;
      const cniBackUrl = user.kycProfile?.cniBackUrl ?? null;

      const kycFields = [
        user.firstName || user.lastName,
        user.phone,
        user.profile?.country,
        user.profile?.city,
        user.profile?.district,
        user.profile?.placeName,
        user.profile?.birthDate,
        user.profile?.birthPlace,
        selfieUrl,
        cniFrontUrl,
        cniBackUrl,
      ];

      const kycFieldsCompleted = kycFields.filter(Boolean).length;
      const kycFieldsTotal = kycFields.length;

      const subscriptionLabel =
        currentSubscription?.status === 'TRIALING'
          ? 'Essai gratuit'
          : currentSubscription?.status === 'ACTIVE'
            ? 'Abonnement actif'
            : currentSubscription?.status === 'PAYMENT_PENDING'
              ? 'Paiement en attente'
              : currentSubscription?.status === 'CANCELLED'
                ? 'Annulé'
                : 'Expiré';

      const subscriptionPrice = currentSubscription
        ? `${Number(currentSubscription.amount || 0).toLocaleString('fr-FR')} ${currentSubscription.currency}`
        : 'Aucun abonnement';

      return {
        id: user.id,
        fullName: `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || 'À compléter',
        phone: user.phone,
        birthDate: user.profile?.birthDate
          ? user.profile.birthDate.toISOString()
          : 'À compléter',
        birthPlace: user.profile?.birthPlace || 'À compléter',
        placeName: user.profile?.placeName || 'À compléter',
        district: user.profile?.district || 'À compléter',
        city: user.profile?.city || 'À compléter',
        country: user.profile?.country || 'À compléter',

        status: user.status === 'ACTIVE' ? 'Actif' : 'Inactif',

        kyc:
          user.kycProfile?.status === 'APPROVED'
            ? 'Validé'
            : user.kycProfile?.status === 'PENDING'
              ? 'En attente'
              : 'Incomplet',

        kycFieldsCompleted,
        kycFieldsTotal,

        kycFiles: {
          selfie: Boolean(selfieUrl),
          cniFront: Boolean(cniFrontUrl),
          cniBack: Boolean(cniBackUrl),
        },

        selfieUrl,
        cniFrontUrl,
        cniBackUrl,

        subscription: subscriptionLabel,
        subscriptionPrice,
        subscriptionStatus: currentSubscription?.status ?? null,
        subscriptionPlan: currentSubscription?.plan ?? null,
        subscriptionStartsAt: currentSubscription?.startsAt?.toISOString() ?? null,
        subscriptionEndsAt: currentSubscription?.endsAt?.toISOString() ?? null,
        subscriptionTrialEndsAt:
          currentSubscription?.trialEndsAt?.toISOString() ?? null,

        miniSite: user.miniSite?.slug || 'Inactif',
        wallet: `${Number(user.wallet?.availableBalance || 0).toLocaleString('fr-FR')} FCFA`,
      };
    });
  }

  async getUsersKpis() {
    const total = await prisma.user.count();

    const kycValidated = await prisma.user.count({
      where: {
        isKycVerified: true,
      },
    });

    const kycPending = total - kycValidated;

    const active = total;
    const inactive = 0;

    return {
      total,
      active,
      inactive,
      kycValidated,
      kycPending,
    };
  }

  async deleteUserPermanently(userId: string, superAdminToken?: string) {
    this.assertSuperAdminDeleteToken(superAdminToken);

    if (!userId?.trim()) {
      throw new BadRequestException('Identifiant utilisateur obligatoire.');
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        phone: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable.');
    }

    const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ');

    await prisma.$transaction(async (tx) => {
      await tx.coachConversation.deleteMany({
        where: {
          userId: user.id,
        },
      });

      await tx.auditLog.deleteMany({
        where: {
          userId: user.id,
        },
      });

      await tx.user.delete({
        where: {
          id: user.id,
        },
      });

      await tx.auditLog.create({
        data: {
          userId: null,
          action: 'SUPER_ADMIN_USER_PERMANENT_DELETE',
          entity: 'User',
          entityId: user.id,
          metadata: {
            deletedUserId: user.id,
            deletedUserPhone: user.phone,
            deletedUserName: fullName || null,
            deletedUserRole: user.role,
            deletedAt: new Date().toISOString(),
          },
        },
      });
    });

    return {
      deletedUserId: user.id,
      deletedUserPhone: user.phone,
      deletedUserName: fullName || null,
    };
  }
}