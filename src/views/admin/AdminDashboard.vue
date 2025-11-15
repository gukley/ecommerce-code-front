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
import { useRouter } from 'vue-router';
import ApexCharts from 'apexcharts'
import VueApexCharts from 'vue3-apexcharts'

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
const router = useRouter();

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
      // Para moderadores, carrega todos os pedidos. Para admins, carrega por adminId
      const userRole = authStore.user?.role?.toUpperCase();
      if (userRole === 'MODERATOR') {
        await orderStore.fetchAllOrders();
      } else {
        await orderStore.fetchOrdersByAdmin(authStore.user.id);
      }
    }
    if (couponStore.shouldRefetch && couponStore.shouldRefetch()) {
      await couponStore.fetchAllCoupons();
    }
    // Busca o total de clientes (após carregar pedidos para contar usuários únicos)
    await fetchTotalClientes();
  } catch (error) {
    console.error("Erro ao carregar dados do dashboard:", error);
  }
};

// Watch para atualizar total de clientes quando os pedidos mudarem
watch(orders, () => {
  if (dashboardInitialized.value && orders.value && orders.value.length > 0) {
    fetchTotalClientes();
  }
}, { deep: true });

// Função para buscar o total de clientes
const fetchTotalClientes = async () => {
  try {
    // Método principal: conta usuários únicos a partir dos pedidos
    // Isso é mais confiável já que os pedidos sempre têm informações de usuários
    if (orders.value && orders.value.length > 0) {
      const uniqueUserIds = new Set();
      orders.value.forEach(order => {
        // Tenta diferentes campos onde o user_id pode estar
        if (order.user_id) {
          uniqueUserIds.add(order.user_id);
        }
        if (order.user?.id) {
          uniqueUserIds.add(order.user.id);
        }
        if (order.customer_id) {
          uniqueUserIds.add(order.customer_id);
        }
      });
      totalClientes.value = uniqueUserIds.size;
      
      // Se conseguiu contar pelos pedidos, retorna
      if (totalClientes.value > 0) {
        return;
      }
    }
    
    // Alternativa 1: Tenta endpoint /admin/clients (caso seja implementado)
    try {
      const { getAdminClients } = await import('@/services/apiService');
      const response = await getAdminClients();
      
      let clients = [];
      if (Array.isArray(response)) {
        clients = response;
      } else if (Array.isArray(response?.data)) {
        clients = response.data;
      } else if (Array.isArray(response?.data?.data)) {
        clients = response.data.data;
      }
      
      if (clients.length > 0) {
        totalClientes.value = clients.filter(client => {
          const role = client.role?.toUpperCase() || '';
          return role === 'CLIENT' || role === 'USER' || !role || role === '';
        }).length;
        return;
      }
    } catch (err) {
      // Endpoint não disponível, continua para próxima alternativa
    }
    
    // Alternativa 2: Tenta endpoint /users/ (se disponível)
    try {
      const api = (await import('@/services/api')).default;
      const response = await api.get('/users/');
      
      let users = [];
      if (Array.isArray(response?.data)) {
        users = response.data;
      } else if (Array.isArray(response?.data?.data)) {
        users = response.data.data;
      } else if (Array.isArray(response)) {
        users = response;
      }
      
      if (users.length > 0) {
        totalClientes.value = users.filter(user => {
          const role = user.role?.toUpperCase() || '';
          return role === 'CLIENT' || role === 'USER' || !role || role === '';
        }).length;
        return;
      }
    } catch (err2) {
      // Endpoint não disponível
    }
    
    // Se nenhum método funcionou, mantém 0 ou usa um valor padrão
    if (totalClientes.value === 0 && orders.value && orders.value.length > 0) {
      // Se há pedidos mas não conseguiu contar usuários, mostra pelo menos 1
      // (assumindo que há pelo menos um cliente que fez pedido)
      totalClientes.value = 1;
    }
  } catch (error) {
    console.error("Erro ao buscar total de clientes:", error);
    // Em caso de erro, tenta contar pelos pedidos como fallback
    if (orders.value && orders.value.length > 0) {
      const uniqueUserIds = new Set();
      orders.value.forEach(order => {
        if (order.user_id) uniqueUserIds.add(order.user_id);
        if (order.user?.id) uniqueUserIds.add(order.user.id);
        if (order.customer_id) uniqueUserIds.add(order.customer_id);
      });
      totalClientes.value = uniqueUserIds.size || 0;
    } else {
      totalClientes.value = 0;
    }
  }
};

