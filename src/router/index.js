import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'

const routes = [
  { path: '/login', name: 'Login', component: LoginView },
  { path: '/register', name: 'Register', component: RegisterView },
  { path: '/:pathMatch(.*)*', redirect: '/login' } // fallback para login
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
