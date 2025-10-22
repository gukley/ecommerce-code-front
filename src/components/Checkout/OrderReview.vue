<template>
  <div class="order-review glass-card">
    <div class="review-header">
      <i class="bi bi-clipboard-check"></i>
      <h4>Confira seu pedido</h4>
    </div>

    <!-- Resumo do endereço -->
    <div v-if="endereco && endereco.id" class="order-address-summary">
      <div class="address-title"><i class="bi bi-geo-alt"></i> Endereço de entrega:</div>
      <div class="address-content">
        {{ endereco.street }}, {{ endereco.number }} - {{ endereco.city }}/{{ endereco.state }} - CEP: {{ endereco.zip }}
        <span v-if="endereco.country">({{ endereco.country }})</span>
      </div>
    </div>

    <!-- Resumo do pagamento -->
    <div v-if="metodoPagamento" class="order-payment-summary">
      <div class="payment-title"><i class="bi bi-credit-card"></i> Pagamento:</div>
      <div class="payment-content">
        {{ metodoPagamentoLabel }}
      </div>
    </div>

    <div class="products-list">
      <div class="product-item" v-for="item in cart" :key="item.id || item.product_id">
        <div class="product-info">
          <img v-if="item.product?.image" :src="item.product.image" class="product-thumb" alt="Imagem produto" />
          <div>
            <div class="product-name">{{ item.product?.name || 'Produto desconhecido' }}</div>
            <div class="product-quantity">Qtd: {{ item.quantity }}</div>
          </div>
        </div>
        <div class="product-price">
          {{ formatPrice((item.product?.price || 0) * item.quantity) }}
        </div>
      </div>
    </div>

    <div class="divider"></div>

    <div class="totals">
      <div class="total-line">
        <span>Subtotal:</span>
        <span>{{ formatPrice(subtotal) }}</span>
      </div>
      <div class="total-line">
        <span>Frete:</span>
        <span>{{ formatPrice(frete) }}</span>
      </div>
      <div v-if="appliedCoupon" class="d-flex justify-content-between align-items-center mb-2">
        <span class="fw-bold text-success">
          Cupom aplicado: {{ appliedCoupon.code }} ({{ appliedCoupon.discount_percentage }}%)
        </span>
        <span class="fw-bold text-success">-R$ {{ descontoCupom.toFixed(2) }}</span>
      </div>
      <div class="total-line total-final">
        <span>Total:</span>
        <span>{{ formatPrice(total) }}</span>
      </div>
    </div>

    <button
      v-if="!pedidoCriado"
      class="btn-confirm"
      @click="$emit('confirmarPedido')"
      :disabled="!endereco || !endereco.id"
      :title="!endereco || !endereco.id ? 'Selecione um endereço antes de confirmar' : ''"
    >
      <i class="bi bi-cart-check"></i>
      Confirmar Pedido
    </button>
    
    <div v-else class="pedido-criado-success">
      <div class="success-icon">
        <i class="bi bi-check-circle-fill"></i>
      </div>
      <h4>Pedido Criado com Sucesso!</h4>
      <p>Seu pedido foi processado e está sendo preparado.</p>
      <button
        class="btn-confirm"
        @click="$emit('confirmarPedido')"
      >
        <i class="bi bi-arrow-right"></i>
        Finalizar
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  cart: {
    type: Array,
    default: () => []
  },
  frete: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    default: 0
  },
  appliedCoupon: {
    type: Object,
    default: null
  },
  descontoCupom: {
    type: Number,
    default: 0
  },
  endereco: {
    type: Object,
    default: null
  },
  metodoPagamento: {
    type: String,
    default: ''
  },
  pedidoCriado: {
    type: Boolean,
    default: false
  }
});

const subtotal = computed(() =>
  props.cart.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0)
);

