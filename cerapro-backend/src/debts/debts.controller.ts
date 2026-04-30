import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { DebtsService } from './debts.service';

@Controller('debts')
export class DebtsController {
  constructor(private readonly debtsService: DebtsService) {}

  private getUserId(req: any, body?: any) {
    return (
      req.user?.id ||
      body?.userId ||
      'e7d8085e-f93c-41d7-81bd-377911aa6194'
    );
  }

  @Post()
  async createDebt(@Req() req: any, @Body() body: any) {
    const userId = this.getUserId(req, body);

    return this.debtsService.createDebt(userId, body);
  }

  @Get()
  async getDebts(@Req() req: any, @Body() body: any, @Query() query: any) {
    const userId = this.getUserId(req, body);

    return this.debtsService.getDebts(userId, query);
  }
}