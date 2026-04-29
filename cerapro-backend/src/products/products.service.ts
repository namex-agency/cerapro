import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

type CreateProductPayload = {
  name: string;
  slug?: string;
  description?: string;
  imageUrl?: string;
  partnerPrice?: number;
  recommendedPrice?: number;
  pv?: number;
  referralCommission?: number;
  isActive?: boolean;
};

@Injectable()
export class ProductsService {
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

  private buildSlug(value: string) {
    return value
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  async createProduct(payload: CreateProductPayload) {
    const name = payload.name?.trim();

    if (!name) {
      return {
        success: false,
        message: 'Le nom du produit est obligatoire.',
      };
    }

    const slug = payload.slug?.trim() || this.buildSlug(name);

    const existingProduct = await this.prisma.product.findFirst({
      where: {
        slug,
      },
    });

    if (existingProduct) {
      return {
        success: false,
        message: 'Un produit avec ce slug existe déjà.',
        product: existingProduct,
      };
    }

    const product = await this.prisma.product.create({
      data: {
        name,
        slug,
        description: payload.description?.trim() ?? null,
        imageUrl: payload.imageUrl?.trim() ?? null,
        partnerPrice: payload.partnerPrice ?? 0,
        recommendedPrice: payload.recommendedPrice ?? 0,
        pv: payload.pv ?? 0,
        referralCommission: payload.referralCommission ?? 0,
        isActive: payload.isActive ?? true,
      } as any,
    });

    return {
      success: true,
      product,
    };
  }

  async getProducts(search?: string) {
    const query = search?.trim();

    const products = await this.prisma.product.findMany({
      where: {
        isActive: true,
        ...(query
          ? {
              OR: [
                {
                  name: {
                    contains: query,
                    mode: 'insensitive',
                  },
                },
                {
                  description: {
                    contains: query,
                    mode: 'insensitive',
                  },
                },
              ],
            }
          : {}),
      } as any,
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      success: true,
      products,
    };
  }

  async getProductById(id: string) {
    const product = await this.prisma.product.findFirst({
      where: {
        id,
        isActive: true,
      },
      include: {
        category: true,
      },
    });

    if (!product) {
      return {
        success: false,
        message: 'Produit introuvable.',
      };
    }

    return {
      success: true,
      product,
    };
  }
}