<template> 
  <div class="card product-card text-white border-0 rounded-4 h-100 text-decoration-none" style="cursor: pointer">
    <div class="position-relative"> 
      <router-link
        :to="`/produto/${produto.id}`"
        style="display: block"
        class="text-decoration-none"
      >
        <img
          :src="imageUrl"
          class="card-img-top rounded-top-4"
          :alt="produto.name"
          style="height: 200px; object-fit: cover"
        />
      </router-link>
      <button
        class="btn btn-fav position-absolute top-0 start-0 m-2"
        @click.stop.prevent="toggleWishlist"
        :aria-label="isFavorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'"
        style="z-index: 3;"
      >
        <i :class="isFavorited ? 'bi bi-heart-fill' : 'bi bi-heart'" class="fs-4"></i>
      </button>

      <span
        v-if="produto.status === 'novo'"
        class="badge bg-success position-absolute top-0 end-0 m-2"
        >NOVO</span
      >
      <span
        v-if="produto.stock === 0"
        class="badge bg-danger position-absolute top-0 end-0 m-2"
        >Esgotado</span
      >
      <span
        v-if="showDiscount && produto.discount && produto.discount.discount_percentage > 0"
        class="badge badge-discount position-absolute top-0 end-0 m-2"
      >
        -{{ produto.discount.discount_percentage }}%
      </span>
    </div>
    <div class="card-body d-flex flex-column flex-grow-1"> 
      <!-- router-link só no título -->
      <router-link
        :to="`/produto/${produto.id}`"
        class="text-decoration-none"
      >
        <h5 class="card-title fw-bold">{{ produto.name }}</h5>
      </router-link>
      <p class="text-muted mb-1 d-flex align-items-center"> 
        <img
          v-if="produto.category?.image_path"
          :src="BASE_URL + produto.category.image_path"
          alt="Categoria"
          class="category-thumb me-2"
          style="width: 28px; height: 28px; object-fit: cover; border-radius: 50%; border: 1.5px solid #8f5fe8"
        />
        {{ produto.category?.name }}
      </p>

      <div class="mb-2 product-price-box">
        <span v-if="showDiscount && produto.discount && produto.discount.discount_percentage > 0">
          <span class="product-price-original">
            <del>R$ {{ formatPrice(produto.price) }}</del>
          </span>
          <span class="product-price-discount ms-2">
            R$ {{ formatPrice(discountedPrice(produto)) }}
          </span>
          <span class="badge badge-discount ms-2">
            -{{ produto.discount.discount_percentage }}%
          </span>
        </span>
        <span v-else>
          R$ {{ formatPrice(produto.price) }}
        </span>
      </div>

    <div class="mb-3 text-warning">
      <i class="bi bi-star-fill me-1" v-for="i in produto.estrelas" :key="i"></i>
    </div>

    <div class="mt-auto"> 
      <button
        class="btn btn-outline-primary w-100 rounded-pill"
        :disabled="produto.stock === 0"
        @click.stop.prevent="adicionarAoCarrinho"
      > 
        <i class="bi bi-cart-plus me-2"></i>
        Adicionar ao Carrinho
      </button>
    </div>
  </div>
</div>
</template>

<script setup> 
import { computed } from 'vue'
import { useCartStore } from '@/stores/cartStore'
import { useWishlistStore } from '@/stores/wishlistStore';

const BASE_URL = import.meta.env.VITE_API_URL;

const props = defineProps({ 
    produto: Object,
    showDiscount: {
      type: Boolean,
      default: false
    }
})

const imageUrl = computed(() => {
  return props.produto.image_path
    ? BASE_URL + (props.produto.image_path.startsWith('/') ? '' : '/') + props.produto.image_path
    : '/placeholder-product.png';
});

const cart = useCartStore()
const wishlist = useWishlistStore();
const isFavorited = computed(() => wishlist.isInWishlist(props.produto.id));
const toggleWishlist = () => {
  wishlist.toggle(props.produto);
};

const precoFinal = computed(() => { 
    if (props.produto.desconto) { 
        const desconto = Number(props.produto.price) * (props.produto.desconto / 100)
        return (Number(props.produto.price) - desconto).toFixed(2)
    }
    return Number(props.produto.price).toFixed(2)
})

const discountedPrice = (produto) => {
  if (produto.discount && produto.discount.discount_percentage > 0) {
    return (produto.price * (1 - produto.discount.discount_percentage / 100)).toFixed(2)
  }
  return produto.price
}

