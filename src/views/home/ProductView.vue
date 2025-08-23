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
          <!-- Barra de busca e filtros igual à Home -->
          <div class="search-filter-bar d-flex flex-wrap justify-content-center justify-content-md-between align-items-center gap-3 mb-5">
            <div class="search-bar-box position-relative flex-grow-1">
              <input
                v-model="termoBusca"
                type="text"
                class="form-control search-bar"
                placeholder="Buscar produtos..."
                aria-label="Buscar produtos"
                @keyup.enter="buscarProdutos"
              />
              <span class="search-icon">
                <i class="bi bi-search"></i>
              </span>
              <button
                class="btn btn-search"
                type="button"
                @click="buscarProdutos"
                aria-label="Buscar"
              >
                <i class="bi bi-arrow-right"></i>
              </button>
            </div>
            <div class="dropdown filtro-ordenacao-box">
              <label for="ordemSelect" class="form-label mb-0 ms-2 filtro-label">
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
              <ProductCard
                :produto="produto"
                class="flex-fill"
                :show-discount="true"
              />
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
import { getAllProducts, getAllDiscounts } from '@/services/apiService';
import BrandsCarousel from '@/components/home/BrandsCarousel.vue';
import { useAuthStore } from '@/stores/authStore';

const produtos = ref([]);
const descontos = ref([]);
const categoriaSelecionada = ref('Todos os Produtos');
const termoBusca = ref('');
const ordemSelecionada = ref('');
const route = useRoute();
const authStore = useAuthStore();

onMounted(async () => {
  const produtosApi = await getAllProducts();
  const descontosApi = await getAllDiscounts();
  // Associa desconto ao produto
  produtos.value = produtosApi.map(prod => {
    const desconto = descontosApi.find(d => Number(d.product_id) === Number(prod.id));
    return {
      ...prod,
      discount: desconto
        ? {
            discount_percentage: Number(desconto.discount_percentage),
            description: desconto.description,
            start_date: desconto.start_date,
            end_date: desconto.end_date,
            id: desconto.id
          }
        : null
    }
  });
  descontos.value = descontosApi;
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
  let listaFiltrada = produtos.value;

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
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.search-bar-box {
  position: relative;
  display: flex;
  align-items: center;
  max-width: 400px;
  flex: 1 0 180px;
  background: rgba(22,22,36,0.84);
  border-radius: 1.1rem;
  box-shadow: 0 8px 32px rgba(143, 95, 232, 0.10);
  border: 1.5px solid #23233a;
}

.search-bar {
  border-radius: 1.1rem;
  border: none;
  background: transparent;
  color: #fff;
  padding: 0.7rem 1.2rem 0.7rem 2.7rem;
  font-size: 1.1rem;
  width: 100%;
  outline: none;
}

/* Torna o placeholder mais visível */
.search-bar::placeholder {
  color: #00ffe1;
  opacity: 1;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.search-bar:focus {
  border: none;
  background: rgba(0,255,225,0.08);
  box-shadow: 0 0 0 2px #00ffe1;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #00ffe1;
  font-size: 1.32rem;
  pointer-events: none;
  opacity: 0.85;
}

.btn-search {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: linear-gradient(90deg,#00ffe1 0%,#8f5fe8 100%);
  border: none;
  color: #23233a;
  border-radius: 22px;
  font-weight: 700;
  padding: 0.28rem 0.98rem;
  font-size: 1.09rem;
  box-shadow: 0 2px 8px #8f5fe866;
  transition: background 0.22s, box-shadow 0.18s;
}
.btn-search i {
  transition: transform 0.2s;
}
.btn-search:active i,
.btn-search:hover i {
  transform: translateX(2px) scale(1.18);
}
.btn-search:hover {
  background: linear-gradient(90deg,#8f5fe8 0%,#00ffe1 100%);
  box-shadow: 0 4px 14px #00ffe1cc;
}

.filtro-ordenacao-box {
  min-width: 200px;
  margin-left: 14px;
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

/* Select de ordenação */
.filtro-ordenacao {
  border: 2px solid #00ffe1;
  border-radius: 1rem;
  background-color: #18182a;
  color: #00ffe1;
  padding: 0.58rem 1.1rem;
  font-size: 1.07rem;
  font-weight: 500;
  box-shadow: 0 2px 6px rgba(0, 255, 225, 0.13);
  transition: border-color 0.2s ease;
  min-width: 180px;
  max-width: 220px;
  z-index: 10;
}

.filtro-ordenacao option {
  background: #18182a;
  color: #00ffe1;
  font-weight: 500;
}

.filtro-ordenacao:focus {
  outline: none;
  border-color: #8f5fe8;
  background: rgba(143,95,232,0.07);
}

/* Responsivo */
@media (max-width: 992px) {
  .content-wrapper {
    flex-direction: column;
    padding: 0 !important;
  }
  .products-container {
    padding: 1.5rem 0.5rem 1.2rem 0.5rem;
    border-radius: 1.2rem;
    min-height: 350px;
  }
  .section-title {
    font-size: 1.5rem;
    margin-bottom: 1.2rem !important;
  }
}

@media (max-width: 768px) {
  .products-container {
    padding: 1rem 0.2rem 1rem 0.2rem;
    min-height: auto;
    border-radius: 1rem;
  }
  .section-title {
    font-size: 1.2rem;
    margin-bottom: 1rem !important;
  }
  .search-filter-bar {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
    margin-bottom: 1.2rem;
  }
  .search-bar-box {
    max-width: 100%;
    margin-bottom: 0.7rem;
    min-width: 0;
  }
  .filtro-ordenacao-box {
    margin-left: 0;
    min-width: 100%;
    max-width: 100%;
  }
}

@media (max-width: 576px) {
  .products-container {
    padding: 0.7rem 0.1rem 0.7rem 0.1rem;
    border-radius: 0.7rem;
  }
  .section-title {
    font-size: 1rem;
    margin-bottom: 0.7rem !important;
  }
  .row.g-4 {
    --bs-gutter-x: 0.5rem;
    --bs-gutter-y: 0.5rem;
  }
}
</style>