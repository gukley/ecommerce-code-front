<template>
  <div id="app">
    <AppHeader v-if="!$route.meta.hideHeader" />

    <router-view />

    </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { onMounted } from 'vue';
import { useAuthStore } from './stores/authStore';
import ProductCard from './components/home/ProductCard.vue';

const route = useRoute();
const authStore = useAuthStore();

onMounted(() => {
  if (authStore.token) {
    authStore.getUserProfile();
  }
});
</script>

<style>

</style>