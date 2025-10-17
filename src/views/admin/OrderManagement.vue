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
    <OrderFilters
      :selected-status="selectedStatus"
      :selected-period="selectedPeriod"
      :start-date="startDate"
      :end-date="endDate"
      :search-id="searchId"
      :orders="orders"
      :filtered-orders="overallFilteredOrders"
      :total-pedidos="totalPedidosFiltrados"
      @update:filters="updateFilters"
      @clear-filters="clearFilters"
    />

    <!-- Tabela de pedidos -->
    <div class="table-responsive order-table-container card-table glass-table">
      <OrderTable
        :orders="paginatedOrders"
        :addresses="addresses"
        @show-detail="showOrderDetail"
        @download-pdf="downloadOrderPDF"
        @change-status="changeOrderStatus"
      />
      <PaginationControls
        :current-page="currentPage"
        :total-pages="totalPages"
        @go-to-page="goToPage"
        class="my-3"
        v-if="totalPages > 1"
      />
    </div>

    <!-- Modal de detalhes -->
    <OrderDetailModal
      v-if="selectedOrder"
      :order="selectedOrder"
      :addresses="addresses"
      @close="selectedOrder = null"
      @change-status="changeOrderStatus"
    />
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

import OrderFilters from '@/components/Admin/Orders/OrderFilters.vue';
import OrderTable from '@/components/Admin/Orders/OrderTable.vue';
import OrderDetailModal from '@/components/Admin/Orders/OrderDetailModal.vue';
import PaginationControls from '@/components/Common/PaginationControls.vue';

const addresses = ref({});
const authStore = useAuthStore();
const orderStore = useOrderStore();
const { orders } = storeToRefs(orderStore);

const selectedStatus = ref('');
const selectedPeriod = ref('');
const startDate = ref('');
const endDate = ref('');
const searchId = ref('');
const selectedOrder = ref(null);

const currentPage = ref(1);
const itemsPerPage = 10;

const overallFilteredOrders = computed(() => {
  let filtered = orders.value;
  if (selectedStatus.value) {
    filtered = filtered.filter(order => String(order.status).toUpperCase() === selectedStatus.value.toUpperCase());
  }
  if (searchId.value) {
    filtered = filtered.filter(order => order.id.toString().includes(searchId.value));
  }
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

const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return overallFilteredOrders.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(overallFilteredOrders.value.length / itemsPerPage);
});

const totalPedidosFiltrados = computed(() => {
  return overallFilteredOrders.value.reduce((acc, order) => {
    return acc + (Number(order.total) || 0);
  }, 0).toFixed(2);
});

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const getAddressData = async (addressId) => {
  if (!addressId) return null;
  if (addresses.value[addressId]) return addresses.value[addressId];
  try {
    const address = await getAddressById(addressId);
    addresses.value[addressId] = address;
    return address;
  } catch (error) {
    return null;
  }
};

const clearFilters = () => {
  selectedStatus.value = '';
  selectedPeriod.value = '';
  startDate.value = '';
  endDate.value = '';
  searchId.value = '';
  currentPage.value = 1;
};

function updateFilters({ status, period, start, end, id }) {
  selectedStatus.value = status;
  selectedPeriod.value = period;
  startDate.value = start;
  endDate.value = end;
  searchId.value = id;
}

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

watch([selectedStatus, selectedPeriod, startDate, endDate, searchId], () => {
  currentPage.value = 1;
});

function showOrderDetail(order) {
  selectedOrder.value = order;
}

