export async function deleteUser(userId: string) {
  const response = await fetch(`/api/admin/users/${userId}/delete`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result?.message || 'Erreur suppression utilisateur');
  }

  return result;
}