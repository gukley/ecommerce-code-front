<template>
  <div v-show="open" class="cart-drawer-backdrop" @click.self="close">
    <div class="cart-drawer">
      <div class="cart-drawer-header d-flex justify-content-between align-items-center">
        <h5 class="mb-0">Seu Carrinho</h5>
        <button class="btn-close btn-close-white" @click="close"></button>
      </div>
      <div class="cart-drawer-body">
        <div v-if="open && Array.isArray(validItems) && validItems.length === 0" class="text-center text-muted py-5 empty-text">
          Seu carrinho está vazio.
        </div>
        <div v-else-if="open && validItems.length > 0">
          <div v-for="item in validItems" :key="item.product?.id || item.id" class="cart-item d-flex align-items-start mb-3">
            <img :src="getImageUrl(item.product ? item.product : item)" class="cart-item-img me-3" />
            <div class="flex-grow-1">
              <div class="fw-bold product-name">
                {{ item.product ? item.product.name : item.name }}
              </div>
              <div class="d-flex align-items-center mb-1">
                <button class="btn btn-sm btn-outline-secondary" @click="alterarQuantidade(item, item.quantity - 1)" :disabled="item.quantity <= 1">−</button>
                <span class="mx-2">{{ item.quantity }}</span>
                <button class="btn btn-sm btn-outline-secondary" @click="alterarQuantidade(item, item.quantity + 1)" :disabled="item.quantity >= (item.product?.stock ?? 99)">+</button>
              </div>
              <div class="text-primary">R$ {{ ((item.product ? item.product.price : item.price) * item.quantity).toFixed(2) }}</div>
            </div>
            <button class="btn btn-outline-danger btn-sm ms-2" @click="cart.removeItem(item.product.id)">
              <i class="bi bi-trash"></i>
            </button>
          </div>
          <div class="cart-drawer-footer mt-4">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <span class="fw-bold">Total:</span>
              <span class="fw-bold text-primary fs-5">R$ {{ cart.totalPrice.toFixed(2) }}</span>
            </div>
            <button class="btn btn-main-action w-100" @click="checkout">Finalizar Compra</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue';
import { useCartStore } from '@/stores/cartStore';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

const props = defineProps({ open: Boolean });
const emit = defineEmits(['close']);
const cart = useCartStore();
const router = useRouter();
const toast = useToast();

const close = () => emit('close');
const checkout = () => {
  router.push('/checkout');
  setTimeout(() => close(), 100);
};

const BASE_URL = 'http://35.196.79.227:8000';
const getImageUrl = (product) => product.image_path ? BASE_URL + product.image_path : '/placeholder-product.png';

const validItems = computed(() =>
  Array.isArray(cart.detailedItems) ? cart.detailedItems.filter(item => item && item.product) : []
);

function alterarQuantidade(item, novaQtd) {
  if (novaQtd >= 1 && novaQtd <= (item.product?.stock ?? 99)) {
    cart.updateItem(item.product.id, novaQtd);
  }
}

</script>

<style scoped>
.cart-drawer-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  z-index: 2000;
  display: flex;
  justify-content: flex-end;
}

.cart-drawer {
  width: 370px;
  max-width: 100vw;
  height: 100vh;
  background: #23233a;
  box-shadow: -4px 0 32px rgba(143, 95, 232, 0.15);
  border-left: 2px solid #8f5fe8;
  display: flex;
  flex-direction: column;
  animation: slideInDrawer 0.42s cubic-bezier(.4, 0, .2, 1);
}

@keyframes slideInDrawer {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.cart-drawer-header {
  padding: 1.2rem 1.5rem 1rem 1.5rem;
  background: #1a1a2e;
  border-bottom: 1px solid #8f5fe8;
}

.cart-drawer-body {
  flex: 1 1 auto;
  overflow-y: auto;
  padding: 1.5rem;
}

.cart-item {
  background: #2a2a3e;
  border-radius: 1rem;
  padding: 0.9rem 1rem;
  box-shadow: 0 2px 8px rgba(143, 95, 232, 0.08);
}

.cart-item-img {
  width: 56px;
  height: 56px;
  object-fit: cover;
  border-radius: 0.7rem;
  border: 1.5px solid #8f5fe8;
  background-color: #1a1a2e;
}

.product-name {
  font-size: 0.95rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.btn-outline-secondary {
  border-radius: 8px;
  border-color: #8f5fe8;
  color: #fff;
  background-color: rgba(143, 95, 232, 0.1);
}
.btn-outline-secondary:hover {
  background-color: #8f5fe8;
  color: #fff;
}

.btn-outline-danger {
  border-color: transparent;
  color: #ff4f8f;
  background-color: transparent;
  transition: all 0.2s;
}
.btn-outline-danger:hover {
  background-color: rgba(255, 79, 143, 0.1);
  color: white;
}

.cart-drawer-footer {
  border-top: 1px solid #35354d;
  padding-top: 1.2rem;
}

.btn-main-action {
  background: linear-gradient(90deg, #c56cf0, #845ef7);
  color: white;
  font-size: 1.1rem;
  border-radius: 40px;
  padding: 0.85rem 1.5rem;
  box-shadow: 0 0 15px rgba(133, 95, 255, 0.25);
  font-weight: 600;
  border: none;
  transition: all 0.3s ease;
}
.btn-main-action:hover {
  transform: scale(1.03);
  box-shadow: 0 0 20px rgba(133, 95, 255, 0.4);
}

.empty-text {
  font-size: 1.05rem;
  color: #999;
}
</style>
