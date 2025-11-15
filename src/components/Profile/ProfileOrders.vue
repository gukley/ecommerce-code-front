<script setup>
import jsPDF from 'jspdf'
import { ref } from 'vue'
import axios from 'axios'

const props = defineProps({ orders: Array })
const API_BASE_URL = import.meta.env.VITE_API_URL || ''
const selectedOrder = ref(null)

function getProductImage(product) {
  if (product.image_url) return product.image_url
  if (product.image_path) {
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

function getOrderTotal(order) {
  if (!order.products || !order.products.length) return 0
  return order.products.reduce((sum, p) => {
    const price = Number(p.unit_price ?? p.price) || 0
    const qty = Number(p.quantity ?? 1) || 1
    return sum + price * qty
  }, 0)
}

function canCancel(status) {
  return (status || '').toUpperCase() === 'PENDING'
}

// 🔹 Corrigido: apenas 4 status válidos
function translateStatus(status) {
  switch ((status || '').toUpperCase()) {
    case 'PENDING': return 'Pendente'
    case 'PROCESSING': return 'Processando'
    case 'SHIPPED': return 'Enviado'
    case 'CANCELLED': return 'Cancelado'
    default: return status
  }
}

// 🔹 Badge tech com base nos 4 status
function getStatusClass(status) {
  switch ((status || '').toUpperCase()) {
    case 'PENDING': return 'bg-status-pending'
    case 'PROCESSING': return 'bg-status-processing'
    case 'SHIPPED': return 'bg-status-shipped'
    case 'CANCELLED': return 'bg-status-canceled'
    default: return 'bg-secondary'
  }
}

// 🔹 Gera nota fiscal em PDF
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

// 🔹 Abre modal e busca detalhes do pedido, se necessário
async function openOrderDetails(order) {
  selectedOrder.value = order
  if (!order.address) {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/orders/${order.id}`)
      selectedOrder.value = { ...order, ...data }
    } catch (error) {
      console.error('Erro ao buscar detalhes do pedido:', error)
    }
  }
}

function closeOrderDetails() {
  selectedOrder.value = null
}
</script>

<template>
  <section class="card border-0 shadow-sm orders-card modern-orders-card">
    <div class="card-body">
      <h2 class="h5 fw-bold text-blue mb-3">Meus Pedidos</h2>

      <div v-if="orders.length === 0" class="alert alert-dark py-2">
        Nenhum pedido encontrado.
      </div>

      <ul v-else class="list-group orders-list">
        <li
          v-for="order in orders"
          :key="order.id"
          class="list-group-item bg-orders border-0 shadow-sm rounded-3 mb-4 px-3 py-3 animate-fade modern-list-item"
        >
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
              <img :src="getProductImage(product)" alt="Imagem produto" class="order-product-img" />
              <div class="flex-grow-1">
                <div class="fw-semibold text-orders">{{ product.name }}</div>
                <div class="text-orders small">
                  Qtd: <strong>{{ product.quantity ?? 1 }}</strong> &nbsp;|&nbsp;
                  Unitário: <strong>{{ formatPrice(product.unit_price ?? product.price) }}</strong> &nbsp;|&nbsp;
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
                class="btn btn-outline-info"
                @click="openOrderDetails(order)"
              >
                <i class="bi bi-eye"></i> Ver Detalhes
              </button>

              <button
                v-if="canCancel(order.status)"
                class="btn btn-outline-danger"
                @click="$emit('cancel', order.id)"
              >
                <i class="bi bi-x-circle"></i> Cancelar Pedido
              </button>
            </div>
          </div>
        </li>
      </ul>

      <!-- Modal Detalhes -->
      <div v-if="selectedOrder" class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5)">
        <div class="modal-dialog modal-lg modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Detalhes do Pedido #{{ selectedOrder.id }}</h5>
              <button type="button" class="btn-close" @click="closeOrderDetails"></button>
            </div>
            <div class="modal-body">
              <p><strong>Data do Pedido:</strong> {{ new Date(selectedOrder.order_date).toLocaleDateString('pt-BR') }}</p>
              <p><strong>Status:</strong> {{ translateStatus(selectedOrder.status) }}</p>
              <p><strong>Total:</strong> {{ formatPrice(selectedOrder.total_amount ?? selectedOrder.total ?? getOrderTotal(selectedOrder)) }}</p>

              <h6 class="mt-3">Endereço de Entrega:</h6>
              <p v-if="selectedOrder.address">
                <strong>Rua:</strong> {{ selectedOrder.address.street }}<br />
                <strong>Número:</strong> {{ selectedOrder.address.number }}<br />
                <strong>Complemento:</strong> {{ selectedOrder.address.complement || '-' }}<br />
                <strong>Bairro:</strong> {{ selectedOrder.address.neighborhood }}<br />
                <strong>Cidade:</strong> {{ selectedOrder.address.city }} - {{ selectedOrder.address.state }}<br />
                <strong>CEP:</strong> {{ selectedOrder.address.zip_code }}
              </p>
              <p v-else class="text-muted">Endereço não disponível.</p>

              <h6 class="mt-3">Produtos:</h6>
              <ul>
                <li
                  v-for="product in selectedOrder.products"
                  :key="product.product_id || product.id"
                >
                  {{ product.name }} - Qtd: {{ product.quantity ?? 1 }} -
                  Unitário: {{ formatPrice(product.unit_price ?? product.price) }} -
                  Subtotal: {{ formatPrice((product.unit_price ?? product.price) * (product.quantity ?? 1)) }}
                </li>
              </ul>
            </div>
            <div class="modal-footer">
              <button class="btn btn-success" @click="downloadOrderPDF(selectedOrder)">
                <i class="bi bi-file-earmark-pdf"></i> Baixar Nota Fiscal
              </button>
              <button class="btn btn-secondary" @click="closeOrderDetails">Fechar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>


<style scoped>
.orders-card {
  border-radius: 12px;
  background: #ffffff; /* Fundo branco */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); /* Sombra leve */
  border: 1.5px solid #e0e7ff; /* Borda azul clara */
  padding: 1.5rem;
}

.orders-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.list-group-item {
  background: #f8fafc; /* Fundo claro */
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05); /* Sombra leve */
  padding: 1rem;
  transition: all 0.2s ease-in-out;
}

.list-group-item:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1); /* Sombra mais forte */
  transform: translateY(-4px);
}

.order-product-img {
  width: 60px; /* Largura fixa */
  height: 60px; /* Altura fixa */
  object-fit: cover; /* Mantém a proporção */
  border-radius: 8px; /* Bordas arredondadas */
  background: #ffffff; /* Fundo branco */
  border: 1.5px solid #e0e7ff; /* Borda azul clara */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05); /* Sombra leve */
}

.badge {
  font-size: 0.9rem;
  font-weight: 600;
  border-radius: 8px;
  padding: 0.3rem 0.8rem;
}

.bg-status-pending {
  background: linear-gradient(90deg, #f9d423, #ff4e50); /* Gradiente laranja → amarelo */
  color: #fff;
}

.bg-status-canceled {
  background: linear-gradient(90deg, #ff6b6b, #f44336); /* Gradiente cinza → vermelho */
  color: #fff;
}

.bg-status-delivered {
  background: linear-gradient(90deg, #43e97b, #38f9d7); /* Gradiente verde suave */
  color: #fff;
}

.btn-outline-info {
  border-color: #007bff;
  color: #007bff;
}

.btn-outline-info:hover {
  background: #007bff;
  color: #fff;
}

.btn-outline-danger {
  border-color: #dc3545;
  color: #dc3545;
}

.btn-outline-danger:hover {
  background: #dc3545;
  color: #fff;
}
@keyframes fadein {
  from { opacity: 0; transform: translateY(12px);}
  to { opacity: 1; transform: translateY(0);}
}
.animate-fade { animation: fadein 0.2s; }

.modal {
  display: none;
  position: fixed;
  z-index: 1050;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  outline: 0;
}

.modal.show {
  display: block;
}

.modal-dialog {
  max-width: 800px;
  margin: 1.75rem auto;
}

.modal-content {
  background-color: #fff;
  border: 1px solid #dee2e6;
  border-radius: 0.3rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
}

.modal-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 500;
}

.btn-close {
  padding: 0.5rem 1rem;
  background: transparent;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
}

.modal-body {
  padding: 1rem;
}

.modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0.75rem;
  border-top: 1px solid #dee2e6;
}

/* Ajustes para dispositivos menores */
@media (max-width: 991px) {
  .orders-card {
    padding: 1rem;
  }

  .list-group-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .order-product-img {
    width: 50px;
    height: 50px;
  }

  .btn-details-order,
  .btn-cancel-order {
    font-size: 0.9rem;
    padding: 0.4rem 0.8rem;
  }
}

@media (max-width: 600px) {
  .orders-card {
    padding: 0.8rem;
  }

  .list-group-item {
    padding: 0.8rem;
  }

  .order-product-img {
    width: 40px;
    height: 40px;
  }

  .btn-details-order,
  .btn-cancel-order {
    font-size: 0.8rem;
    padding: 0.3rem 0.6rem;
  }
}
</style>