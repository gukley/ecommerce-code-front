<template>
  <aside class="profile-sidebar-menu">
    <ul class="sidebar-menu-list">
      <li
        v-for="item in menu"
        :key="item.label"
        :class="['sidebar-menu-item', { active: item.value === active }]"        
        @click="$emit('change', item.value)"
      >
        <span class="sidebar-menu-icon"><i :class="item.icon"></i></span>
        <span class="sidebar-menu-label">{{ item.label }}</span>
      </li>
    </ul>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  active: { type: String, default: 'conta' }
})
const menu = [
  { icon: 'bi bi-person', label: 'Minha Conta', value: 'conta' },
  { icon: 'bi bi-receipt', label: 'Meus Pedidos', value: 'pedidos' },
  { icon: 'bi bi-heart', label: 'Meus Favoritos', value: 'favoritos' },
  { icon: 'bi bi-geo-alt', label: 'Endereços', value: 'enderecos' },
  { icon: 'bi bi-gear', label: 'Meus dados', value: 'dados' }
]
</script>

<style scoped>
.profile-sidebar-menu {
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 2px 12px #232e4720;
  border: 1.5px solid #f3f3f3;
  min-width: 260px;
  max-width: 320px;
  padding: 0;
  margin: 0 0 0 0;
}
.sidebar-menu-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.sidebar-menu-item {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 1.18rem;
  font-weight: 500;
  color: #d32f2f;
  background: #fff;
  padding: 22px 28px;
  border-bottom: 1px solid #f3f3f3;
  cursor: pointer;
  transition: background 0.16s, color 0.16s;
}
.sidebar-menu-item:last-child {
  border-bottom: none;
}
.sidebar-menu-item.active,
.sidebar-menu-item:hover {
  background: #fff4f4;
  color: #b71c1c;
  font-weight: 700;
}
.sidebar-menu-icon {
  font-size: 1.45rem;
  color: #d32f2f;
  display: flex;
  align-items: center;
}
.sidebar-menu-item.active .sidebar-menu-icon,
.sidebar-menu-item:hover .sidebar-menu-icon {
  color: #b71c1c;
}
.sidebar-menu-label {
  color: inherit;
  font-size: 1.08rem;
  letter-spacing: 0.2px;
}
</style>