const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://cerapro-production.up.railway.app";

type ApiRequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
};

type ApiResponse<T> = {
  success: boolean;
  data: T;
};

export type UsersKpisData = {
  total: number;
  active: number;
  inactive: number;
  kycValidated: number;
  kycPending: number;
};

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: options.method ?? "GET",
      headers: {
        "Content-Type": "application/json",
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : null;

    if (!response.ok) {
      throw new Error(data?.message ?? `Erreur API CERAPRO (${response.status})`);
    }

    return data as T;
  } catch (error) {
    console.error("CERAPRO API ERROR:", error);
    throw new Error("Impossible de contacter le backend CERAPRO.");
  }
}

/**
 * USERS API — ADMIN
 */
export async function getUsers() {
  const response = await apiRequest<ApiResponse<any[]>>("/admin/users");

  return {
    success: response.success,
    data: response.data.map((user) => ({
      id: user.id,
      fullName: user.fullName,
      phone: user.phone,
      birthDate: user.birthDate,
      birthPlace: user.birthPlace,
      placeName: user.placeName,
      district: user.district,
      city: user.city,
      country: user.country,
      status: user.status,
      kyc: user.kyc,
      kycFieldsCompleted: user.kycFieldsCompleted,
      kycFieldsTotal: user.kycFieldsTotal,

      kycFiles: {
        selfie: !!user.selfieUrl,
        cniFront: !!user.cniFrontUrl,
        cniBack: !!user.cniBackUrl,
      },

      // NOUVEAU — URLs Cloudinary injectées
      selfieUrl: user.selfieUrl,
      cniFrontUrl: user.cniFrontUrl,
      cniBackUrl: user.cniBackUrl,

      subscription: user.subscription,
      subscriptionPrice: user.subscriptionPrice,
      miniSite: user.miniSite,
      wallet: user.wallet,
    })),
  };
}

/**
 * USERS KPI API — ADMIN
 */
export async function getUsersKpis() {
  return apiRequest<ApiResponse<UsersKpisData>>("/admin/kpis");
}

/**
 * NOTIFICATIONS API — ADMIN
 */
export async function createAdminNotification(data: {
  userId: string;
  source: string;
  title: string;
  message: string;
  time?: string;
}) {
  return apiRequest<ApiResponse<any>>("/admin/notification", {
    method: "POST",
    body: data,
  });
}

/**
 * KYC API — ADMIN
 */
export async function getAdminKycProfiles() {
  return apiRequest<ApiResponse<any[]>>("/kyc/admin");
}

export async function approveAdminKyc(userId: string) {
  return apiRequest<ApiResponse<any>>(`/kyc/admin/${userId}/approve`, {
    method: "POST",
  });
}

export async function rejectAdminKyc(userId: string, reason: string) {
  return apiRequest<ApiResponse<any>>(`/kyc/admin/${userId}/reject`, {
    method: "POST",
    body: {
      reason,
    },
  });
}

/**
 * FUTURES RUBRIQUES ADMIN
 *
 * abonnements, produits, commandes, mini-sites et wallets
 * seront ajoutés ici uniquement quand leurs routes backend seront créées.
 */