import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

type JwtPayload = {
  sub: string;
  phone: string;
  role: string;
};

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<any>();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token manquant.');
    }

    const token = authHeader.replace('Bearer ', '').trim();

    try {
      const payload = this.jwtService.verify<JwtPayload>(token);

      request.user = {
        id: payload.sub,
        phone: payload.phone,
        role: payload.role,
      } as any;

      return true;
    } catch {
      throw new UnauthorizedException('Session expirée ou invalide.');
    }
  }
}