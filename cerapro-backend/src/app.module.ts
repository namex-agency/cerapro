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

import { ActionsController } from './actions/actions.controller';
import { ActionsService } from './actions/actions.service';

import { DebtsController } from './debts/debts.controller';
import { DebtsService } from './debts/debts.service';

@Module({
  imports: [],
  controllers: [
    AppController,
    AdminController,
    ContactsController,
    ProductsController,
    SalesController,
    ActionsController,
    DebtsController,
  ],
  providers: [
    AppService,
    AdminService,
    ContactsService,
    ProductsService,
    SalesService,
    ActionsService,
    DebtsService,
  ],
})
export class AppModule {}