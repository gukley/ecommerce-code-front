<template>
  <div class="p-4 dashboard-container">
    <div v-if="isLoading" class="d-flex justify-content-center align-items-center" style="min-height: 80vh;">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Carregando...</span>
      </div>
    </div>
    <div v-else>
      <h2 class="fw-bold text-primary-ggtech mb-4">Dashboard Administrativo</h2>
      <p class="text-light">Bem-vindo, administrador. Aqui está um resumo da sua loja.</p>

      <div class="row g-4 mb-5">
        <div class="col-lg-4 col-md-6">
          <div class="card p-3 shadow-sm h-100">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <i class="bi bi-currency-dollar me-3 icon-metric text-success"></i>
                <div>
                  <h5 class="card-title text-secondary">Total de Vendas</h5>
                  <p class="card-text fs-4 fw-bold text-light">R$ {{ totalVendas.toFixed(2) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-4 col-md-6">
          <div class="card p-3 shadow-sm h-100">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <i class="bi bi-bag-check me-3 icon-metric text-info"></i>
                <div>
                  <h5 class="card-title text-secondary">Pedidos Totais</h5>
                  <p class="card-text fs-4 fw-bold text-light">{{ totalPedidos }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-4 col-md-6">
          <div class="card p-3 shadow-sm h-100">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <i class="bi bi-people me-3 icon-metric text-primary"></i>
                <div>
                  <h5 class="card-title text-secondary">Clientes</h5>
                  <p class="card-text fs-4 fw-bold text-light">{{ totalClientes }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="card p-4 shadow-sm">
        <h4 class="fw-bold text-primary-ggtech mb-3">Últimos Pedidos</h4>
        <div v-if="ultimosPedidos.length === 0" class="alert alert-info mt-3">
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
      </div>
      <div class="d-flex justify-content-center gap-3 mt-4">
      <router-link to="/admin/orders" class="btn btn-outline-info">
        Ver Todos os Pedidos
      </router-link>
      <router-link to="/admin/products" class="btn btn-outline-success">
        Cadastrar Produto
      </router-link>
    </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useOrderStore } from '@/stores/orderStore';
import { useAuthStore } from '@/stores/authStore';
import { storeToRefs } from 'pinia';

const orderStore = useOrderStore();
const authStore = useAuthStore();

const { orders, loading: loadingPedidos } = storeToRefs(orderStore)

const isLoading = computed(() => loadingPedidos.value);

const totalClientes = ref(0);

const totalVendas = computed(() => {
  return orders.value.reduce((sum, order) => {
    return sum + Number(order.total);
  }, 0);
});

const totalPedidos = computed(() => {
  return orders.value.length;
});

const ultimosPedidos = computed(() => {
  return orders.value.slice()
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);
});

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'N/A'; 

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
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
  if (!status) return 'Desconhecido';
  const statusMap = {
    'pending': 'Pendente',
    'processing': 'Processando',
    'completed': 'Concluído',
    'canceled': 'Cancelado',
  };
  return statusMap[status.toLowerCase()] || status;
};

watch(
  () => authStore.user,
  (newUser) => {
    if (newUser && newUser.id) {
      orderStore.fetchOrdersByAdmin(newUser.id);
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.dashboard-container {
  background-color: #23272f;
  min-height: 100vh;
  color: white;
  padding: 2rem 1rem;
  max-width: 1280px;
  margin: 0 auto;
}

.text-primary-ggtech {
  color: #00ffe1 !important;
}

.card {
  background-color: #2a2a3e;
  border: none;
  border-radius: 1rem;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  color: white;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: default;
}

.card:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.35);
}

.icon-metric {
  font-size: 2.8rem;
  background-color: rgba(0, 255, 225, 0.15);
  padding: 0.65rem;
  border-radius: 50%;
  color: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.card-title {
  color: #a3a3a3;
  font-weight: 600;
  letter-spacing: 0.03em;
}

.card-text {
  color: #e0e0e0;
  margin-top: 0.3rem;
}

.table-dark {
  --bs-table-bg: #2a2a3e;
  --bs-table-color: white;
  --bs-table-striped-bg: rgba(255, 255, 255, 0.05);
  --bs-table-striped-color: white;
}

.table-hover tbody tr:hover {
  background-color: rgba(0, 255, 225, 0.1);
}

.table-striped > tbody > tr:nth-of-type(odd) {
  background-color: var(--bs-table-striped-bg);
}

.table-responsive {
  border-radius: 1rem;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 4px 15px rgba(0, 255, 225, 0.07);
  margin-top: 1rem;
}
.d-flex.justify-content-center.gap-3.mt-4 {
  margin-top: 2rem !important;
}
.btn-outline-info,
.btn-outline-success {
  min-width: 180px;
  font-weight: 600;
  letter-spacing: 0.03em;
  padding: 0.65rem 1.3rem;
  transition: background-color 0.3s ease, color 0.3s ease;
}
.btn-outline-info:hover {
  background-color: #00b8a9;
  color: #0f0f23;
  border-color: #00b8a9;
}
.btn-outline-success:hover {
  background-color: #28a745;
  color: #0f0f23;
  border-color: #28a745;
}
/* Ajuste responsivo extra para mobile */
@media (max-width: 768px) {
  .row.g-4.mb-5 > div {
    margin-bottom: 1.5rem;
  }

  .d-flex.justify-content-center.gap-3.mt-4 {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
