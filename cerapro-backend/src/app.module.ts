import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AdminController } from './admin/admin.controller';
import { AdminService } from './admin/admin.service';

import { ContactsController } from './contacts/contacts.controller';
import { ContactsService } from './contacts/contacts.service';

@Module({
  imports: [],
  controllers: [AppController, AdminController, ContactsController],
  providers: [AppService, AdminService, ContactsService],
})
export class AppModule {}