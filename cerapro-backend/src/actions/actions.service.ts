import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

type ActionTypeValue =
  | 'CALL'
  | 'SMS'
  | 'FOLLOW_UP'
  | 'WHATSAPP'
  | 'RELAUNCH'
  | 'PRESENTATION'
  | 'INVITATION';

type ActionStatusValue = 'TODO' | 'DONE' | 'CANCELLED';

type ActionResultValue =
  | 'DISCOVERY'
  | 'INTERESTED'
  | 'TO_RELAUNCH'
  | 'REFUSED'
  | 'SALE_CLOSED';

type CreateActionPayload = {
  contactId?: string;
  type: ActionTypeValue;
  status?: ActionStatusValue;
  result?: ActionResultValue;
  actionAt: string;
  priority?: number;
  reminderAt?: string;
  note?: string;
};

type UpdateActionPayload = {
  contactId?: string | null;
  type?: ActionTypeValue;
  status?: ActionStatusValue;
  result?: ActionResultValue | null;
  actionAt?: string;
  priority?: number;
  reminderAt?: string | null;
  note?: string | null;
};

@Injectable()
export class ActionsService {
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
    if (!value) {
      return null;
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return null;
    }

    return date;
  }

  async createAction(userId: string, payload: CreateActionPayload) {
    if (!userId) {
      return {
        success: false,
        message: 'Utilisateur obligatoire.',
      };
    }

    if (!payload.type) {
      return {
        success: false,
        message: 'Le type d’action est obligatoire.',
      };
    }

    const actionAt = this.parseDate(payload.actionAt);

    if (!actionAt) {
      return {
        success: false,
        message: 'La date et l’heure de l’action sont obligatoires.',
      };
    }

    if (payload.contactId) {
      const contact = await this.prisma.contact.findFirst({
        where: {
          id: payload.contactId,
          userId,
        },
      });

      if (!contact) {
        return {
          success: false,
          message: 'Contact introuvable pour cet utilisateur.',
        };
      }
    }

    const action = await this.prisma.userAction.create({
      data: {
        userId,
        contactId: payload.contactId || null,
        type: payload.type,
        status: payload.status || 'TODO',
        result: payload.result || null,
        actionAt,
        priority: payload.priority ?? 0,
        reminderAt: this.parseDate(payload.reminderAt),
        note: payload.note?.trim() || null,
      },
      include: {
        contact: true,
      },
    });

    return {
      success: true,
      data: action,
    };
  }

  async getActions(userId: string) {
    const actions = await this.prisma.userAction.findMany({
      where: {
        userId,
      },
      include: {
        contact: true,
      },
      orderBy: [
        {
          priority: 'desc',
        },
        {
          actionAt: 'asc',
        },
      ],
    });

    return {
      success: true,
      data: actions,
    };
  }

  async getActionById(userId: string, id: string) {
    const action = await this.prisma.userAction.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        contact: true,
      },
    });

    if (!action) {
      return {
        success: false,
        message: 'Action introuvable.',
      };
    }

    return {
      success: true,
      data: action,
    };
  }

  async updateAction(userId: string, id: string, payload: UpdateActionPayload) {
    const existingAction = await this.prisma.userAction.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingAction) {
      return {
        success: false,
        message: 'Action introuvable.',
      };
    }

    if (payload.contactId) {
      const contact = await this.prisma.contact.findFirst({
        where: {
          id: payload.contactId,
          userId,
        },
      });

      if (!contact) {
        return {
          success: false,
          message: 'Contact introuvable pour cet utilisateur.',
        };
      }
    }

    const updatedAction = await this.prisma.userAction.update({
      where: {
        id,
      },
      data: {
        contactId:
          payload.contactId !== undefined
            ? payload.contactId
            : existingAction.contactId,

        type: payload.type ?? existingAction.type,

        status: payload.status ?? existingAction.status,

        result:
          payload.result !== undefined
            ? payload.result
            : existingAction.result,

        actionAt: payload.actionAt
          ? this.parseDate(payload.actionAt) || existingAction.actionAt
          : existingAction.actionAt,

        priority:
          payload.priority !== undefined
            ? payload.priority
            : existingAction.priority,

        reminderAt:
          payload.reminderAt !== undefined
            ? this.parseDate(payload.reminderAt)
            : existingAction.reminderAt,

        note:
          payload.note !== undefined
            ? payload.note?.trim() || null
            : existingAction.note,
      },
      include: {
        contact: true,
      },
    });

    return {
      success: true,
      data: updatedAction,
    };
  }
}