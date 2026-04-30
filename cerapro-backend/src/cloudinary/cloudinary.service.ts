import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Express } from 'express';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });
  }

  async uploadImage(file: any, folder: string) {
    if (!file) {
      return {
        success: false,
        message: 'Aucun fichier image fourni.',
      };
    }

    if (!file.mimetype?.startsWith('image/')) {
      return {
        success: false,
        message: 'Le fichier doit être une image.',
      };
    }

    if (!folder?.trim()) {
      return {
        success: false,
        message: 'Dossier Cloudinary obligatoire.',
      };
    }

    const maxSizeInBytes = 5 * 1024 * 1024;

    if (file.size > maxSizeInBytes) {
      return {
        success: false,
        message: 'Image trop lourde. Taille maximale autorisée : 5 Mo.',
      };
    }

    const uploadResult = await new Promise<UploadApiResponse>(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder,
            resource_type: 'image',
            overwrite: false,
          },
          (error, result) => {
            if (error || !result) {
              reject(error);
              return;
            }

            resolve(result);
          },
        );

        uploadStream.end(file.buffer);
      },
    );

    return {
      success: true,
      data: {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        width: uploadResult.width,
        height: uploadResult.height,
        format: uploadResult.format,
        bytes: uploadResult.bytes,
      },
    };
  }
}