<template>
  <div class="moderator-admin-container p-4">
    <div class="moderator-admin-card">
      <div class="admin-header mb-4 d-flex align-items-center gap-3">
        <span class="admin-icon">
          <svg width="36" height="36" fill="none" viewBox="0 0 24 24"><path fill="#64b5f6" d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-4.418 0-8 2.015-8 4.5V21a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-2.5c0-2.485-3.582-4.5-8-4.5Z"/></svg>
        </span>
        <div>
          <h2 class="fw-bold text-primary-ggtech m-0">Moderadores</h2>
          <div class="admin-subtitle">Crie, edite e gerencie moderadores do sistema</div>
        </div>
      </div>
      <form @submit.prevent="criarModerador" class="mb-4">
        <div class="row g-3">
          <div class="col-12 col-md-4">
            <label for="name" class="form-label">Nome</label>
            <input v-model="form.name" id="name" type="text" required class="form-control" />
          </div>
          <div class="col-12 col-md-4">
            <label for="email" class="form-label">E-mail</label>
            <input v-model="form.email" id="email" type="email" required class="form-control" />
          </div>
          <div class="col-12 col-md-4">
            <label for="password" class="form-label">Senha</label>
            <input v-model="form.password" id="password" type="password" required class="form-control" />
          </div>
        </div>
        <button type="submit" class="btn btn-main-action w-100 mt-3" :disabled="loading">
          <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
          {{ loading ? "Criando..." : "Criar Moderador" }}
        </button>
        <p v-if="success" class="success-msg mt-3">Moderador criado com sucesso!</p>
        <p v-if="error" class="error-msg mt-3">{{ error }}</p>
      </form>

      <hr class="divider" />

      <div class="moderator-list-section">
        <div class="list-header d-flex align-items-center justify-content-between mb-3">
          <h3 class="text-primary-ggtech m-0">Lista de Moderadores</h3>
          <button class="btn btn-outline-primary btn-sm" @click="buscarModeradores" :disabled="loadingModeradores">
            <span v-if="loadingModeradores" class="spinner-border spinner-border-sm"></span>
            <span v-else>Atualizar</span>
          </button>
        </div>
        <div v-if="errorModeradores" class="error-msg mb-2">
          {{ errorModeradores }}
        </div>
        <div v-if="moderadores.length === 0 && !loadingModeradores && !errorModeradores" class="no-mods">
          Nenhum moderador cadastrado.
        </div>
        <div class="row g-3">
          <div v-for="mod in moderadores" :key="mod.id" class="col-12 col-md-6">
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
            </div>
          </div>
        </div>
      </div>

      <div v-if="showModalEditar" class="modal-backdrop">
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
              <input v-model="editForm.password" id="edit-password" type="password" class="form-control" />
            </div>
            <div class="d-flex justify-content-end gap-2 mt-3">
              <button type="button" class="btn btn-secondary" @click="fecharModalEditar">Cancelar</button>
              <button type="submit" class="btn btn-main-action" :disabled="loadingEditar">
                <span v-if="loadingEditar" class="spinner-border spinner-border-sm me-2"></span>
                {{ loadingEditar ? "Salvando..." : "Salvar" }}
              </button>
            </div>
            <p v-if="errorEditar" class="error-msg mt-2">{{ errorEditar }}</p>
            <p v-if="successEditar" class="success-msg mt-2">Moderador atualizado!</p>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
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

// Modal editar
const showModalEditar = ref(false)
const editForm = ref({ id: null, name: '', email: '', password: '' })
const loadingEditar = ref(false)
const errorEditar = ref('')
const successEditar = ref(false)

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
    form.value = { name: '', email: '', password: '', role: 'MODERATOR' }
    await buscarModeradores()
    setTimeout(() => {
      success.value = false
    }, 1200)
  } catch (err) {
    error.value = err.response?.data?.detail || 'Erro ao criar moderador'
  } finally {
    loading.value = false
  }
}

