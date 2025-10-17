<template>
  <section class="card border-0 shadow-sm orders-card modern-orders-card">
    <div class="card-body">
      <h2 class="h5 fw-bold text-blue mb-3">Meus Pedidos</h2>
      <div v-if="orders.length === 0" class="alert alert-dark py-2">Nenhum pedido encontrado.</div>
      <ul v-else class="list-group orders-list">
        <li v-for="order in orders" :key="order.id" class="list-group-item bg-orders border-0 shadow-sm rounded-3 mb-4 px-3 py-3 animate-fade modern-list-item">
          <div class="d-flex flex-wrap justify-content-between align-items-center mb-2 gap-2">
            <span class="text-orders">
              <strong>Pedido #{{ order.id }}</strong>
              <span :class="['badge', 'modern-badge', getStatusClass(order.status), 'ms-2']">
                {{ translateStatus(order.status) }}
              </span>
            </span>
            <span class="text-orders small">
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
                :src="getProductImage(product)"
                alt="Imagem produto"
                class="order-product-img"
              />
              <div class="flex-grow-1">
                <div class="fw-semibold text-orders">{{ product.name }}</div>
                <div class="text-orders small">
                  Qtd: <strong>{{ product.quantity ?? 1 }}</strong> &nbsp;|&nbsp;
                  Unitário: <strong>{{ formatPrice(product.unit_price ?? product.price) }}</strong>
                  &nbsp;|&nbsp;
                  Subtotal: <strong>{{ formatPrice((product.unit_price ?? product.price) * (product.quantity ?? 1)) }}</strong>
                </div>
              </div>
            </div>
          </div>
          <div class="d-flex justify-content-between align-items-center gap-3 mt-2">
            <span class="fw-bold text-orders fs-5">
              Total: {{ formatPrice(order.total_amount ?? order.total ?? getOrderTotal(order)) }}
            </span>
            <div class="d-flex gap-2">
              <button
                class="btn btn-outline-info btn-download-pdf"
                @click="downloadOrderPDF(order)"
                title="Baixar Nota Fiscal (PDF)"
              >
                <i class="bi bi-file-earmark-pdf"></i> Nota Fiscal
              </button>
              <button
                v-if="canCancel(order.status)"
                class="btn btn-outline-danger btn-cancel-order"
                @click="$emit('cancel', order.id)"
              >
                <i class="bi bi-x-circle"></i> Cancelar Pedido
              </button>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
import jsPDF from 'jspdf'
const props = defineProps({ orders: Array })
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

function getProductImage(product) {
  if (product.image_url) return product.image_url;
  if (product.image_path) {
    let base = API_BASE_URL.replace(/\/$/, '');
    let path = product.image_path.startsWith('/') ? product.image_path : '/' + product.image_path;
    return base + path;
  }
  return '/default-product.png';
}

