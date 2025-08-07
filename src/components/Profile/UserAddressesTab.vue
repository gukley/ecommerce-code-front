<template>
  <div class="tab">
    <div class="enderecos">
      <div class="topo">
        <h3>Meus Endereços</h3>
        <button @click="abrirModalNovoEndereco" class="btn-adicionar">
          <i class="bi bi-plus-circle"></i> Novo Endereço
        </button>
      </div>

      <div v-if="addresses.length === 0" class="vazio">
        <p>Nenhum endereço cadastrado</p>
        <button @click="abrirModalNovoEndereco" class="btn-primary">Adicionar Endereço</button>
      </div>

      <div v-else class="lista">
        <div v-for="end in addresses" :key="end.id" class="endereco card-glow">
          <div class="info">
            <h4>{{ end.street }}, {{ end.number }}</h4>
            <p>{{ end.neighborhood }} - {{ end.city }}/{{ end.state }}</p>
            <p v-if="end.complement" class="complemento">{{ end.complement }}</p>
            <small>CEP: {{ end.zip }} - {{ end.country }}</small>
          </div>
          <div class="acoes">
            <button @click="abrirModalEditarEndereco(end)" class="btn-icon">
              <i class="bi bi-pencil"></i>
            </button>
            <button @click="removerEndereco(end.id)" class="btn-icon danger">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para Novo/Editar Endereço -->
    <div v-if="showModal" class="modal" @click.self="fecharModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>
            <i class="bi bi-geo-alt-fill me-2"></i>
            {{ localEditingAddress.id ? 'Editar' : 'Novo' }} Endereço
          </h3>
          <button @click="fecharModal" class="btn-close-modal" aria-label="Fechar">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <form @submit.prevent="saveAddress" class="form-grid">
          <div class="form-row">
            <input v-model="localEditingAddress.street" placeholder="Rua" required class="form-input" />
            <input v-model="localEditingAddress.number" type="number" placeholder="Número" required class="form-input" />
          </div>

          <div class="form-row">
            <input v-model="localEditingAddress.neighborhood" placeholder="Bairro" required class="form-input" />
            <input v-model="localEditingAddress.city" placeholder="Cidade" required class="form-input" />
          </div>

          <div class="form-row">
            <input v-model="localEditingAddress.state" placeholder="Estado" required class="form-input" />
            <input v-model="localEditingAddress.zip" placeholder="CEP" required class="form-input" />
          </div>

          <input v-model="localEditingAddress.complement" placeholder="Complemento (opcional)" class="form-input" />
          <input v-model="localEditingAddress.country" placeholder="País" required class="form-input" />

          <div class="botoes">
            <button type="button" @click="fecharModal" class="btn-cancelar">
              <i class="bi bi-x-circle"></i> Cancelar
            </button>
            <button type="submit" class="btn-salvar">
              <i class="bi bi-check-circle"></i> Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue';

// Props
const props = defineProps({
  addresses: {
    type: Array,
    default: () => [],
  },
  showModal: {
    type: Boolean,
    default: false,
  },
  editingAddress: {
    type: Object,
    default: () => ({}),
  },
});

// Emits
const emit = defineEmits(['abrir-modal-endereco', 'fechar-modal', 'salvar-endereco', 'remover-endereco']);

// Estado local
const localEditingAddress = ref({});

// Funções auxiliares
const resetForm = () => {
  localEditingAddress.value = {
    street: '',
    number: null,
    zip: '',
    city: '',
    state: '',
    country: 'Brasil',
    neighborhood: '',
    complement: '',
  };
};

// Observadores
watch(
  () => props.editingAddress,
  (newVal) => {
    if (newVal && Object.keys(newVal).length > 0) {
      localEditingAddress.value = { ...newVal };
    } else {
      resetForm();
    }
  },
  { deep: true, immediate: true }
);

watch(
  () => props.showModal,
  (isVisible) => {
    if (isVisible && !props.editingAddress.id) {
      nextTick(() => {
        resetForm();
      });
    }
  }
);

// Funções principais
const abrirModalNovoEndereco = () => {
  emit('abrir-modal-endereco');
};

const abrirModalEditarEndereco = (endereco) => {
  emit('abrir-modal-endereco', endereco);
};

const fecharModal = () => {
  emit('fechar-modal');
};

const removerEndereco = (id) => {
  console.error('User confirmed removal of address with ID:', id);
  emit('remover-endereco', id);
};

