<template>
  <div class="cart-page theme-page">
    <NavBar />
    <div class="cart-header">
      <div class="container">
        <div class="d-flex justify-content-center align-items-center">
          <div class="cart-title-section">
            <span class="cart-logo">GGTECH</span>
            <h2 class="cart-title theme-text-primary">Carrinho de compras</h2>
          </div>
        </div>
      </div>
    </div>
    <div class="container py-5">
      <div class="row">
        <div class="col-lg-8">
          <div class="cart-table-box shadow-sm rounded-4 p-3 mb-4">
            <table class="table cart-table align-middle">
              <thead>
                <tr>
                  <th>Produto</th>
                  <th class="text-center">Qtd</th>
                  <th class="text-end">Preço</th>
                  <th class="text-end">Total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in items" :key="item.product?.id || item.product_id" class="cart-row">
                  <td>
                    <div class="d-flex align-items-center">
                      <img :src="getImageUrl(item.product)" class="cart-item-img me-3" v-if="item.product"/>
                      <div>
                        <div class="fw-bold cart-product-name">{{ item.product?.name || 'Produto não encontrado' }}</div>
                        <div class="text-muted small">SKU: {{ item.product?.sku || item.product_id }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="text-center">
                    <div class="d-flex justify-content-center align-items-center">
                      <button class="btn btn-qty" @click="updateItem(item.product.id, item.quantity - 1)" :disabled="item.quantity <= 1">−</button>
                      <span class="mx-2 cart-qty">{{ item.quantity }}</span>
                      <button class="btn btn-qty" @click="updateItem(item.product.id, item.quantity + 1)">+</button>
                    </div>
                  </td>
                  <td class="text-end">
                    <span v-if="item.product" class="cart-price">
                      R$ {{ Number(item.product.price).toFixed(2) }}
                    </span>
                  </td>
                  <td class="text-end">
                    <span v-if="item.product" class="cart-price">
                      R$ {{ (Number(item.product.price) * item.quantity).toFixed(2) }}
                    </span>
                  </td>
                  <td class="text-end">
                    <button class="btn btn-remove" @click="removeItem(item.product.id)" title="Remover">
                      <i class="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
                <tr v-if="items.length === 0">
                  <td colspan="5" class="text-center text-muted py-4">Seu carrinho está vazio.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <button class="btn btn-clear-cart mt-2" @click="clearCart" v-if="items.length > 0">
            <i class="bi bi-x-circle"></i> Limpar Carrinho
          </button>
        </div>
        <div class="col-lg-4">
          <div class="cart-summary-box shadow-sm rounded-4 p-4">
            <h5 class="mb-3 cart-summary-title">Resumo do pedido</h5>
            <div class="mb-2 d-flex justify-content-between align-items-center">
              <span class="cart-summary-label">{{ items.length }} produtos</span>
              <span class="cart-summary-value">R$ {{ totalPrice.toFixed(2) }}</span>
            </div>
            <div class="mb-2 d-flex justify-content-between align-items-center">
              <span class="cart-summary-label text-success">Cupons</span>
              <span class="cart-summary-value text-success">{{ couponDiscountValue }}</span>
            </div>
            <div class="mb-2 d-flex justify-content-between align-items-center">
              <span class="cart-summary-label text-info">Frete</span>
              <span class="cart-summary-value text-info">{{ shippingValue }}</span>
            </div>
            <hr class="cart-summary-divider" />
            <div class="mb-3 fs-5 fw-bold d-flex justify-content-between align-items-center">
              <span>Total</span>
              <span class="cart-summary-total">R$ {{ totalWithDiscount }}</span>
            </div>
            <div class="mb-3">
              <label class="form-label fw-bold">Cupom de desconto:</label>
              <div class="input-group">
                <input v-model="couponCode" type="text" class="form-control cart-input" placeholder="Digite o cupom" />
                <button class="btn btn-coupon" type="button" @click="applyCoupon">OK</button>
              </div>
              <div v-if="couponError" class="text-danger small mt-1">{{ couponError }}</div>
              <div v-if="couponSuccess" class="text-success small mt-1">{{ couponSuccess }}</div>
            </div>
            <div class="mb-3">
              <label class="form-label fw-bold">Calcule o frete e prazo:</label>
              <div class="input-group">
                <input v-model="cep" type="text" class="form-control cart-input" placeholder="CEP" maxlength="9" />
                <button class="btn btn-frete" type="button" @click="calcularFrete">CALCULAR</button>
              </div>
              <div v-if="cepError" class="text-danger small mt-1">{{ cepError }}</div>
              <div v-if="prazoFrete" class="text-success small mt-1">Prazo estimado: {{ prazoFrete }}</div>
              <div class="small text-muted mt-1"><a href="#">Não sei o meu CEP</a></div>
            </div>
            <button class="btn btn-main-action w-100 mb-2" @click="goToCheckout" :disabled="items.length === 0">
              <i class="bi bi-bag-check me-2"></i> Continuar
            </button>
            <button class="btn btn-outline-secondary w-100" @click="goToHome">
              <i class="bi bi-arrow-left me-2"></i> Adicionar Mais Produtos
            </button>
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
const { detailedItems, loading, totalPrice } = cart

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
}

