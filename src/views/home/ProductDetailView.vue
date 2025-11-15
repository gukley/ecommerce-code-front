<script setup>
import { useRoute } from 'vue-router';
import { getProductById } from '@/services/apiService';
import { useCartStore } from '@/stores/cartStore';
import { useWishlistStore } from '@/stores/wishlistStore';
import { ref, computed, onMounted } from 'vue';

const BASE_URL = import.meta.env.VITE_API_URL;
const route = useRoute();
const produto = ref(null);
const loading = ref(true);
const cart = useCartStore();
const wishlist = useWishlistStore();
const quantidade = ref(1);

const isFavorited = computed(() =>
  produto.value ? wishlist.isInWishlist(produto.value.id) : false
);

const toggleWishlist = () => {
  if (produto.value) {
    wishlist.toggle(produto.value);
    animateFavorite();
  }
};

// animação sutil no botão de favorito
function animateFavorite() {
  const btn = document.querySelector('.btn-favorite');
  if (btn) {
    btn.classList.add('pulse');
    setTimeout(() => btn.classList.remove('pulse'), 300);
  }
}

const descricaoFormatada = computed(() =>
  produto.value && produto.value.description
    ? produto.value.description.replace(/\n/g, '<br>')
    : ''
);

onMounted(async () => {
  loading.value = true;
  try {
    const id = route.params.id;
    produto.value = await getProductById(id);
  } catch {
    produto.value = null;
  } finally {
    loading.value = false;
  }
});

function adicionarAoCarrinho() {
  if (produto.value && produto.value.stock > 0) {
    const qty = Math.min(Math.max(quantidade.value, 1), produto.value.stock);
    cart.addItem(produto.value.id, qty, Number(produto.value.price));
    alert('Produto adicionado ao carrinho!');
  }
}

function discountedPrice(produto) {
  if (produto.discount && produto.discount.discount_percentage > 0) {
    return (produto.price * (1 - produto.discount.discount_percentage / 100)).toFixed(2);
  }
  return Number(produto.price).toFixed(2);
}
</script>

<template>
  <div class="product-detail-page">
    <div class="container">
      <button
        @click="$router.push('/produtos')"
        class="btn-back"
        aria-label="Voltar para página de produtos"
      >
        <i class="bi bi-arrow-left"></i> Voltar para Produtos
      </button>

      <div v-if="loading" class="loading-container">
        <div class="spinner-border text-primary" role="status"></div>
        <span class="visually-hidden">Carregando...</span>
      </div>

      <div v-else-if="produto" class="product-detail-content">
        <div class="product-image-section">
          <div class="image-container">
            <img
              :src="produto.image_path ? BASE_URL + (produto.image_path.startsWith('/') ? '' : '/') + produto.image_path : '/placeholder-product.png'"
              class="product-image"
              :alt="`Imagem do produto: ${produto.name}`"
              loading="lazy"
            />
          </div>
        </div>

        <div class="product-info-section">
          <h1 class="product-title">{{ produto.name }}</h1>
          <div class="product-price">
            <span v-if="produto.discount && produto.discount.discount_percentage > 0">
              <span class="original-price">R$ {{ Number(produto.price).toFixed(2) }}</span>
              <span class="discounted-price">R$ {{ discountedPrice(produto) }}</span>
              <span class="discount-badge">-{{ produto.discount.discount_percentage }}%</span>
            </span>
            <span v-else>R$ {{ Number(produto.price).toFixed(2) }}</span>
          </div>

          <p class="product-description" v-html="descricaoFormatada"></p>

          <div class="stock-info">
            <span v-if="produto.stock > 0" class="badge-stock">Em estoque: {{ produto.stock }}</span>
            <span v-else class="badge-outstock">Produto Esgotado</span>
          </div>

          <div class="actions">
            <div class="quantity-selector">
              <label for="qty-input">Quantidade:</label>
              <input
                id="qty-input"
                type="number"
                v-model.number="quantidade"
                :min="1"
                :max="produto.stock"
                :disabled="produto.stock === 0"
              />
            </div>

            <button
              class="btn-add-to-cart"
              :disabled="produto.stock === 0"
              @click="adicionarAoCarrinho"
            >
              <i class="bi bi-cart-plus"></i> Adicionar ao Carrinho
            </button>

            <button
              class="btn-favorite"
              :class="{ active: isFavorited }"
              :aria-label="isFavorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'"
              @click="toggleWishlist"
            >
              <i :class="isFavorited ? 'bi bi-heart-fill' : 'bi bi-heart'"></i>
            </button>
          </div>
        </div>
      </div>

      <div v-else class="alert alert-danger">Produto não encontrado.</div>
    </div>
  </div>