const saveAddress = () => {
  const dataToSend = {
    ...localEditingAddress.value,
    number: parseInt(localEditingAddress.value.number),
  };

  const requiredFields = ['street', 'number', 'zip', 'city', 'state', 'country', 'neighborhood'];
  const missingFields = requiredFields.filter((field) => {
    const value = dataToSend[field];
    return value === '' || value === null || value === undefined || (typeof value === 'number' && isNaN(value));
  });

  if (missingFields.length > 0) {
    const friendlyMissingFields = missingFields
      .map((f) => {
        const fieldNames = {
          zip: 'CEP',
          country: 'País',
          street: 'Rua',
          number: 'Número',
          city: 'Cidade',
          state: 'Estado',
          neighborhood: 'Bairro',
        };
        return fieldNames[f] || f;
      })
      .join(', ');

    console.error(`Por favor, preencha todos os campos obrigatórios: ${friendlyMissingFields}.`);
    return;
  }

  emit('salvar-endereco', dataToSend);
};
</script>

<style scoped>
/* Variáveis para cores e sombras */
:root {
  --primary-blue: #007bff;
  --dark-bg: #1a1a2e;
  --card-bg: #24243a;
  --input-bg: #2a2a3e;
  --text-light: rgba(255, 255, 255, 0.7);
  --text-dark: #e0e0e0;
  --border-color-light: rgba(255, 255, 255, 0.1);
  --border-color-medium: rgba(255, 255, 255, 0.15);
  --border-color-dark: rgba(255, 255, 255, 0.2);
  --shadow-sm: rgba(0, 0, 0, 0.15);
  --shadow-md: rgba(0, 0, 0, 0.3);
  --shadow-lg: rgba(0, 0, 0, 0.4);
  --shadow-xl: rgba(0, 0, 0, 0.5);
  --blue-glow-sm: rgba(0, 123, 255, 0.2);
  --blue-glow-md: rgba(0, 123, 255, 0.3);
  --blue-glow-lg: rgba(0, 123, 255, 0.4);
  --red-danger: #dc3545;
  --red-danger-hover: #c82333;
  --red-glow: rgba(220, 53, 69, 0.3);
}

.tab {
  animation: fadeIn 0.3s ease;
  padding: 0 1.5rem;
}

.topo {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
.topo h3 {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 700;
  color: #e0e0e0;
  text-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}
.btn-adicionar {
  background: linear-gradient(145deg, #007bff, #0056b3);
  color: #fff;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 123, 255, 0.3);
  display: flex;
  align-items: center;
  gap: 8px;
}
.btn-adicionar:hover {
  background: linear-gradient(145deg, #0056b3, #007bff);
  transform: translateY(-2px); /* Efeito de "levantar" */
  box-shadow: 0 6px 20px rgba(0, 123, 255, 0.4);
}

.vazio {
  text-align: center;
  padding: 4rem 2rem;
  color: rgba(255, 255, 255, 0.7);
}
.vazio p {
  margin: 0 0 1.5rem 0;
  font-size: 1.2rem;
  font-weight: 500;
}
.vazio .btn-primary {
  background: linear-gradient(145deg, #007bff, #0056b3);
  color: #fff;
  border: none;
  padding: 0.85rem 1.75rem;
  border-radius: 50px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 123, 255, 0.3);
}
.vazio .btn-primary:hover {
  background: linear-gradient(145deg, #0056b3, #007bff);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 123, 255, 0.4);
}

.lista {
  display: grid;
  gap: 1.5rem;
}
.endereco {
  background: #24243a;
  border-radius: 12px;
  padding: 1.8rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}
.endereco:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(0, 123, 255, 0.3);
}
.endereco .info h4 {
  margin: 0 0 0.6rem 0;
  font-size: 1.2rem;
  font-weight: 700;
  color: #ffffff;
}
.endereco .info p {
  margin: 0 0 0.4rem 0;
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
}
.endereco .info .complemento {
  font-style: italic;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.95rem;
}
.endereco .info small {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
  display: block;
  margin-top: 0.5rem;
}
.endereco .acoes {
  display: flex;
  gap: 0.8rem;
}
.btn-icon {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.7);
  padding: 0.75rem; /* Padding maior */
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, transform 0.2s ease;
  font-size: 1.1rem;
}
.btn-icon:hover {
  background: rgba(0, 123, 255, 0.1);
  color: #007bff;
  border-color: #007bff;
  transform: translateY(-2px); /* Efeito de "levantar" */
  box-shadow: 0 4px 10px rgba(0, 123, 255, 0.2);
}
.btn-icon.danger {
  color: #dc3545;
  border-color: rgba(220, 53, 69, 0.3);
}
.btn-icon.danger:hover {
  background: rgba(220, 53, 69, 0.1);
  color: #c82333;
  border-color: #c82333;
  box-shadow: 0 4px 10px rgba(220, 53, 69, 0.3);
}

/* Modal */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1.5rem;
  animation: fadeInModal 0.3s ease-out;
}
.modal-content {
  background: #1a1a2e;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  max-width: 550px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  transform: scale(0.95);
  animation: scaleIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
  padding: 1.8rem;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1.2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  margin-bottom: 1.5rem;
}
.modal-header h3 {
  margin: 0;
  color: #007bff;
  font-size: 1.6rem;
  font-weight: 700;
}
.btn-close-modal {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.8rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: background-color 0.3s ease, color 0.3s ease;
}
.btn-close-modal:hover {
  background: rgba(220, 53, 69, 0.1);
  color: #dc3545;
}
.modal-content form {
  /* Removido padding extra aqui, já que o modal-content já tem padding */
}
.form-input {
  width: 100%;
  padding: 0.9rem;
  margin-bottom: 0.8rem;
  background: #2a2a3e;
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: #fff;
  border-radius: 8px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  font-size: 1rem;
}
.form-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}
.form-input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 4px rgba(0, 123, 255, 0.3);
}

