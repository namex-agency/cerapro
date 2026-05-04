import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from './cloudinary.service';

@Controller('cloudinary')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile() file: any,
    @Query('type') type: string,
  ) {
    if (!type) {
      throw new BadRequestException('Type d’upload requis');
    }

    const folderMap: Record<string, string> = {
      kyc: 'cerapro/kyc',
      profile: 'cerapro/profile',
      product: 'cerapro/products',
      coach: 'cerapro/coachs',
      news: 'cerapro/news',
      support: 'cerapro/support',
      minisite: 'cerapro/minisite',
    };

    const folder = folderMap[type];

    if (!folder) {
      throw new BadRequestException('Type d’upload invalide');
    }

    return this.cloudinaryService.uploadImage(file, folder);
  }
}