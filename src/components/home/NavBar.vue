<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { useCartStore } from '@/stores/cartStore';
import { useToast } from 'vue-toastification'; // Importação do toast
// import CartDrawer from '@/components/Cart/CartDrawer.vue';
import WishlistDrawer from '@/components/Cart/WishlistDrawer.vue';
import { useWishlistStore } from '@/stores/wishlistStore';
import ThemeToggle from '@/components/Common/ThemeToggle.vue';

const showMenu = ref(false);
const authStore = useAuthStore();
const router = useRouter();
const cart = useCartStore();
const searchTerm = ref("");
const showWishlistDrawer = ref(false);
const wishlist = useWishlistStore();
const toast = useToast(); // Inicialização do toast

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
  toast.success('Você foi desconectado com sucesso!'); // Notificação de sucesso
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

const theme = ref(localStorage.getItem('theme') || 'dark')

function toggleTheme() {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
  document.documentElement.setAttribute('data-theme', theme.value)
  localStorage.setItem('theme', theme.value)
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside);
  // cart.initCart();
  document.documentElement.setAttribute('data-theme', theme.value)

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
        <!-- Versão clara do logo: mantém GG em grafite e TECH em azul -->
        <span class="logo-gg">GG</span><span class="logo-tech">TECH</span>
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

        <div class="d-flex align-items-center gap-4 ms-lg-3 mt-2 mt-lg-0">
          <!-- Theme Toggle -->
          <ThemeToggle />

          <!-- Carrinho -->
          <div class="position-relative nav-icon-wrapper" @click="router.push('/cart')" role="button" aria-label="Abrir carrinho">
            <i class="bi bi-cart3 fs-3 nav-icon"></i>
            <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill cart-badge">
              {{ cart.totalItems }}
              <span class="visually-hidden">itens no carrinho</span>
            </span>
          </div>

          <!-- Wishlist -->
          <div class="position-relative nav-icon-wrapper" @click="showWishlistDrawer = true" role="button" aria-label="Abrir wishlist">
            <i class="bi bi-heart fs-3 nav-icon"></i>
            <span v-if="wishlist.total > 0" class="position-absolute top-0 start-100 translate-middle badge rounded-pill cart-badge">
              {{ wishlist.total }}
              <span class="visually-hidden">itens na wishlist</span>
            </span>
          </div>

          <!-- User -->
          <div class="nav-icon-wrapper position-relative" @click="handleUserClick" role="button" aria-haspopup="true" :aria-expanded="showMenu">
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

          <router-link
            v-if="authStore.user && (authStore.user.role === 'ADMIN' || authStore.user.role === 'MODERATOR')"
            to="/admin"
            class="btn-admin-panel"
          >
            <i class="bi bi-speedometer2 me-1"></i> Painel Admin
          </router-link>
        </div>
      </div>
    </div>
    <WishlistDrawer :open="showWishlistDrawer" @close="() => showWishlistDrawer = false" />
  </nav>
</template>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap');

* {
  font-family: 'Rajdhani', sans-serif;
}

