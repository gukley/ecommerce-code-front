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
          <h4 class="product-price mb-3">R$ {{ Number(produto.price).toFixed(2) }}</h4>
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
  background: linear-gradient(135deg, #18182a 60%, #23233a 100%);
  min-height: 100vh;
  font-family: 'Rajdhani', Arial, sans-serif;
}

.card-glass {
  background: rgba(30, 33, 51, 0.93);
  border-radius: 2.4rem;
  box-shadow: 0 24px 64px #a362ff44, 0 6px 24px #8f5fe844;
  border: 1.5px solid #a362ff33;
  backdrop-filter: blur(8px);
  transition: box-shadow 0.2s, background 0.2s;
}

.image-glass {
  background: rgba(143, 95, 232, 0.11);
  border-radius: 2rem;
  box-shadow: 0 8px 32px #8f5fe822, 0 4px 15px #a362ff22;
  padding: 18px;
  display: inline-block;
  margin-bottom: 10px;
  border: 1.5px solid #a362ff44;
  backdrop-filter: blur(2px);
  transition: box-shadow 0.22s, transform 0.22s;
}
.image-glass:hover {
  box-shadow: 0 12px 40px #a362ff77, 0 8px 22px #8f5fe877;
  transform: scale(1.04) translateY(-3px);
}

.product-image {
  max-width: 420px;
  max-height: 420px;
  object-fit: contain;
  background: #23233a;
  border: 2px solid #8f5fe8;
  box-shadow: 0 8px 32px rgba(143, 95, 232, 0.10);
  transition: box-shadow 0.18s, transform 0.22s;
}
.product-image:hover {
  box-shadow: 0 16px 50px #a362ffcc, 0 14px 32px #8f5fe899;
  transform: scale(1.05) translateY(-4px);
}

.product-title {
  color: #a362ff;
  font-size: 2.3rem;
  font-family: 'Orbitron', Arial, sans-serif;
  letter-spacing: 1px;
  text-shadow: 0 2px 16px #a362ff99, 0 1px 7px #8f5fe8cc;
  background: linear-gradient(90deg, #a362ff 30%, #8f5fe8 90%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.product-price {
  color: #8f5fe8;
  font-size: 2rem;
  font-weight: 700;
  text-shadow: 0 1px 8px #8f5fe888;
  margin-bottom: 1rem;
}

.product-desc {
  color: #e0e6f8;
  font-size: 1.16rem;
  line-height: 1.7;
  opacity: 0.98;
  font-family: 'Rajdhani', Arial, sans-serif;
}

.badge-stock {
  background: linear-gradient(90deg, #00ffe1 65%, #00bfff 100%);
  color: #23233a;
  font-weight: 700;
  font-size: 1.08rem;
  border-radius: 15px;
  padding: 8px 19px;
  box-shadow: 0 2px 10px #00ffe144;
  border: none;
  text-shadow: 0 1px 5px #00ffe1cc;
}
.badge-outstock {
  background: linear-gradient(90deg, #ff4f8f 70%, #ff7aac 100%);
  color: #fff;
  font-weight: 700;
  font-size: 1.08rem;
  border-radius: 15px;
  padding: 8px 19px;
  box-shadow: 0 2px 10px #ff4f8f44;
}

.btn-main-action {
  background: linear-gradient(90deg, #a362ff, #8f5fe8 90%);
  color: #23233a;
  border: none;
  font-size: 1.22rem;
  border-radius: 50px;
  box-shadow: 0 6px 22px #a362ff99;
  transition: all 0.22s;
  font-weight: 700;
  letter-spacing: 0.7px;
  text-shadow: 0 1px 8px #8f5fe888;
  will-change: transform;
  position: relative;
  overflow: hidden;
}
.btn-main-action:disabled {
  opacity: 0.47;
  cursor: not-allowed;
}
.btn-main-action:hover,
.btn-main-action:focus {
  background: linear-gradient(90deg, #8f5fe8, #a362ff 90%);
  color: #fff;
  transform: translateY(-3px) scale(1.04);
  box-shadow: 0 12px 40px #a362ffcc;
  outline: none;
}
.cart-icon-glow {
  display: inline-block;
  vertical-align: middle;
  animation: glow-cart 1.7s infinite alternate;
}
@keyframes glow-cart {
  0% { text-shadow: 0 0 8px #8f5fe8, 0 0 16px #a362ff44;}
  100% { text-shadow: 0 0 16px #a362ff, 0 0 24px #8f5fe8;}
}

.btn-fav-detail {
  background: #23233a;
  border: 2px solid #ff4f8f33;
  color: #ff4f8f;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px #ff4f8f44;
  transition: background 0.22s, color 0.22s, transform 0.18s;
  z-index: 2;
  font-size: 1.55rem;
}
.btn-fav-detail:hover,
.btn-fav-detail:focus {
  background: #ff4f8f;
  color: #fff;
  transform: scale(1.13);
  outline: none;
  box-shadow: 0 4px 16px #ff4f8f88;
}
.btn-fav-detail .bi-heart-fill {
  color: #ff4f8f;
}
.btn-fav-detail .bi-heart {
  color: #fff;
}

.qty-input-detail {
  width: 90px;
  border-radius: 1.7rem;
  border: 2px solid #8f5fe8;
  background: #18182a;
  color: #fff;
  font-size: 1.13rem;
  font-family: 'Rajdhani', Arial, sans-serif;
  box-shadow: 0 2px 8px #a362ff44;
  padding: 0.4rem 1rem;
  transition: border 0.22s, box-shadow 0.22s, background 0.2s;
}
.qty-input-detail:focus {
  border-color: #00ffe1;
  box-shadow: 0 0 0 3px #8f5fe899;
  outline: none;
  background: #23233a;
}

.btn-outline-back {
  background: none;
  border: 2px solid #a362ff;
  color: #a362ff;
  font-weight: 600;
  border-radius: 18px;
  padding: 0.5rem 1.2rem;
  transition: background 0.22s, color 0.22s, border-color 0.18s;
  box-shadow: 0 2px 8px #a362ff44;
}
.btn-outline-back:hover,
.btn-outline-back:focus {
  background: #a362ff;
  color: #23233a;
  border-color: #8f5fe8;
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
    font-size: 1.4rem;
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