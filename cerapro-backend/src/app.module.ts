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

import { AccountingController } from './accounting/accounting.controller';
import { AccountingService } from './accounting/accounting.service';

import { LongrichMatinController } from './longrich-matin/longrich-matin.controller';
import { LongrichMatinService } from './longrich-matin/longrich-matin.service';

import { CloudinaryController } from './cloudinary/cloudinary.controller';
import { CloudinaryService } from './cloudinary/cloudinary.service';

import { MiniSiteController } from './mini-site/mini-site.controller';
import { MiniSiteService } from './mini-site/mini-site.service';

import { SubscriptionController } from './subscription/subscription.controller';
import { SubscriptionService } from './subscription/subscription.service';

import { KycController } from './kyc/kyc.controller';
import { KycService } from './kyc/kyc.service';

import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [AuthModule],
  controllers: [
    AppController,
    AdminController,
    ContactsController,
    ProductsController,
    SalesController,
    ActionsController,
    DebtsController,
    AccountingController,
    LongrichMatinController,
    MiniSiteController,
    CloudinaryController,
    SubscriptionController,
    KycController,
  ],
  providers: [
    AppService,
    AdminService,
    ContactsService,
    ProductsService,
    SalesService,
    ActionsService,
    DebtsService,
    AccountingService,
    LongrichMatinService,
    MiniSiteService,
    CloudinaryService,
    PrismaService,
    SubscriptionService,
    KycService,
  ],
})
export class AppModule {}