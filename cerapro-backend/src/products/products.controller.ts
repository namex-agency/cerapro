import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll(@Query('search') search?: string) {
    return this.productsService.getProducts(search);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productsService.getProductById(id);
  }
}