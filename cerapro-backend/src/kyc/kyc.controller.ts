import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
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

  private assertAdmin(req: AuthenticatedRequest) {
    if (req.user.role !== 'ADMIN' && req.user.role !== 'SUPER_ADMIN') {
      throw new ForbiddenException(
        'Accès refusé. Réservé à l’administration CERAPRO.',
      );
    }
  }

  @Get('admin')
  getAdminKycProfiles(@Req() req: AuthenticatedRequest) {
    this.assertAdmin(req);

    return this.kycService.getAdminKycProfiles();
  }

  @Post('admin/:userId/approve')
  approveKyc(
    @Req() req: AuthenticatedRequest,
    @Param('userId') userId: string,
  ) {
    this.assertAdmin(req);

    return this.kycService.approveKyc(userId);
  }

  @Post('admin/:userId/reject')
  rejectKyc(
    @Req() req: AuthenticatedRequest,
    @Param('userId') userId: string,
    @Body('reason') reason: string,
  ) {
    this.assertAdmin(req);

    return this.kycService.rejectKyc(userId, reason);
  }

  @Get()
  getMyKyc(@Req() req: AuthenticatedRequest) {
    return this.kycService.getMyKyc(req.user.id);
  }

  @Patch()
  updateMyKyc(@Req() req: AuthenticatedRequest, @Body() body: any) {
    return this.kycService.updateMyKyc(req.user.id, body);
  }
}