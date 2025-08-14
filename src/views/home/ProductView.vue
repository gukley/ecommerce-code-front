<template>
  <div class="main-layout text-white">
    <Navbar />
    <div class="content-wrapper d-flex">
      <SideBar @categoria-selecionada="categoriaSelecionada = $event" />
      <div class="flex-grow-1 d-flex justify-content-center align-items-start p-4">
        <div class="products-container w-100">
          <h2 class="section-title text-center mb-5 animate-fade-in">
            {{ tituloPagina }}
          </h2>
          <div class="search-filter-bar d-flex flex-wrap justify-content-center justify-content-md-between align-items-center gap-3 mb-5">
            <div class="search-input-group flex-grow-1">
              <span class="search-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="#00ffe1" class="bi bi-search" viewBox="0 0 16 16">
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                </svg>
              </span>
              <input
                v-model="termoBusca"
                type="text"
                class="form-control search-bar"
                placeholder="Buscar produtos..."
                aria-label="Buscar produtos"
                @keyup.enter="buscarProdutos"
              />
              <button class="search-button" type="button" aria-label="Pesquisar" @click="buscarProdutos">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#11111c" class="bi bi-arrow-right" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M10.146 6.646a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L11 7.707V13.5a.5.5 0 0 1-1 0V7.707l-2.146 2.147a.5.5 0 0 1-.708-.708l3-3z"/>
                </svg>
              </button>
            </div>
            <div class="d-flex align-items-center gap-3 filtro-ordenacao-box">
              <label for="ordemSelect" class="form-label mb-0 d-none d-lg-block filtro-label">
                <i class="bi bi-funnel"></i> Ordenar por:
              </label>
              <select
                id="ordemSelect"
                v-model="ordemSelecionada"
                class="form-select filtro-ordenacao"
                aria-label="Ordenar produtos"
              >
                <option value="">Padrão</option>
                <option value="maior-valor">Preço: maior para menor</option>
                <option value="menor-valor">Preço: menor para maior</option>
                <option value="az">Nome (A-Z)</option>
                <option value="za">Nome (Z-A)</option>
              </select>
            </div>
          </div>
          <div v-if="produtosFiltrados.length === 0" class="alert alert-info text-center">
            Nenhum produto encontrado para esta busca.
          </div>
          <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
            <div class="col d-flex" v-for="produto in produtosFiltrados" :key="produto.id">
              <ProductCard :produto="produto" class="flex-fill" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <BrandsCarousel />
    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import Navbar from '@/components/home/NavBar.vue';
import SideBar from '@/components/home/SideBar.vue';
import ProductCard from '@/components/home/ProductCard.vue';
import Footer from '@/components/home/Footer.vue';
import { getAllProducts } from '@/services/apiService';
import BrandsCarousel from '@/components/home/BrandsCarousel.vue';
import { useAuthStore } from '@/stores/authStore';

const produtos = ref([]);
const categoriaSelecionada = ref('Todos os Produtos');
const termoBusca = ref('');
const ordemSelecionada = ref('');
const route = useRoute();
const authStore = useAuthStore();

onMounted(async () => {
  produtos.value = await getAllProducts();
  if (route.query.categoria) {
    categoriaSelecionada.value = route.query.categoria;
  }
  if (route.query.q) {
    termoBusca.value = route.query.q;
  }
});

watch(
  () => route.query.categoria,
  (novaCategoria) => {
    categoriaSelecionada.value = novaCategoria || 'Todos os Produtos';
  }
);

watch(
  () => route.query.q,
  (novoTermo) => {
    termoBusca.value = novoTermo || '';
  }
);

function buscarProdutos() {
  // Aqui você pode disparar busca por API se desejar, ou apenas filtrar.
  // O filtro já funciona via v-model!
}

const tituloPagina = computed(() => {
  if (termoBusca.value) {
    return `Resultados para "${termoBusca.value}"`;
  }
  return categoriaSelecionada.value;
});

