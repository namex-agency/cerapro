import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class WhatsappService {
  private readonly graphApiVersion = process.env.WHATSAPP_GRAPH_API_VERSION || 'v25.0';
  private readonly phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  private readonly accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

  async sendOtp(to: string, otp: string) {
    if (!this.phoneNumberId || !this.accessToken) {
      throw new InternalServerErrorException(
        'Configuration WhatsApp manquante.',
      );
    }

    const response = await fetch(
      `https://graph.facebook.com/${this.graphApiVersion}/${this.phoneNumberId}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: this.formatPhoneForWhatsapp(to),
          type: 'text',
          text: {
          body: `Votre code CERAPRO est : ${otp}. Ne le partagez avec personne.`,
          },
        }),
      },
    );

    const result = await response.json();

    if (!response.ok) {
      console.error('WHATSAPP_SEND_ERROR', result);

      throw new InternalServerErrorException(
        'Impossible d’envoyer le message WhatsApp.',
      );
    }

    return result;
  }

  private formatPhoneForWhatsapp(phone: string): string {
    const cleanPhone = phone.replace(/\D/g, '');

    if (cleanPhone.startsWith('237')) {
      return cleanPhone;
    }

    return `237${cleanPhone}`;
  }
}