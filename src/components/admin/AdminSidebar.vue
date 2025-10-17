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
        <li class="nav-item mb-2">
          <router-link :to="{ name: 'AdminCoupon' }" class="nav-link-custom">
          <i class="bi bi-ticket-perforated me-2"></i> Cupons
        </router-link>
        </li>
        <li class="nav-item mb-2">
          <router-link :to="{ name: 'CreateModerator' }" class="nav-link-custom">
            <i class="bi bi-person-plus me-2"></i> Criar Moderador
          </router-link>
        </li>
        <li class="nav-item mb-2">
          <router-link :to="{ name: 'FinanceDashboard' }" class="nav-link-custom">
            <i class="bi bi-bar-chart-line me-2"></i> Financeiro
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
    background: linear-gradient(180deg, #0f1419 0%, #1a2332 100%);
    border-right: 1px solid #374151;
    z-index: 10;
    box-shadow: 4px 0 25px rgba(0, 0, 0, 0.3);
  }

  .sidebar-header {
    border-bottom: 1px solid #374151;
    padding-bottom: 1.5rem;
    margin-bottom: 1.5rem;
    background: linear-gradient(135deg, #1a2332 0%, #2d3748 100%);
    border-radius: 1rem;
    padding: 1.5rem 1rem;
    margin: 0 0.5rem 1.5rem 0.5rem;
    border: 1px solid #374151;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  }
  
  .text-primary-ggtech {
    background: linear-gradient(90deg, #64b5f6 0%, #42a5f5 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-family: 'Inter', sans-serif;
    font-weight: 700;
    font-size: 1.5rem;
    letter-spacing: 0.02em;
  }
  
  .text-light-50 {
    color: #b0b7c3;
    font-size: 0.9rem;
    font-weight: 400;
  }
  .nav-link-custom {
    display: flex;
    align-items: center;
    padding: 0.85rem 1.2rem;
    color: #e8eaed;
    text-decoration: none;
    border-radius: 0.75rem;
    transition: all 0.3s ease;
    font-size: 0.95rem;
    margin: 0 0.5rem 0.3rem 0.5rem;
    border: 1px solid transparent;
    font-weight: 500;
    position: relative;
    overflow: hidden;
  }
  
  .nav-link-custom:hover {
    background: linear-gradient(135deg, #374151 0%, #4b5563 100%);
    color: #64b5f6;
    border-color: #64b5f6;
    transform: translateX(5px);
    box-shadow: 0 4px 15px rgba(100, 181, 246, 0.2);
  }
  
  .nav-link-custom.router-link-active {
    background: linear-gradient(135deg, #64b5f6 0%, #42a5f5 100%);
    color: white;
    border-color: #64b5f6;
    box-shadow: 0 4px 20px rgba(100, 181, 246, 0.3);
    transform: translateX(5px);
  }
  
  .nav-link-custom i {
    font-size: 1.1rem;
    margin-right: 0.8rem;
    opacity: 0.8;
    transition: all 0.3s ease;
  }
  
  .nav-link-custom:hover i {
    opacity: 1;
    transform: scale(1.1);
  }
  
  .nav-link-custom.router-link-active i {
    opacity: 1;
    color: white;
  }
  .btn-logout {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    color: #fff;
    border: 2px solid #ef4444;
    border-radius: 0.75rem;
    padding: 0.85rem 1.2rem;
    font-size: 0.95rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    transition: all 0.3s ease;
    margin: 0 0.5rem;
    font-weight: 600;
    box-shadow: 0 4px 15px rgba(239, 68, 68, 0.2);
  }
  
  .btn-logout i {
    color: #fff !important;
    font-size: 1.1rem;
    transition: transform 0.3s ease;
  }
  
  .btn-logout:hover {
    background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
    color: #fff;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
    border-color: #dc2626;
  }
  
  .btn-logout:hover i {
    transform: translateX(2px);
  }
  
  .sidebar-footer {
    border-top: 1px solid #374151;
    padding-top: 1rem;
    margin-top: 1rem;
    background: linear-gradient(135deg, #1a2332 0%, #2d3748 100%);
    border-radius: 0.75rem;
    margin: 0 0.5rem;
    padding: 1rem;
    border: 1px solid #374151;
  }

  /* Efeitos visuais adicionais */
  .admin-sidebar::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent 0%, #64b5f6 50%, transparent 100%);
    opacity: 0.5;
  }
  
  /* Animação para os links */
  .nav-link-custom {
    position: relative;
  }
  
  .nav-link-custom::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(100, 181, 246, 0.1), transparent);
    transition: left 0.5s ease;
  }
  
  .nav-link-custom:hover::before {
    left: 100%;
  }
  
  /* Estilo para o container da lista de navegação */
  .nav.flex-column {
    background: linear-gradient(135deg, #1a2332 0%, #2d3748 100%);
    border-radius: 0.75rem;
    margin: 0 0.5rem;
    padding: 0.5rem;
    border: 1px solid #374151;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  }
  
  /* Melhorar espaçamento dos itens */
  .nav-item {
    margin-bottom: 0.5rem;
  }
  
  .nav-item:last-child {
    margin-bottom: 0;
  }
  </style>