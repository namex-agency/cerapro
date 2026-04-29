import { Controller, Post, Body, Req } from '@nestjs/common';
import { SalesService } from './sales.service';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  async createSale(@Req() req: any, @Body() body: any) {
    const userId = req.user?.id || 'demo-user-id';

    return this.salesService.createSale(userId, body);
  }
}