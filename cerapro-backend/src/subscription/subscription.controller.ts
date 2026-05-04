import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SubscriptionService } from './subscription.service';

type AuthenticatedRequest = Request & {
  user: {
    id: string;
    phone: string;
    role: string;
  };
};

@Controller('subscription')
@UseGuards(JwtAuthGuard)
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post('start-free-trial')
  async startFreeTrial(@Req() req: AuthenticatedRequest) {
    const access = await this.subscriptionService.startFreeTrialForUser(
      req.user.id,
    );

    return {
      success: true,
      message: 'Essai gratuit activé avec succès.',
      data: access,
    };
  }
}