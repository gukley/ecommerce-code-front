<template>
  <div class="profile-layout theme-page">
    <div class="profile-sidebar-area">
      <ProfileSidebar
        :active="activeTab"
        @change="activeTab = $event"
      />
    </div>
    <div class="profile-main-area">
      <nav class="profile-breadcrumb mb-1 theme-text-secondary">
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
            Aqui você encontra todas as informações relacionadas a sua conta, como acompanhar seus últimos pedidos, gerenciar seus dados e endereços.
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
                <!-- Upload removido conforme solicitado -->
              </div>
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
                  <label for="profile-cpf"><i class="bi bi-credit-card"></i> CPF</label>
                  <input
                    v-model="userForm.cpf"
                    type="text"
                    id="profile-cpf"
                    class="form-control horizontal-input"
                    placeholder="000.000.000-00"
                  />
                </div>

                <div class="form-group horizontal">
                  <label for="profile-phone"><i class="bi bi-telephone"></i> Telefone</label>
                  <input
                    v-model="userForm.phone"
                    type="tel"
                    id="profile-phone"
                    class="form-control horizontal-input"
                    placeholder="(99) 99999-9999"
                  />
                </div>

                <div class="form-group horizontal">
                  <label for="profile-birthdate"><i class="bi bi-calendar"></i> Data de nascimento</label>
                  <input
                    v-model="userForm.birthdate"
                    type="date"
                    id="profile-birthdate"
                    class="form-control horizontal-input"
                    placeholder="YYYY-MM-DD"
                  />
                </div>

                <div class="form-group horizontal">
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
import { updateUserProfile, getUserProfile } from '@/services/apiService.js'

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
  image_path: props.user?.image_path || '',
  cpf: props.user?.cpf || '',
  phone: props.user?.phone || '',
  birthdate: props.user?.birthdate || ''
})

const saveError = ref('')
const saveSuccess = ref('')

watch(() => props.user, (newUser) => {
  userForm.value = {
    name: newUser?.name || '',
    email: newUser?.email || '',
    image_path: newUser?.image_path || '',
    cpf: newUser?.cpf || '',
    phone: newUser?.phone || '',
    birthdate: newUser?.birthdate || ''
  }
}, { immediate: true })

async function saveUserData() {
  saveError.value = ''
  saveSuccess.value = ''
  try {
    // Envie name, email, cpf, phone, birthdate para o backend
    await updateUserProfile({
      name: userForm.value.name,
      email: userForm.value.email,
      cpf: userForm.value.cpf,
      phone: userForm.value.phone,
      birthdate: userForm.value.birthdate
    })

    // Recarrega dados do usuário
    const freshUser = await getUserProfile()
    userForm.value.name = freshUser.name
    userForm.value.email = freshUser.email
    userForm.value.image_path = freshUser.image_path || ''
    userForm.value.cpf = freshUser.cpf || ''
    userForm.value.phone = freshUser.phone || ''
    userForm.value.birthdate = freshUser.birthdate || ''
    saveSuccess.value = 'Dados atualizados com sucesso!'
  } catch (err) {
    // tratar validações do backend
    if (err.response?.status === 422 && err.response?.data?.detail) {
      // pydantic v1/v2 erros podem vir em formatos diferentes
      const detail = err.response.data.detail
      if (Array.isArray(detail)) {
        saveError.value = detail.map(e => e.msg || e.message || JSON.stringify(e)).join(', ')
      } else if (typeof detail === 'string') {
        saveError.value = detail
      } else {
        saveError.value = 'Erro ao salvar dados. Verifique os campos.'
      }
    } else if (err.response?.data?.detail) {
      saveError.value = err.response.data.detail
    } else {
      saveError.value = 'Erro ao salvar dados. Tente novamente.'
    }
  }
}

function formatDate(dateString) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('pt-BR');
}

