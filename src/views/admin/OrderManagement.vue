<template>
  <div class="order-management">
    <div class="admin-header mb-4 d-flex align-items-center gap-3">
      <span class="admin-icon" aria-hidden="true">
        <svg width="38" height="38" fill="none" viewBox="0 0 24 24"><path fill="#64b5f6" d="M12 2a5 5 0 0 1 5 5v1h1a4 4 0 0 1 4 4v7a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4v-7a4 4 0 0 1 4-4h1V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v1h6V7a3 3 0 0 0-3-3Z"/></svg>
      </span>
      <div>
        <h2 class="fw-bold text-primary-ggtech m-0">Pedidos</h2>
        <div class="admin-subtitle">Gerencie, filtre e visualize todos os pedidos do sistema</div>
      </div>
    </div>

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
      @search-debounced="handleSearchDebounced"
    />

    <div class="table-actions-bar d-flex align-items-center justify-content-between mb-2 gap-3">
      <div class="left-actions d-flex align-items-center gap-2">
        <div v-if="selectedIds.size" class="bulk-info">
          <span class="bulk-count">{{ selectedIds.size }} selecionado(s)</span>
          <div class="bulk-actions">
            <select v-model="bulkStatus" class="form-select form-select-sm" aria-label="Mudar status em massa">
              <option value="">Mudar status...</option>
              <option value="PROCESSING">Processando</option>
              <option value="SHIPPED">Enviado</option>
              <option value="DELIVERED">Entregue</option>
              <option value="CANCELLED">Cancelado</option>
            </select>
            <button class="btn btn-sm btn-apply" :disabled="!bulkStatus" @click="applyBulkStatus">Aplicar</button>
            <button class="btn btn-sm btn-export" @click="exportSelectedCSV">Exportar CSV</button>
            <button class="btn btn-sm btn-clear" @click="clearSelection">Limpar</button>
          </div>
        </div>
      </div>

      <div class="right-actions d-flex align-items-center gap-2">
        <div class="text-muted me-2 small">Total (filtro): <strong class="ms-1 text-info">R$ {{ totalPedidosFiltrados }}</strong></div>
      </div>
    </div>

    <div class="table-responsive order-table-container card-table glass-table">
      <OrderTable
        :orders="paginatedOrders"
        :addresses="addresses"
        :selected-ids="selectedIds"
        :select-all-on-page="selectAllOnPage"
        @toggle-select="toggleSelect"
        @select-all="handleSelectAll"
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
import { getAddressById, getAllOrders } from '@/services/apiService';
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

const selectedIds = ref(new Set());
const selectAllOnPage = ref(false);
const bulkStatus = ref('');
const isLoading = ref(false);
const error = ref(null);

// Debounce helper (simple)
let debounceTimer = null;
function debounce(fn, delay = 300) {
  return (...args) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => fn(...args), delay);
  };
}

const overallFilteredOrders = computed(() => {
  let filtered = orders.value || [];
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
  return Math.ceil((overallFilteredOrders.value || []).length / itemsPerPage);
});

const totalPedidosFiltrados = computed(() => {
  return (overallFilteredOrders.value || []).reduce((acc, order) => {
    return acc + (Number(order.total_amount ?? order.total ?? order.total_price) || 0);
  }, 0).toFixed(2);
});

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    // clear page selection when changing page
    clearSelection();
  }
};

