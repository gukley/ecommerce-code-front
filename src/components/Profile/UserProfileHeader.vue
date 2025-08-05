<template>
    <div class="header">
      <button @click="$router.push('/')" class="btn-voltar">
        <i class="bi bi-arrow-left"></i>
        Voltar
      </button>
      <h1>Meu Perfil</h1>
      <div class="acoes">
        <button v-if="!editando" @click="$emit('editar-perfil')" class="btn-editar">Editar</button>
        <button v-if="editando" @click="$emit('salvar-edicao')" class="btn-salvar">Salvar</button>
        <button v-if="editando" @click="$emit('cancelar-edicao')" class="btn-cancelar">Cancelar</button>
        <button @click="$emit('logout')" class="btn-sair">Sair</button>
      </div>
    </div>
  </template>

<script setup> 
import { defineProps, defineEmits } from 'vue'

defineProps({ 
    editando: { 
        type: Boolean,
        default: false
    }
})

defineEmits(['editar-perfil', 'salvar-edicao', 'cancelar-edicao', 'logout'])
</script>

<style scoped> 
.header { 
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 2rem;
    background: #1a1a2e;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
.btn-voltar { 
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #fff;
    padding: 0.5 rem 1rem;
    border-radius: 6px;
    cursor: pointer;
}
.btn-voltar:hover { 
    background: rgba(255, 255, 255, 0.1);
}
.header h1 { 
    margin: 0;
    font-size: 1.5rem;
    background: linear-gradient(135deg, #000000, #36186e);
    --webkit-background-clip: text;
    --web-text-fill-color: transparent;
}
.acoes { 
    display: flex;
    gap: 0.5rem;
}
.btn-editar, .btn-salvar, .btn-cancelar, .btn-sair { 
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
}
.btn-editar { background: #00ffe1; color: #0f0f23; }
.btn-salvar { background: #00d4aa; color: #0f0f23; }
.btn-cancelar { background: rgba(255, 255, 255, 0.2); color: #fff; }
.btn-sair { background: #ff6b6b; color: #fff; }

@media (max-width: 768px) { 
    .header { 
        flex-direction: column;
        gap: 1rem;
        text-align: center;
    }
}
</style>