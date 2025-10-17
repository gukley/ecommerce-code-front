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
  if (produto.value) wishlist.toggle(produto.value);
};

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
    return (produto.price * (1 - produto.discount.discount_percentage / 100)).toFixed(2)
  }
  return Number(produto.price).toFixed(2)
}
</script>

<template>
  <div class="product-detail-page min-vh-100 py-5 d-flex align-items-center justify-content-center">
    <div class="card-glass container p-4 shadow-lg animate__fadeIn">
      <button
        @click="$router.push('/produtos')"
        class="btn btn-outline-back mb-4 d-flex align-items-center gap-2"
        aria-label="Voltar para página de produtos"
      >
        <i class="bi bi-arrow-left"></i> Voltar para Produtos
      </button>

      <div v-if="loading" class="text-center py-5" aria-live="polite" aria-busy="true">
        <div class="spinner-border text-accent" role="status" aria-hidden="true"></div>
        <span class="visually-hidden">Carregando...</span>
      </div>

      <div v-else-if="produto" class="row g-5 align-items-start">
        <div class="col-md-6 text-center">
          <div class="image-glass">
            <img
              :src="produto.image_path ? BASE_URL + (produto.image_path.startsWith('/') ? '' : '/') + produto.image_path : '/placeholder-product.png'"
              class="img-fluid rounded-4 shadow-lg product-image animate__zoomIn"
              :alt="`Imagem do produto: ${produto.name}`"
              loading="lazy"
            />
          </div>
        </div>
        <div class="col-md-6">
          <h2 class="fw-bold mb-3 product-title">{{ produto.name }}</h2>
          <div class="product-price mb-3">
            <span v-if="produto.discount && produto.discount.discount_percentage > 0">
              <span class="product-price-original">
                <del>R$ {{ Number(produto.price).toFixed(2) }}</del>
              </span>
              <span class="product-price-discount ms-2">
                R$ {{ discountedPrice(produto) }}
              </span>
              <span class="badge badge-discount ms-2">
                -{{ produto.discount.discount_percentage }}%
              </span>
            </span>
            <span v-else>
              R$ {{ Number(produto.price).toFixed(2) }}
            </span>
          </div>
          <p class="mb-4 product-desc" v-html="descricaoFormatada"></p>

          <div class="mb-3">
            <span class="badge badge-stock me-2" v-if="produto.stock > 0" aria-live="polite">
              Em estoque: {{ produto.stock }}
            </span>
            <span class="badge badge-outstock" v-else>Produto Esgotado</span>
          </div>

          <!-- Botão de favoritar -->
          <button
            class="btn btn-fav-detail mb-3 me-3"
            :aria-label="isFavorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'"
            @click="toggleWishlist"
            :disabled="!produto"
            type="button"
          >
            <i :class="isFavorited ? 'bi bi-heart-fill' : 'bi bi-heart'" class="fs-4"></i>
          </button>

          <!-- Seleção de quantidade -->
          <div class="mb-3 d-flex align-items-center gap-2">
            <label for="qty-input" class="me-2 mb-0">Quantidade:</label>
            <input
              id="qty-input"
              type="number"
              class="form-control qty-input-detail"
              v-model.number="quantidade"
              :min="1"
              :max="produto.stock"
              :disabled="produto.stock === 0"
              aria-live="polite"
              aria-label="Quantidade do produto"
            />
          </div>

          <button
            class="btn btn-main-action px-4 py-2"
            :disabled="produto.stock === 0"
            @click="adicionarAoCarrinho"
            type="button"
            aria-disabled="produto.stock === 0"
          >
            <span class="cart-icon-glow">
              <i class="bi bi-cart-plus me-2"></i>
            </span>
            Adicionar ao Carrinho
          </button>
        </div>
      </div>

      <div v-else class="alert alert-danger text-center mt-5" role="alert">
        Produto não encontrado.
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700&family=Rajdhani:wght@600&display=swap');
.product-detail-page {
  background-color: #f9f9f9; /* Fundo claro */
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
}

.card-glass {
  background: #ffffff; /* Fundo branco */
  border-radius: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1); /* Sombra leve */
  border: 1.5px solid #e0e0e0; /* Borda cinza clara */
  padding: 2rem;
  transition: box-shadow 0.2s, transform 0.2s;
}

.image-glass {
  background: #ffffff; /* Fundo branco */
  border-radius: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1); /* Sombra leve */
  padding: 1rem;
  border: 1.5px solid #e0e0e0; /* Borda cinza clara */
  transition: box-shadow 0.22s, transform 0.22s;
}
.image-glass:hover {
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2); /* Sombra mais forte ao passar o mouse */
  transform: scale(1.04) translateY(-3px);
}

