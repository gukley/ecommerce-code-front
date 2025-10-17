<template>
  <div class="moderator-admin-bg">
    <!-- Sidebar interna opcional -->
    <aside class="moderator-sidebar d-none d-md-flex flex-column align-items-center justify-content-start">
      <div class="sidebar-icon mb-3">
        <i class="bi bi-shield-lock"></i>
      </div>
      <div class="sidebar-title">Gerenciar<br />Moderadores</div>
    </aside>
    <div class="moderator-admin-main">
      <!-- Header visual com card de boas-vindas -->
      <div class="moderator-header-card mb-4">
        <div class="d-flex align-items-center gap-3">
          <div class="header-icon">
            <i class="bi bi-person-badge"></i>
          </div>
          <div>
            <h2 class="fw-bold text-gradient m-0">Moderadores</h2>
            <div class="admin-subtitle">Bem-vindo! Gerencie, crie e edite moderadores do sistema.</div>
          </div>
        </div>
        <div class="moderator-count-box">
          <span class="count-label">Ativos:</span>
          <span class="count-value">{{ moderadores.length }}</span>
        </div>
      </div>

      <!-- Formulário de criação -->
      <form @submit.prevent="criarModerador" class="mb-4 moderator-form-card">
        <div class="row g-4 align-items-end">
          <div class="col-12 col-md-4">
            <label for="name" class="form-label">Nome</label>
            <div class="input-icon-group">
              <i class="bi bi-person"></i>
              <input v-model="form.name" id="name" type="text" required class="form-control" autocomplete="off" />
            </div>
          </div>
          <div class="col-12 col-md-4">
            <label for="email" class="form-label">E-mail</label>
            <div class="input-icon-group">
              <i class="bi bi-envelope"></i>
              <input v-model="form.email" id="email" type="email" required class="form-control" autocomplete="off" />
            </div>
          </div>
          <div class="col-12 col-md-4">
            <label for="password" class="form-label">Senha</label>
            <div class="input-icon-group">
              <i class="bi bi-lock"></i>
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                id="password"
                required
                class="form-control"
                autocomplete="new-password"
              />
              <button type="button" class="toggle-password" @click="showPassword = !showPassword" tabindex="-1">
                <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
              </button>
            </div>
          </div>
        </div>
        <button type="submit" class="btn btn-main-action w-100 mt-4" :disabled="loading">
          <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
          {{ loading ? "Criando..." : "Criar Moderador" }}
        </button>
      </form>

      <!-- Busca e contador -->
      <div class="moderator-list-header d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-3 gap-2">
        <div class="d-flex align-items-center gap-2">
          <i class="bi bi-search text-gradient"></i>
          <input
            v-model="search"
            type="text"
            class="form-control search-input"
            placeholder="Buscar moderador por nome ou e-mail..."
            autocomplete="off"
          />
        </div>
        <div class="moderator-counts">
          <span class="count-label">Total:</span>
          <span class="count-value">{{ moderadores.length }}</span>
        </div>
      </div>

      <!-- Lista de moderadores -->
      <div class="row g-3">
        <div
          v-if="loadingModeradores"
          v-for="n in 3"
          :key="'skeleton-'+n"
          class="col-12 col-md-6"
        >
          <div class="moderator-card skeleton-loader"></div>
        </div>
        <template v-else>
          <div
            v-for="mod in moderadoresFiltrados"
            :key="mod.id"
            class="col-12 col-md-6"
          >
            <div class="moderator-card d-flex align-items-center p-3">
              <div class="mod-avatar me-3">
                <img v-if="mod.image_path" :src="mod.image_path" alt="avatar" />
                <span v-else>{{ mod.name?.charAt(0).toUpperCase() }}</span>
              </div>
              <div class="mod-info flex-grow-1">
                <span class="mod-name fw-bold">{{ mod.name }}</span>
                <span class="mod-email d-block text-muted small">{{ mod.email }}</span>
                <span class="mod-role badge" :class="badgeClass(mod.role)">{{ mod.role }}</span>
              </div>
              <button class="btn btn-sm btn-outline-primary ms-2" @click="abrirModalEditar(mod)">
                <i class="bi bi-pencil"></i> Editar
              </button>
              <button class="btn btn-sm btn-outline-danger ms-2" @click="confirmarExcluir(mod)">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </div>
          <div v-if="!moderadoresFiltrados.length && !loadingModeradores" class="col-12">
            <div class="no-mods">Nenhum moderador encontrado.</div>
          </div>
        </template>
      </div>

      <!-- Modal de confirmação de exclusão -->
      <div v-if="showModalExcluir" class="modal-backdrop-blur">
        <div class="modal-editar">
          <h4 class="mb-3 text-danger"><i class="bi bi-exclamation-triangle"></i> Excluir Moderador</h4>
          <p>Deseja realmente excluir <strong>{{ excluirNome }}</strong>?</p>
          <div class="d-flex justify-content-end gap-2 mt-3">
            <button type="button" class="btn btn-secondary" @click="showModalExcluir = false">Cancelar</button>
            <button type="button" class="btn btn-danger" @click="excluirModerador" :disabled="loadingExcluir">
              <span v-if="loadingExcluir" class="spinner-border spinner-border-sm me-2"></span>
              Excluir
            </button>
          </div>
        </div>
      </div>

      <!-- Modal de edição -->
      <div v-if="showModalEditar" class="modal-backdrop-blur">
        <div class="modal-editar">
          <h4 class="mb-3">Editar Moderador</h4>
          <form @submit.prevent="editarModerador">
            <div class="form-group mb-2">
              <label for="edit-name">Nome</label>
              <input v-model="editForm.name" id="edit-name" type="text" class="form-control" required />
            </div>
            <div class="form-group mb-2">
              <label for="edit-email">E-mail</label>
              <input v-model="editForm.email" id="edit-email" type="email" class="form-control" required />
            </div>
            <div class="form-group mb-2">
              <label for="edit-password">Senha (deixe em branco para não alterar)</label>
              <div class="input-icon-group">
                <i class="bi bi-lock"></i>
                <input v-model="editForm.password" id="edit-password" :type="showEditPassword ? 'text' : 'password'" class="form-control" />
                <button type="button" class="toggle-password" @click="showEditPassword = !showEditPassword" tabindex="-1">
                  <i :class="showEditPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                </button>
              </div>
            </div>
            <div class="d-flex justify-content-end gap-2 mt-3">
              <button type="button" class="btn btn-secondary" @click="fecharModalEditar">Cancelar</button>
              <button type="submit" class="btn btn-main-action" :disabled="loadingEditar">
                <span v-if="loadingEditar" class="spinner-border spinner-border-sm me-2"></span>
                <span v-if="successEditar" class="check-anim"><i class="bi bi-check-circle-fill"></i></span>
                {{ loadingEditar ? "Salvando..." : (successEditar ? "Salvo!" : "Salvar") }}
              </button>
            </div>
            <p v-if="errorEditar" class="error-msg mt-2">{{ errorEditar }}</p>
          </form>
        </div>
      </div>
    </div>
    <!-- Toast flutuante -->
    <transition name="toast-fade">
      <div v-if="toastMsg" class="moderator-toast" :class="toastType">
        <i :class="toastType === 'success' ? 'bi bi-check-circle-fill' : 'bi bi-x-circle-fill'"></i>
        {{ toastMsg }}
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import apiService from '@/services/apiService'

