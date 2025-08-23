<template>
  <div class="main-layout text-white">
    <Navbar />
    <div class="content-wrapper d-flex">
      <div class="flex-grow-1 d-flex justify-content-center align-items-start p-4">
        <div class="categories-container w-100 animate-glass-card">
          <h2 class="section-title text-center mb-5 animate-fade-in">Categorias</h2>
          <div v-if="categorias.length === 0" class="alert alert-info text-center">
            Nenhuma categoria encontrada.
          </div>
          <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
            <div class="col d-flex" v-for="cat in categorias" :key="cat.id">
              <div
                class="category-card flex-fill p-4 text-center rounded-4 shadow category-clickable animate-category-card"
                @click="irParaProdutos(cat.name)"
              >
                <div class="category-thumb-wrapper">
                  <img
                    v-if="cat.image_path"
                    :src="BASE_URL + (cat.image_path.startsWith('/') ? '' : '/') + cat.image_path"
                    alt="Imagem da Categoria"
                    class="category-thumb mb-3"
                  />
                </div>
                <h5 class="fw-bold mb-2 category-title-gradient">{{ cat.name }}</h5>
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
import { useAuthStore } from '@/stores/authStore';

const categorias = ref([]);
const router = useRouter();
const BASE_URL = import.meta.env.VITE_API_URL;

onMounted(async () => {
  categorias.value = await getCategories();
});

function irParaProdutos(nomeCategoria) {
  router.push({ path: '/produtos', query: { categoria: nomeCategoria } });
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700&display=swap');
:root, [data-theme="dark"] {
  --bg-main: #18182a;
  --bg-card: rgba(28, 30, 53, 0.94);
  --text-main: #fff;
  --border-main: #23233a;
  --category-card: rgba(35, 35, 58, 0.95);
  --category-border: #8f5fe8;
}
[data-theme="light"] {
  --bg-main: #f6f7fb;
  --bg-card: #e9eaf3;
  --text-main: #23233a;
  --border-main: #cfd8dc;
  --category-card: #f3f6fa;
  --category-border: #64b5f6;
}
.main-layout { 
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--bg-main);
  color: var(--text-main);
  position: relative;
  box-shadow: 0 0 120px #00ffe122;
  overflow-x: hidden;
}
.content-wrapper { 
  flex: 1 1 auto;
  display: flex;
  align-items: stretch;
  min-height: 0;
}
.categories-container {
  background: var(--bg-card);
  border-radius: 2.3rem;
  box-shadow: 0 16px 56px #8f5fe844, 0 4px 24px #00ffe133;
  padding: 2.8rem 2.2rem 2.2rem 2.2rem;
  margin-bottom: 2rem;
  min-height: 540px;
  max-width: 1400px;
  width: 100%;
  border: 2px solid var(--border-main);
  position: relative;
  backdrop-filter: blur(8px);
  animation: glassPopIn 0.9s;
}
@keyframes glassPopIn {
  from { opacity: 0; transform: scale(.97); }
  to { opacity: 1; transform: scale(1); }
}

.section-title {
  font-family: 'Orbitron', sans-serif;
  background: linear-gradient(90deg, #00ffe1 10%, #8f5fe8 60%, #a362ff 100%);
  font-size: 2.7rem;
  letter-spacing: 1.5px;
  text-shadow: 0 0 30px #00ffe188, 0 2px 12px #a362ff88;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-top: 1rem;
  margin-bottom: 2rem !important;
  filter: brightness(1.2);
}

.category-card {
  background: var(--category-card);
  border: 2.2px solid var(--category-border);
  border-radius: 1.6rem;
  box-shadow: 0 4px 28px #8f5fe822, 0 1px 14px #a362ff22;
  padding: 2.2rem 1.6rem;
  color: var(--text-main);
  position: relative;
  transition: box-shadow 0.2s, border-color 0.2s, transform 0.22s;
  z-index: 1;
  overflow: hidden;
}
.category-clickable {
  cursor: pointer;
}
.category-card:hover {
  box-shadow: 0 16px 56px #00ffe166, 0 6px 32px #8f5fe866;
  transform: translateY(-5px) scale(1.04);
  border-color: #00ffe1;
}
.animate-category-card {
  animation: fadeInCard 0.7s;
}
@keyframes fadeInCard {
  from { opacity: 0; transform: translateY(20px) scale(.97); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.category-thumb-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 0.6rem;
}
.category-thumb {
  width: 110px;
  height: 110px;
  object-fit: cover;
  border-radius: 50%;
  border: 2.5px solid #00ffe1;
  box-shadow: 0 0 24px #00ffe188, 0 2px 8px #8f5fe822;
  transition: box-shadow 0.2s, border-color 0.2s, transform 0.22s;
  background: radial-gradient(circle at 50% 50%, #23233a 60%, #00ffe122 100%);
  animation: glow-in 1.4s;
}
.category-card:hover .category-thumb {
  box-shadow: 0 0 50px #00ffe1cc, 0 2px 18px #a362ff88;
  border-color: #a362ff;
  transform: scale(1.07) rotate(-2deg);
}
@keyframes glow-in {
  from { box-shadow: 0 0 0 #00ffe100; }
  to   { box-shadow: 0 0 24px #00ffe144; }
}

.category-title-gradient {
  font-family: 'Orbitron', sans-serif;
  background: linear-gradient(90deg, #00ffe1 8%, #8f5fe8 60%, #a362ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 1.1rem;
  letter-spacing: 0.5px;
  text-shadow: 0 0 5px #00ffe155, 0 1px 3px #8f5fe877;
  margin-bottom: 0.7rem;
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

@media (max-width: 1100px) {
  .categories-container {
    padding: 1.3rem 0.6rem 1.3rem 0.6rem;
    min-height: 320px;
  }
  .section-title { font-size: 1.6rem;}
}
@media (max-width: 800px) {
  .category-card { padding: 1.2rem 0.7rem; }
  .category-thumb { width: 85px; height: 85px;}
}
@media (max-width: 600px) {
  .categories-container { border-radius: 1.2rem; }
}
</style>