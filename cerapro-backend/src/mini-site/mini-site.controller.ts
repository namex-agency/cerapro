import { Controller, Get, Param } from '@nestjs/common';
import { MiniSiteService } from './mini-site.service';

@Controller('mini-site')
export class MiniSiteController {
  constructor(private readonly miniSiteService: MiniSiteService) {}

  @Get(':slug')
  async getMiniSiteBySlug(@Param('slug') slug: string) {
    return this.miniSiteService.getMiniSiteBySlug(slug);
  }

  @Get(':slug/products')
  async getMiniSiteProducts(@Param('slug') slug: string) {
    return this.miniSiteService.getPublicProducts();
  }
}