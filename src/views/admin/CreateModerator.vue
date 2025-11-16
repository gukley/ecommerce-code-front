<template>
  <div class="moderator-management p-4">
    <!-- Toast notification -->
    <Transition name="toast">
      <div v-if="toastMsg" class="toast-notification" :class="toastType">
        <i :class="toastType === 'success' ? 'bi bi-check-circle-fill' : 'bi bi-exclamation-circle-fill'" class="me-2"></i>
        {{ toastMsg }}
      </div>
    </Transition>

    <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-4">
      <h2 class="fw-bold text-primary-ggtech m-0">Gerenciamento de Moderadores</h2>
      <div class="d-flex align-items-center gap-3">
        <span class="moderator-count-badge">
          <i class="bi bi-people me-2"></i>
          Total: <strong>{{ moderadores.length }}</strong>
        </span>
      </div>
    </div>

    <!-- Formulário de criação -->
    <div class="moderator-form-card mb-4">
      <h5 class="form-card-title mb-3">
        <i class="bi bi-person-plus me-2"></i>Criar Novo Moderador
      </h5>
      <form @submit.prevent="criarModerador">
        <div class="row g-3">
          <div class="col-12 col-md-4">
            <label for="name" class="form-label">Nome</label>
            <input v-model="form.name" id="name" type="text" required class="form-control modern-input" autocomplete="off" placeholder="Nome completo" />
          </div>
          <div class="col-12 col-md-4">
            <label for="email" class="form-label">E-mail</label>
            <input v-model="form.email" id="email" type="email" required class="form-control modern-input" autocomplete="off" placeholder="email@exemplo.com" />
          </div>
          <div class="col-12 col-md-4">
            <label for="password" class="form-label">Senha</label>
            <div class="input-password-group">
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                id="password"
                required
                class="form-control modern-input"
                autocomplete="new-password"
                placeholder="Senha segura"
              />
              <button type="button" class="toggle-password-btn" @click="showPassword = !showPassword" tabindex="-1">
                <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
              </button>
            </div>
          </div>
        </div>
        <button type="submit" class="btn btn-gradient-add mt-3" :disabled="loading">
          <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
          <i v-if="!loading" class="bi bi-plus-circle me-2"></i>
          {{ loading ? "Criando..." : "Criar Moderador" }}
        </button>
      </form>
    </div>

    <!-- Busca -->
    <div class="d-flex flex-wrap gap-3 align-items-center mb-4">
      <div class="input-group search-bar">
        <input
          v-model="search"
          type="text"
          class="form-control search-input"
          placeholder="Buscar moderador por nome ou e-mail..."
          autocomplete="off"
        />
        <span class="input-group-text search-icon"><i class="bi bi-search"></i></span>
      </div>
    </div>

    <!-- Lista de moderadores -->
    <div v-if="loadingModeradores" class="d-flex justify-content-center my-5">
      <div class="spinner-border text-primary-ggtech" role="status">
        <span class="visually-hidden">Carregando...</span>
      </div>
    </div>

    <Transition name="fade" mode="out-in">
      <div v-if="!loadingModeradores" :key="moderadores.length">
        <div class="moderator-table-responsive">
          <table class="table table-dark rounded-table align-middle text-white moderator-table">
            <thead>
              <tr>
                <th class="text-primary-ggtech">Moderador</th>
                <th class="text-primary-ggtech">E-mail</th>
                <th class="text-primary-ggtech text-center">Função</th>
                <th class="text-primary-ggtech text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="mod in moderadoresFiltrados" :key="mod.id" class="moderator-row">
                <td>
                  <div class="d-flex align-items-center gap-3">
                    <div class="mod-avatar">
                      <img v-if="mod.image_path" :src="mod.image_path" alt="avatar" />
                      <span v-else>{{ mod.name?.charAt(0).toUpperCase() }}</span>
                    </div>
                    <span class="fw-bold fs-6 moderator-name">{{ mod.name }}</span>
                  </div>
                </td>
                <td>
                  <span class="moderator-email">{{ mod.email }}</span>
                </td>
                <td class="text-center">
                  <span class="badge" :class="badgeClass(mod.role)">{{ mod.role }}</span>
                </td>
                <td class="text-center">
                  <div class="action-group">
                    <button class="btn btn-edit" @click="abrirModalEditar(mod)" title="Editar Moderador">
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-delete" @click="confirmarExcluir(mod)" title="Excluir Moderador">
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="!moderadoresFiltrados.length">
                <td colspan="4" class="text-center text-muted py-4">Nenhum moderador encontrado.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Transition>

    <!-- Modal de confirmação de exclusão -->
    <div v-if="showModalExcluir" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.7);">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content admin-modal-content">
          <div class="modal-header">
            <h5 class="modal-title text-danger">
              <i class="bi bi-exclamation-triangle me-2"></i>Excluir Moderador
            </h5>
            <button type="button" class="btn-close-custom" @click="showModalExcluir = false">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
          <div class="modal-body">
            <p>Deseja realmente excluir <strong>{{ excluirNome }}</strong>?</p>
            <p class="text-muted small">Esta ação não pode ser desfeita.</p>
          </div>
          <div class="modal-footer d-flex justify-content-end">
            <button type="button" class="btn btn-cancel-custom me-3" @click="showModalExcluir = false">Cancelar</button>
            <button type="button" class="btn btn-delete-custom" @click="excluirModerador" :disabled="loadingExcluir">
              <span v-if="loadingExcluir" class="spinner-border spinner-border-sm me-2"></span>
              Excluir
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de edição -->
    <div v-if="showModalEditar" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.7);">
      <div class="modal-dialog modal-dialog-centered">
        <form class="modal-content admin-modal-content" @submit.prevent="editarModerador">
          <div class="modal-header">
            <h5 class="modal-title">Editar Moderador</h5>
            <button type="button" class="btn-close-custom" @click="fecharModalEditar">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
          <div class="modal-body p-4">
            <div class="mb-3">
              <label for="edit-name" class="form-label">Nome</label>
              <input v-model="editForm.name" id="edit-name" type="text" class="form-control modern-input" required />
            </div>
            <div class="mb-3">
              <label for="edit-email" class="form-label">E-mail</label>
              <input v-model="editForm.email" id="edit-email" type="email" class="form-control modern-input" required />
            </div>
            <div class="mb-3">
              <label for="edit-password" class="form-label">Senha (deixe em branco para não alterar)</label>
              <div class="input-password-group">
                <input v-model="editForm.password" id="edit-password" :type="showEditPassword ? 'text' : 'password'" class="form-control modern-input" />
                <button type="button" class="toggle-password-btn" @click="showEditPassword = !showEditPassword" tabindex="-1">
                  <i :class="showEditPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                </button>
              </div>
            </div>
            <p v-if="errorEditar" class="error-msg mt-2">{{ errorEditar }}</p>
          </div>
          <div class="modal-footer d-flex justify-content-end">
            <button type="button" class="btn btn-cancel-custom me-3" @click="fecharModalEditar" :disabled="loadingEditar">Cancelar</button>
            <button type="submit" class="btn btn-save-custom px-4" :disabled="loadingEditar">
              <span v-if="loadingEditar" class="spinner-border spinner-border-sm me-2"></span>
              {{ loadingEditar ? "Salvando..." : (successEditar ? "Salvo!" : "Salvar alterações") }}
            </button>
          </div>
        </form>
      </div>
    </div>
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
  toastTimeout = setTimeout(() => (toastMsg.value = ''), 3500) // aumentado para 3.5s para melhor visibilidade
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
    await apiService.deleteModerator(excluirId.value)
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
.moderator-management {
  background-color: #0f1419;
  min-height: 100vh;
  color: #e8eaed;
  padding: 2rem 1rem;
  max-width: 1280px;
  margin: 0 auto;
  font-family: 'Inter', sans-serif;
}

