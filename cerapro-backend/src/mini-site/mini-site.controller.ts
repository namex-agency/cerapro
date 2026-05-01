import { Controller, Get, Post, Patch, Param, Body } from '@nestjs/common';
import { MiniSiteService } from './mini-site.service';

@Controller('mini-site')
export class MiniSiteController {
  constructor(private readonly miniSiteService: MiniSiteService) {}

  // 🔹 Créer un mini-site (admin / onboarding)
  @Post()
  async createMiniSite(@Body() body: any) {
    return this.miniSiteService.createMiniSite(body);
  }

  // 🔹 Lire un mini-site public par slug
  @Get(':slug')
  async getMiniSiteBySlug(@Param('slug') slug: string) {
    return this.miniSiteService.getMiniSiteBySlug(slug);
  }

  // 🔹 Produits publics (catalogue)
 @Get(':slug/products')
async getMiniSiteProducts(@Param('slug') slug: string) {
  return this.miniSiteService.getPublicProducts(slug);
}

  // 🔹 Mettre à jour le mini-site (propriétaire)
  @Patch(':userId')
  async updateMiniSite(
    @Param('userId') userId: string,
    @Body() body: any,
  ) {
    return this.miniSiteService.updateMiniSite(userId, body);
  }

  // 🔹 Créer une commande depuis le mini-site public
  @Post(':slug/order')
  async createOrderFromMiniSite(
    @Param('slug') slug: string,
    @Body() body: any,
  ) {
    return this.miniSiteService.createOrderFromMiniSite(slug, body);
  }

  // 🔹 Voir les commandes du propriétaire
  @Get('owner/:userId/orders')
  async getOrdersByOwner(@Param('userId') userId: string) {
    return this.miniSiteService.getOrdersByOwner(userId);
  }
}