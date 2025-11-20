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
                <i class="bi bi-star-fill"></i> <strong>4.9/5</strong> &nbsp; <span class="divider">|</span> &nbsp; Confiável pela comunidade
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
        <!-- Coluna Direita: Swiper -->
        <div class="col-lg-6 col-12 d-flex justify-content-center align-items-center hero-img-col">
          <Swiper
            :modules="[Navigation, Pagination, Autoplay]"
            navigation
            pagination
            autoplay
            loop
            class="hero-swiper"
          >
            <SwiperSlide>
              <div class="hero-img-box position-relative hero-img-box-contain">
                <img
                  src="/images/gabinete hero section.jpg"
                  alt="Gabinete Gamer"
                  class="hero-img-main hero-img-contain"
                />
                <span class="hero-img-badge glow-badge">
                  <i class="bi bi-controller"></i> Gabinete Gamer
                </span>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div class="hero-img-box position-relative">
                <img
                  src="/images/ryzen 5 hero.webp"
                  alt="Ryzen 5 Hero"
                  class="hero-img-main"
                />
                <span class="hero-img-badge glow-badge">
                  <i class="bi bi-cpu"></i> Ryzen 5 Power
                </span>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div class="hero-img-box position-relative hero-img-box-contain">
                <img
                  src="/images/rtx 5060 hero.avif"
                  alt="RTX 5060 Hero"
                  class="hero-img-main hero-img-contain"
                />
                <span class="hero-img-badge glow-badge">
                  <i class="bi bi-gpu-card"></i> RTX 5060
                </span>
              </div>
            </SwiperSlide>
          </Swiper>
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
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700&display=swap');

* { 
  font-family: 'Rajdhani', sans-serif;
}

.hero-section-ggtech {
  background: #ffffff; /* Fundo branco */
  min-height: 80vh;
  padding: 4rem 0 3rem 0; /* Espaçamento maior */
  position: relative;
  overflow: hidden;
  font-family: 'Inter', 'Poppins', Arial, sans-serif;
  box-shadow: 0 4px 32px rgba(0, 0, 0, 0.05); /* Sombra leve */
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
  max-width: 500px; /* Largura máxima para evitar linhas longas */
  margin: 0 auto;
  padding: 0 1rem;
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
  color: #0b1e46; /* Azul-escuro */
  letter-spacing: 0.5px;
  line-height: 1.08;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.1); /* Sombra leve */
}

.hero-title-gradient {
  background: linear-gradient(90deg, #0057ff 0%, #8a2eff 100%); /* Gradiente suavizado */
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 900;
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
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1); /* Sombra leve */
  transition: background 0.3s, box-shadow 0.3s, transform 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5em;
  outline: none;
  border: none;
  position: relative;
}

