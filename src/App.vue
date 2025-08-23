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
import { useRoute } from 'vue-router';
import { onMounted, ref, computed, watch } from 'vue';
import { useAuthStore } from './stores/authStore';
import ProductCard from './components/home/ProductCard.vue';

const route = useRoute();
const authStore = useAuthStore();
const isLoading = ref(true);

// Função para carregar dados iniciais
const initializeApp = async () => {
  try {
    if (authStore.token) {
      await authStore.getUserProfile();
    }
  } catch (error) {
    console.error('Erro ao inicializar app:', error);
    // Se houver erro, limpa o token inválido
    if (error.response?.status === 401) {
      authStore.logout();
    }
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await initializeApp();
});

// Observa mudanças no token para recarregar dados
watch(() => authStore.token, async (newToken) => {
  if (newToken) {
    isLoading.value = true;
    await initializeApp();
  } else {
    isLoading.value = false;
  }
});

// Observa mudanças no usuário
watch(() => authStore.user, (newUser) => {
  if (newUser && isLoading.value) {
    isLoading.value = false;
  }
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