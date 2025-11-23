<template>
  <div class="cart-page theme-page">
    <NavBar />
    <div class="cart-header">
      <div class="container">
        <div class="cart-title-section">
          <div class="cart-icon-wrapper">
            <i class="bi bi-cart-check-fill"></i>
          </div>
          <h1 class="cart-title">Meu Carrinho</h1>
          <p class="cart-subtitle" v-if="items.length > 0">
            {{ items.length }} {{ items.length === 1 ? 'item selecionado' : 'itens selecionados' }}
          </p>
        </div>
      </div>
    </div>

    <div class="container cart-container">
      <!-- Carrinho vazio -->
      <div v-if="items.length === 0" class="empty-cart-section">
        <div class="empty-cart-illustration">
          <i class="bi bi-cart-x"></i>
        </div>
        <h2 class="empty-cart-title">Seu carrinho está vazio 🤔</h2>
        <p class="empty-cart-text">Adicione produtos incríveis para continuar suas compras!</p>
        <button class="btn btn-premium-action mt-4" @click="goToHome">
          <i class="bi bi-shop me-2"></i>
          Ir às Compras
        </button>
      </div>

      <!-- Carrinho com itens -->
      <div v-else class="row g-4">
        <div class="col-lg-8">
          <div class="cart-items-card">
            <div class="card-header-custom">
              <div class="header-icon">
                <i class="bi bi-bag-check"></i>
              </div>
              <div>
                <h5 class="header-title">Itens do Carrinho</h5>
                <p class="header-subtitle">{{ items.length }} produtos selecionados</p>
              </div>
              <button class="btn-clear-all" @click="clearCart">
                <i class="bi bi-trash me-1"></i>
                Limpar
              </button>
            </div>

            <div class="cart-items-list">
              <div v-for="item in items" :key="item.product?.id || item.product_id" class="cart-item-card">
                <div class="item-image-wrapper">
                  <img :src="getImageUrl(item.product)" class="item-image" v-if="item.product" />
                  <span class="item-quantity-badge">{{ item.quantity }}x</span>
                </div>

                <div class="item-details">
                  <h6 class="item-name">{{ item.product?.name || 'Produto não encontrado' }}</h6>
                  <p class="item-category">
                    <i class="bi bi-tag me-1"></i>
                    {{ item.product?.category?.name || 'Não especificada' }}
                  </p>
                  <div class="item-pricing">
                    <span class="unit-price">R$ {{ Number(item.product.price).toFixed(2) }} cada</span>
                    <span class="total-price">R$ {{ (Number(item.product.price) * item.quantity).toFixed(2) }}</span>
                  </div>
                </div>

                <div class="item-actions">
                  <div class="quantity-controls">
                    <button class="btn-qty-control" @click="updateItem(item.product.id, item.quantity - 1)" :disabled="item.quantity <= 1">
                      <i class="bi bi-dash"></i>
                    </button>
                    <span class="quantity-display">{{ item.quantity }}</span>
                    <button class="btn-qty-control" @click="updateItem(item.product.id, item.quantity + 1)">
                      <i class="bi bi-plus"></i>
                    </button>
                  </div>
                  <button class="btn-remove-item" @click="removeItem(item.product.id)">
                    <i class="bi bi-x-lg"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="cart-summary-card">
            <div class="summary-header-gradient">
              <i class="bi bi-receipt summary-icon"></i>
              <h5 class="summary-title">Resumo do Pedido</h5>
            </div>

            <div class="summary-content">
              <div class="summary-item">
                <span class="summary-label">
                  <i class="bi bi-box-seam me-2"></i>
                  Subtotal ({{ items.length }} {{ items.length === 1 ? 'item' : 'itens' }})
                </span>
                <span class="summary-value">R$ {{ totalPrice.toFixed(2) }}</span>
              </div>

              <div class="summary-item success-item">
                <span class="summary-label">
                  <i class="bi bi-tag me-2"></i>
                  Cupom de Desconto
                </span>
                <span class="summary-value">{{ couponDiscountValue }}</span>
              </div>

              <div class="summary-item info-item">
                <span class="summary-label">
                  <i class="bi bi-truck me-2"></i>
                  Frete
                </span>
                <span class="summary-value">{{ shippingValue }}</span>
              </div>

              <div class="summary-divider"></div>

              <div class="summary-total">
                <span class="total-label">Total a Pagar</span>
                <span class="total-value">R$ {{ totalWithDiscount }}</span>
              </div>

              <button class="btn-premium-action w-100 mb-3" @click="goToCheckout" :disabled="items.length === 0">
                <i class="bi bi-credit-card me-2"></i>
                Finalizar Compra
              </button>

              <button class="btn-ghost-outline w-100" @click="goToHome">
                <i class="bi bi-arrow-left me-2"></i>
                Continuar Comprando
              </button>

              <div class="trust-badges">
                <div class="trust-item">
                  <i class="bi bi-shield-check"></i>
                  <span>Compra Segura</span>
                </div>
                <div class="trust-item">
                  <i class="bi bi-truck"></i>
                  <span>Entrega Rápida</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watchEffect } from 'vue'