.hero-btn-main {
  background: #0057ff; /* Azul sólido */
  color: #fff;
}
.hero-btn-main:hover {
  background: #6b2eff; /* Tom violeta */
  box-shadow: 0 4px 18px rgba(107, 46, 255, 0.3); /* Sombra mais forte */
  transform: translateY(-2px);
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

.hero-swiper {
  width: 100%;
  max-width: 480px;
  border-radius: 2.2rem;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.hero-img-main {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Ajusta o preenchimento para ocupar todo o espaço */
  border-radius: 2.2rem;
  transition: transform 0.35s cubic-bezier(.4,2,.3,1), box-shadow 0.22s;
}

/* Estilo específico para imagens que devem aparecer inteiras (slides 1 e 3) */
.hero-img-contain {
  object-fit: contain !important; /* Mostra a imagem inteira sem cortes */
  object-position: center; /* Centraliza a imagem */
  background: #f9f9f9; /* Fundo claro para preencher espaços vazios */
}

.hero-img-box-contain {
  background: #f9f9f9; /* Fundo claro para os slides 1 e 3 */
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-img-box {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 400px; /* Aumentado para 400px */
  max-width: 600px; /* Aumentado para 600px */
  border-radius: 2.2rem;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1); /* Sombra leve */
  background: #f9f9f9; /* Fundo claro */
  margin-top: 2.5rem;
  transition: box-shadow 0.3s, transform 0.2s;
}

.hero-img-box:hover {
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.2); /* Sombra mais forte */
  transform: scale(1.05);
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
  background: linear-gradient(90deg, #ff7a29 0%, #8a2eff 100%); /* Laranja/roxo vibrante */
  color: #fff;
  font-weight: 700;
  border-radius: 2rem;
  padding: 0.7rem 2.2rem;
  font-size: 1.13rem;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1); /* Sombra leve */
  transition: box-shadow 0.3s, transform 0.2s;
}
.hero-offer-banner:hover {
  box-shadow: 0 6px 32px rgba(255, 122, 41, 0.3); /* Sombra mais forte */
  transform: translateY(-2px);
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
    padding: 2.5rem 0 2rem 0;
  }
  .hero-img-col {
    order: -1;
    margin-bottom: 2rem;
  }
  .hero-text-col {
    min-height: auto;
  }
  .hero-title {
    font-size: 2.5rem;
    text-align: center;
  }
  .hero-desc {
    font-size: 1.1rem;
    text-align: center;
  }
  .hero-rating {
    margin: 0 auto 1rem auto;
  }
  .hero-btns-row {
    justify-content: center;
  }
  .hero-trust {
    justify-content: center;
    font-size: 0.95rem;
  }
  .hero-offer-banner {
    top: 1rem;
    right: 1rem;
    left: 1rem;
    font-size: 0.95rem;
    padding: 0.6rem 1.5rem;
  }
  .hero-img-box {
    max-width: 100%;
    height: 350px;
    margin-top: 1.5rem;
  }
}

@media (max-width: 768px) {
  .hero-section-ggtech {
    padding: 2rem 0 1.5rem 0;
  }
  .hero-title {
    font-size: 2rem;
    line-height: 1.1;
  }
  .hero-desc {
    font-size: 1rem;
    line-height: 1.5;
  }
  .hero-btn-main,
  .hero-btn-outline {
    min-width: 140px;
    font-size: 1rem;
    padding: 0.7rem 1.5rem;
  }
  .hero-trust {
    flex-direction: column;
    gap: 0.8rem;
    font-size: 0.9rem;
  }
  .hero-img-box {
    height: 300px;
  }
  .hero-swiper {
    max-width: 100%;
  }
  .hero-offer-banner {
    position: relative;
    top: 0;
    right: 0;
    left: 0;
    margin-top: 1.5rem;
    font-size: 0.9rem;
    padding: 0.5rem 1.2rem;
  }
}

@media (max-width: 600px) {
  .hero-section-ggtech {
    padding: 1.5rem 0 1rem 0;
  }
  .hero-title {
    font-size: 1.6rem;
    margin-bottom: 0.8rem;
  }
  .hero-desc {
    font-size: 0.95rem;
    margin-bottom: 1rem;
  }
  .hero-badge {
    font-size: 0.9rem;
    padding: 0.5rem 1.2rem;
  }
  .hero-rating {
    font-size: 0.95rem;
    padding: 0.35rem 0.9rem;
  }
  .hero-btn-main,
  .hero-btn-outline {
    min-width: 120px;
    font-size: 0.95rem;
    padding: 0.6rem 1.2rem;
  }
  .hero-btns-row {
    gap: 0.8rem;
  }
  .hero-img-box {
    height: 250px;
    margin-top: 1rem;
  }
  .hero-img-badge {
    font-size: 0.85rem;
    padding: 0.4rem 0.9rem;
    top: 0.8rem;
    right: 0.8rem;
  }
}

@media (max-width: 400px) {
  .hero-title {
    font-size: 1.4rem;
  }
  .hero-desc {
    font-size: 0.9rem;
  }
  .hero-btn-main,
  .hero-btn-outline {
    min-width: 100px;
    font-size: 0.9rem;
    padding: 0.5rem 1rem;
  }
  .hero-img-box {
    height: 220px;
  }
  .hero-trust {
    font-size: 0.85rem;
  }
}
</style>