<template>
  <div class="cart-page theme-page">
    <NavBar />
    <div class="cart-header">
      <div class="container">
        <div class="d-flex justify-content-center align-items-center">
          <div class="cart-title-section">
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
                      <img :src="getImageUrl(item.product)" class="cart-item-img me-3" v-if="item.product" />
                      <div>
                        <div class="fw-bold cart-product-name">{{ item.product?.name || 'Produto não encontrado' }}</div>
                        <div class="text-muted small">Categoria: {{ item.product?.category?.name || 'Não especificada' }}</div>
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
            <!-- <div class="mb-3">
              <label class="form-label fw-bold">Cupom de desconto:</label>
              <div class="input-group">
                <input v-model="couponCode" type="text" class="form-control cart-input" placeholder="Digite o cupom" />
                <button class="btn btn-coupon" type="button" @click="applyCoupon">OK</button>
              </div> -->
              <div v-if="couponError" class="text-danger small mt-1">{{ couponError }}</div>
              <div v-if="couponSuccess" class="text-success small mt-1">{{ couponSuccess }}</div>
            </div>
            <!-- CEP moved to checkout: usuário preencherá CEP no checkout -->
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
  <!-- </div> -->
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
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
  padding: 2rem 0 1.2rem 0;
  margin-bottom: 2rem;
  box-shadow: 0 2px 12px #4f46e510;
}
.cart-title-section {
  text-align: center;
}
.cart-logo {
  font-size: 2rem;
  font-weight: 900;
  background: linear-gradient(90deg, #4f46e5 0%, #9333ea 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: block;
  margin-bottom: 0.5rem;
  letter-spacing: 2px;
}
.cart-title {
  font-size: 2rem;
  font-weight: 600;
  margin: 0;
  color: #4f46e5;
  letter-spacing: 1px;
}

/* Layout principal */
.container {
  max-width: 1200px;
  margin: 0 auto;
}

/* Cartões */
.cart-table-box,
.cart-summary-box {
  background: #f9fafb;
  border-radius: 1.3rem;
  box-shadow: 0 2px 16px #4f46e510;
  border: 1.5px solid #e5e7eb;
  transition: box-shadow 0.18s;
}
.cart-table-box:hover,
.cart-summary-box:hover {
  box-shadow: 0 6px 32px #9333ea22;
}

/* Tabela de produtos */
.cart-table th {
  background: #f9fafb;
  color: #4f46e5;
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
  background: #f3f4fa;
  box-shadow: 0 2px 12px #9333ea10;
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
  color: #4f46e5;
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
  background-color: #f9fafb;
  box-shadow: 0 2px 8px #4f46e510;
}

/* Botões quantidade */
.btn-qty {
  background: #ede9fe;
  color: #4f46e5;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  width: 32px;
  height: 32px;
  font-size: 1.2rem;
  transition: background 0.18s, color 0.18s, box-shadow 0.18s;
  box-shadow: 0 1px 4px #9333ea10;
}
.btn-qty:hover {
  background: linear-gradient(90deg, #4f46e5 0%, #9333ea 100%);
  color: #fff;
  box-shadow: 0 2px 8px #9333ea30;
}

/* Botão remover */
.btn-remove {
  background: #f3f4fa;
  color: #9333ea;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  padding: 0.4em 0.8em;
  transition: background 0.18s, color 0.18s;
  box-shadow: 0 1px 4px #9333ea10;
}
.btn-remove:hover {
  background: #9333ea;
  color: #fff;
}

/* Botão limpar carrinho */
.btn-clear-cart {
  background: #ede9fe;
  color: #4f46e5;
  border: none;
  border-radius: 1rem;
  font-weight: 600;
  padding: 0.7em 1.5em;
  box-shadow: 0 2px 8px #9333ea10;
  transition: background 0.18s, color 0.18s;
  display: flex;
  align-items: center;
  gap: 0.5em;
}
.btn-clear-cart:hover {
  background: #9333ea;
  color: #fff;
}

/* Resumo do pedido */
.cart-summary-box {
  background: #f9fafb;
  border-radius: 1.3rem;
  box-shadow: 0 2px 16px #4f46e510;
  border: 1.5px solid #e5e7eb;
  color: #232e47;
  position: relative;
  overflow: visible;
}
.cart-summary-title {
  color: #4f46e5;
  font-weight: 700;
  font-size: 1.2rem;
  letter-spacing: 0.5px;
  position: relative;
  padding-left: 1.1rem;
  margin-bottom: 1.5rem;
}
.cart-summary-title::before {
  content: '';
  display: block;
  position: absolute;
  left: 0;
  top: 0.2rem;
  width: 6px;
  height: 1.6em;
  border-radius: 6px;
  background: linear-gradient(180deg, #4f46e5 0%, #9333ea 100%);
}
.cart-summary-label {
  font-weight: 600;
  color: #232e47;
}
.cart-summary-value {
  font-weight: 700;
  color: #4f46e5;
}
.cart-summary-divider {
  border: none;
  border-top: 2px solid #e5e7eb;
  margin: 1.2rem 0;
}
.cart-summary-total {
  color: #9333ea;
  font-size: 1.3rem;
  font-weight: 800;
  letter-spacing: 0.5px;
  text-shadow: 0 2px 12px #9333ea10;
}

/* Inputs cupom e CEP */
.cart-input {
  background: #fff;
  color: #232e47;
  border: 1.5px solid #e5e7eb;
  border-radius: 1.5rem;
  font-size: 1rem;
  box-shadow: 0 2px 8px #4f46e510;
  transition: border 0.2s, background 0.2s;
  padding: 0.7rem 1.1rem;
}
.cart-input:focus {
  border-color: #9333ea;
  background: #f9fafb;
  color: #232e47;
  outline: none;
}

/* Botões cupom/frete */
.btn-coupon,
.btn-frete {
  background: linear-gradient(90deg, #4f46e5 0%, #9333ea 100%);
  color: #fff;
  border: none;
  border-radius: 1.5rem;
  font-weight: 700;
  transition: background 0.18s, box-shadow 0.18s, transform 0.18s;
  padding: 0.5em 1.2em;
  box-shadow: 0 2px 8px #9333ea10;
}
.btn-coupon:hover,
.btn-frete:hover {
  background: linear-gradient(90deg, #9333ea 0%, #4f46e5 100%);
  transform: translateY(-2px) scale(1.04);
  box-shadow: 0 4px 18px #9333ea30;
}

/* Botão principal */
.btn-main-action {
  background: linear-gradient(90deg, #4f46e5 0%, #9333ea 100%);
  color: #fff;
  font-size: 1.1rem;
  border-radius: 2rem;
  padding: 0.85rem 1.5rem;
  font-weight: 700;
  border: none;
  box-shadow: 0 0 15px #9333ea10;
  transition: all 0.3s ease;
}
.btn-main-action:hover {
  transform: scale(1.03);
  background: linear-gradient(90deg, #9333ea 0%, #4f46e5 100%);
  color: #fff;
  box-shadow: 0 0 20px #9333ea30;
}

/* Botão secundário */
.btn-outline-secondary {
  background: #fff;
  color: #4f46e5;
  border: 1.5px solid #e5e7eb;
  border-radius: 2rem;
  font-weight: 600;
  transition: background 0.18s, color 0.18s, border 0.18s;
}
.btn-outline-secondary:hover {
  background: #ede9fe;
  color: #9333ea;
  border-color: #9333ea;
}

/* Responsividade */
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
    padding-left: 0.7rem;
  }
  .cart-summary-title::before {
    width: 4px;
    height: 1.2em;
    left: 0;
    top: 0.25rem;
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

/* Ajustes para tema */
.cart-summary-label {
  color: #4f46e5;
}
.cart-summary-value {
  color: #4f46e5;
}
.cart-summary-total {
  color: #9333ea;
}
</style>