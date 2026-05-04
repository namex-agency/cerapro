import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from './prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
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

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable.');
    }

    const notificationsUnread = await this.prisma.notification.count({
      where: {
        userId,
        read: false,
      },
    });

    const currentSubscription = user.subscriptions[0] ?? null;

    return {
      id: user.id,
      phone: user.phone,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim(),
      role: user.role,
      status: user.status,
      isKycVerified: user.isKycVerified,
      kycStatus: user.kycProfile?.status ?? 'NOT_STARTED',
      profile: user.profile,
      wallet: user.wallet,
      miniSite: user.miniSite,
      subscription: currentSubscription,
      notificationsUnread,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async getNotifications(userId: string) {
    return this.prisma.notification.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async markNotificationAsRead(userId: string, id: string) {
    const notification = await this.prisma.notification.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!notification) {
      throw new NotFoundException('Notification introuvable.');
    }

    const updatedNotification = await this.prisma.notification.update({
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
  }
}