import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { SubscriptionService } from '../subscription/subscription.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { WhatsappService } from './whatsapp.service';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
    WhatsappService,
    SubscriptionService,
  ],
  exports: [AuthService],
})
export class AuthModule {}