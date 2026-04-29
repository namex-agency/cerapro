import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AdminController } from './admin/admin.controller';
import { AdminService } from './admin/admin.service';

import { ContactsController } from './contacts/contacts.controller';
import { ContactsService } from './contacts/contacts.service';

import { ProductsController } from './products/products.controller';
import { ProductsService } from './products/products.service';

@Module({
  imports: [],
  controllers: [
    AppController,
    AdminController,
    ContactsController,
    ProductsController,
  ],
  providers: [
    AppService,
    AdminService,
    ContactsService,
    ProductsService,
  ],
})
export class AppModule {}