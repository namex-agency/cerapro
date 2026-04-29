import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const DEFAULT_USER_PHONE = '+237600000000';

@Injectable()
export class AppService {
  private async getDefaultUser() {
    return prisma.user.upsert({
      where: { phone: DEFAULT_USER_PHONE },
      update: {},
      create: {
        phone: DEFAULT_USER_PHONE,
        firstName: 'Eric',
        lastName: 'Namo',
        email: 'eric.namo@cerapro.local',
        isKycVerified: false,
      },
    });
  }

  async getMe() {
    const user = await this.getDefaultUser();

    const notificationsUnread = await prisma.notification.count({
      where: {
        userId: user.id,
        read: false,
      },
    });

    return {
      id: user.id,
      fullName: `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim(),
      phone: user.phone,
      country: 'Cameroun',
      city: 'Yaoundé',
      district: 'Bastos',
      kycCompleted: user.isKycVerified,
      subscription: {
        status: 'ACTIVE',
        expiresAt: '2026-12-31',
      },
      notificationsUnread,
    };
  }

  async getNotifications() {
    const user = await this.getDefaultUser();

    const existingNotifications = await prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    if (existingNotifications.length > 0) {
      return existingNotifications;
    }

    await prisma.notification.createMany({
      data: [
        {
          userId: user.id,
          title: 'Bienvenue sur CERAPRO',
          message: 'Votre espace Longricheur est prêt.',
          time: 'Maintenant',
          read: false,
        },
        {
          userId: user.id,
          title: 'KYC en attente',
          message:
            'Complétez votre vérification pour activer toutes les fonctionnalités.',
          time: 'Aujourd’hui',
          read: false,
        },
        {
          userId: user.id,
          title: 'Mini-site disponible',
          message: 'Votre mini-site personnel CERAPRO sera bientôt connecté.',
          time: 'Aujourd’hui',
          read: false,
        },
      ],
    });

    return prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markNotificationAsRead(id: string) {
    const user = await this.getDefaultUser();

    const notification = await prisma.notification.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!notification) {
      return {
        success: false,
        message: 'Notification introuvable',
      };
    }

    const updatedNotification = await prisma.notification.update({
      where: { id: notification.id },
      data: { read: true },
    });

    return {
      success: true,
      notification: updatedNotification,
    };
  }
}