// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue' 
import RegisterView from '@/views/RegisterView.vue' 
import HomePage from '@/views/HomePage.vue'

const routes = [
  { path: '/', name: 'Home', component: HomePage },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { hideHeader: true } 
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView,
    meta: { hideHeader: true } 
  },
  { path: '/:pathMatch(.*)*', redirect: '/login' } // fallback para login
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router