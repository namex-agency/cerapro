import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { OtpPurpose } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body()
    body: {
      fullName: string;
      phone: string;
      country?: string;
      password: string;
    },
  ) {
    return this.authService.register(body);
  }

  @Post('verify-otp')
  async verifyOtp(
    @Body()
    body: {
      phone: string;
      code: string;
      purpose: OtpPurpose;
    },
  ) {
    return this.authService.verifyOtp(
      body.phone,
      body.code,
      body.purpose,
    );
  }

  @Post('login')
  async login(
    @Body()
    body: {
      phone: string;
      password: string;
    },
  ) {
    return this.authService.login(body);
  }
}