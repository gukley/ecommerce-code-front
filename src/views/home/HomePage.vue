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
          <form class="mb-3 d-flex justify-content-start" @submit.prevent="buscarProdutos" role="search" aria-label="Buscar produtos">
            <input
              v-model="termoBusca"
              class="form-control custom-search-input"
              style="max-width: 320px; border-radius: 2.5rem; font-size: 1rem; background: #23233a; border: 1.5px solid #8f5fe8; box-shadow: none; color: #fff; font-weight: 600;"
              type="search"
              placeholder="Buscar produtos..."
              aria-label="Buscar produtos"
            />
            <button
              class="btn btn-main-action ms-2 rounded-pill px-3 py-1"
              type="submit"
              style="font-size: 1.1rem;"
              aria-label="Pesquisar"
            >
              <i class="bi bi-search" aria-hidden="true"></i>
            </button>
          </form>

          <h2 class="section-title text-center mb-4 animate-fade-in" tabindex="0">
            {{ categoriaSelecionada }}
          </h2>

          <div v-if="produtosFiltrados.length === 0" class="alert alert-info text-center" role="alert" aria-live="assertive">
            Nenhum produto encontrado para esta categoria.
          </div>

          <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4" v-else>
            <div class="col d-flex" v-for="produto in produtosFiltrados" :key="produto.id">
              <ProductCard :produto="produto" class="flex-fill" />
            </div>
          </div>
        </div>
      </section>
    </main>

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
  try {
    produtos.value = await getAllProducts();
  } catch (error) {
    console.error('Erro ao carregar produtos:', error);
  }
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

function buscarProdutos() {
  // A filtragem é reativa; função preparada para prevenir reloads no form
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

.custom-search-input::placeholder {
  color: #e0e0e0 !important;
  opacity: 1;
}

.btn-main-action {
  background: linear-gradient(90deg, #007cf0 0%, #00ffe1 100%);
  color: #fff;
  border: none;
  font-weight: 700;
  box-shadow: 0 2px 12px rgba(0, 188, 212, 0.10);
  transition: background 0.2s ease, color 0.2s ease;
  padding: 0.5rem 1.2rem;
  border-radius: 50px;
}

.btn-main-action:hover,
.btn-main-action:focus {
  background: linear-gradient(90deg, #00ffe1 0%, #007cf0 100%);
  color: #23243a;
  outline: none;
  box-shadow: 0 4px 20px rgba(0, 255, 225, 0.3);
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