<template>
  <div class="login-root d-flex min-vh-100">
    <div class="login-left d-none d-md-flex flex-column justify-content-center align-items-center p-5">
      <div class="login-left-bg"></div>
      <div class="login-left-content z-index-1 w-100 d-flex flex-column justify-content-center align-items-center">
        <h1 class="ggtech-logo">
          GG<span class="text-secondary-highlight">TECH</span>
        </h1>
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
                <stop offset="0%" stop-color="#4f8cff"/>
                <stop offset="100%" stop-color="#a362ff"/>
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
              <i class="fa-regular fa-user"></i>
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
              <i class="fa-regular fa-lock"></i>
            </span>
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              class="login-input"
              placeholder="Senha"
              required
            />
            <span class="login-input-icon login-eye" @click="togglePassword">
              <i :class="showPassword ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye'"></i>
            </span>
          </div>
          <button type="submit" class="login-btn" :disabled="isSubmitting">
            {{ isSubmitting ? 'Entrando...' : 'Entrar' }}
          </button>
        </form>
        <div class="login-links d-flex justify-content-between align-items-center mt-3 mb-2">
          <router-link to="/forgot-password" class="login-link">Esqueceu a senha?</router-link>
          <router-link to="/register" class="login-link login-link-right">Cadastre-se</router-link>
        </div>
        <div class="text-center mt-3">
          <router-link to="/" class="login-link-home">Ir para a Home</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/authStore' // usar a store para centralizar lógica

const router = useRouter()
const authStore = useAuthStore()
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const isSubmitting = ref(false)
const toast = useToast()

const togglePassword = () => { showPassword.value = !showPassword.value }

