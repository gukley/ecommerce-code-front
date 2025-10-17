<template>
  <div class="profile-bg">
    <Navbar />
    <div class="container py-5">
      <div class="profile-card mx-auto p-4">
        <div class="d-flex flex-column flex-md-row align-items-center gap-4 mb-4">
          <div class="profile-avatar">
            <i class="bi bi-person-circle"></i>
          </div>
          <div>
            <h2 class="profile-name mb-1">{{ user?.name }}</h2>
            <div class="profile-email text-blue">{{ user?.email }}</div>
          </div>
        </div>
        <ul class="nav nav-tabs profile-tabs mb-4" role="tablist">
          <li class="nav-item" role="presentation">
            <button class="nav-link" :class="{active: activeTab==='dados'}" @click="activeTab='dados'" type="button" role="tab">
              <i class="bi bi-person"></i> Dados
            </button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link" :class="{active: activeTab==='pedidos'}" @click="activeTab='pedidos'" type="button" role="tab">
              <i class="bi bi-bag"></i> Pedidos
            </button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link" :class="{active: activeTab==='cupons'}" @click="activeTab='cupons'" type="button" role="tab">
              <i class="bi bi-ticket-detailed"></i> Cupons
            </button>
          </li>
        </ul>
        <div class="tab-content">
          <div v-if="activeTab==='dados'" class="tab-pane active">
            <div class="mb-3">
              <label class="form-label text-blue">Nome</label>
              <div class="profile-info-box">{{ user?.name }}</div>
            </div>
            <div class="mb-3">
              <label class="form-label text-blue">E-mail</label>
              <div class="profile-info-box">{{ user?.email }}</div>
            </div>
            <!-- ...outros dados se desejar... -->
          </div>
          <div v-if="activeTab==='pedidos'" class="tab-pane active">
            <!-- ...exibir pedidos do usuário... -->
            <div v-if="orders.length === 0" class="text-muted">Nenhum pedido encontrado.</div>
            <div v-else>
              <div v-for="order in orders" :key="order.id" class="order-card mb-3">
                <div class="d-flex justify-content-between">
                  <div>
                    <span class="order-id">Pedido #{{ order.id }}</span>
                    <span class="order-date ms-2">{{ formatDate(order.created_at) }}</span>
                  </div>
                  <span class="order-total">Total: <b>R$ {{ order.total.toFixed(2) }}</b></span>
                </div>
                <div class="order-status mt-1">Status: <span :class="statusClass(order.status)">{{ order.status }}</span></div>
              </div>
            </div>
          </div>
          <div v-if="activeTab==='cupons'" class="tab-pane active">
            <div v-if="loadingCupons" class="text-blue">Carregando cupons...</div>
            <div v-else-if="cuponsDisponiveis.length === 0" class="text-muted">Nenhum cupom disponível no momento.</div>
            <div v-else class="row g-3">
              <div class="col-12 col-md-6 col-lg-4" v-for="cupom in cuponsDisponiveis" :key="cupom.id">
                <div class="cupom-card">
                  <div class="cupom-code">{{ cupom.code }}</div>
                  <div class="cupom-desc mb-1">Desconto: <b>{{ cupom.discount_percentage }}%</b></div>
                  <div class="cupom-validade text-muted">Válido de {{ formatDate(cupom.start_date) }} até {{ formatDate(cupom.end_date) }}</div>
                  <div class="cupom-desc mt-1" v-if="cupom.description">{{ cupom.description }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Navbar from '@/components/home/NavBar.vue'
import Footer from '@/components/home/Footer.vue'
import { useAuthStore } from '@/stores/authStore'
import { getUserOrders, getAllCoupons } from '@/services/apiService'

const authStore = useAuthStore()
const user = authStore.user
const activeTab = ref('dados')
const orders = ref([])
const cuponsDisponiveis = ref([])
const loadingCupons = ref(true)

onMounted(async () => {
  // Buscar pedidos do usuário
  orders.value = await getUserOrders(user.id)
  // Buscar cupons disponíveis (ativos e não expirados)
  try {
    const allCupons = await getAllCoupons()
    const now = new Date()
    cuponsDisponiveis.value = allCupons.filter(c =>
      new Date(c.start_date) <= now && new Date(c.end_date) >= now
      // Se quiser filtrar por usuário, adicione aqui: && c.user_id === user.id
    )
  } finally {
    loadingCupons.value = false
  }
})

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('pt-BR')
}

