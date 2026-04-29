import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getMe() {
    return {
      id: 'demo-user-eric',
      fullName: 'Eric Namo',
      phone: '+237600000000',
      country: 'Cameroun',
      city: 'Yaoundé',
      district: 'Bastos',
      kycCompleted: false,
      subscription: {
        status: 'ACTIVE',
        expiresAt: '2026-12-31',
      },
      notificationsUnread: 3,
    };
  }

  getNotifications() {
    return [
      {
        id: 'notif-001',
        title: 'Bienvenue sur CERAPRO',
        message: 'Votre espace Longricheur est prêt.',
        read: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'notif-002',
        title: 'KYC en attente',
        message: 'Complétez votre vérification pour activer toutes les fonctionnalités.',
        read: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'notif-003',
        title: 'Mini-site disponible',
        message: 'Votre mini-site personnel CERAPRO sera bientôt connecté.',
        read: false,
        createdAt: new Date().toISOString(),
      },
    ];
  }

  markNotificationAsRead(id: string) {
    return {
      success: true,
      notification: {
        id,
        read: true,
      },
    };
  }
}