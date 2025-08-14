<template>
    <div class="sidebar text-white p-4 d-flex flex-column rounded-4">
      <h4 class="mb-4 sidebar-title fw-bold">Categorias</h4>
  
      <ul class="nav flex-column" role="list">
        <li
          v-for="cat in categorias"
          :key="cat.nome"
          class="nav-item mb-2"
          role="listitem"
        >
          <a
            href="#"
            class="nav-link sidebar-nav-link d-flex align-items-center"
            :class="{ 'active-sidebar-link': categoriaAtiva === cat.nome }"
            @click.prevent="selecionarCategoria(cat.nome)"
            role="button"
            tabindex="0"
            @keyup.enter.prevent="selecionarCategoria(cat.nome)"
            aria-current="categoriaAtiva === cat.nome ? 'page' : undefined"
          >
            <i v-if="cat.icone" :class="cat.icone" class="me-3 sidebar-icon"></i>
            {{ cat.nome }}
          </a>
        </li>
      </ul>
  
      <div class="mt-auto mt-5 p-4 rounded-3 text-center offer-box-promo">
        <i class="bi bi-fire text-warning fs-3 mb-2 animate-pulse-fast" aria-hidden="true"></i>
        <p class="mb-1 fw-bold fs-5">Oferta Especial</p>
        <small class="text-white-75">Até 50% OFF em produtos selecionados</small>
        <button class="btn btn-sm btn-offer-action mt-3 fw-bold" type="button">
          Ver Ofertas
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, watch } from 'vue';
  import { getCategories } from '@/services/apiService';
  import { useAuthStore } from '@/stores/authStore';
  
  const emit = defineEmits(['categoria-selecionada']);
  const categorias = ref([]);
  const categoriaAtiva = ref('Todos os Produtos');
  const authStore = useAuthStore();
  
  const carregarCategorias = async () => {
  try {
    const apiCategories = await getCategories();

    const userId = authStore.user?.id;

    categorias.value = [
      { nome: 'Todos os Produtos', icone: 'bi bi-grid-fill' },
      ...apiCategories
        .filter(cat => !userId || cat.user_id === userId)
        .map(cat => ({ nome: cat.name }))
    ];
  } catch (err) {
    categorias.value = [
      { nome: 'Todos os Produtos', icone: 'bi bi-grid-fill' }
    ];
  }
};
  
  onMounted(() => {
    carregarCategorias();
  });
  
  watch(
    () => authStore.user,
    (newUser) => {
      if (newUser && newUser.id) {
        carregarCategorias();
      }
    },
    { immediate: true }
  );
  
  const selecionarCategoria = (nome) => {
    categoriaAtiva.value = nome;
    emit('categoria-selecionada', nome);
  };
  </script>
  
  <style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700&display=swap');
  
  .sidebar {
    height: 100%;
    min-width: 280px;
    max-width: 280px;
    background-color: #1f1f33;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(255, 255, 255, 0.08);
    margin: 2rem 0;
    top: 0;
    position: sticky;
    overflow-y: auto;
  }
  
  .sidebar-title {
    color: #00ffe1;
    font-size: 1.8rem;
    letter-spacing: 0.5px;
    text-shadow: 0 0 10px rgba(0, 255, 225, 0.4);
    padding-bottom: 0.5rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    margin-bottom: 1.5rem !important;
  }
  
  .sidebar-nav-link {
    padding: 12px 15px;
    border-radius: 10px;
    transition: all 0.3s ease;
    font-size: 1.05rem;
    font-weight: 500;
    color: #c0c0d0 !important;
    position: relative;
    overflow: hidden;
    z-index: 1;
    user-select: none;
  }
  
  .sidebar-nav-link .sidebar-icon {
    font-size: 1.3rem;
    color: #9090a0;
    transition: color 0.3s ease;
  }
  
  .sidebar-nav-link::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #a362ff, #8f5fe8);
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: -1;
    border-radius: 10px;
  }
  
  .sidebar-nav-link:hover::before,
  .active-sidebar-link::before {
    opacity: 1;
  }
  
  .sidebar-nav-link:hover {
    color: white !important;
    transform: translateX(5px);
  }
  
  .active-sidebar-link {
    color: white !important;
    font-weight: 600;
    box-shadow: 0 2px 10px rgba(163, 98, 255, 0.4);
  }
  
  .active-sidebar-link .sidebar-icon {
    color: #00ffe1 !important;
  }
  
  /* Offer box */
  .offer-box-promo {
    background: linear-gradient(145deg, #2c2c42, #3a3a50);
    border: 1px solid rgba(163, 98, 255, 0.3);
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
    position: relative;
    overflow: hidden;
    text-align: center;
  }
  
  .offer-box-promo::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle at center, rgba(163, 98, 255, 0.15) 0%, transparent 70%);
    transform: rotate(45deg);
    animation: rotateGlow 10s linear infinite;
    z-index: 0;
  }
  
  @keyframes rotateGlow {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  
  .offer-box-promo p,
  .offer-box-promo small {
    position: relative;
    z-index: 1;
  }
  
  .offer-box-promo strong {
    font-family: 'Orbitron', sans-serif;
    color: #00ffe1;
    text-shadow: 0 0 5px rgba(0, 255, 225, 0.5);
  }
  
  .text-white-75 {
    color: rgba(255, 255, 255, 0.75);
  }
  
  .btn-offer-action {
    background: linear-gradient(90deg, #00ffe1, #00c7b3);
    color: #1a1a2e;
    border: none;
    border-radius: 50px;
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
    box-shadow: 0 3px 15px rgba(0, 255, 225, 0.3);
    transition: all 0.3s ease;
    cursor: pointer;
  }
  
  .btn-offer-action:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 20px rgba(0, 255, 225, 0.5);
    background: linear-gradient(90deg, #00c7b3, #00a090);
  }
  
  /* animação para ícone de fogo */
  .animate-pulse-fast {
    animation: pulseFire 1.5s infinite ease-in-out;
  }
  
  @keyframes pulseFire {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.15);
      opacity: 0.8;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
  </style>
  