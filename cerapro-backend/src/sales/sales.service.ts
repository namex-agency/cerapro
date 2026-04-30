import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

type CreateSaleItemInput = {
  productId: string;
  quantity: number;
  unitPrice?: number;
};

type CreateSalePayload = {
  contactId?: string | null;
  items: CreateSaleItemInput[];
  note?: string;
};

type UpdateSalePaymentPayload = {
  amount: number;
  method?: string;
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

  private toNumber(value: any): number {
    if (value === null || value === undefined) return 0;

    const numberValue = Number(value);

    if (Number.isNaN(numberValue)) return 0;

    return numberValue;
  }

  async createSale(userId: string, payload: CreateSalePayload) {
    if (!userId) {
      return {
        success: false,
        message: 'Utilisateur obligatoire.',
      };
    }

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
      if (!item.productId) {
        return {
          success: false,
          message: 'Produit obligatoire dans la vente.',
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
        where: { id: item.productId },
      });

      if (!product) {
        return {
          success: false,
          message: 'Produit introuvable.',
        };
      }

      const partnerPrice = this.toNumber(product.partnerPrice);
      const recommendedPrice = this.toNumber(product.recommendedPrice);
      const pv = this.toNumber(product.pv);

      const unitPrice = item.unitPrice
        ? this.toNumber(item.unitPrice)
        : recommendedPrice;

      if (unitPrice < partnerPrice) {
        return {
          success: false,
          message: `Prix inférieur au prix partenaire pour ${product.name}.`,
        };
      }

      const totalPrice = unitPrice * quantity;
      const itemPv = pv * quantity;
      const margin = (unitPrice - partnerPrice) * quantity;

      totalAmount += totalPrice;
      totalPv += itemPv;
      totalMargin += margin;

      itemsData.push({
        productId: product.id,
        quantity,
        unitPrice,
        partnerPrice,
        recommendedPrice,
        totalPrice,
        pv: itemPv,
        margin,
      });
    }

    const paymentStatus = totalAmount === 0 ? 'CASH_PAID' : 'UNPAID';

const sale = await this.prisma.sale.create({
  data: {
    userId,
    contactId: payload.contactId || null,
    status: 'PENDING',
    paymentStatus,
    totalAmount,
        totalPv,
        margin: totalMargin,
        paidAmount: 0,
        remainingAmount: totalAmount,
        note: payload.note?.trim() || null,
        items: {
          create: itemsData,
        },
      },
      include: {
        contact: true,
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
      data: sale,
    };
  }

  async getAllSales() {
    const sales = await this.prisma.sale.findMany({
      include: {
        contact: true,
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
      data: sales,
    };
  }

  async getSaleById(id: string) {
    const sale = await this.prisma.sale.findUnique({
      where: { id },
      include: {
        contact: true,
        items: {
          include: {
            product: true,
          },
        },
        payments: true,
      },
    });

    if (!sale) {
      return {
        success: false,
        message: 'Vente introuvable.',
      };
    }

    return {
      success: true,
      data: sale,
    };
  }

  async updateSalePayment(id: string, payload: UpdateSalePaymentPayload) {
    const amount = this.toNumber(payload.amount);

    if (amount <= 0) {
      return {
        success: false,
        message: 'Le montant payé doit être supérieur à 0.',
      };
    }

    const sale = await this.prisma.sale.findUnique({
      where: { id },
    });

    if (!sale) {
      return {
        success: false,
        message: 'Vente introuvable.',
      };
    }

    const totalAmount = this.toNumber(sale.totalAmount);
    const currentPaidAmount = this.toNumber(sale.paidAmount);
    const currentRemainingAmount = Math.max(0, totalAmount - currentPaidAmount);

    if (currentRemainingAmount <= 0 || sale.paymentStatus === 'CASH_PAID') {
      return {
        success: false,
        message: 'Cette vente est déjà totalement payée.',
      };
    }

    const newPaidAmount = currentPaidAmount + amount;

    if (newPaidAmount > totalAmount) {
      return {
        success: false,
        message: 'Le montant payé dépasse le montant total de la vente.',
      };
    }

    const remainingAmount = Math.max(0, totalAmount - newPaidAmount);

    const paymentStatus =
      remainingAmount === 0 ? 'CASH_PAID' : 'PARTIALLY_PAID';

    const updatedSale = await this.prisma.sale.update({
      where: { id },
      data: {
        paidAmount: newPaidAmount,
        remainingAmount,
        paymentStatus,
        payments: {
          create: {
            amount,
            method: payload.method?.trim() || 'CASH',
            note: payload.note?.trim() || null,
          },
        },
      },
      include: {
        contact: true,
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
      data: updatedSale,
    };
  }
}