.product-image {
  max-width: 420px;
  max-height: 420px;
  object-fit: contain;
  background: #f8f9fa; /* Fundo cinza claro */
  border: 2px solid #e0e0e0; /* Borda cinza clara */
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1); /* Sombra leve */
  transition: box-shadow 0.18s, transform 0.22s;
}
.product-image:hover {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2); /* Sombra mais forte */
  transform: scale(1.05) translateY(-4px);
}

.product-title {
  color: #333333; /* Texto escuro */
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  margin-bottom: 1rem;
}

.product-price {
  color: #399bff; /* Azul para preço */
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.product-price-original {
  color: #b0b0b0; /* Cinza para preço original */
  font-size: 1.05rem;
  text-decoration: line-through;
}
.product-price-discount {
  color: #e53935; /* Vermelho para preço com desconto */
  font-size: 1.2rem;
  font-weight: 700;
}
.badge-discount {
  background: linear-gradient(90deg, #399bff 0%, #e53935 100%);
  color: #ffffff; /* Texto branco */
  font-weight: 700;
  border-radius: 8px;
  font-size: 0.95rem;
  padding: 0.3rem 0.8rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* Sombra leve */
}

.product-desc {
  color: #666666; /* Texto cinza */
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.badge-stock {
  background: #399bff; /* Fundo azul */
  color: #ffffff; /* Texto branco */
  font-weight: 700;
  font-size: 1rem;
  border-radius: 12px;
  padding: 0.5rem 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* Sombra leve */
}
.badge-outstock {
  background: #e53935; /* Fundo vermelho */
  color: #ffffff; /* Texto branco */
  font-weight: 700;
  font-size: 1rem;
  border-radius: 12px;
  padding: 0.5rem 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* Sombra leve */
}

.btn-main-action {
  background: #399bff; /* Fundo azul */
  color: #ffffff; /* Texto branco */
  border: none;
  font-size: 1.1rem;
  border-radius: 50px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* Sombra leve */
  transition: all 0.2s;
  font-weight: 700;
  padding: 0.7rem 1.5rem;
}
.btn-main-action:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.btn-main-action:hover,
.btn-main-action:focus {
  background: #555555; /* Fundo mais escuro ao passar o mouse */
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2); /* Sombra mais forte */
}

.btn-fav-detail {
  background: #ffffff; /* Fundo branco */
  border: 2px solid #399bff; /* Borda azul */
  color: #399bff; /* Ícone azul */
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* Sombra leve */
  transition: background 0.2s, color 0.2s, transform 0.2s;
}
.btn-fav-detail:hover,
.btn-fav-detail:focus {
  background: #399bff; /* Fundo azul ao passar o mouse */
  color: #ffffff; /* Ícone branco */
  transform: scale(1.1);
}

.qty-input-detail {
  width: 90px;
  border-radius: 1rem;
  border: 1.5px solid #e0e0e0; /* Borda cinza clara */
  background: #ffffff; /* Fundo branco */
  color: #333333; /* Texto escuro */
  font-size: 1rem;
  padding: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05); /* Sombra leve */
  transition: border 0.2s, box-shadow 0.2s;
}
.qty-input-detail:focus {
  border-color: #399bff; /* Borda azul ao focar */
  box-shadow: 0 0 0 3px rgba(57, 155, 255, 0.2); /* Destaque azul */
  outline: none;
}

.btn-outline-back {
  background: none;
  border: 2px solid #399bff; /* Borda azul */
  color: #399bff; /* Texto azul */
  font-weight: 600;
  border-radius: 18px;
  padding: 0.5rem 1.2rem;
  transition: background 0.2s, color 0.2s, border-color 0.2s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05); /* Sombra leve */
}
.btn-outline-back:hover,
.btn-outline-back:focus {
  background: #399bff; /* Fundo azul ao passar o mouse */
  color: #ffffff; /* Texto branco */
  border-color: #555555; /* Borda mais escura */
}

.spinner-border.text-accent {
  color: #a362ff;
  border-color: #a362ff transparent #a362ff transparent;
}

/* Animations */
.animate__fadeIn {
  animation: fadeIn 0.7s;
}
.animate__zoomIn {
  animation: zoomIn 0.4s;
}
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.97);}
  to { opacity: 1; transform: scale(1);}
}
@keyframes zoomIn {
  from { opacity: 0; transform: scale(0.93);}
  to { opacity: 1; transform: scale(1);}
}

@media (max-width: 768px) {
  .card-glass {
    padding: 1.2rem 0.5rem 1.5rem 0.5rem;
    border-radius: 1.5rem;
  }
  .product-title {
    font-size: 1.2rem;
  }
  .product-price {
    font-size: 1rem;
  }
  .product-image {
    max-width: 93vw;
    max-height: 275px;
  }
}
</style>