function formatPrice(value) {
  if (value == null) return '-';
  return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
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

// Só permite cancelar se status for PENDING (Pendente)
function canCancel(status) {
  return (status || '').toUpperCase() === 'PENDING';
}

// Traduz status para PT-BR
function translateStatus(status) {
  switch ((status || '').toUpperCase()) {
    case 'PENDING': return 'Pendente';
    case 'PROCESSING': return 'Processando';
    case 'CANCELED': return 'Cancelado';
    case 'SHIPPED': return 'Enviado';
    case 'DELIVERED': return 'Entregue';
    default: return status;
  }
}

// Badge de status com cor tech
function getStatusClass(status) {
  switch ((status || '').toUpperCase()) {
    case 'PENDING': return 'bg-status-pending';
    case 'PROCESSING': return 'bg-status-processing';
    case 'CANCELED': return 'bg-status-canceled';
    case 'SHIPPED': return 'bg-status-shipped';
    case 'DELIVERED': return 'bg-status-delivered';
    default: return 'bg-secondary';
  }
}

function downloadOrderPDF(order) {
  const doc = new jsPDF()
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(18)
  doc.text('Nota Fiscal - Pedido #' + order.id, 15, 20)
  doc.setFontSize(12)
  doc.text('Data: ' + new Date(order.order_date).toLocaleDateString('pt-BR'), 15, 30)
  doc.text('Status: ' + translateStatus(order.status), 15, 38)
  doc.text('Total: ' + formatPrice(order.total_amount ?? order.total ?? getOrderTotal(order)), 15, 46)
  doc.text('Produtos:', 15, 56)
  let y = 64
  order.products?.forEach((p, idx) => {
    doc.text(
      `${idx + 1}. ${p.name} | Qtd: ${p.quantity ?? 1} | Unitário: ${formatPrice(p.unit_price ?? p.price)} | Subtotal: ${formatPrice((p.unit_price ?? p.price) * (p.quantity ?? 1))}`,
      15,
      y
    )
    y += 8
    if (y > 270) {
      doc.addPage()
      y = 20
    }
  })
  doc.save(`nota-fiscal-pedido-${order.id}.pdf`)
}
</script>

<style scoped>
.orders-card.modern-orders-card {
  border-radius: 18px;
  background: #f8f9fa;
  box-shadow: 0 8px 32px 0 #b8d8ff30;
  border: 1.5px solid #e5e7eb;
}
.bg-orders {
  background: #f3f4f8 !important;
}
.text-orders {
  color: #232e47 !important;
}
.modern-badge {
  font-size: 0.92rem;
  border-radius: 8px;
  letter-spacing: 0.5px;
  box-shadow: 0 1px 6px #b8d8ff20;
  border: none;
  font-weight: 600;
  padding: 0.32em 1em;
  color: #fff !important;
}
.bg-status-pending {
  background: linear-gradient(90deg,#f9d423 0%,#ff4e50 100%) !important;
}
.bg-status-processing, .bg-status-confirmed {
  background: linear-gradient(90deg,#64b5f6 0%,#42a5f5 100%) !important;
}
.bg-status-shipped {
  background: linear-gradient(90deg,#667eea 0%,#764ba2 100%) !important;
}
.bg-status-delivered {
  background: linear-gradient(90deg,#43e97b 0%,#38f9d7 100%) !important;
}
.bg-status-canceled, .bg-status-cancelled {
  background: linear-gradient(90deg,#ff6b6b 0%,#f44336 100%) !important;
}
.modern-list-item {
  transition: box-shadow 0.2s, background 0.2s;
  border-radius: 14px !important;
  background: #f3f4f8 !important;
}
.modern-list-item:hover {
  box-shadow: 0 4px 16px #399bff30;
  background: #eaf6ff !important;
}
.order-products-list {
  border-left: 2px solid #b8d8ff30;
  margin-left: 2px;
  padding-left: 12px;
}
.order-product-item {
  min-height: 54px;
  background: #eaf6ff;
  border-radius: 8px;
  padding: 7px 0;
}
.order-product-img {
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 8px;
  background: #fff;
  border: 1.5px solid #b8d8ff;
  box-shadow: 0 2px 8px #b8d8ff20;
}
.btn-cancel-order {
  font-size: 0.98rem;
  border-radius: 10px;
  padding: 7px 18px;
  font-weight: 600;
  border-width: 2px;
  background: #fff;
  color: #ff4e50;
  border-color: #ff4e50;
  transition: background 0.18s, color 0.18s, border 0.18s;
}
.btn-cancel-order:hover {
  background: #ff4e50;
  color: #fff;
  border-color: #ff4e50;
}
.btn-download-pdf {
  font-size: 0.98rem;
  border-radius: 10px;
  padding: 7px 18px;
  font-weight: 600;
  border-width: 2px;
  border-color: #399bff;
  color: #399bff;
  background: #fff;
  transition: background 0.18s, color 0.18s, border 0.18s;
}
.btn-download-pdf:hover {
  background: #399bff;
  color: #fff;
  border-color: #399bff;
}
@keyframes fadein {
  from { opacity: 0; transform: translateY(12px);}
  to { opacity: 1; transform: translateY(0);}
}
.animate-fade { animation: fadein 0.2s; }
</style>