function resetForm() {
  userForm.value = {
    name: props.user?.name || '',
    email: props.user?.email || '',
    image_path: props.user?.image_path || '',
    cpf: props.user?.cpf || '',
    phone: props.user?.phone || '',
    birthdate: props.user?.birthdate || ''
  };
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
</script>

<style scoped>
.profile-layout {
  display: flex;
  gap: 24px;
  align-items: flex-start;
  min-height: 90vh;
  background: #f8fafc; /* Fundo claro */
  padding: 16px 0 32px 0; /* Padding superior reduzido */
  font-family: 'Inter', sans-serif;
}

.profile-sidebar-area {
  min-width: 280px;
  max-width: 320px;
}

.profile-main-area {
  flex: 1;
  padding-right: 24px;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
  background: linear-gradient(135deg, #4a90e2, #6a5ae0); /* Gradiente azul */
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); /* Sombra leve */
  padding: 1.2rem 1.5rem;
  color: #fff;
  margin-top: 0; /* Remove qualquer margem superior */
}

.profile-header-icon {
  font-size: 3rem;
  color: #007bff; /* Azul vibrante */
}

.profile-title {
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0; /* Remove margens extras */
}

.profile-desc {
  font-size: 1rem;
  color: #e0e7ff; /* Azul claro */
  margin: 0; /* Remove margens extras */
}

.profile-cards-row {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  margin-top: 0;
}

.profile-card {
  flex: 1;
  background: #ffffff; /* Fundo branco */
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05); /* Sombra leve */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 24px;
  font-size: 1rem;
  font-weight: 600;
  color: #6c757d; /* Cinza médio */
  border: 1.5px solid #e0e7ff; /* Borda azul clara */
  transition: all 0.2s ease-in-out;
  cursor: pointer;
}

.profile-card:hover,
.profile-card.active {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1); /* Sombra mais forte */
  transform: translateY(-4px);
  border-color: #007bff; /* Azul vibrante */
}

.profile-card i {
  font-size: 2rem;
  color: #007bff;
  transition: transform 0.2s ease-in-out;
}

.profile-card:hover i,
.profile-card.active i {
  transform: scale(1.1);
}

.profile-sections {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-actions-section.horizontal {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid #e0e7ff; /* Borda azul clara */
}

.btn-profile-save.horizontal {
  background: linear-gradient(90deg, #399bff 0%, #50b8fe 100%); /* Gradiente azul */
  color: #ffffff; /* Texto branco */
  border: none;
  font-weight: 700;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(57, 155, 255, 0.2); /* Sombra leve */
  transition: background 0.2s, box-shadow 0.2s, transform 0.2s;
  padding: 0.7em 1.5em;
  font-size: 1.08rem;
}

.btn-profile-save.horizontal:hover {
  background: linear-gradient(90deg, #50b8fe 0%, #399bff 100%); /* Gradiente invertido */
  box-shadow: 0 4px 16px rgba(57, 155, 255, 0.4); /* Sombra mais forte */
  transform: translateY(-2px);
}

.btn-profile-cancel.horizontal {
  background: #e0e7ff; /* Fundo azul claro */
  color: #007bff; /* Texto azul vibrante */
  border: none;
  font-weight: 600;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(224, 231, 255, 0.2); /* Sombra leve */
  transition: background 0.2s, box-shadow 0.2s, transform 0.2s;
  padding: 0.7em 1.5em;
  font-size: 1.08rem;
}

.btn-profile-cancel.horizontal:hover {
  background: #d6e4ff; /* Fundo azul mais claro */
  box-shadow: 0 4px 16px rgba(224, 231, 255, 0.4); /* Sombra mais forte */
  transform: translateY(-2px);
}

/* Ajustes para dispositivos menores */
@media (max-width: 991px) {
  .profile-layout {
    flex-direction: column;
    gap: 16px;
    padding: 16px;
  }

  .profile-sidebar-area {
    min-width: 100%;
    max-width: 100%;
  }

  .profile-main-area {
    padding-right: 0;
  }

  .profile-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 1rem;
  }

  .profile-header-icon {
    font-size: 2.5rem;
  }

  .profile-title {
    font-size: 1.5rem;
  }

  .profile-desc {
    font-size: 0.9rem;
  }

  .profile-cards-row {
    flex-wrap: wrap;
    gap: 12px;
  }

  .profile-card {
    flex: 1 1 calc(50% - 12px);
    max-width: calc(50% - 12px);
  }
}

@media (max-width: 600px) {
  .profile-header {
    padding: 0.8rem;
  }

  .profile-header-icon {
    font-size: 2rem;
  }

  .profile-title {
    font-size: 1.2rem;
  }

  .profile-desc {
    font-size: 0.8rem;
  }

  .profile-cards-row {
    gap: 8px;
  }

  .profile-card {
    flex: 1 1 100%;
    max-width: 100%;
  }

  .form-actions-section.horizontal {
    flex-direction: column;
    gap: 0.5rem;
    align-items: stretch;
  }

  .btn-profile-save.horizontal,
  .btn-profile-cancel.horizontal {
    width: 100%;
  }
}
</style>
