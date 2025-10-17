<template>
  <div class="main-layout text-white">
    <Navbar />
    <HeroSection />

    <main class="content-wrapper d-md-flex">
      <SideBar 
        @categoria-selecionada="categoriaSelecionada = $event" 
        class="d-none d-md-block" 
      />

      <section
        class="flex-grow-1 d-flex justify-content-center align-items-start p-4"
        aria-label="Lista de produtos"
      >
        <div class="products-container w-100" role="region" aria-live="polite">

          <!-- Barra de busca e filtros aprimorada -->
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

          <h2 class="section-title text-center mb-4 animate-fade-in" tabindex="0">
            {{ tituloPagina }}
          </h2>

          <div v-if="produtosFiltrados.length === 0" class="alert alert-info text-center" role="alert" aria-live="assertive">
            Nenhum produto encontrado para sua busca.
          </div>

          <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4" v-else>
            <div class="col d-flex" v-for="produto in produtosFiltrados" :key="produto.id">
              <ProductCard
                :produto="produto"
                class="flex-fill"
                :show-discount="true"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
    <BrandsCarousel />
    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import Navbar from '@/components/home/NavBar.vue';
import HeroSection from '@/components/home/HeroSection.vue';
import SideBar from '@/components/home/SideBar.vue';
import ProductCard from '@/components/home/ProductCard.vue';
import Footer from '@/components/home/Footer.vue';
import { getAllProducts, getAllDiscounts } from '@/services/apiService';
import { useAuthStore } from '@/stores/authStore';
import BrandsCarousel from '@/components/home/BrandsCarousel.vue';

const produtos = ref([]);
const categoriaSelecionada = ref('Todos os Produtos');
const termoBusca = ref('');
const ordemSelecionada = ref('');
const authStore = useAuthStore();
const route = useRoute();
const descontos = ref([]);

onMounted(async () => {
  try {
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
  } catch (error) {
    console.error('Erro ao carregar produtos/descontos:', error);
  }
});

watch(
  () => route.query.categoria,
  (novaCategoria) => {
    categoriaSelecionada.value = novaCategoria || 'Todos os Produtos';
  }
);

const tituloPagina = computed(() => {
  if (termoBusca.value) {
    return `Resultados para "${termoBusca.value}"`;
  }
  return categoriaSelecionada.value;
});

const produtosFiltrados = computed(() => {
  let filtrados = produtos.value;

  // Filtra pela categoria selecionada
  if (categoriaSelecionada.value !== 'Todos os Produtos') {
    filtrados = filtrados.filter(
      p => p.category?.name === categoriaSelecionada.value
    );
  }

  // Filtra pelo termo de busca
  if (termoBusca.value.trim() !== '') {
    const termo = termoBusca.value.trim().toLowerCase();
    filtrados = filtrados.filter(
      p =>
        p.name.toLowerCase().includes(termo) ||
        (p.description && p.description.toLowerCase().includes(termo))
    );
  }

  // Ordena os produtos
  if (ordemSelecionada.value) {
    filtrados = [...filtrados].sort((a, b) => {
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

  return filtrados;
});

const descontoDestaque = computed(() => {
  const now = new Date();
  // Filtra descontos ativos
  const ativos = descontos.value.filter(d => {
    const ini = new Date(d.start_date)
    const fim = new Date(d.end_date)
    return ini <= now && fim >= now
  });
  // Retorna o maior percentual
  if (ativos.length === 0) return null;
  return ativos.reduce((a, b) => (a.discount_percentage > b.discount_percentage ? a : b));
});

function buscarProdutos() {
  // Você pode implementar busca personalizada aqui, se quiser
}

function getProductName(id) {
  const p = produtos.value.find(x => x.id === id)
  return p ? p.name : '-'
}
</script>

<style scoped>
.main-layout { 
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f9f9f9; /* Fundo claro */
}
.content-wrapper { 
  flex: 1 1 auto;
  align-items: stretch;
  min-height: 0;
}
.products-container {
  background: #ffffff; /* Fundo branco */
  border-radius: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1); /* Sombra leve */
  padding: 2.5rem 2rem 2rem 2rem;
  margin-bottom: 2rem;
  min-height: 500px;
  max-width: 1400px;
  width: 100%;
  border: 1.5px solid #e0e0e0; /* Borda cinza clara */
  position: relative;
}
.section-title {
  font-family: 'Orbitron', sans-serif;
  color: #333333; /* Texto escuro */
  font-size: 2.5rem;
  letter-spacing: 1px;
  text-shadow: 0 0 15px rgba(0, 0, 0, 0.1); /* Sombra leve */
  margin-top: 1rem;
  margin-bottom: 2rem !important;
  user-select: none;
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
  background: #ffffff; /* Fundo branco */
  border-radius: 1.1rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1); /* Sombra leve */
  border: 1.5px solid #e0e0e0; /* Borda cinza clara */
}

.search-bar {
  border-radius: 1.1rem;
  border: none;
  background: transparent;
  color: #333333; /* Texto escuro */
  padding: 0.7rem 1.2rem 0.7rem 2.7rem;
  font-size: 1.1rem;
  width: 100%;
  outline: none;
}

/* Torna o placeholder mais visível */
.search-bar::placeholder {
  color: #999999; /* Placeholder cinza */
  opacity: 1;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.search-bar:focus {
  border: none;
  background: rgba(0, 0, 0, 0.05); /* Fundo cinza claro */
  box-shadow: 0 0 0 2px #333333; /* Borda escura */
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #333333; /* Ícone escuro */
  font-size: 1.32rem;
  pointer-events: none;
  opacity: 0.85;
}

.btn-search {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: #333333; /* Fundo escuro */
  border: none;
  color: #ffffff; /* Texto branco */
  border-radius: 22px;
  font-weight: 700;
  padding: 0.28rem 0.98rem;
  font-size: 1.09rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2); /* Sombra leve */
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
  background: #555555; /* Fundo mais escuro */
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.3); /* Sombra mais forte */
}

.filtro-ordenacao-box {
  min-width: 200px;
  margin-left: 14px;
}

.filtro-label {
  color: #333333; /* Texto escuro */
  font-weight: 600;
  font-size: 1.07rem;
  margin-right: 6px;
  display: flex;
  align-items: center;
  gap: 7px;
}

/* Select de ordenação */
.filtro-ordenacao {
  border: 2px solid #333333; /* Borda escura */
  border-radius: 1rem;
  background-color: #ffffff; /* Fundo branco */
  color: #333333; /* Texto escuro */
  padding: 0.58rem 1.1rem;
  font-size: 1.07rem;
  font-weight: 500;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1); /* Sombra leve */
  transition: border-color 0.2s ease;
  min-width: 180px;
  max-width: 220px;
  z-index: 10;
}

.filtro-ordenacao option {
  background: #ffffff; /* Fundo branco */
  color: #333333; /* Texto escuro */
  font-weight: 500;
}

.filtro-ordenacao:focus {
  outline: none;
  border-color: #555555; /* Borda mais escura */
  background: rgba(0, 0, 0, 0.05); /* Fundo cinza claro */
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