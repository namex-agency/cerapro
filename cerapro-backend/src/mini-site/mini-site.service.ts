import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

type CreateMiniSitePayload = {
  userId: string;
  slug: string;
  title?: string;
  bio?: string;
  isActive?: boolean;
};

type UpdateMiniSitePayload = {
  title?: string;
  bio?: string;
  isActive?: boolean;
};

type CreateMiniSiteOrderItemPayload = {
  productId: string;
  quantity: number;
};

type CreateMiniSiteOrderPayload = {
  customer: {
    fullName: string;
    phone?: string;
    email?: string;
    city?: string;
    country?: string;
  };
  items: CreateMiniSiteOrderItemPayload[];
};

@Injectable()
export class MiniSiteService {
  private prisma: PrismaClient;

  constructor() {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    const adapter = new PrismaPg(pool);

    this.prisma = new PrismaClient({
      adapter,
    });
  }

  private toNumber(value: any): number {
    if (value === null || value === undefined) return 0;

    const numberValue = Number(value);

    if (Number.isNaN(numberValue)) return 0;

    return numberValue;
  }

  private normalizeSlug(value: string): string {
    return value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  async createMiniSite(payload: CreateMiniSitePayload) {
    if (!payload.userId?.trim()) {
      return {
        success: false,
        message: 'Utilisateur obligatoire.',
      };
    }

    if (!payload.slug?.trim()) {
      return {
        success: false,
        message: 'Slug obligatoire.',
      };
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.userId,
      },
    });

    if (!user) {
      return {
        success: false,
        message: 'Utilisateur introuvable.',
      };
    }

    const existingMiniSiteForUser = await this.prisma.miniSite.findUnique({
      where: {
        userId: payload.userId,
      },
    });

    if (existingMiniSiteForUser) {
      return {
        success: false,
        message: 'Cet utilisateur possède déjà un mini-site.',
      };
    }

    const slug = this.normalizeSlug(payload.slug);

    const existingSlug = await this.prisma.miniSite.findUnique({
      where: {
        slug,
      },
    });

    if (existingSlug) {
      return {
        success: false,
        message: 'Ce slug est déjà utilisé.',
      };
    }

    const miniSite = await this.prisma.miniSite.create({
      data: {
        userId: payload.userId,
        slug,
        title: payload.title?.trim() || null,
        bio: payload.bio?.trim() || null,
        isActive: payload.isActive ?? true,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
      },
    });

    return {
      success: true,
      data: miniSite,
    };
  }

  async getMiniSiteBySlug(slug: string) {
    if (!slug?.trim()) {
      return {
        success: false,
        message: 'Slug obligatoire.',
      };
    }

    const miniSite = await this.prisma.miniSite.findUnique({
      where: {
        slug: this.normalizeSlug(slug),
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
            email: true,
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

  async updateMiniSite(userId: string, payload: UpdateMiniSitePayload) {
    if (!userId?.trim()) {
      return {
        success: false,
        message: 'Utilisateur obligatoire.',
      };
    }

    const miniSite = await this.prisma.miniSite.findUnique({
      where: {
        userId,
      },
    });

    if (!miniSite) {
      return {
        success: false,
        message: 'Mini-site introuvable.',
      };
    }

    const updatedMiniSite = await this.prisma.miniSite.update({
      where: {
        userId,
      },
      data: {
        title: payload.title?.trim() ?? miniSite.title,
        bio: payload.bio?.trim() ?? miniSite.bio,
        isActive:
          typeof payload.isActive === 'boolean'
            ? payload.isActive
            : miniSite.isActive,
      },
    });

    return {
      success: true,
      data: updatedMiniSite,
    };
  }

  async getPublicProducts() {
    const products = await this.prisma.product.findMany({
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

  async createOrderFromMiniSite(slug: string, payload: CreateMiniSiteOrderPayload) {
    if (!slug?.trim()) {
      return {
        success: false,
        message: 'Slug mini-site obligatoire.',
      };
    }

    if (!payload.customer?.fullName?.trim()) {
      return {
        success: false,
        message: 'Nom du client obligatoire.',
      };
    }

    if (!payload.items || payload.items.length === 0) {
      return {
        success: false,
        message: 'Panier vide.',
      };
    }

    const miniSite = await this.prisma.miniSite.findUnique({
      where: {
        slug: this.normalizeSlug(slug),
      },
    });

    if (!miniSite || !miniSite.isActive) {
      return {
        success: false,
        message: 'Mini-site introuvable ou inactif.',
      };
    }

    let totalAmount = 0;
    let totalPv = 0;

    const orderItemsData: any[] = [];

    for (const item of payload.items) {
      if (!item.productId?.trim()) {
        return {
          success: false,
          message: 'Produit obligatoire.',
        };
      }

      const quantity = this.toNumber(item.quantity);

      if (quantity < 1) {
        return {
          success: false,
          message: 'La quantité doit être au moins 1.',
        };
      }

      const product = await this.prisma.product.findUnique({
        where: {
          id: item.productId,
        },
      });

      if (!product || !product.isActive) {
        return {
          success: false,
          message: 'Produit introuvable ou inactif.',
        };
      }

      const unitPrice = this.toNumber(product.recommendedPrice);
      const totalPrice = unitPrice * quantity;
      const itemPv = this.toNumber(product.pv) * quantity;

      totalAmount += totalPrice;
      totalPv += itemPv;

      orderItemsData.push({
        productId: product.id,
        quantity,
        unitPrice,
        totalPrice,
        pv: itemPv,
      });
    }

    const customer = await this.prisma.customer.create({
      data: {
        fullName: payload.customer.fullName.trim(),
        phone: payload.customer.phone?.trim() || null,
        email: payload.customer.email?.trim() || null,
        city: payload.customer.city?.trim() || null,
        country: payload.customer.country?.trim() || 'Cameroun',
      },
    });

    const order = await this.prisma.order.create({
      data: {
        ownerUserId: miniSite.userId,
        miniSiteId: miniSite.id,
        customerId: customer.id,
        status: 'PENDING',
        totalAmount,
        totalPv,
        items: {
          create: orderItemsData,
        },
      },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
        miniSite: true,
        customer: true,
        items: {
          include: {
            product: true,
          },
        },
        payments: true,
      },
    });

    return {
      success: true,
      data: order,
    };
  }

  async getOrdersByOwner(userId: string) {
    if (!userId?.trim()) {
      return {
        success: false,
        message: 'Utilisateur obligatoire.',
      };
    }

    const orders = await this.prisma.order.findMany({
      where: {
        ownerUserId: userId,
      },
      include: {
        customer: true,
        miniSite: true,
        items: {
          include: {
            product: true,
          },
        },
        payments: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      success: true,
      data: orders,
    };
  }
}