function statusClass(status) {
  if (status === 'aprovado' || status === 'pago') return 'text-success'
  if (status === 'cancelado') return 'text-danger'
  return 'text-blue'
}
</script>

<style scoped>
.profile-bg {
  background: linear-gradient(135deg, #18182a 60%, #23233a 100%);
  min-height: 100vh;
  color: #fff;
}
.profile-card {
  background: #18182a;
  border-radius: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 255, 225, 0.10);
  max-width: 600px;
  margin-top: 2rem;
  margin-bottom: 2rem;
  border: 1.5px solid #23233a;
}
.profile-avatar {
  font-size: 4rem;
  color: #00aaff;
  background: #23233a;
  border-radius: 50%;
  width: 90px;
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 12px #00aaff33;
}
.profile-name {
  font-family: 'Orbitron', sans-serif;
  color: #00aaff;
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: 1px;
}
.profile-email {
  color: #00ffe1;
  font-size: 1.1rem;
  font-weight: 500;
}
.text-blue {
  color: #00aaff !important;
}
.profile-tabs .nav-link {
  color: #00aaff;
  font-weight: 600;
  border: none;
  border-bottom: 2.5px solid transparent;
  background: transparent;
  transition: border-color 0.2s, color 0.2s;
}
.profile-tabs .nav-link.active {
  color: #00ffe1;
  border-bottom: 2.5px solid #00ffe1;
  background: transparent;
}
.profile-info-box {
  background: #23233a;
  border-radius: 0.7rem;
  padding: 0.7rem 1.2rem;
  font-size: 1.1rem;
  color: #fff;
  border: 1px solid #23233a;
  margin-bottom: 0.2rem;
}
.order-card {
  background: #202038;
  border-radius: 0.8rem;
  padding: 1rem 1.2rem;
  border: 1.5px solid #23233a;
  margin-bottom: 0.7rem;
  box-shadow: 0 2px 8px #00aaff22;
}
.order-id {
  color: #00ffe1;
  font-weight: 600;
}
.order-date {
  color: #00aaff;
  font-size: 0.98rem;
}
.order-total {
  color: #fff;
  font-weight: 600;
}
.order-status {
  font-size: 1.05rem;
}
.cupom-card {
  background: linear-gradient(120deg, #00aaff22 0%, #8f5fe822 100%);
  border: 1.5px solid #00aaff;
  border-radius: 1.1rem;
  padding: 1.1rem 1.2rem;
  color: #fff;
  box-shadow: 0 2px 10px #00aaff22;
  margin-bottom: 0.5rem;
  transition: box-shadow 0.2s;
}
.cupom-card:hover {
  box-shadow: 0 4px 18px #00ffe1aa;
  border-color: #00ffe1;
}
.cupom-code {
  font-family: 'Orbitron', monospace;
  color: #00ffe1;
  font-size: 1.3rem;
  font-weight: 700;
  letter-spacing: 2px;
  margin-bottom: 0.2rem;
}
.cupom-desc {
  color: #00aaff;
  font-size: 1.08rem;
}
.cupom-validade {
  font-size: 0.98rem;
}
@media (max-width: 768px) {
  .profile-card {
    padding: 1.2rem 0.5rem;
    border-radius: 1rem;
  }
  .profile-avatar {
    font-size: 2.5rem;
    width: 60px;
    height: 60px;
  }
}
</style>