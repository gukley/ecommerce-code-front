<template>
  <section class="hero-section-ggtech d-flex align-items-center">
    <div class="container">
      <div class="row align-items-center justify-content-center flex-lg-nowrap hero-row-custom">
        <!-- Coluna Esquerda: Texto -->
        <div class="col-lg-6 col-12 mb-5 mb-lg-0 hero-text-col">
          <transition name="fade-slide" appear>
            <div class="d-flex flex-column align-items-start justify-content-center h-100 hero-text-content">
              <div class="hero-badge mb-3 glow-badge">
                <span>⚡ NOVA GERAÇÃO DISPONÍVEL</span>
              </div>
              <h1 class="hero-title mb-3">
                Monte seu <span class="hero-title-gradient">Setup</span><span class="hero-title-gradient2"> Gamer</span>
              </h1>
              <p class="hero-desc mb-4">
                Computadores de alta performance para todos os estilos de jogo.<br />
                Configure seu PC ideal com os melhores componentes do mercado.
              </p>
              <div class="hero-rating mb-3">
                <i class="bi bi-star-fill"></i> 4.9/5 &nbsp; <span class="divider">|</span> &nbsp; +2.000 avaliações de clientes reais
              </div>
              <transition-group name="fade-slide" tag="div" class="d-flex gap-3 flex-wrap mb-4 hero-btns-row">
                <router-link
                  to="/produtos"
                  class="btn hero-btn-main shadow-btn"
                  key="explorar"
                >
                  <span>🔥 Explorar Produtos</span>
                  <i class="bi bi-arrow-right ms-2"></i>
                </router-link>
                <router-link
                  to="/produtos"
                  class="btn hero-btn-outline shadow-btn"
                  key="ofertas"
                >
                  Ver Ofertas
                </router-link>
              </transition-group>
              <div class="hero-trust d-flex gap-4 flex-wrap">
                <span><i class="bi bi-shield-check"></i> Site 100% seguro</span>
                <span><i class="bi bi-credit-card"></i> Parcele em até 12x</span>
                <span><i class="bi bi-truck"></i> Frete grátis acima de R$500</span>
              </div>
            </div>
          </transition>
        </div>
        <!-- Coluna Direita: Imagem -->
        <div class="col-lg-6 col-12 d-flex justify-content-center align-items-center hero-img-col">
          <transition name="fade-slide" appear>
            <div class="hero-img-box position-relative">
              <img
                src="@/assets/hero-pc-setup.jpg"
                alt="PC Gamer Setup"
                class="hero-img-main"
              />
              <span class="hero-img-badge glow-badge">
                <i class="bi bi-controller"></i> Performance Extrema
              </span>
            </div>
          </transition>
        </div>
      </div>
      <!-- Banner de oferta superior -->
      <transition name="fade-slide" appear>
        <div class="hero-offer-banner glow-offer">
          <span>🔥 <strong>SUPER OFERTA:</strong> 20% OFF em GPUs selecionadas! <router-link to="/produtos">Ver ofertas →</router-link></span>
        </div>
      </transition>
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

