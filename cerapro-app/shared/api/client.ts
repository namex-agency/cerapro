const API_URL = 'https://cerapro-production.up.railway.app';

// BASE FETCH WRAPPER
async function apiFetch(endpoint: string, options?: RequestInit) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Erreur API: ${errorText}`);
  }

  return response.json();
}

// ==========================
// USER
// ==========================

export async function getMe() {
  return apiFetch('/me');
}

// ==========================
// NOTIFICATIONS
// ==========================

export async function getNotifications() {
  return apiFetch('/notifications');
}

export async function markNotificationAsRead(id: string) {
  return apiFetch('/notifications/read', {
    method: 'PATCH',
    body: JSON.stringify({ id }),
  });
}

export async function markAllNotificationsAsRead() {
  return apiFetch('/notifications/read-all', {
    method: 'PATCH',
  });
}

// ==========================
// AUTH TYPES
// ==========================

export type RegisterPayload = {
  fullName: string;
  phone: string;
  country: string;
  password: string;
};

export type VerifyOtpPayload = {
  phone: string;
  code: string;
  purpose: 'REGISTER' | 'LOGIN' | 'PASSWORD_RESET';
};

export type LoginPayload = {
  phone: string;
  password: string;
};

export type RequestPasswordResetPayload = {
  phone: string;
};

export type ResetPasswordPayload = {
  phone: string;
  code: string;
  newPassword: string;
};

// ==========================
// AUTH API
// ==========================

export async function registerLongricheur(payload: RegisterPayload) {
  return apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function verifyAuthOtp(payload: VerifyOtpPayload) {
  return apiFetch('/auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function loginLongricheur(payload: LoginPayload) {
  return apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function requestPasswordReset(payload: RequestPasswordResetPayload) {
  return apiFetch('/auth/request-password-reset', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function resetPassword(payload: ResetPasswordPayload) {
  return apiFetch('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}