export type UserRole = 'LONGRICHEUR' | 'CLIENT';

export interface User {
  id: string;

  // identité
  fullName: string;
  phone?: string;
  email?: string;

  // rôle
  role: UserRole;

  // abonnement CERAPRO (uniquement Longricheur)
  isSubscriptionActive: boolean;
  subscriptionEndDate?: string;

  // paramètres
  language: 'fr' | 'en';
  theme: 'light' | 'dark';

  // relation business
  parentUserId?: string;
  // 👉 si CLIENT → référence le Longricheur

  // timestamps
  createdAt: string;
  updatedAt: string;
}