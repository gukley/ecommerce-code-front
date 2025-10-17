<template>
  <section class="hero-section text-white py-5 d-flex align-items-center">
    <div class="container position-relative z-index-1">
      <div class="row justify-content-center text-center">
        <div class="col-lg-10 col-xl-9">
          <!-- Banner de desconto -->
          <div class="hero-discount-banner mb-3 animate-fade-up" style="animation-delay: 0.1s;">
            <span class="discount-badge">
              🎉 SUPER OFERTA: 20% OFF em GPUs selecionadas!
              <router-link to="/produtos" class="see-offers-link">Ver ofertas</router-link>
            </span>
          </div>

          <div class="badge-new-gen mb-4 px-4 py-2 fw-medium animate-fade-up" style="animation-delay: 0.2s;">
            🚀 NOVA GERAÇÃO DISPONÍVEL
          </div>


          <!-- Swiper Banner full width (maior e centralizado) -->
          <Swiper
            :modules="[Navigation, Pagination, Autoplay]"
            :slides-per-view="1"
            :loop="true"
            :autoplay="{ delay: 4000 }"
            navigation
            pagination
            class="hero-swiper-full mb-5 animate-fade-up hero-swiper-clean"
            style="animation-delay: 0.3s;"
          >
            <SwiperSlide v-for="(banner, idx) in banners" :key="idx">
              <div class="swiper-banner-full">
                <img :src="banner.img" alt="Banner" class="banner-img-full" />
                <div class="banner-overlay">
                  <h2 class="banner-title">{{ banner.title }}</h2>
                  <p class="banner-desc">{{ banner.desc }}</p>
                  <router-link :to="banner.link" class="btn btn-main-action">Ver produto</router-link>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>

          <h1 class="display-3 fw-bold mb-4 main-heading animate-fade-up" style="animation-delay: 0.4s;">
            <span class="text-gradient-main">EVOLUA SEU</span><br />
            <span class="text-secondary-highlight">SETUP GAMER</span>
          </h1>

          <p class="hero-description mt-4 fs-5 animate-fade-up" style="max-width: 700px; margin: 0 auto; animation-delay: 0.6s;">
            Escolha sua máquina ideal com os melhores periféricos e acessórios gamers.
          </p>

          <!-- Selo de avaliação -->
          <div class="hero-rating-badge animate-fade-up mx-auto mb-3" style="animation-delay: 0.65s;">
            <i class="bi bi-star-fill"></i> 4.9/5 &nbsp;|&nbsp; +2.000 avaliações de clientes reais
          </div>

          <div class="d-flex justify-content-center gap-4 mt-5 animate-fade-up hero-main-actions" style="animation-delay: 0.8s;">
            <router-link to="/produtos" class="btn btn-main-action px-5 py-3 fw-bold">
              ⚡ Explorar Produtos
            </router-link>
            <router-link to="/produtos" class="btn btn-outline-secondary-light px-5 py-3 fw-bold">
              Ver Ofertas
            </router-link>
          </div>

          <!-- Selos de confiança -->
          <div class="hero-trust d-flex justify-content-center gap-4 mt-4 animate-fade-up" style="animation-delay: 0.9s;">
            <span>✔️ Site 100% seguro</span>
            <span>🚚 Frete grátis acima de R$500</span>
            <span>💳 Parcele em até 10x</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

const router = useRouter()
const search = ref('')

function onSearch() {
  if (search.value.trim()) {
    router.push({ path: '/produtos', query: { busca: search.value } })
  }
}

// Use new URL para importar imagens em Vite/Vue 3!
const banners = [
  {
    img: new URL('@/assets/banner1.jpg', import.meta.url).href,
    title: 'Monte seu Setup Gamer',
    desc: 'Computadores de alta performance para todos os estilos de jogo.',
    link: '/produtos'
  },
  {
    img: new URL('@/assets/banner2.jpg', import.meta.url).href,
    title: 'Ofertas em Peças e Periféricos',
    desc: 'Aproveite descontos especiais em hardware e acessórios.',
    link: '/produtos'
  }
];
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700&display=swap');

* { 
  font-family: 'Rajdhani', sans-serif;
}

