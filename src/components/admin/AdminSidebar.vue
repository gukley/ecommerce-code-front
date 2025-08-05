<template>
    <nav class="admin-sidebar text-white p-3 shadow-lg">
      <div class="sidebar-header text-center mb-4">
        <h3 class="fw-bold text-primary-ggtech mb-0">GGTECH Admin</h3>
        <small class="text-light-50">Painel de Controle</small>
      </div>
  
      <ul class="nav flex-column">
        <li class="nav-item mb-2">
          <router-link to="/" class="nav-link-custom">
            <i class="bi bi-house me-2"></i> Ir para Home
          </router-link>
        </li>
        <li class="nav-item mb-2">
          <router-link :to="{ name: 'AdminDashboard' }" class="nav-link-custom">
            <i class="bi bi-speedometer2 me-2"></i> Dashboard
          </router-link>
        </li>
        <li class="nav-item mb-2">
          <router-link :to="{ name: 'AdminProducts' }" class="nav-link-custom">
            <i class="bi bi-box-seam me-2"></i> Produtos
          </router-link>
        </li>
        <li class="nav-item mb-2">
          <router-link :to="{ name: 'AdminCategories' }" class="nav-link-custom">
            <i class="bi bi-tags me-2"></i> Categorias
          </router-link>
        </li>
        <li class="nav-item mb-2">
          <router-link :to="{ name: 'AdminOrders' }" class="nav-link-custom">
            <i class="bi bi-list-check me-2"></i> Pedidos
          </router-link>
        </li>
       </ul>
  
      <div class="sidebar-footer mt-auto pt-3">
        <button @click="logout" class="btn btn-logout w-100">
          <i class="bi bi-box-arrow-right me-2"></i> Sair
        </button>
      </div>
    </nav>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router';
  import { useToast } from 'vue-toastification';
  
  const router = useRouter();
  const toast = useToast();
  
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.info('Você foi desconectado.');
    router.push({ name: 'Login' }); 
  };
  </script>
  
  <style scoped>

  .admin-sidebar {
    width: 250px !important;
    min-width: 250px !important;
    max-width: 250px !important;
    min-height: 100vh;
    position: sticky;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding-bottom: 1rem;
    background: linear-gradient(180deg, #1a1a2e 0%, #24243a 100%);
    border-right: 1px solid rgba(255, 255, 255, 0.1);
    z-index: 10;
    box-shadow: 2px 0 20px rgba(0, 0, 0, 0.1);
  }

  .sidebar-header {
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    padding-bottom: 1.5rem;
    margin-bottom: 1.5rem;
    background: rgba(255, 255, 255, 0.02);
    border-radius: 12px;
    padding: 1.5rem 1rem;
    margin: 0 0.5rem 1.5rem 0.5rem;
  }
  .text-primary-ggtech {
    color: #00ffe1 !important;
    font-family: 'Inter', sans-serif;
    font-weight: 700;
    text-shadow: 0 0 10px rgba(0, 255, 225, 0.3);
  }
  .text-light-50 {
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.9rem;
  }
  .nav-link-custom {
    display: flex;
    align-items: center;
    padding: 0.85rem 1.2rem;
    color: rgba(255, 255, 255, 0.7);
    text-decoration: none;
    border-radius: 12px;
    transition: all 0.3s ease;
    font-size: 1rem;
    margin: 0 0.5rem 0.3rem 0.5rem;
    border: 1px solid transparent;
  }
  .nav-link-custom:hover {
    background-color: rgba(255, 255, 255, 0.05);
    color: #00ffe1;
    border-color: rgba(0, 255, 225, 0.2);
    transform: translateX(5px);
  }
  .nav-link-custom.router-link-active {
    background: linear-gradient(135deg, rgba(0, 255, 225, 0.1) 0%, rgba(0, 124, 240, 0.1) 100%);
    color: #00ffe1;
    border-color: rgba(0, 255, 225, 0.3);
    box-shadow: 0 2px 15px rgba(0, 255, 225, 0.1);
  }
  .nav-link-custom i {
    font-size: 1.1rem;
    margin-right: 0.8rem;
    opacity: 0.8;
    transition: opacity 0.3s ease;
  }
  .nav-link-custom:hover i {
    opacity: 1;
  }
  .btn-logout {
    background: linear-gradient(135deg, #e53e3e 0%, #c53030 100%);
    color: #fff;
    border: 1px solid rgba(229, 62, 62, 0.3);
    border-radius: 12px;
    padding: 0.85rem 1.2rem;
    font-size: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    transition: all 0.3s ease;
    margin: 0 0.5rem;
  }
  .btn-logout i {
    color: #fff !important;
    font-size: 1.1rem;
  }
  .btn-logout:hover {
    background: linear-gradient(135deg, #c53030 0%, #a32020 100%);
    color: #fff;
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(229, 62, 62, 0.2);
    border-color: rgba(229, 62, 62, 0.5);
  }
  
  .sidebar-footer {
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    padding-top: 1rem;
    margin-top: 1rem;
  }
  </style>