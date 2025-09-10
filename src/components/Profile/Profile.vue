<template>
  <div class="profile-layout">
    <div class="profile-sidebar-area">
      <ProfileSidebar
        :active="activeTab"
        @change="activeTab = $event"
      />
    </div>
    <div class="profile-main-area">
      <nav class="profile-breadcrumb mb-2">
        <span><i class="bi bi-house"></i></span>
        <span class="mx-2">&gt;</span>
        <span>Minha Conta</span>
      </nav>
      <div class="profile-header">
        <div class="profile-header-icon">
          <i class="bi bi-person-circle"></i>
        </div>
        <div>
          <h1 class="profile-title">Olá, {{ user?.name || 'Usuário' }}</h1>
          <p class="profile-desc">
            Aqui você encontra todas as informações relacionadas a sua conta, como acompanhar seus últimos pedidos, adicionar novos endereços ...
          </p>
        </div>
      </div>
      <hr class="profile-divider" />
      <div class="profile-cards-row">
        <div class="profile-card" :class="{active: activeTab==='dados'}" @click="activeTab = 'dados'">
          <i class="bi bi-person"></i>
          <span>MEUS DADOS</span>
        </div>
        <div class="profile-card" :class="{active: activeTab==='pedidos'}" @click="activeTab = 'pedidos'">
          <i class="bi bi-receipt"></i>
          <span>MEUS PEDIDOS</span>
        </div>
        <div class="profile-card" :class="{active: activeTab==='enderecos'}" @click="activeTab = 'enderecos'">
          <i class="bi bi-geo-alt"></i>
          <span>ENDEREÇOS</span>
        </div>
        <div class="profile-card" :class="{active: activeTab==='favoritos'}" @click="activeTab = 'favoritos'">
          <i class="bi bi-heart"></i>
          <span>FAVORITOS</span>
        </div>
      </div>
      <div class="profile-sections">
        <!-- Seção Meus Dados Editável -->
        <div v-if="activeTab === 'dados'" class="profile-user-data-card editable">
          <form @submit.prevent="saveUserData" class="profile-user-form">
            <div class="profile-user-data-header">
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
              <div>
                <input
                  v-model="userForm.name"
                  type="text"
                  class="form-control profile-input-name"
                  placeholder="Nome"
                  required
                />
                <input
                  v-model="userForm.email"
                  type="email"
                  class="form-control profile-input-email"
                  placeholder="E-mail"
                  required
                />
              </div>
            </div>
            <div class="profile-user-data-body">
              <div class="profile-user-info-row">
                <span class="profile-user-info-label">Nome:</span>
                <span class="profile-user-info-value">{{ userForm.name }}</span>
              </div>
              <div class="profile-user-info-row">
                <span class="profile-user-info-label">E-mail:</span>
                <span class="profile-user-info-value">{{ userForm.email }}</span>
              </div>
            </div>
            <div class="d-flex justify-content-end mt-4 gap-2">
              <button type="submit" class="btn btn-profile-save">
                <i class="bi bi-save"></i> Salvar Dados
              </button>
            </div>
            <div v-if="saveError" class="text-danger mt-2">{{ saveError }}</div>
            <div v-if="saveSuccess" class="text-success mt-2">{{ saveSuccess }}</div>
          </form>
        </div>
        <!-- Exemplo: só mostra a seção ativa -->
        <ProfileOrders v-if="activeTab === 'pedidos'" :orders="orders" @cancel="cancelOrder" />
        <ProfileFavorites v-if="activeTab === 'favoritos'" :favorites="favorites" />
        <ProfileAddresses
          v-if="activeTab === 'enderecos'"
          :addresses="addresses"
          @add="openAddAddressModal"
          @edit="openEditAddressModal"
          @delete="deleteAddress"
        />
        <!-- Dados do usuário pode ser um card ou modal -->
      </div>
      <AddressModal
        v-if="showAddressModal"
        :address="selectedAddress"
        @close="closeAddressModal"
        @saved="refreshAddresses"
      />
    </div>
    <ProfileEditModal v-if="showEditModal" :user="user" @close="showEditModal = false" @updated="fetchUser" />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import ProfileSidebar from './ProfileSidebar.vue'
