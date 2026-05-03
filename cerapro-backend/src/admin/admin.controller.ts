import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
} from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // Créer une notification
  @Post('notification')
  async createNotification(
    @Body()
    body: {
      userId: string;
      source: string;
      title: string;
      message: string;
      time?: string;
    },
  ) {
    const notification = await this.adminService.createNotification(body);

    return {
      success: true,
      data: notification,
    };
  }

  // Liste des utilisateurs
  @Get('users')
  async getUsers() {
    const users = await this.adminService.getUsers();

    return {
      success: true,
      data: users,
    };
  }

  // KPI UTILISATEURS
  @Get('kpis')
  async getUsersKpis() {
    const kpis = await this.adminService.getUsersKpis();

    return {
      success: true,
      data: kpis,
    };
  }

  // Suppression définitive réservée au super admin
  @Delete('users/:id')
  async deleteUser(
    @Param('id') userId: string,
    @Headers('x-super-admin-token') token: string,
  ) {
    const result = await this.adminService.deleteUserPermanently(
      userId,
      token,
    );

    return {
      success: true,
      message: 'Utilisateur supprimé définitivement.',
      data: result,
    };
  }
}