const couponDiscountValue = computed(() =>
  couponDiscount.value > 0 ? '-' + (totalPrice * couponDiscount.value).toFixed(2) : '0,00'
)
const totalWithDiscount = computed(() =>
  couponDiscount.value > 0
    ? (totalPrice * (1 - couponDiscount.value)).toFixed(2)
    : totalPrice.toFixed(2)
)

// Frete (simulação)
const cep = ref('')
const cepError = ref('')
const shippingValue = ref('0,00')
const prazoFrete = ref('')
function calcularFrete() {
  cepError.value = ''
  prazoFrete.value = ''
  if (!cep.value.match(/^\d{5}-?\d{3}$/)) {
    cepError.value = 'CEP inválido.'
    return
  }
  // Simulação: frete grátis para todos
  shippingValue.value = '0,00'
  prazoFrete.value = '3-7 dias úteis'
}
</script>

<style scoped>
.cart-page-bg {
  background: #f8fafc;
  min-height: 100vh;
  padding-bottom: 40px;
}
.cart-logo {
  font-size: 2.2rem;
  font-weight: bold;
  color: #4f6ef7;
  letter-spacing: 2px;
  font-family: 'Montserrat', Arial, sans-serif;
  text-shadow: 0 2px 12px #4f6ef710;
}
.cart-title {
  color: #4f6ef7;
  font-weight: 700;
  letter-spacing: 1px;
  font-size: 2rem;
  text-shadow: 0 2px 12px #4f6ef710;
}
.cart-table-box {
  background: #fff;
  border-radius: 1.2rem;
  box-shadow: 0 2px 12px #232e4708;
  border: 1px solid #e5e7eb;
}
.cart-table th {
  background: #f8fafc;
  color: #4f6ef7;
  font-weight: 700;
  border: none;
  font-size: 1rem;
  letter-spacing: 0.04em;
  padding: 1rem;
}
.cart-table td {
  background: transparent;
  color: #232e47;
  font-size: 1rem;
  border-top: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
  padding: 1rem;
}
.cart-row:hover {
  background: #f3f6fc;
  box-shadow: 0 2px 12px #4f6ef708;
}
.cart-product-name {
  color: #232e47;
  font-size: 1.08rem;
  font-weight: 600;
  letter-spacing: 0.5px;
}
.cart-qty {
  font-size: 1.1rem;
  font-weight: 700;
  color: #4f6ef7;
}
.cart-price {
  font-weight: 700;
  color: #232e47;
  font-size: 1.08rem;
}
.cart-item-img {
  width: 56px;
  height: 56px;
  object-fit: cover;
  border-radius: 0.7rem;
  border: 1.5px solid #e5e7eb;
  background-color: #f8fafc;
  box-shadow: 0 2px 8px #232e4708;
}
.btn-qty {
  background: #e5e7eb;
  color: #232e47;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  width: 32px;
  height: 32px;
  font-size: 1.2rem;
  transition: background 0.18s, color 0.18s;
}
.btn-qty:hover {
  background: #4f6ef7;
  color: #fff;
}
.btn-remove {
  background: #f8fafc;
  color: #f44336;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  padding: 0.4em 0.8em;
  transition: background 0.18s;
}
.btn-remove:hover {
  background: #f44336;
  color: #fff;
}
.btn-clear-cart {
  background: #e5e7eb;
  color: #232e47;
  border: none;
  border-radius: 1rem;
  font-weight: 600;
  padding: 0.7em 1.5em;
  box-shadow: 0 2px 8px #232e4708;
  transition: background 0.18s;
}
.btn-clear-cart:hover {
  background: #4f6ef7;
  color: #fff;
}
.cart-summary-box {
  background: #fff;
  border-radius: 1.2rem;
  box-shadow: 0 2px 12px #232e4708;
  border: 1px solid #e5e7eb;
  color: #232e47;
}
.cart-summary-title {
  color: #4f6ef7;
  font-weight: 700;
  font-size: 1.2rem;
  letter-spacing: 0.5px;
}
.cart-summary-label {
  font-weight: 600;
  color: #232e47;
}
.cart-summary-value {
  font-weight: 700;
  color: #4f6ef7;
}
.cart-summary-divider {
  border: none;
  border-top: 2px solid #e5e7eb;
  margin: 1.2rem 0;
}
.cart-summary-total {
  color: #232e47;
  font-size: 1.3rem;
  font-weight: 700;
  text-shadow: 0 2px 12px #4f6ef710;
}
.cart-input {
  background: #f8fafc;
  color: #232e47;
  border: 1.5px solid #e5e7eb;
  border-radius: 10px;
  font-size: 1rem;
  box-shadow: 0 2px 8px #232e4708;
  transition: border 0.2s, background 0.2s;
}
.cart-input:focus {
  border-color: #4f6ef7;
  background: #fff;
  color: #232e47;
  outline: none;
}
.btn-coupon {
  background: #e5e7eb;
  color: #232e47;
  border: none;
  border-radius: 10px;
  font-weight: 700;
  transition: background 0.18s, color 0.18s;
}
.btn-coupon:hover {
  background: #4f6ef7;
  color: #fff;
}
.btn-frete {
  background: #e5e7eb;
  color: #232e47;
  border: none;
  border-radius: 10px;
  font-weight: 700;
  transition: background 0.18s, color 0.18s;
}
.btn-frete:hover {
  background: #4f6ef7;
  color: #fff;
}
.btn-main-action {
  background: #4f6ef7;
  color: #fff;
  font-size: 1.1rem;
  border-radius: 40px;
  padding: 0.85rem 1.5rem;
  font-weight: 700;
  border: none;
  box-shadow: 0 0 15px #4f6ef710;
  transition: all 0.3s ease;
}
.btn-main-action:hover {
  transform: scale(1.03);
  background: #232e47;
  color: #fff;
  box-shadow: 0 0 20px #232e4708;
}
@media (max-width: 991.98px) {
  .cart-table-box, .cart-summary-box {
    border-radius: 1rem;
    padding: 1rem;
  }
  .cart-title {
    font-size: 1.3rem;
  }
  .cart-logo {
    font-size: 1.3rem;
  }
  .row {
    flex-direction: column;
  }
  .col-lg-8, .col-lg-4 {
    max-width: 100%;
    flex: 0 0 100%;
  }
  .cart-table th, .cart-table td {
    padding: 0.6rem;
    font-size: 0.98rem;
  }
  .cart-summary-box {
    margin-top: 2rem;
  }
  .cart-item-img {
    width: 40px;
    height: 40px;
  }
}
@media (max-width: 600px) {
  .container {
    padding: 0 0.3rem;
  }
  .cart-table-box, .cart-summary-box {
    padding: 0.5rem;
    border-radius: 0.7rem;
  }
  .cart-title, .cart-logo {
    font-size: 1rem;
  }
  .cart-summary-title {
    font-size: 1rem;
  }
  .cart-summary-total {
    font-size: 1.1rem;
  }
  .cart-item-img {
    width: 32px;
    height: 32px;
  }
  .btn-main-action, .btn-clear-cart, .btn-outline-secondary {
    font-size: 0.95rem;
    padding: 0.6em 1em;
  }
}