const form = ref({
  name: '',
  email: '',
  password: '',
  role: 'MODERATOR'
})
const loading = ref(false)
const success = ref(false)
const error = ref('')

const moderadores = ref([])
const loadingModeradores = ref(false)
const errorModeradores = ref('')

const search = ref('')
const showPassword = ref(false)
const showEditPassword = ref(false)

// Modal editar
const showModalEditar = ref(false)
const editForm = ref({ id: null, name: '', email: '', password: '' })
const loadingEditar = ref(false)
const errorEditar = ref('')
const successEditar = ref(false)

// Modal excluir
const showModalExcluir = ref(false)
const excluirId = ref(null)
const excluirNome = ref('')
const loadingExcluir = ref(false)

// Toast
const toastMsg = ref('')
const toastType = ref('success')
let toastTimeout = null

function showToast(msg, type = 'success') {
  toastMsg.value = msg
  toastType.value = type
  clearTimeout(toastTimeout)
  toastTimeout = setTimeout(() => (toastMsg.value = ''), 2200)
}

function badgeClass(role) {
  if (role === 'ADMIN') return 'bg-gradient-admin'
  if (role === 'MODERATOR') return 'bg-gradient-moderator'
  return 'bg-gradient-client'
}

async function criarModerador() {
  loading.value = true
  error.value = ''
  success.value = false
  try {
    await apiService.createModerator(form.value)
    success.value = true
    showToast('Moderador criado com sucesso!', 'success')
    form.value = { name: '', email: '', password: '', role: 'MODERATOR' }
    await buscarModeradores()
  } catch (err) {
    error.value = err.response?.data?.detail || 'Erro ao criar moderador'
    showToast(error.value, 'error')
  } finally {
    loading.value = false
  }
}

