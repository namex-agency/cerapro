import { Body, Controller, Get, Patch } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // ROUTE RACINE (AJOUTÉE)
  @Get()
  root() {
    return {
      message: 'CERAPRO API is running',
      status: 'OK'
    };
  }

  // TES ROUTES EXISTANTES (INCHANGÉES)
  @Get('me')
  getMe() {
    return this.appService.getMe();
  }

  @Get('notifications')
  getNotifications() {
    return this.appService.getNotifications();
  }

  @Patch('notifications/read')
  markAsRead(@Body('id') id: string) {
    return this.appService.markNotificationAsRead(id);
  }
}