import { useCartStore } from '@stores/cartStore'
import { useCouponStore } from '@/stores/couponStore'
import { useRouter } from 'vue-router'
import NavBar from '@/components/home/NavBar.vue'

const cart = useCartStore()
const couponStore = useCouponStore()
const router = useRouter()
const { detailedItems, loading } = cart

// Torna os itens do carrinho reativos sempre
const items = ref([])
watchEffect(() => {
  items.value = cart.detailedItems
})

// Atualiza o carrinho após cada ação
const updateItem = async (productId, quantity) => {
  await cart.updateItemQuantity(productId, quantity)
  items.value = cart.detailedItems
}
const removeItem = async (productId) => {
  await cart.removeItem(productId)
  items.value = cart.detailedItems
}
const clearCart = async () => {
  await cart.clearCart()
  items.value = cart.detailedItems
}
const goToCheckout = () => router.push('/checkout')
const goToHome = () => router.push('/')

const BASE_URL = import.meta.env.VITE_API_URL
const getImageUrl = (product) =>
  product?.image_path
    ? BASE_URL + (product.image_path.startsWith('/') ? '' : '/') + product.image_path
    : '/placeholder-product.png'

// Cupom dinâmico
const couponCode = ref('')
const couponError = ref('')
const couponSuccess = ref('')
const appliedCoupon = ref(null)
const couponDiscount = ref(0)

async function applyCoupon() {
  couponError.value = ''
  couponSuccess.value = ''
  couponDiscount.value = 0
  appliedCoupon.value = null

  const code = couponCode.value.trim().toUpperCase()
  if (!code) {
    couponError.value = 'Digite o código do cupom.'
    return
  }

  // Busca o cupom na lista carregada
  let coupon = couponStore.coupons.find(c => c.code === code)

  // Se não estiver carregado, tente carregar todos os cupons antes de buscar
  if (!coupon) {
    await couponStore.fetchAllCoupons()
    coupon = couponStore.coupons.find(c => c.code === code)
  }

  // Validação do cupom
  if (!coupon) {
    couponError.value = 'Cupom inválido ou não cadastrado.'
    return
  }
  const now = new Date()
  if (coupon.end_date && new Date(coupon.end_date) < now) {
    couponError.value = 'Cupom expirado.'
    return
  }
  if (coupon.discount_percentage <= 0) {
    couponError.value = 'Cupom sem desconto.'
    return
  }

  appliedCoupon.value = coupon
  couponDiscount.value = coupon.discount_percentage / 100
  couponSuccess.value = `Cupom "${coupon.code}" aplicado! Você ganhou ${coupon.discount_percentage}% de desconto.`
  // Salva o cupom aplicado na store para que o checkout possa ler
  try {
    couponStore.setAppliedCoupon(coupon)
  } catch (e) {
    // Em caso de store antiga ou ausência do método, só ignore
    console.warn('Não foi possível definir cupom aplicado na store', e)
  }
}

// Update totalPrice and related computed properties reactively
const totalPrice = computed(() =>
  items.value.reduce((sum, item) => {
    if (item.product) {
      return sum + item.quantity * item.product.price;
    }
    return sum;
  }, 0)
);

