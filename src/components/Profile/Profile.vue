<template>
  <div class="profile-layout theme-page">
    <div class="profile-sidebar-area">
      <ProfileSidebar
        :active="activeTab"
        @change="activeTab = $event"
      />
    </div>
    <div class="profile-main-area">
      <nav class="profile-breadcrumb mb-2 theme-text-secondary">
        <span><i class="bi bi-house"></i></span>
        <span class="mx-2">&gt;</span>
        <span>Minha Conta</span>
      </nav>
      <div class="profile-header theme-card">
        <div class="profile-header-icon">
          <i class="bi bi-person-circle theme-text-accent"></i>
        </div>
        <div>
          <h1 class="profile-title theme-text-primary">Olá, {{ user?.name || 'Usuário' }}</h1>
          <p class="profile-desc theme-text-secondary">
            Aqui você encontra todas as informações relacionadas a sua conta, como acompanhar seus últimos pedidos, adicionar novos endereços ...
          </p>
        </div>
      </div>
      <hr class="profile-divider" />
      <div class="profile-cards-row">
        <div class="profile-card theme-card" :class="{active: activeTab==='dados'}" @click="activeTab = 'dados'">
          <i class="bi bi-person"></i>
          <span class="theme-text-primary">MEUS DADOS</span>
        </div>
        <div class="profile-card theme-card" :class="{active: activeTab==='pedidos'}" @click="activeTab = 'pedidos'">
          <i class="bi bi-receipt"></i>
          <span class="theme-text-primary">MEUS PEDIDOS</span>
        </div>
        <div class="profile-card theme-card" :class="{active: activeTab==='enderecos'}" @click="activeTab = 'enderecos'">
          <i class="bi bi-geo-alt"></i>
          <span class="theme-text-primary">ENDEREÇOS</span>
        </div>
        <div class="profile-card theme-card" :class="{active: activeTab==='cupons'}" @click="activeTab = 'cupons'">
          <i class="bi bi-ticket-detailed"></i>
          <span class="theme-text-primary">CUPONS</span>
        </div>
      </div>
      <div class="profile-sections">
        <!-- Seção Meus Dados Editável -->
        <div v-if="activeTab === 'dados'" class="profile-user-data-card editable">
          <div class="profile-section-header">
            <h3 class="profile-section-title">
              <i class="bi bi-person-circle"></i>
              Meus Dados Pessoais
            </h3>
            <p class="profile-section-desc">Gerencie suas informações pessoais e foto de perfil</p>
          </div>
          
          <form @submit.prevent="saveUserData" class="profile-user-form">
            <div class="profile-user-data-header grid-user-data">
              <div class="profile-avatar-section">
                <div class="profile-avatar-box">
                  <img
                    :src="avatarPreview || (userForm.image_path ? BASE_URL + userForm.image_path : '/default-avatar.png')"
                    alt="Foto de perfil"
                    class="profile-avatar-img"
                  />
                  <label class="avatar-edit-btn" title="Alterar foto">
                    <i class="bi bi-camera"></i>
                    <input type="file" accept="image/*" class="avatar-input" @change="onAvatarChange" />
                  </label>
                </div>
                <p class="avatar-help-text">Clique no ícone da câmera para alterar sua foto</p>
              </div>
              
              <div class="profile-user-fields">
                <div class="form-group">
                  <label class="profile-label" for="profile-name">
                    <i class="bi bi-person"></i>
                    Nome Completo
                  </label>
                  <input
                    v-model="userForm.name"
                    type="text"
                    id="profile-name"
                    class="form-control profile-input-name"
                    placeholder="Digite seu nome completo"
                    required
                  />
                </div>
                
                <div class="form-group">
                  <label class="profile-label" for="profile-email">
                    <i class="bi bi-envelope"></i>
                    E-mail
                  </label>
                  <input
                    v-model="userForm.email"
                    type="email"
                    id="profile-email"
                    class="form-control profile-input-email"
                    placeholder="Digite seu e-mail"
                    required
                  />
                </div>
              </div>
            </div>
            
            <div class="profile-user-data-body info-user-data">
              <h4 class="info-section-title">
                <i class="bi bi-info-circle"></i>
                Resumo das Informações
              </h4>
              <div class="profile-user-info-row">
                <span class="profile-user-info-label">Nome:</span>
                <span class="profile-user-info-value">{{ userForm.name || 'Não informado' }}</span>
              </div>
              <div class="profile-user-info-row">
                <span class="profile-user-info-label">E-mail:</span>
                <span class="profile-user-info-value">{{ userForm.email || 'Não informado' }}</span>
              </div>
              <div class="profile-user-info-row">
                <span class="profile-user-info-label">Membro desde:</span>
                <span class="profile-user-info-value">{{ formatDate(user?.created_at) }}</span>
              </div>
            </div>
            
            <div class="form-actions-section">
              <button type="submit" class="btn btn-profile-save">
                <i class="bi bi-save"></i> 
                Salvar Alterações
              </button>
              <button type="button" class="btn btn-profile-cancel" @click="resetForm">
                <i class="bi bi-arrow-clockwise"></i>
                Cancelar
              </button>
            </div>
            
            <div v-if="saveError" class="alert alert-danger mt-3">
              <i class="bi bi-exclamation-triangle"></i>
              {{ saveError }}
            </div>
            <div v-if="saveSuccess" class="alert alert-success mt-3">
              <i class="bi bi-check-circle"></i>
              {{ saveSuccess }}
            </div>
          </form>
        </div>
        <!-- Exemplo: só mostra a seção ativa -->
        <ProfileOrders v-if="activeTab === 'pedidos'" :orders="orders" @cancel="(id) => emit('cancel-order', id)" />
        <ProfileAddresses
          v-if="activeTab === 'enderecos'"
          :addresses="addresses"
          @add="openAddAddressModal"
          @edit="addr => openEditAddressModal(addr)"
          @delete="id => emit('delete-address', id)"
        />
        <ProfileCoupons v-if="activeTab === 'cupons'" />
        <!-- Dados do usuário pode ser um card ou modal -->
      </div>
      <AddressModal
        v-if="showAddressModal"
        :address="selectedAddress"
        @close="closeAddressModal"
        @saved="onAddressSaved"
      />
    </div>
    <ProfileEditModal v-if="showEditModal" :user="user" @close="showEditModal = false" @updated="fetchUser" />
  </div>
