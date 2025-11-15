<template>
  <div v-if="open" class="wishlist-drawer-backdrop" @click.self="close">
    <div class="wishlist-drawer">
      <div class="wishlist-drawer-header d-flex justify-content-between align-items-center">
        <h5 class="mb-0">Seus Favoritos</h5>
        <button class="btn-close" @click="close"></button>
      </div>
      <div class="wishlist-drawer-body">
        <div v-if="!wishlist.items || wishlist.items.length === 0" class="text-center text-muted py-5">
          Sua lista de desejos está vazia.
        </div>
        <div v-else>
          <div v-for="item in wishlist.items" :key="item.id" class="wishlist-item d-flex align-items-center mb-3">
            <img :src="getImageUrl(item)" class="wishlist-item-img me-3" alt="Imagem do produto" />
            <div class="flex-grow-1">
              <div class="fw-bold text-primary">{{ item.name }}</div>
              <div class="text-secondary small mb-1">{{ item.category?.name || item.category_name || 'Categoria não informada' }}</div>
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

const props = defineProps({ open: Boolean });
const emit = defineEmits(['close']);
const wishlist = useWishlistStore();
const cart = useCartStore();

const close = () => emit('close');
const BASE_URL = import.meta.env.VITE_API_URL || '';
const getImageUrl = (product) =>
  product.image_path ? BASE_URL + (product.image_path.startsWith('/') ? '' : '/') + product.image_path : '/placeholder-product.png';

function addToCart(product) {
  const precoFinal = product.discount
    ? Number(product.price) * (1 - product.discount.discount_percentage / 100)
    : Number(product.price);
  cart.addItem(product.id, 1, precoFinal);
  wishlist.remove(product.id);
}
</script>

<style scoped>
.wishlist-drawer-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  z-index: 2000;
  display: flex;
  justify-content: flex-end;
}

.wishlist-drawer {
  width: 370px;
  max-width: 100vw;
  height: 100vh;
  background: #ffffff; /* Fundo branco */
  box-shadow: -4px 0 32px rgba(57, 155, 255, 0.15); /* Sombra azul */
  border-left: 2px solid #399bff; /* Borda azul */
  display: flex;
  flex-direction: column;
  animation: slideInDrawer 0.42s cubic-bezier(0.4, 0, 0.2, 1);
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

.wishlist-drawer-header {
  padding: 1.2rem 1.5rem 1rem 1.5rem;
  background: linear-gradient(90deg, #399bff, #8f5fe8); /* Gradiente azul-roxo */
  color: #ffffff; /* Texto branco */
  font-weight: 700;
  font-size: 1.2rem;
  border-bottom: 1px solid #399bff;
}

.wishlist-drawer-body {
  flex: 1 1 auto;
  overflow-y: auto;
  padding: 1.5rem;
}

.wishlist-item-img {
  width: 56px;
  height: 56px;
  object-fit: cover;
  border-radius: 0.7rem;
  border: 2px solid #399bff; /* Borda azul */
  box-shadow: 0 2px 8px rgba(57, 155, 255, 0.2); /* Sombra leve */
}

.wishlist-item {
  background: #f8f9fa; /* Fundo claro */
  border-radius: 1rem;
  padding: 0.7rem 1rem;
  box-shadow: 0 2px 8px rgba(57, 155, 255, 0.1); /* Sombra leve */
  transition: box-shadow 0.2s, transform 0.2s;
}

.wishlist-item:hover {
  box-shadow: 0 4px 16px rgba(57, 155, 255, 0.2); /* Sombra mais forte */
  transform: translateY(-2px);
}

.btn-outline-danger {
  border-color: #ff6b6b;
  color: #ff6b6b;
}

.btn-outline-danger:hover {
  background: #ff6b6b;
  color: #ffffff;
}

.btn-outline-primary {
  border-color: #399bff;
  color: #399bff;
}

.btn-outline-primary:hover {
  background: #399bff;
  color: #ffffff;
}
</style>