const produtosFiltrados = computed(() => {
  let listaFiltrada = produtos.value; // Mostra todos os produtos para todos os usuários

  // Filtro por categoria
  if (categoriaSelecionada.value !== 'Todos os Produtos') {
    listaFiltrada = listaFiltrada.filter(
      p => p.category?.name === categoriaSelecionada.value
    );
  }

  // Filtro por busca
  if (termoBusca.value.trim() !== '') {
    const termo = termoBusca.value.toLowerCase();
    listaFiltrada = listaFiltrada.filter(p => 
      p.name.toLowerCase().includes(termo) || (p.description && p.description.toLowerCase().includes(termo))
    );
  }

  // Ordenação
  if (ordemSelecionada.value) {
    listaFiltrada = [...listaFiltrada].sort((a, b) => {
      switch (ordemSelecionada.value) {
        case 'maior-valor':
          return b.price - a.price;
        case 'menor-valor':
          return a.price - b.price;
        case 'az':
          return a.name.localeCompare(b.name);
        case 'za':
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });
  }

  return listaFiltrada;
});
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
.search-filter-bar {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  justify-content: center;
}
.search-input-group {
  position: relative;
  display: flex;
  flex-grow: 1;
  max-width: 400px;
  background: rgba(22,22,36,0.85);
  border: 2px solid #00ffe1;
  border-radius: 2rem;
  box-shadow: 0 4px 15px #00ffe122;
  padding: 5px 10px 5px 0;
  align-items: center;
  transition: box-shadow 0.2s, border-color 0.2s;
}
.search-input-group:focus-within {
  box-shadow: 0 0 0 4px #00ffe1a1;
  border-color: #8f5fe8;
}
.search-bar {
  background-color: transparent;
  border: none;
  color: #fff;
  padding: 0.8rem 1rem 0.8rem 2.4rem;
  font-size: 1.1rem;
  width: 100%;
  outline: none;
}
.search-bar:focus {
  background: rgba(0,255,225,0.09);
}
.search-bar::placeholder {
  color: #999;
}
.search-icon {
  position: absolute;
  left: 13px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  opacity: 0.95;
  z-index: 2;
}
.search-button {
  background: linear-gradient(90deg, #00ffe1, #8f5fe8);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 255, 225, 0.3);
  transition: transform 0.18s, box-shadow 0.18s;
  margin-left: 7px;
}
.search-button:hover,
.search-button:focus {
  transform: scale(1.11);
  box-shadow: 0 8px 18px #00ffe1b7;
  outline: none;
}
.search-button svg {
  color: #11111c;
  width: 22px;
  height: 22px;
}
.filtro-ordenacao-box {
  min-width: 220px;
  display: flex;
  align-items: center;
}
.filtro-label {
  color: #00ffe1;
  font-weight: 600;
  font-size: 1.07rem;
  margin-right: 6px;
  display: flex;
  align-items: center;
  gap: 7px;
}
.filtro-ordenacao {
  border: 2px solid #00ffe1;
  border-radius: 1rem;
  background-color: #18182a;
  color: #fff;
  padding: 0.58rem 1.1rem;
  font-size: 1.07rem;
  font-weight: 500;
  box-shadow: 0 2px 6px rgba(0, 255, 225, 0.13);
  transition: border-color 0.2s ease;
  min-width: 180px;
  max-width: 220px;
  z-index: 10;
  color-scheme: dark; /* Para browsers modernos */
}
.filtro-ordenacao option {
  background: #18182a;
  color: #fff;
}
.filtro-ordenacao:focus {
  outline: none;
  border-color: #8f5fe8;
  background: rgba(143,95,232,0.09);
}

/* Responsivo */
@media (max-width: 576px) {
  .search-filter-bar {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  .search-input-group {
    max-width: 100%;
    margin-bottom: 1rem;
  }
  .filtro-ordenacao-box {
    margin-left: 0;
    min-width: 100%;
    justify-content: flex-start;
  }
}
</style>