import { Controller, Get, Param, Query, Body, Post } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getProducts(@Query('search') search?: string) {
    return this.productsService.getProducts(search);
  }

  @Get(':id')
  async getProductById(@Param('id') id: string) {
    return this.productsService.getProductById(id);
  }

  @Post()
  async createProduct(@Body() data: any) {
    return this.productsService.createProduct(data);
  }
}