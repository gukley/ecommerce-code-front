<template>
  <div class="main-layout text-white">
    <Navbar />
   <HeroSection />
      <div class="content-wrapper d-flex">
      <SideBar @categoria-selecionada="categoriaSelecionada = $event" />
      <div class="flex-grow-1 d-flex justify-content-center align-items-start p-4">
        <div class="products-container w-100">
          <form class="mb-2 d-flex justify-content-center" @submit="buscarProdutos">
            <input
              v-model="termoBusca"
              class="form-control custom-search-input"
              style="max-width: 320px; border-radius: 2.5rem; font-size: 1rem; background: #23233a; border: 1.5px solid #8f5fe8; box-shadow: none; color: #fff; font-weight: 600;"
              type="search"
              placeholder="Buscar produtos..."
              aria-label="Buscar produtos"
            />
            <button class="btn btn-main-action ms-2 rounded-pill px-3 py-1" type="submit" style="font-size: 1.1rem;">
              <i class="bi bi-search"></i>
            </button>
          </form>
          <h2 class="section-title text-center mb-4 animate-fade-in">
            {{ categoriaSelecionada }}
          </h2>
          <div v-if="produtosFiltrados.length === 0" class="alert alert-info text-center">
            Nenhum produto encontrado para esta categoria.
          </div>
          <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
            <div class="col d-flex" v-for="produto in produtosFiltrados" :key="produto.id">
              <ProductCard :produto="produto" class="flex-fill" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import Navbar from '@/components/home/NavBar.vue';
import HeroSection from '@/components/home/HeroSection.vue';
import SideBar from '@/components/home/SideBar.vue';
import ProductCard from '@/components/home/ProductCard.vue';
import Footer from '@/components/home/Footer.vue';
import { getAllProducts } from '@/services/apiService';
import { useAuthStore } from '@/stores/authStore';

const produtos = ref([]);
const categoriaSelecionada = ref('Todos os Produtos');
const termoBusca = ref('');
const authStore = useAuthStore();

onMounted(async () => {
  produtos.value = await getAllProducts();
});

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
  return filtrados;
});

function buscarProdutos(e) {
  e.preventDefault();
  // O filtro já é reativo pelo termoBusca
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

.products-grid-area { 
  background-color: #1a1a2e;
  border-left: 1px solid rgba(255, 255, 255, 0.08);
  padding-bottom: 3rem !important;
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
.custom-search-input::placeholder {
  color: #e0e0e0 !important;
  opacity: 1;
}
</style>


