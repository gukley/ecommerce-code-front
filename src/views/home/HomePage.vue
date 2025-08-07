<template>
  <div class="main-layout text-white">
    <Navbar />
    <div
      v-if="authStore.user && authStore.user.role === 'ADMIN'"
      class="admin-panel-btn-bar d-flex justify-content-end align-items-center px-4 mt-2 mb-2"
    >
      <button
        @click="$router.push('/admin')"
        class="btn btn-admin-panel d-inline-flex align-items-center gap-2"
        aria-label="Ir para painel de administração"
        type="button"
      >
        <i class="bi bi-speedometer2" aria-hidden="true"></i> Painel Admin
      </button>
    </div>

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

          <div class="search-filter-bar d-flex flex-wrap justify-content-center justify-content-md-between align-items-center gap-3 mb-5">
              <div class="search-input-group flex-grow-1">
                  <input
                      v-model="termoBusca"
                      type="text"
                      class="form-control search-bar"
                      placeholder="Buscar produtos..."
                      aria-label="Buscar produtos"
                  />
                  <button class="search-button" @click="buscarProdutos" type="button" aria-label="Pesquisar">
                      <i class="bi bi-search" aria-hidden="true"></i>
                  </button>
              </div>

              <div class="d-flex align-items-center gap-3">
                  <label for="ordemSelect" class="form-label mb-0 d-none d-lg-block" style="color:#00ffe1; font-weight:600;">
                      Ordenar por:
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
              <ProductCard :produto="produto" class="flex-fill" />
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
import { getAllProducts } from '@/services/apiService';
import { useAuthStore } from '@/stores/authStore';
import BrandsCarousel from '@/components/home/BrandsCarousel.vue';

const produtos = ref([]);
const categoriaSelecionada = ref('Todos os Produtos');
const termoBusca = ref('');
const ordemSelecionada = ref('');
const authStore = useAuthStore();
const route = useRoute();

onMounted(async () => {
  try {
    produtos.value = await getAllProducts();
    if (route.query.categoria) {
      categoriaSelecionada.value = route.query.categoria;
    }
  } catch (error) {
    console.error('Erro ao carregar produtos:', error);
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

  if (categoriaSelecionada.value !== 'Todos os Produtos') {
    filtrados = filtrados.filter(
      p => p.category?.name === categoriaSelecionada.value && p.category?.user_id === 211
    );
  } else {
    filtrados = filtrados.filter(p => p.category?.user_id === 211);
  }

  if (termoBusca.value.trim() !== '') {
    const termo = termoBusca.value.trim().toLowerCase();
    filtrados = filtrados.filter(p => p.name.toLowerCase().includes(termo) || (p.description && p.description.toLowerCase().includes(termo)));
  }
  
  if (ordemSelecionada.value) {
    filtrados = [...filtrados].sort((a, b) => {
      switch (ordemSelecionada.value) {
        case 'maior-valor': return b.price - a.price;
        case 'menor-valor': return a.price - b.price;
        case 'az': return a.name.localeCompare(b.name);
        case 'za': return b.name.localeCompare(a.name);
        default: return 0;
      }
    });
  }

  return filtrados;
});

function buscarProdutos() {
  
}
</script>

<style scoped>
.main-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #11111c;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.content-wrapper {
  flex: 1 1 auto;
  align-items: stretch;
  min-height: 0;
}

.products-container {
  background: linear-gradient(145deg, #18182a 60%, #23233a 100%);
  border-radius: 2rem;
  box-shadow: 0 8px 32px rgba(143, 95, 232, 0.10);
  padding: 2.5rem 2rem 2rem;
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
  user-select: none;
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
.search-input-group {
  position: relative;
  display: flex;
  flex-grow: 1;
  max-width: 400px;
  background-color: #18182a;
  border: 2px solid #9e64e8;
  border-radius: 2rem;
  padding: 5px;
  box-shadow: 0 4px 15px rgba(143, 95, 232, 0.2);
}
.search-bar {
  background-color: transparent;
  border: none;
  color: #fff;
  padding: 0.8rem 1rem;
  font-size: 1.1rem;
  width: 100%;
  outline: none;
}
.search-bar:focus {
  box-shadow: none;
}
.search-bar::placeholder {
  color: #999;
}
.search-button {
  background: linear-gradient(145deg, #00ffe1, #00bfff);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 255, 225, 0.3);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.search-button:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 12px rgba(0, 255, 225, 0.5);
}
.search-button i {
  color: #11111c;
  font-size: 1.2rem;
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
.admin-panel-btn-bar {
  width: 100%;
}
.btn-admin-panel {
  background: linear-gradient(90deg, #007cf0 0%, #00ffe1 100%);
  color: #fff;
  border: none;
  font-size: 1.08rem;
  font-weight: 700;
  border-radius: 50px;
  box-shadow: 0 2px 12px rgba(0, 188, 212, 0.10);
  padding: 0.7rem 1.7rem;
  transition: background 0.2s ease, color 0.2s ease;
  cursor: pointer;
}
.btn-admin-panel:hover,
.btn-admin-panel:focus {
  background: linear-gradient(90deg, #00ffe1 0%, #007cf0 100%);
  color: #23243a;
  outline: none;
  box-shadow: 0 4px 20px rgba(0, 255, 225, 0.3);
}

/* Responsividade */
@media (max-width: 768px) {
  .products-container {
    padding: 2rem 1rem 1.5rem;
    min-height: auto;
  }
  .section-title {
    font-size: 2rem;
    margin-bottom: 1.5rem !important;
  }
}
</style>