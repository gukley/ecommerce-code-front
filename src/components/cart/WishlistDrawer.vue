<template>
  <div v-show="open" class="cart-drawer-backdrop" @click.self="close">
    <div class="cart-drawer">
      <div class="cart-drawer-header d-flex justify-content-between align-items-center">
        <h5 class="mb-0">Seus Favoritos</h5>
        <button class="btn-close btn-close-white" @click="close"></button>
      </div>
      <div class="cart-drawer-body">
        <div v-if="open && (!wishlist.items || wishlist.items.length === 0)" class="text-center text-muted py-5">
          Sua lista de desejos está vazia.
        </div>
        <div v-else-if="open && wishlist.items.length > 0">
          <div v-for="item in wishlist.items" :key="item.id" class="cart-item d-flex align-items-center mb-3">
            <img :src="getImageUrl(item)" class="cart-item-img me-3" />
            <div class="flex-grow-1">
              <div class="fw-bold">{{ item.name }}</div>
              <div class="text-secondary small mb-1">{{ item.category_name || '' }}</div>
            </div>
            <button class="btn btn-outline-danger btn-sm ms-2" @click="wishlist.remove(item.id)">
              <i class="bi bi-trash"></i>
            </button>
            <button class="btn btn-outline-primary btn-sm ms-2" @click="addToCart(item)">
              <i class="bi bi-cart-plus"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useWishlistStore } from '@/stores/wishlistStore';
import { useCartStore } from '@/stores/cartStore';
import { useRouter } from 'vue-router';
const props = defineProps({ open: Boolean });
const emit = defineEmits(['close']);
const wishlist = useWishlistStore();
const cart = useCartStore();
const router = useRouter();

const close = () => emit('close');
const BASE_URL = 'http://35.196.79.227:8000';
const getImageUrl = (product) => product.image_path ? BASE_URL + product.image_path : '/placeholder-product.png';

function addToCart(product) {
  const precoFinal = product.desconto
    ? Number(product.price) - (Number(product.price) * (product.desconto / 100))
    : Number(product.price);
  cart.addItem(product.id, 1, precoFinal);
  wishlist.remove(product.id);
}
</script>

<style scoped>
.cart-drawer-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.35);
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
  animation: slideInDrawer 0.42s cubic-bezier(.4,0,.2,1);
}
@keyframes slideInDrawer {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
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
.cart-item-img {
  width: 56px;
  height: 56px;
  object-fit: cover;
  border-radius: 0.7rem;
  border: 1.5px solid #8f5fe8;
}
.cart-item {
  background: #2a2a3e;
  border-radius: 1rem;
  padding: 0.7rem 1rem;
  box-shadow: 0 2px 8px rgba(143, 95, 232, 0.08);
}
</style> 