.text-primary-ggtech {
  background: linear-gradient(90deg, #64b5f6 0%, #42a5f5 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 700;
  font-size: 2.2rem;
  letter-spacing: 0.02em;
}

.moderator-count-badge {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.95rem;
  box-shadow: 0 2px 12px #667eea30;
}

.moderator-form-card {
  background: linear-gradient(135deg, #181e2a 0%, #23233a 100%);
  border: 1.5px solid #232e47;
  border-radius: 1.2rem;
  box-shadow: 0 2px 12px #232e4720;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.form-card-title {
  color: #64b5f6;
  font-weight: 700;
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.form-label {
  color: #b0b7c3;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.modern-input {
  background-color: #1a2332;
  border: 1px solid #374151;
  color: #e8eaed;
  border-radius: 0.5rem;
  padding: 0.8rem 1rem;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.modern-input:focus {
  background-color: #1a2332;
  border-color: #64b5f6;
  color: #e8eaed;
  box-shadow: 0 0 0 0.2rem rgba(100, 181, 246, 0.25);
  outline: none;
}

.modern-input::placeholder {
  color: #6b7280;
}

.input-password-group {
  position: relative;
  display: flex;
  align-items: center;
}

.toggle-password-btn {
  background: none;
  border: none;
  color: #64b5f6;
  font-size: 1.1rem;
  position: absolute;
  right: 12px;
  cursor: pointer;
  z-index: 2;
  padding: 0.5rem;
  display: flex;
  align-items: center;
}

.toggle-password-btn:focus {
  outline: none;
}

.btn-gradient-add {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 2px 12px #667eea30;
}

.btn-gradient-add:hover {
  transform: translateY(-2px) scale(1.03);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
  color: white;
}

.search-bar {
  max-width: 400px;
}

.search-input {
  border-right: none;
  background-color: #1a2332;
  border: 1px solid #374151;
  color: #e8eaed;
  border-radius: 0.5rem 0 0 0.5rem;
}

.search-icon {
  background-color: #1a2332;
  border: 1px solid #374151;
  border-left: none;
  color: #64b5f6;
  border-radius: 0 0.5rem 0.5rem 0;
}

.moderator-table-responsive {
  background: #0b1220;
  border-radius: 1.5rem;
  box-shadow: 0 6px 30px rgba(0,0,0,0.65);
  padding: 2rem 1.5rem;
  overflow-x: auto;
  margin-bottom: 2rem;
  border: 1px solid rgba(255,255,255,0.04);
}

.moderator-table thead th {
  background-color: #0f1724 !important;
  color: #ffffff !important;
  font-size: 1.05rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  padding: 1rem 0.9rem !important;
  text-align: center;
  border-bottom: 2px solid rgba(255,255,255,0.03);
  position: sticky;
  top: 0;
  z-index: 20;
}

.moderator-table th, .moderator-table td {
  border: none;
}

.moderator-table td {
  color: #e6eef8 !important;
  font-size: 1rem;
  padding: 0.95rem 0.9rem !important;
}

.moderator-row {
  transition: background-color 0.18s;
}

.moderator-row:hover {
  background: linear-gradient(90deg, #23233a 0%, #374151 100%);
  box-shadow: 0 2px 12px rgba(0, 255, 225, 0.1);
}

.moderator-name {
  color: #ffffff !important;
  font-weight: 600;
  font-size: 1.1rem;
}

.moderator-email {
  color: #b0b7c3;
  font-size: 0.95rem;
}

.mod-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #222b3a;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  font-size: 1.3rem;
  color: #64b5f6;
  font-weight: 700;
  border: 2px solid #64b5f6;
  box-shadow: 0 2px 8px #64b5f633;
  flex-shrink: 0;
}

.mod-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.badge {
  font-size: 0.85rem;
  font-weight: 600;
  padding: 0.4rem 0.8rem;
  border-radius: 0.5rem;
  letter-spacing: 0.5px;
}

.bg-gradient-admin {
  background: linear-gradient(90deg, #ff9800 0%, #f44336 100%);
  color: #fff;
}

.bg-gradient-moderator {
  background: linear-gradient(90deg, #0072ff 0%, #64b5f6 100%);
  color: #fff;
}

.bg-gradient-client {
  background: linear-gradient(90deg, #43e97b 0%, #38f9d7 100%);
  color: #fff;
}

.action-group {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.8rem;
}

.btn-edit,
.btn-delete {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1.25rem;
  transition: background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.btn-edit {
  background-color: #64b5f6;
}

.btn-edit:hover {
  background-color: #8f5fe8;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px #8f5fe8cc;
}

.btn-delete {
  background-color: #ff6b6b;
}

.btn-delete:hover {
  background-color: #e53e3e;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px #ff6b6bcc;
}

/* Modal Styles */
.admin-modal-content {
  background: var(--admin-bg-secondary, #181828);
  color: var(--admin-text-primary, #ffffff);
  border-radius: 1.25rem;
  border: 1px solid var(--admin-border-light, rgba(255, 255, 255, 0.1));
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
}

.modal-header {
  border-bottom: 1px solid var(--admin-border-light, rgba(255, 255, 255, 0.1));
  background-color: var(--admin-bg-tertiary, #202038);
  padding: 1.25rem 1.5rem;
}

.modal-title {
  font-weight: 600;
  color: var(--admin-accent-primary, #00ffe1);
  font-size: 1.4rem;
}

.btn-close-custom {
  background: none;
  border: none;
  color: var(--admin-text-muted, #b0b7c3);
  font-size: 1.5rem;
  cursor: pointer;
  transition: color 0.2s ease, transform 0.2s ease;
  padding: 0;
}

.btn-close-custom:hover {
  color: var(--admin-danger, #ff6b6b);
  transform: rotate(90deg);
}

.modal-body {
  padding: 1.5rem;
}

.modal-footer {
  border-top: 1px solid var(--admin-border-light, rgba(255, 255, 255, 0.1));
  padding: 1.25rem 1.5rem;
}

.btn-cancel-custom {
  background: transparent;
  color: var(--admin-text-secondary, rgba(255, 255, 255, 0.8));
  border: 2px solid var(--admin-border-medium, rgba(255, 255, 255, 0.2));
  border-radius: 50px;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  transition: all 0.3s ease;
}

.btn-cancel-custom:hover {
  background: var(--admin-bg-tertiary, #202038);
  color: var(--admin-text-primary, #ffffff);
  border-color: var(--admin-accent-primary, #00ffe1);
}

.btn-save-custom {
  background: linear-gradient(135deg, var(--admin-accent-primary, #00ffe1) 0%, var(--admin-accent-secondary, #8f5fe8) 100%);
  color: #fff !important;
  border: none;
  border-radius: 50px;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  box-shadow: 0 4px 16px rgba(0, 255, 225, 0.2);
  transition: all 0.3s ease;
}

.btn-save-custom:hover {
  background: linear-gradient(135deg, var(--admin-accent-secondary, #8f5fe8) 0%, var(--admin-accent-primary, #00ffe1) 100%);
  color: #fff !important;
  box-shadow: 0 8px 25px rgba(0, 255, 225, 0.3);
  transform: translateY(-2px);
}

.btn-delete-custom {
  background: linear-gradient(90deg, #ef4444 0%, #f87171 100%);
  color: #fff;
  border: none;
  border-radius: 50px;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
  transition: all 0.3s ease;
}

.btn-delete-custom:hover {
  background: linear-gradient(90deg, #f87171 0%, #ef4444 100%);
  color: #fff;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
  transform: translateY(-2px);
}

.error-msg {
  color: #ff5252;
  font-size: 0.9rem;
  text-align: center;
}

/* Toast Notification Styles */
.toast-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  padding: 1rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 1rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  min-width: 280px;
  backdrop-filter: blur(10px);
}

.toast-notification.success {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  color: #0f1419;
  border: 2px solid rgba(67, 233, 123, 0.3);
}

.toast-notification.error {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
  color: #ffffff;
  border: 2px solid rgba(255, 107, 107, 0.3);
}

/* Toast Animation */
.toast-enter-active {
  animation: slideInRight 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.toast-leave-active {
  animation: slideOutRight 0.3s ease-in;
}

@keyframes slideInRight {
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOutRight {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(400px);
    opacity: 0;
  }
}

/* Responsividade */
@media (max-width: 991.98px) {
  .moderator-management {
    padding: 1rem 0.5rem;
  }
  
  .text-primary-ggtech {
    font-size: 1.8rem;
  }
  
  .moderator-table-responsive {
    padding: 1.2rem 0.8rem;
  }
  
  .moderator-table thead th,
  .moderator-table td {
    padding: 0.75rem 0.6rem;
    font-size: 0.95rem;
  }
  
  .mod-avatar {
    width: 36px;
    height: 36px;
    font-size: 1.1rem;
  }
  
  .action-group {
    gap: 0.5rem;
  }
  
  .btn-edit,
  .btn-delete {
    width: 32px;
    height: 32px;
    font-size: 1.1rem;
  }
  
  .toast-notification {
    top: 10px;
    right: 10px;
    left: 10px;
    min-width: auto;
    font-size: 0.9rem;
    padding: 0.85rem 1.2rem;
  }
}
</style>
