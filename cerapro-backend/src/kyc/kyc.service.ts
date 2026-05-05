import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { KycStatus } from '@prisma/client';

import { PrismaService } from '../prisma.service';

type UpdateKycPayload = {
  fullName?: string;
  phone?: string;
  birthDate?: string;
  birthPlace?: string;
  placeName?: string;
  district?: string;
  city?: string;
  country?: string;
  selfieUrl?: string;
  cniFrontUrl?: string;
  cniBackUrl?: string;
};

@Injectable()
export class KycService {
  constructor(private readonly prisma: PrismaService) {}

  async getMyKyc(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        kycProfile: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable.');
    }

    return {
      fullName: `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim(),
      phone: user.phone,
      country: user.profile?.country ?? 'Cameroun',
      city: user.profile?.city ?? '',
      district: user.profile?.district ?? '',
      placeName: user.profile?.placeName ?? '',
      birthDate: user.profile?.birthDate ?? null,
      birthPlace: user.profile?.birthPlace ?? '',
      isKycVerified: user.isKycVerified,
      kycStatus: user.kycProfile?.status ?? KycStatus.NOT_STARTED,
      selfieUrl: user.kycProfile?.selfieUrl ?? null,
      cniFrontUrl: user.kycProfile?.cniFrontUrl ?? null,
      cniBackUrl: user.kycProfile?.cniBackUrl ?? null,
      submittedAt: user.kycProfile?.submittedAt ?? null,
      rejectionReason: user.kycProfile?.rejectionReason ?? null,
    };
  }

  async updateMyKyc(userId: string, payload: UpdateKycPayload) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable.');
    }

    if (!payload.country?.trim()) {
      throw new BadRequestException('Le pays est obligatoire.');
    }

    const birthDate = payload.birthDate?.trim()
      ? new Date(payload.birthDate)
      : null;

    if (birthDate && Number.isNaN(birthDate.getTime())) {
      throw new BadRequestException('Date de naissance invalide.');
    }

    const profile = await this.prisma.userProfile.upsert({
      where: { userId },
      update: {
        country: payload.country.trim(),
        city: payload.city?.trim() || null,
        district: payload.district?.trim() || null,
        placeName: payload.placeName?.trim() || null,
        birthDate,
        birthPlace: payload.birthPlace?.trim() || null,
      },
      create: {
        userId,
        country: payload.country.trim(),
        city: payload.city?.trim() || null,
        district: payload.district?.trim() || null,
        placeName: payload.placeName?.trim() || null,
        birthDate,
        birthPlace: payload.birthPlace?.trim() || null,
      },
    });

    const kycProfile = await this.prisma.kycProfile.upsert({
      where: { userId },
      update: {
        status: KycStatus.PENDING,
        selfieUrl: payload.selfieUrl?.trim() || null,
        cniFrontUrl: payload.cniFrontUrl?.trim() || null,
        cniBackUrl: payload.cniBackUrl?.trim() || null,
        submittedAt: new Date(),
        rejectionReason: null,
      },
      create: {
        userId,
        status: KycStatus.PENDING,
        selfieUrl: payload.selfieUrl?.trim() || null,
        cniFrontUrl: payload.cniFrontUrl?.trim() || null,
        cniBackUrl: payload.cniBackUrl?.trim() || null,
        submittedAt: new Date(),
      },
    });

    return {
      success: true,
      message: 'KYC soumis avec succès.',
      profile,
      kycProfile,
    };
  }

  async getAdminKycProfiles() {
    const kycProfiles = await this.prisma.kycProfile.findMany({
      orderBy: {
        submittedAt: 'desc',
      },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
    });

    return kycProfiles.map((kycProfile) => ({
      id: kycProfile.id,
      userId: kycProfile.userId,
      status: kycProfile.status,
      submittedAt: kycProfile.submittedAt,
      reviewedAt: kycProfile.reviewedAt,
      rejectionReason: kycProfile.rejectionReason,
      selfieUrl: kycProfile.selfieUrl,
      cniFrontUrl: kycProfile.cniFrontUrl,
      cniBackUrl: kycProfile.cniBackUrl,
      user: {
        id: kycProfile.user.id,
        fullName:
          `${kycProfile.user.firstName ?? ''} ${kycProfile.user.lastName ?? ''}`.trim() ||
          'À compléter',
        phone: kycProfile.user.phone,
        country: kycProfile.user.profile?.country ?? 'À compléter',
        city: kycProfile.user.profile?.city ?? 'À compléter',
        district: kycProfile.user.profile?.district ?? 'À compléter',
        placeName: kycProfile.user.profile?.placeName ?? 'À compléter',
        birthDate: kycProfile.user.profile?.birthDate ?? null,
        birthPlace: kycProfile.user.profile?.birthPlace ?? 'À compléter',
      },
    }));
  }

  async approveKyc(userId: string) {
    const kycProfile = await this.prisma.kycProfile.findUnique({
      where: { userId },
    });

    if (!kycProfile) {
      throw new NotFoundException('Dossier KYC introuvable.');
    }

    const updated = await this.prisma.kycProfile.update({
      where: { userId },
      data: {
        status: KycStatus.APPROVED,
        reviewedAt: new Date(),
        rejectionReason: null,
      },
    });

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        isKycVerified: true,
      },
    });

    return {
      success: true,
      message: 'KYC validé avec succès.',
      data: updated,
    };
  }

  async rejectKyc(userId: string, reason: string) {
    if (!reason || !reason.trim()) {
      throw new BadRequestException('Le motif de rejet est obligatoire.');
    }

    const kycProfile = await this.prisma.kycProfile.findUnique({
      where: { userId },
    });

    if (!kycProfile) {
      throw new NotFoundException('Dossier KYC introuvable.');
    }

    const updated = await this.prisma.kycProfile.update({
      where: { userId },
      data: {
        status: KycStatus.REJECTED,
        reviewedAt: new Date(),
        rejectionReason: reason.trim(),
      },
    });

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        isKycVerified: false,
      },
    });

    return {
      success: true,
      message: 'KYC rejeté avec succès.',
      data: updated,
    };
  }
}