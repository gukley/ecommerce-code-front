<template>
    <nav class="admin-sidebar bg-sidebar text-white p-3 shadow-lg">
      <div class="sidebar-header text-center mb-4">
        <h3 class="fw-bold text-primary-ggtech mb-0">GGTECH Admin</h3>
        <small class="text-light-50">Painel de Controle</small>
      </div>
  
      <ul class="nav flex-column">
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
          <router-link :to="{ name: 'AdminUsers' }" class="nav-link-custom">
            <i class="bi bi-people me-2"></i> Usuários
          </router-link>
        </li>
        <li class="nav-item mb-2">
          <router-link :to="{ name: 'AdminOrders' }" class="nav-link-custom">
            <i class="bi bi-list-check me-2"></i> Pedidos
          </router-link>
        </li>
        </ul>
  
      <div class="sidebar-footer mt-auto pt-3 border-top border-secondary-subtle">
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
    router.push({ name: 'Login' }); // Redireciona para a página de login
  };
  </script>
  
  <style scoped>
  .admin-sidebar {
    width: 250px; 
    min-height: 100vh;
    position: sticky; 
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between; 
    padding-bottom: 1rem; 
  }
  
  .bg-sidebar {
    background-color: #212130; 
  }
  
  .sidebar-header {
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    padding-bottom: 1rem;
    margin-bottom: 1rem;
  }
  
  .text-primary-ggtech {
    color: #00ffe1 !important; 
    font-family: 'Orbitron', sans-serif; 
  }
  
  .text-light-50 {
    color: rgba(255, 255, 255, 0.7);
  }
  
  .nav-link-custom {
    display: flex;
    align-items: center;
    padding: 0.75rem 1rem;
    color: rgba(255, 255, 255, 0.8);
    text-decoration: none;
    border-radius: 8px;
    transition: all 0.3s ease;
    font-size: 1.05rem;
  }
  
  .nav-link-custom:hover {
    background-color: #313142;
    color: white;
    transform: translateX(5px);
  }
  
  .nav-link-custom.router-link-active {
    background: linear-gradient(90deg, #8f5fe8, #a362ff);
    color: white;
    box-shadow: 0 2px 10px rgba(143, 95, 232, 0.4);
  }
  
  .nav-link-custom i {
    font-size: 1.2rem;
    margin-right: 0.75rem;
  }
  
  .btn-logout {
    background-color: #dc3545; 
    color: white;
    border: none;
    border-radius: 50px;
    padding: 0.75rem 1rem;
    font-size: 1.05rem;
    transition: all 0.3s ease;
  }
  
  .btn-logout:hover {
    background-color: #c82333;
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(220, 53, 69, 0.4);
  }
  </style>