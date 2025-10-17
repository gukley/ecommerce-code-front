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
      effect="coverflow"
      :coverflow-effect="{
        rotate: 20,
        stretch: 0,
        depth: 90,
        modifier: 1,
        slideShadows: true
      }"
      class="brand-swiper"
      pagination
      navigation
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
import 'swiper/css/effect-coverflow';

const brands = [
  { name: 'Intel', logo: '/images/intel marca.png' },
  { name: 'Amd', logo: '/images/amd marca.jpg' },
  { name: 'Kingston', logo: '/images/kingstom marca.jpeg' },
  { name: 'Aorus', logo: '/images/aorus logo.png' },
  { name: 'Redragon', logo: '/images/redragon marca.png' },
  { name: 'Superframe', logo: '/images/superframe logo.png' },
   { name: 'Asrock', logo: '/images/asrock.png' }
];
</script>

<style scoped>
.brand-title {
  color: #00ffe1;
  font-weight: 700;
  font-size: 1.25rem;
  letter-spacing: 0.5px;
  text-shadow: 0 2px 10px #00ffe122;
}

.brand-swiper {
  padding-bottom: 38px;
  position: relative;
}

.brand-card {
  background: rgba(30,30,46,0.82);
  border-radius: 18px;
  border: 2px solid transparent;
  box-shadow: 0 2px 14px rgba(0,255,225,0.09);
  transition: box-shadow 0.32s, border-color 0.32s, transform 0.22s;
  position: relative;
  overflow: visible;
  backdrop-filter: blur(7px);
}

.brand-card:hover, .brand-card:focus-visible {
  border-color: #00ffe1;
  box-shadow: 0 0 24px #00ffe1b0, 0 8px 36px #8f5fe8a1;
  transform: scale(1.07);
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
  transition: filter 0.35s, box-shadow 0.32s;
  filter: grayscale(35%);
  box-shadow: 0 2px 12px #00ffe188;
}
.brand-card:hover .brand-logo,
.brand-card:focus-visible .brand-logo {
  filter: none;
  box-shadow: 0 0 16px #8f5fe8cc;
}

.brand-glow {
  display: block;
  position: absolute;
  bottom: 0; left: 50%; transform: translateX(-50%);
  width: 68px; height: 12px;
  background: radial-gradient(circle, #00ffe1 0%, transparent 75%);
  opacity: 0.45;
  z-index: 1;
}

.brand-card:hover .brand-glow,
.brand-card:focus-visible .brand-glow {
  opacity: 0.9;
  filter: blur(1.5px);
  animation: glowPulse 1.6s infinite alternate;
}
@keyframes glowPulse {
  0% { opacity: 0.6; }
  100% { opacity: 1; }
}

.brand-tooltip {
  position: absolute;
  bottom: -26px;
  left: 50%;
  transform: translateX(-50%) scale(0.8);
  background: linear-gradient(90deg, #00ffe1 0%, #8f5fe8 100%);
  color: #23233a;
  font-size: 0.82rem;
  font-weight: 600;
  padding: 2.5px 13px;
  border-radius: 14px;
  box-shadow: 0 2px 12px #00ffe144;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s, transform 0.22s;
  z-index: 3;
}
.brand-card:hover .brand-tooltip,
.brand-card:focus-visible .brand-tooltip {
  opacity: 1;
  transform: translateX(-50%) scale(1);
}

.brand-name {
  color: #00ffe1c7;
  font-size: 0.97rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  display: block;
  margin-top: 4px;
}

@media (max-width: 991.98px) {
  .brands-carousel {
    gap: 0.7rem;
    flex-wrap: wrap;
    justify-content: center;
  }
  .brand-logo {
    max-width: 90px;
    height: auto;
    margin-bottom: 0.5rem;
  }
}
@media (max-width: 600px) {
  .brands-carousel {
    gap: 0.4rem;
    flex-wrap: wrap;
    justify-content: center;
  }
  .brand-logo {
    max-width: 60px;
    height: auto;
    margin-bottom: 0.3rem;
  }
}
</style>