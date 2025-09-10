<template>
  <NavBar />
  <div class="cart-page-bg">
    <div class="container py-5">
      <div class="text-center mb-4">
        <span class="cart-logo">GGTECH</span>
      </div>
      <h2 class="mb-4 cart-title">Carrinho de compras</h2>
      <div class="row">
        <div class="col-lg-8">
          <div class="cart-table-box shadow-lg rounded-4 p-3 mb-4">
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
          <div class="cart-summary-box shadow-lg rounded-4 p-4">
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
import { ref, computed } from 'vue'
import { useCartStore } from '@stores/cartStore'
import { useCouponStore } from '@/stores/couponStore'
import { useRouter } from 'vue-router'
import NavBar from '@/components/home/NavBar.vue'

const cart = useCartStore()
const couponStore = useCouponStore()
const router = useRouter()
const { detailedItems, loading, totalPrice } = cart

const items = computed(() => detailedItems)

const updateItem = (productId, quantity) => cart.updateItemQuantity(productId, quantity)
const removeItem = (productId) => cart.removeItem(productId)
const clearCart = () => cart.clearCart()
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
  background: linear-gradient(120deg, #181e2a 60%, #232e47 100%);
  min-height: 100vh;
  padding-bottom: 40px;
}
.cart-logo {
  font-size: 2.2rem;
  font-weight: bold;
  color: #00ffe1;
  letter-spacing: 2px;
  font-family: 'Montserrat', Arial, sans-serif;
  text-shadow: 0 2px 12px #00ffe1a0;
}
.cart-title {
  color: #8f5fe8;
  font-weight: 700;
  letter-spacing: 1px;
  font-size: 2rem;
  text-shadow: 0 2px 12px #8f5fe880;
}
.cart-table-box {
  background: linear-gradient(120deg, #232e47 80%, #181e2a 100%);
  border-radius: 1.5rem;
  box-shadow: 0 4px 24px #232e4740;
  border: 1.5px solid #232e47;
}
.cart-table th {
  background: linear-gradient(90deg, #8f5fe8 0%, #00ffe1 100%);
  color: #fff;
  font-weight: 700;
  border: none;
  font-size: 1rem;
  letter-spacing: 0.04em;
  padding: 1rem;
}
.cart-table td {
  background: transparent;
  color: #e8eaed;
  font-size: 1rem;
  border-top: 1px solid #232e47;
  border-bottom: 1px solid #232e47;
  padding: 1rem;
}
.cart-row:hover {
  background: linear-gradient(90deg, #232e47 60%, #181e2a 100%);
  box-shadow: 0 2px 12px #8f5fe830;
}
.cart-product-name {
  color: #00ffe1;
  font-size: 1.08rem;
  font-weight: 600;
  letter-spacing: 0.5px;
}
.cart-qty {
  font-size: 1.1rem;
  font-weight: 700;
  color: #8f5fe8;
}
.cart-price {
  font-weight: 700;
  color: #00ffe1;
  font-size: 1.08rem;
}
.cart-item-img {
  width: 56px;
  height: 56px;
  object-fit: cover;
  border-radius: 0.7rem;
  border: 2px solid #00ffe1;
  background-color: #181e2a;
  box-shadow: 0 2px 8px #00ffe130;
}
.btn-qty {
  background: linear-gradient(90deg, #8f5fe8 0%, #00ffe1 100%);
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
  background: linear-gradient(90deg, #00ffe1 0%, #8f5fe8 100%);
  color: #fff;
}
.btn-remove {
  background: linear-gradient(90deg, #ff6b6b 0%, #f44336 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  padding: 0.4em 0.8em;
  transition: background 0.18s;
}
.btn-remove:hover {
  background: linear-gradient(90deg, #f44336 0%, #ff6b6b 100%);
  color: #fff;
}
.btn-clear-cart {
  background: linear-gradient(90deg, #232e47 0%, #8f5fe8 100%);
  color: #fff;
  border: none;
  border-radius: 1rem;
  font-weight: 600;
  padding: 0.7em 1.5em;
  box-shadow: 0 2px 8px #8f5fe830;
  transition: background 0.18s;
}
.btn-clear-cart:hover {
  background: linear-gradient(90deg, #8f5fe8 0%, #232e47 100%);
  color: #fff;
}
.cart-summary-box {
  background: linear-gradient(120deg, #232e47 80%, #181e2a 100%);
  border-radius: 1.5rem;
  box-shadow: 0 4px 24px #232e4740;
  border: 1.5px solid #232e47;
  color: #e8eaed;
}
.cart-summary-title {
  color: #00ffe1;
  font-weight: 700;
  font-size: 1.2rem;
  letter-spacing: 0.5px;
}
.cart-summary-label {
  font-weight: 600;
  color: #8f5fe8;
}
.cart-summary-value {
  font-weight: 700;
  color: #00ffe1;
}
.cart-summary-divider {
  border: none;
  border-top: 2px solid #8f5fe8;
  margin: 1.2rem 0;
}
.cart-summary-total {
  color: #00ffe1;
  font-size: 1.3rem;
  font-weight: 700;
  text-shadow: 0 2px 12px #00ffe1a0;
}
.cart-input {
  background: #181e2a;
  color: #e8eaed;
  border: 1.5px solid #8f5fe8;
  border-radius: 10px;
  font-size: 1rem;
  box-shadow: 0 2px 8px #232e4720;
  transition: border 0.2s, background 0.2s;
}
.cart-input:focus {
  border-color: #00ffe1;
  background: #232e47;
  color: #fff;
  outline: none;
}
.btn-coupon {
  background: linear-gradient(90deg, #00ffe1 0%, #8f5fe8 100%);
  color: #232e47;
  border: none;
  border-radius: 10px;
  font-weight: 700;
  transition: background 0.18s, color 0.18s;
}
.btn-coupon:hover {
  background: linear-gradient(90deg, #8f5fe8 0%, #00ffe1 100%);
  color: #fff;
}
.btn-frete {
  background: linear-gradient(90deg, #8f5fe8 0%, #00ffe1 100%);
  color: #232e47;
  border: none;
  border-radius: 10px;
  font-weight: 700;
  transition: background 0.18s, color 0.18s;
}
.btn-frete:hover {
  background: linear-gradient(90deg, #00ffe1 0%, #8f5fe8 100%);
  color: #fff;
}
.btn-main-action {
  background: linear-gradient(90deg, #00ffe1 0%, #8f5fe8 100%);
  color: #232e47;
  font-size: 1.1rem;
  border-radius: 40px;
  padding: 0.85rem 1.5rem;
  font-weight: 700;
  border: none;
  box-shadow: 0 0 15px #00ffe130;
  transition: all 0.3s ease;
}
.btn-main-action:hover {
  transform: scale(1.03);
  background: linear-gradient(90deg, #8f5fe8 0%, #00ffe1 100%);
  color: #fff;
  box-shadow: 0 0 20px #8f5fe860;
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
}
</style>