.botoes {
  display: flex;
  gap: 1.2rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

/* Estilos para os botões Salvar e Cancelar */
.btn-salvar,
.btn-cancelar {
  padding: 12px 25px;
  border-radius: 40px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-salvar {
  background: linear-gradient(145deg, #007bff, #0056b3); 
  color: #fff;
  border: none;
  box-shadow: 0 4px 15px rgba(0, 123, 255, 0.3);
}

.btn-salvar:hover {
  background: linear-gradient(145deg, #0056b3, #007bff);
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(0, 123, 255, 0.4);
}

.btn-cancelar {
  background: transparent;
  color: #ff4f8f; 
  border: 1px solid #ff4f8f;
}

.btn-cancelar:hover {
  background: rgba(255, 79, 143, 0.1);
  color: #fff;
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInModal {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scaleIn {
  from { transform: scale(0.8); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.card-glow {
  box-shadow: 0 0 0 rgba(0, 123, 255, 0);
  transition: box-shadow 0.3s ease-out;
}

.card-glow:hover {
  box-shadow: 0 0 20px rgba(0, 123, 255, 0.3);
}

@media (max-width: 768px) {
  .tab {
    padding: 0 0.5rem;
  }
  .topo {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
  .topo h3 {
    font-size: 1.5rem;
  }
  .btn-adicionar {
    width: 100%;
    justify-content: center;
  }
  .vazio {
    padding: 2.5rem 1rem;
  }
  .vazio p {
    font-size: 1.1rem;
  }
  .endereco {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
    padding: 1.5rem;
  }
  .endereco .acoes {
    justify-content: flex-end;
    margin-top: 1rem;
  }
  .btn-icon {
    padding: 0.6rem;
    font-size: 1rem;
  }
  .modal-content {
    margin: 0 0.5rem;
    padding: 1.5rem;
  }
  .modal-header {
    padding: 1.2rem;
  }
  .modal-header h3 {
    font-size: 1.4rem;
  }
  .btn-close-modal {
    font-size: 1.5rem;
  }
  .modal-content form {
  }
  .form-input {
    padding: 0.8rem;
    margin-bottom: 0.8rem;
  }
  .botoes {
    flex-direction: column;
    gap: 0.8rem;
    margin-top: 1.5rem;
    padding-top: 1rem;
  }
  .botoes button {
    width: 100%;
    justify-content: center;
    padding: 0.8rem 1.5rem;
  }
}

@media (max-width: 480px) {
  .topo h3 {
    font-size: 1.3rem;
  }
  .btn-adicionar {
    font-size: 0.9rem;
    padding: 0.6rem 1.2rem;
  }
  .vazio p {
    font-size: 1rem;
  }
  .endereco .info h4 {
    font-size: 1.1rem;
  }
  .endereco .info p {
    font-size: 0.9rem;
  }
  .endereco .info small {
    font-size: 0.8rem;
  }
  .btn-icon {
    font-size: 0.9rem;
    padding: 0.5rem;
  }
  .modal-header h3 {
    font-size: 1.2rem;
  }
  .btn-close-modal {
    font-size: 1.3rem;
  }
  .form-input {
    font-size: 0.9rem;
  }
}
.form-grid {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.form-row {
  display: flex;
  gap: 0.8rem;
}

@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
  }
}
</style>