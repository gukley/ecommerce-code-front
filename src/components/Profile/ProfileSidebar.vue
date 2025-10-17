<template>
  <aside class="profile-sidebar-menu theme-card">
    <ul class="sidebar-menu-list">
      <li
        v-for="item in menu"
        :key="item.label"
        :class="['sidebar-menu-item', { active: item.value === active }]"        
        @click="$emit('change', item.value)"
      >
        <span class="sidebar-menu-icon"><i :class="item.icon"></i></span>
        <span class="sidebar-menu-label theme-text-primary">{{ item.label }}</span>
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
  { icon: 'bi bi-heart', label: 'Meus Cupons', value: 'cupons' },
  { icon: 'bi bi-geo-alt', label: 'Endereços', value: 'enderecos' },
  { icon: 'bi bi-gear', label: 'Meus dados', value: 'dados' }
]
</script>

<style scoped>
.profile-sidebar-menu {
  background: var(--bg-card);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-color);
  min-width: 260px;
  max-width: 320px;
  padding: 0;
  margin: 0 0 0 0;
  transition: all var(--transition-normal);
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
  color: var(--text-secondary);
  background: var(--bg-card);
  padding: 22px 28px;
  border-bottom: 1px solid var(--border-color);
  cursor: pointer;
  transition: all var(--transition-normal);
}
.sidebar-menu-item:last-child {
  border-bottom: none;
}
.sidebar-menu-item.active,
.sidebar-menu-item:hover {
  background: var(--bg-card-hover);
  color: var(--accent-primary);
  font-weight: 700;
  box-shadow: inset 0 0 0 2px var(--accent-primary);
}
.sidebar-menu-icon {
  font-size: 1.45rem;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  transition: all var(--transition-normal);
}
.sidebar-menu-item.active .sidebar-menu-icon,
.sidebar-menu-item:hover .sidebar-menu-icon {
  color: var(--accent-primary);
  transform: scale(1.1);
}
.sidebar-menu-label {
  color: inherit;
  font-size: 1.08rem;
  letter-spacing: 0.2px;
  transition: all var(--transition-normal);
}
</style>