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
  return apiRequest<ApiResponse<any[]>>("/admin/users");
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
 * FUTURES RUBRIQUES ADMIN
 *
 * KYC, abonnements, produits, commandes, mini-sites et wallets
 * seront ajoutés ici uniquement quand leurs routes backend seront créées.
 */