</template>

<script setup>
import { ref, watch, defineEmits } from 'vue'
import ProfileSidebar from './ProfileSidebar.vue'
import ProfileOrders from './ProfileOrders.vue'
import ProfileAddresses from './ProfileAddresses.vue'
import ProfileEditModal from './ProfileEditModal.vue'
import AddressModal from './AddressModal.vue'
import ProfileCoupons from './ProfileCoupons.vue'
import { updateUserProfile, updateUserImage, getUserProfile } from '@/services/apiService.js'

const BASE_URL = import.meta.env.VITE_API_URL

const props = defineProps({
  user: Object,
  orders: Array,
  favorites: Array,
  addresses: Array
})

const emit = defineEmits(['add-address', 'edit-address', 'delete-address', 'cancel-order'])

const showEditModal = ref(false)
const activeTab = ref('dados')
const showAddressModal = ref(false)
const selectedAddress = ref(null)

const userForm = ref({
  name: props.user?.name || '',
  email: props.user?.email || '',
  image_path: props.user?.image_path || ''
})
const avatarFile = ref(null)
const avatarPreview = ref('')
const saveError = ref('')
const saveSuccess = ref('')

watch(() => props.user, (newUser) => {
  userForm.value = {
    name: newUser?.name || '',
    email: newUser?.email || '',
    image_path: newUser?.image_path || ''
  }
  avatarPreview.value = ''
}, { immediate: true })

function onAvatarChange(e) {
  const file = e.target.files[0]
  if (file) {
    avatarFile.value = file
    const reader = new FileReader()
    reader.onload = (ev) => {
      avatarPreview.value = ev.target.result
    }
    reader.readAsDataURL(file)
  }
}