const formatPrice = (val) => {
  return Number(val).toLocaleString('pt-BR', { style: 'decimal', minimumFractionDigits: 2 })
}

const adicionarAoCarrinho = () => { 
  const productId = props.produto.id
  const quantity = 1
  const unitPrice = Number(precoFinal.value)
  const productStock = props.produto.stock 

  if (productStock <= 0) {
    return
  }
  cart.addItem(productId, quantity, unitPrice, productStock)
}
</script>

<style scoped> 
.product-card {
    transition: transform 0.3s cubic-bezier(.4,2,.3,1), box-shadow 0.3s cubic-bezier(.4,2,.3,1);
    background: linear-gradient(145deg, #2b1f4d, #0b2c35) !important;
    color: white;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    font-family: 'Poppins', 'Inter', Arial, sans-serif;
    box-shadow: 0 2px 16px rgba(143, 95, 232, 0.10);
    border-radius: 1.5rem;
    padding-bottom: 1rem;
}

.product-card:hover {
    transform: translateY(-8px) scale(1.04);
    box-shadow: 0 8px 32px rgba(143, 95, 232, 0.25);
}

.card-title {
    font-family: 'Manrope', 'Poppins', Arial, sans-serif;
    font-size: 1.2rem;
    font-weight: 700;
    color: #00ffe1;
    letter-spacing: 0.5px;
    margin-bottom: 0.5rem;
}

.text-muted.mb-1 {
    font-size: 0.95rem;
    color: #b0b0c0 !important;
    margin-bottom: 0.7rem !important;
}

.fw-bold.text-primary.fs-5 {
    color: #8f5fe8 !important;
    font-size: 1.35rem !important;
    font-family: 'Orbitron', 'Rajdhani', Arial, sans-serif;
    letter-spacing: 0.5px;
}

.text-muted.text-decoration-line-through.ms-2 {
    font-size: 1rem;
    color: #b0b0c0 !important;
    margin-left: 0.7rem !important;
}

.btn-outline-primary {
    border-radius: 2rem;
    font-family: 'Rajdhani', Arial, sans-serif;
    font-weight: 600;
    font-size: 1.08rem;
    padding: 0.7rem 1.2rem;
    background: linear-gradient(90deg, #2b1f4d 60%, #8f5fe8 100%);
    color: #00ffe1;
    border: 2px solid #8f5fe8;
    box-shadow: 0 2px 8px rgba(143, 95, 232, 0.10);
    transition: all 0.2s cubic-bezier(.4,2,.3,1);
}

.btn-outline-primary:hover, .btn-outline-primary:focus {
    background: linear-gradient(90deg, #8f5fe8 60%, #00ffe1 100%);
    color: #1a1a2e;
    border-color: #00ffe1;
    box-shadow: 0 4px 16px rgba(0,255,225,0.15);
    transform: translateY(-2px) scale(1.03);
}

.card-body {
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    padding: 1.2rem 1.2rem 0.5rem 1.2rem;
}

.mt-auto {
    margin-top: auto !important;
}

.mb-2 {
    margin-bottom: 1.1rem !important;
}

.mb-3 {
    margin-bottom: 1.2rem !important;
}

.btn-fav {
  background: rgba(34,34,34,0.82);
  border: none;
  color: #ff4f8f;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(143, 95, 232, 0.10);
  transition: background 0.2s, color 0.2s;
  z-index: 2;
}
.btn-fav:hover, .btn-fav:focus {
  background: #ff4f8f;
  color: #fff;
}
.btn-fav .bi-heart-fill {
  color: #ff4f8f;
}
.btn-fav .bi-heart {
  color: #fff;
}

.product-price-box {
  font-size: 1.18rem;
  font-weight: 700;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 8px;
}
.product-price-original {
  color: #b0b7c3;
  font-size: 1.05rem;
  text-decoration: line-through;
  opacity: 0.7;
}
.product-price-discount {
  color: #00ffe1;
  font-size: 1.22rem;
  font-weight: 800;
}
.badge-discount {
  background: linear-gradient(90deg,#00ffe1 0%,#8f5fe8 100%);
  color: #23233a;
  font-weight: 700;
  border-radius: 8px;
  font-size: 0.98rem;
  padding: 0.22em 0.7em;
  box-shadow: 0 1px 6px #232e4720;
}
</style>