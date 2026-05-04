import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { KycService } from './kyc.service';

type AuthenticatedRequest = Request & {
  user: {
    id: string;
    phone: string;
    role: string;
  };
};

@Controller('kyc')
@UseGuards(JwtAuthGuard)
export class KycController {
  constructor(private readonly kycService: KycService) {}

  @Get()
  getMyKyc(@Req() req: AuthenticatedRequest) {
    return this.kycService.getMyKyc(req.user.id);
  }

  @Patch()
  updateMyKyc(@Req() req: AuthenticatedRequest, @Body() body: any) {
    return this.kycService.updateMyKyc(req.user.id, body);
  }
}