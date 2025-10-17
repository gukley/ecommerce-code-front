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
        <div v-if="activeTab === 'dados'" class="profile-user-data-horizontal">
          <div class="profile-user-data-center">
            <div class="profile-avatar-upload">
              <div class="profile-avatar-box big">
                <img
                  :src="avatarPreview || (userForm.image_path ? BASE_URL + userForm.image_path : '/default-avatar.png')"
                  alt="Foto de perfil"
                  class="profile-avatar-img big"
                />
                <label class="avatar-edit-btn" title="Alterar foto">
                  <i class="bi bi-camera"></i>
                  <input type="file" accept="image/*" class="avatar-input" @change="onAvatarChange" />
                </label>
              </div>
              <p class="avatar-help-text">Clique no ícone da câmera para alterar sua foto</p>
            </div>
            <form @submit.prevent="saveUserData" class="profile-user-fields-form">
              <div class="profile-user-fields-grid">
                <div class="form-group horizontal">
                  <label for="profile-name"><i class="bi bi-person"></i> Nome</label>
                  <input
                    v-model="userForm.name"
                    type="text"
                    id="profile-name"
                    class="form-control horizontal-input"
                    placeholder="Nome completo"
                    required
                  />
                </div>
                <div class="form-group horizontal">
                  <label for="profile-email"><i class="bi bi-envelope"></i> E-mail</label>
                  <input
                    v-model="userForm.email"
                    type="email"
                    id="profile-email"
                    class="form-control horizontal-input"
                    placeholder="E-mail"
                    required
                  />
                </div>
                <div class="form-group horizontal">
                  <label><i class="bi bi-calendar"></i> Membro desde</label>
                  <span class="horizontal-value">{{ formatDate(user?.created_at) }}</span>
                </div>
              </div>
              <div class="form-actions-section horizontal">
                <button type="submit" class="btn btn-profile-save horizontal">
                  <i class="bi bi-save"></i> Salvar
                </button>
                <button type="button" class="btn btn-profile-cancel horizontal" @click="resetForm">
                  <i class="bi bi-arrow-clockwise"></i> Cancelar
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
  background: linear-gradient(120deg, #eaf6ff 60%, #b8d8ff 100%);
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
  color: #399bff;
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
  background: linear-gradient(90deg, #eaf6ff 60%, #b8d8ff 100%);
  border-radius: 1.2rem;
  box-shadow: 0 4px 24px #399bff20;
  padding: 1.2rem 1.5rem;
}
.profile-header-icon {
  font-size: 3.2rem;
  color: #399bff;
  margin-right: 8px;
}
.profile-title {
  font-size: 2.1rem;
  font-weight: 800;
  color: #232e47;
  margin-bottom: 2px;
}
.profile-desc {
  font-size: 1.08rem;
  color: #399bff;
  opacity: 0.85;
  margin-bottom: 0;
}
.profile-divider {
  border: none;
  border-top: 3px solid #399bff;
  margin: 18px 0 24px 0;
}
.profile-cards-row {
  display: flex;
  gap: 24px;
  margin-bottom: 32px;
}
.profile-card {
  flex: 1;
  background: #fff;
  border-radius: var(--border-radius);
  box-shadow: 0 2px 12px #399bff20;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 28px 0 22px 0;
  font-size: 1.15rem;
  font-weight: 700;
  color: #232e47;
  border: 2px solid #b8d8ff;
  cursor: pointer;
  transition: all var(--transition-normal);
}
.profile-card i {
  font-size: 2.1rem;
  color: #399bff;
  transition: all var(--transition-normal);
}
.profile-card:hover, .profile-card.active {
  border: 2px solid #399bff;
  color: #399bff;
  box-shadow: 0 4px 18px #399bff40;
  transform: translateY(-2px);
  background: linear-gradient(90deg, #eaf6ff 60%, #b8d8ff 100%);
}
.profile-card:hover i, .profile-card.active i {
  color: #399bff;
  transform: scale(1.1);
}
.profile-sections {
  display: flex;
  flex-direction: column;
  gap: 28px;
}
.profile-user-data-horizontal {
  width: 100%;
  margin-bottom: 2rem;
  padding: 0;
  background: none;
}
.profile-user-data-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2.2rem;
  width: 100%;
  margin-bottom: 2rem;
}
.profile-avatar-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 0.5rem;
}
.profile-avatar-box.big {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: #eaf6ff;
  border: 2px solid #399bff;
  box-shadow: 0 2px 16px #399bff20;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0;
}
.profile-avatar-img.big {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 50%;
  background: #eaf6ff;
}
.avatar-edit-btn {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: linear-gradient(90deg,#50b8fe 60%, #399bff 100%);
  color: #181e2a;
  border: none;
  border-radius: 50%;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  box-shadow: 0 2px 8px #399bff30;
  cursor: pointer;
  transition: background 0.18s, color 0.18s;
  z-index: 2;
  overflow: hidden;
}
.avatar-edit-btn input[type="file"] {
  opacity: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0; top: 0;
  cursor: pointer;
}
.avatar-edit-btn:hover {
  background: linear-gradient(90deg,#399bff 60%, #50b8fe 100%);
  color: #fff;
}
.avatar-help-text {
  font-size: 0.95rem;
  color: #399bff;
  margin-top: 0.5rem;
  text-align: center;
  opacity: 0.85;
}
.profile-user-fields-form {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}
.profile-user-fields-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.2rem 2.2rem;
  align-items: center;
  margin-bottom: 0.5rem;
  background: none;
}
.form-group.horizontal {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.3rem;
}
.form-group.horizontal label {
  color: #399bff;
  font-size: 1.08rem;
  font-weight: 600;
  margin-bottom: 0;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  text-align: left;
}
.horizontal-input {
  background: #eaf6ff;
  border: 1.5px solid #b8d8ff;
  border-radius: 10px;
  font-size: 1.12rem;
  font-weight: 600;
  color: #232e47;
  padding: 0.7rem 1rem;
  box-shadow: 0 2px 8px #232e4710;
  transition: border 0.2s, background 0.2s;
  width: 100%;
  max-width: 320px;
}
.horizontal-input:focus {
  border-color: #399bff;
  background: #fff;
  outline: none;
}
.horizontal-value {
  font-size: 1.08rem;
  color: #232e47;
  font-weight: 500;
  padding: 0.7rem 0.2rem;
  min-width: 120px;
  text-align: left;
  background: #eaf6ff;
  border-radius: 10px;
  border: 1.5px solid #b8d8ff;
  max-width: 320px;
}
.form-actions-section.horizontal {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid #b8d8ff;
}
.btn-profile-save.horizontal {
  background: linear-gradient(90deg,#399bff 60%, #50b8fe 100%);
  color: #fff;
  border: none;
  font-weight: 700;
  border-radius: 10px;
  box-shadow: 0 2px 8px #399bff20;
  transition: background 0.18s, color 0.18s, box-shadow 0.18s;
  padding: 0.7em 1.5em;
  font-size: 1.08rem;
}
.btn-profile-save.horizontal:hover {
  background: linear-gradient(90deg,#50b8fe 60%, #399bff 100%);
  color: #fff;
  box-shadow: 0 4px 18px #399bff40;
}
.btn-profile-cancel.horizontal {
  background: #b8d8ff;
  color: #232e47;
  border: none;
  font-weight: 600;
  border-radius: 10px;
  box-shadow: 0 2px 8px #b8d8ff20;
  transition: background 0.18s, box-shadow 0.18s;
  padding: 0.7em 1.5em;
  font-size: 1.08rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.btn-profile-cancel.horizontal:hover {
  background: #399bff;
  color: #fff;
  box-shadow: 0 4px 18px #399bff40;
}

/* Responsivo */
@media (max-width: 991.98px) {
  .profile-user-data-center {
    gap: 1.2rem;
  }
  .profile-user-fields-grid {
    grid-template-columns: 1fr;
    gap: 1rem 0;
  }
  .form-actions-section.horizontal {
    flex-direction: column;
    align-items: stretch;
    gap: 0.7rem;
  }
  .profile-avatar-box.big,
  .profile-avatar-img.big {
    width: 90px;
    height: 90px;
  }
}

@media (max-width: 600px) {
  .profile-user-data-center {
    gap: 0.7rem;
  }
  .profile-user-fields-form {
    max-width: 99vw;
    padding: 0 0.2rem;
  }
  .profile-avatar-box.big,
  .profile-avatar-img.big {
    width: 70px;
    height: 70px;
  }
  .horizontal-input,
  .horizontal-value {
    font-size: 0.98rem;
    padding: 0.5rem 0.7rem;
    max-width: 100%;
  }
}
</style>
  