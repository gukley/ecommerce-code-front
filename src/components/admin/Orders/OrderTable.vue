<template>
  <div class="table-responsive order-table-wrapper">
    <table class="table order-table table-dark table-hover align-middle">
      <thead class="sticky-head">
        <tr>
          <th class="col-select">
            <input
              type="checkbox"
              :checked="allOnPageSelected"
              @change="toggleSelectAllOnPage"
              aria-label="Selecionar todos nesta página"
            />
          </th>
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
        <tr
          v-for="order in orders"
          :key="order.id"
          :class="['order-row', `status-${order.status?.toLowerCase()}`]"
          @mouseover="hoverId = order.id"
        >
          <td class="col-select">
            <input type="checkbox" :checked="isSelected(order.id)" @change="$emit('toggle-select', order.id)" :aria-label="`Selecionar pedido ${order.id}`" />
          </td>

          <td class="fw-bold text-info">#{{ order.id }}</td>

          <td>
            <div class="order-products-list">
              <div v-for="item in order.items" :key="item.id" class="order-product-item">
                <img :src="getProductImage(item)" alt="Imagem do produto" class="order-product-img" />
                <div class="order-product-info">
                  <div class="order-product-name">{{ getProductName(item) }}</div>
                  <div class="order-product-qty-price">
                    <span class="badge item-qty">Qtd: {{ item.quantity }}</span>
                    <span class="text-light">R$ {{ getUnitPrice(item).toFixed(2) }}</span>
                    <span v-if="getDiscount(item)" class="badge bg-success ms-2">-{{ getDiscount(item).discount_percentage }}%</span>
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
            <div class="d-flex align-items-center gap-2">
              <span :class="['status-pill', getStatusClass(order.status).replace(' ', '-')]" :aria-label="`Status: ${getStatusLabel(order.status)}`">{{ getStatusLabel(order.status) }}</span>
            </div>
            <select v-model="order.status" class="form-select form-select-sm mt-2 status-select" @change="emitStatusChange(order)">
              <option value="PENDING">Pendente</option>
              <option value="PROCESSING">Processando</option>
              <option value="SHIPPED">Enviado</option>
              <option value="CANCELLED">Cancelado</option>
            </select>
          </td>

          <td>{{ formatDate(order.order_date) }}</td>

          <td><span class="fw-bold text-success">R$ {{ getOrderTotal(order).toFixed(2) }}</span></td>

          <td>
            <span v-if="addresses[order.address_id]">{{ formatAddress(addresses[order.address_id]) }}</span>
            <span v-else class="text-muted">-</span>
          </td>

          <td>
            <div class="d-flex justify-content-center align-items-center gap-2">
              <button class="btn btn-sm btn-outline-info" @click="$emit('show-detail', order)" aria-label="Ver detalhes">
                <i class="bi bi-eye"></i>
                <span class="d-none d-md-inline"> Ver</span>
              </button>
              <button class="btn btn-sm btn-outline-primary" @click="$emit('download-pdf', order)" aria-label="Baixar PDF">
                <i class="bi bi-download"></i>
                <span class="d-none d-md-inline"> PDF</span>
              </button>
            </div>
          </td>
        </tr>

        <!-- empty state -->
        <tr v-if="!orders || orders.length === 0">
          <td colspan="9" class="text-center text-muted py-4">Nenhum pedido encontrado.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, computed, toRefs } from 'vue';
const props = defineProps({
  orders: { type: Array, default: () => [] },
  addresses: { type: Object, default: () => ({}) },
  selectedIds: { type: Object, default: () => new Set() },
  selectAllOnPage: { type: Boolean, default: false }
});
const emit = defineEmits(['change-status', 'show-detail', 'download-pdf', 'toggle-select', 'select-all']);

const hoverId = ref(null);

function isSelected(id) {
  return props.selectedIds?.has ? props.selectedIds.has(id) : false;
}

const allOnPageSelected = computed(() => {
  if (!props.orders || props.orders.length === 0) return false;
  return props.orders.every(o => isSelected(o.id));
});

function toggleSelectAllOnPage() {
  emit('select-all', props.orders);
}

