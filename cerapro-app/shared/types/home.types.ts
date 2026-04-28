export type KycStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

export type SubscriptionStatus = 'TRIAL' | 'ACTIVE' | 'EXPIRED';

export interface HomeHeaderData {
  fullName: string;
  kycStatus: KycStatus;
  subscriptionStatus: SubscriptionStatus;
  subscriptionEndDate?: string;
  notificationUnreadCount: number;
}

export interface HomeKpiData {
  balance: number;

  margin: number;
  pv: number;
  commissions: number;
  debts: number;
  contacts: number;
  actionsToDo: number;
}