import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

type CreateLongrichMatinArticlePayload = {
  title: string;
  slug?: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  isPublished?: boolean;
};

type TogglePublishPayload = {
  isPublished?: boolean;
};

@Injectable()
export class LongrichMatinService {
  private prisma: PrismaClient;

  constructor() {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    const adapter = new PrismaPg(pool);

    this.prisma = new PrismaClient({
      adapter,
    });
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  async createArticle(payload: CreateLongrichMatinArticlePayload) {
    if (!payload.title?.trim()) {
      return {
        success: false,
        message: 'Le titre est obligatoire.',
      };
    }

    if (!payload.content?.trim()) {
      return {
        success: false,
        message: 'Le contenu est obligatoire.',
      };
    }

    const slug = payload.slug?.trim() || this.generateSlug(payload.title);

    const existingArticle = await this.prisma.longrichMatinArticle.findUnique({
      where: {
        slug,
      },
    });

    if (existingArticle) {
      return {
        success: false,
        message: 'Un article avec ce slug existe déjà.',
      };
    }

    const article = await this.prisma.longrichMatinArticle.create({
      data: {
        title: payload.title.trim(),
        slug,
        excerpt: payload.excerpt?.trim() || null,
        content: payload.content.trim(),
        coverImage: payload.coverImage?.trim() || null,
        isPublished: payload.isPublished ?? false,
      },
    });

    return {
      success: true,
      data: article,
    };
  }

  async getArticles(filters?: any) {
    const where: any = {};

    if (filters?.published === true || filters?.published === 'true') {
      where.isPublished = true;
    }

    if (filters?.published === false || filters?.published === 'false') {
      where.isPublished = false;
    }

    const articles = await this.prisma.longrichMatinArticle.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      success: true,
      data: articles,
    };
  }

  async getPublishedArticles() {
    const articles = await this.prisma.longrichMatinArticle.findMany({
      where: {
        isPublished: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      success: true,
      data: articles,
    };
  }

  async getArticleBySlug(slug: string) {
    if (!slug?.trim()) {
      return {
        success: false,
        message: 'Slug obligatoire.',
      };
    }

    const article = await this.prisma.longrichMatinArticle.findUnique({
      where: {
        slug: slug.trim(),
      },
    });

    if (!article) {
      return {
        success: false,
        message: 'Article introuvable.',
      };
    }

    return {
      success: true,
      data: article,
    };
  }

  async togglePublish(id: string, payload: TogglePublishPayload) {
    if (!id?.trim()) {
      return {
        success: false,
        message: 'Identifiant article obligatoire.',
      };
    }

    const article = await this.prisma.longrichMatinArticle.findUnique({
      where: {
        id,
      },
    });

    if (!article) {
      return {
        success: false,
        message: 'Article introuvable.',
      };
    }

    const updatedArticle = await this.prisma.longrichMatinArticle.update({
      where: {
        id,
      },
      data: {
        isPublished:
          typeof payload.isPublished === 'boolean'
            ? payload.isPublished
            : !article.isPublished,
      },
    });

    return {
      success: true,
      data: updatedArticle,
    };
  }

  async deleteArticle(id: string) {
    if (!id?.trim()) {
      return {
        success: false,
        message: 'Identifiant article obligatoire.',
      };
    }

    const article = await this.prisma.longrichMatinArticle.findUnique({
      where: {
        id,
      },
    });

    if (!article) {
      return {
        success: false,
        message: 'Article introuvable.',
      };
    }

    await this.prisma.longrichMatinArticle.delete({
      where: {
        id,
      },
    });

    return {
      success: true,
      message: 'Article supprimé avec succès.',
    };
  }
}