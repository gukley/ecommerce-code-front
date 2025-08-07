<template>
  <div class="order-management">
    <h2 class="text-primary-ggtech">Gerenciamento de Pedidos</h2>
    
    <!-- Filtros -->
    <div class="filters-section">
      <div class="row g-3">
        <div class="col-md-3">
          <label class="form-label">Status:</label>
          <select v-model="selectedStatus" class="form-select filter-select">
            <option value="">Todos os Status</option>
            <option value="PENDING">Pendente</option>
            <option value="PROCESSING">Processando</option>
            <option value="SHIPPED">Enviado</option>
            <option value="DELIVERED">Entregue</option>
            <option value="CANCELED">Cancelado</option>
          </select>
        </div>
        <div class="col-md-3">
          <label class="form-label">Período:</label>
          <select v-model="selectedPeriod" class="form-select filter-select">
            <option value="">Todos os Períodos</option>
            <option value="today">Hoje</option>
            <option value="week">Última Semana</option>
            <option value="month">Último Mês</option>
            <option value="custom">Período Personalizado</option>
          </select>
        </div>
        <div class="col-md-3" v-if="selectedPeriod === 'custom'">
          <label class="form-label">Data Inicial:</label>
          <input type="date" v-model="startDate" class="form-control filter-input">
        </div>
        <div class="col-md-3" v-if="selectedPeriod === 'custom'">
          <label class="form-label">Data Final:</label>
          <input type="date" v-model="endDate" class="form-control filter-input">
        </div>
        <div class="col-md-3">
          <label class="form-label">Buscar por ID:</label>
          <input 
            type="text" 
            v-model="searchId" 
            placeholder="Digite o ID do pedido"
            class="form-control filter-input"
          >
        </div>
        <div class="col-md-12">
          <button @click="clearFilters" class="btn btn-outline-secondary btn-sm me-2">
            <i class="bi bi-x-circle me-1"></i>Limpar Filtros
          </button>
          <span class="text-muted">
            <i class="bi bi-info-circle me-1"></i>
            {{ overallFilteredOrders.length }} de {{ orders.length }} pedidos |
            <strong class="text-success">Total: R$ {{ totalPedidosFiltrados }}</strong>
          </span>
        </div>
      </div>
    </div>
    
    <!-- Novo componente AdminOrderTable -->
    <AdminOrderTable
      :paginated-orders="paginatedOrders"
      :addresses="addresses"
      :current-page="currentPage"
      :total-pages="totalPages"
      :base-url="baseUrl"
      @request-address-data="getAddressData"
      @clear-filters="clearFilters"
      @go-to-page="goToPage"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { getOrderByAdmin, getAddressById } from '@/services/apiService';
import { useAuthStore } from '@/stores/authStore';
import { useOrderStore } from '@/stores/orderStore';
import { storeToRefs } from 'pinia';
import AdminOrderTable from '@/components/Admin/AdminOrderTable.vue'; 

const addresses = ref({});
const authStore = useAuthStore();
const baseUrl = 'http://35.196.79.227:8000';
const orderStore = useOrderStore();
const { orders } = storeToRefs(orderStore);

const selectedStatus = ref('');
const selectedPeriod = ref('');
const startDate = ref('');
const endDate = ref('');
const searchId = ref('');

// --- Variáveis de Paginação ---
const currentPage = ref(1);
const itemsPerPage = 10; 

// --- Computed para filtrar todos os pedidos (antes da paginação) ---
const overallFilteredOrders = computed(() => {
  let filtered = orders.value;

  // Filtro por status
  if (selectedStatus.value) {
    filtered = filtered.filter(order => order.status === selectedStatus.value);
  }

  // Filtro por ID
  if (searchId.value) {
    filtered = filtered.filter(order => 
      order.id.toString().includes(searchId.value)
    );
  }

  // Filtro por período
  if (selectedPeriod.value) {
    const now = new Date();
    const orderDate = new Date();
    
    switch (selectedPeriod.value) {
      case 'today':
        filtered = filtered.filter(order => {
          orderDate.setTime(new Date(order.order_date).getTime());
          return orderDate.toDateString() === now.toDateString();
        });
        break;
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(order => {
          orderDate.setTime(new Date(order.order_date).getTime());
          return orderDate >= weekAgo;
        });
        break;
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(order => {
          orderDate.setTime(new Date(order.order_date).getTime());
          return orderDate >= monthAgo;
        });
        break;
      case 'custom':
        if (startDate.value && endDate.value) {
          const start = new Date(startDate.value);
          const end = new Date(endDate.value);
          end.setHours(23, 59, 59); 
          
          filtered = filtered.filter(order => {
            orderDate.setTime(new Date(order.order_date).getTime());
            return orderDate >= start && orderDate <= end;
          });
        }
        break;
    }
  }
  return filtered;
});

