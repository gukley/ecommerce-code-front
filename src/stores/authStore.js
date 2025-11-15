import { defineStore } from 'pinia';
import { login as apiLogin, getUserProfile as apiGetUserProfile, renewToken as apiRenewToken } from '@/services/apiService';
import { ref } from 'vue';

// decodifica payload JWT (sem libs)
function parseJwt(token) {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    return decoded;
  } catch (e) {
    return null;
  }
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const token = ref(localStorage.getItem('token') || null);
  const refreshTokenValue = ref(localStorage.getItem('refreshToken') || localStorage.getItem('refresh_token') || null);

  const loginUser = async (email, password) => {
    const response = await apiLogin({ email, password });

    // normaliza formas diferentes que a API pode retornar
    const respToken =
      response.access_token ||
      response.token ||
      response.new_token ||
      response.accessToken ||
      response.data?.access_token ||
      response.data?.token ||
      null;

    const respRefresh =
      response.refresh_token ||
      response.refreshToken ||
      response.new_refresh_token ||
      response.data?.refresh_token ||
      response.data?.refreshToken ||
      null;

    const respUser =
      response.user || response.data?.user || null;

    // salva token no formato que o app espera (key: 'token')
    if (respToken) {
      token.value = respToken;
      localStorage.setItem('token', respToken);
    } else {
      token.value = null;
      localStorage.removeItem('token');
    }

    // salva refresh token em duas chaves para compatibilidade
    if (respRefresh) {
      refreshTokenValue.value = respRefresh;
      localStorage.setItem('refreshToken', respRefresh);
      localStorage.setItem('refresh_token', respRefresh);
    } else {
      refreshTokenValue.value = null;
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('refresh_token');
    }

    user.value = respUser;
    if (respUser) {
      localStorage.setItem('user', JSON.stringify(respUser));
    } else {
      localStorage.removeItem('user');
    }

  };

  const getUserProfile = async () => {
    const userData = await apiGetUserProfile();
    user.value = userData;
    if (userData) localStorage.setItem('user', JSON.stringify(userData));
  };

  const setUser = (userData) => {
    user.value = userData;
    if (userData) localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    token.value = null;
    refreshTokenValue.value = null;
    user.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  };

  const refreshToken = async () => {
    try {
      const response = await apiRenewToken();
      // normalize response
      const newToken = response.token || response.new_token || response.access_token || response.accessToken || null;
      const newRefresh = response.refreshToken || response.new_refresh_token || response.refresh_token || response.refreshToken || null;
      if (!newToken) throw new Error('Refresh não retornou token');
      token.value = newToken;
      localStorage.setItem('token', newToken);
      if (newRefresh) {
        refreshTokenValue.value = newRefresh;
        localStorage.setItem('refreshToken', newRefresh);
        localStorage.setItem('refresh_token', newRefresh);
      }
      return true;
    } catch (error) {
      console.error('Falha ao renovar o token (store):', error);
      logout();
      return false;
    }
  };

  const verifyToken = async () => {
    if (!token.value) return false;
    const payload = parseJwt(token.value);
    if (!payload || !payload.exp) {
      // se não sabemos exp e não temos refresh token, não dá para renovar
      if (!refreshTokenValue.value) return false;
      return await refreshToken();
    }
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp <= now + 10) {
      if (!refreshTokenValue.value) return false;
      return await refreshToken();
    }
    return true;
  };

  return {
    user,
    token,
    loginUser,
    logout,
    getUserProfile,
    setUser,
    verifyToken,
    refreshToken,
    refreshTokenValue
  };
});