<template>
  <div class="container my-5">
    <h5 class="brand-title mb-4 text-center">Marcas que você encontra na GGTECH</h5>
    <Swiper
      :slides-per-view="2"
      :space-between="24"
      :breakpoints="{
        576: { slidesPerView: 3 },
        768: { slidesPerView: 4 },
        992: { slidesPerView: 5 },
        1200: { slidesPerView: 7 }
      }"
      :autoplay="{ delay: 2300, disableOnInteraction: false }"
      :loop="true"
      navigation
      pagination
      class="brand-swiper"
    >
      <SwiperSlide v-for="brand in brands" :key="brand.name">
        <div class="brand-card text-center p-3" tabindex="0">
          <div class="brand-logo-box">
            <img
              :src="brand.logo"
              :alt="brand.name"
              class="img-fluid brand-logo mx-auto d-block"
            />
            <span class="brand-glow"></span>
            <span class="brand-tooltip">Ver produtos</span>
          </div>
          <small class="brand-name mt-2">{{ brand.name }}</small>
        </div>
      </SwiperSlide>
    </Swiper>
  </div>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const brands = [
  { name: 'Intel', logo: '/images/intel marca.png' },
  { name: 'Amd', logo: '/images/amd marca.jpg' },
  { name: 'Kingston', logo: '/images/kingstom marca.jpeg' },
  { name: 'Aorus', logo: '/images/aorus logo.png' },
  { name: 'Redragon', logo: '/images/redragon marca.png' },
  { name: 'Superframe', logo: '/images/superframe logo.png' },
  { name: 'Asrock', logo: '/images/asrock.png' },
  { name: 'Hyperx', logo: '/images/hyperx marca.png' },
  { name: 'Razer', logo: '/images/razer marca.jpg' },
  { name: 'MSI', logo: '/images/msi marca.png' },
  { name: 'Nvidia', logo: '/images/nvidia marca.jpeg' }

];

</script>

<style scoped>
.brand-title {
  color: #333333; /* Texto escuro */
  font-weight: 700;
  font-size: 1.5rem;
  letter-spacing: 0.5px;
  margin-bottom: 1.5rem;
  text-align: center;
}

.brand-swiper {
  padding-bottom: 38px;
  position: relative;
}

.brand-card {
  background: #ffffff; /* Fundo branco */
  border-radius: 1rem;
  border: 1.5px solid #e0e0e0; /* Borda cinza clara */
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1); /* Sombra leve */
  transition: box-shadow 0.3s, transform 0.2s;
  position: relative;
  overflow: hidden;
}
.brand-card:hover, .brand-card:focus-visible {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2); /* Sombra mais forte ao passar o mouse */
  transform: scale(1.05);
  z-index: 2;
}

.brand-logo-box {
  position: relative;
  display: inline-block;
  width: 82px;
  height: 54px;
  margin: 0 auto;
}
.brand-logo {
  max-height: 50px;
  max-width: 82px;
  object-fit: contain;
  transition: transform 0.3s, box-shadow 0.3s;
}
.brand-card:hover .brand-logo,
.brand-card:focus-visible .brand-logo {
  transform: scale(1.1);
  box-shadow: 0 4px 16px rgba(57, 155, 255, 0.2); /* Destaque azul */
}

.brand-name {
  color: #666666; /* Texto cinza */
  font-size: 1rem;
  font-weight: 600;
  margin-top: 0.5rem;
  text-align: center;
}

/* Botões de navegação */
.swiper-button-prev,
.swiper-button-next {
  color: #399bff; /* Azul para os botões */
  background: #ffffff; /* Fundo branco */
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* Sombra leve */
  transition: background 0.3s, transform 0.2s;
}
.swiper-button-prev:hover,
.swiper-button-next:hover {
  background: #399bff; /* Fundo azul ao passar o mouse */
  color: #ffffff; /* Ícone branco */
  transform: scale(1.1);
}

@media (max-width: 991.98px) {
  .brand-logo {
    max-width: 70px;
    height: auto;
  }
}
@media (max-width: 600px) {
  .brand-logo {
    max-width: 60px;
    height: auto;
  }
}
</style>