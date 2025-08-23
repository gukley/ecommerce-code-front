<template>
  <div class="cart-summary-modern glassy-card">
    <h5 class="summary-title">Resumo do Pedido</h5>
    <div v-for="item in cart" :key="item.product?.id" class="cart-item-modern">
      <img
        :src="getProductImage(item)"
        class="product-img"
        alt="Imagem produto"
        @error="onImgError"
      />
      <div class="item-info">
        <div class="product-name">{{ item.product?.name || 'Produto' }}</div>
        <div class="quantity-controls">
          <button
            class="qty-btn"
            @click="$emit('alterarQuantidade', { productId: item.product?.id, delta: -1 })"
            :disabled="item.quantity <= 1"
            aria-label="Diminuir quantidade"
          >-</button>
          <span class="qty">{{ item.quantity }}</span>
          <button
            class="qty-btn"
            @click="$emit('alterarQuantidade', { productId: item.product?.id, delta: 1 })"
            aria-label="Aumentar quantidade"
          >+</button>
        </div>
      </div>
      <div class="product-price">
        {{ formatPrice((item.product?.price || 0) * item.quantity) }}
      </div>
    </div>
    <div class="divider"></div>
    <div class="totals-modern">
      <div class="total-line">
        <span>Subtotal</span>
        <span>{{ formatPrice(subtotal) }}</span>
      </div>
      <div class="total-line">
        <span>Frete</span>
        <span>{{ formatPrice(frete) }}</span>
      </div>
      <div v-if="appliedCoupon" class="d-flex justify-content-between align-items-center mb-2">
        <span class="fw-bold text-success">
          Cupom aplicado: {{ appliedCoupon.code }} ({{ appliedCoupon.discount_percentage }}%)
        </span>
        <span class="fw-bold text-success">-R$ {{ descontoCupom.toFixed(2) }}</span>
      </div>
      <div class="total-line total-final">
        <span>Total</span>
        <span>{{ formatPrice(total) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
const props = defineProps({
  cart: Array,
  frete: Number,
  total: Number,
  descontoCupom: {
    type: Number,
    default: 0
  },
  appliedCoupon: {
    type: Object,
    default: null
  }
});
const subtotal = computed(() =>
  props.cart.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0)
);
function formatPrice(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}
function getProductImage(item) {
  // Tenta carregar a imagem do produto, senão mostra placeholder válido
  if (item.product?.image) {
    if (item.product.image.startsWith('http')) return item.product.image;
    if (item.product.image.startsWith('/')) {
      return import.meta.env.VITE_API_BASE_URL
        ? import.meta.env.VITE_API_BASE_URL + item.product.image
        : item.product.image;
    }
    return item.product.image;
  }
  // Novo placeholder confiável:
  return 'https://placehold.co/60x60?text=Produto';
}
function onImgError(e) {
  e.target.src = 'https://placehold.co/60x60?text=Produto';
}
</script>

<style scoped>
.glassy-card {
  background: rgba(24, 30, 42, 0.92);
  border-radius: 1.5rem;
  box-shadow: 0 8px 32px 0 #232e4780;
  border: 1.5px solid #232e47;
  backdrop-filter: blur(8px);
  padding: 2.2rem 2rem 2rem 2rem;
  color: #fff;
  font-family: 'Inter', sans-serif;
  min-width: 260px;
  max-width: 430px;
  margin: 0 auto;
  transition: box-shadow 0.2s;
}
.glassy-card:focus-within, .glassy-card:hover {
  box-shadow: 0 12px 40px #399bff40;
  border-color: #399bff;
}
.summary-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #00ffe1;
  margin-bottom: 1.5rem;
  letter-spacing: 0.01em;
  text-align: left;
}
.cart-item-modern {
  display: flex;
  align-items: center;
  gap: 1.1rem;
  padding: 1.1rem 0;
  border-bottom: 1px solid rgba(143,95,232,0.09);
  transition: background 0.2s;
}
.cart-item-modern:last-child {
  border-bottom: none;
}
.product-img {
  width: 54px;
  height: 54px;
  object-fit: cover;
  border-radius: 10px;
  background: #23233a;
  border: 1.5px solid #8f5fe8;
  box-shadow: 0 1px 5px rgba(0,255,225,0.06);
}
.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
.product-name {
  font-weight: 600;
  font-size: 1rem;
  color: #fff;
  margin-bottom: 2px;
  letter-spacing: 0.01em;
}
.quantity-controls {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-top: 2px;
}
.qty-btn {
  background: #232e47;
  color: #00ffe1;
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s, color 0.2s, box-shadow 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px #399bff10;
  outline: none;
}
.qty-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.qty-btn:hover:not(:disabled), .qty-btn:focus-visible:not(:disabled) {
  background: #00ffe1;
  color: #232e47;
  box-shadow: 0 0 0 2px #00ffe1;
}
.qty {
  font-size: 1.1rem;
  font-weight: 600;
  color: #8fd6fb;
  min-width: 22px;
  text-align: center;
}
.product-price {
  font-weight: 700;
  font-size: 1.1rem;
  color: #8f5fe8;
  min-width: 80px;
  text-align: right;
}
.divider {
  height: 1.5px;
  background: linear-gradient(90deg, #23233a 0%, #8f5fe8 100%);
  margin: 24px 0 18px 0;
  border-radius: 2px;
  opacity: 0.6;
}
.totals-modern {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.total-line {
  display: flex;
  justify-content: space-between;
  font-size: 1rem;
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
  font-size: 1.18rem;
  font-weight: 800;
  color: #00ffe1;
  border-top: 1.5px solid #8f5fe8;
  padding-top: 12px;
  margin-top: 6px;
  text-shadow: 0 2px 10px #00ffe1;
  letter-spacing: 0.01em;
}
@media (max-width: 991px) {
  .glassy-card {
    max-width: 100vw;
    padding: 1.2rem 0.7rem;
  }
}
@media (max-width: 480px) {
  .glassy-card {
    padding: 0.7rem 0.2rem;
    min-width: 0;
  }
  .summary-title {
    font-size: 1.1rem;
  }
  .product-img {
    width: 38px;
    height: 38px;
  }
  .product-name,
  .product-price,
  .total-line,
  .total-final {
    font-size: 0.98rem;
  }
}
</style>
