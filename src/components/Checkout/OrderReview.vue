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
  background: #1e1e2d;
  border-radius: 16px;
  padding: 2.5rem;
  color: #fff;
  border: 1.5px solid rgba(0,255,225,0.09);
  box-shadow: 0 12px 40px rgba(0,255,225,0.08);
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
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(0,255,225,0.07);
}
.review-header i {
  font-size: 29px;
  color: #00ffe1;
}
.review-header h4 {
  margin: 0;
  color: #fff;
  font-size: 21px;
  font-weight: 700;
  background: linear-gradient(120deg, #15fbe3 0%, #8f5fe8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  letter-spacing: 0.03em;
}
.order-address-summary {
  background: rgba(0,255,225,0.06);
  border-radius: 10px;
  padding: 12px 16px;
  margin-bottom: 12px;
  color: #00ffe1;
  font-size: 1rem;
}
.address-title {
  font-weight: 700;
  font-size: 1rem;
  margin-bottom: 2px;
  color: #00ffe1;
  display: flex;
  align-items: center;
  gap: 6px;
}
.address-content {
  color: #fff;
  font-size: 0.98rem;
  margin-left: 2px;
}
.order-payment-summary {
  background: rgba(143,95,232,0.08);
  border-radius: 10px;
  padding: 10px 16px;
  margin-bottom: 12px;
  color: #8f5fe8;
  font-size: 1rem;
}
.payment-title {
  font-weight: 700;
  font-size: 1rem;
  margin-bottom: 2px;
  color: #8f5fe8;
  display: flex;
  align-items: center;
  gap: 6px;
}
.payment-content {
  color: #fff;
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
  padding: 15px 0;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  gap: 10px;
  transition: background 0.2s;
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
  background: #23233a;
  border: 1.5px solid #8f5fe8;
  box-shadow: 0 1px 5px rgba(0,255,225,0.06);
}
.product-name {
  font-weight: 600;
  font-size: 16px;
  color: #fff;
  margin-bottom: 2px;
  letter-spacing: 0.01em;
}
.product-quantity {
  font-size: 13px;
  color: #8fd6fb;
  font-weight: 500;
  margin-top: 1px;
}
.product-price {
  color: #00ffe1;
  font-weight: 700;
  font-size: 18px;
  letter-spacing: 0.02em;
}
.divider {
  height: 1.5px;
  background: linear-gradient(90deg, #23233a 0%, #8f5fe8 100%);
  margin: 24px 0;
  border-radius: 2px;
  opacity: 0.6;
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
  color: #fff;
  font-weight: 500;
}
.total-line span:first-child {
  color: #8fd6fb;
  font-weight: 600;
}
.total-line span:last-child {
  font-weight: 700;
}
.total-final {
  font-size: 21px;
  font-weight: 800;
  color: #fff;
  border-top: 1.5px solid #8f5fe8;
  padding-top: 18px;
  margin-top: 10px;
}
.total-final span:first-child {
  color: #00ffe1;
}
.total-final span:last-child {
  color: #00ffe1;
  text-shadow: 0 2px 10px #00ffe1;
}
.btn-confirm {
  width: 100%;
  background: linear-gradient(145deg, #00ffe1 0%, #8f5fe8 100%);
  border: none;
  border-radius: 50px;
  padding: 16px 0;
  font-size: 18px;
  font-weight: 700;
  color: #181828;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(0,255,225,0.13);
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
  background: linear-gradient(145deg, #8f5fe8 0%, #00ffe1 100%);
  transform: translateY(-1px) scale(1.04);
  box-shadow: 0 6px 22px rgba(0,255,225,0.19);
}

.pedido-criado-success {
  text-align: center;
  padding: 2rem 1rem;
  background: rgba(0,255,225,0.05);
  border-radius: 12px;
  border: 1px solid rgba(0,255,225,0.2);
}

.success-icon {
  margin-bottom: 1rem;
}

.success-icon i {
  font-size: 3rem;
  color: #00ffe1;
  filter: drop-shadow(0 0 10px #00ffe1);
}

.pedido-criado-success h4 {
  color: #00ffe1;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.pedido-criado-success p {
  color: #8fd6fb;
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