async function saveUserData() {
  saveError.value = ''
  saveSuccess.value = ''
  try {
    // Envie apenas name e email
    await updateUserProfile({
      name: userForm.value.name,
      email: userForm.value.email
    })
    // Atualiza imagem se houver novo arquivo
    if (avatarFile.value) {
      const updatedUser = await updateUserImage(avatarFile.value)
      userForm.value.image_path = updatedUser.image_path || ''
      avatarFile.value = null
      avatarPreview.value = ''
    }
    // Sempre recarregue o usuário após salvar para garantir atualização do campo image_path
    const freshUser = await getUserProfile()
    userForm.value.name = freshUser.name
    userForm.value.email = freshUser.email
    userForm.value.image_path = freshUser.image_path || ''
    saveSuccess.value = 'Dados atualizados com sucesso!'
  } catch (err) {
    if (err.response?.status === 422 && err.response?.data?.detail) {
      saveError.value = err.response.data.detail.map(e => e.msg).join(', ')
    } else {
      saveError.value = 'Erro ao salvar dados. Tente novamente.'
    }
  }
}

function formatDate(dateString) {
  if (!dateString) return 'Não informado';
  return new Date(dateString).toLocaleDateString('pt-BR');
}

function resetForm() {
  userForm.value = {
    name: props.user?.name || '',
    email: props.user?.email || '',
    image_path: props.user?.image_path || ''
  };
  avatarPreview.value = '';
  avatarFile.value = null;
  saveError.value = '';
  saveSuccess.value = '';
}

function openAddAddressModal() {
  selectedAddress.value = null // Novo endereço
  showAddressModal.value = true
}

function openEditAddressModal(addr) {
  selectedAddress.value = addr // Editar endereço existente
  showAddressModal.value = true
}

function closeAddressModal() {
  showAddressModal.value = false
}

function onAddressSaved(addressData) {
  // Emite para o pai criar ou editar
  if (addressData.id) {
    emit('edit-address', addressData)
  } else {
    emit('add-address', addressData)
  }
  showAddressModal.value = false
}

// Use addresses da prop, não de um ref local
function refreshAddresses() {
  // Atualize o addresses da prop se possível, ou emita evento para o pai atualizar
  // Se addresses vier do pai, peça para o pai atualizar via emit:
  // emit('refresh-addresses')
  // Ou, se quiser controlar localmente:
  // addresses.value = await getAllAddresses()
  // Mas o correto é: addresses deve vir do pai (ProfileView.vue)
}
</script>

