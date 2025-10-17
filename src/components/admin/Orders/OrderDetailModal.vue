<template>
  <div class="modal fade show d-block" tabindex="-1" style="background:rgba(0,0,0,0.5);">
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content order-detail-modal">
        <div class="modal-header">
          <h5 class="modal-title">Detalhes do Pedido #{{ order.id }}</h5>
          <button type="button" class="btn-close" @click="$emit('close')"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <strong>Status:</strong>
            <span :class="['badge', getStatusClass(order.status)]">{{ getStatusLabel(order.status) }}</span>
            <select v-model="selectedStatus" class="form-select mt-2" style="max-width:180px;">
              <option value="PENDING">Pendente</option>
              <option value="PROCESSING">Processando</option>
              <option value="CONFIRMED">Confirmado</option>
              <option value="SHIPPED">Enviado</option>
              <option value="DELIVERED">Entregue</option>
              <option value="CANCELED">Cancelado</option>
            </select>
            <button class="btn btn-sm btn-success mt-2 ms-2" @click="saveStatus" :disabled="selectedStatus === order.status">
              Salvar
            </button>
          </div>
          <div class="mb-3">
            <strong>Cliente:</strong>
            <span>{{ order.user?.name || '-' }}</span>
          </div>
          <div class="mb-3">
            <strong>Data do Pedido:</strong>
            <span>{{ formatDate(order.order_date) }}</span>
          </div>
          <div class="mb-3">
            <strong>Endereço:</strong>
            <span>{{ addresses[order.address_id] ? formatAddress(addresses[order.address_id]) : '-' }}</span>
          </div>
          <div class="mb-3">
            <strong>Produtos:</strong>
            <div class="order-products-list">
              <div
                v-for="item in order.items"
                :key="item.id"
                class="order-product-item"
              >
                <img
                  :src="getProductImage(item)"
                  alt="Imagem do produto"
                  class="order-product-img"
                />
                <div class="order-product-info">
                  <div class="order-product-name">{{ item.product?.name || 'Produto' }}</div>
                  <div class="order-product-qty-price">
                    <span class="badge bg-secondary me-2">Qtd: {{ item.quantity }}</span>
                    <span class="text-light">R$ {{ Number(item.unit_price).toFixed(2) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="mb-3">
            <strong>Total:</strong>
            <span class="fw-bold text-success">R$ {{ order.total }}</span>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="$emit('close')">Fechar</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, watch } from 'vue'
const props = defineProps({
  order: Object,
  addresses: Object
})
const emit = defineEmits(['close', 'change-status'])

const selectedStatus = ref(props.order?.status || 'PENDING')
watch(() => props.order?.status, (val) => {
  selectedStatus.value = val
})

function saveStatus() {
  emit('change-status', props.order.id, { status: selectedStatus.value })
}

function formatDate(dateString) {
  if (!dateString) return '-';
  const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false };
  const date = new Date(dateString);
  return date.toLocaleString('pt-BR', options);
}
function getStatusClass(status) {
  switch (status) {
    case 'PENDING': return 'bg-warning text-dark';
    case 'PROCESSING': return 'bg-info';
    case 'CONFIRMED': return 'bg-info';
    case 'SHIPPED': return 'bg-primary';
    case 'DELIVERED': return 'bg-success';
    case 'CANCELED': return 'bg-danger';
    default: return '';
  }
}
function getStatusLabel(status) {
  switch (status) {
    case 'PENDING': return 'Pendente';
    case 'PROCESSING': return 'Processando';
    case 'CONFIRMED': return 'Confirmado';
    case 'SHIPPED': return 'Enviado';
    case 'DELIVERED': return 'Entregue';
    case 'CANCELED': return 'Cancelado';
    default: return 'Desconhecido';
  }
}
function formatAddress(address) {
  if (!address) return '-';
  return `${address.street}, ${address.number} - ${address.bairro}, ${address.city} - ${address.state}, ${address.zip_code}`;
}

// Utilitário para imagem do produto
function getProductImage(item) {
  // Use VITE_API_URL para garantir compatibilidade com seu .env
  if (item.product && item.product.image_path) {
    let base = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || '';
    let path = item.product.image_path.startsWith('/') ? item.product.image_path : '/' + item.product.image_path;
    return base + path;
  }
  if (item.product && item.product.image) return item.product.image;
  if (item.product && item.product.image_url) return item.product.image_url;
  if (item.image) return item.image;
  if (item.image_url) return item.image_url;
  return 'https://placehold.co/60x60?text=Produto';
}
</script>

<style scoped>
/* ...estilos do modal, copie da view original... */
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
</style>
