export type KycStatus = "Validé" | "En attente" | "Incomplet";

export type UserStatus = "Actif" | "Inactif";

export type UserActionType =
  | "profile"
  | "kyc"
  | "validate"
  | "suspend"
  | "more";

export type User = {
  fullName: string;
  phone: string;
  birthDate: string;
  birthPlace: string;
  placeName: string;
  district: string;
  city: string;
  country: string;
  status: UserStatus;
  kyc: KycStatus;
  kycFieldsCompleted: number;
  kycFieldsTotal: number;
  kycFiles: {
    selfie: boolean;
    cniFront: boolean;
    cniBack: boolean;
  };
  subscription: string;
  subscriptionPrice: string;
  miniSite: string;
  wallet: string;
};

export type UsersFilter =
  | "all"
  | "active"
  | "kyc_pending"
  | "subscription_standard";