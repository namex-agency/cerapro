import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class AccountingService {
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

  private isPaidSale(sale: any): boolean {
    return sale.paymentStatus === 'CASH_PAID';
  }

  async getFinancialSummary(userId: string) {
    if (!userId) {
      return {
        success: false,
        message: 'Utilisateur obligatoire.',
      };
    }

    const sales = await this.prisma.sale.findMany({
      where: {
        userId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        payments: true,
      },
    });

    const debts = await this.prisma.debt.findMany({
      where: {
        userId,
      },
    });

    let chiffreAffaires = 0;
    let totalEncaisse = 0;
    let totalARecevoir = 0;
    let totalDettesFournisseur = 0;
    let coutPartenaire = 0;
    let margeBrute = 0;
    const commissionEstimee = 0;
    let totalCreditClient = 0;

    for (const sale of sales as any[]) {
      const totalAmount = this.toNumber(sale.totalAmount);
      const paidAmount = Math.min(this.toNumber(sale.paidAmount), totalAmount);
      const remainingAmount = Math.max(0, totalAmount - paidAmount);

      const salePartnerCost = (sale.items || []).reduce(
        (sum: number, item: any) => {
          const itemPartnerPrice = this.toNumber(
            item.partnerPrice ?? item.product?.partnerPrice,
          );

          const quantity = this.toNumber(item.quantity || 1);

          return sum + itemPartnerPrice * quantity;
        },
        0,
      );

      const saleMargin = (sale.items || []).reduce(
        (sum: number, item: any) => sum + this.toNumber(item.margin),
        0,
      );

      if (this.isPaidSale(sale)) {
        chiffreAffaires += totalAmount;
      }

      totalEncaisse += paidAmount;
      totalARecevoir += remainingAmount;
      coutPartenaire += salePartnerCost;
      margeBrute += saleMargin;

      if (remainingAmount > 0) {
        totalCreditClient += remainingAmount;
      }
    }

    for (const debt of debts as any[]) {
      const amount = this.toNumber(debt.amount);
      const paidAmount = Math.min(this.toNumber(debt.paidAmount), amount);
      const remainingAmount = Math.max(0, amount - paidAmount);

      if (debt.status !== 'PAID') {
        totalDettesFournisseur += remainingAmount;
      }
    }

    return {
      success: true,
      data: {
        chiffreAffaires,
        totalEncaisse,
        totalARecevoir,
        totalDettesFournisseur,
        coutPartenaire,
        margeBrute,
        commissionEstimee,
        totalCreditClient,
      },
    };
  }
}