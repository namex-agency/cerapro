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
    return (
      sale.paymentStatus === 'PAID' ||
      sale.paymentStatus === 'PAYE_COMPTANT' ||
      sale.paymentStatus === 'PAID_CASH' ||
      sale.status === 'PAID' ||
      sale.status === 'SOLD'
    );
  }

  private isPartiallyPaidSale(sale: any): boolean {
    return (
      sale.paymentStatus === 'PARTIALLY_PAID' ||
      sale.paymentStatus === 'PAYE_PARTIELLEMENT' ||
      sale.status === 'PARTIALLY_PAID'
    );
  }

  private getSaleTotalAmount(sale: any): number {
    return this.toNumber(
      sale.totalAmount ??
        sale.amount ??
        sale.total ??
        sale.priceTotal ??
        sale.finalAmount ??
        sale.totalPrice,
    );
  }

  private getSalePaidAmount(sale: any): number {
    if (this.isPaidSale(sale)) {
      return this.getSaleTotalAmount(sale);
    }

    if (this.isPartiallyPaidSale(sale)) {
      return this.toNumber(
        sale.paidAmount ??
          sale.amountPaid ??
          sale.receivedAmount ??
          sale.paid,
      );
    }

    return this.toNumber(
      sale.paidAmount ??
        sale.amountPaid ??
        sale.receivedAmount ??
        sale.paid,
    );
  }

  private getPartnerCost(sale: any, productById: Map<string, any>): number {
    const quantity = this.toNumber(sale.quantity || 1);

    const productId = sale.productId;
    const product = productId ? productById.get(productId) : null;

    const partnerUnitPrice = this.toNumber(
      sale.partnerPrice ??
        sale.costPrice ??
        sale.partnerUnitPrice ??
        product?.partnerPrice,
    );

    return partnerUnitPrice * quantity;
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
    });

    const productIds = [
      ...new Set(
        (sales as any[])
          .map((sale) => sale.productId)
          .filter((productId) => Boolean(productId)),
      ),
    ];

    const products = productIds.length
      ? await this.prisma.product.findMany({
          where: {
            id: {
              in: productIds,
            },
          },
        })
      : [];

    const productById = new Map(
      (products as any[]).map((product) => [product.id, product]),
    );

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
    let commissionEstimee = 0;
    let totalCreditClient = 0;

    for (const sale of sales as any[]) {
      const totalAmount = this.getSaleTotalAmount(sale);
      const paidAmount = Math.min(this.getSalePaidAmount(sale), totalAmount);
      const remainingAmount = Math.max(0, totalAmount - paidAmount);
      const partnerCost = this.getPartnerCost(sale, productById);

      if (this.isPaidSale(sale)) {
        chiffreAffaires += totalAmount;
      }

      totalEncaisse += paidAmount;
      totalARecevoir += remainingAmount;
      coutPartenaire += partnerCost;
      margeBrute += totalAmount - partnerCost;

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