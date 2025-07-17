import { createRouter, createWebHistory } from 'vue-router'
import { authGuard } from '@/router/guard.js'
import LoginView from '@/views/Auth/LoginView.vue'
import RegisterView from '@/views/Auth/RegisterView.vue'
import HomePage from '@/views/home/HomePage.vue'
// --- Views do Painel Administrativo ---
import AdminDashboard from '@/views/admin/AdminDashboard.vue';
import ProductManagement from '@/views/admin/ProductManagement.vue';
import CategoryManagement from '@/views/admin/CategoryManagement.vue';
import UserManagement from '@/views/admin/UserManagement.vue';
import OrderManagement from '@/views/admin/OrderManagement.vue';
import AdminLayout from '@/layouts/AdminLayout.vue';
import CartView from '@/views/cart/CartView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { requiresAuth: false } 
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView,
    meta: { requiresAuth: false } 
  },
  {
    path: '/produtos',
    name: 'Produtos',
    component: () => import('@/views/admin/ProductView.vue'),
  },
  {
    path: '/produtos/:id',
    name: 'ProductDetail',
    component: () => import('@/views/home/ProductDetailView.vue'),
    props: true
  },
  {
    path: '/categorias',
    name: 'Categorias',
    component: () => import('@/views/admin/CategoriesView.vue'),
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/Auth/ProfileView.vue'),
  },

  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true }, 
    children: [
      {
        path: '', 
        redirect: { name: 'AdminDashboard' }
      },
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: AdminDashboard,
        meta: { roles: ['ADMIN', 'MODERATOR'] },
      },
      {
        path: 'products',
        name: 'AdminProducts',
        component: ProductManagement,
        meta: { roles: ['ADMIN', 'MODERATOR'] },
      },
      {
        path: 'categories',
        name: 'AdminCategories',
        component: CategoryManagement,
        meta: { roles: ['ADMIN', 'MODERATOR'] },
      },
      {
        path: 'users',
        name: 'AdminUsers',
        component: UserManagement,
        meta: { roles: ['ADMIN'] }, 
      },
      {
        path: 'orders',
        name: 'AdminOrders',
        component: OrderManagement,
        meta: { roles: ['ADMIN', 'MODERATOR'] },
      }
    ],
  },
  
  {
    path: '/checkout',
    name: 'Checkout',
    component: () => import('@/views/cart/CheckoutView.vue'),
    meta: { requiresAuth: true }
  },
]
const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(authGuard);

export default router;