// Handler recomendado: usa authStore.loginUser(...) que já normaliza e salva tokens
const handleLogin = async () => {
  try {
    isSubmitting.value = true
    // aguarda a store processar o login e salvar tokens/user no localStorage
    await authStore.loginUser(email.value, password.value)

    toast.success('Login realizado com sucesso!')

    // determina redirecionamento
    const redirectPath = router.currentRoute.value.query.redirect || '/'
    // usa user que a store salvou (ou localStorage)
    const user = authStore.user || JSON.parse(localStorage.getItem('user') || 'null')

    if (user && ['ADMIN', 'MODERATOR'].includes(user.role)) {
      await router.push({ name: 'AdminDashboard' })
    } else {
      await router.push(redirectPath)
    }
  } catch (error) {
    console.error('Login error:', error)
    if (error.response?.status === 401) {
      toast.error('Erro: Credenciais inválidas. Tente novamente.')
    } else {
      toast.error('Erro ao logar: ' + (error.response?.data?.message || error.message || 'Ocorreu um erro inesperado.'))
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Poppins:wght@400;600;700&family=Nunito+Sans:wght@400;600;700&display=swap');
/* Font Awesome CDN (para ícones minimalistas) */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css');

.login-root {
  background: linear-gradient(120deg, #f8fafc 60%, #e9f1ff 100%);
  min-height: 100vh;
  font-family: 'Inter', 'Poppins', 'Nunito Sans', sans-serif;
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
  background: radial-gradient(circle at 60% 40%, #4f8cff22 0%, #a362ff22 60%, transparent 100%);
  z-index: 0;
  opacity: 1;
}
.login-left-content {
  position: relative;
  z-index: 1;
  text-align: center;
}
.ggtech-logo {
  font-family: 'Orbitron', sans-serif;
  font-size: 3rem; /* Aumentado de 2rem para 3rem */
  color: #333333; /* Texto escuro */
  letter-spacing: 1.5px; /* Aumentado para maior destaque */
  display: inline-block;
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.2));
}
.text-secondary-highlight {
  color: #399bff; /* Destaque azul */
}
.login-slogan {
  color: #3b3b4f;
  font-size: 1.15rem;
  font-weight: 400;
  margin-top: 1.5rem;
  line-height: 1.6;
  text-shadow: none;
  letter-spacing: 0.2px;
}

.login-right {
  flex: 1 1 0;
  background: none;
  min-width: 0;
  justify-content: center;
  align-items: center;
  display: flex;
}

.login-card {
  background: #fff;
  border-radius: 1.5rem;
  box-shadow: 0 4px 32px 0 rgba(79, 140, 255, 0.08), 0 1.5px 8px 0 rgba(163, 98, 255, 0.07);
  padding: 2.5rem 2rem 2rem 2rem;
  max-width: 430px;
  width: 100%;
  border: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.login-avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  margin: 0 auto 1.1rem auto;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  box-shadow: 0 2px 12px #4f8cff22;
}

.login-title {
  color: #23233a;
  font-size: 1.7rem;
  font-weight: 700;
  margin-bottom: 0.3rem;
  letter-spacing: 0.5px;
  font-family: 'Poppins', 'Inter', sans-serif;
}
.login-subtitle {
  color: #6b6b8d;
  font-size: 1rem;
  font-weight: 400;
  letter-spacing: 0.2px;
}
.login-logo-small {
  background: linear-gradient(90deg, #4f8cff 0%, #a362ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
  font-family: 'Poppins', 'Inter', sans-serif;
}

.login-input-group {
  display: flex;
  align-items: center;
  background: #f5f7fa;
  border-radius: 2rem;
  margin-bottom: 1.1rem;
  border: 1.2px solid #e0e7ef;
  padding: 0 0.2rem;
  position: relative;
  transition: border 0.18s;
}
.login-input-group:focus-within {
  border: 1.5px solid #a362ff;
}
.login-input-icon {
  color: #8fa2c7;
  font-size: 1.18rem;
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
  color: #a362ff;
  font-size: 1.18rem;
  padding: 0;
}
.login-eye:hover {
  color: #4f8cff;
}
.login-input {
  background: transparent;
  border: none;
  color: #23233a;
  font-size: 1.05rem;
  font-weight: 500;
  padding: 0.9rem 1rem 0.9rem 0.2rem;
  flex: 1 1 0;
  border-radius: 2rem;
  outline: none;
  box-shadow: none;
  transition: background 0.18s, color 0.18s;
  font-family: 'Inter', 'Nunito Sans', sans-serif;
}
.login-input:focus {
  background: #f0f4ff;
  color: #23233a;
}
.login-input::placeholder {
  color: #b0b0c7;
  font-weight: 400;
  letter-spacing: 0.5px;
  opacity: 1;
}

.login-btn {
  width: 100%;
  border: none;
  border-radius: 2rem;
  background: linear-gradient(90deg, #4f8cff 0%, #a362ff 100%);
  color: #fff;
  font-size: 1.13rem;
  font-weight: 700;
  padding: 0.9rem 0;
  margin-top: 1.1rem;
  box-shadow: 0 2px 12px #a362ff22;
  transition: background 0.22s, box-shadow 0.18s, transform 0.18s;
  position: relative;
  overflow: hidden;
  font-family: 'Poppins', 'Inter', sans-serif;
  letter-spacing: 0.2px;
}
.login-btn:hover {
  background: linear-gradient(90deg, #a362ff 0%, #4f8cff 100%);
  box-shadow: 0 6px 18px #4f8cff22;
  transform: translateY(-1px) scale(1.02);
}

.login-links {
  width: 100%;
  margin-top: 1.1rem;
  font-size: 1.01rem;
}
.login-link {
  color: #4f8cff;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
  font-family: 'Inter', 'Nunito Sans', sans-serif;
}
.login-link:hover {
  color: #a362ff;
  text-decoration: underline;
}
.login-link-right {
  margin-left: auto;
}
.login-link-home {
  color: #399bff;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.2s;
}
.login-link-home:hover {
  color: #6a5ae0;
  text-decoration: underline;
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
@media (max-width: 600px) {
  .login-card {
    max-width: 100vw;
    border-radius: 0.7rem;
    padding: 2rem 0.7rem 1.5rem 0.7rem;
    box-shadow: 0 2px 12px 0 rgba(79, 140, 255, 0.10);
  }
  .login-root {
    padding: 0;
  }
}
</style>

