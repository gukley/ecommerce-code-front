<template>
  <div class="main-layout text-white">
    <Navbar />
    <div class="content-wrapper d-flex">
      <SideBar @categoria-selecionada="categoriaSelecionada = $event" />
      <div class="flex-grow-1 d-flex justify-content-center align-items-start p-4">
        <div class="products-container w-100">
          <!-- Exemplo: clique test -->
          <div
            @click="console.log('teste clique')"
            style="background:#8f5fe8; color:#fff; padding:12px; border-radius:8px; margin-bottom:16px; cursor:pointer; text-align:center;"
            role="button"
            tabindex="0"
            @keyup.enter="console.log('teste clique via teclado')"
          >
            Clique aqui para testar o clique
          </div>

          <!-- Barra de busca + filtro aprimorados -->
          <div class="search-filter-bar d-flex align-items-center gap-3 mb-3" style="width:100%;">
            <div class="search-bar-box position-relative">
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
                <option value="">Selecione...</option>
                <option value="maior-valor">Preço: maior para menor</option>
                <option value="menor-valor">Preço: menor para maior</option>
                <option value="az">Nome (A-Z)</option>
                <option value="za">Nome (Z-A)</option>
              </select>
            </div>
          </div>

          <h2 class="section-title text-center mb-5 animate-fade-in" tabindex="0">
            {{ categoriaSelecionada }}
          </h2>

          <div v-if="produtosFiltrados.length === 0" class="alert alert-info text-center" role="alert" aria-live="polite">
            Nenhum produto encontrado para esta categoria.
          </div>

          <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4" v-else>
            <div
              class="col d-flex"
              v-for="produto in produtosFiltrados"
              :key="produto.id"
              role="listitem"
            >
              <ProductCard
                :produto="produto"
                class="flex-fill product-link"
                @click.native="irParaDetalhes(produto.id)"
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
import { useProductStore } from '@/stores/productStore';

const productStore = useProductStore();
const route = useRoute();
const router = useRouter();

onMounted(async () => {
  await productStore.fetchProducts();
  if (route.query.categoria) {
    productStore.selectedCategory = route.query.categoria;
  }
  if (route.query.busca) {
    productStore.searchTerm = route.query.busca;
  }
});

watch(
  () => route.query.categoria,
  (novaCategoria) => {
    productStore.selectedCategory = novaCategoria || 'Todos os Produtos';
  }
);

watch(
  () => route.query.busca,
  (novoTermo) => {
    productStore.searchTerm = novoTermo || '';
  }
);

const categoriaSelecionada = computed({
  get: () => productStore.selectedCategory,
  set: (val) => (productStore.selectedCategory = val)
});
const termoBusca = computed({
  get: () => productStore.searchTerm,
  set: (val) => (productStore.searchTerm = val)
});
const ordemSelecionada = computed({
  get: () => productStore.orderBy,
  set: (val) => (productStore.orderBy = val)
});

const produtosFiltrados = computed(() => productStore.filteredProducts);

function irParaDetalhes(id) {
  router.push(`/produtos/${id}`);
}

function buscarProdutos() {
  // Se quiser buscar por API, chame aqui.
  // Ou só atualiza o filtro (v-model já faz isso!)
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
  overflow: visible;
}

.section-title {
  font-family: 'Orbitron', sans-serif;
  color: #00ffe1;
  font-size: 2.5rem;
  letter-spacing: 1px;
  text-shadow: 0 0 15px rgba(0, 255, 225, 0.5);
  margin-top: 1rem;
  margin-bottom: 2rem;
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

/* --- Estilo aprimorado --- */
.search-filter-bar {
  width: 100%;
  flex-wrap: wrap;
}

.search-bar-box {
  position: relative;
  display: flex;
  align-items: center;
  max-width: 350px;
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
}

.filtro-ordenacao:focus {
  outline: none;
  border-color: #8f5fe8;
  background: rgba(143,95,232,0.07);
}

/* Responsivo */
@media (max-width: 576px) {
  .search-filter-bar {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  .search-bar-box {
    max-width: 100%;
    margin-bottom: 1rem;
  }
  .filtro-ordenacao-box {
    margin-left: 0;
    min-width: 100%;
  }
}
</style>