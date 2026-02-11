import apiClient from './client.js';

export async function loginWithGoogle(credential) {
  const { data } = await apiClient.post('/api/auth/google', {
    credential: credential || undefined,
    id_token: credential || undefined,
  });
  return data;
}

export async function getMe() {
  const { data } = await apiClient.get('/api/auth/me');
  return data;
}

export async function logout() {
  try {
    await apiClient.post('/api/auth/logout');
  } catch {
    // Ignore logout API errors
  }
}
