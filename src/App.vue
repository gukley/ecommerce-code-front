<template>
  <div id="app">
    <div v-if="isLoading" class="app-loading">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Carregando...</span>
      </div>
    </div>
    <div v-else>
      <AppHeader v-if="!$route.meta.hideHeader" />
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { useAuthStore } from './stores/authStore';
import { useCartStore } from './stores/cartStore';
import router from './router';

const authStore = useAuthStore();
const cartStore = useCartStore();
const isLoading = ref(true);

// retorna true se a rota atual requer autenticação (meta.requiresAuth ou similar)
const isRouteProtected = () => {
  const r = router.currentRoute.value;
  return r?.meta?.requiresAuth === true;
};

// (substitua a função initializeApp existente por esta)
const initializeApp = async () => {
  isLoading.value = true;
  try {
    // DEBUG: inspeciona o que existe antes de qualquer verificação
    console.log('BOOT: localStorage token=', localStorage.getItem('token'));
    console.log('BOOT: localStorage refreshToken=', localStorage.getItem('refreshToken') || localStorage.getItem('refresh_token'));
    console.log('BOOT: authStore.token (ref) =', authStore.token);
    console.log('BOOT: authStore.refreshTokenValue (ref) =', authStore.refreshTokenValue);

    const tokenFromStore = (authStore.token && authStore.token.value) || localStorage.getItem('token');
    console.log('BOOT: tokenFromStore=', tokenFromStore);

    if (!tokenFromStore) {
      console.log('BOOT: sem token. rota atual requiresAuth=', router.currentRoute.value?.meta?.requiresAuth);
      if (router.currentRoute.value?.meta?.requiresAuth) {
        authStore.logout();
        router.push('/login');
      }
      return;
    }

    const isTokenValid = await authStore.verifyToken();
    console.log('BOOT: verifyToken returned =', isTokenValid);

    if (!isTokenValid) {
      // não jogar imediatamente — logamos e tratamos dependendo da rota
      console.warn('BOOT: token inválido/expirado e verifyToken = false');
      if (router.currentRoute.value?.meta?.requiresAuth) {
        throw new Error('Invalid or expired token');
      } else {
        // rota pública: só termina inicialização
        return;
      }
    }

    await authStore.getUserProfile();
    await cartStore.initCart();
  } catch (error) {
    console.error('Erro ao inicializar app:', error);
    authStore.logout();
    router.push('/login');
  } finally {
    isLoading.value = false;
  }
};


onMounted(async () => {
  // aguarda router para ter meta das rotas disponíveis
  await router.isReady();
  await initializeApp();
});

// reinicia inicialização quando o token do store mudar (ex.: após login)
watch(() => authStore.token, async (newToken) => {
  if (newToken) await initializeApp();
});

// quando o usuário estiver carregado, garante que o spinner suma
watch(() => authStore.user, (newUser) => {
  if (newUser && isLoading.value) isLoading.value = false;
});
</script>

<style>
.app-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #0f1419;
}

.spinner-border {
  width: 3rem;
  height: 3rem;
  color: #64b5f6;
}
</style>