import ProfileOrders from './ProfileOrders.vue'
import ProfileFavorites from './ProfileFavorites.vue'
import ProfileAddresses from './ProfileAddresses.vue'
import ProfileEditModal from './ProfileEditModal.vue'
import AddressModal from './AddressModal.vue'
import { updateUserProfile, updateUserImage, getUserProfile } from '@/services/apiService.js'

const BASE_URL = import.meta.env.VITE_API_URL

const props = defineProps({
  user: Object,
  orders: Array,
  favorites: Array,
  addresses: Array
})

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

function fetchUser() { /* ...buscar dados do usuário... */ }
function cancelOrder(id) { /* ...cancelar pedido... */ }
function addAddress() { /* ...adicionar endereço... */ }
function editAddress(addr) { /* ...editar endereço... */ }

async function deleteAddress(address) {
  if (confirm('Deseja realmente excluir este endereço?')) {
    await deleteAddressApi(address.id)
    await refreshAddresses()
  }
}

function openAddAddressModal() {
  selectedAddress.value = null
  showAddressModal.value = true
}

function openEditAddressModal(address) {
  selectedAddress.value = address
  showAddressModal.value = true
}

function closeAddressModal() {
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
  background: #fff;
  padding: 32px 0;
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
  color: #232e47;
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
  color: #d32f2f;
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
  color: #232e47;
  opacity: 0.85;
  margin-bottom: 0;
}
.profile-divider {
  border: none;
  border-top: 3px solid #d32f2f;
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
  border-radius: 12px;
  box-shadow: 0 2px 8px #232e4720;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 28px 0 22px 0;
  font-size: 1.15rem;
  font-weight: 700;
  color: #232e47;
  border: 2px solid #eee;
  cursor: pointer;
  transition: box-shadow 0.18s, border 0.18s, color 0.18s;
}
.profile-card i {
  font-size: 2.1rem;
  color: #d32f2f;
}
.profile-card:hover, .profile-card.active {
  border: 2px solid #d32f2f;
  color: #d32f2f;
  box-shadow: 0 4px 18px #d32f2f20;
}
.profile-sections {
  display: flex;
  flex-direction: column;
  gap: 28px;
}
.profile-user-data-card {
  background: linear-gradient(120deg, #232e47 80%, #181e2a 100%);
  border-radius: 1.5rem;
  box-shadow: 0 4px 24px #232e4740;
  border: 1.5px solid #232e47;
  padding: 2rem 2.2rem;
  margin-bottom: 2rem;
  color: #e8eaed;
  max-width: 480px;
}
.profile-user-data-card.editable {
  background: #fff;
  color: #232e47;
  box-shadow: 0 4px 24px #232e4720;
  border-radius: 1.5rem;
  border: 1.5px solid #e5e7eb;
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
  background: #e5e7eb;
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
  background: #50b8fe;
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
  border-color: #50b8fe;
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
  color: #8f5fe8;
  min-width: 80px;
}
.profile-user-info-value {
  color: #232e47;
  font-weight: 500;
}
@media (max-width: 600px) {
  .profile-user-data-card {
    padding: 1.2rem 0.7rem;
    max-width: 99vw;
  }
  .profile-user-data-card.editable {
    padding: 1.2rem 0.7rem;
    max-width: 99vw;
  }
  .profile-user-data-header {
    gap: 1rem;
    flex-direction: column;
  }
  .profile-avatar-box {
    width: 70px;
    height: 70px;
  }
  .profile-avatar-img {
    width: 70px;
    height: 70px;
  }
}
</style>