<style scoped>
.profile-layout {
  display: flex;
  gap: 32px;
  align-items: flex-start;
  min-height: 90vh;
  background: var(--bg-main);
  padding: 32px 0;
  transition: background-color var(--transition-normal);
}
.profile-sidebar-area {
  min-width: 290px;
  max-width: 350px;
}
.profile-main-area {
  flex: 1;
  padding-right: 32px;
}
.profile-breadcrumb {
  font-size: 1.08rem;
  color: var(--text-secondary);
  margin-bottom: 18px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.profile-header {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 8px;
}
.profile-header-icon {
  font-size: 3.2rem;
  color: var(--accent-primary);
  margin-right: 8px;
}
.profile-title {
  font-size: 2.1rem;
  font-weight: 800;
  color: var(--text-main);
  margin-bottom: 2px;
}
.profile-desc {
  font-size: 1.08rem;
  color: var(--text-secondary);
  opacity: 0.85;
  margin-bottom: 0;
}
.profile-divider {
  border: none;
  border-top: 3px solid var(--accent-primary);
  margin: 18px 0 24px 0;
}
.profile-cards-row {
  display: flex;
  gap: 24px;
  margin-bottom: 32px;
}
.profile-card {
  flex: 1;
  background: var(--bg-card);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-md);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 28px 0 22px 0;
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--text-main);
  border: 2px solid var(--border-color);
  cursor: pointer;
  transition: all var(--transition-normal);
}
.profile-card i {
  font-size: 2.1rem;
  color: var(--text-secondary);
  transition: all var(--transition-normal);
}
.profile-card:hover, .profile-card.active {
  border: 2px solid var(--accent-primary);
  color: var(--accent-primary);
  box-shadow: var(--shadow-glow);
  transform: translateY(-2px);
}
.profile-card:hover i, .profile-card.active i {
  color: var(--accent-primary);
  transform: scale(1.1);
}
.profile-sections {
  display: flex;
  flex-direction: column;
  gap: 28px;
}
.profile-user-data-card {
  background: #fff;
  border-radius: 1.5rem;
  box-shadow: 0 4px 24px #399bff20;
  border: 1.5px solid #e5e7eb;
  padding: 2rem 2.2rem;
  margin-bottom: 2rem;
  color: #232e47;
  max-width: 480px;
}
.profile-user-data-card.editable {
  background: #eaf6ff;
  color: #232e47;
  box-shadow: 0 4px 24px #399bff20;
  border-radius: 1.5rem;
  border: 1.5px solid #b8d8ff;
  padding: 2.5rem 2.2rem;
  margin-bottom: 2rem;
  max-width: 480px;
  margin-left: auto;
  margin-right: auto;
}
.profile-user-form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.profile-user-data-header {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 1.2rem;
  justify-content: center;
}
.profile-avatar-box {
  position: relative;
  width: 110px;
  height: 110px;
  border-radius: 50%;
  overflow: hidden;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 16px #399bff20;
  border: 2px solid #50b8fe;
}
.profile-avatar-img {
  width: 110px;
  height: 110px;
  object-fit: cover;
  border-radius: 50%;
  background: #f8f9fa;
  display: block;
}
.avatar-edit-btn {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: #b8d8ff;
  color: #232e47;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  box-shadow: 0 2px 8px #399bff10;
  cursor: pointer;
  transition: background 0.18s, color 0.18s;
  z-index: 2;
}
.avatar-edit-btn:hover {
  background: #399bff;
  color: #fff;
}
.avatar-input {
  display: none;
}
.profile-input-name,
.profile-input-email {
  background: #f8f9fa;
  border: 1.5px solid #e5e7eb;
  border-radius: 10px;
  font-size: 1.12rem;
  font-weight: 600;
  color: #232e47;
  margin-bottom: 0.7rem;
  padding: 0.7rem 1rem;
  box-shadow: 0 2px 8px #232e4710;
  transition: border 0.2s, background 0.2s;
  width: 100%;
}
.profile-input-name:focus,
.profile-input-email:focus {
  border-color: #399bff;
  background: #fff;
  outline: none;
}
.btn-profile-save {
  background: linear-gradient(90deg,#50b8fe 60%, #399bff 100%);
  color: #fff;
  border: none;
  font-weight: 700;
  border-radius: 10px;
  box-shadow: 0 2px 8px #50b8fe20;
  transition: background 0.18s, color 0.18s, box-shadow 0.18s;
  padding: 0.7em 1.5em;
  font-size: 1.08rem;
}
.btn-profile-save:hover {
  background: linear-gradient(90deg,#399bff 60%, #50b8fe 100%);
  color: #fff;
  box-shadow: 0 4px 18px #50b8fe40;
}
.profile-user-data-body {
  margin-top: 1.2rem;
}
.profile-user-info-row {
  display: flex;
  gap: 1.2rem;
  margin-bottom: 0.7rem;
}
.profile-user-info-label {
  font-weight: 600;
  color: #399bff;
  min-width: 80px;
}
.profile-user-info-value {
  color: #232e47;
  font-weight: 500;
}
/* CSS extra para layout profissional */
.profile-section-header {
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e5e7eb;
}

.profile-section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #232e47;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.profile-section-title i {
  color: #399bff;
  font-size: 1.3rem;
}

.profile-section-desc {
  color: #6b7280;
  font-size: 1rem;
  margin: 0;
}

.profile-avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.avatar-help-text {
  font-size: 0.85rem;
  color: #6b7280;
  text-align: center;
  margin: 0;
  font-style: italic;
}

.grid-user-data {
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 2.2rem;
  align-items: flex-start;
  margin-bottom: 1.2rem;
}

.profile-user-fields {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.profile-label {
  font-weight: 600;
  color: #399bff;
  margin-bottom: 0.2rem;
  font-size: 1.08rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.profile-label i {
  font-size: 0.9rem;
}

.info-section-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #232e47;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.info-section-title i {
  color: #399bff;
}

.info-user-data {
  margin-top: 1.2rem;
  padding: 1.2rem 1.2rem;
  background: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 2px 8px #b8d8ff10;
  border: 1px solid #e5e7eb;
}

.form-actions-section {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.btn-profile-cancel {
  background: #6b7280;
  color: #fff;
  border: none;
  font-weight: 600;
  border-radius: 10px;
  box-shadow: 0 2px 8px #6b728020;
  transition: background 0.18s, box-shadow 0.18s;
  padding: 0.7em 1.5em;
  font-size: 1.08rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-profile-cancel:hover {
  background: #4b5563;
  box-shadow: 0 4px 18px #6b728040;
}

.alert {
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.alert-danger {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

.alert-success {
  background: #f0fdf4;
  color: #16a34a;
  border: 1px solid #bbf7d0;
}
@media (max-width: 991.98px) {
  .profile-layout {
    flex-direction: column;
    gap: 0;
    padding: 0;
    min-height: unset;
  }
  .profile-sidebar-area {
    min-width: 100%;
    max-width: 100%;
    margin-bottom: 1.2rem;
  }
  .profile-main-area {
    padding-right: 0;
    width: 100%;
  }
  .profile-cards-row {
    flex-direction: column;
    gap: 14px;
    margin-bottom: 18px;
  }
  .profile-card {
    width: 100%;
    min-width: 0;
    padding: 18px 0 14px 0;
    font-size: 1rem;
  }
  .profile-header {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }
  .profile-header-icon {
    font-size: 2.2rem;
    margin-right: 0;
  }
  .profile-title {
    font-size: 1.3rem;
  }
  .profile-desc {
    font-size: 0.98rem;
  }
  .profile-divider {
    margin: 12px 0 16px 0;
  }
  .profile-user-data-card,
  .profile-user-data-card.editable {
    padding: 1.2rem 0.7rem;
    max-width: 99vw;
    border-radius: 1rem;
  }
  .profile-user-data-header {
    gap: 1rem;
    flex-direction: column;
    align-items: flex-start;
  }
  .profile-avatar-box {
    width: 70px;
    height: 70px;
  }
  .profile-avatar-img {
    width: 70px;
    height: 70px;
  }
  .profile-input-name,
  .profile-input-email {
    font-size: 1rem;
    padding: 0.5rem 0.7rem;
  }
  .grid-user-data {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  .profile-user-fields {
    gap: 0.5rem;
  }
}
@media (max-width: 600px) {
  .profile-layout {
    padding: 0;
  }
  .profile-sidebar-area {
    min-width: 100%;
    max-width: 100%;
    margin-bottom: 0.7rem;
  }
  .profile-main-area {
    padding-right: 0;
    width: 100%;
  }
  .profile-cards-row {
    flex-direction: column;
    gap: 10px;
    margin-bottom: 12px;
  }
  .profile-card {
    width: 100%;
    min-width: 0;
    padding: 12px 0 10px 0;
    font-size: 0.95rem;
  }
  .profile-header {
    flex-direction: column;
    gap: 7px;
    align-items: flex-start;
  }
  .profile-header-icon {
    font-size: 1.4rem;
    margin-right: 0;
  }
  .profile-title {
    font-size: 1.05rem;
  }
  .profile-desc {
    font-size: 0.92rem;
  }
  .profile-divider {
    margin: 8px 0 10px 0;
  }
  .profile-user-data-card,
  .profile-user-data-card.editable {
    padding: 0.7rem 0.2rem;
    max-width: 99vw;
    border-radius: 0.7rem;
  }
  .profile-user-data-header {
    gap: 0.5rem;
    flex-direction: column;
    align-items: flex-start;
  }
  .profile-avatar-box {
    width: 48px;
    height: 48px;
  }
  .profile-avatar-img {
    width: 48px;
    height: 48px;
  }
  .profile-input-name,
  .profile-input-email {
    font-size: 0.95rem;
    padding: 0.4rem 0.5rem;
  }
  .btn-profile-save {
    font-size: 0.95rem;
    padding: 0.5em 1em;
  }
  .profile-section-title {
    font-size: 1.05rem;
  }
  .profile-section-desc {
    font-size: 0.92rem;
  }
  .info-section-title {
    font-size: 0.98rem;
  }
  .info-user-data {
    padding: 0.7rem 0.5rem;
    border-radius: 8px;
  }
  .form-actions-section {
    flex-direction: column;
    gap: 0.7rem;
    margin-top: 1rem;
    padding-top: 0.5rem;
  }
}
</style>