/* --- Navbar clara baseada na imagem enviada --- */
.custom-navbar {
  background: linear-gradient(180deg, #ffffff 0%, #fbfbfd 100%); /* muito sutil */
  padding: 0.7rem 2rem;
  box-shadow: 0 6px 20px rgba(20, 24, 40, 0.06); /* sombra leve para elevar */
  border-bottom: 1px solid rgba(16, 24, 40, 0.04);
  min-height: 64px;
  position: relative;
  z-index: 1000;
  color: #111827;
}

/* Logo: GG grafite + TECH em azul */
.navbar-brand {
  font-size: 2.1rem !important;
  font-weight: 700;
  letter-spacing: 1px;
  padding: 0;
  display: flex;
  align-items: center;
  gap: 6px;
}

/* GG em grafite */
.logo-gg {
  color: #2b2b32;
  filter: none;
  font-family: 'Rajdhani', sans-serif;
  letter-spacing: 1px;
}

/* TECH em azul (similar à imagem) */
.logo-tech {
  color: transparent;
  background: linear-gradient(90deg, #4aa7ff 0%, #1e90ff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
  text-shadow: 0 0 6px rgba(74,167,255,0.12);
}

/* Responsividade do logo */
@media (max-width: 600px) {
  .navbar-brand {
    font-size: 1.3rem !important;
  }
}

/* Links de navegação — escuros para leitura em fundo claro */
.custom-nav-link {
  color: #334155 !important; /* cinza-escuro */
  font-size: 1.05rem;
  font-weight: 600;
  transition: color 0.22s ease, transform 0.18s ease;
  padding: 0.35rem 0.7rem;
  position: relative;
}

/* Hover: azul suave para combinar com logo */
.custom-nav-link:hover {
  color: #1677ff !important;
  transform: translateY(-1.5px);
}

/* Underline ativo/hover */
.custom-nav-link::after {
  content: '';
  position: absolute;
  width: 0;
  height: 3px;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(90deg, rgba(74,167,255,1), rgba(30,144,255,0.9));
  border-radius: 4px;
  transition: width 0.28s ease;
}

.custom-nav-link:hover::after,
.custom-nav-link.active::after {
  width: 80%;
}

.custom-nav-link.active {
  color: #0b5ed7 !important;
  font-weight: 700;
}

/* Ícones: escuros por padrão, azul no hover */
.nav-icon-wrapper {
  position: relative;
  cursor: pointer;
  padding: 3px;
  transition: transform 0.16s ease;
  z-index: 1001;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: transparent;
  border-radius: 8px;
}

.nav-icon-wrapper:hover {
  transform: scale(1.06);
  background: rgba(6, 78, 203, 0.04);
}

.nav-icon {
  color: #334155;
  font-size: 1.7rem !important;
  transition: color 0.2s ease;
  pointer-events: none;
}

.nav-icon-wrapper:hover .nav-icon {
  color: #1677ff;
}

/* Badge do carrinho/wishlist — mais discreto em fundo claro */
.cart-badge {
  background: linear-gradient(90deg, #4aa7ff, #1e90ff);
  color: #fff;
  font-size: 0.72rem;
  padding: 0.2em 0.45em;
  border: 1px solid rgba(255,255,255,0.12);
  transform: translate(6%, -10%);
}

/* Popover do usuário: versão clara porém contrastante */
.user-menu-popover {
  position: absolute;
  top: 52px;
  right: 0;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(16, 24, 40, 0.08);
  min-width: 180px;
  z-index: 2147483647;
  padding: 0.3rem 0;
  border: 1px solid rgba(16,24,40,0.06);
  animation: fadeInMenu 0.14s ease-out;
}

/* itens do menu: tom escuro para leitura */
.user-menu-item {
  padding: 0.6rem 1.1rem;
  color: #0f172a;
  font-family: 'Rajdhani', Arial, sans-serif;
  font-size: 0.98rem;
  cursor: pointer;
  transition: background 0.14s, color 0.14s;
  border-bottom: 1px solid rgba(15,23,42,0.04);
}

.user-menu-item:last-child {
  border-bottom: none;
}

.user-menu-item:hover {
  background: linear-gradient(90deg, rgba(74,167,255,0.08), rgba(30,144,255,0.06));
  color: #0b5ed7;
}

/* Botão painel admin: deixei contraste bom com fundo claro */
.btn-admin-panel {
  background: linear-gradient(90deg, #4aa7ff 0%, #1e90ff 100%);
  color: #fff !important;
  font-weight: 700;
  border: none;
  border-radius: 12px;
  padding: 6px 16px;
  font-size: 0.98rem;
  box-shadow: 0 6px 18px rgba(30,144,255,0.14);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-admin-panel:hover {
  box-shadow: 0 8px 26px rgba(30,144,255,0.18);
  transform: translateY(-1px);
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
}

/* pequena animação de entrada para o popover */
@keyframes fadeInMenu {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>