<template>
  <div class="table-responsive order-table-container card-table">
    <table class="table order-table table-dark table-hover align-middle">
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
        <tr v-for="order in orders" :key="order.id">
          <td class="fw-bold text-info">#{{ order.id }}</td>
          <td>
            <div class="order-products-list">
              <div
                v-for="product in order.products"
                :key="product.id"
                class="order-product-item"
              >
                <img
                  :src="getProductImage(product)"
                  alt="Imagem do produto"
                  class="order-product-img"
                />
                <div class="order-product-info">
                  <div class="order-product-name">{{ product.name }}</div>
                  <div class="order-product-qty-price">
                    <span class="badge bg-secondary me-2">Qtd: {{ product.quantity }}</span>
                    <span class="text-light">
                      R$ {{ getUnitPrice(product, order).toFixed(2) }}
                    </span>
                    <span v-if="getDiscount(product)"> 
                      <span class="badge bg-success ms-2">
                        -{{ getDiscount(product).discount_percentage }}%
                      </span>
                    </span>
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
            <select
              v-model="order.status"
              class="form-select form-select-sm mt-2"
              @change="emitStatusChange(order)"
              style="min-width:120px; background:#181e2a; color:#fff; border:1px solid #374151;"
            >
              <option value="PENDING">Pendente</option>
              <option value="PROCESSING">Processando</option>
              <option value="CONFIRMED">Confirmado</option>
              <option value="SHIPPED">Enviado</option>
              <option value="DELIVERED">Entregue</option>
              <option value="CANCELED">Cancelado</option>
            </select>
          </td>
          <td>
            <span>{{ formatDate(order.order_date) }}</span>
          </td>
          <td>
            <span class="fw-bold text-success">
              R$ {{ getOrderTotal(order).toFixed(2) }}
            </span>
          </td>
          <td>
            <span v-if="addresses[order.address_id]">
              {{ formatAddress(addresses[order.address_id]) }}
            </span>
            <span v-else class="text-muted">-</span>
          </td>
          <td>
            <div class="d-flex justify-content-center align-items-center gap-2">
              <button class="btn btn-sm btn-outline-info" @click="$emit('show-detail', order)">
                <i class="bi bi-eye"></i> Ver detalhes
              </button>
              <button class="btn btn-sm btn-outline-primary" @click="$emit('download-pdf', order)">
                <i class="bi bi-download"></i> Baixar PDF
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script setup>
import { ref } from 'vue'
const props = defineProps({
  orders: Array,
  addresses: Object
})
const emit = defineEmits(['change-status', 'show-detail', 'download-pdf'])

// Função para buscar desconto do produto (se existir)
function getDiscount(product) {
  // Se o produto veio com discount, retorna
  if (product.discount && product.discount.discount_percentage) {
    return product.discount
  }
  // Se veio do pedido, pode estar em product.discount ou order.discount
  return null
}

// Retorna o preço unitário já com desconto se houver
function getUnitPrice(product, order) {
  const price = Number(product.unit_price ?? product.price)
  const discount = getDiscount(product)
  if (discount && discount.discount_percentage > 0) {
    return price * (1 - discount.discount_percentage / 100)
  }
  return price
}

// Calcula o total do pedido considerando descontos
function getOrderTotal(order) {
  if (!order.products || !order.products.length) return 0;
  return order.products.reduce((sum, p) => {
    const price = getUnitPrice(p, order)
    const qty = Number(p.quantity ?? 1) || 1;
    return sum + price * qty;
  }, 0);
}

// Corrige a data para timezone local
function formatDate(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  // Ajusta para timezone local
  return date.toLocaleString('pt-BR', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit'
  });
}

function emitStatusChange(order) {
  // Só envia status permitido
  const allowed = ['PENDING', 'PROCESSING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELED'];
  let status = String(order.status).toUpperCase().trim();
  if (!allowed.includes(status)) status = 'PENDING';
  emit('change-status', order.id, { status });
}

