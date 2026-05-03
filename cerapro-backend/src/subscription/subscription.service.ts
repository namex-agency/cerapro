import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  SubscriptionPlan,
  SubscriptionStatus,
} from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class SubscriptionService {
  constructor(private readonly prisma: PrismaService) {}

  async getCurrentAccessForUser(userId: string) {
    const now = new Date();

    const currentSubscription = await this.prisma.subscription.findFirst({
      where: {
        userId,
        isCurrent: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const hasActiveTrial =
      currentSubscription?.status === SubscriptionStatus.TRIALING &&
      currentSubscription.trialEndsAt !== null &&
      currentSubscription.trialEndsAt > now;

    const hasActivePaidSubscription =
      currentSubscription?.status === SubscriptionStatus.ACTIVE &&
      currentSubscription.endsAt !== null &&
      currentSubscription.endsAt > now;

    const hasActiveAccess = hasActiveTrial || hasActivePaidSubscription;

    return {
      hasActiveAccess,
      mustChooseSubscription: !hasActiveAccess,
      subscription: currentSubscription,
    };
  }

  async startFreeTrialForUser(userId: string) {
    const now = new Date();

    const trialEndsAt = new Date(now);
    trialEndsAt.setDate(trialEndsAt.getDate() + 7);

    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        status: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable.');
    }

    const existingTrial = await this.prisma.subscription.findFirst({
      where: {
        userId,
        plan: SubscriptionPlan.TRIAL,
      },
      select: {
        id: true,
      },
    });

    if (existingTrial) {
      throw new BadRequestException('Essai gratuit déjà utilisé.');
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.subscription.updateMany({
        where: {
          userId,
          isCurrent: true,
        },
        data: {
          isCurrent: false,
        },
      });

      const subscription = await tx.subscription.create({
        data: {
          userId,
          plan: SubscriptionPlan.TRIAL,
          status: SubscriptionStatus.TRIALING,
          amount: 0,
          currency: 'FCFA',
          startsAt: now,
          endsAt: trialEndsAt,
          trialEndsAt,
          paymentStatus: 'SUCCESS',
          paymentProvider: 'MANUAL',
          isCurrent: true,
        },
      });

      return {
        hasActiveAccess: true,
        mustChooseSubscription: false,
        subscription,
      };
    });
  }
}