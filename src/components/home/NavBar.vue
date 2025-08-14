<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { useCartStore } from '@/stores/cartStore';
import CartDrawer from '@/components/Cart/CartDrawer.vue';
import WishlistDrawer from '@/components/Cart/WishlistDrawer.vue';
import { useWishlistStore } from '@/stores/wishlistStore';

const showMenu = ref(false);
const authStore = useAuthStore();
const router = useRouter();
const cart = useCartStore();
const showCartDrawer = ref(false);
const searchTerm = ref("");
const showWishlistDrawer = ref(false);
const wishlist = useWishlistStore();


const openCartDrawer = () => { 
  showCartDrawer.value = true; 
};
const closeCartDrawer = () => { showCartDrawer.value = false; };

const handleUserClick = () => {
  showMenu.value = !showMenu.value;
};

const goToLogin = () => {
  router.push('/login');
  showMenu.value = false;
};

const goToProfile = () => {
  router.push('/profile');
  showMenu.value = false;
};

const goToRegister = () => {
  router.push('/register');
  showMenu.value = false;
};

const logout = () => {
  authStore.logout();
  router.push('/');
  showMenu.value = false;
};

const handleClickOutside = (event) => {
  const menu = document.querySelector('.user-menu-popover');
  const icon = document.querySelector('.nav-icon-wrapper');
  if (showMenu.value && menu && !menu.contains(event.target) && !icon.contains(event.target)) {
    showMenu.value = false;
  }
};

const handleSearch = (e) => {
  if (e) e.preventDefault();
  if (searchTerm.value.trim() !== '') {
    router.push({ path: '/produtos', query: { busca: searchTerm.value.trim() } });
  }
};

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside);
  cart.initCart();

  if (authStore.token && (!authStore.user || !authStore.user.id)) {
    authStore.getUserProfile().catch(() => {
      authStore.logout();
    });
  }
});

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutside);
});
</script>

<template>
  <nav class="navbar navbar-expand-lg custom-navbar px-4 py-3">
    <div class="container-fluid d-flex align-items-center">
      <router-link class="navbar-brand fw-bold fs-3 me-5" :to="{ name: 'Home' }">
        <span class="text-gradient">GGTECH</span>
      </router-link>

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <div class="navbar-nav d-flex align-items-center gap-4 me-auto">
          <router-link class="nav-link custom-nav-link" :to="{ name: 'Home' }" active-class="active">Home</router-link>
          <router-link class="nav-link custom-nav-link" :to="'/produtos'" active-class="active">Produtos</router-link>
          <router-link class="nav-link custom-nav-link" :to="'/categorias'" active-class="active">Categorias</router-link>
        </div>

        <form class="d-flex custom-search-bar ms-lg-auto me-lg-4 mt-2 mt-lg-0" @submit.prevent="handleSearch">
          <input
            class="form-control custom-search-input"
            type="search"
            placeholder="🔍 Buscar produtos..."
            aria-label="Search"
            v-model="searchTerm"
          />
          <button class="btn btn-main-action ms-2 rounded-pill px-4" type="submit">
            <i class="bi bi-search"></i>
          </button>
        </form>
        
    
        <div class="d-flex align-items-center gap-4 ms-lg-3 mt-2 mt-lg-0">
          <div class="position-relative nav-icon-wrapper" @click="openCartDrawer">
            <i class="bi bi-cart3 fs-3 nav-icon"></i>
            <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-gradient-purple cart-badge">
              {{ cart.totalItems }}
              <span class="visually-hidden">itens no carrinho</span>
            </span>
          </div>
          <div class="position-relative nav-icon-wrapper" @click="showWishlistDrawer = true">
            <i class="bi bi-heart fs-3 nav-icon"></i>
            <span v-if="wishlist.total > 0" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-gradient-purple cart-badge">
              {{ wishlist.total }}
              <span class="visually-hidden">itens na wishlist</span>
            </span>
          </div>

          <div class="nav-icon-wrapper position-relative" @click="handleUserClick">
            <i class="bi bi-person fs-3 nav-icon"></i>
            <div v-if="showMenu" class="user-menu-popover">
              <template v-if="authStore.user && authStore.user.id">
                <div class="user-menu-item" @click="goToProfile">Minha Conta</div>
                <div class="user-menu-item" @click="logout">Sair</div>
              </template>
              <template v-else>
                <div class="user-menu-item" @click="goToLogin">Entrar</div>
                <div class="user-menu-item" @click="goToRegister">Registrar</div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
    <CartDrawer :open="showCartDrawer" @close="closeCartDrawer" />
    <WishlistDrawer :open="showWishlistDrawer" @close="() => showWishlistDrawer = false" />
  </nav>
</template>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap');

* { 
  font-family: 'Rajdhani', sans-serif; 
}

