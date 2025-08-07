<template>
  <div class="main-layout text-white">
    <Navbar />
    <div class="content-wrapper d-flex">
      <div class="flex-grow-1 d-flex justify-content-center align-items-start p-4">
        <div class="categories-container w-100">
          <h2 class="section-title text-center mb-5 animate-fade-in">Categorias</h2>
          <div v-if="categorias.length === 0" class="alert alert-info text-center">
            Nenhuma categoria encontrada.
          </div>
          <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
            <div class="col d-flex" v-for="cat in categorias" :key="cat.id">
              <div class="category-card flex-fill p-4 text-center rounded-4 shadow category-clickable" @click="irParaProdutos(cat.name)">
                <img v-if="cat.image_path" :src="BASE_URL + cat.image_path" alt="Imagem da Categoria" class="category-thumb mb-3" />
                <h5 class="fw-bold mb-2">{{ cat.name }}</h5>
                <p class="text-muted small">{{ cat.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Navbar from '@/components/home/NavBar.vue';
import Footer from '@/components/home/Footer.vue';
import { getCategories } from '@/services/apiService';

const BASE_URL = 'http://35.196.79.227:8000';
const categorias = ref([]);
const router = useRouter();

onMounted(async () => {
  const apiCategories = await getCategories();
  categorias.value = apiCategories.filter(cat => cat.user_id === 211);
});

function irParaProdutos(nomeCategoria) {
  router.push({ path: '/produtos', query: { categoria: nomeCategoria } });
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
.categories-container {
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
.category-card {
  background: #23233a;
  border: 1.5px solid #8f5fe8;
  border-radius: 1.5rem;
  box-shadow: 0 2px 16px rgba(143, 95, 232, 0.10);
  padding: 2rem 1.5rem;
  color: #fff;
}
.category-thumb {
  width: 110px;
  height: 110px;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid #8f5fe8;
  box-shadow: 0 2px 8px rgba(143, 95, 232, 0.10);
}
.category-clickable {
  cursor: pointer;
  transition: box-shadow 0.2s, transform 0.2s;
}
.category-clickable:hover {
  box-shadow: 0 8px 32px rgba(143, 95, 232, 0.25);
  transform: translateY(-4px) scale(1.03);
  border-color: #00ffe1;
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
</style> 