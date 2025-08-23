<template>
  <section class="card border-0 shadow-sm orders-card modern-orders-card">
    <div class="card-body">
      <h2 class="h5 fw-bold text-blue mb-3">Meus Pedidos</h2>
      <div v-if="orders.length === 0" class="alert alert-dark py-2">Nenhum pedido encontrado.</div>
      <ul v-else class="list-group orders-list">
        <li v-for="order in orders" :key="order.id" class="list-group-item bg-dark border-0 shadow-sm rounded-3 mb-4 px-3 py-3 animate-fade modern-list-item">
          <div class="d-flex flex-wrap justify-content-between align-items-center mb-2 gap-2">
            <span class="text-light">
              <strong>Pedido #{{ order.id }}</strong>
              <span class="badge bg-blue modern-badge ms-2">{{ order.status ?? 'Indefinido' }}</span>
            </span>
            <span class="text-light small">
              {{ new Date(order.order_date).toLocaleDateString('pt-BR') }}
            </span>
          </div>
          <div v-if="order.products && order.products.length" class="order-products-list mb-2">
            <div
              v-for="product in order.products"
              :key="product.product_id || product.id"
              class="order-product-item d-flex align-items-center gap-3 mb-2"
            >
              <img
                v-if="getProductImage(product)"
                :src="getProductImage(product)"
                alt="Imagem produto"
                class="order-product-img"
              />
              <div class="flex-grow-1">
                <div class="fw-semibold text-light">{{ product.name }}</div>
                <div class="text-light small">
                  Qtd: <strong>{{ product.quantity ?? 1 }}</strong> &nbsp;|&nbsp;
                  Unitário: <strong>{{ formatPrice(product.unit_price ?? product.price) }}</strong>
                  &nbsp;|&nbsp;
                  Subtotal: <strong>{{ formatPrice((product.unit_price ?? product.price) * (product.quantity ?? 1)) }}</strong>
                </div>
              </div>
            </div>
          </div>
          <div class="d-flex justify-content-between align-items-center gap-3 mt-2">
            <span class="fw-bold text-blue fs-5">
              Total: {{ formatPrice(order.total_amount ?? order.total ?? getOrderTotal(order)) }}
            </span>
            <button
              v-if="canCancel(order.status)"
              class="btn btn-outline-danger btn-cancel-order"
              @click="$emit('cancel', order.id)"
            >
              <i class="bi bi-x-circle"></i> Cancelar Pedido
            </button>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({ orders: Array })

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

function getProductImage(product) {
  // Aceita tanto image_url quanto image_path
  if (product.image_url) return product.image_url
  if (product.image_path) {
    // Garante que não haja barra dupla e que a base esteja correta
    let base = API_BASE_URL.replace(/\/$/, '')
    let path = product.image_path.startsWith('/') ? product.image_path : '/' + product.image_path
    return base + path
  }
  return '/default-product.png'
}

function formatPrice(value) {
  if (value == null) return '-'
  return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

// Calcula o total do pedido caso não venha do backend
function getOrderTotal(order) {
  if (!order.products || !order.products.length) return 0;
  return order.products.reduce((sum, p) => {
    const price = Number(p.unit_price ?? p.price) || 0;
    const qty = Number(p.quantity ?? 1) || 1;
    return sum + price * qty;
  }, 0);
}

function canCancel(status) {
  // Só permite cancelar se status for PENDING ou PROCESSING
  return ['PENDING', 'PROCESSING'].includes((status || '').toUpperCase());
}
</script>

<style scoped>
.orders-card.modern-orders-card {
  border-radius: 18px;
  background: rgba(24,30,42,0.85);
  box-shadow: 0 8px 32px 0 #232e4780;
  backdrop-filter: blur(8px);
  border: 1.5px solid #232e47;
}
.bg-dark { background: #181e2a !important; }
.bg-blue { background: #399bff !important; color:#fff !important; }
.text-blue { color: #50b8fe;}
.modern-badge {
  font-size: 0.92rem;
  border-radius: 8px;
  letter-spacing: 0.5px;
  box-shadow: 0 1px 6px #232e4720;
  border: 1.5px solid #232e47;
  background: rgba(80,184,254,0.08);
}
.modern-list-item {
  transition: box-shadow 0.2s, background 0.2s;
  border-radius: 14px !important;
}
.modern-list-item:hover {
  box-shadow: 0 4px 16px #399bff30;
  background: #232e47 !important;
}
.order-products-list {
  border-left: 2px solid #399bff30;
  margin-left: 2px;
  padding-left: 12px;
}
.order-product-item {
  min-height: 54px;
}
.order-product-img {
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 8px;
  background: #232e47;
  border: 1.5px solid #399bff40;
  box-shadow: 0 2px 8px #399bff20;
}
.btn-cancel-order {
  font-size: 0.98rem;
  border-radius: 10px;
  padding: 7px 18px;
  font-weight: 600;
  border-width: 2px;
  transition: background 0.18s, color 0.18s, border 0.18s;
}
.btn-cancel-order:hover {
  background: #ff6a6a;
  color: #fff;
  border-color: #ff6a6a;
}
@keyframes fadein {
  from { opacity: 0; transform: translateY(12px);}
  to { opacity: 1; transform: translateY(0);}
}
.animate-fade { animation: fadein 0.2s; }
</style>