.hero-section-ggtech {
  background: linear-gradient(120deg, #f8fafc 60%, #e9f1ff 100%);
  min-height: 80vh;
  padding: 3.5rem 0 2.5rem 0;
  position: relative;
  overflow: hidden;
  font-family: 'Inter', 'Poppins', Arial, sans-serif;
  box-shadow: 0 4px 32px #4f46e510;
}

.hero-row-custom {
  min-height: 540px;
  align-items: center;
}

.hero-text-col {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 480px;
}

.hero-text-content {
  width: 100%;
  max-width: 520px;
  margin: 0 auto;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}

.hero-badge {
  background: linear-gradient(90deg, #64b5f6 0%, #8f5fe8 100%);
  color: #fff;
  font-weight: 800;
  border-radius: 1.2rem;
  padding: 0.6rem 1.5rem;
  font-size: 1.08rem;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 16px #64b5f633, 0 0 8px #8f5fe855;
  display: inline-block;
  text-shadow: 0 2px 8px #23233a22;
  border: 1.5px solid #8f5fe8;
  filter: drop-shadow(0 0 8px #64b5f6cc);
  transition: box-shadow 0.2s;
}

.glow-badge {
  box-shadow: 0 0 16px #64b5f6cc, 0 0 8px #8f5fe855;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 900;
  color: #232e47;
  letter-spacing: 0.5px;
  line-height: 1.08;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 12px #8f5fe820;
}

.hero-title-gradient {
  background: linear-gradient(90deg, #06b6d4 0%, #4f46e5 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 900;
  filter: drop-shadow(0 0 8px #64b5f6cc);
}
.hero-title-gradient2 {
  background: linear-gradient(90deg, #4f46e5 0%, #9333ea 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 900;
  filter: drop-shadow(0 0 8px #8f5fe8cc);
}

.hero-desc {
  color: #4b5563;
  font-size: 1.25rem;
  font-weight: 500;
  margin-bottom: 0.7rem;
  line-height: 1.7;
  letter-spacing: 0.01em;
  text-shadow: 0 1px 8px #fff8;
}

.hero-rating {
  background: #ede9fe;
  color: #4f46e5;
  border-radius: 1.2rem;
  font-size: 1.08rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 0.4rem 1.1rem;
  box-shadow: 0 2px 8px #9333ea10;
  margin-bottom: 0.5rem;
  letter-spacing: 0.2px;
}
.hero-rating i {
  color: #fbbf24;
  font-size: 1.1rem;
}
.hero-rating .divider {
  color: #a1a1aa;
  font-weight: 400;
}

.hero-btns-row {
  width: 100%;
  display: flex;
  gap: 1.2rem;
  justify-content: flex-start;
  align-items: center;
}

.hero-btn-main,
.hero-btn-outline {
  min-width: 170px;
  font-size: 1.13rem;
  font-weight: 700;
  border-radius: 2rem;
  padding: 0.85rem 2.2rem;
  box-shadow: 0 2px 12px #9333ea22;
  transition: background 0.22s, box-shadow 0.18s, transform 0.18s, color 0.18s;
  display: flex;
  align-items: center;
  gap: 0.5em;
  outline: none;
  border: none;
  position: relative;
}

.hero-btn-main {
  background: linear-gradient(90deg, #4f46e5 0%, #9333ea 100%);
  color: #fff;
}
.hero-btn-main:hover, .hero-btn-main:focus {
  background: linear-gradient(90deg, #9333ea 0%, #4f46e5 100%);
  color: #fff;
  transform: translateY(-2px) scale(1.04);
  box-shadow: 0 4px 18px #9333ea40, 0 0 12px #64b5f6cc;
  filter: brightness(1.08);
}

.hero-btn-outline {
  background: #fff;
  color: #4f46e5;
  border: 2px solid #e5e7eb;
}
.hero-btn-outline:hover, .hero-btn-outline:focus {
  background: #ede9fe;
  color: #9333ea;
  border-color: #9333ea;
  transform: translateY(-2px) scale(1.04);
  box-shadow: 0 4px 18px #9333ea30, 0 0 8px #8f5fe8cc;
}

.shadow-btn {
  box-shadow: 0 2px 12px #8f5fe822;
}

.hero-trust {
  font-size: 1.05rem;
  color: #4f46e5;
  gap: 1.5rem;
  margin-top: 0.5rem;
}
.hero-trust i {
  color: #9333ea;
  margin-right: 0.3em;
}

.hero-img-col {
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-img-box {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 340px;
  min-width: 340px;
  max-width: 480px;
  width: 100%;
  border-radius: 2.2rem;
  overflow: hidden;
  box-shadow: 0 8px 32px #9333ea22;
  background: linear-gradient(120deg, #ede9fe 60%, #f9fafb 100%);
  margin-top: 2.5rem;
  transition: box-shadow 0.22s;
}
.hero-img-main {
  width: 100%;
  height: auto;
  max-width: 480px;
  border-radius: 2.2rem;
  box-shadow: 0 4px 24px #4f46e520;
  display: block;
  transition: transform 0.35s cubic-bezier(.4,2,.3,1), box-shadow 0.22s;
  z-index: 1;
}
.hero-img-box:hover .hero-img-main {
  transform: scale(1.035) rotate(-1.5deg);
  box-shadow: 0 12px 48px #4f46e540, 0 2px 16px #9333ea30;
}
.hero-img-badge {
  position: absolute;
  top: 1.2rem;
  right: 1.2rem;
  background: linear-gradient(90deg, #64b5f6 0%, #8f5fe8 100%);
  color: #fff;
  font-weight: 700;
  border-radius: 1.2rem;
  padding: 0.5rem 1.2rem;
  font-size: 1rem;
  box-shadow: 0 2px 8px #9333ea10, 0 0 12px #64b5f6cc;
  display: flex;
  align-items: center;
  gap: 0.5em;
  z-index: 2;
  border: 1.5px solid #8f5fe8;
  filter: drop-shadow(0 0 8px #64b5f6cc);
  transition: box-shadow 0.2s;
}

.glow-offer {
  box-shadow: 0 0 16px #64b5f6cc, 0 0 8px #8f5fe855;
  border: 1.5px solid #8f5fe8;
  filter: drop-shadow(0 0 8px #64b5f6cc);
}

.hero-offer-banner {
  position: absolute;
  top: 2rem;
  right: 2.5rem;
  left: auto;
  background: linear-gradient(90deg, #7c3aed 0%, #4f46e5 100%);
  color: #fff;
  font-weight: 700;
  border-radius: 2rem;
  padding: 0.7rem 2.2rem;
  font-size: 1.13rem;
  box-shadow: 0 4px 24px #9333ea22, 0 0 12px #64b5f6cc;
  z-index: 10;
  letter-spacing: 0.2px;
  display: inline-block;
  pointer-events: auto;
  text-shadow: 0 2px 8px #23233a22;
  border: 1.5px solid #8f5fe8;
  filter: drop-shadow(0 0 8px #64b5f6cc);
  transition: box-shadow 0.2s;
}
.hero-offer-banner span {
  display: flex;
  align-items: center;
  gap: 0.5em;
}
.hero-offer-banner a {
  color: #fff;
  text-decoration: underline;
  font-weight: 700;
}
.hero-offer-banner a:hover {
  color: #f9fafb;
  text-decoration: none;
}

/* Animações de entrada */
.fade-slide-enter-active, .fade-slide-leave-active {
  transition: opacity 0.7s cubic-bezier(.4,.2,.2,1), transform 0.7s cubic-bezier(.4,.2,.2,1);
}
.fade-slide-enter-from, .fade-slide-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
.fade-slide-enter-to, .fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}

/* Responsivo */
@media (max-width: 991.98px) {
  .hero-section-ggtech {
    padding: 2rem 0 1.2rem 0;
    min-height: 60vh;
  }
  .hero-title {
    font-size: 2.3rem;
  }
  .hero-img-box {
    min-width: 220px;
    min-height: 220px;
    max-width: 320px;
    border-radius: 1.2rem;
    margin-top: 1.2rem;
  }
  .hero-img-main {
    border-radius: 1.2rem;
    max-width: 320px;
  }
  .hero-img-badge {
    font-size: 0.92rem;
    padding: 0.4rem 0.8rem;
    top: 0.7rem;
    right: 0.7rem;
  }
  .hero-offer-banner {
    top: 1rem;
    right: 1rem;
    font-size: 0.98rem;
    padding: 0.5rem 1.2rem;
  }
  .hero-text-content {
    max-width: 100%;
    padding-left: 0;
    padding-right: 0;
  }
}

@media (max-width: 600px) {
  .hero-section-ggtech {
    padding: 1rem 0 0.7rem 0;
    min-height: 40vh;
  }
  .hero-title {
    font-size: 1.3rem;
  }
  .hero-img-box {
    min-width: 120px;
    min-height: 120px;
    max-width: 180px;
    border-radius: 0.7rem;
    margin-top: 0.7rem;
  }
  .hero-img-main {
    border-radius: 0.7rem;
    max-width: 180px;
  }
  .hero-img-badge {
    font-size: 0.8rem;
    padding: 0.3rem 0.6rem;
    top: 0.3rem;
    right: 0.3rem;
  }
  .hero-offer-banner {
    top: 0.5rem;
    right: 0.5rem;
    font-size: 0.85rem;
    padding: 0.3rem 0.7rem;
  }
  .hero-trust {
    font-size: 0.92rem;
    gap: 0.7rem;
  }
  .hero-text-content {
    padding-left: 0;
    padding-right: 0;
  }
  .hero-btns-row {
    flex-direction: column;
    gap: 0.7rem;
    align-items: stretch;
  }
}
</style>