async function buscarModeradores() {
  loadingModeradores.value = true
  errorModeradores.value = ''
  try {
    const data = await apiService.getModerators()
    let mods = Array.isArray(data) ? data : (data?.users || [])
    mods = mods.filter(u => u.role === 'MODERATOR')
    // Ordena alfabeticamente
    mods.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
    moderadores.value = mods
  } catch (err) {
    moderadores.value = []
    errorModeradores.value = err.response?.data?.detail || 'Erro ao buscar moderadores'
  } finally {
    loadingModeradores.value = false
  }
}

const moderadoresFiltrados = computed(() => {
  if (!search.value) return moderadores.value
  const s = search.value.toLowerCase()
  return moderadores.value.filter(
    m =>
      (m.name && m.name.toLowerCase().includes(s)) ||
      (m.email && m.email.toLowerCase().includes(s))
  )
})

function abrirModalEditar(mod) {
  editForm.value = {
    id: mod.id,
    name: mod.name,
    email: mod.email,
    password: ''
  }
  showModalEditar.value = true
  errorEditar.value = ''
  successEditar.value = false
  showEditPassword.value = false
}

function fecharModalEditar() {
  showModalEditar.value = false
  errorEditar.value = ''
  successEditar.value = false
}

async function editarModerador() {
  loadingEditar.value = true
  errorEditar.value = ''
  successEditar.value = false
  try {
    const payload = {
      name: editForm.value.name,
      email: editForm.value.email
    }
    if (editForm.value.password) {
      payload.password = editForm.value.password
    }
    await apiService.updateModerator(editForm.value.id, payload)
    successEditar.value = true
    showToast('Moderador atualizado!', 'success')
    await buscarModeradores()
    setTimeout(() => {
      fecharModalEditar()
    }, 1000)
  } catch (err) {
    errorEditar.value = err.response?.data?.detail || 'Erro ao editar moderador'
    showToast(errorEditar.value, 'error')
  } finally {
    loadingEditar.value = false
  }
}

function confirmarExcluir(mod) {
  excluirId.value = mod.id
  excluirNome.value = mod.name
  showModalExcluir.value = true
}

async function excluirModerador() {
  loadingExcluir.value = true
  try {
    // Corrija aqui: use deleteUser(excluirId.value) para deletar moderador pelo ID
    await apiService.deleteUser(excluirId.value)
    showToast('Moderador excluído!', 'success')
    await buscarModeradores()
    showModalExcluir.value = false
  } catch (err) {
    showToast('Erro ao excluir moderador', 'error')
  } finally {
    loadingExcluir.value = false
  }
}

onMounted(buscarModeradores)
</script>