/* Estilos da Navbar Customizada */
.custom-navbar {
  background-color: #1a1a2e; 
  padding: 0.7rem 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4); 
  border-bottom: 1px solid rgba(255, 255, 255, 0.1); 
  min-height: 56px;
  position: relative;
  z-index: 1000;
}

.navbar-brand {
  font-size: 2.1rem !important;
  font-weight: 700;
  letter-spacing: 1px;
  padding: 0;
}

@media (max-width: 600px) {
  .navbar-brand {
    font-size: 1.3rem !important;
  }
}

.text-gradient {
  background: linear-gradient(to right, #a362ff, #00ffe1); 
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block; 
  filter: drop-shadow(0 0 5px rgba(163, 98, 255, 0.6)); 
}

/* Links de Navegação */
.custom-nav-link {
  color: #e0e0e0 !important;
  font-size: 1.05rem;
  font-weight: 500;
  transition: color 0.3s ease, transform 0.2s ease;
  padding: 0.35rem 0.7rem;
  position: relative; 
}

.custom-nav-link:hover {
  color: #a362ff !important; 
  transform: translateY(-2px); 
}

.custom-nav-link::after { 
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(to right, #a362ff, #00ffe1);
  transition: width 0.3s ease;
}

.custom-nav-link:hover::after,
.custom-nav-link.active::after {
  width: 100%;
}

.custom-nav-link.active {
  color: #00ffe1 !important;
  font-weight: 600;
}

/* Barra de Busca */
.custom-search-bar {
  flex-grow: 0.7; 
  max-width: 330px;
}

.custom-search-input {
  background-color: #2b2b3d; 
  border: 1px solid #4a4a6e; 
  color: #e0e0e0; 
  padding: 0.5rem 1rem;
  border-radius: 50px; 
  transition: all 0.3s ease;
  font-size: 0.98rem;
}

.custom-search-input::placeholder {
  color: #999999; 
}

.custom-search-input:focus {
  background-color: #35354d; 
  border-color: #a362ff; 
  box-shadow: 0 0 0 0.18rem rgba(163, 98, 255, 0.18); 
}

.btn-main-action {
  padding: 0.45rem 1.2rem !important;
  font-size: 1rem !important;
}

/* Ícones */
.nav-icon-wrapper {
  position: relative;
  cursor: pointer;
  padding: 3px; 
  transition: transform 0.2s ease;
  z-index: 1001;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
}

.nav-icon-wrapper:hover {
  transform: scale(1.08); 
}

.nav-icon {
  color: #e0e0e0; 
  font-size: 1.7rem !important;
  transition: color 0.3s ease;
  pointer-events: none;
}

.nav-icon-wrapper:hover .nav-icon {
  color: #00ffe1; 
}

.bg-gradient-purple { 
  background: linear-gradient(45deg, #a362ff, #8f5fe8) !important;
  font-size: 0.72rem; 
  padding: 0.25em 0.5em;
  border: 1px solid rgba(255, 255, 255, 0.2);
  pointer-events: none;
}

.user-menu-popover {
  position: absolute;
  top: 48px;
  right: 0;
  background: #23233a;
  border-radius: 1rem;
  box-shadow: 0 8px 32px rgba(143, 95, 232, 0.25);
  min-width: 160px;
  z-index: 2147483647;
  padding: 0.4rem 0;
  border: 2px solid #8f5fe8;
  animation: fadeInMenu 0.18s;
}

@keyframes fadeInMenu {
  from { opacity: 0; transform: translateY(-10px);}
  to { opacity: 1; transform: translateY(0);}
}

.user-menu-item {
  padding: 0.6rem 1.1rem;
  color: #e0e0e0;
  font-family: 'Rajdhani', Arial, sans-serif;
  font-size: 0.98rem;
  cursor: pointer;
  transition: background 0.2s;
  border-bottom: 1px solid #35354d;
}

.user-menu-item:last-child {
  border-bottom: none;
}

.user-menu-item:hover {
  background: #8f5fe8;
  color: #1a1a2e;
}

/* Responsividade */
@media (max-width: 991.98px) { 
  .custom-navbar {
    padding: 0.6rem 1rem;
  }
  
  .navbar-brand {
    font-size: 1.3rem !important;
  }
  
  .navbar-nav {
    flex-direction: column; 
    align-items: flex-start !important; 
    margin-left: 0 !important;
    margin-top: 1rem;
    gap: 0.3rem !important;
  }
  
  .custom-nav-link {
    width: 100%; 
    padding: 0.5rem 0;
  }
  
  .custom-nav-link::after {
    left: 0;
    transform: translateX(0);
  }
  
  .custom-search-bar {
    width: 100%;
    max-width: none;
    margin-left: 0 !important;
    margin-right: 0 !important;
    margin-top: 1.2rem !important;
  }
  
  .d-flex.align-items-center.gap-4.ms-lg-3 { 
    width: 100%;
    justify-content: flex-start;
    margin-top: 1.2rem !important;
    margin-left: 0 !important;
    gap: 0.7rem !important;
  }
}

</style>