.hero-section { 
  background: linear-gradient(145deg, #eaf6ff 60%, #f8f9fa 100%);
  min-height: 85vh;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 2px solid #b8d8ff;
}

/* pseudo-elementos pra efeito de particulas */
.hero-section::before,
.hero-section::after { 
  content: '';
  position: absolute;
  border-radius: 50%;
  opacity: 0.15;
  filter: blur(80px); /* efeito de brilho */
  z-index: 0;
  animation: pulse 6s infinite ease-in-out alternate;
}

.hero-section::before { 
  width: 300px;
  height: 300px;
  background: #b8d8ff;
  top: 15%;
  left: 10%;
  animation-delay: 0s;
}

.hero-section::after { 
  width: 400px;
  height: 400px;
  background: #399bff;
  bottom: 10%;
  right: 15%;
  animation-delay: 3s;
}

@keyframes pulse {
  0% { transform: scale(1); }
  100% { transform: scale(1.1); }
}

.z-index-1 {
  z-index: 1;
}

.badge-new-gen {
  background: linear-gradient(90deg, #399bff, #8f5fe8) !important;
  color: #fff;
  font-size: 0.95rem;
  letter-spacing: 0.5px;
  box-shadow: 0 0 15px #b8d8ff88;
  animation: fadeInDown 0.8s ease forwards;
}

.main-heading {
  font-family: 'Orbitron', sans-serif;
  font-size: 3.2rem;
  line-height: 1.2;
  text-shadow: 0 0 25px #b8d8ff44;
  color: #232e47;
  animation: fadeUp 1s ease-out forwards;
}

.text-gradient-main { 
  background: linear-gradient(to right, #399bff, #00ffe1); 
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
}

.text-secondary-highlight { 
  color: #399bff;
  filter: drop-shadow(0 0 10px #b8d8ff88);
}

.hero-description { 
  color: #232e47;
  line-height: 1.7;
  font-weight: 400;
  animation: fadeUp 1s ease-out forwards;
}

.btn-main-action {
  background: linear-gradient(90deg, #399bff, #8f5fe8);
  color: #fff;
  border: 2px solid #b8d8ff;
  font-size: 1.15rem;
  border-radius: 50px;
  box-shadow: 0 4px 16px #b8d8ff44;
  transition: all 0.3s ease;
  min-width: 200px;
}

.btn-main-action:hover { 
  background: linear-gradient(90deg, #8f5fe8, #399bff);
  color: #fff;
  box-shadow: 0 8px 25px #399bff44;
  transform: translateY(-3px) scale(1.02);
}

.btn-outline-secondary-light { 
  border: 2px solid #00ffe1;
  color: #00ffe1;
  background-color: transparent;
  font-size: 1.15rem;
  border-radius: 50px;
  transition: all 0.3s ease;
  min-width: 200px;
}

.btn-outline-secondary-light:hover { 
  background-color: #00ffe1;
  color: #232e47;
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 8px 25px #00ffe144;
}

.animate-fade-up {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeUp 0.8s ease-out forwards;
}
@keyframes fadeUp { 
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes fadeInDown { 
  0% { 
    opacity: 0;
    transform: translateY(-20px);
  }
  100% { 
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-discount-banner {
  background: linear-gradient(90deg, #399bff, #00ffe1); 
  color: #232e47;
  border-radius: 30px;
  padding: 0.7rem 1.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  box-shadow: 0 2px 12px #b8d8ff44;
  display: inline-block;
}
.discount-badge .see-offers-link {
  color: #232e47;
}
.discount-badge .see-offers-link:hover {
  color: #fff;
  background: #399bff;
  border-radius: 8px;
  padding: 0 0.3rem;
}

/* Swiper Custom - Banner grande (maior e mais clean) */
.hero-swiper-full.hero-swiper-clean {
  max-width: 1200px;
  min-height: 340px;
  margin: 0 auto 3rem auto;
  border-radius: 32px;
  overflow: hidden;
  box-shadow: 0 2px 24px rgba(163,98,255,0.18);
}
.swiper-banner-full {
  position: relative;
  width: 100%;
  height: 340px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.banner-img-full {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  border-radius: 32px;
}
.banner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, rgba(26,26,46,0.78) 60%, rgba(26,26,46,0.35) 100%);
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 2rem 3rem;
  box-sizing: border-box;
}
.banner-title {
  font-size: 2.4rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-shadow: 0 0 25px rgba(0,0,0,0.36);
}
.banner-desc {
  font-size: 1.2rem;
  color: #c0c0d0;
  margin-bottom: 1.2rem;
  text-shadow: 0 0 12px rgba(0,0,0,0.24);
}

/* Selo de avaliação */
.hero-rating-badge {
  background: #eaf6ff;
  color: #399bff;
  border-radius: 18px;
  font-size: 1.08rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 0.5rem 1.2rem;
  box-shadow: 0 2px 12px #b8d8ff22;
  margin-bottom: 0.5rem;
  margin-top: 0.5rem;
  letter-spacing: 0.2px;
  border: 1.5px solid #b8d8ff;
  transition: background 0.18s;
}
.hero-rating-badge i {
  color: #ffe066;
  font-size: 1.2rem;
}

/* Ajuste nos botões principais para maior destaque */
.hero-main-actions .btn {
  min-width: 220px;
  font-size: 1.18rem;
  padding-top: 1.1rem !important;
  padding-bottom: 1.1rem !important;
  margin-bottom: 0.5rem;
}

/* Selos de confiança */
.hero-trust {
  font-size: 1.05rem;
  color: #399bff;
  gap: 2rem;
}

/* Responsividade para Swiper e Hero */
@media (max-width: 991.98px) {
  .hero-section {
    flex-direction: column;
    padding: 2rem 0.7rem;
    gap: 1.2rem;
  }
  .main-heading { 
    font-size: 2.8rem;
  }
  .hero-description { 
    font-size: 1.1rem;
  }
  .btn-main-action, .btn-outline-secondary-light { 
    padding: 0.8rem 1.5rem;
    font-size: 1rem;
    min-width: unset; 
    width: 100%;
  }
  .d-flex.justify-content-center.gap-3.mt-5 { 
    flex-direction: column;
    gap: 1rem !important;
  }
  .hero-section::before, .hero-section::after { 
    display: none;
  }
  .badge-new-gen { 
    font-size: 0.85rem;
  }
  .hero-swiper-full.hero-swiper-clean {
    min-height: 200px;
    border-radius: 18px;
  }
  .swiper-banner-full {
    height: 200px;
  }
  .banner-img-full {
    height: 200px;
    border-radius: 18px;
  }
  .banner-title { font-size: 1.3rem; }
  .banner-desc { font-size: 0.98rem; }
  .banner-overlay { padding: 1rem 1rem;}
  .hero-main-actions .btn {
    min-width: unset;
    width: 100%;
    font-size: 1rem;
    padding-top: 0.8rem !important;
    padding-bottom: 0.8rem !important;
  }
  .hero-trust {
    flex-direction: column;
    gap: 0.5rem;
    font-size: 0.98rem;
  }
  .hero-discount-banner {
    font-size: 0.98rem;
    padding: 0.5rem 1rem;
  }
}
@media (max-width: 575.98px) {
  .main-heading {
    font-size: 2.2rem;
  }
  .hero-description {
    font-size: 0.95rem;
  }
  .hero-swiper-full.hero-swiper-clean {
    min-height: 120px;
    border-radius: 10px;
  }
  .swiper-banner-full {
    height: 120px;
  }
  .banner-img-full {
    height: 120px;
    border-radius: 10px;
  }
  .banner-title { font-size: 1rem; }
  .banner-desc { font-size: 0.87rem; }
}

/* Barra de busca hero */
.hero-search-bar {
  position: relative;
  display: flex;
  align-items: center;
  background: rgba(26,26,46,0.92);
  border-radius: 40px;
  box-shadow: 0 2px 12px rgba(163,98,255,0.10);
  padding: 0.25rem 0.5rem;
  margin-bottom: 1.5rem;
  max-width: 540px;
  width: 100%;
}
.hero-search-input {
  border: none;
  background: transparent;
  color: #fff;
  font-size: 1.13rem;
  padding: 0.9rem 1.2rem;
  border-radius: 40px;
  width: 100%;
  outline: none;
  box-shadow: none;
}
.hero-search-input::placeholder {
  color: #b0b0c0;
  opacity: 1;
  font-size: 1.05rem;
}
.hero-search-btn {
  background: linear-gradient(90deg, #a362ff, #00ffe1);
  border: none;
  color: #181e2a;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  margin-left: 0.3rem;
  transition: background 0.2s, color 0.2s;
  box-shadow: 0 2px 8px rgba(163,98,255,0.18);
  cursor: pointer;
}
.hero-search-btn:hover {
  background: linear-gradient(90deg, #00ffe1, #a362ff);
  color: #fff;
}
@media (max-width: 991.98px) {
  .hero-section {
    flex-direction: column;
    padding: 2rem 0.7rem;
    gap: 1.2rem;
  }
  .hero-title {
    font-size: 2rem;
  }
  .hero-img {
    max-width: 100%;
    height: auto;
  }
}
@media (max-width: 600px) {
  .hero-section {
    padding: 1rem 0.2rem;
    gap: 0.7rem;
  }
  .hero-title {
    font-size: 1.2rem;
  }
  .hero-img {
    max-width: 100%;
    height: auto;
  }
}
</style>