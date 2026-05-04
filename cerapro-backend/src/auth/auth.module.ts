import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { PrismaService } from '../prisma.service';
import { SubscriptionService } from '../subscription/subscription.service';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { WhatsappService } from './whatsapp.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'CERAPRO_SECRET_KEY',
      signOptions: {
        expiresIn: '7d',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
    WhatsappService,
    JwtAuthGuard,
    SubscriptionService,
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}