function downloadOrderPDF(order) {
  const doc = new jsPDF();
  doc.setFontSize(12);
  doc.text(`Pedido #${order.id}`, 14, 22);
  doc.setFontSize(10);
  doc.text(`Status: ${order.status}`, 14, 32);
  doc.text(`Cliente: ${order.user?.name || '-'}`, 14, 42);
  doc.text(`Data do Pedido: ${order.order_date}`, 14, 52);
  doc.text(`Total: R$ ${order.total}`, 14, 62);
  const tableData = order.products.map(product => [
    product.name,
    product.quantity,
    `R$ ${Number(product.price).toFixed(2)}`,
    `R$ ${(product.quantity * product.price).toFixed(2)}`
  ]);
  autoTable(doc, {
    startY: 70,
    head: [['Produto', 'Quantidade', 'Preço Unitário', 'Preço Total']],
    body: tableData,
    theme: 'grid',
    styles: { cellPadding: 2, fontSize: 10, halign: 'center', valign: 'middle' },
    headStyles: { fillColor: [100, 181, 246], textColor: [0, 0, 0], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [240, 240, 240] }
  });
  doc.save(`pedido_${order.id}.pdf`);
}

async function changeOrderStatus(orderId, statusData) {
  try {
    // statusData deve ser { status: "PROCESSING" } etc.
    await orderStore.changeOrderStatus(orderId, statusData, authStore.user.id)
    await orderStore.fetchOrdersByAdmin(authStore.user.id)
    window.dispatchEvent(new Event('orders-updated'))
    // Atualiza o modal para refletir o novo status
    if (selectedOrder.value && selectedOrder.value.id === orderId) {
      const updated = orders.value.find(o => o.id === orderId)
      if (updated) selectedOrder.value = updated
    }
  } catch (error) {
    console.error('Erro ao alterar status do pedido:', error)
  }
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
  background: linear-gradient(120deg, #10141a 0%, #181e2a 80%, #232e47 100%);
  min-height: 100vh;
  color: var(--admin-text-primary);
  padding: 2rem 1rem;
  max-width: 1280px;
  margin: 0 auto;
  font-family: 'Inter', 'Rajdhani', Arial, sans-serif;
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

/* Filtros */
.filters-section {
  background: rgba(24,30,42,0.92);
  padding: 1.5rem;
  border-radius: 0.7rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 12px #232e4720;
  border: 1.5px solid #232e47;
}
.card-filters {
  box-shadow: 0 2px 12px #00000022;
  border: 1px solid #374151;
}
.filter-select, .filter-input {
  background: #181e2a;
  color: #e8eaed;
  border: 1px solid #374151;
  border-radius: 0.5rem;
}
.filter-select:focus, .filter-input:focus {
  background: #181e2a;
  border-color: #64b5f6;
  color: #e8eaed;
  box-shadow: 0 0 0 0.2rem rgba(100, 181, 246, 0.25);
}
.btn-outline-secondary {
  color: #e8eaed;
  border-color: #374151;
}
.btn-outline-secondary:hover {
  background: #23233a;
}

/* Tabela de pedidos */
.table-responsive.order-table-container {
  background: none;
  border-radius: 1.2rem;
  overflow: visible;
  box-shadow: none;
  border: none;
  margin-bottom: 2rem;
  padding: 0.5rem 0.5rem 0.5rem 0.5rem;
}
.glass-table {
  background: rgba(24,30,42,0.97);
  border-radius: 1.2rem;
  box-shadow: 0 8px 32px 0 #232e4780;
  border: 1.5px solid #232e47;
  backdrop-filter: blur(8px);
  margin-bottom: 2rem;
  transition: box-shadow 0.2s;
  padding: 0.5rem;
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
  border-top: none;
}
.order-table td {
  background: transparent;
  color: #e8eaed;
  font-size: 0.97rem;
  border-bottom: 1px solid #232e47;
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

/* Modal de detalhes */
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

/* Paginação */
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

/* Responsivo */
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
  .glass-table {
    padding: 0.2rem 0.2rem 0.2rem 0.2rem;
    border-radius: 0.7rem;
  }
}
@media (max-width: 600px) {
  .glass-table {
    padding: 0.1rem 0.1rem 0.1rem 0.1rem;
    border-radius: 0.4rem;
  }
}
</style>