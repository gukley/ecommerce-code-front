<template>
  <div class="product-detail-page bg-dark text-white min-vh-100 py-5">
    <div class="container">
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status"></div>
      </div>
      <div v-else-if="produto" class="row g-5 align-items-start">
        <div class="col-md-6 text-center">
          <img :src="produto.image_path ? BASE_URL + produto.image_path : '/placeholder-product.png'" class="img-fluid rounded-4 shadow-lg product-image" alt="Imagem do produto" />
        </div>
        <div class="col-md-6">
          <h2 class="fw-bold mb-3">{{ produto.name }}</h2>
          <h4 class="text-primary mb-3">R$ {{ produto.price.toFixed(2) }}</h4>
          <p class="mb-4">{{ produto.description }}</p>
          <div class="mb-3">
            <span class="badge bg-success me-2" v-if="produto.stock > 0">Em estoque: {{ produto.stock }}</span>
            <span class="badge bg-danger" v-else>Produto Esgotado</span>
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
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getAllProducts } from '@/services/apiService';
import { useCartStore } from '@/stores/cartStore';

const BASE_URL = 'http://35.196.79.227:8000';
const route = useRoute();
const produto = ref(null);
const loading = ref(true);
const cart = useCartStore();

onMounted(async () => {
  loading.value = true;
  const id = route.params.id;
  const produtos = await getAllProducts();
  produto.value = produtos.find(p => String(p.id) === String(id));
  loading.value = false;
});

function adicionarAoCarrinho() {
  if (produto.value && produto.value.stock > 0) {
    cart.addItem(produto.value.id, 1, Number(produto.value.price));
    alert('Produto adicionado ao carrinho!');
  }
}
</script>

<style scoped>
.product-detail-page {
  background: linear-gradient(135deg, #18182a 60%, #23233a 100%);
}
.product-image {
  max-width: 420px;
  max-height: 420px;
  object-fit: contain;
  background: #23233a;
  border: 2px solid #8f5fe8;
  box-shadow: 0 8px 32px rgba(143, 95, 232, 0.10);
}
</style> 