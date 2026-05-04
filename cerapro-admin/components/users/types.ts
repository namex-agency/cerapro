export type UserStatus = "Actif" | "Inactif";

export type UserActionType = "profile" | "suspend" | "more";

export type User = {
  id: string;
  fullName: string;
  phone: string;
  status: UserStatus;
};

export type UsersFilter = "all" | "active";