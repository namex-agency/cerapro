import { Injectable } from '@nestjs/common';
import { SubscriptionStatus } from '@prisma/client';
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
}