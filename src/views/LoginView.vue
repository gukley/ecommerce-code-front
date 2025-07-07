  <template>
    <div class="login-page min-vh-100 d-flex align-items-center justify-content-center">
      <div class="login-card shadow-lg p-5">
        <div class="text-center mb-4">
          <img src="https://i.imgur.com/your-logo.png" alt="GGTech Logo" class="mb-2" style="width: 60px; height: 60px;"> <h2 class="ggtech-title mb-1">GGtech</h2>
          <p class="login-prompt">Faça login para continuar</p>
        </div>

        <form @submit.prevent="handleLogin">
          <div class="mb-3">
            <label for="email" class="form-label login-label">Email</label>
            <input
              v-model="loginForm.email"
              type="email"
              class="form-control login-input"
              id="email"
              placeholder="player@ggtech.com"
              required
            />
          </div>

          <div class="mb-3">
            <label for="password" class="form-label login-label">Senha</label>
            <input
              v-model="loginForm.password"
              :type="showPassword ? 'text' : 'password'"
              class="form-control login-input"
              id="password"
              placeholder="••••••••"
              required
            />
          </div>

          <div class="d-grid mt-4">
            <button class="btn login-button" type="submit" :disabled="loading">
              <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
              ENTRAR
            </button>
          </div>

          <div class="text-center mt-3 login-divider">
            <span>Ou</span>
          </div>

          <div class="text-center mt-3">
            <p class="no-account-text">
              Não tem uma conta? <router-link to="/register" class="register-link">Cadastre-se agora</router-link>
            </p>
          </div>
        </form>
      </div>
    </div>
  </template>

  <script setup>
  import { ref } from 'vue'
  import { useToast } from 'vue-toastification';

  const loginForm = ref({
    email: '',
    password: ''
  })

  const showPassword = ref(false)
  const loading = ref(false)
  const toast = useToast();

  const handleLogin = async () => {
    loading.value = true
    try {
      // Simula uma chamada de API
      await new Promise(resolve => setTimeout(resolve, 1500))
      toast.success('Login realizado com sucesso!', {
        timeout: 3000 
      })
      loginForm.value = { email: '', password: '' }
    } catch (err) {
      toast.error('Erro ao fazer login! Verifique suas credenciais.', {
        timeout: 3000 
      })
    } finally {
      loading.value = false
    }
  }
  </script>

  <style scoped>
  .login-page {
    background: linear-gradient(to right, #4a008a, #7a00ff, #0056b3); 
    color: #e0e0e0; 
  }

  .login-card {
    background-color: #2a0050; 
    border-radius: 1rem; 
    max-width: 400px;
    width: 100%;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.5); 
    padding: 2.5rem; 
    border: 1px solid rgba(255, 255, 255, 0.1); 
  }

  .ggtech-title {
    font-size: 2.5rem; 
    font-weight: bold;
    color: #ffffff; 
  }

  .login-prompt {
    color: #b0b0b0; 
    font-size: 1rem;
  }

  .login-label {
    color: #b0b0b0; 
    font-size: 0.95rem;
    margin-bottom: 0.5rem;
    display: block;
  }

  .login-input {
    background-color: #3b006b; /* Fundo dos inputs */
    border: 1px solid #5a00a0; /* Borda dos inputs */
    color: #ffffff; /* Cor do texto digitado */
    padding: 0.75rem 1rem; /* Padding interno dos inputs */
    border-radius: 0.5rem; /* Bordas arredondadas dos inputs */
  }

  .login-input::placeholder {
    color: #808080; /* Cor do placeholder */
  }

  .login-button {
    background: linear-gradient(to right, #00c6ff, #0072ff); /* Gradiente do botão */
    border: none;
    color: white;
    padding: 1rem 1.5rem;
    font-size: 1.1rem;
    font-weight: bold;
    border-radius: 0.75rem; /* Bordas arredondadas do botão */
    transition: all 0.3s ease;
    text-transform: uppercase; /* Texto em maiúsculas */
  }

  .login-button:hover {
    background: linear-gradient(to right, #00aaff, #005bbd); /* Escurece no hover */
    transform: translateY(-2px); /* Efeito sutil no hover */
  }

  .login-divider {
    position: relative;
    margin: 2rem 0;
    color: #909090;
    font-size: 0.9rem;
  }

  .login-divider::before,
  .login-divider::after {
    content: '';
    position: absolute;
    top: 50%;
    width: 40%;
    height: 1px;
    background-color: #505050;
  }

  .login-divider::before {
    left: 0;
  }

  .login-divider::after {
    right: 0;
  }

  .no-account-text {
    color: #b0b0b0;
    font-size: 0.95rem;
  }

  .register-link {
    color: #00c6ff; /* Cor do link "Cadastre-se agora" */
    font-weight: bold;
    text-decoration: none;
  }

  .register-link:hover {
    text-decoration: underline;
    color: #0099e6;
  }

  .test-account-box {
    background-color: #1a0033; /* Fundo da caixa de conta de teste */
    border-radius: 0.75rem;
    border: 1px dashed #5a00a0; /* Borda pontilhada */
    color: #c0c0c0;
    font-size: 0.9rem;
    margin-top: 2rem !important; /* Ajusta a margem superior */
  }

  .test-account-box i {
    color: #00c6ff; 
  }

  .test-account-value {
    color: #00c6ff; 
    font-weight: bold;
  }
  </style>