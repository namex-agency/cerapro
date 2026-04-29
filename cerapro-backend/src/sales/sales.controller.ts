import { Controller, Get, Post, Body, Req } from '@nestjs/common';
import { SalesService } from './sales.service';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  async createSale(@Req() req: any, @Body() body: any) {
    const userId =
      req.user?.id || body.userId || 'e7d8085e-f93c-41d7-81bd-377911aa6194';

    return this.salesService.createSale(userId, body);
  }

  @Get()
  async getSales() {
    return this.salesService.getAllSales();
  }
}