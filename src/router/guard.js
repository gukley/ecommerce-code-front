import { useAuthStore } from '@/stores/authStore';

export const authGuard = (to, from, next) => {
  const authStore = useAuthStore();

  // pega token do store (se já inicializado) ou do localStorage como fallback
  const tokenFromStore = authStore?.token;
  const token = tokenFromStore && tokenFromStore.value ? tokenFromStore.value : localStorage.getItem('token');
  let isAuthenticated = !!token;

  let userRole = null;
  const userString = localStorage.getItem('user') || null;
  if (userString) {
    try {
      const user = JSON.parse(userString);
      userRole = user?.role || null;
      // Normaliza o role para maiúsculas para garantir comparação correta
      if (userRole) {
        userRole = userRole.toUpperCase();
      }
    } catch (e) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      isAuthenticated = false;
    }
  }

  const requiredRoles = to.meta?.roles;
  const requiresAuth = to.meta?.requiresAuth;
  const requiresAdmin = to.meta?.requiresAdmin;

  if (requiresAuth) {
    if (!isAuthenticated) {
      return next({ name: 'Login', query: { redirect: to.fullPath } });
    }

    // Verifica se a rota requer apenas ADMIN
    if (requiresAdmin) {
      if (!userRole || userRole !== 'ADMIN') {
        return next({ name: 'Unauthorized' });
      }
    }

    // Verifica roles permitidos (normaliza para maiúsculas)
    if (requiredRoles && requiredRoles.length > 0) {
      const normalizedRoles = requiredRoles.map(role => role.toUpperCase());
      if (!userRole || !normalizedRoles.includes(userRole)) {
        return next({ name: 'Unauthorized' });
      }
    }
  }
  return next();
};