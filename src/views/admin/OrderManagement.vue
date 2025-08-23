<template>
  <div class="order-management">
    <div class="admin-header mb-4 d-flex align-items-center gap-3">
      <span class="admin-icon">
        <svg width="38" height="38" fill="none" viewBox="0 0 24 24"><path fill="#64b5f6" d="M12 2a5 5 0 0 1 5 5v1h1a4 4 0 0 1 4 4v7a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4v-7a4 4 0 0 1 4-4h1V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v1h6V7a3 3 0 0 0-3-3Z"/></svg>
      </span>
      <div>
        <h2 class="fw-bold text-primary-ggtech m-0">Pedidos</h2>
        <div class="admin-subtitle">Gerencie, filtre e visualize todos os pedidos do sistema</div>
      </div>
    </div>
    
    <!-- Filtros -->
    <div class="filters-section card-filters mb-4">
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
    
    <!-- Tabela de pedidos melhorada -->
    <div class="table-responsive order-table-container card-table">
      <table class="table table-dark table-hover align-middle order-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Produtos</th>
            <th>Cliente</th>
            <th>Status</th>
            <th>Data</th>
            <th>Total</th>
            <th>Endereço</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in paginatedOrders" :key="order.id">
            <td class="fw-bold text-info">#{{ order.id }}</td>
            <td>
              <div class="order-products-list">
                <div
                  v-for="product in order.products"
                  :key="product.id"
                  class="order-product-item"
                >
                  <img
                    :src="product.image_url || fallbackImage"
                    alt="Imagem do produto"
                    class="order-product-img"
                    @error="onImgError"
                  />
                  <div class="order-product-info">
                    <div class="order-product-name">{{ product.name }}</div>
                    <div class="order-product-qty-price">
                      <span class="badge bg-secondary me-2">Qtd: {{ product.quantity }}</span>
                      <span class="text-light">R$ {{ Number(product.price).toFixed(2) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </td>
            <td>
              <span v-if="order.user && order.user.name">{{ order.user.name }}</span>
              <span v-else class="text-muted">-</span>
            </td>
            <td>
              <span :class="['badge', getStatusClass(order.status)]">{{ getStatusLabel(order.status) }}</span>
            </td>
            <td>
              <span>{{ formatDate(order.order_date) }}</span>
            </td>
            <td>
              <span class="fw-bold text-success">R$ {{ order.total }}</span>
            </td>
            <td>
              <span v-if="addresses[order.address_id]">
                {{ formatAddress(addresses[order.address_id]) }}
              </span>
              <span v-else class="text-muted">-</span>
            </td>
            <td>
              <div class="d-flex justify-content-center align-items-center gap-2">
                <button class="btn btn-sm btn-outline-info" @click="showOrderDetail(order)">
                  <i class="bi bi-eye"></i> Ver detalhes
                </button>
                <button class="btn btn-sm btn-outline-primary" @click="downloadOrderPDF(order)">
                  <i class="bi bi-download"></i> Baixar PDF
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- Paginação -->
      <div class="d-flex justify-content-center my-3 pagination-controls" v-if="totalPages > 1">
        <button class="btn btn-pagination me-2" :disabled="currentPage === 1" @click="goToPage(currentPage - 1)">
          <i class="bi bi-chevron-left"></i> Anterior
        </button>
        <span class="pagination-info page-info">Página {{ currentPage }} de {{ totalPages }}</span>
        <button class="btn btn-pagination ms-2" :disabled="currentPage === totalPages" @click="goToPage(currentPage + 1)">
          Próxima <i class="bi bi-chevron-right"></i>
        </button>
      </div>
    </div>

    <!-- Modal de detalhes do pedido -->
    <div v-if="selectedOrder" class="modal fade show d-block" tabindex="-1" style="background:rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content order-detail-modal">
          <div class="modal-header">
            <h5 class="modal-title">Detalhes do Pedido #{{ selectedOrder.id }}</h5>
            <button type="button" class="btn-close" @click="selectedOrder = null"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <strong>Status:</strong>
              <span :class="['badge', getStatusClass(selectedOrder.status)]">{{ getStatusLabel(selectedOrder.status) }}</span>
            </div>
            <div class="mb-3">
              <strong>Cliente:</strong>
              <span>{{ selectedOrder.user?.name || '-' }}</span>
            </div>
            <div class="mb-3">
              <strong>Data do Pedido:</strong>
              <span>{{ formatDate(selectedOrder.order_date) }}</span>
            </div>
            <div class="mb-3">
              <strong>Endereço:</strong>
              <span>{{ addresses[selectedOrder.address_id] ? formatAddress(addresses[selectedOrder.address_id]) : '-' }}</span>
            </div>
            <div class="mb-3">
              <strong>Produtos:</strong>
              <div class="order-products-list">
                <div
                  v-for="product in selectedOrder.products"
                  :key="product.id"
                  class="order-product-item"
                >
                  <img
                    :src="product.image_url || fallbackImage"
                    alt="Imagem do produto"
                    class="order-product-img"
                    @error="onImgError"
                  />
                  <div class="order-product-info">
                    <div class="order-product-name">{{ product.name }}</div>
                    <div class="order-product-qty-price">
                      <span class="badge bg-secondary me-2">Qtd: {{ product.quantity }}</span>
                      <span class="text-light">R$ {{ Number(product.price).toFixed(2) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="mb-3">
              <strong>Total:</strong>
              <span class="fw-bold text-success">R$ {{ selectedOrder.total }}</span>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="selectedOrder = null">Fechar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { getOrderByAdmin, getAddressById } from '@/services/apiService';
import { useAuthStore } from '@/stores/authStore';
import { useOrderStore } from '@/stores/orderStore';
import { storeToRefs } from 'pinia';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const addresses = ref({});
const authStore = useAuthStore();
const baseUrl = import.meta.env.VITE_API_URL || 'http://35.196.79.227:8000';
const orderStore = useOrderStore();
const { orders } = storeToRefs(orderStore);

const selectedStatus = ref('');
const selectedPeriod = ref('');
const startDate = ref('');
const endDate = ref('');
const searchId = ref('');
const fallbackImage = 'https://placehold.co/60x60?text=Produto';
const selectedOrder = ref(null);

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

// Função para pegar a imagem do produto
function getProductImage(product) {
  if (product.image_url) {
    return product.image_url;
  }
  return fallbackImage;
}

// Função para exibir detalhes do pedido em um modal
function showOrderDetail(order) {
  selectedOrder.value = order;
}

// Função para baixar o PDF do pedido
function downloadOrderPDF(order) {
  const doc = new jsPDF();
  doc.setFontSize(12);
  doc.text(`Pedido #${order.id}`, 14, 22);
  doc.setFontSize(10);
  doc.text(`Status: ${getStatusLabel(order.status)}`, 14, 32);
  doc.text(`Cliente: ${order.user?.name || '-'}`, 14, 42);
  doc.text(`Data do Pedido: ${formatDate(order.order_date)}`, 14, 52);
  doc.text(`Total: R$ ${order.total}`, 14, 62);

  // Adiciona tabela de produtos
  const tableData = order.products.map(product => {
    return [
      product.name,
      product.quantity,
      `R$ ${Number(product.price).toFixed(2)}`,
      `R$ ${(product.quantity * product.price).toFixed(2)}`
    ];
  });

  autoTable(doc, {
    startY: 70,
    head: [['Produto', 'Quantidade', 'Preço Unitário', 'Preço Total']],
    body: tableData,
    theme: 'grid',
    styles: {
      cellPadding: 2,
      fontSize: 10,
      halign: 'center',
      valign: 'middle'
    },
    headStyles: {
      fillColor: [100, 181, 246],
      textColor: [0, 0, 0],
      fontStyle: 'bold'
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240]
    }
  });

  doc.save(`pedido_${order.id}.pdf`);
}

// Função para formatar a data
function formatDate(dateString) {
  if (!dateString) return '-';
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  };
  const date = new Date(dateString);
  return date.toLocaleString('pt-BR', options);
}

// Função para obter a classe de status
function getStatusClass(status) {
  switch (status) {
    case 'PENDING':
      return 'bg-warning text-dark';
    case 'PROCESSING':
      return 'bg-info';
    case 'SHIPPED':
      return 'bg-primary';
    case 'DELIVERED':
      return 'bg-success';
    case 'CANCELED':
      return 'bg-danger';
    default:
      return '';
  }
}

// Função para obter o rótulo de status
function getStatusLabel(status) {
  switch (status) {
    case 'PENDING':
      return 'Pendente';
    case 'PROCESSING':
      return 'Processando';
    case 'SHIPPED':
      return 'Enviado';
    case 'DELIVERED':
      return 'Entregue';
    case 'CANCELED':
      return 'Cancelado';
    default:
      return 'Desconhecido';
  }
}

// Função para formatar o endereço
function formatAddress(address) {
  if (!address) return '-';
  return `${address.street}, ${address.number} - ${address.neighborhood}, ${address.city} - ${address.state}, ${address.zip_code}`;
}

// Função chamada ao erro na imagem do produto
function onImgError(event) {
  event.target.src = fallbackImage;
}
</script>

<style scoped>
:root {
  --admin-bg-primary: #0f0f23;
  --admin-bg-secondary: #181828;
  --admin-bg-tertiary: #202038;
  --admin-accent-primary: #00ffe1;
  --admin-accent-secondary: #8f5fe8;
  --admin-text-primary: #ffffff;
  --admin-text-secondary: rgba(255, 255, 255, 0.8);
  --admin-text-muted: rgba(255, 255, 255, 0.6);
  --admin-border-light: rgba(255, 255, 255, 0.1);
  --admin-shadow-light: rgba(0, 0, 0, 0.4);
  --admin-danger: #ff6b6b;
  --admin-border-medium: rgba(255, 255, 255, 0.2);
}

.order-management {
  background-color: var(--admin-bg-primary);
  min-height: 100vh;
  color: var(--admin-text-primary);
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

.admin-header {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  margin-bottom: 2rem;
}
.admin-icon {
  background: linear-gradient(135deg, #64b5f6 0%, #42a5f5 100%);
  border-radius: 50%;
  padding: 0.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 12px #64b5f633;
}
.admin-subtitle {
  color: #b0b7c3;
  font-size: 1.08rem;
  margin-top: 2px;
  font-weight: 500;
}

.filters-section {
  background: var(--admin-bg-secondary);
  padding: 1.5rem;
  border-radius: 0.5rem;
  margin-bottom: 2rem;
}

.card-filters {
  box-shadow: 0 2px 12px #00000022;
  border: 1px solid #374151;
}

.filter-select, .filter-input {
  background: var(--admin-bg-tertiary);
  color: var(--admin-text-primary);
  border: 1px solid #374151;
  border-radius: 0.5rem;
}

.filter-select:focus, .filter-input:focus {
  background: var(--admin-bg-tertiary);
  border-color: #64b5f6;
  color: var(--admin-text-primary);
  box-shadow: 0 0 0 0.2rem rgba(100, 181, 246, 0.25);
}

.btn-outline-secondary {
  color: var(--admin-text-primary);
  border-color: #374151;
}

.btn-outline-secondary:hover {
  background: #23233a;
}

.table-responsive {
  background: var(--admin-bg-secondary);
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.25);
}

.table {
  margin-bottom: 0;
  color: var(--admin-text-primary);
}

.card-table {
  box-shadow: 0 4px 24px #00000033;
  border: 1px solid #374151;
}

.order-table th, .order-table td {
  border: none;
}

.order-table th {
  background: linear-gradient(90deg, #374151 0%, #64b5f6 100%);
  color: #fff;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.order-table td {
  background: transparent;
  color: #e8eaed;
  font-size: 0.97rem;
}

.order-table tbody tr {
  transition: background 0.2s;
}

.order-table tbody tr:hover {
  background: linear-gradient(90deg, #23233a 0%, #374151 100%);
}

.badge {
  font-size: 0.92rem;
  font-weight: 600;
  padding: 0.35rem 1rem;
  border-radius: 8px;
  letter-spacing: 0.04em;
  box-shadow: 0 1px 4px #00000018;
}

.bg-success {
  background: linear-gradient(90deg,#43e97b 0%,#38f9d7 100%) !important;
  color: #fff !important;
}

.bg-danger {
  background: linear-gradient(90deg,#ff6b6b 0%,#f44336 100%) !important;
  color: #fff !important;
}

.bg-warning {
  background: linear-gradient(90deg,#f9d423 0%,#ff4e50 100%) !important;
  color: #222 !important;
}

.bg-info {
  background: linear-gradient(90deg,#64b5f6 0%,#42a5f5 100%) !important;
  color: #fff !important;
}

.bg-primary {
  background: linear-gradient(90deg,#667eea 0%,#764ba2 100%) !important;
  color: #fff !important;
}

.order-products-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.order-product-item {
  background: #23233a;
  border-radius: 0.5rem;
  padding: 0.5rem 0.7rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 2px 8px #00000010;
  min-width: 160px;
}

.order-product-img {
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 0.5rem;
  border: 1.5px solid #374151;
  background: #181828;
}

.order-product-info {
  flex: 1;
}

.order-product-name {
  font-weight: 600;
  color: #8fd6fb;
  font-size: 0.98rem;
}

.order-product-qty-price {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  color: #e8eaed;
  font-size: 0.93rem;
}

.order-detail-modal {
  background: #23233a;
  color: #e8eaed;
  border-radius: 1.2rem;
  box-shadow: 0 8px 32px #00000040;
  border: 1px solid #374151;
}

.modal-header {
  border-bottom: 1px solid #374151;
  background: linear-gradient(90deg, #374151 0%, #64b5f6 100%);
}

.modal-title {
  font-size: 1.25rem;
  color: #64b5f6;
  font-weight: 700;
}

.modal-body {
  padding: 1.5rem;
}

.modal-footer {
  border-top: 1px solid #374151;
  padding: 1rem;
}

.btn-close {
  background: transparent;
  border: none;
  color: #e8eaed;
  font-size: 1.5rem;
  filter: invert(1);
}

.btn-close:hover {
  color: #64b5f6;
}

.pagination-controls {
  margin-top: 1.5rem;
}

.btn-pagination {
  background: linear-gradient(90deg,#64b5f6 0%,#42a5f5 100%);
  color: #fff;
  border: none;
  font-weight: 600;
  border-radius: 0.5rem;
  padding: 0.5rem 1.2rem;
  margin: 0 0.2rem;
  transition: background 0.2s;
}

.btn-pagination:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.page-info {
  color: #90caf9;
  font-weight: 600;
  font-size: 1.05rem;
  margin: 0 0.7rem;
}

@media (max-width: 900px) {
  .order-management {
    padding: 1.2rem 0.5rem;
    min-width: unset;
    max-width: 99vw;
  }
  .admin-header {
    flex-direction: column;
    gap: 0.7rem;
    margin-bottom: 1.2rem;
  }
  .table th, .table td {
    padding: 0.7rem;
    font-size: 0.95rem;
  }
  .order-product-item {
    min-width: 120px;
    padding: 0.3rem 0.5rem;
  }
}
</style>
