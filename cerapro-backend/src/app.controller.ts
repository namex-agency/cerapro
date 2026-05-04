import {
  Body,
  Controller,
  Get,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';

import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { AppService } from './app.service';

type AuthenticatedRequest = Request & {
  user: {
    id: string;
    phone: string;
    role: string;
  };
};

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  root() {
    return {
      message: 'CERAPRO API is running',
      status: 'OK',
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@Req() req: AuthenticatedRequest) {
    return this.appService.getMe(req.user.id);
  }

  @Get('notifications')
  @UseGuards(JwtAuthGuard)
  getNotifications(@Req() req: AuthenticatedRequest) {
    return this.appService.getNotifications(req.user.id);
  }

  @Patch('notifications/read')
  @UseGuards(JwtAuthGuard)
  markAsRead(@Req() req: AuthenticatedRequest, @Body('id') id: string) {
    return this.appService.markNotificationAsRead(req.user.id, id);
  }
}