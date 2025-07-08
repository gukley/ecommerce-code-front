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
        <div class="text-center mb-4">
          <h2 class="fw-bold text-primary">Cadastro</h2>
          <small class="text-light">Crie sua conta GGTECH</small>
        </div>

        <form @submit.prevent="handleRegister">
          <div class="mb-3">
            <input
              v-model="name"
              type="text"
              class="form-control input-custom"
              placeholder="Nome completo"
              required
            />
          </div>

          <div class="mb-3">
            <input
              v-model="email"
              type="email"
              class="form-control input-custom"
              placeholder="Email"
              required
            />
          </div>

          <div class="mb-3">
            <input
              v-model="password"
              type="password"
              class="form-control input-custom"
              placeholder="Senha"
              required
            />
          </div>

          <div class="mb-3">
            <input
              v-model="confirmPassword"
              type="password"
              class="form-control input-custom"
              placeholder="Confirme a senha"
              required
            />
          </div>

          <button type="submit" class="btn btn-primary w-100 rounded-pill">
            Cadastrar
          </button>
        </form>

        <p class="text-center mt-4 mb-0 text-white-50">
          Já tem uma conta?
          <router-link to="/login" class="text-primary text-decoration-none">Entrar</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { register } from '@/services/apiService'
import { useToast } from 'vue-toastification'

const router = useRouter()
const toast = useToast()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const handleRegister = async () => {
  if (password.value !== confirmPassword.value) {
    toast.error('As senhas não coincidem!')
    return
  }

  try {
    await register({
      name: name.value,
      email: email.value,
      password: password.value,
    })

    toast.success('Conta cirada com sucesso')
    router.push('/login')
  } catch (error) {
    toast.error('Erro ao cadastrar: ' + (error.response?.data?.message || error.message))
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');

* {
  font-family: 'Inter', sans-serif;
}

.bg-left {
  background-color: #1e1e2f;
  animation: fadeInUp 1s ease forwards
}

.bg-right {
  background-color: #2b2b3d;
}

.logo-text {
  font-size: 3.5rem;
  letter-spacing: 1px;
}

.text-primary {
  color: #8f5fe8 !important;
}

.btn-primary {
  background-color: #8f5fe8;
  border: none;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.btn-primary:hover {
  background-color: #7b4fe0;
}

.form-card {
  background-color: #3b3b4d;
  color: white;
  width: 90%;
  max-width: 400px;
  animation: fadeInUp 1s ease forwards;
  animation-delay: 0.3s;
  opacity: 0;
}

.input-custom {
  background-color: #4a4a5c;
  border: none;
  color: white;
  border-radius: 50px;
  padding: 12px 20px;
  transition: box-shadow 0.3s ease, background-color 0.3s ease;
}

.input-custom::placeholder {
  color: #c0c0c0;
}

.slogan-text {
  max-width: 300px;
  font-size: 1.1rem;
  color: #d0d0d0;
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
