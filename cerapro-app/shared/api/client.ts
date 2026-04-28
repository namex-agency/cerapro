const API_URL = 'http://192.168.100.2:3000';

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

// GET NOTIFICATIONS
export async function getNotifications() {
  return apiFetch('/notifications');
}

// MARK ONE NOTIFICATION AS READ
export async function markNotificationAsRead(id: string) {
  return apiFetch('/notifications/read', {
    method: 'PATCH',
    body: JSON.stringify({ id }),
  });
}

// BONUS
export async function markAllNotificationsAsRead() {
  return apiFetch('/notifications/read-all', {
    method: 'PATCH',
  });
}