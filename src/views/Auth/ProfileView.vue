<template>
  <div class="profile-bg py-5">
    <div class="container">
      <!-- Botão de voltar para home -->
      <div class="d-flex justify-content-start mb-4">
        <router-link to="/" class="btn-back-home">
          <i class="bi bi-arrow-left"></i> Voltar para Home
        </router-link>
      </div>
      <div class="row g-4 justify-content-center">
        <!-- Sidebar com avatar e dados -->
        <div class="col-12 col-lg-4 d-flex flex-column align-items-center">
          <aside class="profile-sidebar-glass modern-sidebar">
            <div class="profile-avatar-box position-relative mb-3">
              <img
                :src="avatarUrl"
                alt="Avatar"
                class="profile-avatar-img"
                @error="onAvatarError"
                loading="lazy"
                style="object-fit: cover; width: 100%; height: 100%; border-radius: 50%; background: #232e47;"
              />
              <button class="avatar-edit-btn" @click="showEditModal = true" title="Editar avatar">
                <i class="bi bi-pencil"></i>
              </button>
            </div>
            <h3 class="sidebar-name text-center mb-1">{{ user?.name || 'Usuário' }}</h3>
            <p class="sidebar-email text-center mb-3">{{ user?.email || 'Sem email' }}</p>
            <div class="sidebar-badges mb-3 d-flex flex-column align-items-center gap-2">
              <span class="badge modern-badge bg-purple">
                <i class="bi bi-person-badge"></i> <strong>ID:</strong> {{ user?.id || '-' }}
              </span>
              <span class="badge modern-badge bg-green">
                <i class="bi bi-shield-lock"></i> <strong>Papel:</strong> {{ user?.role || '-' }}
              </span>
            </div>
            <button class="sidebar-btn w-100" @click="showEditModal = true">
              <i class="bi bi-pencil"></i> Editar Perfil
            </button>
          </aside>
        </div>
        <!-- Conteúdo principal -->
        <div class="col-12 col-lg-8">
          <section class="profile-main-section d-grid gap-4">
            <div class="profile-header-card mb-2">
              <h2 class="profile-username mb-1">
                <i class="bi bi-person-circle me-2"></i>{{ user?.name || 'Usuário' }}
              </h2>
              <div class="profile-user-email">{{ user?.email }}</div>
            </div>
            <ProfileAddresses
              :addresses="addresses"
              @refresh="fetchAddresses"
              @add="showAddressModal = true"
              @edit="editAddress"
              @delete="deleteAddress"
            />
            <ProfileOrders :orders="orders" @cancel="cancelOrder" />
            <ProfileFavorites :favorites="favorites" />
            <ProfileReviews :reviews="reviews" />
          </section>
        </div>
      </div>
    </div>
    <!-- Modais -->
    <ProfileEditModal
      v-if="showEditModal"
      :user="user"
      @close="showEditModal = false"
      @updated="fetchProfileAndAvatar"
    />
    <AddressModal
      v-if="showAddressModal"
      mode="add"
      @close="showAddressModal = false"
      @saved="refreshAddresses"
    />
    <AddressModal
      v-if="editAddressData"
      mode="edit"
      :address="editAddressData"
      @close="editAddressData = null"
      @saved="refreshAddresses"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { getUserProfile, getAllAddresses, getUsersOrders, getFavorites, getReviews, cancelOrder as apiCancelOrder, deleteAddress as apiDeleteAddress } from '@/services/apiService.js'
import ProfileAddresses from '@/components/Profile/ProfileAddresses.vue'
import ProfileOrders from '@/components/Profile/ProfileOrders.vue'
import ProfileFavorites from '@/components/Profile/ProfileFavorites.vue'
import ProfileReviews from '@/components/Profile/ProfileReviews.vue'
import ProfileEditModal from '@/components/Profile/ProfileEditModal.vue'
import AddressModal from '@/components/Profile/AddressModal.vue'

const user = ref(null)
const addresses = ref([])
const orders = ref([])
const favorites = ref([])
const reviews = ref([])

const showEditModal = ref(false)
const showAddressModal = ref(false)
const editAddressData = ref(null)

const avatarUrl = ref('/default-avatar.png')
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

function resolveAvatar(user) {
  if (user?.image_path) {
    if (user.image_path.startsWith('/')) {
      return API_BASE_URL.replace(/\/$/, '') + user.image_path
    }
    return user.image_path
  }
  return '/default-avatar.png'
}
function onAvatarError(e) {
  e.target.src = '/default-avatar.png'
  e.target.style.objectFit = 'cover'
  e.target.style.background = '#232e47'
}

const fetchProfile = async () => {
  user.value = await getUserProfile()
}
const fetchProfileAndAvatar = async () => {
  await fetchProfile()
  avatarUrl.value = resolveAvatar(user.value)
}
const fetchAddresses = async () => {
  addresses.value = await getAllAddresses()
}
const fetchOrders = async () => {
  orders.value = await getUsersOrders()
}
const fetchFavorites = async () => {
  favorites.value = await getFavorites()
}
const fetchReviews = async () => {
  reviews.value = await getReviews()
}

function refreshAddresses() {
  showAddressModal.value = false
  editAddressData.value = null
  fetchAddresses()
}
function editAddress(addr) {
  editAddressData.value = addr
}
function deleteAddress(addr) {
  if (confirm('Tem certeza que deseja excluir este endereço?')) {
    apiDeleteAddress(addr.id).then(fetchAddresses)
  }
}

