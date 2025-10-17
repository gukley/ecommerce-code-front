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
      // Exibe todas as categorias para todos os usuários
      categorias.value = [
        { nome: 'Todos os Produtos', icone: 'bi bi-grid-fill' },
        ...apiCategories.map(cat => ({ nome: cat.name }))
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
      carregarCategorias();
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
    min-width: 260px;
    max-width: 260px;
    background-color: #f8f9fa;
    box-shadow: 0 4px 24px rgba(50, 50, 80, 0.08);
    border: 1px solid #e5e7eb;
    margin: 2rem 0;
    top: 0;
    position: sticky;
    overflow-y: auto;
    color: #232e47;
  }
  
  .sidebar-title {
    color: #399bff;
    font-size: 1.5rem;
    letter-spacing: 0.5px;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #e5e7eb;
    margin-bottom: 1.2rem !important;
  }
  
  .sidebar-nav-link {
    padding: 10px 14px;
    border-radius: 8px;
    transition: all 0.2s ease;
    font-size: 1rem;
    font-weight: 500;
    color: #232e47 !important;
    background: transparent;
    margin-bottom: 2px;
  }
  
  .sidebar-nav-link .sidebar-icon {
    font-size: 1.2rem;
    color: #b8d8ff;
    transition: color 0.2s ease;
  }
  
  .sidebar-nav-link:hover,
  .active-sidebar-link {
    background: #eaf6ff;
    color: #399bff !important;
    font-weight: 600;
  }
  
  .active-sidebar-link .sidebar-icon {
    color: #399bff !important;
  }
  
  /* Offer box */
  .offer-box-promo {
    background: #eaf6ff;
    border: 1px solid #b8d8ff;
    box-shadow: 0 2px 8px rgba(50, 50, 80, 0.08);
    text-align: center;
    color: #232e47;
  }
  
  .offer-box-promo p,
  .offer-box-promo small {
    color: #232e47;
  }
  
  .btn-offer-action {
    background: #399bff;
    color: #fff;
    border: none;
    border-radius: 30px;
    padding: 0.5rem 1.1rem;
    font-size: 0.95rem;
    box-shadow: 0 2px 8px #399bff20;
    transition: background 0.18s, color 0.18s;
    cursor: pointer;
  }
  
  .btn-offer-action:hover {
    background: #232e47;
    color: #fff;
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

  @media (max-width: 991.98px) {
    .sidebar {
      width: 100%;
      min-width: 0;
      margin-bottom: 1.2rem;
      border-radius: 1rem;
      padding: 1rem;
    }
  }
  @media (max-width: 600px) {
    .sidebar {
      width: 100%;
      min-width: 0;
      margin-bottom: 0.7rem;
      border-radius: 0.7rem;
      padding: 0.7rem;
    }
  }
  </style>
