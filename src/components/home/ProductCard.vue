<template> 
  <div class="card product-card text-dark border-0 rounded-4 h-100 text-decoration-none" style="cursor: pointer">
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
          <span class="product-price-normal">
            R$ {{ formatPrice(produto.price) }}
          </span>
        </span>
      </div>

    <div class="mb-3 text-warning">
      <i class="bi bi-star-fill me-1" v-for="i in produto.estrelas" :key="i"></i>
    </div>

    <div class="mt-auto"> 
      <button
        class="btn btn-cart w-100 rounded-pill"
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
@import '@/styles/theme.css';

.product-card {
  background: #ffffff; /* Fundo branco */
  border-radius: 1.2rem;
  box-shadow: 0 6px 20px rgba(57, 155, 255, 0.15); /* Sombra mais visível */
  border: 1.5px solid #d6d8db; /* Borda um pouco mais escura */
  padding: 1.5rem 1.5rem 2rem 1.5rem;
  color: #232e47;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  min-height: 420px;
  transition: box-shadow 0.22s, border 0.22s, transform 0.22s;
}
.product-card:hover {
  box-shadow: 0 12px 36px rgba(57, 155, 255, 0.25); /* Sombra mais forte ao passar o mouse */
  border-color: #399bff; /* Destaque na borda ao passar o mouse */
  transform: translateY(-6px) scale(1.02);
}
.card-img-top {
  width: 100%;
  max-width: 260px;
  height: 220px;
  object-fit: cover;
  border-radius: 1rem 1rem 0 0;
  background: #f8f9fa;
  box-shadow: 0 2px 8px rgba(57, 155, 255, 0.1); /* Sombra leve na imagem */
  margin-bottom: 1rem;
  margin-top: 18px;
}
.card-title {
  color: #232e47;
  font-size: 1.18rem;
  font-weight: 700;
  margin-bottom: 0.7rem;
  text-align: left;
  width: 100%;
  letter-spacing: 0.5px;
}
.product-price-box {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.7rem;
  margin-top: 0.2rem;
  width: 100%;
  text-align: left;
  letter-spacing: 0.5px;
}
.product-price-original {
  color: #b0b0b0;
  font-size: 1.05rem;
  font-weight: 500;
}
.product-price-discount {
  color: #e53935;
  font-size: 1.35rem;
  font-weight: 700;
  background: none;
}
.product-price-normal {
  color: #399bff;
  font-size: 1.35rem;
  font-weight: 700;
}
.badge-discount {
  background: linear-gradient(90deg, #399bff 0%, #e53935 100%);
  color: #fff;
  font-size: 1.05rem;
  font-weight: 700;
  border-radius: 8px;
  padding: 0.25em 0.85em;
  box-shadow: 0 2px 8px rgba(57, 155, 255, 0.2);
  letter-spacing: 0.5px;
}
.btn-cart {
  border: none;
  color: #fff;
  background: linear-gradient(90deg, #399bff 0%, #8f5fe8 100%);
  font-weight: 700;
  font-size: 1.09rem;
  transition: background 0.18s, color 0.18s, box-shadow 0.18s;
  box-shadow: 0 2px 8px rgba(57, 155, 255, 0.2);
  padding: 0.55rem 0;
}
.btn-cart:hover,
.btn-cart:focus {
  background: linear-gradient(90deg, #8f5fe8 0%, #399bff 100%);
  color: #fff;
  box-shadow: 0 4px 14px rgba(57, 155, 255, 0.4);
}
.btn-cart:disabled {
  background: #e5e7eb;
  color: #b0b0b0;
  cursor: not-allowed;
}
.btn-fav {
  position: absolute;
  top: 18px;
  left: 18px;
  z-index: 3;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(57, 155, 255, 0.2);
  padding: 6px 8px;
  border: 2px solid #d6d8db; /* Borda mais visível */
  color: #399bff;
  transition: background 0.18s, color 0.18s, border 0.18s;
}
.btn-fav:hover {
  background: #399bff;
  color: #fff;
  border-color: #399bff;
}
.category-thumb {
  border: 1.5px solid #399bff !important;
}
.position-relative {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}
@media (max-width: 991.98px) {
  .products-grid {
    gap: 1rem;
    padding: 1rem 0;
  }
  .product-card {
    max-width: 100%;
    min-width: 0;
    margin-bottom: 1.2rem;
    flex: 0 0 48%;
    padding: 1rem;
    min-height: 340px;
  }
  .card-img-top {
    max-width: 180px;
    height: 140px;
  }
}
@media (max-width: 600px) {
  .products-grid {
    gap: 0.7rem;
    padding: 0.5rem 0;
  }
  .product-card {
    max-width: 100%;
    min-width: 0;
    margin-bottom: 0.7rem;
    flex: 0 0 100%;
    padding: 0.7rem;
    border-radius: 0.7rem;
    min-height: 260px;
  }
  .card-img-top {
    max-width: 120px;
    height: 90px;
  }
}
</style>