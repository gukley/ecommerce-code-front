<template>
  <div class="reset-root d-flex min-vh-100 justify-content-center align-items-center">
    <div class="reset-card p-4">
      <h2 class="mb-4 text-gradient">Redefinir Senha</h2>
      <p class="text-muted mb-4">
        Insira sua nova senha para redefini-la.
      </p>
      <form @submit.prevent="handleReset">
        <div class="mb-3">
          <label for="password" class="form-label">Nova senha</label>
          <input
            v-model="password"
            type="password"
            id="password"
            class="form-control form-control-lg"
            placeholder="Digite sua nova senha"
            required
            minlength="6"
          />
        </div>
        <button type="submit" class="btn btn-gradient w-100" :disabled="loading">
          Redefinir senha
        </button>
      </form>
      <div v-if="message" class="mt-3 alert text-center" :class="success ? 'alert-success' : 'alert-danger'">
        {{ message }}
      </div>
      <router-link to="/login" class="mt-4 d-block text-center text-primary">
        <i class="bi bi-arrow-left"></i> Voltar ao login
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { resetPassword } from '@/services/apiService';

const route = useRoute();
const token = route.query.token || '';
const password = ref('');
const message = ref('');
const success = ref(false);
const loading = ref(false);

async function handleReset() {
  message.value = '';
  success.value = false;
  loading.value = true;
  try {
    await resetPassword({ token, new_password: password.value });
    message.value = 'Senha redefinida com sucesso! Você pode fazer login.';
    success.value = true;
  } catch (err) {
    message.value = err.response?.data?.detail || 'Erro ao redefinir senha.';
    success.value = false;
  }
  loading.value = false;
}
</script>

<style scoped>
.reset-root {
  background: linear-gradient(135deg, #f8fafc 0%, #e9f1ff 50%, #f3f4fa 100%);
  color: #23233a;
  font-family: 'Inter', sans-serif;
}

.reset-card {
  background: #ffffff;
  border-radius: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
  padding: 2rem;
  text-align: center;
}

.text-gradient {
  background: linear-gradient(90deg, #4a90e2, #6a5ae0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
}

.form-label {
  font-weight: 600;
  color: #23233a;
}

.form-control {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  color: #23233a;
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  font-size: 1rem;
}

.form-control:focus {
  background: #ffffff;
  border-color: #4a90e2;
  box-shadow: 0 0 0 0.2rem rgba(74, 144, 226, 0.25);
  outline: none;
}

.btn-gradient {
  background: linear-gradient(90deg, #4a90e2, #6a5ae0);
  color: #fff;
  font-weight: 600;
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.btn-gradient:hover {
  background: linear-gradient(90deg, #6a5ae0, #4a90e2);
  box-shadow: 0 4px 12px rgba(106, 90, 224, 0.3);
  transform: translateY(-2px);
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

.text-primary {
  color: #4a90e2 !important;
}

.text-primary:hover {
  color: #6a5ae0 !important;
  text-decoration: underline;
}
</style>
