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

@Injectable()
export class AdminService {
  // Créer notification
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

  // 👤 Liste utilisateurs
  async getUsers() {
    return prisma.user.findMany({
      orderBy: {
        id: 'desc',
      },
    });
  }

  // KPI UTILISATEURS (VERSION PRO OPTIMISÉE)
  async getUsersKpis() {
    const total = await prisma.user.count();

    const kycValidated = await prisma.user.count({
      where: {
        isKycVerified: true,
      },
    });

    const kycPending = total - kycValidated;

    // TEMPORAIRE (tant que tu n’as pas de champ activity/status)
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
}