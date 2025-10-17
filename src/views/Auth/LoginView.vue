<template>
  <div class="login-root d-flex min-vh-100">
    <div class="login-left d-none d-md-flex flex-column justify-content-center align-items-center p-5">
      <div class="login-left-bg"></div>
      <div class="login-left-content z-index-1 w-100 d-flex flex-column justify-content-center align-items-center">
        <h1 class="login-logo">GGTECH</h1>
        <p class="login-slogan">
          Conecte-se à performance.<br />
          Equipe seu setup.<br />
          Potencialize seu jogo!
        </p>
      </div>
    </div>
    <div class="login-right d-flex justify-content-center align-items-center">
      <div class="login-card">
        <div class="login-avatar">
          <svg width="64" height="64" viewBox="0 0 64 64">
            <defs>
              <radialGradient id="avatarGradient" cx="50%" cy="50%" r="80%">
                <stop offset="0%" stop-color="#a362ff"/>
                <stop offset="100%" stop-color="#00ffe1"/>
              </radialGradient>
            </defs>
            <circle cx="32" cy="32" r="32" fill="url(#avatarGradient)" />
            <circle cx="32" cy="26" r="10" fill="#fff" opacity="0.9"/>
            <ellipse cx="32" cy="44" rx="14" ry="8" fill="#fff" opacity="0.7"/>
          </svg>
        </div>
        <div class="text-center mb-4">
          <h2 class="login-title">Entrar na sua Conta</h2>
          <small class="login-subtitle">Bem-vindo de volta a <span class="login-logo-small">GGTECH</span></small>
        </div>
        <form @submit.prevent="handleLogin">
          <div class="login-input-group">
            <span class="login-input-icon">
              <i class="bi bi-person-fill"></i>
            </span>
            <input
              v-model="email"
              type="email"
              class="login-input"
              placeholder="Email ou usuário"
              required
            />
          </div>
          <div class="login-input-group">
            <span class="login-input-icon">
              <i class="bi bi-lock-fill"></i>
            </span>
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              class="login-input"
              placeholder="Senha"
              required
            />
            <span class="login-input-icon login-eye" @click="togglePassword">
              <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
            </span>
          </div>
          <button type="submit" class="login-btn">
            Entrar
          </button>
        </form>
        <div class="login-links d-flex justify-content-between align-items-center mt-3 mb-2">
          <a href="#" class="login-link">Esqueceu a senha?</a>
          <router-link to="/register" class="login-link login-link-right">Cadastre-se</router-link>
        </div>
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
const showPassword = ref(false)
const toast = useToast()

const togglePassword = () => { showPassword.value = !showPassword.value }

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
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');

.login-root {
  background: linear-gradient(120deg, #0a0a1a 60%, #1a1a2e 100%);
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
}

.login-left {
  flex: 1 1 0;
  position: relative;
  background: transparent;
  overflow: hidden;
  min-width: 0;
  justify-content: center;
  align-items: center;
}
.login-left-bg {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 60% 40%, #a362ff33 0%, #00ffe133 60%, transparent 100%);
  z-index: 0;
  opacity: 1;
}
.login-left-content {
  position: relative;
  z-index: 1;
  text-align: center;
}
.login-logo {
  font-size: 3.5rem;
  font-weight: 700;
  letter-spacing: 2px;
  background: linear-gradient(90deg, #399bff 0%, #a362ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1.2rem;
}
.login-slogan {
  color: #e0e0e0;
  font-size: 1.25rem;
  font-weight: 400;
  margin-top: 1.5rem;
  line-height: 1.6;
  text-shadow: 0 0 18px #a362ff33;
}

.login-right {
  flex: 1 1 0;
  background: linear-gradient(120deg, #18182c 60%, #1a1a2e 100%);
  min-width: 0;
  justify-content: center;
  align-items: center;
  display: flex;
}

.login-card {
  background: rgba(31, 31, 51, 0.92);
  border-radius: 2rem;
  box-shadow: 0 8px 32px 0 rgba(163, 98, 255, 0.18);
  padding: 2.8rem 2.2rem 2.2rem 2.2rem;
  max-width: 400px;
  width: 100%;
  border: 1.5px solid rgba(255,255,255,0.07);
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.login-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin: 0 auto 1.2rem auto;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  box-shadow: 0 2px 18px #a362ff33;
}

.login-title {
  color: #fff;
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 0.3rem;
  letter-spacing: 0.5px;
}
.login-subtitle {
  color: #b0b0b0;
  font-size: 1rem;
  font-weight: 400;
  letter-spacing: 0.2px;
}
.login-logo-small {
  background: linear-gradient(90deg, #399bff 0%, #a362ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
}

.login-input-group {
  display: flex;
  align-items: center;
  background: rgba(44,44,66,0.85);
  border-radius: 2.2rem;
  margin-bottom: 1.3rem;
  border: 1.5px solid #3d3d5a;
  padding: 0 0.2rem;
  position: relative;
}
.login-input-icon {
  color: #b0b0b0;
  font-size: 1.25rem;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: color 0.18s;
}
.login-eye {
  position: absolute;
  right: 0.7rem;
  top: 50%;
  transform: translateY(-50%);
  color: #8f5fe8;
  font-size: 1.25rem;
  padding: 0;
}
.login-eye:hover {
  color: #00ffe1;
}
.login-input {
  background: transparent;
  border: none;
  color: #fff;
  font-size: 1.08rem;
  font-weight: 500;
  padding: 0.95rem 1rem 0.95rem 0.2rem;
  flex: 1 1 0;
  border-radius: 2.2rem;
  outline: none;
  box-shadow: none;
  transition: background 0.18s, color 0.18s;
}
.login-input:focus {
  background: rgba(44,44,66,0.98);
  color: #fff;
}
.login-input::placeholder {
  color: #b0b0b0;
  font-weight: 400;
  letter-spacing: 0.5px;
  opacity: 1;
}

.login-btn {
  width: 100%;
  border: none;
  border-radius: 2rem;
  background: linear-gradient(90deg, #a362ff 0%, #00ffe1 100%);
  color: #fff;
  font-size: 1.18rem;
  font-weight: 700;
  padding: 0.95rem 0;
  margin-top: 1.2rem;
  box-shadow: 0 4px 18px #a362ff33;
  transition: background 0.22s, box-shadow 0.18s, transform 0.18s;
  position: relative;
  overflow: hidden;
}
.login-btn:hover {
  background: linear-gradient(90deg, #00ffe1 0%, #a362ff 100%);
  box-shadow: 0 8px 28px #00ffe144;
  transform: translateY(-2px) scale(1.03);
}

.login-links {
  width: 100%;
  margin-top: 1.2rem;
  font-size: 1.02rem;
}
.login-link {
  color: #8f5fe8;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}
.login-link:hover {
  color: #00ffe1;
  text-decoration: underline;
}
.login-link-right {
  margin-left: auto;
}

@media (max-width: 991.98px) {
  .login-left {
    display: none !important;
  }
  .login-right {
    flex: 1 1 100%;
    min-width: 0;
  }
}
</style>

