import { createRouter, createWebHistory } from 'vue-router'
import { authGuard } from '@/router/guard.js'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/home/HomePage.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Auth/LoginView.vue'),
    meta: { requiresAuth: false } 
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Auth/RegisterView.vue'),
    meta: { requiresAuth: false } 
  },
  {
    path: '/produtos',
    name: 'Produtos',
    component: () => import('@/views/home/ProductView.vue'),
  },
  {
    path: '/produto/:id',
    name: 'ProductDetail',
    component: () => import('@/views/home/ProductDetailView.vue'),
    props: true
  },
  {
    path: '/categorias',
    name: 'Categorias',
    component: () => import('@/views/home/CategoriesView.vue'),
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/Auth/ProfileView.vue'),
  },
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    meta: { requiresAuth: true }, 
    children: [
      {
        path: '', 
        redirect: { name: 'AdminDashboard' }
      },
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: () => import('@/views/admin/AdminDashboard.vue'),
        meta: { roles: ['ADMIN', 'MODERATOR'] },
      },
      {
        path: 'products',
        name: 'AdminProducts',
        component: () => import('@/views/admin/ProductManagement.vue'),
        meta: { roles: ['ADMIN', 'MODERATOR'] },
      },
      {
        path: 'categories',
        name: 'AdminCategories',
        component: () => import('@/views/admin/CategoryManagement.vue'),
        meta: { roles: ['ADMIN', 'MODERATOR'] },
      },
      {
        path: 'orders',
        name: 'AdminOrders',
        component: () => import('@/views/admin/OrderManagement.vue'),
        meta: { roles: ['ADMIN', 'MODERATOR'] },
      },
      { 
        path: 'coupon',
        name: 'AdminCoupon',
        component: () => import('@/views/admin/CouponManagement.vue'),
        meta: { roles: ['ADMIN', 'MODERATOR'] },
      },
      {
        path: '/admin/create-moderator',
        name: 'CreateModerator',
        component: () => import('@/views/admin/CreateModerator.vue'),
        meta: { requiresAdmin: true }
      },
      {
        path: '/admin/clientes',
        name: 'admin-clients',
        component: () => import('@/views/admin/AdminClients.vue'),
        meta: { requiresAuth: true, requiresAdmin: true }
      }
  ],
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: () => import('@/views/cart/CheckoutView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/unauthorized',
    name: 'Unauthorized',
    component: () => import('@/views/errors/UnauthorizedView.vue'),
    meta: { requiresAuth: false }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(authGuard);

export default router;