<style scoped>
/* Ajustes para manter padrão visual dos dashboards admin/cupom/financeiro */
.moderator-admin-bg {
  background: #0f1419;
  min-height: 100vh;
  color: #e8eaed;
  font-family: 'Inter', sans-serif;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  position: relative;
  overflow-x: hidden;
}
.moderator-sidebar {
  width: 90px;
  min-width: 90px;
  background: linear-gradient(135deg, #1a2332 0%, #23233a 100%);
  border-radius: 1.2rem 0 0 1.2rem;
  box-shadow: 4px 0 24px #3b82f610;
  min-height: 90vh;
  margin-right: 1.5rem;
  padding-top: 2.5rem;
  position: sticky;
  top: 2rem;
}
.sidebar-icon {
  font-size: 2.2rem;
  color: #64b5f6;
  margin-bottom: 0.5rem;
  filter: drop-shadow(0 0 8px #8f5fe8cc);
}
.sidebar-title {
  color: #64b5f6;
  font-weight: 700;
  font-size: 1.05rem;
  text-align: center;
  line-height: 1.2;
  letter-spacing: 0.01em;
  text-shadow: 0 2px 8px #8f5fe8cc;
}
.moderator-admin-main {
  flex: 1;
  max-width: 900px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem 0.5rem 2rem 0.5rem;
}
.moderator-header-card {
  background: linear-gradient(135deg, #1a2332 0%, #23233a 100%);
  border-radius: 1.2rem;
  box-shadow: 0 4px 32px #64b5f620;
  padding: 2rem 2rem 1.2rem 2rem;
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
}
.header-icon {
  font-size: 2.5rem;
  color: #64b5f6;
  filter: drop-shadow(0 0 10px #8f5fe8cc);
}
.text-gradient {
  background: linear-gradient(90deg, #64b5f6 0%, #8f5fe8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 700;
  font-size: 2.1rem;
  letter-spacing: 0.02em;
}
.admin-subtitle {
  color: #b0b7c3;
  font-size: 1.08rem;
  margin-top: 2px;
  font-weight: 500;
}
.moderator-count-box {
  position: absolute;
  top: 1.5rem;
  right: 2rem;
  background: linear-gradient(90deg, #64b5f6 0%, #8f5fe8 100%);
  color: #fff;
  font-weight: 700;
  border-radius: 1.2rem;
  padding: 0.5rem 1.3rem;
  font-size: 1.08rem;
  box-shadow: 0 2px 16px #64b5f633;
  z-index: 2;
  letter-spacing: 0.2px;
  display: flex;
  align-items: center;
  gap: 0.5em;
}
.count-label { color: #e0e7ef; font-weight: 600; }
.count-value { color: #fff; font-weight: 900; font-size: 1.15em; }
.moderator-form-card {
  background: linear-gradient(135deg, #181e2a 0%, #23233a 100%);
  border-radius: 1.2rem;
  box-shadow: 0 2px 12px #232e4720;
  padding: 2rem 1.5rem 1.2rem 1.5rem;
  margin-bottom: 2rem;
}
.input-icon-group {
  position: relative;
  display: flex;
  align-items: center;
}
.input-icon-group i {
  position: absolute;
  left: 14px;
  color: #64b5f6;
  font-size: 1.1rem;
  z-index: 2;
}
.input-icon-group input {
  padding-left: 2.2rem;
}
.toggle-password {
  background: none;
  border: none;
  color: #64b5f6;
  font-size: 1.1rem;
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  z-index: 2;
  padding: 0;
}
.toggle-password:focus { outline: none; }
.btn-main-action {
  background: linear-gradient(135deg, #64b5f6 0%, #8f5fe8 100%);
  border: none;
  color: white;
  font-weight: 700;
  padding: 0.85rem 1.5rem;
  border-radius: 0.7rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px #64b5f640;
  position: relative;
  overflow: hidden;
}
.btn-main-action:hover, .btn-main-action:focus {
  background: linear-gradient(135deg, #8f5fe8 0%, #64b5f6 100%);
  color: #fff;
  transform: translateY(-2px) scale(1.04);
  box-shadow: 0 8px 25px #8f5fe840;
}
.moderator-list-header {
  margin-bottom: 1.2rem;
}
.search-input {
  background: #181e2a;
  border: 1.5px solid #232e47;
  color: #e8eaed;
  border-radius: 0.7rem;
  font-size: 1rem;
  padding: 0.6rem 1.2rem;
  min-width: 220px;
  transition: border 0.2s;
}
.search-input:focus {
  border-color: #64b5f6;
  outline: none;
}
.moderator-card {
  background: linear-gradient(135deg, #181e2a 0%, #23233a 100%);
  border-radius: 1.1rem;
  box-shadow: 0 2px 12px #232e4720;
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  transition: box-shadow 0.18s, transform 0.12s;
  border: 1.5px solid #232e47;
  position: relative;
  overflow: hidden;
  min-height: 80px;
}
.moderator-card:hover {
  box-shadow: 0 0 24px #64b5f6cc, 0 2px 16px #8f5fe8cc;
  transform: translateY(-2px) scale(1.02);
  border-color: #64b5f6;
}
.skeleton-loader {
  min-height: 80px;
  background: linear-gradient(90deg, #181e2a 25%, #23233a 50%, #181e2a 75%);
  background-size: 200% 100%;
  animation: skeleton-anim 1.2s infinite linear;
}
@keyframes skeleton-anim {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
.mod-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #222b3a;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.9rem;
  overflow: hidden;
  font-size: 1.3rem;
  color: #64b5f6;
  font-weight: 700;
  border: 2px solid #64b5f6;
  box-shadow: 0 0 8px #8f5fe8cc;
}
.mod-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.mod-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.mod-name {
  font-weight: 600;
  color: #fff;
  font-size: 1.07rem;
}
.mod-email {
  color: #b0b7c3;
  font-size: 0.93rem;
}
.badge {
  font-size: 0.85rem;
  font-weight: 600;
  padding: 0.2rem 0.7rem;
  border-radius: 6px;
  margin-left: 1rem;
  letter-spacing: 1px;
}
.bg-gradient-admin {
  background: linear-gradient(90deg,#ff9800 0%,#f44336 100%);
  color: #fff;
}
.bg-gradient-moderator {
  background: linear-gradient(90deg,#0072ff 0%,#64b5f6 100%);
  color: #fff;
}
.bg-gradient-client {
  background: linear-gradient(90deg,#43e97b 0%,#38f9d7 100%);
  color: #fff;
}
.no-mods {
  color: #b0b7c3;
  text-align: center;
  padding: 1rem 0;
}
.spinner-border {
  width: 1.2rem;
  height: 1.2rem;
  border-width: 0.15em;
}
.modal-backdrop-blur {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(11,17,25,0.65);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.modal-editar {
  background: linear-gradient(135deg, #181e2a 0%, #23233a 100%);
  border-radius: 1.2rem;
  padding: 2rem 1.5rem;
  min-width: 320px;
  max-width: 95vw;
  box-shadow: 0 8px 32px #64b5f6cc, 0 0 32px #8f5fe8cc;
  color: #e8eaed;
  position: relative;
}
.check-anim {
  color: #22c55e;
  font-size: 1.3em;
  margin-right: 0.5em;
}
.btn-secondary {
  background: #232e47;
  color: #e8eaed;
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem 1.2rem;
  font-weight: 600;
}
.btn-secondary:hover {
  background: #1a1f35;
}
.btn-danger {
  background: linear-gradient(90deg, #ef4444 0%, #f87171 100%);
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem 1.2rem;
  font-weight: 600;
  box-shadow: 0 2px 8px #ef444422;
}
.btn-danger:hover {
  background: linear-gradient(90deg, #f87171 0%, #ef4444 100%);
  color: #fff;
}
.error-msg {
  color: #ff5252;
  margin-top: 1rem;
  text-align: center;
}
.moderator-toast {
  position: fixed;
  top: 2.2rem;
  right: 2.2rem;
  z-index: 99999;
  background: linear-gradient(90deg, #64b5f6 0%, #8f5fe8 100%);
  color: #fff;
  font-weight: 700;
  border-radius: 1.2rem;
  padding: 0.7rem 2rem;
  font-size: 1.08rem;
  box-shadow: 0 4px 24px #64b5f633;
  display: flex;
  align-items: center;
  gap: 0.7em;
  pointer-events: none;
}
.moderator-toast.error {
  background: linear-gradient(90deg, #ef4444 0%, #f87171 100%);
}
.toast-fade-enter-active, .toast-fade-leave-active {
  transition: opacity 0.5s;
}
.toast-fade-enter-from, .toast-fade-leave-to {
  opacity: 0;
}
.toast-fade-enter-to, .toast-fade-leave-from {
  opacity: 1;
}
@media (max-width: 991.98px) {
  .moderator-admin-bg {
    flex-direction: column;
    padding: 0.5rem 0.1rem;
  }
  .moderator-sidebar {
    display: none !important;
  }
  .moderator-admin-main {
    max-width: 100vw;
    padding: 1.2rem 0.2rem;
  }
  .moderator-header-card, .moderator-form-card {
    padding: 1.2rem 0.7rem;
    border-radius: 1rem;
  }
  .modal-editar {
    padding: 1.2rem 0.7rem;
    border-radius: 1rem;
  }
}
@media (max-width: 600px) {
  .moderator-header-card, .moderator-form-card {
    padding: 0.7rem 0.2rem;
    border-radius: 0.7rem;
  }
  .moderator-admin-main {
    padding: 0.5rem 0.1rem;
  }
  .moderator-count-box {
    top: 0.7rem;
    right: 0.7rem;
    font-size: 0.95rem;
    padding: 0.4rem 0.8rem;
  }
  .modal-editar {
    padding: 0.7rem 0.2rem;
    border-radius: 0.7rem;
  }
}
</style>
