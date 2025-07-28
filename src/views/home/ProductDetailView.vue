<template>
  <div class="product-detail-page bg-dark text-white min-vh-100 py-5">
    <div class="container">
      <button @click="$router.push('/produtos')" class="btn btn-outline-primary mb-4 d-flex align-items-center gap-2">
        <i class="bi bi-arrow-left"></i> Voltar para Produtos
      </button>
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status"></div>
      </div>
      <div v-else-if="produto" class="row g-5 align-items-start">
        <div class="col-md-6 text-center">
          <img :src="produto.image_path ? BASE_URL + produto.image_path : '/placeholder-product.png'" class="img-fluid rounded-4 shadow-lg product-image" alt="Imagem do produto" />
        </div>
        <div class="col-md-6">
          <h2 class="fw-bold mb-3">{{ produto.name }}</h2>
          <h4 class="text-primary mb-3">R$ {{ Number(produto.price).toFixed(2) }}</h4>
          <p class="mb-4" v-html="descricaoFormatada"></p>
          <div class="mb-3">
            <span class="badge bg-success me-2" v-if="produto.stock > 0">Em estoque: {{ produto.stock }}</span>
            <span class="badge bg-danger" v-else>Produto Esgotado</span>
          </div>
          <!-- Botão de favoritar -->
          <button
            class="btn btn-fav-detail mb-3 me-3"
            :aria-label="isFavorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'"
            @click="toggleWishlist"
            :disabled="!produto"
          >
            <i :class="isFavorited ? 'bi bi-heart-fill' : 'bi bi-heart'" class="fs-4"></i>
          </button>
          <!-- Seleção de quantidade -->
          <div class="mb-3 d-flex align-items-center">
            <label for="qty-input" class="me-2 mb-0">Quantidade:</label>
            <input
              id="qty-input"
              type="number"
              class="form-control qty-input-detail"
              v-model.number="quantidade"
              :min="1"
              :max="produto.stock"
              :disabled="produto.stock === 0"
            />
          </div>
          <button class="btn btn-main-action px-4 py-2" :disabled="produto.stock === 0" @click="adicionarAoCarrinho">
            <i class="bi bi-cart-plus me-2"></i> Adicionar ao Carrinho
          </button>
        </div>
      </div>
      <div v-else class="alert alert-danger text-center mt-5">Produto não encontrado.</div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { getProductById } from '@/services/apiService';
import { useCartStore } from '@/stores/cartStore';
import { useWishlistStore } from '@/stores/wishlistStore';
import { computed, ref, onMounted } from 'vue';

const BASE_URL = 'http://35.196.79.227:8000';
const route = useRoute();
const produto = ref(null);
const loading = ref(true);
const cart = useCartStore();
const wishlist = useWishlistStore();
const quantidade = ref(1);

const isFavorited = computed(() => produto.value && wishlist.isInWishlist(produto.value.id));
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
  const id = route.params.id;
  try {
    produto.value = await getProductById(id);
  } catch (e) {
    produto.value = null;
  }
  loading.value = false;
});

function adicionarAoCarrinho() {
  if (produto.value && produto.value.stock > 0) {
    cart.addItem(produto.value.id, quantidade.value, Number(produto.value.price));
    alert('Produto adicionado ao carrinho!');
  }
}
</script>

<style scoped>
.product-detail-page {
  background: linear-gradient(135deg, #18182a 60%, #23233a 100%);
}
.product-image {
  max-width: 540px;
  max-height: 540px;
  object-fit: contain;
  background: #23233a;
  border: 2px solid #8f5fe8;
  box-shadow: 0 8px 32px rgba(143, 95, 232, 0.10);
}
.btn-main-action {
  background: linear-gradient(90deg, #a362ff, #8f5fe8);
  color: white;
  border: none;
  font-size: 1.15rem;
  border-radius: 50px;
  box-shadow: 0 5px 20px rgba(163, 98, 255, 0.4);
  transition: all 0.3s ease;
  font-weight: 600;
}
.btn-main-action:hover, .btn-main-action:focus {
  background: linear-gradient(90deg, #8f5fe8, #7b4fe0);
  color: #fff;
  transform: translateY(-2px) scale(1.03);
  box-shadow: 0 8px 25px rgba(143, 95, 232, 0.18);
}
.btn-fav-detail {
  background: rgba(34,34,34,0.82);
  border: none;
  color: #ff4f8f;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(143, 95, 232, 0.10);
  transition: background 0.2s, color 0.2s, transform 0.15s;
  z-index: 2;
  font-size: 1.5rem;
}
.btn-fav-detail:hover, .btn-fav-detail:focus {
  background: #ff4f8f;
  color: #fff;
  transform: scale(1.08);
}
.btn-fav-detail .bi-heart-fill {
  color: #ff4f8f;
}
.btn-fav-detail .bi-heart {
  color: #fff;
}
.qty-input-detail {
  width: 90px;
  border-radius: 1.5rem;
  border: 2px solid #8f5fe8;
  background: #23233a;
  color: #fff;
  font-size: 1.1rem;
  font-family: 'Rajdhani', Arial, sans-serif;
  box-shadow: 0 2px 8px rgba(143, 95, 232, 0.10);
  padding: 0.4rem 1rem;
  transition: border 0.2s, box-shadow 0.2s;
}
.qty-input-detail:focus {
  border-color: #00ffe1;
  box-shadow: 0 0 0 2px #8f5fe833;
  outline: none;
}
</style> 