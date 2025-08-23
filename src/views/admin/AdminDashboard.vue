<template>
  <div class="p-4 dashboard-container">
    <div v-if="isLoading" class="loading-overlay">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Carregando...</span>
      </div>
    </div>
    <div v-else>
      <h2 class="fw-bold text-primary-ggtech mb-4">Dashboard Administrativo</h2>
      <p class="text-light-ggtech mb-5">Bem-vindo, administrador. Aqui está um resumo da sua loja.</p>

      <div class="row g-4 mb-5">
        <div class="col-lg-3 col-md-6">
          <div class="card p-3 shadow-sm h-100 metric-card sales-card">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="icon-container sales-icon">
                  <i class="bi bi-currency-dollar"></i>
                </div>
                <div>
                  <h5 class="card-title">Total de Vendas</h5>
                  <p class="card-text fs-4 fw-bold">R$ {{ totalVendas.toFixed(2) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-md-6">
          <div class="card p-3 shadow-sm h-100 metric-card orders-card">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="icon-container orders-icon">
                  <i class="bi bi-bag-check"></i>
                </div>
                <div>
                  <h5 class="card-title">Pedidos Totais</h5>
                  <p class="card-text fs-4 fw-bold">{{ totalPedidos }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-md-6">
          <div class="card p-3 shadow-sm h-100 metric-card products-card">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="icon-container products-icon">
                  <i class="bi bi-box-seam"></i>
                </div>
                <div>
                  <h5 class="card-title">Produtos</h5>
                  <p class="card-text fs-4 fw-bold">{{ totalProdutos }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-md-6">
          <div class="card p-3 shadow-sm h-100 metric-card customers-card">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="icon-container customers-icon">
                  <i class="bi bi-people"></i>
                </div>
                <div>
                  <h5 class="card-title">Clientes</h5>
                  <p class="card-text fs-4 fw-bold">{{ totalClientes }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Novo card de cupons -->
        <div class="col-lg-3 col-md-6">
          <div class="card p-3 shadow-sm h-100 metric-card coupons-card">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="icon-container coupons-icon">
                  <i class="bi bi-ticket-perforated"></i>
                </div>
                <div>
                  <h5 class="card-title">Cupons Ativos</h5>
                  <p class="card-text fs-4 fw-bold">{{ totalCupons }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row g-4">
        <div class="col-lg-6">
          <div class="card p-4 shadow-sm h-100 dashboard-table-card dashboard-table-dark">
            <h4 class="fw-bold text-primary-ggtech mb-3">Últimos Pedidos</h4>
            <div v-if="ultimosPedidos.length === 0" class="alert alert-info-ggtech mt-3">
              Nenhum pedido recente encontrado.
            </div>
            <div v-else class="table-responsive dashboard-table-responsive">
              <table class="table table-hover table-borderless align-middle text-center dashboard-table">
                <thead>
                  <tr>
                    <th>ID do Pedido</th>
                    <th>Status</th>
                    <th>Total</th>
                    <th>Data</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="order in ultimosPedidos" :key="order.id">
                    <td>#{{ order.id }}</td>
                    <td>
                      <span :class="`badge rounded-pill ${getOrderStatusClass(order.status)}`">
                        {{ formatStatus(order.status) }}
                      </span>
                    </td>
                    <td>R$ {{ Number(order.total).toFixed(2) }}</td>
                    <td>{{ formatDate(order.created_at) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <router-link to="/admin/orders" class="btn btn-outline-primary mt-3">
              Ver Todos os Pedidos
            </router-link>
          </div>
        </div>

        <div class="col-lg-6">
          <div class="card p-4 shadow-sm h-100 dashboard-table-card dashboard-table-dark">
            <h4 class="fw-bold text-primary-ggtech mb-3">Produtos Recentes</h4>
            <div v-if="ultimosProdutos.length === 0" class="alert alert-info-ggtech mt-3">
              Nenhum produto recente encontrado.
            </div>
            <div v-else class="table-responsive dashboard-table-responsive">
              <table class="table table-hover table-borderless align-middle text-center dashboard-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Produto</th>
                    <th>Preço</th>
                    <th>Estoque</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="product in ultimosProdutos" :key="product.id">
                    <td>#{{ product.id }}</td>
                    <td class="text-start">{{ product.name }}</td>
                    <td>R$ {{ Number(product.price).toFixed(2) }}</td>
                    <td>
                      <span :class="`badge ${product.stock > 0 ? 'bg-success' : 'bg-danger'}`">
                        {{ product.stock }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <router-link to="/admin/products" class="btn btn-outline-success mt-3">
              Ver Todos os Produtos
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { useOrderStore } from '@/stores/orderStore';
import { useProductStore } from '@/stores/productStore';
import { useAuthStore } from '@/stores/authStore';
import { useCouponStore } from '@/stores/couponStore';
import { storeToRefs } from 'pinia';

// Stores
const orderStore = useOrderStore();
const productStore = useProductStore();
const authStore = useAuthStore();
const couponStore = useCouponStore();

// Reatividade
const { orders, loading: loadingPedidos } = storeToRefs(orderStore);
const { totalProdutos, ultimosProdutos, productsByUser, loading: loadingProdutos } = storeToRefs(productStore);
const { coupons, loading: loadingCupons } = storeToRefs(couponStore);

// Estado local
const totalClientes = ref(0);
const dashboardInitialized = ref(false);

// Carrega os dados de pedidos, produtos e cupons ao montar o componente
onMounted(async () => {
  await nextTick();
  if (authStore.user && authStore.user.id) {
    await fetchDashboardData();
    dashboardInitialized.value = true;
  }
});

// Ações de carregamento de dados
const fetchDashboardData = async () => {
  try {
    if (productStore.shouldRefetch()) {
      await productStore.fetchProducts();
    }
    if (orderStore.shouldRefetch && orderStore.shouldRefetch()) {
      await orderStore.fetchOrdersByAdmin(authStore.user.id);
    }
    if (couponStore.shouldRefetch && couponStore.shouldRefetch()) {
      await couponStore.fetchAllCoupons();
    }
  } catch (error) {
    console.error("Erro ao carregar dados do dashboard:", error);
  }
};

// Computed Properties
const isLoading = computed(() => {
  return !dashboardInitialized.value || loadingPedidos.value || loadingProdutos.value || loadingCupons.value;
});

const totalVendas = computed(() => {
  if (!orders.value || orders.value.length === 0) return 0;
  return orders.value.reduce((sum, order) => sum + Number(order.total || 0), 0);
});

const totalPedidos = computed(() => {
  return orders.value?.length || 0;
});

const ultimosPedidos = computed(() => {
  if (!orders.value || orders.value.length === 0) return [];
  return orders.value.slice()
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);
});

const totalCupons = computed(() => {
  if (!coupons.value || coupons.value.length === 0) return 0;
  // Considere apenas cupons ativos (data de expiração no futuro)
  const now = new Date();
  return coupons.value.filter(c => !c.end_date || new Date(c.end_date) >= now).length;
});

// Helpers para formatação
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'N/A';
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const getOrderStatusClass = (status) => {
  switch (status?.toLowerCase()) {
    case 'pending': return 'bg-warning text-dark';
    case 'processing': return 'bg-info text-white';
    case 'completed': return 'bg-success text-white';
    case 'canceled': return 'bg-danger text-white';
    default: return 'bg-secondary text-white';
  }
};

const formatStatus = (status) => {
  const statusMap = {
    'pending': 'Pendente',
    'processing': 'Processando',
    'completed': 'Concluído',
    'canceled': 'Cancelado',
  };
  return statusMap[status?.toLowerCase()] || 'Desconhecido';
};

// Observa o estado do usuário para carregar os dados
watch(() => authStore.user, async (newUser, oldUser) => {
  if (newUser && newUser.id && oldUser && dashboardInitialized.value) {
    await fetchDashboardData();
  }
}, { immediate: false });

watch([orders, productsByUser, coupons], () => {
  if (dashboardInitialized.value) {
    nextTick(() => {
      // Força re-render se necessário
    });
  }
});

const refreshDashboard = async () => {
  dashboardInitialized.value = false;
  await fetchDashboardData();
  dashboardInitialized.value = true;
};
</script>

<style scoped>
.dashboard-container {
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

.text-light-ggtech { 
  color: #b0b7c3; 
  font-weight: 400;
}

.alert-info-ggtech {
  background-color: #1e3a5f;
  color: #64b5f6;
  border-color: #1976d2;
  border-radius: 0.5rem;
}

.metric-card {
  background: linear-gradient(135deg, #1a2332 0%, #2d3748 100%);
  border: 1px solid #374151;
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  color: #e8eaed;
  transition: all 0.3s ease;
  cursor: default;
  overflow: hidden;
}

.metric-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
  border-color: #4a5568;
}

.metric-card .card-title {
  color: #a0aec0;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.5rem;
}

.metric-card .card-text {
  color: #f7fafc;
  margin-bottom: 0;
}

.icon-container {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  flex-shrink: 0;
  font-size: 1.5rem;
  color: white;
}

.sales-card .icon-container {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.orders-card .icon-container {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.products-card .icon-container {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.customers-card .icon-container {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.coupons-card .icon-container {
  background: linear-gradient(135deg, #ffb347 0%, #ffcc33 100%);
  color: #23233a;
}

.card {
  background: linear-gradient(135deg, #1a2332 0%, #2d3748 100%);
  border: 1px solid #374151;
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  color: #e8eaed;
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
  border-color: #4a5568;
}

.dashboard-table-card {
  background: linear-gradient(135deg, #181e2a 0%, #23233a 100%);
  border: 1.5px solid #232e47;
  border-radius: 1.2rem;
  box-shadow: 0 2px 12px #232e4720;
}

.dashboard-table-dark {
  background: linear-gradient(135deg, #181e2a 0%, #23233a 100%) !important;
  border: 1.5px solid #232e47 !important;
  color: #e8eaed !important;
}

.dashboard-table-dark .dashboard-table,
.dashboard-table-dark .dashboard-table thead th,
.dashboard-table-dark .dashboard-table tbody td {
  background: transparent !important;
  color: #e8eaed !important;
}

.dashboard-table-dark .dashboard-table tbody tr:hover {
  background-color: #232e47 !important;
}

.dashboard-table-responsive {
  background: transparent;
  border-radius: 0.5rem;
  overflow: hidden;
  border: none;
}

.dashboard-table {
  color: #e8eaed;
  margin-bottom: 0;
  background: transparent;
}

.dashboard-table thead th {
  background-color: #23233a;
  border-bottom: 2px solid #374151;
  color: #a0aec0;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 0.5px;
}

.dashboard-table tbody tr {
  transition: background-color 0.2s ease;
}

.dashboard-table tbody tr:hover {
  background-color: #232e47;
}

.table-responsive {
  border-radius: 0.5rem;
  overflow: hidden;
  border: 1px solid #374151;
}

.btn {
  font-weight: 600;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  border-radius: 0.5rem;
  padding: 0.5rem 1.5rem;
  transition: all 0.3s ease;
}

.btn-outline-primary {
  color: #64b5f6;
  border-color: #64b5f6;
}

.btn-outline-primary:hover {
  background-color: #64b5f6;
  border-color: #64b5f6;
  color: #0f1419;
}

.btn-outline-success {
  color: #4ade80;
  border-color: #4ade80;
}

.btn-outline-success:hover {
  background-color: #4ade80;
  border-color: #4ade80;
  color: #0f1419;
}

.loading-overlay {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
}

.badge {
  font-size: 0.75rem;
  padding: 0.5rem 0.75rem;
  font-weight: 500;
}

/* Responsividade */
@media (max-width: 768px) {
  .dashboard-container {
    padding: 1rem 0.5rem;
  }
  
  .text-primary-ggtech {
    font-size: 1.8rem;
  }
  
  .icon-container {
    width: 50px;
    height: 50px;
    font-size: 1.2rem;
  }
  
  .metric-card .card-title {
    font-size: 0.8rem;
  }
  
  .metric-card .card-text {
    font-size: 1.2rem;
  }
}
</style>