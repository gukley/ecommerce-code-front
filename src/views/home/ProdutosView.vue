<template>
  <div class="main-layout text-white">
    <Navbar />
    <div class="content-wrapper d-flex">
      <SideBar @categoria-selecionada="categoriaSelecionada = $event" />
      <div class="flex-grow-1 d-flex justify-content-center align-items-start p-4">
        <div class="products-container w-100">
          <div @click="console.log('teste clique')" style="background:#8f5fe8; color:#fff; padding:12px; border-radius:8px; margin-bottom:16px; cursor:pointer; text-align:center;">
            Clique aqui para testar o clique
          </div>
          <h2 class="section-title text-center mb-5 animate-fade-in">
            {{ categoriaSelecionada }}
          </h2>
          <div class="row mb-3">
            <div class="col-12 col-md-6 mb-2 mb-md-0">
              <input
                v-model="termoBusca"
                type="text"
                class="form-control search-bar"
                placeholder="Buscar produtos..."
              />
            </div>
            <div class="col-12 col-md-6">
              <select v-model="ordemSelecionada" class="form-select">
                <option value="">Ordenar por...</option>
                <option value="maior-valor">Maior valor</option>
                <option value="menor-valor">Menor valor</option>
                <option value="az">Nome (A-Z)</option>
                <option value="za">Nome (Z-A)</option>
              </select>
            </div>
          </div>
          <div v-if="produtosFiltrados.length === 0" class="alert alert-info text-center">
            Nenhum produto encontrado para esta categoria.
          </div>
          <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
            <div class="col d-flex" v-for="produto in produtosFiltrados" :key="produto.id">
              <ProductCard
                :produto="produto"
                class="flex-fill product-link"
                @click="console.log('clicou no card', produto.id)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Navbar from '@/components/home/NavBar.vue';
import SideBar from '@/components/home/SideBar.vue';
import ProductCard from '@/components/home/ProductCard.vue';
import Footer from '@/components/home/Footer.vue';
import { getAllProducts } from '@/services/apiService';

const produtos = ref([]);
const categoriaSelecionada = ref('Todos os Produtos');
const termoBusca = ref('');
const ordemSelecionada = ref('');
const route = useRoute();
const router = useRouter();

onMounted(async () => {
  produtos.value = await getAllProducts();
  if (route.query.categoria) {
    categoriaSelecionada.value = route.query.categoria;
  }
  if (route.query.busca) {
    termoBusca.value = route.query.busca;
  }
});

watch(
  () => route.query.categoria,
  (novaCategoria) => {
    if (novaCategoria) {
      categoriaSelecionada.value = novaCategoria;
    } else {
      categoriaSelecionada.value = 'Todos os Produtos';
    }
  }
);

watch(
  () => route.query.busca,
  (novoTermo) => {
    if (novoTermo) {
      termoBusca.value = novoTermo;
    } else {
      termoBusca.value = '';
    }
  }
);

const produtosFiltrados = computed(() => {
  let filtrados = produtos.value;
  if (categoriaSelecionada.value !== 'Todos os Produtos') {
    filtrados = filtrados.filter(
      p => p.category?.name === categoriaSelecionada.value && p.category?.user_id === 211
    );
  } else {
    filtrados = filtrados.filter(p => p.category?.user_id === 211);
  }
  if (termoBusca.value.trim() !== '') {
    const termo = termoBusca.value.trim().toLowerCase();
    filtrados = filtrados.filter(p => p.name.toLowerCase().includes(termo));
  }
  // Ordenação
  if (ordemSelecionada.value === 'maior-valor') {
    filtrados = [...filtrados].sort((a, b) => b.price - a.price);
  } else if (ordemSelecionada.value === 'menor-valor') {
    filtrados = [...filtrados].sort((a, b) => a.price - b.price);
  } else if (ordemSelecionada.value === 'az') {
    filtrados = [...filtrados].sort((a, b) => a.name.localeCompare(b.name));
  } else if (ordemSelecionada.value === 'za') {
    filtrados = [...filtrados].sort((a, b) => b.name.localeCompare(a.name));
  }
  return filtrados;
});

function irParaDetalhes(id) {
  router.push(`/produtos/${id}`);
}
</script>

<style scoped>
.main-layout { 
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #11111c;
}
.content-wrapper { 
  flex: 1 1 auto;
  display: flex;
  align-items: stretch;
  min-height: 0;
}
.products-container {
  background: linear-gradient(145deg, #18182a 60%, #23233a 100%);
  border-radius: 2rem;
  box-shadow: 0 8px 32px rgba(143, 95, 232, 0.10);
  padding: 2.5rem 2rem 2rem 2rem;
  margin-bottom: 2rem;
  min-height: 500px;
  max-width: 1400px;
  width: 100%;
  border: 1.5px solid #23233a;
  position: relative;
}
.section-title {
  font-family: 'Orbitron', sans-serif;
  color: #00ffe1;
  font-size: 2.5rem;
  letter-spacing: 1px;
  text-shadow: 0 0 15px rgba(0, 255, 225, 0.5);
  margin-top: 1rem;
  margin-bottom: 2rem !important;
}
.animate-fade-in {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeIn 0.8s ease-out forwards;
  animation-delay: 0.2s; 
}
@keyframes fadeIn { 
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}
.search-bar {
  border-radius: 0.7rem;
  border: 1.5px solid #23233a;
  background: #18182a;
  color: #fff;
  padding: 0.7rem 1.2rem;
  font-size: 1.1rem;
  box-shadow: 0 2px 8px rgba(143, 95, 232, 0.07);
  transition: border-color 0.2s;
}
.search-bar:focus {
  border-color: #00ffe1;
  outline: none;
}
.product-link {
  cursor: pointer;
  transition: box-shadow 0.2s;
}
.product-link:hover .product-card {
  box-shadow: 0 8px 32px rgba(163, 98, 255, 0.25), 0 0 0 2px #8f5fe8;
  transform: translateY(-6px) scale(1.03);
}
</style> 