// --- Computed para os pedidos paginados ---
const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return overallFilteredOrders.value.slice(start, end);
});

// --- Computed para o total de páginas ---
const totalPages = computed(() => {
  return Math.ceil(overallFilteredOrders.value.length / itemsPerPage);
});

// --- Função para mudar de página ---
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

// --- Função para buscar endereço por ID ---
const getAddressData = async (addressId) => {
  if (!addressId) return null;
  if (addresses.value[addressId]) return addresses.value[addressId];
  
  try {
    const address = await getAddressById(addressId);
    addresses.value[addressId] = address;
    return address;
  } catch (error) {
    console.error('Erro ao buscar endereço:', error);
    return null;
  }
};

// Função para limpar filtros
const clearFilters = () => {
  selectedStatus.value = '';
  selectedPeriod.value = '';
  startDate.value = '';
  endDate.value = '';
  searchId.value = '';
  currentPage.value = 1; 
};

onMounted(async () => { 
  while (!authStore.user || !authStore.user.id) { 
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  await orderStore.fetchOrdersByAdmin(authStore.user.id);
  for (const order of orders.value) { 
    if (order.address_id) {
      await getAddressData(order.address_id);
    }
  }
});

// Monitora mudanças nos filtros para resetar a página para 1
watch([selectedStatus, selectedPeriod, startDate, endDate, searchId], () => {
  currentPage.value = 1;
});

const totalPedidosFiltrados = computed(() => { 
  return overallFilteredOrders.value.reduce((acc, order) => { 
    return acc + (Number(order.total) || 0);
  }, 0).toFixed(2);
});
</script>

<style scoped>
:root {
  --admin-bg-primary: #0f0f23;
  --admin-bg-secondary: #1a1a2e;
  --admin-bg-tertiary: #24243a;

  /* Cores de Acento */
  --admin-accent-primary: #00ffe1;
  --admin-accent-secondary: #8f5fe8;

  /* Cores de Texto */
  --admin-text-primary: #ffffff;
  --admin-text-secondary: rgba(255, 255, 255, 0.8);
  --admin-text-muted: rgba(255, 255, 255, 0.6);

  /* Cores de Estado */
  --admin-success: #00d4aa;
  --admin-warning: #ffa726;
  --admin-danger: #ff6b6b;
  --admin-info: #4fc3f7;

  /* Bordas */
  --border-radius-rounded: 50px;
  --admin-border-light: rgba(255, 255, 255, 0.1);
  --admin-border-medium: rgba(255, 255, 255, 0.2); 

  /* Sombras */
  --admin-shadow-light: rgba(0, 0, 0, 0.1);
}

.order-management {
  background: linear-gradient(135deg, #0f0f23 0%, #24243a 100%) !important;
  min-height: calc(100vh - 100px);
  color: var(--admin-text-primary) !important;
  padding: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.text-primary-ggtech {
  color: var(--admin-accent-primary) !important;
  font-weight: 700;
  font-size: 2rem;
  margin-bottom: 1.5rem;
}

/* Filtros */
.filters-section {
  background: var(--admin-bg-secondary) !important;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid var(--admin-border-light);
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.filter-select,
.filter-input {
  background-color: var(--admin-bg-tertiary);
  border: 1px solid var(--admin-border-medium);
  color: var(--admin-text-primary);
  border-radius: 8px;
  transition: all 0.3s ease;
  padding: 0.75rem 1rem;
}

.filter-select:focus,
.filter-input:focus {
  background-color: var(--admin-bg-tertiary);
  border-color: var(--admin-accent-primary);
  box-shadow: 0 0 0 0.2rem rgba(0, 255, 225, 0.25);
  color: var(--admin-text-primary);
  outline: none;
}

.filter-select option {
  background-color: var(--admin-bg-tertiary);
  color: var(--admin-text-primary);
}

.form-label {
  color: var(--admin-text-secondary);
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.btn-outline-secondary {
  color: var(--admin-text-muted);
  border-color: var(--admin-border-medium);
  background: transparent;
  transition: all 0.3s ease;
  border-radius: 8px;
  padding: 0.5rem 1rem;
}

.btn-outline-secondary:hover {
  color: var(--admin-accent-primary);
  border-color: var(--admin-accent-primary);
  background: rgba(0, 255, 225, 0.1);
}

.text-muted {
  color: var(--admin-text-muted) !important;
}

/* Responsividade */
@media (max-width: 768px) {
  .order-management {
    padding: 1rem;
  }
  
  .text-primary-ggtech {
    font-size: 1.5rem;
  }
  
  .filters-section {
    padding: 1rem;
  }
}
</style>