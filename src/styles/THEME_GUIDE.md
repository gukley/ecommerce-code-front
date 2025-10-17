# 🎨 Guia do Sistema de Tema - Dark Mode Tech

## 📋 Visão Geral

Este sistema de tema oferece um **dark mode moderno e tech** com alternância suave entre modo escuro e claro. O tema foi projetado com uma paleta de cores futurística e efeitos visuais impressionantes.

## 🚀 Como Usar

### 1. Importar o Tema
```css
@import '@/styles/theme.css';
```

### 2. Usar o Componente ThemeToggle
```vue
<template>
  <div>
    <ThemeToggle />
  </div>
</template>

<script setup>
import ThemeToggle from '@/components/Common/ThemeToggle.vue'
</script>
```

### 3. Aplicar Classes de Tema
```vue
<template>
  <div class="theme-page">
    <div class="theme-card">
      <h1 class="theme-text-primary">Título Principal</h1>
      <p class="theme-text-secondary">Texto secundário</p>
      <button class="theme-btn primary">Botão Primário</button>
    </div>
  </div>
</template>
```

## 🎨 Paleta de Cores

### Dark Mode (Padrão)
- **Background Principal**: `#0a0a0f` - Preto profundo
- **Background Secundário**: `#111118` - Cinza escuro
- **Background Card**: `#1a1a24` - Cinza médio escuro
- **Accent Primário**: `#00ffe1` - Ciano brilhante
- **Accent Secundário**: `#8f5fe8` - Roxo vibrante

### Light Mode
- **Background Principal**: `#f8fafc` - Branco suave
- **Background Secundário**: `#f1f5f9` - Cinza claro
- **Background Card**: `#ffffff` - Branco puro
- **Accent Primário**: `#3b82f6` - Azul moderno
- **Accent Secundário**: `#8b5cf6` - Roxo suave

## 🛠️ Classes CSS Disponíveis

### Layout
```css
.theme-page          /* Container principal com background */
.theme-card          /* Card com estilo de tema */
.theme-card.glass    /* Card com efeito glassmorphism */
```

### Texto
```css
.theme-text-primary    /* Texto principal */
.theme-text-secondary  /* Texto secundário */
.theme-text-muted      /* Texto desbotado */
.theme-text-accent     /* Texto com cor de destaque */
```

### Botões
```css
.theme-btn            /* Botão padrão */
.theme-btn.primary    /* Botão primário com gradiente */
```

### Inputs
```css
.theme-input          /* Input com estilo de tema */
```

### Animações
```css
.theme-animate        /* Animação de entrada */
.theme-glow           /* Animação de brilho */
```

## 🎯 Variáveis CSS

### Backgrounds
```css
--bg-main: #0a0a0f;
--bg-secondary: #111118;
--bg-card: #1a1a24;
--bg-card-hover: #22222f;
--bg-input: #1e1e2a;
--bg-button: #2a2a3a;
--bg-button-hover: #3a3a4a;
```

### Textos
```css
--text-main: #e8eaed;
--text-secondary: #b0b3b8;
--text-muted: #8a8d93;
--text-inverse: #0a0a0f;
```

### Accents
```css
--accent-primary: #00ffe1;
--accent-secondary: #8f5fe8;
--accent-success: #00ff88;
--accent-warning: #ffb800;
--accent-error: #ff4757;
--accent-info: #3742fa;
```

### Gradientes
```css
--gradient-primary: linear-gradient(135deg, #00ffe1 0%, #8f5fe8 100%);
--gradient-secondary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
--gradient-card: linear-gradient(145deg, #1a1a24 0%, #22222f 100%);
```

### Sombras
```css
--shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.3);
--shadow-md: 0 4px 16px rgba(0, 0, 0, 0.4);
--shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.5);
--shadow-glow: 0 0 20px rgba(0, 255, 225, 0.3);
```

### Transições
```css
--transition-fast: 0.2s ease;
--transition-normal: 0.3s ease;
--transition-slow: 0.5s ease;
```

## 🔧 Implementação em Componentes

### Exemplo Completo
```vue
<template>
  <div class="theme-page">
    <div class="container">
      <div class="theme-card glass">
        <h1 class="theme-text-primary">Meu Componente</h1>
        <p class="theme-text-secondary">
          Este é um exemplo de como usar o sistema de tema.
        </p>
        <div class="d-flex gap-3">
          <button class="theme-btn primary">Ação Primária</button>
          <button class="theme-btn">Ação Secundária</button>
        </div>
        <input 
          type="text" 
          class="theme-input mt-3" 
          placeholder="Digite algo..."
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Estilos específicos do componente */
.my-component {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: 2rem;
  box-shadow: var(--shadow-md);
  transition: all var(--transition-normal);
}

.my-component:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}
</style>
```

## 📱 Responsividade

O sistema de tema é totalmente responsivo e se adapta a diferentes tamanhos de tela:

```css
@media (max-width: 768px) {
  .theme-toggle {
    width: 50px;
    height: 25px;
  }
  
  .theme-card {
    padding: 1rem;
  }
}
```

## 🎭 Efeitos Especiais

### Glassmorphism
```css
.glass-effect {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  backdrop-filter: var(--glass-backdrop);
  -webkit-backdrop-filter: var(--glass-backdrop);
}
```

### Gradientes Animados
```css
.animated-gradient {
  background: var(--gradient-primary);
  background-size: 200% 200%;
  animation: gradientShift 3s ease infinite;
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
```

## 🔄 Alternância de Tema

O tema é automaticamente salvo no `localStorage` e persiste entre sessões:

```javascript
// O tema é salvo automaticamente
localStorage.setItem('theme', 'dark'); // ou 'light'

// Escutar mudanças de tema
window.addEventListener('theme-changed', (event) => {
  console.log('Tema alterado para:', event.detail.theme);
});
```

## 🎨 Personalização

Para personalizar o tema, modifique as variáveis CSS no arquivo `theme.css`:

```css
:root {
  --accent-primary: #sua-cor-aqui;
  --bg-main: #seu-background-aqui;
  /* ... outras variáveis */
}
```

## 📋 Checklist de Implementação

- [ ] Importar `theme.css` no projeto
- [ ] Adicionar `ThemeToggle` nos componentes necessários
- [ ] Aplicar classes de tema nos elementos
- [ ] Testar alternância entre temas
- [ ] Verificar responsividade
- [ ] Validar acessibilidade

## 🚀 Próximos Passos

1. **Mais Componentes**: Aplicar o tema em outros componentes
2. **Temas Adicionais**: Criar temas sazonais ou especiais
3. **Animações**: Adicionar mais efeitos visuais
4. **Acessibilidade**: Melhorar contraste e legibilidade
5. **Performance**: Otimizar transições e animações

---

**Desenvolvido com ❤️ para uma experiência de usuário moderna e tech!** 🚀