/* ===== THEME STYLES ===== */
.cart-page {
  min-height: 100vh;
  background: var(--bg-main);
  transition: background-color var(--transition-normal);
}

.cart-header {
  background: var(--bg-card);
  border-bottom: 1px solid var(--border-color);
  padding: 2rem 0;
  margin-bottom: 2rem;
  box-shadow: var(--shadow-sm);
}

.cart-title-section {
  text-align: center;
}

.cart-logo {
  font-size: 2rem;
  font-weight: 900;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: block;
  margin-bottom: 0.5rem;
}

.cart-title {
  font-size: 2rem;
  font-weight: 600;
  margin: 0;
  color: var(--text-main);
}

.cart-table-box {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-md);
  transition: all var(--transition-normal);
}

.cart-table-box:hover {
  box-shadow: var(--shadow-lg);
}

.cart-table {
  color: var(--text-main);
}

.cart-table th {
  background: var(--bg-secondary);
  color: var(--text-main);
  border-color: var(--border-color);
  font-weight: 600;
}

.cart-table td {
  border-color: var(--border-color);
  color: var(--text-main);
}

.cart-product-name {
  color: var(--text-main);
}

.cart-price {
  color: var(--accent-primary);
  font-weight: 600;
}

.cart-summary-box {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-md);
  transition: all var(--transition-normal);
}

.cart-summary-box:hover {
  box-shadow: var(--shadow-lg);
}

.cart-summary-title {
  color: var(--text-main);
  font-weight: 600;
}

.cart-summary-label {
  color: var(--text-secondary);
}

.cart-summary-value {
  color: var(--text-main);
  font-weight: 500;
}

.cart-summary-total {
  color: var(--accent-primary);
  font-weight: 700;
}

.btn-main-action {
  background: var(--gradient-primary);
  border: none;
  color: var(--text-inverse);
  transition: all var(--transition-normal);
}

.btn-main-action:hover {
  box-shadow: var(--shadow-glow);
  transform: translateY(-2px);
}

.btn-clear-cart {
  background: var(--bg-button);
  color: var(--text-main);
  border: 1px solid var(--border-color);
  transition: all var(--transition-normal);
}

.btn-clear-cart:hover {
  background: var(--bg-button-hover);
  border-color: var(--accent-error);
  color: var(--accent-error);
}

.btn-qty {
  background: var(--bg-button);
  color: var(--text-main);
  border: 1px solid var(--border-color);
  transition: all var(--transition-normal);
}

.btn-qty:hover {
  background: var(--bg-button-hover);
  border-color: var(--accent-primary);
}

/* Responsivo para tema */
@media (max-width: 768px) {
  .cart-header {
    padding: 1.5rem 0;
  }
  
  .cart-title {
    font-size: 1.5rem;
  }
  
  .cart-logo {
    font-size: 1.5rem;
  }
  
  .d-flex {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}
</style>