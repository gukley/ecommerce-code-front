<template>
  <div class="reset-root d-flex min-vh-100 justify-content-center align-items-center">
    <div class="reset-card p-4">
      <h2 class="mb-3">Redefinir Senha</h2>
      <form @submit.prevent="handleReset">
        <div class="mb-3">
          <label for="password" class="form-label">Nova senha</label>
          <input v-model="password" type="password" id="password" class="form-control" required minlength="6" />
        </div>
        <button type="submit" class="btn btn-primary w-100" :disabled="loading">Redefinir senha</button>
      </form>
      <div v-if="message" class="mt-3 alert" :class="success ? 'alert-success' : 'alert-danger'">{{ message }}</div>
      <router-link to="/login" class="mt-3 d-block text-center">Voltar ao login</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { resetPassword } from '@/services/apiService'

const route = useRoute()
const token = route.query.token || ''
const password = ref('')
const message = ref('')
const success = ref(false)
const loading = ref(false)

async function handleReset() {
  message.value = ''
  success.value = false
  loading.value = true
  try {
    await resetPassword({ token, new_password: password.value })
    message.value = 'Senha redefinida com sucesso! Você pode fazer login.'
    success.value = true
  } catch (err) {
    message.value = err.response?.data?.detail || 'Erro ao redefinir senha.'
    success.value = false
  }
  loading.value = false
}
</script>

<style scoped>
.reset-root {
  background: linear-gradient(120deg, #0a0a1a 60%, #1a1a2e 100%);
}
.reset-card {
  background: #fff;
  border-radius: 1.2rem;
  box-shadow: 0 4px 24px #399bff20;
  max-width: 350px;
  width: 100%;
}
.alert {
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.95rem;
  margin-top: 1rem;
}
.alert-success {
  background: #f0fdf4;
  color: #16a34a;
  border: 1px solid #bbf7d0;
}
.alert-danger {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}
</style>
