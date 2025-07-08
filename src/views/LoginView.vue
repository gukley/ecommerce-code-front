<template>
  <div class="d-flex min-vh-100">
    <!-- Lado esquerdo -->
    <div class="col-md-6 bg-left d-flex flex-column justify-content-center align-items-center p-5 text-white">
      <h1 class="display-1 fw-bold logo-text">GG<span class="text-primary">TECH</span></h1>
      <p class="fs-5 mt-4 slogan-text text-center">
        Conectamos você à performance.<br />
        Equipamos seu setup.<br />
        Potencializamos seu jogo!
      </p>
    </div>

    <!-- Lado direito -->
    <div class="col-md-6 d-flex justify-content-center align-items-center bg-right">
      <div class="form-card rounded-4 shadow p-5">
        <div class="text-center mb-5">
          <h2 class="fw-bold text-primary">Entrar</h2>
          <small class="text-light">Acesse sua conta GGTECH</small>
        </div>

        <form @submit.prevent="handleLogin">
          <div class="mb-3">
            <div class="input-group">
              <span class="input-group-text bg-secondary border-0 text-white rounded-start"> 
                <i class="bi bi-person"></i>
              </span>
            <input
              v-model="email"
              type="email"
              class="form-control input-custom"
              placeholder="Email ou usuário"
              required
            />
          </div>
          </div>

          <div class="mb-3">
            <div class="input-group"> 
              <span class="input-group-text bg-secondary border-0 text-white rounded-start"> 
                <i class="bi bi-lock"></i>
              </span>
            <input
              v-model="password"
              type="password"
              class="form-control input-custom"
              placeholder="Senha"
              required
            />
          </div>
        </div>

          <div class="d-flex justify-content-between align-items-center mb-3">
            <div class="form-check">
              <input type="checkbox" class="form-check-input" id="rememberMe" />
              <label class="form-check-label text-white-50" for="rememberMe">Lembre-me</label>
            </div>
            <a href="#" class="text-primary small">Esqueceu a senha?</a>
          </div>

          <button type="submit" class="btn btn-primary w-100 rounded-pill">
            Login
          </button>
        </form>

        <p class="text-center mt-4 mb-0 text-white-50">
          Não tem uma conta?
          <router-link to="/register" class="text-primary text-decoration-none">Cadastre-se</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '@/services/apiService'
import { useToast } from 'vue-toastification'

const router = useRouter()
const email = ref('')
const password = ref('')
const toast = useToast()

const handleLogin = async () => {
  try {
    const response = await login({ email: email.value, password: password.value })
    localStorage.setItem('token', response.access_token)
    toast.success('Login realizado com sucesso!')
    router.push('/')
  } catch (error) {
    toast.error('Erro ao logar: ' + (error.response?.data?.message || error.message))
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');

* {
  font-family: 'Inter', sans-serif;
}

.bg-left {
  background: linear-gradient(135deg, #1e1e2f, #2e2e4f, #1e1e2f);
  background-size: 400% 400%;
  animation: gradientMove 15s ease infinite;
}

.bg-right {
  background-color: #2b2b3d;
}

.logo-text {
  font-size: 3.5rem;
  letter-spacing: 1px;
  text-shadow: 0 0 10px #8f5fe8, 0 0 20px #8f5fe8;
}

.text-primary {
  color: #8f5fe8 !important;
}

.btn-primary {
  background-color: #8f5fe8;
  border: none;
}

.btn-primary:hover {
  background-color: #7b4fe0;
}

.form-card {
  background-color: #3b3b4d;
  color: white;
  width: 90%;
  max-width: 400px;
  animation: fadeSlide 0.8s ease-out
}

.input-custom {
  background-color: #4a4a5c;
  border: none;
  color: white;
  border-radius: 50px;
  padding: 12px 20px;
}

.input-custom::placeholder {
  color: #c0c0c0;
}

.slogan-text {
  max-width: 300px;
  font-size: 1.1rem;
  color: #d0d0d0;
}

@keyframes fadeSlide { 
  0% { 
    opacity: 0;
    transform: translateY(40px);
  }
  100% { 
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes gradientMove { 
  0% { 
    background-position: 0% 50%;
  }
  50% { 
    background-position: 100% 50%;
  }
  100% { 
    background-position: 0% 50%;
  }
}

.login-wrapper { 
  background: linear-gradient(270deg, #1f1c2c, #2b1f4d, #0b2c35);
  background-size: 600% 600%;
  animation: gradientMove 15s ease infinite;
}

.input-group-text {
  background-color: #4a4a5c;
  border: none;
  color: white;
  border-radius: 50px 0 0 50px;
  padding: 0 15px;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