</template>

<style scoped>
.product-detail-page {
  background: linear-gradient(135deg, #f8fafc 0%, #e9f1ff 50%, #f3f4fa 100%);
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
  padding: 2rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.btn-back {
  background: none;
  border: none;
  color: #399bff;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.btn-back:hover {
  text-decoration: underline;
}

.loading-container {
  text-align: center;
  margin-top: 5rem;
}

.product-detail-content {
  display: flex;
  gap: 2rem;
  margin-top: 2rem;
}

.product-image-section {
  flex: 1;
}

.image-container {
  background: #ffffff;
  border-radius: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border: 1.5px solid #e0e7ff;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.image-container:hover {
  box-shadow: 0 12px 40px rgba(74, 144, 226, 0.15);
  transform: translateY(-4px);
}

.product-image {
  width: 100%;
  border-radius: 0.5rem;
}

.product-info-section {
  flex: 1;
  background: #ffffff;
  border-radius: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border: 1.5px solid #e0e7ff;
  padding: 2rem;
}

.product-title {
  font-size: 2rem;
  font-weight: 700;
  color: #232e47;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #4a90e2 0%, #6a5ae0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.product-price {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.original-price {
  color: #b0b0b0;
  text-decoration: line-through;
  margin-right: 0.5rem;
  font-size: 1.1rem;
}

.discounted-price {
  color: #4a90e2;
  font-size: 2rem;
  margin-right: 0.5rem;
}

.discount-badge {
  background: linear-gradient(135deg, #6a5ae0 0%, #8f5fe8 100%);
  color: #ffffff;
  padding: 0.4rem 0.8rem;
  border-radius: 0.75rem;
  font-size: 0.95rem;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(106, 90, 224, 0.3);
}

.product-description {
  color: #4b5563;
  line-height: 1.8;
  margin-bottom: 2rem;
  font-size: 1.05rem;
}

.stock-info {
  margin-bottom: 1.5rem; /* + espaço */
}

.badge-stock {
  color: #399bff;
}

.badge-outstock {
  color: #e53935;
}

.actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  padding-top: 1.5rem;
  border-top: 2px solid #e0e7ff;
}

.quantity-selector {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.quantity-selector input {
  width: 60px;
  padding: 0.3rem;
  border: 1px solid #e0e0e0;
  border-radius: 0.5rem;
}

.btn-add-to-cart {
  background: linear-gradient(135deg, #4a90e2 0%, #6a5ae0 100%);
  color: #ffffff;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  cursor: pointer;
  font-weight: 600;
  font-size: 1.05rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(74, 144, 226, 0.3);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-add-to-cart:hover:not(:disabled) {
  background: linear-gradient(135deg, #6a5ae0 0%, #4a90e2 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(74, 144, 226, 0.4);
}

.btn-add-to-cart:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-favorite {
  background: #ffffff;
  border: 2px solid #4a90e2;
  color: #4a90e2;
  font-size: 1.3rem;
  cursor: pointer;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(74, 144, 226, 0.2);
}

.btn-favorite.active {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
  border-color: #ff6b6b;
  color: white;
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
}

.btn-favorite:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 16px rgba(74, 144, 226, 0.3);
}

.btn-favorite.active:hover {
  box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
}

.pulse {
  animation: pulse 0.3s ease;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}


/* Ajustes para telas menores */
@media (max-width: 991px) {
  .product-detail-content {
    flex-direction: column;
    gap: 1.5rem;
  }

  .product-image-section,
  .product-info-section {
    flex: none;
    width: 100%;
  }

  .product-title {
    font-size: 1.5rem;
  }

  .product-price {
    font-size: 1.3rem;
  }

  .product-description {
    font-size: 0.95rem;
  }

  .quantity-selector input {
    width: 50px;
  }

  .btn-add-to-cart {
    font-size: 0.9rem;
    padding: 0.5rem 1rem;
  }

  .btn-favorite {
    width: 36px;
    height: 36px;
    font-size: 1.2rem;
  }
}

@media (max-width: 600px) {
  .product-detail-page {
    padding: 1rem 0.5rem;
  }

  .product-title {
    font-size: 1.3rem;
  }

  .product-price {
    font-size: 1.1rem;
  }

  .product-description {
    font-size: 0.85rem;
  }

  .quantity-selector input {
    width: 45px;
  }

  .btn-add-to-cart {
    font-size: 0.85rem;
    padding: 0.4rem 0.8rem;
  }

  .btn-favorite {
    width: 32px;
    height: 32px;
    font-size: 1rem;
  }

  .related-section {
    padding-top: 1.5rem;
  }

  .related-title {
    font-size: 1rem;
  }
}
</style>
