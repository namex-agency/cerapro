import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AdminController } from './admin/admin.controller';
import { AdminService } from './admin/admin.service';

import { ContactsController } from './contacts/contacts.controller';
import { ContactsService } from './contacts/contacts.service';

import { ProductsController } from './products/products.controller';
import { ProductsService } from './products/products.service';

import { SalesController } from './sales/sales.controller';
import { SalesService } from './sales/sales.service';

@Module({
  imports: [],
  controllers: [
    AppController,
    AdminController,
    ContactsController,
    ProductsController,
    SalesController,
  ],
  providers: [
    AppService,
    AdminService,
    ContactsService,
    ProductsService,
    SalesService,
  ],
})
export class AppModule {}