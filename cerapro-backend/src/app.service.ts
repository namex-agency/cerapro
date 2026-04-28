import 'dotenv/config';
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

const DEFAULT_USER_PHONE = '+237600000000';

@Injectable()
export class AppService {
  private async getDefaultUser() {
    return prisma.user.upsert({
      where: {
        phone: DEFAULT_USER_PHONE,
      },
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

    return prisma.notification.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async markNotificationAsRead(id: string) {
    const user = await this.getDefaultUser();

    try {
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
        where: {
          id: notification.id,
        },
        data: {
          read: true,
        },
      });

      return {
        success: true,
        notification: updatedNotification,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Erreur serveur',
      };
    }
  }
}