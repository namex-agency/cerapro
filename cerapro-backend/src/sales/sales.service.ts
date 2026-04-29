import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

type CreateSaleItemInput = {
  productId: string;
  quantity: number;
  unitPrice?: number; // prix personnalisé
};

type CreateSalePayload = {
  contactId?: string;
  items: CreateSaleItemInput[];
  note?: string;
};

@Injectable()
export class SalesService {
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

  async createSale(userId: string, payload: CreateSalePayload) {
    if (!payload.items || payload.items.length === 0) {
      return {
        success: false,
        message: 'Aucun produit dans la vente.',
      };
    }

    let totalAmount = 0;
    let totalPv = 0;
    let totalMargin = 0;

    const itemsData: any[] = [];

    for (const item of payload.items) {
      if (item.quantity < 1) {
        return {
          success: false,
          message: 'La quantité doit être au moins 1.',
        };
      }

      const product = await this.prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        return {
          success: false,
          message: 'Produit introuvable.',
        };
      }

      const partnerPrice = Number(product.partnerPrice || 0);
      const recommendedPrice = Number(product.recommendedPrice || 0);
      const pv = Number(product.pv || 0);

      let unitPrice = item.unitPrice ?? recommendedPrice;

      // Règle métier : prix minimum
      if (unitPrice < partnerPrice) {
        return {
          success: false,
          message: `Prix inférieur au prix partenaire pour ${product.name}.`,
        };
      }

      const totalPrice = unitPrice * item.quantity;
      const itemPv = pv * item.quantity;
      const margin = (unitPrice - partnerPrice) * item.quantity;

      totalAmount += totalPrice;
      totalPv += itemPv;
      totalMargin += margin;

      itemsData.push({
        productId: product.id,
        quantity: item.quantity,
        unitPrice,
        partnerPrice,
        recommendedPrice,
        totalPrice,
        pv: itemPv,
        margin,
      });
    }

    const sale = await this.prisma.sale.create({
      data: {
        userId,
        contactId: payload.contactId,
        totalAmount,
        totalPv,
        margin: totalMargin,
        note: payload.note,
        items: {
          create: itemsData,
        },
      },
      include: {
        items: true,
      },
    });

    return {
      success: true,
      data: sale,
    };
  }
}