import { Body, Controller, Get, Post } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // 🔔 Créer une notification
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

  // 👤 Liste des utilisateurs
  @Get('users')
  async getUsers() {
    const users = await this.adminService.getUsers();

    return {
      success: true,
      data: users,
    };
  }

  // 📊 KPI UTILISATEURS (🔥 NOUVEAU)
  @Get('kpis')
  async getUsersKpis() {
    const kpis = await this.adminService.getUsersKpis();

    return {
      success: true,
      data: kpis,
    };
  }
}