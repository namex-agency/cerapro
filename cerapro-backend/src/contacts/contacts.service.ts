import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const DEFAULT_USER_PHONE = '+237600000000';

type ContactTypeValue = 'CONTACT' | 'PROSPECT' | 'CONSUMER' | 'DOWNLINE';
type ContactStatusValue = 'ACTIVE' | 'INACTIVE';

type CreateContactPayload = {
  firstName?: string;
  lastName?: string;
  fullName?: string;
  phone: string;
  type?: ContactTypeValue;
  status?: ContactStatusValue;
  note?: string;
  notes?: string;
};

type UpdateContactPayload = Partial<CreateContactPayload>;

@Injectable()
export class ContactsService {
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

  private async getDefaultUser() {
    return this.prisma.user.upsert({
      where: {
        phone: DEFAULT_USER_PHONE,
      },
      update: {},
      create: {
        phone: DEFAULT_USER_PHONE,
        firstName: 'Eric',
        lastName: 'Namo',
        email: 'eric.namo@cerapro.local',
        isKycVerified: false,
      },
    });
  }

  private normalizeName(payload: Partial<CreateContactPayload>) {
    const firstName = payload.firstName?.trim() ?? '';
    const lastName = payload.lastName?.trim() ?? '';
    const fullName = payload.fullName?.trim() ?? '';

    if (firstName || lastName) {
      return { firstName, lastName };
    }

    if (fullName) {
      const parts = fullName.split(' ').filter(Boolean);

      return {
        firstName: parts[0] ?? '',
        lastName: parts.slice(1).join(' '),
      };
    }

    return { firstName: '', lastName: '' };
  }

  async createContact(payload: CreateContactPayload) {
    const user = await this.getDefaultUser();

    const phone = payload.phone?.trim();
    const { firstName, lastName } = this.normalizeName(payload);
    const notes = payload.notes ?? payload.note ?? null;
    const type = payload.type ?? 'CONTACT';
    const status = payload.status ?? 'ACTIVE';

    if (!phone) {
      return {
        success: false,
        message: 'Le numéro de téléphone est obligatoire.',
      };
    }

    if (!firstName && !lastName) {
      return {
        success: false,
        message: 'Le nom du contact est obligatoire.',
      };
    }

    const existingContact = await this.prisma.contact.findFirst({
      where: {
        userId: user.id,
        phone,
      },
    });

    if (existingContact) {
      return {
        success: false,
        message: 'Ce contact existe déjà dans votre CRM.',
        contact: existingContact,
      };
    }

    const createData = {
      userId: user.id,
      firstName,
      lastName,
      phone,
      type,
      status,
      notes,
    };

    console.log('CREATE CONTACT DATA:', createData);

    const contact = await this.prisma.contact.create({
      data: createData as any,
    });

    return {
      success: true,
      contact,
    };
  }

  async getContacts(search?: string) {
    const user = await this.getDefaultUser();
    const query = search?.trim();

    const contacts = await this.prisma.contact.findMany({
      where: {
        userId: user.id,
        ...(query
          ? {
              OR: [
                { firstName: { contains: query, mode: 'insensitive' } },
                { lastName: { contains: query, mode: 'insensitive' } },
                { phone: { contains: query, mode: 'insensitive' } },
                { notes: { contains: query, mode: 'insensitive' } },
              ],
            }
          : {}),
      } as any,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      success: true,
      contacts,
    };
  }

  async getContactById(id: string) {
    const user = await this.getDefaultUser();

    const contact = await this.prisma.contact.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!contact) {
      return {
        success: false,
        message: 'Contact introuvable.',
      };
    }

    return {
      success: true,
      contact,
      summary: {
        totalRevenue: 0,
        totalPv: 0,
        totalSales: 0,
        plannedActions: 0,
        completedActions: 0,
      },
    };
  }

  async updateContact(id: string, payload: UpdateContactPayload) {
    const user = await this.getDefaultUser();

    const contact = (await this.prisma.contact.findFirst({
      where: {
        id,
        userId: user.id,
      },
    })) as any;

    if (!contact) {
      return {
        success: false,
        message: 'Contact introuvable.',
      };
    }

    const normalizedName = this.normalizeName({
      firstName: payload.firstName ?? contact.firstName ?? '',
      lastName: payload.lastName ?? contact.lastName ?? '',
      fullName: payload.fullName,
    });

    const updatedContact = await this.prisma.contact.update({
      where: {
        id: contact.id,
      },
      data: {
        firstName: normalizedName.firstName,
        lastName: normalizedName.lastName,
        phone: payload.phone?.trim() ?? contact.phone,
        type: payload.type ?? contact.type,
        status: payload.status ?? contact.status,
        notes: payload.notes ?? payload.note ?? contact.notes,
      } as any,
    });

    return {
      success: true,
      contact: updatedContact,
    };
  }
}