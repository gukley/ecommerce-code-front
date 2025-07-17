<template>
  <div class="d-flex min-vh-100 login-container">
    <div class="col-md-6 bg-left d-flex flex-column justify-content-center align-items-center p-5 text-white">
      <h1 class="display-1 fw-bold logo-text">GG<span class="text-primary-brand">TECH</span></h1>
      <p class="fs-5 mt-4 slogan-text text-center">
        Conecte-se à performance.<br />Equipe seu setup.<br />Potencialize seu jogo!
      </p>
    </div>
    <div class="col-md-6 d-flex justify-content-center align-items-center bg-right">
      <div class="form-card rounded-4 shadow p-5">
        <div class="text-center mb-4">
          <h2 class="fw-bold register-heading">Entrar na sua Conta</h2>
          <small class="register-subheading">Bem-vindo de volta à GGTECH</small>
        </div>
        <form @submit.prevent="handleLogin">
          <div class="mb-3 input-group-modern">
            <span class="input-group-text-modern">
              <i class="bi bi-person-fill"></i>
            </span>
            <input
              v-model="email"
              type="email"
              class="form-control input-custom"
              placeholder="Email ou usuário"
              required
            />
          </div>
          <div class="mb-3 input-group-modern">
            <span class="input-group-text-modern">
              <i class="bi bi-lock-fill"></i>
            </span>
            <input
              v-model="password"
              type="password"
              class="form-control input-custom"
              placeholder="Senha"
              required
            />
          </div>
          <button type="submit" class="btn btn-main-action w-100 rounded-pill">
            Entrar
          </button>
        </form>
        <div class="d-flex justify-content-between align-items-center mt-3 mb-2">
          <a href="#" class="forgot-password-link">Esqueceu a senha?</a>
          <router-link to="/" class="back-home-link">Voltar à Home</router-link>
        </div>
        <p class="text-center mt-4 mb-0 signup-text-bottom">
          Não tem uma conta?
          <router-link to="/register" class="login-link">Cadastre-se</router-link>
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
    localStorage.setItem('token', response.token)
    localStorage.setItem('user', JSON.stringify(response.user))

    toast.success('Login realizado com sucesso!')

    const redirectPath = router.currentRoute.value.query.redirect || '/'
    if (response.user && ['ADMIN', 'MODERATOR'].includes(response.user.role)) {
      router.push({ name: 'AdminDashboard' })
    } else {
      router.push(redirectPath)
    }
  } catch (error) {
    toast.error('Erro ao logar: ' + (error.response?.data?.message || error.message || 'Credenciais inválidas.'))
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

* {
  font-family: 'Inter', sans-serif;
  box-sizing: border-box;
}

.login-container {
  overflow: hidden;
}
.bg-left {
  background-color: #1a1a2e;
  animation: fadeInUp 1s ease forwards;
  color: #e0e0e0;
}
.logo-text {
  font-size: 4.5rem;
  letter-spacing: 2px;
  color: #ffffff;
  text-shadow: 0 0 20px rgba(123, 79, 224, 0.7);
  margin-bottom: 0;
}
.text-primary-brand {
  color: #8f5fe8 !important;
  text-shadow: 0 0 10px rgba(143, 95, 232, 0.5);
}
.slogan-text {
  max-width: 380px;
  font-size: 1.2rem;
  color: #b0b0b0;
  line-height: 1.6;
  margin-top: 1.5rem;
}
.bg-right {
  background-color: #24243a;
  position: relative;
  overflow: hidden;
}
.form-card {
  background-color: #1f1f33;
  color: white;
  width: 90%;
  max-width: 420px;
  padding: 3.5rem;
  border-radius: 15px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
  animation: fadeInUp 1s ease forwards;
  animation-delay: 0.3s;
  opacity: 0;
  border: 1px solid rgba(255, 255, 255, 0.08);
}
.register-heading {
  color: #ffffff;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}
.register-subheading {
  color: #a0a0a0;
  font-size: 0.95rem;
}
.input-group-modern {
  display: flex;
  margin-bottom: 1.2rem;
}
.input-group-text-modern {
  background-color: #2c2c42;
  border: 1px solid #3d3d5a;
  color: #c0c0c0;
  padding: 0.8rem 1.2rem;
  display: flex;
  align-items: center;
  border-top-left-radius: 50px;
  border-bottom-left-radius: 50px;
  font-size: 1.1rem;
}
.input-custom {
  background-color: #2c2c42;
  border: 1px solid #3d3d5a;
  border-left: none;
  color: white;
  padding: 0.8rem 1.2rem;
  flex-grow: 1;
  border-top-right-radius: 50px;
  border-bottom-right-radius: 50px;
  font-size: 1rem;
  transition: all 0.3s ease;
}
.input-custom:focus {
  background-color: #35354d;
  border-color: #8f5fe8;
  box-shadow: 0 0 0 0.25rem rgba(143, 95, 232, 0.25);
  outline: none;
}
.input-custom::placeholder {
  color: #808080;
}
.btn-main-action {
  background: linear-gradient(90deg, #a362ff, #8f5fe8);
  color: #fff;
  border: 2px solid #cbb6ff;
  font-weight: 600;
  padding: 0.8rem 0;
  font-size: 1.1rem;
  transition: background-color 0.3s ease, transform 0.2s ease;
  margin-top: 1.5rem;
  box-shadow: 0 4px 16px rgba(163,98,255,0.18);
}

.btn-main-action:hover {
  background: linear-gradient(90deg, #8f5fe8, #a362ff);
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(163,98,255,0.28);
}
.forgot-password-link, .back-home-link {
  color: #8f5fe8;
  font-size: 0.98rem;
  text-decoration: none;
  transition: color 0.2s;
}
.forgot-password-link:hover, .back-home-link:hover {
  color: #00ffe1;
  text-decoration: underline;
}
.signup-text-bottom {
  color: #b0b0b0;
  font-size: 0.9rem;
  margin-top: 2rem !important;
}
.login-link {
  color: #8f5fe8;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}
.login-link:hover {
  color: #7b4fe0;
  text-decoration: underline;
}
@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
