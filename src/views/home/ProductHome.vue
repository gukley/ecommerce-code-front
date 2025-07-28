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
          <div class="search-filter-bar d-flex align-items-center gap-3 mb-3" style="width:100%;">
            <input
              v-model="termoBusca"
              type="text"
              class="form-control search-bar"
              placeholder="Buscar produtos..."
              style="max-width: 320px; min-width: 180px;"
            />
            <label for="ordemSelect" class="form-label mb-0 ms-2" style="color:#00ffe1;font-weight:600;">Ordenar por:</label>
            <select id="ordemSelect" v-model="ordemSelecionada" class="form-select filtro-ordenacao" style="width: 200px; background:#18182a; color:#fff; border:2px solid #00ffe1;">
              <option value="">Selecione...</option>
              <option value="maior-valor">Preço: maior para menor</option>
              <option value="menor-valor">Preço: menor para maior</option>
              <option value="az">Nome (A-Z)</option>
              <option value="za">Nome (Z-A)</option>
            </select>
          </div>
          <h2 class="section-title text-center mb-5 animate-fade-in">
            {{ categoriaSelecionada }}
          </h2>
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
import { useProductStore } from '@/stores/productStore';

const productStore = useProductStore();
const route = useRoute();
const router = useRouter();

// Sincronizar filtros da view com a store
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
    if (novaCategoria) {
      productStore.selectedCategory = novaCategoria;
    } else {
      productStore.selectedCategory = 'Todos os Produtos';
    }
  }
);

watch(
  () => route.query.busca,
  (novoTermo) => {
    if (novoTermo) {
      productStore.searchTerm = novoTermo;
    } else {
      productStore.searchTerm = '';
    }
  }
);

// Ligação dos campos do filtro com a store
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
.filtro-ordenacao {
  border: 2px solid #00ffe1;
  border-radius: 0.7rem;
  background-color: #18182a;
  color: #fff;
  padding: 0.6rem 1rem;
  font-size: 1.05rem;
  font-weight: 500;
  box-shadow: 0 2px 6px rgba(0, 255, 225, 0.1);
  transition: border-color 0.2s ease;
  min-width: 180px;
  max-width: 220px;
  z-index: 10;
}
.filtro-ordenacao:focus {
 outline: none;
 border-color: #00d0ff;
}
@media (max-width: 576px) { 
  .search-filter-bar { 
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
}
</style> 