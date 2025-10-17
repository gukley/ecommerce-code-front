<template>
  <div class="forgot-root d-flex min-vh-100 justify-content-center align-items-center">
    <div class="forgot-card p-4">
      <h2 class="mb-3">Recuperar Senha</h2>
      <form @submit.prevent="handleForgot">
        <div class="mb-3">
          <label for="email" class="form-label">E-mail cadastrado</label>
          <input v-model="email" type="email" id="email" class="form-control" required />
        </div>
        <button type="submit" class="btn btn-primary w-100">Enviar recuperação</button>
      </form>
      <div v-if="message" class="mt-3 alert alert-info">{{ message }}</div>
      <router-link to="/login" class="mt-3 d-block text-center">Voltar ao login</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { forgotPassword } from '@/services/apiService' // Implemente esse método
const email = ref('')
const message = ref('')

async function handleForgot() {
  try {
    await forgotPassword({ email: email.value })
    message.value = 'Se o e-mail existir, você receberá instruções para redefinir sua senha.'
  } catch (err) {
    message.value = err.response?.data?.detail || 'Erro ao enviar recuperação.'
  }
}
</script>

<style scoped>
.forgot-root {
  background: linear-gradient(120deg, #0a0a1a 60%, #1a1a2e 100%);
}
.forgot-card {
  background: #fff;
  border-radius: 1.2rem;
  box-shadow: 0 4px 24px #399bff20;
  max-width: 350px;
  width: 100%;
}
</style>
