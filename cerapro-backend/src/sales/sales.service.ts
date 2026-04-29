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
  contactId?: string;
  items: CreateSaleItemInput[];
  note?: string;
};

type UpdateSalePaymentPayload = {
  amount: number;
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

      const unitPrice = item.unitPrice ?? recommendedPrice;

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
        paidAmount: 0,
        remainingAmount: totalAmount,
        note: payload.note,
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
      },
    });

    if (!sale) {
      return {
        success: false,
        message: 'Vente introuvable',
      };
    }

    return {
      success: true,
      data: sale,
    };
  }

  async updateSalePayment(id: string, payload: UpdateSalePaymentPayload) {
    const amount = Number(payload.amount || 0);

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

    if (sale.paymentStatus === 'CASH_PAID') {
  return {
    success: false,
    message: 'Cette vente est déjà totalement payée.',
  };
}

    const totalAmount = Number(sale.totalAmount || 0);
    const currentPaidAmount = Number(sale.paidAmount || 0);
    const newPaidAmount = currentPaidAmount + amount;

    if (newPaidAmount > totalAmount) {
      return {
        success: false,
        message: 'Le montant payé dépasse le montant total de la vente.',
      };
    }

    const remainingAmount = totalAmount - newPaidAmount;

    const paymentStatus =
      remainingAmount === 0 ? 'CASH_PAID' : 'PARTIALLY_PAID';

    const updatedSale = await this.prisma.sale.update({
      where: { id },
      data: {
        paidAmount: newPaidAmount,
        remainingAmount,
        paymentStatus,
      },
      include: {
        contact: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return {
      success: true,
      data: updatedSale,
    };
  }
}