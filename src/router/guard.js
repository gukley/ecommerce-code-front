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
    } catch (e) {
      console.error('Erro ao fazer parse do usuario do localStorage:', e);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      isAuthenticated = false;
    }
  }

  const requiredRoles = to.meta?.roles;
  const requiresAuth = to.meta?.requiresAuth;

  if (requiresAuth) {
    if (!isAuthenticated) {
      console.log(`Guard: Não autenticado. Redirecionando para login. (${to.path})`);
      return next({ name: 'Login', query: { redirect: to.fullPath } });
    }

    if (requiredRoles && requiredRoles.length > 0) {
      if (!userRole || !requiredRoles.includes(userRole)) {
        console.log(`Guard: Papel inválido. Redirecionando para não autorizado. (${to.path})`);
        return next({ name: 'Unauthorized' });
      }
    }
  }
  return next();
};