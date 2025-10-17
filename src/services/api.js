import axios from 'axios';
import router from '@/router';

const baseURL = import.meta.env.VITE_API_URL;

// instância principal usada pela aplicação
const api = axios.create({
  baseURL,
});

// adiciona token nas requests (usa localStorage como fonte de verdade)
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- refresh handling (sem importar a store para evitar circularidade) ---
let isRefreshing = false;
let refreshSubscribers = [];

function subscribeTokenRefresh(cb) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token) {
  refreshSubscribers.forEach(cb => cb(token));
  refreshSubscribers = [];
}

async function callRefreshEndpoint(refreshToken) {
  // usa axios direto para não entrar nos interceptors da instância `api`
  const url = `${baseURL}/renew-token`; // ajuste se seu backend usar outro path
  const resp = await axios.post(url, { refresh_token: refreshToken });
  return resp.data;
}

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        console.error('API: refresh token ausente ao tratar 401.');
        // limpa localStorage como fallback e redireciona
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        router.push('/login');
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // se já está renovando, enfileira a requisição para ser re-executada depois
        return new Promise((resolve, reject) => {
          subscribeTokenRefresh(async (newToken) => {
            if (!newToken) return reject(error);
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
            try {
              const resp = await api(originalRequest);
              resolve(resp);
            } catch (err) {
              reject(err);
            }
          });
        });
      }

      isRefreshing = true;
      try {
        const refreshResponse = await callRefreshEndpoint(refreshToken);
        // aceita várias formas de retorno da API
        const newToken = refreshResponse.token || refreshResponse.new_token;
        const newRefresh = refreshResponse.refreshToken || refreshResponse.new_refresh_token;

        if (!newToken) {
          throw new Error('Refresh endpoint não retornou novo token');
        }

        // atualiza localStorage e headers
        localStorage.setItem('token', newToken);
        if (newRefresh) localStorage.setItem('refreshToken', newRefresh);

        api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        if (originalRequest.headers) originalRequest.headers['Authorization'] = `Bearer ${newToken}`;

        // notifica subscribers
        onRefreshed(newToken);
        // reenvia a requisição original
        return api(originalRequest);
      } catch (renewError) {
        console.error('Falha ao renovar o token (api):', renewError?.response?.data || renewError.message);
        // limpa e redireciona
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        router.push('/login');
        return Promise.reject(renewError);
      } finally {
        isRefreshing = false;
      }
    }

    // outro erro qualquer
    return Promise.reject(error);
  }
);

export default api;