async function buscarModeradores() {
  loadingModeradores.value = true
  errorModeradores.value = ''
  try {
    const data = await apiService.getModerators()
    moderadores.value = Array.isArray(data) ? data : (data?.users || [])
    moderadores.value = moderadores.value.filter(u => u.role === 'MODERATOR')
  } catch (err) {
    moderadores.value = []
    errorModeradores.value = err.response?.data?.detail || 'Erro ao buscar moderadores'
  } finally {
    loadingModeradores.value = false
  }
}

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
    await buscarModeradores()
    setTimeout(() => {
      fecharModalEditar()
    }, 1000)
  } catch (err) {
    errorEditar.value = err.response?.data?.detail || 'Erro ao editar moderador'
  } finally {
    loadingEditar.value = false
  }
}

onMounted(buscarModeradores)
</script>

<style scoped>
.moderator-admin-container {
  background-color: #0f1419;
  min-height: 100vh;
  color: #e8eaed;
  padding: 2rem 1rem;
  max-width: 900px;
  margin: 0 auto;
  font-family: 'Inter', sans-serif;
  display: flex;
  align-items: flex-start;
  justify-content: center;
}
.moderator-admin-card {
  background: linear-gradient(135deg, #1a2332 0%, #2d3748 100%);
  border: 1px solid #374151;
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  color: #e8eaed;
  padding: 2rem 1.5rem;
  width: 100%;
  max-width: 800px;
}
.admin-header {
  display: flex;
  align-items: center;
  gap: 1.2rem;
}
.admin-icon {
  background: linear-gradient(135deg, #64b5f6 0%, #42a5f5 100%);
  border-radius: 50%;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.admin-subtitle {
  color: #b0b7c3;
  font-size: 1rem;
  margin-top: 2px;
}
.text-primary-ggtech {
  background: linear-gradient(90deg, #64b5f6 0%, #42a5f5 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 700;
  font-size: 1.5rem;
  letter-spacing: 0.02em;
}
.btn-main-action {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
}
.btn-main-action:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
  color: white;
}
.btn-outline-primary {
  color: #64b5f6;
  border-color: #64b5f6;
  background: transparent;
  font-weight: 600;
  transition: background 0.2s;
  border-radius: 0.5rem;
  padding: 0.4rem 1.2rem;
}
.btn-outline-primary:hover {
  background-color: #64b5f6;
  border-color: #64b5f6;
  color: #0f1419;
}
button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
.form-label {
  color: #a0aec0;
  font-weight: 500;
}
.form-control {
  background-color: #1a2332;
  border: 1px solid #374151;
  color: #e8eaed;
  border-radius: 0.5rem;
  font-size: 1rem;
  padding: 0.6rem 0.8rem;
  margin-bottom: 0.2rem;
}
.form-control:focus {
  background-color: #1a2332;
  border-color: #64b5f6;
  color: #e8eaed;
  box-shadow: 0 0 0 0.2rem rgba(100, 181, 246, 0.25);
}
.success-msg {
  color: #00e676;
  margin-top: 1rem;
  text-align: center;
}
.error-msg {
  color: #ff5252;
  margin-top: 1rem;
  text-align: center;
}
.divider {
  margin: 2rem 0 1.2rem 0;
  border: none;
  border-top: 1px solid #3a3a3a;
}
.moderator-list-section {
  margin-top: 0.5rem;
}
.list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.7rem;
}
.list-header h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #90caf9;
  margin: 0;
}
.moderator-card {
  background: rgba(255,255,255,0.07);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(31,38,135,0.08);
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  transition: box-shadow 0.2s;
}
.moderator-card:hover {
  box-shadow: 0 4px 16px rgba(100,181,246,0.13);
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
  color: #90caf9;
  font-weight: 700;
  border: 2px solid #64b5f6;
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
.loading-list {
  color: #90caf9;
  text-align: center;
  padding: 1rem 0;
}
.spinner-border {
  width: 1.2rem;
  height: 1.2rem;
  border-width: 0.15em;
}
.modal-backdrop {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.modal-editar {
  background: #222b3a;
  border-radius: 1rem;
  padding: 2rem 1.5rem;
  min-width: 320px;
  max-width: 95vw;
  box-shadow: 0 8px 32px rgba(0,0,0,0.25);
  color: #e8eaed;
}
.btn-secondary {
  background: #374151;
  color: #e8eaed;
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem 1.2rem;
  font-weight: 600;
}
.btn-secondary:hover {
  background: #2d3748;
}
@media (max-width: 900px) {
  .moderator-admin-card {
    padding: 1.2rem 0.5rem;
    min-width: unset;
    max-width: 99vw;
  }
}
</style>
