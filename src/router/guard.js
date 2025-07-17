export const authGuard = (to, from, next) => {
  const token = localStorage.getItem('token');
  let isAuthenticated = !!token; // Verifica se existe um token

  let userRole = null;

  if (localStorage.getItem('user')) {
    try {
      const userString = localStorage.getItem('user');
      const user = JSON.parse(userString);
      userRole = user.role;
    } catch (e) {
      console.error("Erro ao fazer parse do usuario do localStorage:", e);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      isAuthenticated = false; 
    }
  }

  // Define os papéis necessários para a rota atual
  const requiredRoles = to.meta.roles;
  const requiresAuth = to.meta.requiresAuth;

  // 1. Rota requer autenticação?
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
  next();
};