const couponDiscountValue = computed(() =>
  couponDiscount.value > 0 ? '-' + (totalPrice.value * couponDiscount.value).toFixed(2) : '0,00'
);

const totalWithDiscount = computed(() =>
  couponDiscount.value > 0
    ? (totalPrice.value * (1 - couponDiscount.value)).toFixed(2)
    : totalPrice.value.toFixed(2)
)

// Frete: o cálculo do CEP/prazo fica no Checkout. Aqui mantemos um valor padrão para exibição.
const shippingValue = ref('0,00')
</script>

<style scoped>
/* Fundo geral branco */
.cart-page {
  min-height: 100vh;
  background: #fff;
  font-family: 'Inter', 'Poppins', Arial, sans-serif;
  transition: background-color var(--transition-normal);
}

/* Header */
.cart-header {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%);
  padding: 3rem 0 2rem 0;
  margin-bottom: 2.5rem;
  box-shadow: 0 4px 20px rgba(79, 70, 229, 0.08);
  border-bottom: 2px solid #e0e7ff;
}
.cart-title-section {
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}
.cart-icon-wrapper {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.cart-icon-wrapper i {
  font-size: 2.5rem;
  color: #ffffff;
}

.cart-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0 0 0.5rem 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 0.5px;
}

.cart-subtitle {
  font-size: 1.1rem;
  color: #6b7280;
  margin: 0;
  font-weight: 500;
}

/* === CARRINHO VAZIO === */
.empty-cart-section {
  text-align: center;
  padding: 5rem 2rem;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  max-width: 600px;
  margin: 0 auto;
}

.empty-cart-illustration {
  width: 150px;
  height: 150px;
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
}

.empty-cart-illustration i {
  font-size: 5rem;
  color: #9ca3af;
}

.empty-cart-title {
  font-size: 2rem;
  font-weight: 700;
  color: #374151;
  margin-bottom: 1rem;
}

.empty-cart-text {
  font-size: 1.1rem;
  color: #6b7280;
  margin-bottom: 2rem;
}

/* === CARDS PREMIUM === */
.cart-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem 3rem 1rem;
}

.cart-items-card {
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  border: 2px solid #f3f4f6;
  overflow: hidden;
  transition: all 0.3s ease;
}

.cart-items-card:hover {
  box-shadow: 0 15px 50px rgba(102, 126, 234, 0.15);
  transform: translateY(-2px);
}

.card-header-custom {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1.5rem 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #ffffff;
}

.header-icon {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  backdrop-filter: blur(10px);
}

.header-title {
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0;
  letter-spacing: 0.3px;
}

.header-subtitle {
  font-size: 0.9rem;
  margin: 0;
  opacity: 0.9;
}

.btn-clear-all {
  margin-left: auto;
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  padding: 0.5rem 1rem;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.2s;
  backdrop-filter: blur(10px);
}

.btn-clear-all:hover {
  background: #ffffff;
  color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* === LISTA DE ITENS === */
.cart-items-list {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.cart-item-card {
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  border: 2px solid #e5e7eb;
  transition: all 0.3s ease;
  position: relative;
}

.cart-item-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.15);
  border-color: #667eea;
}

.item-image-wrapper {
  position: relative;
  flex-shrink: 0;
}

.item-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 12px;
  border: 2px solid #e0e7ff;
  background: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.item-quantity-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.85rem;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.item-details {
  flex: 1;
  min-width: 0;
}

.item-name {
  font-size: 1.15rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
  line-height: 1.3;
}

.item-category {
  font-size: 0.9rem;
  color: #6b7280;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
}

