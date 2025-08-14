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
          <div class="card p-3 shadow-sm h-100 card-gradient">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <i class="bi bi-currency-dollar me-3 icon-metric text-success"></i>
                <div>
                  <h5 class="card-title card-title-gradient">Total de Vendas</h5>
                  <p class="card-text fs-4 fw-bold text-light">R$ {{ totalVendas.toFixed(2) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-md-6">
          <div class="card p-3 shadow-sm h-100 card-gradient">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <i class="bi bi-bag-check me-3 icon-metric text-info"></i>
                <div>
                  <h5 class="card-title card-title-gradient">Pedidos Totais</h5>
                  <p class="card-text fs-4 fw-bold text-light">{{ totalPedidos }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-md-6">
          <div class="card p-3 shadow-sm h-100 card-gradient">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <i class="bi bi-box-seam me-3 icon-metric text-warning"></i>
                <div>
                  <h5 class="card-title card-title-gradient">Produtos</h5>
                  <p class="card-text fs-4 fw-bold text-light">{{ totalProdutos }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-md-6">
          <div class="card p-3 shadow-sm h-100 card-gradient">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <i class="bi bi-people me-3 icon-metric text-primary"></i>
                <div>
                  <h5 class="card-title card-title-gradient">Clientes</h5>
                  <p class="card-text fs-4 fw-bold text-light">0</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row g-4">
        <div class="col-lg-6">
          <div class="card p-4 shadow-sm h-100">
            <h4 class="fw-bold text-primary-ggtech mb-3">Últimos Pedidos</h4>
            <div v-if="ultimosPedidos.length === 0" class="alert alert-info-ggtech mt-3">
              Nenhum pedido recente encontrado.
            </div>
            <div v-else class="table-responsive">
              <table class="table table-dark table-hover table-borderless align-middle text-center">
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
                      <span :class="`badge rounded-pill bg-${getOrderStatusColor(order.status)}`">
                        {{ formatStatus(order.status) }}
                      </span>
                    </td>
                    <td>R$ {{ Number(order.total).toFixed(2) }}</td>
                    <td>{{ formatDate(order.created_at) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <router-link to="/admin/orders" class="btn btn-outline-info-ggtech mt-3">
              Ver Todos os Pedidos
            </router-link>
          </div>
        </div>

        <div class="col-lg-6">
          <div class="card p-4 shadow-sm h-100">
            <h4 class="fw-bold text-primary-ggtech mb-3">Produtos Recentes</h4>
            <div v-if="ultimosProdutos.length === 0" class="alert alert-info-ggtech mt-3">
              Nenhum produto recente encontrado.
            </div>
            <div v-else class="table-responsive">
              <table class="table table-dark table-hover table-borderless align-middle text-center">
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
                    <td>{{ product.stock }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <router-link to="/admin/products" class="btn btn-outline-success-ggtech mt-3">
              Ver Todos os Produtos
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useOrderStore } from '@/stores/orderStore';
import { useProductStore } from '@/stores/productStore';
import { useAuthStore } from '@/stores/authStore';
import { storeToRefs } from 'pinia';

// Stores
const orderStore = useOrderStore();
const productStore = useProductStore();
const authStore = useAuthStore();

// Reatividade
const { orders, loading: loadingPedidos } = storeToRefs(orderStore);
const { totalProdutos, ultimosProdutos, productsByUser, loading: loadingProdutos } = storeToRefs(productStore);

// Como a rota de clientes não existe, o total de clientes é fixado em 0.
const totalClientes = ref(0);

// Carrega os dados de pedidos e produtos ao montar o componente
onMounted(async () => {
  if (authStore.user && authStore.user.id) {
    await fetchDashboardData();
  }
});

// Ações de carregamento de dados
const fetchDashboardData = async () => {
  try {
    await orderStore.fetchOrdersByAdmin(authStore.user.id);
    await productStore.fetchProducts();
  } catch (error) {
    console.error("Erro ao carregar dados do dashboard:", error);
  }
};

// Computed Properties
const isLoading = computed(() => loadingPedidos.value || loadingProdutos.value);

const totalVendas = computed(() => {
  return orders.value.reduce((sum, order) => sum + Number(order.total), 0);
});

const totalPedidos = computed(() => orders.value.length);

const ultimosPedidos = computed(() => {
  return orders.value.slice()
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);
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

const getOrderStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'pending': return 'warning';
    case 'processing': return 'info';
    case 'completed': return 'success';
    case 'canceled': return 'danger';
    default: return 'secondary';
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
watch(() => authStore.user, async (newUser) => {
  if (newUser && newUser.id) {
    await fetchDashboardData();
  }
}, { immediate: true });

</script>

<style scoped>
.dashboard-container {
  background-color: #1a1a2e; 
  min-height: 100vh;
  color: #f0f0f0;
  padding: 2rem 1rem;
  max-width: 1280px;
  margin: 0 auto;
  font-family: 'Inter', sans-serif; 
}
.text-primary-ggtech {
  background: linear-gradient(90deg, #15fbe3 0%, #8f5fe8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 900;
  font-size: 2.4rem;
  letter-spacing: 0.04em;
}
.card-gradient {
  background: linear-gradient(120deg, #15fbe3 0%, #8f5fe8 100%);
  color: #fff;
  box-shadow: 0 4px 24px rgba(0,255,225,0.15);
}
.card-title-gradient {
  background: linear-gradient(120deg, #00ffe1 0%, #8f5fe8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 800;
}
.text-light-ggtech { color: #e0e0e0; }
.alert-info-ggtech {
  background-color: #2a2a3e;
  color: #00ffe1;
  border-color: #00ffe150;
}
.btn-outline-info-ggtech {
  color: #00ffe1;
  border-color: #00ffe1;
}
.btn-outline-info-ggtech:hover {
  background-color: #00ffe1;
  color: #1a1a2e;
}
.btn-outline-success-ggtech {
  color: #4CAF50;
  border-color: #4CAF50;
}
.btn-outline-success-ggtech:hover {
  background-color: #4CAF50;
  color: #1a1a2e;
}
.loading-overlay {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
}
.card {
  background-color: #2a2a3e;
  border: none;
  border-radius: 1rem;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  color: white;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: default;
}

.card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.35);
}

.icon-metric {
  font-size: 2.5rem;
  background-color: rgba(0, 255, 225, 0.13);
  padding: 0.8rem;
  border-radius: 50%;
  color: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  min-width: 65px;
  height: 65px;
}

.table-dark {
  --bs-table-bg: #2a2a3e;
  --bs-table-color: white;
}
.table-hover tbody tr:hover {
  background-color: rgba(0, 255, 225, 0.15);
}
.table-responsive {
  border-radius: 1rem;
  overflow: hidden;
  border: 1px solid rgba(0, 255, 225, 0.1);
  box-shadow: 0 4px 15px rgba(0, 255, 225, 0.07);
}
.btn {
  font-weight: 600;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}
</style>