<template>
  <div class="register-page min-vh-100 d-flex align-items-center justify-content-center">
    <div class="register-card shadow-lg p-4">
      <div class="text-center mb-4">
        <img src="https://i.imgur.com/your-logo.png" alt="GGTech Logo" class="mb-2" style="width: 60px; height: 60px;"> <h2 class="ggtech-title mb-1">GGtech</h2>
        <p class="register-prompt">Junte-se à elite gamer</p>
      </div>

      <form @submit.prevent="handleRegister">
        <div class="mb-3">
          <label for="name" class="form-label register-label">Nome</label>
          <input
            v-model="registerForm.name"
            type="text"
            class="form-control register-input"
            id="name"
            placeholder="Seu nome"
            required
          />
        </div>

        <div class="mb-3">
          <label for="email" class="form-label register-label">Email</label>
          <input
            v-model="registerForm.email"
            type="email"
            class="form-control register-input"
            id="email"
            placeholder="gamer@ggtech.com"
            required
          />
        </div>

        <div class="mb-3">
          <label for="password" class="form-label register-label">Senha</label>
          <input
            v-model="registerForm.password"
            type="password"
            class="form-control register-input"
            id="password"
            placeholder="••••••••"
            required
          />
        </div>

        <div class="mb-4"> <label for="confirmPassword" class="form-label register-label">Confirmar Senha</label>
          <input
            v-model="registerForm.confirmPassword"
            type="password"
            class="form-control register-input"
            id="confirmPassword"
            placeholder="••••••••"
            required
          />
        </div>

        <div class="d-grid mt-4">
          <button class="btn register-button" type="submit" :disabled="loading">
            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
            <i class="bi bi-person-fill me-2"></i> CRIAR CONTA
          </button>
        </div>

        <div class="text-center mt-3 register-divider">
          <span>ou</span>
        </div>

        <div class="text-center mt-3">
          <p class="has-account-text">
            Já tem uma conta? <router-link to="/login" class="login-link">Entrar</router-link>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useToast } from 'vue-toastification'

const toast = useToast();
const registerForm = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '' 
})

const loading = ref(false)

const handleRegister = async () => {
  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    toast.error('As senhas não coincidem!')
    return;
  }

  loading.value = true
  try {
    // Simula uma chamada de API
    await new Promise(resolve => setTimeout(resolve, 1500))
    toast.success('Conta criada com sucesso!')
    registerForm.value = { name: '', email: '', password: '', confirmPassword: '' }
  } catch (err) {
    toast.error('Erro ao criar conta. Tente novamente.')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-page {
  background: linear-gradient(to right, #4a008a, #7a00ff, #0056b3); 
  color: #e0e0e0; /* Cor do texto geral para contraste */
}

.register-card {
  background-color: #2a0050; 
  border-radius: 1rem; 
  max-width: 450px; 
  width: 100%;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5); 
  padding: 2.5rem; /* Aumenta o padding */
  border: 1px solid rgba(255, 255, 255, 0.1); 
}

.ggtech-title {
  font-size: 2.5rem;
  font-weight: bold;
  color: #ffffff; 
}

.register-prompt {
  color: #b0b0b0; 
  font-size: 1rem;
}

.register-label {
  color: #b0b0b0; 
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
  display: block; 
}

.register-input {
  background-color: #3b006b; /* Fundo dos inputs, igual ao da tela de login */
  border: 1px solid #5a00a0; /* Borda dos inputs, igual ao da tela de login */
  color: #ffffff; /* Cor do texto digitado */
  padding: 0.75rem 1rem; /* Padding interno dos inputs */
  border-radius: 0.5rem; /* Bordas arredondadas dos inputs */
}

.register-input::placeholder {
  color: #808080; /* Cor do placeholder */
}

.register-button {
  background: linear-gradient(to right, #00c6ff, #0072ff); /* Gradiente do botão, similar ao de login */
  border: none;
  color: white;
  padding: 1rem 1.5rem;
  font-size: 1.1rem;
  font-weight: bold;
  border-radius: 0.75rem; 
  transition: all 0.3s ease;
  text-transform: uppercase; 
}

.register-button:hover {
  background: linear-gradient(to right, #00aaff, #005bbd); 
  transform: translateY(-2px); 
}

.register-divider {
  position: relative;
  margin: 2rem 0;
  color: #909090;
  font-size: 0.9rem;
}

.register-divider::before,
.register-divider::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 40%;
  height: 1px;
  background-color: #505050;
}

.register-divider::before {
  left: 0;
}

.register-divider::after {
  right: 0;
}

.has-account-text {
  color: #b0b0b0;
  font-size: 0.95rem;
}

.login-link {
  color: #00c6ff; 
  font-weight: bold;
  text-decoration: none;
}

.login-link:hover {
  text-decoration: underline;
  color: #0099e6;
}
</style>