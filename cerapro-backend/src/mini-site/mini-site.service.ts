import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class MiniSiteService {

  // 🔹 Récupérer un mini-site public par son slug
  async getMiniSiteBySlug(slug: string) {
    const miniSite = await prisma.miniSite.findUnique({
      where: { slug },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!miniSite || !miniSite.isActive) {
      return {
        success: false,
        message: 'Mini-site introuvable ou inactif.',
      };
    }

    return {
      success: true,
      data: miniSite,
    };
  }

  // 🔹 Récupérer les produits actifs pour le mini-site
  async getPublicProducts() {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      success: true,
      data: products,
    };
  }
}