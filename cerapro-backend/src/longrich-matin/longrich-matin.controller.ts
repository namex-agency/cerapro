import { Controller, Get, Post, Patch, Body, Param } from '@nestjs/common';
import { LongrichMatinService } from './longrich-matin.service';

@Controller('longrich-matin')
export class LongrichMatinController {
  constructor(private readonly longrichMatinService: LongrichMatinService) {}

  // 🔹 Créer un article (admin)
  @Post()
  async createArticle(@Body() body: any) {
    return this.longrichMatinService.createArticle(body);
  }

  // 🔹 Liste publique (articles publiés)
  @Get()
  async getPublishedArticles() {
    return this.longrichMatinService.getPublishedArticles();
  }

  // 🔹 Détail article par slug (public)
  @Get(':slug')
  async getArticleBySlug(@Param('slug') slug: string) {
    return this.longrichMatinService.getArticleBySlug(slug);
  }

  // 🔹 Publier / dépublier (admin)
  @Patch(':id/publish')
  async togglePublish(@Param('id') id: string, @Body() body: any) {
    return this.longrichMatinService.togglePublish(id, body);
  }
}