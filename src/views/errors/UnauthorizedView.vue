<template>
  <div class="unauthorized-page d-flex flex-column justify-content-center align-items-center" style="height: 100vh; text-align: center; padding: 20px;">
    <h1 class="display-1 text-danger mb-4">Acesso Negado</h1>
    <p class="fs-4 mb-4">Você não tem permissão para acessar esta página.</p>
    <router-link to="/" class="btn btn-primary">Voltar para Home</router-link>
  </div>
</template>

<script setup>
// Nenhuma lógica adicional necessária por enquanto
</script>

<style scoped>
.unauthorized-page {
  background-color: #f8d7da;
  color: #721c24;
}
</style>
