<template>
  <div class="profile-page theme-page">
    <Navbar />
    <div class="profile-header">
      <div class="container">
        <div class="d-flex justify-content-center align-items-center">
          <h1 class="profile-title theme-text-primary">
            <i class="bi bi-person-circle me-2"></i>
            Meu Perfil
          </h1>
        </div>
      </div>
    </div>
    <Profile
      :user="user"
      :orders="orders"
      :favorites="favorites"
      :addresses="addresses"
      @add-address="handleAddAddress"
      @edit-address="handleEditAddress"
      @delete-address="handleDeleteAddress"
      @cancel-order="handleCancelOrder"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import Profile from '@/components/Profile/Profile.vue'
import Navbar from '@/components/home/NavBar.vue'
import {
  getUserProfile,
  getUsersOrders,
  getAllAddresses,
  getFavorites,
  createAddress,
  updateAddress,
  deleteAddress,
  cancelOrder
} from '@/services/apiService.js'

const user = ref(null)
const orders = ref([])
const favorites = ref([])
const addresses = ref([])

async function fetchAddresses() {
  addresses.value = await getAllAddresses()
}

async function fetchUserOrders() {
  orders.value = await getUsersOrders()
}

async function handleAddAddress(addressData) {
  try {
    await createAddress(addressData)
    await fetchAddresses()
  } catch (e) {
    // Trate o erro, ex: toast.error('Erro ao adicionar endereço')
    console.error('Erro ao adicionar endereço:', e)
  }
}

async function handleEditAddress(addressData) {
  try {
    await updateAddress(addressData.id, addressData)
    await fetchAddresses()
  } catch (e) {
    // Trate o erro, ex: toast.error('Erro ao editar endereço')
    console.error('Erro ao editar endereço:', e)
  }
}

async function handleDeleteAddress(id) {
  try {
    if (confirm('Tem certeza que deseja excluir este endereço?')) {
      await deleteAddress(id)
      await fetchAddresses()
      // Mostrar mensagem de sucesso
      console.log('Endereço excluído com sucesso!')
    }
  } catch (e) {
    console.error('Erro ao excluir endereço:', e)
    alert('Erro ao excluir endereço. Tente novamente.')
  }
}

async function handleCancelOrder(orderId) {
  try {
    if (confirm('Tem certeza que deseja cancelar este pedido?')) {
      await cancelOrder(orderId)
      await fetchUserOrders()
      console.log('Pedido cancelado com sucesso!')
    }
  } catch (e) {
    console.error('Erro ao cancelar pedido:', e)
    alert('Erro ao cancelar pedido. Tente novamente.')
  }
}

onMounted(async () => {
  try {
    user.value = await getUserProfile()
    await fetchUserOrders()
    await fetchAddresses()
    favorites.value = await getFavorites()
  } catch (e) {
    user.value = { name: 'Usuário', email: '', id: '-', role: '-' }
    orders.value = []
    addresses.value = []
    favorites.value = []
  }
  window.addEventListener('orders-updated', fetchUserOrders)
})

onBeforeUnmount(() => {
  window.removeEventListener('orders-updated', fetchUserOrders)
})
</script>

<style scoped>
.profile-bg {
  background: linear-gradient(120deg, #10141a 0%, #181e2a 80%, #232e47 100%);
  min-height: 100vh;
  font-family: 'Inter', 'Rajdhani', Arial, sans-serif;
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
.profile-header-card.profile-header-custom {
  background: linear-gradient(90deg, #232e47 60%, #399bff 100%);
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
.profile-sidebar-custom {
  background: linear-gradient(120deg, #232e47 60%, #399bff 100%);
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
  box-shadow: 0 2px 16px #399bff40;
  border: 3px solid #50b8fe;
}
.profile-avatar-img {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 50%;
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
.sidebar-actions {
  margin-top: 1.2rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}
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
  margin-top: 0;
  cursor: pointer;
  outline: none;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 8px;
}
.sidebar-btn:hover {
  background: linear-gradient(90deg,#399bff 60%, #50b8fe 100%);
  color: #fff;
  box-shadow: 0 4px 18px #399bff60;
}
.btn-orders {
  background: linear-gradient(90deg,#43e97b 60%, #38f9d7 100%);
  color: #181e2a;
}
.btn-orders:hover {
  background: linear-gradient(90deg,#38f9d7 60%, #43e97b 100%);
  color: #fff;
}
.btn-favorites {
  background: linear-gradient(90deg,#ff6a6a 60%, #ffb36a 100%);
  color: #181e2a;
}
.btn-favorites:hover {
  background: linear-gradient(90deg,#ffb36a 60%, #ff6a6a 100%);
  color: #fff;
}
.btn-reviews {
  background: linear-gradient(90deg,#a470ff 60%, #ff6ad5 100%);
  color: #181e2a;
}
.btn-reviews:hover {
  background: linear-gradient(90deg,#ff6ad5 60%, #a470ff 100%);
  color: #fff;
}
.profile-cards-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}
@media (max-width: 991px) {
  .profile-header-card {
    padding: 18px 14px 12px 14px;
  }
  .profile-sidebar-custom {
    max-width: 100vw;
    min-width: 0;
    padding: 24px 10px 18px 10px;
  }
  .profile-cards-grid {
    grid-template-columns: 1fr;
    gap: 1.2rem;
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

/* ===== THEME STYLES ===== */
.profile-page {
  min-height: 100vh;
  background: var(--bg-main);
  transition: background-color var(--transition-normal);
}

.profile-header {
  background: var(--bg-card);
  border-bottom: 1px solid var(--border-color);
  padding: 2rem 0;
  margin-bottom: 2rem;
  box-shadow: var(--shadow-sm);
}

.profile-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.profile-title i {
  color: var(--accent-primary);
  -webkit-text-fill-color: var(--accent-primary);
}

/* Responsivo */
@media (max-width: 768px) {
  .profile-header {
    padding: 1.5rem 0;
  }
  
  .profile-title {
    font-size: 2rem;
  }
  
  .d-flex {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}
</style>