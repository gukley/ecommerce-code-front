<template>
  <div class="theme-toggle-container">
    <button 
      class="theme-toggle" 
      @click="toggleTheme"
      :title="currentTheme === 'dark' ? 'Alternar para modo claro' : 'Alternar para modo escuro'"
    >
      <div class="theme-toggle-slider">
        <div class="theme-toggle-icon">
          <i :class="currentTheme === 'dark' ? 'bi bi-moon-fill' : 'bi bi-sun-fill'"></i>
        </div>
      </div>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const currentTheme = ref('dark')

onMounted(() => {
  // Carrega o tema salvo ou usa o padrão
  const savedTheme = localStorage.getItem('theme') || 'dark'
  setTheme(savedTheme)
})

function toggleTheme() {
  const newTheme = currentTheme.value === 'dark' ? 'light' : 'dark'
  setTheme(newTheme)
}

function setTheme(theme) {
  currentTheme.value = theme
  document.documentElement.setAttribute('data-theme', theme)
  localStorage.setItem('theme', theme)
  
  // Emite evento para outros componentes
  window.dispatchEvent(new CustomEvent('theme-changed', { 
    detail: { theme } 
  }))
}
</script>

<style scoped>
.theme-toggle-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.theme-toggle {
  position: relative;
  width: 60px;
  height: 30px;
  background: var(--bg-button);
  border: 2px solid var(--border-color);
  border-radius: 15px;
  cursor: pointer;
  transition: all var(--transition-normal);
  overflow: hidden;
  outline: none;
}

.theme-toggle:hover {
  border-color: var(--accent-primary);
  box-shadow: var(--shadow-glow);
  transform: scale(1.05);
}

.theme-toggle:active {
  transform: scale(0.95);
}

.theme-toggle-slider {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 22px;
  height: 22px;
  background: var(--gradient-primary);
  border-radius: 50%;
  transition: transform var(--transition-normal);
  display: flex;
  align-items: center;
  justify-content: center;
}

.theme-toggle-icon {
  color: var(--text-inverse);
  font-size: 12px;
  transition: all var(--transition-normal);
}

[data-theme="light"] .theme-toggle-slider {
  transform: translateX(30px);
}

[data-theme="light"] .theme-toggle {
  background: var(--bg-button);
  border-color: var(--border-color);
}

[data-theme="light"] .theme-toggle:hover {
  border-color: var(--accent-primary);
}

/* Animação de brilho */
.theme-toggle:hover .theme-toggle-slider {
  box-shadow: 0 0 15px var(--accent-primary);
}

/* Responsivo */
@media (max-width: 768px) {
  .theme-toggle {
    width: 50px;
    height: 25px;
  }
  
  .theme-toggle-slider {
    width: 18px;
    height: 18px;
  }
  
  [data-theme="light"] .theme-toggle-slider {
    transform: translateX(25px);
  }
  
  .theme-toggle-icon {
    font-size: 10px;
  }
}
</style>
