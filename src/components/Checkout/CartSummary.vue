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
        <span>{{ formatPrice(Number(frete) || 0) }}</span>
      </div>
      <div v-if="appliedCoupon" class="d-flex justify-content-between align-items-center mb-2">
        <span class="fw-bold text-success">
          Cupom aplicado: {{ appliedCoupon.code }} ({{ appliedCoupon.discount_percentage }}%)
        </span>
        <span class="fw-bold text-success">-R$ {{ descontoCupom.toFixed(2) }}</span>
      </div>
      <div class="total-line total-final">
        <span>Total</span>
        <span>{{ formatPrice(total || 0) }}</span>
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
  const p = item.product || {};
  const img = p.image || p.image_path || p.imageUrl || p.image_url;
  if (img) {
    if (img.startsWith('http')) return img;
    const BASE_URL = import.meta.env.VITE_API_URL || '';
    if (img.startsWith('/')) {
      return BASE_URL + img;
    }
    return BASE_URL + '/' + img;
  }
  // Placeholder confiável
  return '/placeholder-product.png';
}
function onImgError(e) {
  e.target.src = 'https://placehold.co/60x60?text=Produto';
}
</script>

<style scoped>
.glassy-card {
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 8px 24px rgba(16,24,40,0.06);
  border: 1px solid #e6e9ef;
  padding: 1.6rem;
  color: #232e47;
  font-family: 'Inter', sans-serif;
  min-width: 260px;
  max-width: 430px;
  margin: 0 auto;
  transition: box-shadow 0.2s;
}
.glassy-card:focus-within, .glassy-card:hover {
  box-shadow: 0 12px 40px rgba(106,90,224,0.07);
  border-color: #e1d8fb;
}
.summary-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #4a90e2;
  margin-bottom: 1rem;
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
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 10px;
  background: #f5f7fb;
  border: 1px solid #eef2ff;
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
  color: #232e47;
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
  background: #f1f5fb;
  color: #4a90e2;
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
  box-shadow: 0 2px 8px rgba(74,144,226,0.06);
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
  font-size: 1.05rem;
  font-weight: 600;
  color: #4b5563;
  min-width: 22px;
  text-align: center;
}
.product-price {
  font-weight: 700;
  font-size: 1.05rem;
  color: #111827;
  min-width: 80px;
  text-align: right;
}
.divider {
  height: 1px;
  background: #e6e9ef;
  margin: 18px 0 14px 0;
  border-radius: 2px;
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
  color: #374151;
  font-weight: 600;
}
.total-line span:first-child {
  color: #6b7280;
  font-weight: 600;
}
.total-line span:last-child {
  font-weight: 700;
  color: #111827;
}
.total-final {
  font-size: 1.14rem;
  font-weight: 800;
  color: #0f172a;
  border-top: 1px solid #eef2ff;
  padding-top: 12px;
  margin-top: 8px;
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