function getDiscount(item) {
  if (item.discount && item.discount.discount_percentage) return item.discount;
  return null;
}
function getProductName(item) {
  return (item.product && item.product.name) || item.name || 'Produto';
}
function getProductImage(item) {
  if (item.product && item.product.image_path) {
    let base = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || '';
    let path = item.product.image_path.startsWith('/') ? item.product.image_path : '/' + item.product.image_path;
    return base + path;
  }
  return '/placeholder-product.png';
}
function getUnitPrice(item) {
  if (item.unit_price !== undefined && item.unit_price !== null) return Number(item.unit_price);
  if (item.price !== undefined && item.price !== null) return Number(item.price);
  if (item.product && item.product.price !== undefined && item.product.price !== null) return Number(item.product.price);
  return 0;
}
function getOrderTotal(order) {
  if (order.total_amount !== undefined && order.total_amount !== null) return Number(order.total_amount);
  if (!order.items || !order.items.length) return 0;
  return order.items.reduce((sum, item) => {
    if (item.total_price !== undefined && item.total_price !== null) return sum + Number(item.total_price);
    const price = getUnitPrice(item);
    const qty = Number(item.quantity ?? 1) || 1;
    return sum + price * qty;
  }, 0);
}
function formatDate(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleString('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
}
function emitStatusChange(order) {
  const allowed = ['PENDING','PROCESSING','CONFIRMED','SHIPPED','DELIVERED','CANCELLED'];
  let status = String(order.status).toUpperCase().trim();
  if (!allowed.includes(status)) status = 'PENDING';
  emit('change-status', order.id, { status });
}
function getStatusClass(status) {
  switch (String(status).toUpperCase()) {
    case 'PENDING': return 'badge bg-warning text-white';
    case 'PROCESSING': return 'badge bg-info';
    case 'CONFIRMED': return 'badge bg-info';
    case 'SHIPPED': return 'badge bg-primary';
    case 'DELIVERED': return 'badge bg-success';
    case 'CANCELLED': return 'badge bg-danger';
    default: return 'badge bg-warning text-white';
  }
}
function getStatusLabel(status) {
  switch (String(status).toUpperCase()) {
    case 'PENDING': return 'Pendente';
    case 'PROCESSING': return 'Processando';
    case 'SHIPPED': return 'Enviado';
    case 'CANCELLED': return 'Cancelado';
    default: return 'Pendente';
  }
}
function formatAddress(address) {
  if (!address) return '-';
  const street = address.street ?? '';
  const number = address.number ?? '';
  const bairro = address.bairro ?? '';
  const city = address.city ?? '';
  const state = address.state ?? '';
  const zip = address.zip_code ?? address.zip ?? '';
  let parts = [];
  if (street) parts.push(street);
  if (number) parts.push(number);
  let line = parts.join(', ');
  let loc = [];
  if (bairro) loc.push(bairro);
  if (city) loc.push(city);
  if (state) loc.push(state);
  let locStr = loc.join(', ');
  let zipStr = zip ? ` (${zip})` : '';
  return `${line}${locStr ? ' - ' + locStr : ''}${zipStr}`;
}
</script>

<style scoped>
.order-table-wrapper { overflow: auto; border-radius: 10px; }

/* sticky header */
.sticky-head {
  position: sticky;
  top: 0;
  backdrop-filter: blur(6px);
  z-index: 10;
}

/* header style */
.order-table th {
  background: linear-gradient(90deg, #111015 0%, #2aa6ff 100%);
  color: #fff;
  font-weight: 700;
  padding: 0.9rem;
  white-space: nowrap;
}

/* columns */
.col-select { width: 48px; text-align: center; }

/* rows with left status indicator */
.order-row {
  transition: background 0.18s, transform 0.12s;
  border-left: 6px solid transparent;
}
.order-row:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.45); }

/* status color indicator on left */
.status-pending { border-left-color: #ffcc70; }
.status-processing { border-left-color: #3bb4ff; }
.status-confirmed { border-left-color: #3bb4ff; }
.status-shipped { border-left-color: #7b61ff; }
.status-delivered { border-left-color: #5ce4b8; }
.status-canceled { border-left-color: #ff5c8a; }

/* product item */
.order-products-list { display:flex; flex-wrap:wrap; gap:0.5rem; }
.order-product-item { background:#1c1c26; border-radius:8px; padding:8px; display:flex; gap:8px; min-width:160px; align-items:center; box-shadow: 0 6px 18px rgba(0,0,0,0.45); }
.order-product-img { width:48px; height:48px; object-fit:cover; border-radius:6px; border:1px solid rgba(255,255,255,0.04); }
.order-product-name { font-weight:700; color:#bfe9ff; font-size:0.97rem; }
.order-product-qty-price { color:#dfe8ef; font-size:0.9rem; display:flex; gap:8px; align-items:center; }
.item-qty { background: rgba(255,255,255,0.06); color:#e6eefb; padding:4px 8px; border-radius:999px; font-weight:700; }

/* status pill */
.status-pill { padding:6px 10px; border-radius:999px; font-weight:700; display:inline-block; }
.badge.bg-warning { background:#ffcc70; color:#fff; }
.badge.bg-info { background:#3bb4ff; color:#fff; }
.badge.bg-primary { background:#7b61ff; color:#fff; }
.badge.bg-success { background:#5ce4b8; color:#fff; }
.badge.bg-danger { background:#ff5c8a; color:#fff; }

/* select small style */
.status-select { min-width: 140px; background: #151521; color: #fff; border: 1px solid rgba(255,255,255,0.06); border-radius:8px; }

/* buttons */
.btn-outline-info, .btn-outline-primary { border-radius:8px; font-weight:700; padding:6px 10px; }

/* mobile: switch to cards */
@media (max-width: 900px) {
  .order-table thead { display:none; }
  .order-table tbody tr { display:block; margin-bottom:12px; padding:12px; border-radius:12px; background:linear-gradient(180deg,#0e0e12,#12121a); box-shadow:0 8px 24px rgba(0,0,0,0.6); border-left:6px solid transparent; }
  .order-product-item { min-width: 100%; }
  .col-select, .order-table td:nth-child(6), .order-table td:nth-child(7), .order-table td:nth-child(8) { display:block; }
}
</style>