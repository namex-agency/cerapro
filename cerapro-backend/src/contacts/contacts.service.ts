import { BadRequestException, Injectable } from '@nestjs/common';
import { ContactStatus, ContactType } from '@prisma/client';

import { PrismaService } from '../prisma.service';

type CreateContactPayload = {
  userId: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  phone: string;
  type?: ContactType;
  status?: ContactStatus;
  note?: string;
  notes?: string;
};

type UpdateContactPayload = Partial<Omit<CreateContactPayload, 'userId'>>;

@Injectable()
export class ContactsService {
  constructor(private readonly prisma: PrismaService) {}

  private buildFullName(payload: Partial<CreateContactPayload>) {
    const firstName = payload.firstName?.trim() ?? '';
    const lastName = payload.lastName?.trim() ?? '';
    const fullName = payload.fullName?.trim() ?? '';

    if (fullName) return fullName;

    return `${firstName} ${lastName}`.trim();
  }

  async createContact(payload: CreateContactPayload) {
    const phone = payload.phone?.trim();
    const fullName = this.buildFullName(payload);
    const notes = payload.notes ?? payload.note ?? null;
    const type = payload.type ?? ContactType.CONTACT;
    const status = payload.status ?? ContactStatus.ACTIVE;

    if (!payload.userId) {
      throw new BadRequestException('Utilisateur non authentifié.');
    }

    if (!phone) {
      throw new BadRequestException('Le numéro de téléphone est obligatoire.');
    }

    if (!fullName) {
      throw new BadRequestException('Le nom du contact est obligatoire.');
    }

    const existingContact = await this.prisma.contact.findFirst({
      where: {
        userId: payload.userId,
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

    const contact = await this.prisma.contact.create({
      data: {
        userId: payload.userId,
        fullName,
        phone,
        type,
        status,
        notes,
      },
    });

    return {
      success: true,
      contact,
    };
  }

  async getContacts(userId: string, search?: string) {
    if (!userId) {
      throw new BadRequestException('Utilisateur non authentifié.');
    }

    const query = search?.trim();

    const contacts = await this.prisma.contact.findMany({
      where: {
        userId,
        ...(query
          ? {
              OR: [
                { fullName: { contains: query, mode: 'insensitive' } },
                { phone: { contains: query, mode: 'insensitive' } },
                { notes: { contains: query, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      success: true,
      contacts,
    };
  }

  async getContactById(userId: string, id: string) {
    if (!userId) {
      throw new BadRequestException('Utilisateur non authentifié.');
    }

    const contact = await this.prisma.contact.findFirst({
      where: {
        id,
        userId,
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

  async updateContact(userId: string, id: string, payload: UpdateContactPayload) {
    if (!userId) {
      throw new BadRequestException('Utilisateur non authentifié.');
    }

    const contact = await this.prisma.contact.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!contact) {
      return {
        success: false,
        message: 'Contact introuvable.',
      };
    }

    const fullName = this.buildFullName({
      firstName: payload.firstName,
      lastName: payload.lastName,
      fullName: payload.fullName ?? contact.fullName,
    });

    const updatedContact = await this.prisma.contact.update({
      where: {
        id: contact.id,
      },
      data: {
        fullName,
        phone: payload.phone?.trim() ?? contact.phone,
        type: payload.type ?? contact.type,
        status: payload.status ?? contact.status,
        notes: payload.notes ?? payload.note ?? contact.notes,
      },
    });

    return {
      success: true,
      contact: updatedContact,
    };
  }
}