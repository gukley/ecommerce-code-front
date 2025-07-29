<template>
    <div class="tab">
      <div class="enderecos">
        <div class="topo">
          <h3>Meus Endereços</h3>
          <button @click="$emit('abrir-modal-endereco')" class="btn-adicionar">+ Novo</button>
        </div>
  
        <div v-if="addresses.length === 0" class="vazio">
          <p>Nenhum endereço cadastrado</p>
          <button @click="$emit('abrir-modal-endereco')">Adicionar endereço</button>
        </div>
  
        <div v-else class="lista">
          <div v-for="end in addresses" :key="end.id" class="endereco">
            <div class="info">
              <h4>{{ end.street }}, {{ end.number }}</h4>
              <p>{{ end.neighborhood }} - {{ end.city }}/{{ end.state }}</p>
              <p v-if="end.complement">{{ end.complement }}</p>
              <small>CEP: {{ end.zip_code }}</small>
            </div>
            <div class="acoes">
              <button @click="$emit('abrir-modal-endereco', end)"><i class="bi bi-pencil"></i></button>
              <button @click="$emit('remover-endereco', end.id)" class="danger"><i class="bi bi-trash"></i></button>
            </div>
          </div>
        </div>
      </div>
  
      <div v-if="showModal" class="modal" @click="$emit('fechar-modal')">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3>{{ editingAddress.id ? 'Editar' : 'Novo' }} Endereço</h3>
            <button @click="$emit('fechar-modal')"><i class="bi bi-x"></i></button>
          </div>
          <form @submit.prevent="$emit('salvar-endereco')">
            <input v-model="editingAddress.street" placeholder="Rua" required />
            <input v-model="editingAddress.number" placeholder="Número" required />
            <input v-model="editingAddress.neighborhood" placeholder="Bairro" required />
            <input v-model="editingAddress.city" placeholder="Cidade" required />
            <input v-model="editingAddress.state" placeholder="Estado" required />
            <input v-model="editingAddress.zip_code" placeholder="CEP" required />
            <input v-model="editingAddress.complement" placeholder="Complemento (opcional)" />
            <div class="botoes">
              <button type="button" @click="$emit('fechar-modal')">Cancelar</button>
              <button type="submit">Salvar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
</template>

<script setup> 
import { defineProps, defineEmits } from 'vue'

defineProps({ 
    addresses: { 
        type: Array,
        default: () => []
    },
    showModal: { 
        type: Boolean,
        default: false
    },
    editingAddress: { 
        type: Object,
        default: () => ({})
    }
})

defineEmits(['abrir-modal-endereco', 'fechar-modal', 'salvar-endereco', 'remover-endereco'])
</script>

<style scoped> 
.tab { 
    animation: fadeIn 0.3s ease;
}
.topo { 
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
}
.topo h3 { 
    margin: 0;
    font-size: 1.2rem;
}
.btn-adicionar { 
    background: #00ffe1;
    color: #0f0f23;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
}

.vazio { 
    text-align: center;
    padding: 3rem 2rem;
    color: rgba(255, 255, 255, 0.6);
}
.vazio p { 
    margin: 0 0 1rem 0;
    font-size: 1.1rem;
}
.vazio button { 
    background: #00ffe1;
    color: #0f0f23;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
}

.lista {
    display: grid;
    gap: 1rem;
}
.endereco { 
    background: #24243a;
    border-radius: 8px;
    padding: 1.5rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.endereco .info h4 { 
    margin: 0 0 0.5rem 0;
    font-size: 1;
}
.endereco .info p { 
    margin: 0 0 0.25rem 0;
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.9rem;
}
.endereco .info small { 
    columns: rgba(255, 255, 255, 0.5);
    font-size: 0.8rem;
}
.endereco .acoes { 
    display: flex;
    gap: 0.5rem;
}
.endereco .acoes button { 
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: rgba(255, 255, 255, 0.7);
    padding: 0.5rem;
    border-radius: 4px;
    cursor: pointer;
}
.endereco .acoes button:hover { 
    background: rgba(255, 255, 255, 0.1);
    color: #00ffe1;
}
.endereco .acoes button.danger:hover { 
    color: #ff6b6b;
}

.modal { 
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    z-index: 1000;
    padding: 1rem;
}
.modal-content { 
    background: #1a1a2e;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    max-width: 500px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
}
.modal-header { 
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
.modal-header h3 { 
    margin: 0;
}
.modal-header button { 
    background: transparent;
    border: none;
    color: rgba(255, 255, 255, 0.7);
    font-size: 1.2rem;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 4px;
}
.modal-header button:hover { 
    background: rgba(255, 255, 255, 0.1);
    color: #ff6b6b;
}
.modal-content form { 
    padding: 1.5rem;
}
.modal-content input { 
    width: 100%;
    padding: 0.75rem;
    margin-bottom: 1rem;
    background: #24243a;
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #fff;
    border-radius: 6px;
}
.modal-content input:focus { 
    outline: none;
    border-color: #00ffe1;
}

.botoes { 
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}
.botoes button { 
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
}
.botoes button:first-child {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
}
.botoes button:last-child {
  background: #00ffe1;
  color: #0f0f23;
}
@media (max-width: 768px) {
  .endereco {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  .endereco .acoes {
    justify-content: flex-end;
  }
}
</style>