const getAddressData = async (addressId) => {
  if (!addressId) return null;
  if (addresses.value[addressId] !== undefined) return addresses.value[addressId];
  try {
    const address = await getAddressById(addressId);
    addresses.value[addressId] = address;
    return address;
  } catch (error) {
    addresses.value[addressId] = null;
    if (error?.response?.status !== 404) console.error('Erro ao buscar endereço:', error);
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
  clearSelection();
};

function updateFilters({ status, period, start, end, id }) {
  selectedStatus.value = status;
  selectedPeriod.value = period;
  startDate.value = start;
  endDate.value = end;
  searchId.value = id;
  currentPage.value = 1;
}

// Debounced search handler triggered from OrderFilters
function handleSearchDebounced(value) {
  // debounce internally
  debounce(() => {
    searchId.value = value;
    currentPage.value = 1;
  }, 300)();
}

// ✅ Função para carregar endereços de todos os pedidos
const loadAddressesForOrders = async (ordersList) => {
  if (!ordersList || !Array.isArray(ordersList)) return;

  // Carrega endereços em paralelo para melhor performance
  const addressPromises = ordersList
    .filter(order => order.address_id && !addresses.value[order.address_id])
    .map(order => getAddressData(order.address_id));

  await Promise.all(addressPromises);
};

// ✅ Função para carregar todos os pedidos (inclui moderadores e admins)
async function loadOrders() {
  isLoading.value = true;
  error.value = null;
  try {
    // Chama a API para buscar todos os pedidos
    const data = await getAllOrders();
    orders.value = Array.isArray(data) ? data : [];

    // Carrega endereços para todos os pedidos
    await loadAddressesForOrders(orders.value);
  } catch (err) {
    console.error('Erro ao carregar pedidos:', err);
    error.value = 'Erro ao carregar pedidos. Tente novamente mais tarde.';
  } finally {
    isLoading.value = false;
  }
}

// Carrega os pedidos ao montar o componente
onMounted(async () => {
  while (!authStore.user || !authStore.user.id) {
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  // Para moderadores e admins, carrega todos os pedidos
  await loadOrders();
});

// Watch para carregar endereços quando novos pedidos chegarem
watch(orders, async (newOrders) => {
  if (newOrders && newOrders.length > 0) {
    await loadAddressesForOrders(newOrders);
  }
}, { deep: true });

watch([selectedStatus, selectedPeriod, startDate, endDate, searchId], () => {
  currentPage.value = 1;
  clearSelection();
});

function showOrderDetail(order) {
  selectedOrder.value = order;
}

// 🔹 Traduz status para português
function translateStatus(status) {
  switch ((status || '').toUpperCase()) {
    case 'PENDING': return 'Pendente'
    case 'PROCESSING': return 'Processando'
    case 'SHIPPED': return 'Enviado'
    case 'DELIVERED': return 'Entregue'
    case 'CANCELLED': return 'Cancelado'
    default: return status
  }
}

// 🔹 Formata data para DD/MM/YYYY HH:MM
function formatDate(dateString) {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleString('pt-BR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 🔹 Formata preço
function formatPrice(value) {
  if (value == null) return '-'
  return `R$ ${Number(value).toFixed(2)}`
}

// 🔹 Gera PDF profissional do pedido
async function downloadOrderPDF(order) {
  const doc = new jsPDF()
  
  // ✅ Cabeçalho com logo/título
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(20)
  doc.setTextColor(74, 144, 226) // Azul
  doc.text('NOTA FISCAL - GGTECH', 15, 20)
  
  // Linha separadora
  doc.setDrawColor(74, 144, 226)
  doc.setLineWidth(0.5)
  doc.line(15, 25, 195, 25)
  
  // ✅ Informações do pedido
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(12)
  doc.setTextColor(0, 0, 0)
  
  let y = 35
  doc.text(`Pedido: #${order.id}`, 15, y)
  y += 8
  doc.text(`Data: ${formatDate(order.order_date)}`, 15, y)
  y += 8
  doc.text(`Status: ${translateStatus(order.status)}`, 15, y)
  y += 8
  
  // ✅ Nome do cliente
  const clienteNome = order.user?.name || order.customer_name || 'Cliente não informado'
  doc.text(`Cliente: ${clienteNome}`, 15, y)
  y += 8
  
  // ✅ Busca e exibe o endereço de entrega
  if (order.address_id && addresses.value[order.address_id]) {
    const addr = addresses.value[order.address_id]
    y += 5
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(74, 144, 226)
    doc.text('ENDEREÇO DE ENTREGA:', 15, y)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(0, 0, 0)
    y += 8
    
    const endereco = [
      `${addr.street || '-'}, ${addr.number || '-'}`,
      addr.complement ? `Complemento: ${addr.complement}` : null,
      `${addr.neighborhood || addr.bairro || '-'} - ${addr.city || '-'}/${addr.state || '-'}`,
      `CEP: ${addr.zip_code || addr.zip || '-'}`
    ].filter(Boolean)
    
    endereco.forEach(linha => {
      doc.text(linha, 15, y)
      y += 6
    })
  }
  
  // Linha separadora antes dos produtos
  y += 5
  doc.setDrawColor(200, 200, 200)
  doc.setLineWidth(0.3)
  doc.line(15, y, 195, y)
  y += 10
  
  // ✅ Título dos produtos
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(74, 144, 226)
  doc.setFontSize(14)
  doc.text('PRODUTOS:', 15, y)
  y += 10
  
  // ✅ Cabeçalho da tabela de produtos
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(255, 255, 255)
  doc.setFillColor(74, 144, 226)
  doc.rect(15, y - 5, 180, 8, 'F')
  doc.text('Produto', 17, y)
  doc.text('Qtd', 120, y)
  doc.text('Unit.', 140, y)
  doc.text('Subtotal', 165, y)
  y += 10
  
  // ✅ Lista de produtos
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(9)
  
  let subtotalGeral = 0
  const produtos = order.items || order.products || []
  
  produtos.forEach((p) => {
    const nomeProduto = p.product?.name || p.name || 'Produto'
    const quantidade = p.quantity ?? 1
    const precoUnit = Number(p.unit_price ?? p.price) || 0
    const subtotal = precoUnit * quantidade
    subtotalGeral += subtotal
    
    // Nome do produto (com quebra de linha se necessário)
    const maxWidth = 100
    const linhasNome = doc.splitTextToSize(nomeProduto, maxWidth)
    doc.text(linhasNome, 17, y)
    
    // Quantidade, preço unitário e subtotal
    doc.text(String(quantidade), 120, y)
    doc.text(formatPrice(precoUnit), 140, y)
    doc.text(formatPrice(subtotal), 165, y)
    
    y += (linhasNome.length * 6) + 3
    
    // Linha separadora entre produtos
    doc.setDrawColor(230, 230, 230)
    doc.line(15, y - 1, 195, y - 1)
    
    // Adiciona nova página se necessário
    if (y > 260) {
      doc.addPage()
      y = 20
    }
  })
  
  // ✅ Total do pedido
  y += 10
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.setTextColor(74, 144, 226)
  
  // Subtotal
  doc.text('Subtotal:', 120, y)
  doc.text(formatPrice(subtotalGeral), 165, y)
  y += 8
  
  // Frete (se houver)
  if (order.shipping_cost && Number(order.shipping_cost) > 0) {
    doc.text('Frete:', 120, y)
    doc.text(formatPrice(Number(order.shipping_cost)), 165, y)
    y += 8
  }
  
  // Desconto (se houver)
  if (order.discount_amount && Number(order.discount_amount) > 0) {
    doc.setTextColor(40, 167, 69) // Verde
    doc.text('Desconto:', 120, y)
    doc.text(`- ${formatPrice(Number(order.discount_amount))}`, 165, y)
    y += 8
  }
  
  // ✅ Total final (corrigido)
  doc.setFontSize(14)
  doc.setTextColor(0, 0, 0)
  const totalFinal = getOrderTotal(order)
  doc.text('TOTAL:', 120, y)
  doc.text(formatPrice(totalFinal), 165, y)
  
  // ✅ Rodapé
  y += 20
  if (y > 260) {
    doc.addPage()
    y = 20
  }
  
  doc.setFontSize(9)
  doc.setFont('helvetica', 'italic')
  doc.setTextColor(100, 100, 100)
  doc.text('Obrigado por comprar na GGTECH! Para dúvidas, entre em contato conosco.', 15, y)
  y += 6
  doc.text(`Documento gerado em: ${new Date().toLocaleString('pt-BR')}`, 15, y)
  
  // Salva o PDF
  doc.save(`pedido_${order.id}.pdf`);
}

// Selection helpers for bulk actions
function toggleSelect(orderId) {
  if (selectedIds.value.has(orderId)) selectedIds.value.delete(orderId);
  else selectedIds.value.add(orderId);
  // re-create Set to trigger reactivity
  selectedIds.value = new Set(selectedIds.value);
}

function handleSelectAll(currentPageOrders = []) {
  // toggles selection of all orders on current page
  const allSelected = currentPageOrders.every(o => selectedIds.value.has(o.id));
  if (allSelected) {
    // remove all
    currentPageOrders.forEach(o => selectedIds.value.delete(o.id));
  } else {
    currentPageOrders.forEach(o => selectedIds.value.add(o.id));
  }
  selectedIds.value = new Set(selectedIds.value);
}

function clearSelection() {
  selectedIds.value = new Set();
  selectAllOnPage.value = false;
}

async function applyBulkStatus() {
  if (!bulkStatus.value || selectedIds.value.size === 0) return;
  // TODO: integrate with backend bulk endpoint:
  // Example: await orderStore.bulkChangeStatus([...selectedIds.value], bulkStatus.value, authStore.user.id)
  // For now, emit change for each and refresh
  try {
    for (const id of Array.from(selectedIds.value)) {
      await changeOrderStatus(id, { status: bulkStatus.value });
    }
    bulkStatus.value = '';
    clearSelection();
  } catch (err) {
    console.error('Erro em bulk status:', err);
  }
}

function exportSelectedCSV() {
  // Create CSV from selected orders (client side)
  const selected = (orders.value || []).filter(o => selectedIds.value.has(o.id));
  if (!selected.length) return;
  const rows = [];
  rows.push(['ID', 'Cliente', 'Data', 'Status', 'Total', 'Itens']);
  selected.forEach(o => {
    const items = (o.items || []).map(i => `${i.quantity}x ${i.product?.name || i.name}`).join(' | ');
    rows.push([o.id, o.user?.name || '-', o.order_date, o.status, (o.total_amount ?? o.total ?? 0), items]);
  });
  const csv = rows.map(r => r.map(cell => `"${String(cell).replace(/"/g,'""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `pedidos_export_${Date.now()}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

async function changeOrderStatus(orderId, statusData) {
  try {
    await orderStore.changeOrderStatus(orderId, statusData, authStore.user.id)
    await orderStore.fetchOrdersByAdmin(authStore.user.id)
    window.dispatchEvent(new Event('orders-updated'))
    if (selectedOrder.value && selectedOrder.value.id === orderId) {
      const updated = orders.value.find(o => o.id === orderId)
      if (updated) selectedOrder.value = updated
    }
  } catch (error) {
    console.error('Erro ao alterar status do pedido:', error)
  }
}

// ✅ CORRIGIDO: usa total_price do pedido (já vem com desconto aplicado)
function getOrderTotal(order) {
  if (order.total_price != null) {
    return Number(order.total_price) // Usa o valor com desconto
  }
  // Fallback para total_amount
  if (order.total_amount != null) {
    return Number(order.total_amount)
  }
  // Último fallback: calcula pela soma dos produtos
  if (!order.products || !order.products.length) return 0
  return order.products.reduce((sum, p) => {
    const price = Number(p.unit_price ?? p.price) || 0
    const qty = Number(p.quantity ?? 1) || 1
    return sum + price * qty
  }, 0)
}
</script>

<style scoped>
/* Mantive e refinei seu design, com foco em clareza e profissionalismo */
.order-management {
  background: linear-gradient(135deg, #0b0b10 0%, #0f0f17 100%);
  min-height: 100vh;
  color: #e6e6e9;
  padding: 2rem 1rem;
  font-family: 'Inter', sans-serif;
}

/* header */
.text-primary-ggtech {
  background: linear-gradient(90deg, #7b61ff 0%, #3bb4ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
  font-size: 2.2rem;
}

.admin-subtitle { color: #b0b7c3; font-size: 1.02rem; font-weight: 500; }

/* filters area kept in child component */

/* actions bar */
.table-actions-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.bulk-info { display:flex; align-items:center; gap:12px; }
.bulk-count { font-weight:700; color:#cce8ff; }
.bulk-actions .form-select { display:inline-block; width:auto; min-width:150px; margin-right:8px; }

/* refined buttons */
.btn-apply, .btn-export, .btn-clear {
  border-radius: 10px;
  padding: 6px 10px;
  font-weight:600;
  border: none;
  cursor: pointer;
}
.btn-apply { background: linear-gradient(90deg,#4aa7ff,#7b61ff); color:#fff; box-shadow: 0 6px 18px rgba(123,97,255,0.12); }
.btn-export { background: transparent; border: 1px solid rgba(255,255,255,0.06); color:#dfefff; }
.btn-clear { background: rgba(255,255,255,0.03); color:#cbd5e1; }

.card-table { padding: 1rem; border-radius:12px; }

/* glass panel */
.glass-table {
  background: linear-gradient(180deg, rgba(27,27,38,0.82), rgba(18,18,26,0.86));
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.6);
  border: 1px solid rgba(255,255,255,0.04);
  backdrop-filter: blur(6px);
}

/* responsive */
@media (max-width: 900px) {
  .order-management { padding: 1.2rem 0.6rem; }
  .bulk-actions .form-select { min-width: 120px; }
  .table-actions-bar { flex-direction: column; align-items:flex-start; gap:10px; }
}
</style>