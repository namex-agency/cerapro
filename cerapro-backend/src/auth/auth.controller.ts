import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';
import { OtpPurpose } from '@prisma/client';
import { AuthService } from './auth.service';

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

   @Post('request-password-reset')
  async requestPasswordReset(
    @Body()
    body: {
      phone: string;
    },
  ) {
    return this.authService.requestPasswordReset(body);
  }

  @Post('reset-password')
  async resetPassword(
    @Body()
    body: {
      phone: string;
      code: string;
      newPassword: string;
    },
  ) {
    return this.authService.resetPassword(body);
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