<template>
    <div class="profile-header">
      <button @click="$router.push('/')" class="btn-voltar" title="Voltar para Home">
        <i class="bi bi-arrow-left"></i>
        <span>Voltar</span>
      </button>
      <h1>
        <i class="bi bi-person-circle gradient-icon"></i>
        Meu Perfil
      </h1>
      <div class="header-actions">
        <button v-if="!editando" @click="$emit('editar-perfil')" class="btn-edit">
          <i class="bi bi-pencil"></i>
          Editar
        </button>
        <button v-if="editando" @click="$emit('salvar-edicao')" class="btn-save">
          <i class="bi bi-check2-circle"></i>
          Salvar
        </button>
        <button v-if="editando" @click="$emit('cancelar-edicao')" class="btn-cancel">
          <i class="bi bi-x-circle"></i>
          Cancelar
        </button>
        <button @click="$emit('logout')" class="btn-logout">
          <i class="bi bi-box-arrow-right"></i>
          Sair
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({ 
    editando: { 
      type: Boolean,
      default: false
    }
  })
  
  defineEmits(['editar-perfil', 'salvar-edicao', 'cancelar-edicao', 'logout'])
  </script>
  
  <style scoped>
  .profile-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: linear-gradient(90deg, #23233a 70%, #2a2a3e 100%);
    border-bottom: 1.5px solid rgba(0,255,225,0.09);
    padding: 1.4rem 2.2rem 1.1rem 2.2rem;
    box-shadow: 0 3px 18px rgba(0,255,225,0.05);
    gap: 1.5rem;
  }
  
  .btn-voltar {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    background: linear-gradient(90deg, #00ffe1 0%, #8f5fe8 100%);
    color: #181828;
    padding: 0.55rem 1.25rem;
    font-weight: 600;
    border: none;
    border-radius: 30px;
    cursor: pointer;
    font-size: 1.08rem;
    transition: filter 0.18s, box-shadow 0.20s;
    box-shadow: 0 2px 10px rgba(0,255,225,0.18);
  }
  .btn-voltar:hover {
    filter: brightness(1.07);
    box-shadow: 0 4px 22px rgba(0,255,225,0.20);
  }
  
  .profile-header h1 {
    margin: 0;
    font-size: 2.2rem;
    font-weight: 800;
    letter-spacing: 0.04em;
    color: #fff;
    display: flex;
    align-items: center;
    gap: 0.7rem;
    background: linear-gradient(120deg, #15fbe3 0%, #8f5fe8 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text; /* For Firefox */
    text-fill-color: transparent;
  }
  .gradient-icon {
    font-size: 2.3rem;
    background: linear-gradient(120deg, #00ffe1 0%, #8f5fe8 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
  }
  
  .header-actions {
    display: flex;
    gap: 0.65rem;
    align-items: center;
  }
  
  .header-actions button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 600;
    font-size: 1.08rem;
    border-radius: 28px;
    border: none;
    padding: 0.54rem 1.4rem;
    transition: filter 0.15s, box-shadow 0.15s, background 0.2s;
    cursor: pointer;
    outline: none;
  }
  
  .btn-edit {
    background: linear-gradient(90deg, #00ffe1 0%, #8f5fe8 100%);
    color: #181828;
    box-shadow: 0 2px 12px rgba(0,255,225,0.13);
  }
  .btn-edit:hover {
    filter: brightness(1.09);
    box-shadow: 0 4px 18px rgba(0,255,225,0.25);
  }
  
  .btn-save {
    background: linear-gradient(90deg, #00d4aa 0%, #8f5fe8 100%);
    color: #181828;
    box-shadow: 0 2px 12px rgba(0,255,225,0.15);
  }
  .btn-save:hover {
    filter: brightness(1.09);
    box-shadow: 0 4px 18px rgba(0,255,225,0.23);
  }
  
  .btn-cancel {
    background: #34345e;
    color: #fff;
    border: 1px solid #8f5fe8;
  }
  .btn-cancel:hover {
    background: #8f5fe8;
    color: #23233a;
    border: 1px solid #00ffe1;
  }
  
  .btn-logout {
    background: linear-gradient(90deg, #fc8181 30%, #e85f99 100%);
    color: #fff;
    box-shadow: 0 2px 12px rgba(255, 107, 107, 0.12);
  }
  .btn-logout:hover {
    background: linear-gradient(90deg, #e85f99 0%, #fc8181 100%);
    filter: brightness(1.08);
    box-shadow: 0 4px 18px rgba(255, 107, 107, 0.18);
  }
  
  @media (max-width: 900px) {
    .profile-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 1.2rem;
      padding: 1.2rem 1rem 1rem 1rem;
    }
    .profile-header h1 {
      font-size: 1.7rem;
    }
    .btn-voltar {
      font-size: 1rem;
      padding: 0.5rem 1rem;
    }
    .header-actions button {
      font-size: 1rem;
      padding: 0.47rem 1rem;
    }
  }
  @media (max-width: 600px) {
    .profile-header {
      gap: 0.9rem;
      padding: 0.8rem;
    }
    .profile-header h1 {
      font-size: 1.1rem;
    }
    .header-actions {
      flex-wrap: wrap;
      gap: 0.4rem;
    }
    .header-actions button {
      font-size: 0.95rem;
      padding: 0.38rem 0.6rem;
    }
  }
  </style>