function getStatusClass(status) {
  switch (String(status).toUpperCase()) {
    case 'PENDING': return 'bg-warning text-dark';
    case 'PROCESSING': return 'bg-info';
    case 'CONFIRMED': return 'bg-info';
    case 'SHIPPED': return 'bg-primary';
    case 'DELIVERED': return 'bg-success';
    case 'CANCELED': return 'bg-danger';
    default: return 'bg-warning text-dark';
  }
}
function getStatusLabel(status) {
  switch (String(status).toUpperCase()) {
    case 'PENDING': return 'Pendente';
    case 'PROCESSING': return 'Processando';
    case 'CONFIRMED': return 'Confirmado';
    case 'SHIPPED': return 'Enviado';
    case 'DELIVERED': return 'Entregue';
    case 'CANCELED': return 'Cancelado';
    default: return 'Pendente';
  }
}

// Corrige endereço para não mostrar "undefined"
function formatAddress(address) {
  if (!address) return '-';
  const street = address.street ?? '';
  const number = address.number ?? '';
  const neighborhood = address.neighborhood ?? '';
  const city = address.city ?? '';
  const state = address.state ?? '';
  const zip = address.zip_code ?? address.zip ?? '';
  let parts = [];
  if (street) parts.push(street);
  if (number) parts.push(number);
  let line = parts.join(', ');
  let loc = [];
  if (neighborhood) loc.push(neighborhood);
  if (city) loc.push(city);
  if (state) loc.push(state);
  let locStr = loc.join(', ');
  let zipStr = zip ? ` (${zip})` : '';
  return `${line}${locStr ? ' - ' + locStr : ''}${zipStr}`;
}

// Corrige imagem do produto
function getProductImage(product) {
  if (product.image_url) return product.image_url
  if (product.image_path) {
    let base = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || ''
    let path = product.image_path.startsWith('/') ? product.image_path : '/' + product.image_path
    return base + path
  }
  return '/placeholder-product.png'
}
</script>
<style scoped>
/* ...copie os estilos da tabela da view OrderManagement.vue... */
.table-responsive {
  background: var(--admin-bg-secondary);
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.18);
  margin-bottom: 1.5rem;
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
  padding: 1rem 0.7rem;
}
.order-table td {
  background: transparent;
  color: #e8eaed;
  font-size: 0.97rem;
  padding: 1rem 0.7rem;
  border-bottom: 1px solid #232e47;
}
.order-table tbody tr {
  transition: background 0.18s;
}
.order-table tbody tr:hover {
  background: linear-gradient(90deg, #23233a 0%, #374151 100%);
  box-shadow: 0 2px 12px #00ffe122;
}
.badge {
  font-size: 0.92rem;
  font-weight: 600;
  padding: 0.35rem 1rem;
  border-radius: 12px;
  letter-spacing: 0.04em;
  box-shadow: 0 1px 4px #00000018;
  border: none;
}
.bg-success { background: linear-gradient(90deg,#43e97b 0%,#38f9d7 100%) !important; color: #fff !important; }
.bg-danger { background: linear-gradient(90deg,#ff6b6b 0%,#f44336 100%) !important; color: #fff !important; }
.bg-warning { background: linear-gradient(90deg,#f9d423 0%,#ff4e50 100%) !important; color: #222 !important; }
.bg-info { background: linear-gradient(90deg,#64b5f6 0%,#42a5f5 100%) !important; color: #fff !important; }
.bg-primary { background: linear-gradient(90deg,#667eea 0%,#764ba2 100%) !important; color: #fff !important; }
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
.form-select-sm {
  font-size: 0.95rem;
  padding: 0.25rem 0.7rem;
  border-radius: 8px;
  margin-top: 4px;
  background: #181e2a;
  color: #fff;
  border: 1px solid #374151;
}
.btn-outline-info, .btn-outline-primary {
  border-radius: 8px;
  font-weight: 600;
  padding: 0.35rem 0.8rem;
  font-size: 0.97rem;
  transition: background 0.18s, color 0.18s;
}
.btn-outline-info:hover {
  background: #64b5f6;
  color: #fff;
}
.btn-outline-primary:hover {
  background: #8f5fe8;
  color: #fff;
}
</style>

