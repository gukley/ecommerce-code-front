<template>
    <div class="container my-5">
      <h5 class="text-white mb-4 text-center">Marcas que você encontra na GGTECH</h5>
  
      <Swiper
        :slides-per-view="2"
        :space-between="20"
        :breakpoints="{
          576: { slidesPerView: 3 },
          768: { slidesPerView: 4 },
          992: { slidesPerView: 5 },
          1200: { slidesPerView: 7 }
        }"
        :autoplay="{ delay: 2500 }"
        :loop="true"
        class="brand-swiper"
      >
        <SwiperSlide v-for="brand in brands" :key="brand.name">
          <div class="brand-card text-center p-3">
            <img
              :src="brand.logo"
              :alt="brand.name"
              class="img-fluid brand-logo mx-auto d-block"
            />
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
     { name: 'Asrock', logo: '/images/asrock.png' }
  ];
  </script>
  
<style scoped>
.brand-card {
  background: linear-gradient(145deg, #1e1e2e, #151522);
  border: 1px solid rgba(0, 200, 255, 0.1);
  border-radius: 16px;
  transition: all 0.3s ease;
  box-shadow: 0 0 12px rgba(0, 200, 255, 0.05);
  backdrop-filter: blur(4px); 
}
  
.brand-card:hover {
    transform: scale(1.05);
    box-shadow: 0 0 12px rgba(0, 200, 255, 0.3);
    border: 1px solid rgba(0, 200, 255, 0.3);
  }
  
.brand-logo {
  max-height: 50px;
  object-fit: contain;
  transition: filter 0.3s ease;
}

  
.brand-card:hover .brand-logo {
    filter: grayscale(0%);
  }
  
.brand-name {
    color: rgba(255, 255, 255, 0.75);
    font-size: 0.85rem;
    display: block;
  }
</style>
  