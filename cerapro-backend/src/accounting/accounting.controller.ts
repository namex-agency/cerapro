import { Controller, Get, Query } from '@nestjs/common';
import { AccountingService } from './accounting.service';

@Controller('accounting')
export class AccountingController {
  constructor(private readonly accountingService: AccountingService) {}

  @Get('summary')
  async getFinancialSummary(@Query('userId') userId: string) {
    return this.accountingService.getFinancialSummary(userId);
  }
}