// Computed Properties
const isLoading = computed(() => {
  return !dashboardInitialized.value || loadingPedidos.value || loadingProdutos.value || loadingCupons.value;
});

// Corrige o total de vendas para considerar total_amount ou soma dos itens
const totalVendas = computed(() => {
  if (!orders.value || orders.value.length === 0) return 0;
  return orders.value.reduce((sum, order) => {
    const total = order.total_amount ?? order.total ?? getOrderTotal(order);
    return sum + (total ? Number(total) : 0);
  }, 0);
});

// Calcula o total do pedido caso não venha do backend
function getOrderTotal(order) {
  if (!order.items || order.items.length === 0) return 0;
  return order.items.reduce((sum, item) => {
    const price = item.unit_price ?? item.price ?? (item.product?.price ?? 0);
    const quantity = item.quantity ?? 1;
    return sum + (price * quantity);
  }, 0);
}

// Formata a data corretamente (aceita string, número, objeto timestamp e já-formatado)
const formatDate = (dateInput) => {
  if (!dateInput) return 'N/A';

  // Se já estiver em formato dd/mm/yyyy (ou similar), retorna como está
  if (typeof dateInput === 'string') {
    const alreadyFormatted = /^\d{2}\/\d{2}\/\d{4}/.test(dateInput);
    if (alreadyFormatted) return dateInput;
  }

  let date;
  // Número (timestamp em ms ou s)
  if (typeof dateInput === 'number' || (/^\d+$/.test(String(dateInput)))) {
    const n = Number(dateInput);
    // Se parecer em segundos (10 dígitos), converte para ms
    date = new Date(n < 1e12 ? n * 1000 : n);
  } else if (typeof dateInput === 'object' && dateInput !== null) {
    // Firebase timestamp (seconds) ou objeto com toDate
    if (dateInput.seconds) {
      date = new Date(dateInput.seconds * 1000);
    } else if (typeof dateInput.toDate === 'function') {
      date = dateInput.toDate();
    } else {
      date = new Date(dateInput);
    }
  } else {
    date = new Date(dateInput);
  }

  if (isNaN(date.getTime())) return 'N/A';

  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Tenta recuperar a data do pedido a partir de vários campos/fonte possíveis
function getOrderDate(order) {
  if (!order) return null;
  const candidates = [
    'created_at', 'createdAt', 'date', 'ordered_at', 'order_date',
    'purchased_at', 'paid_at', 'timestamp', 'created', 'updated_at'
  ];

  for (const k of candidates) {
    const v = order[k];
    if (v) return v;
  }

  // Verifica campos aninhados comuns
  const nested = order.attributes?.created_at ?? order.attributes?.createdAt ?? order.meta?.created_at ?? order.meta?.createdAt;
  if (nested) return nested;

  // Ex.: histórico/atividades do pedido
  if (Array.isArray(order.history) && order.history.length) {
    const h = order.history.find(x => x.created_at || x.date);
    if (h) return h.created_at ?? h.date;
  }

  return null;
}

// Atualiza a exibição dos últimos pedidos: usa getOrderDate para ordenar e expor created_at cru
const ultimosPedidos = computed(() => {
  if (!orders.value || orders.value.length === 0) return [];
  return orders.value.slice()
    .sort((a, b) => {
      const da = new Date(getOrderDate(a) ?? a.created_at ?? a.createdAt ?? 0).getTime();
      const db = new Date(getOrderDate(b) ?? b.created_at ?? b.createdAt ?? 0).getTime();
      return db - da;
    })
    .slice(0, 5)
    .map(order => ({
      ...order,
      total: order.total_amount ?? order.total ?? getOrderTotal(order),
      // manter criado cru para formatar no template com formatDate
      created_at: getOrderDate(order) ?? order.created_at ?? order.createdAt ?? null,
    }));
});

const totalPedidos = computed(() => {
  return orders.value?.length || 0;
});

const totalCupons = computed(() => {
  if (!coupons.value || coupons.value.length === 0) return 0;
  // Considere apenas cupons ativos (data de expiração no futuro)
  const now = new Date();
  return coupons.value.filter(c => !c.end_date || new Date(c.end_date) >= now).length;
});


const getOrderStatusClass = (status) => {
  switch (status?.toLowerCase()) {
    case 'pending': return 'bg-warning text-dark';
    case 'processing': return 'bg-info text-white';
    case 'completed': return 'bg-success text-white';
    case 'cancelled': return 'bg-danger text-white';
    default: return 'bg-secondary text-white';
  }
};

const formatStatus = (status) => {
  const statusMap = {
    'pending': 'Pendente',
    'processing': 'Processando',
    'completed': 'Concluído',
    'cancelled': 'Cancelado',
  };
  return statusMap[status?.toLowerCase()] || 'Desconhecido';
};

// Adicione um watch para a rota e para o usuário logado
watch(
  () => authStore.user,
  async (newUser, oldUser) => {
    if (newUser && newUser.id) {
      await fetchDashboardData();
      dashboardInitialized.value = true;
    }
  },
  { immediate: true }
);

watch(
  () => router.currentRoute.value.name,
  async (routeName) => {
    if (routeName === 'AdminDashboard' && authStore.user && authStore.user.id) {
      await fetchDashboardData();
      dashboardInitialized.value = true;
    }
  }
);

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

// Nova lista de atividades recentes
const atividadesRecentes = ref([
  { id: 1, date: new Date(), description: 'Novo pedido #1234 criado.', user: 'Cliente João' },
  { id: 2, date: new Date(), description: 'Produto "Teclado Gamer" atualizado.', user: 'Admin Gustavo' },
  { id: 3, date: new Date(), description: 'Novo cliente registrado: Maria.', user: 'Sistema' }
]);
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

.chart-card {
  background: linear-gradient(135deg, #181e2a 0%, #23233a 100%) !important;
  border: 1.5px solid #232e47 !important;
  border-radius: 1.2rem !important;
  box-shadow: 0 2px 12px #232e4720 !important;
  color: #e8eaed !important;
  margin-bottom: 0;
  min-height: 410px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
.chart-card h4 {
  font-size: 1.15rem;
  font-weight: 700;
  margin-bottom: 1.2rem;
  color: #64b5f6;
  letter-spacing: 0.01em;
  background: linear-gradient(90deg, #64b5f6 0%, #42a5f5 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.apexcharts-tooltip {
  color: #23233a !important;
}
@media (max-width: 991.98px) {
  .chart-card {
    min-height: 340px;
    margin-bottom: 1.2rem;
  }
}
@media (max-width: 600px) {
  .chart-card {
    min-height: 280px;
    padding: 1rem 0.3rem;
  }
}
/* Responsividade: aplica para todo o painel admin */
@media (max-width: 991.98px) {
  .dashboard-container {
    padding: 1.2rem 0.5rem;
    max-width: 100vw;
  }
  .row.g-4 > [class^="col-"] {
    flex: 0 0 100%;
    max-width: 100%;
  }
  .card,
  .metric-card,
  .dashboard-table-card {
    width: 100% !important;
    min-width: 0 !important;
    margin: 0 0 1.2rem 0 !important;
    box-sizing: border-box;
  }
  .dashboard-table-responsive,
  .table-responsive {
    overflow-x: auto;
  }
  .dashboard-table,
  .table {
    min-width: 600px;
  }
  .btn {
    width: 100%;
    margin-bottom: 0.7rem;
  }
}

@media (max-width: 600px) {
  .dashboard-container {
    padding: 0.5rem 0.1rem;
  }
  .text-primary-ggtech {
    font-size: 1.2rem;
  }
  .icon-container {
    width: 40px;
    height: 40px;
    font-size: 1rem;
    margin-right: 0.7rem;
  }
  .metric-card .card-title {
    font-size: 0.75rem;
  }
  .metric-card .card-text {
    font-size: 1rem;
  }
  .dashboard-table-card,
  .card {
    padding: 1rem 0.3rem;
  }
  .dashboard-table,
  .table {
    font-size: 0.95rem;
  }
  .btn {
    padding: 0.4rem 1rem;
    font-size: 0.95rem;
  }
  .badge {
    font-size: 0.7rem;
    padding: 0.4rem 0.6rem;
  }
}
</style>