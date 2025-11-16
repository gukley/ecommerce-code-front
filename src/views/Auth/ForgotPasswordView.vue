<template>
  <div class="forgot-root d-flex min-vh-100 justify-content-center align-items-center">
    <div class="forgot-card p-4">
      <h2 class="mb-4 text-gradient">Recuperar Senha</h2>
      <p class="text-muted mb-4">
        Insira o e-mail cadastrado para receber instruções de recuperação.
      </p>
      <form @submit.prevent="handleForgot">
        <div class="mb-3">
          <label for="email" class="form-label">E-mail cadastrado</label>
          <input
            v-model="email"
            type="email"
            id="email"
            class="form-control form-control-lg"
            placeholder="Digite seu e-mail"
            required
          />
        </div>
        <button type="submit" class="btn btn-gradient w-100">Enviar recuperação</button>
      </form>
      <div v-if="message" class="mt-3 alert alert-info text-center">{{ message }}</div>
      <router-link to="/login" class="mt-4 d-block text-center text-primary">
        <i class="bi bi-arrow-left"></i> Voltar ao login
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { forgotPassword } from '@/services/apiService';

const email = ref('');
const message = ref('');

async function handleForgot() {
  try {
    await forgotPassword({ email: email.value });
    message.value = 'Se o e-mail existir, você receberá instruções para redefinir sua senha.';
  } catch (err) {
    message.value = err.response?.data?.detail || 'Erro ao enviar recuperação.';
  }
}
</script>

<style scoped>
.forgot-root {
  background: linear-gradient(135deg, #f8fafc 0%, #e9f1ff 50%, #f3f4fa 100%);
  color: #23233a;
  font-family: 'Inter', sans-serif;
}

.forgot-card {
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

.alert-info {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  color: #4a90e2;
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  font-size: 0.95rem;
}

.text-primary {
  color: #4a90e2 !important;
}

.text-primary:hover {
  color: #6a5ae0 !important;
  text-decoration: underline;
}
</style>
