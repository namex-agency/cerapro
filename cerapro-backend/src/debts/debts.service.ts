import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

type DebtStatusValue =
  | 'ONGOING'
  | 'PARTIALLY_PAID'
  | 'PAID'
  | 'DISPUTED';

type CreateDebtPayload = {
  productId?: string;
  creditorName: string;
  quantity?: number;
  amount?: number;
  paidAmount?: number;
  status?: DebtStatusValue;
  creditDate: string;
  dueDate?: string;
  note?: string;
};

@Injectable()
export class DebtsService {
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

  private parseDate(value?: string | null) {
    if (!value) return null;

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;

    return date;
  }

  async createDebt(userId: string, payload: CreateDebtPayload) {
    if (!userId) {
      return {
        success: false,
        message: 'Utilisateur obligatoire.',
      };
    }

    if (!payload.creditorName) {
      return {
        success: false,
        message: 'Le nom du créancier est obligatoire.',
      };
    }

    const creditDate = this.parseDate(payload.creditDate);

    if (!creditDate) {
      return {
        success: false,
        message: 'La date de prise du crédit est obligatoire.',
      };
    }

    let product: any = null;

    if (payload.productId) {
      product = await this.prisma.product.findUnique({
        where: { id: payload.productId },
      });

      if (!product) {
        return {
          success: false,
          message: 'Produit introuvable.',
        };
      }
    }

    const quantity = payload.quantity ?? 1;

    const amount =
      payload.amount ??
      (product ? Number(product.partnerPrice) * quantity : 0);

    const paidAmount = payload.paidAmount ?? 0;

    let status: DebtStatusValue = payload.status || 'ONGOING';

    if (paidAmount >= amount && amount > 0) {
      status = 'PAID';
    } else if (paidAmount > 0) {
      status = 'PARTIALLY_PAID';
    }

    const debt = await this.prisma.debt.create({
      data: {
        userId,
        productId: payload.productId || null,
        creditorName: payload.creditorName,
        quantity,
        amount,
        paidAmount,
        status,
        creditDate,
        dueDate: this.parseDate(payload.dueDate),
        note: payload.note?.trim() || null,
      },
      include: {
        product: true,
      },
    });

    return {
      success: true,
      data: debt,
    };
  }

  async getDebts(userId: string, filters?: any) {
    const where: any = {
      userId,
    };

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.productId) {
      where.productId = filters.productId;
    }

    if (filters?.creditorName) {
      where.creditorName = {
        contains: filters.creditorName,
        mode: 'insensitive',
      };
    }

    if (filters?.from || filters?.to) {
      where.creditDate = {};

      if (filters.from) {
        where.creditDate.gte = new Date(filters.from);
      }

      if (filters.to) {
        where.creditDate.lte = new Date(filters.to);
      }
    }

    if (filters?.overdue === true || filters?.overdue === 'true') {
  where.dueDate = {
    lt: new Date(),
  };

  where.status = {
    not: 'PAID',
  };
}

    const debts = await this.prisma.debt.findMany({
      where,
      include: {
        product: true,
      },
      orderBy: [
        {
          status: 'asc',
        },
        {
          dueDate: 'asc',
        },
        {
          createdAt: 'desc',
        },
      ],
    });

    return {
      success: true,
      data: debts,
    };
  }
}