function formatPrice(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

const metodoPagamentoLabel = computed(() => {
  switch (props.metodoPagamento) {
    case 'card': return 'Cartão de Crédito';
    case 'boleto': return 'Boleto Bancário';
    case 'pix': return 'PIX';
    default: return props.metodoPagamento || '-';
  }
});
</script>

<style scoped>
.order-review {
  background: #fff;
  border-radius: 1.5rem;
  padding: 2.5rem;
  color: #232e47;
  border: 1.5px solid #e5e7eb;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
  font-family: 'Inter', sans-serif;
  max-width: 490px;
  margin: 0 auto;
  animation: fadeIn 0.5s cubic-bezier(.4,.2,.2,1);
}

.review-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 22px;
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
  background: linear-gradient(90deg, #f8fafc 0%, #f3f4fa 100%);
  border-radius: 1rem 1rem 0 0;
  margin: -2.5rem -2.5rem 22px -2.5rem;
}
.review-header i {
  font-size: 29px;
  color: #6a5ae0;
}
.review-header h4 {
  margin: 0;
  color: #4a90e2;
  font-size: 21px;
  font-weight: 700;
  letter-spacing: 0.03em;
}
.order-address-summary {
  background: #f0fdfa;
  border-radius: 10px;
  padding: 12px 16px;
  margin-bottom: 12px;
  color: #059669;
  font-size: 1rem;
  border: 1px solid #a7f3d0;
}
.address-title {
  font-weight: 700;
  font-size: 1rem;
  margin-bottom: 2px;
  color: #059669;
  display: flex;
  align-items: center;
  gap: 6px;
}
.address-content {
  color: #232e47;
  font-size: 0.98rem;
  margin-left: 2px;
}
.order-payment-summary {
  background: #f0f9ff;
  border-radius: 10px;
  padding: 10px 16px;
  margin-bottom: 12px;
  color: #0369a1;
  font-size: 1rem;
  border: 1px solid #bae6fd;
}
.payment-title {
  font-weight: 700;
  font-size: 1rem;
  margin-bottom: 2px;
  color: #0369a1;
  display: flex;
  align-items: center;
  gap: 6px;
}
.payment-content {
  color: #232e47;
  font-size: 0.98rem;
  margin-left: 2px;
}
.products-list {
  margin-bottom: 22px;
}
.product-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #e5e7eb;
  gap: 10px;
  transition: background 0.2s;
  background: #f9fafb;
  border-radius: 0.7rem;
  margin-bottom: 8px;
}
.product-item:last-child {
  border-bottom: none;
}
.product-info {
  display: flex;
  align-items: center;
  gap: 15px;
}
.product-thumb {
  width: 44px;
  height: 44px;
  object-fit: cover;
  border-radius: 10px;
  background: #f3f4fa;
  border: 1.5px solid #e5e7eb;
  box-shadow: 0 1px 5px rgba(106, 90, 224, 0.1);
}
.product-name {
  font-weight: 600;
  font-size: 16px;
  color: #232e47;
  margin-bottom: 2px;
  letter-spacing: 0.01em;
}
.product-quantity {
  font-size: 13px;
  color: #6a5ae0;
  font-weight: 500;
  margin-top: 1px;
}
.product-price {
  color: #6a5ae0;
  font-weight: 700;
  font-size: 18px;
  letter-spacing: 0.02em;
}
.divider {
  height: 1px;
  background: #e5e7eb;
  margin: 24px 0;
  border-radius: 2px;
}
.totals {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}
.total-line {
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  color: #232e47;
  font-weight: 500;
}
.total-line span:first-child {
  color: #4a90e2;
  font-weight: 600;
}
.total-line span:last-child {
  font-weight: 700;
  color: #232e47;
}
.total-final {
  font-size: 21px;
  font-weight: 800;
  color: #00c9a7;
  border-top: 1px solid #e5e7eb;
  padding: 16px 20px;
  margin: 10px -2.5rem -2.5rem -2.5rem;
  background: linear-gradient(90deg, #f0fdfa 0%, #f3f4fa 100%);
  border-radius: 0 0 1rem 1rem;
}
.total-final span:first-child {
  color: #232e47;
}
.total-final span:last-child {
  color: #00c9a7;
}
.btn-confirm {
  width: 100%;
  background: linear-gradient(90deg, #4a90e2 0%, #6a5ae0 100%);
  border: none;
  border-radius: 1rem;
  padding: 16px 0;
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(106, 90, 224, 0.3);
  margin-top: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 11px;
  transition: all 0.2s cubic-bezier(.4,.2,.2,1);
}
.btn-confirm[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
  filter: grayscale(0.5);
}
.btn-confirm:hover {
  background: linear-gradient(90deg, #6a5ae0 0%, #4a90e2 100%);
  transform: translateY(-1px) scale(1.04);
  box-shadow: 0 6px 22px rgba(106, 90, 224, 0.4);
}

.pedido-criado-success {
  text-align: center;
  padding: 2rem 1rem;
  background: #f0fdfa;
  border-radius: 12px;
  border: 1px solid #a7f3d0;
}

.success-icon {
  margin-bottom: 1rem;
}

.success-icon i {
  font-size: 3rem;
  color: #00c9a7;
  filter: drop-shadow(0 0 10px rgba(0, 201, 167, 0.3));
}

.pedido-criado-success h4 {
  color: #00c9a7;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.pedido-criado-success p {
  color: #232e47;
  font-size: 1rem;
  margin-bottom: 1.5rem;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@media (max-width: 768px) {
  .order-review {
    padding: 1.2rem 0.6rem;
    border-radius: 10px;
    max-width: 99vw;
  }
  .review-header h4 {
    font-size: 17px;
  }
  .product-thumb {
    width: 32px;
    height: 32px;
  }
  .product-name,
  .product-price,
  .total-line,
  .btn-confirm {
    font-size: 15px;
  }
  .total-final {
    font-size: 17px;
    padding-top: 10px;
  }
}
</style>