async function cancelOrder(orderId) {
  if (confirm('Tem certeza que deseja cancelar este pedido?')) {
    await apiCancelOrder(orderId)
    await fetchOrders()
  }
}

onMounted(async () => {
  await fetchProfileAndAvatar()
  await fetchAddresses()
  await fetchOrders()
  await fetchFavorites()
  await fetchReviews()
})

watch(user, (val) => {
  avatarUrl.value = resolveAvatar(val)
})
</script>

<style scoped>
.profile-bg {
  background: linear-gradient(120deg, #10141a 0%, #181e2a 80%, #232e47 100%);
  min-height: 100vh;
}
.btn-back-home {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(90deg,#50b8fe 60%, #399bff 100%);
  color: #181e2a;
  font-weight: 700;
  border-radius: 14px;
  padding: 8px 22px;
  font-size: 1.08rem;
  text-decoration: none;
  box-shadow: 0 2px 12px #399bff30;
  border: none;
  transition: background 0.18s, color 0.18s, box-shadow 0.18s;
}
.btn-back-home:hover {
  background: linear-gradient(90deg,#399bff 60%, #50b8fe 100%);
  color: #fff;
  box-shadow: 0 4px 18px #399bff60;
}
.profile-main-section {
  gap: 2.2rem !important;
}
.profile-header-card {
  background: rgba(24,30,42,0.92);
  border-radius: 18px;
  box-shadow: 0 2px 12px #232e4720;
  padding: 24px 32px 18px 32px;
  margin-bottom: 12px;
  border: 1.5px solid #232e47;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.profile-username {
  color: #50b8fe;
  font-weight: 800;
  font-size: 1.45rem;
  margin-bottom: 2px;
  letter-spacing: 0.5px;
  text-align: left;
}
.profile-user-email {
  color: #b8d8ff;
  font-size: 1.05rem;
  margin-bottom: 0;
  text-align: left;
  opacity: 0.88;
}

/* Sidebar Glass */
.profile-sidebar-glass.modern-sidebar {
  background: linear-gradient(120deg, #181e2a 60%, #232e47 100%);
  border-radius: 26px;
  box-shadow: 0 8px 32px 0 #232e4780, 0 1.5px 0 #50b8fe;
  border: 1.5px solid #232e47;
  padding: 38px 24px 32px 24px;
  margin-bottom: 2rem;
  width: 100%;
  max-width: 350px;
  min-width: 270px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}
.profile-avatar-box {
  position: relative;
  width: 120px;
  height: 120px;
  margin-bottom: 10px;
  border-radius: 50%;
  overflow: hidden;
  background: #232e47;
  display: flex;
  align-items: center;
  justify-content: center;
}
.profile-avatar-img {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 50%;
  border: 3px solid #50b8fe;
  box-shadow: 0 2px 16px #399bff40;
  background: #232e47;
  display: block;
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
}
.avatar-edit-btn:hover {
  background: linear-gradient(90deg,#399bff 60%, #50b8fe 100%);
  color: #fff;
}
.sidebar-name {
  color: #50b8fe;
  font-weight: 800;
  font-size: 1.35rem;
  margin-bottom: 2px;
  letter-spacing: 0.5px;
  text-align: center;
}
.sidebar-email {
  color: #b8d8ff;
  font-size: 0.98rem;
  margin-bottom: 10px;
  text-align: center;
  opacity: 0.85;
}
.sidebar-badges {
  display: flex;
  flex-direction: column;
  gap: 7px;
  align-items: center;
  margin-bottom: 10px;
}
.modern-badge {
  font-size: 0.93rem;
  border-radius: 9px;
  letter-spacing: 0.5px;
  box-shadow: 0 1px 6px #232e4720;
  border: 1.5px solid #232e47;
  background: rgba(80,184,254,0.10);
  padding: 6px 14px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.bg-purple { background: #a470ff !important; color: #fff !important; }
.bg-green { background: #4be3b0 !important; color: #181e2a !important; }
.sidebar-btn {
  background: linear-gradient(90deg,#50b8fe 60%, #399bff 100%);
  color: #181e2a;
  border: none;
  border-radius: 16px;
  font-weight: 700;
  letter-spacing: 1px;
  box-shadow: 0 2px 12px #399bff30;
  transition: background 0.18s, box-shadow 0.18s, color 0.18s;
  padding: 10px 32px;
  font-size: 1.08rem;
  margin-top: 10px;
  cursor: pointer;
  outline: none;
}
.sidebar-btn:hover {
  background: linear-gradient(90deg,#399bff 60%, #50b8fe 100%);
  color: #fff;
  box-shadow: 0 4px 18px #399bff60;
}

@media (max-width: 991px) {
  .profile-header-card {
    padding: 18px 14px 12px 14px;
  }
  .profile-sidebar-glass {
    max-width: 100vw;
    min-width: 0;
    padding: 24px 10px 18px 10px;
  }
}
@media (max-width: 600px) {
  .profile-avatar-box {
    width: 90px;
    height: 90px;
    border-radius: 50%;
    overflow: hidden;
  }
  .profile-avatar-img {
    width: 90px;
    height: 90px;
    border-radius: 50%;
    object-fit: cover;
    background: #232e47;
  }
}
</style>