.item-pricing {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.unit-price {
  font-size: 0.9rem;
  color: #9ca3af;
  font-weight: 500;
}

.total-price {
  font-size: 1.4rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.item-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  flex-shrink: 0;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #ffffff;
  border-radius: 12px;
  padding: 0.5rem 0.75rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.btn-qty-control {
  background: linear-gradient(135deg, #ede9fe 0%, #e0e7ff 100%);
  color: #667eea;
  border: none;
  border-radius: 8px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: 700;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.15);
}

.btn-qty-control:hover:not(:disabled) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-qty-control:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity-display {
  font-size: 1.2rem;
  font-weight: 700;
  color: #111827;
  min-width: 40px;
  text-align: center;
}

.btn-remove-item {
  background: #fee2e2;
  color: #dc2626;
  border: none;
  border-radius: 8px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(220, 38, 38, 0.15);
}

.btn-remove-item:hover {
  background: #dc2626;
  color: #ffffff;
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
}

/* === RESUMO DO PEDIDO === */
.cart-summary-card {
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  border: 2px solid #f3f4f6;
  overflow: hidden;
  position: sticky;
  top: 100px;
  transition: all 0.3s ease;
}

.cart-summary-card:hover {
  box-shadow: 0 15px 50px rgba(102, 126, 234, 0.15);
  transform: translateY(-2px);
}

.summary-header-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1.5rem 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #ffffff;
}

.summary-icon {
  font-size: 1.8rem;
  color: #ffffff;
}

.summary-title {
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0;
  letter-spacing: 0.3px;
}

.summary-content {
  padding: 2rem;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  margin-bottom: 1rem;
  transition: all 0.2s;
}

.summary-item:hover {
  background: #f3f4f6;
  transform: translateX(4px);
}

.success-item {
  background: #ecfdf5;
  border-color: #a7f3d0;
}

.info-item {
  background: #eff6ff;
  border-color: #bfdbfe;
}

.summary-label {
  font-weight: 600;
  color: #374151;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
}

.summary-value {
  font-weight: 700;
  color: #111827;
  font-size: 1rem;
}

.summary-divider {
  height: 2px;
  background: linear-gradient(90deg, transparent, #e5e7eb, transparent);
  margin: 1.5rem 0;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: linear-gradient(135deg, #ede9fe 0%, #dbeafe 100%);
  border-radius: 16px;
  margin-bottom: 2rem;
}

.total-label {
  font-size: 1.1rem;
  font-weight: 700;
  color: #374151;
}

.total-value {
  font-size: 1.5rem; /* Reduzido de 1.75rem para 1.5rem */
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 20px rgba(102, 126, 234, 0.3);
}

/* === BOTÕES PREMIUM === */
.btn-premium-action {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
  font-size: 1.1rem;
  font-weight: 700;
  border-radius: 14px;
  padding: 1rem 2rem;
  border: none;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-premium-action:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
}

.btn-ghost-outline {
  background: transparent;
  color: #667eea;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 14px;
  padding: 1rem 2rem;
  border: 2px solid #e0e7ff;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-ghost-outline:hover {
  background: #f3f4f6;
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

/* === TRUST BADGES === */
.trust-badges {
  display: flex;
  justify-content: space-around;
  gap: 1rem;
  padding-top: 1.5rem;
  margin-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.trust-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  text-align: center;
}

.trust-item i {
  font-size: 1.5rem;
  color: #10b981;
}

.trust-item span {
  font-size: 0.85rem;
  color: #6b7280;
  font-weight: 600;
}

/* === RESPONSIVIDADE === */
@media (max-width: 991.98px) {
  .cart-header {
    padding: 2rem 0 1.5rem 0;
  }

  .cart-icon-wrapper {
    width: 60px;
    height: 60px;
  }

  .cart-icon-wrapper i {
    font-size: 2rem;
  }

  .cart-title {
    font-size: 2rem;
  }

  .cart-item-card {
    flex-direction: column;
    text-align: center;
  }

  .item-actions {
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
  }

  .cart-summary-card {
    position: static;
    margin-top: 2rem;
  }
}

@media (max-width: 600px) {
  .cart-header {
    padding: 1.5rem 0 1rem 0;
  }

  .cart-icon-wrapper {
    width: 50px;
    height: 50px;
  }

  .cart-icon-wrapper i {
    font-size: 1.5rem;
  }

  .cart-title {
    font-size: 1.5rem;
  }

  .cart-items-list {
    padding: 1rem;
  }

  .item-image {
    width: 80px;
    height: 80px;
  }

  .item-name {
    font-size: 1rem;
  }

  .total-price {
    font-size: 1.2rem;
  }

  .total-value {
    font-size: 1.3rem; /* Reduzido de 1.5rem para 1.3rem */
  }
}
</style>