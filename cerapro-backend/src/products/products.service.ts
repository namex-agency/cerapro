import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

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