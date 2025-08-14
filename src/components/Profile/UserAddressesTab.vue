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
      <div class="modal-content address-modal">
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
            <div class="form-group">
              <label for="street">Rua</label>
              <input id="street" v-model="localEditingAddress.street" placeholder="Rua" required class="form-input" />
            </div>
            <div class="form-group">
              <label for="number">Número</label>
              <input id="number" v-model="localEditingAddress.number" type="number" placeholder="Número" required class="form-input" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="neighborhood">Bairro</label>
              <input id="neighborhood" v-model="localEditingAddress.neighborhood" placeholder="Bairro" required class="form-input" />
            </div>
            <div class="form-group">
              <label for="city">Cidade</label>
              <input id="city" v-model="localEditingAddress.city" placeholder="Cidade" required class="form-input" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="state">Estado</label>
              <input id="state" v-model="localEditingAddress.state" placeholder="Estado" required class="form-input" />
            </div>
            <div class="form-group">
              <label for="zip">CEP</label>
              <input id="zip" v-model="localEditingAddress.zip" placeholder="CEP" required class="form-input" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="complement">Complemento</label>
              <input id="complement" v-model="localEditingAddress.complement" placeholder="Complemento (opcional)" class="form-input" />
            </div>
            <div class="form-group">
              <label for="country">País</label>
              <input id="country" v-model="localEditingAddress.country" placeholder="País" required class="form-input" />
            </div>
          </div>
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

const emit = defineEmits(['abrir-modal-endereco', 'fechar-modal', 'salvar-endereco', 'remover-endereco']);

const localEditingAddress = ref({});

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
    return;
  }

  emit('salvar-endereco', dataToSend);
};
</script>

<style scoped>
:root {
  --primary-blue: #007bff;
  --card-bg: #24243a;
  --input-bg: #23233a;
  --label-color: #8fd6fb;
  --border-color-medium: rgba(255, 255, 255, 0.15);
  --red-danger: #dc3545;
  --red-danger-hover: #c82333;
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
  transform: translateY(-2px);
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
  background: var(--card-bg);
  border-radius: 12px;
  padding: 1.8rem;
  border: 1px solid var(--border-color-medium);
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
  padding: 0.75rem;
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
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 123, 255, 0.2);
}
.btn-icon.danger {
  color: var(--red-danger);
  border-color: rgba(220, 53, 69, 0.3);
}
.btn-icon.danger:hover {
  background: rgba(220, 53, 69, 0.1);
  color: var(--red-danger-hover);
  border-color: var(--red-danger-hover);
  box-shadow: 0 4px 10px rgba(220, 53, 69, 0.3);
}

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
.address-modal {
  max-width: 520px;
  width: 100%;
  padding: 2.2rem 2rem;
  background: #1a1a2e;
  border-radius: 18px;
  border: 1px solid rgba(255,255,255,0.13);
  box-shadow: 0 14px 40px rgba(0,0,0,0.48);
}

/* Form grid com labels acima dos campos */
.form-grid {
  display: flex;
  flex-direction: column;
  gap: 1.05rem;
  margin-top: 0.3rem;
}
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.05rem;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.33rem;
}
.form-group label {
  font-size: 0.97rem;
  color: var(--label-color);
  font-weight: 500;
  margin-bottom: 0.1rem;
  letter-spacing: 0.01em;
}
.form-input {
  width: 100%;
  padding: 0.78rem;
  background: var(--input-bg);
  border: 1px solid rgba(255,255,255,0.22);
  color: #fff;
  border-radius: 8px;
  font-size: 1rem;
  transition: border 0.2s, box-shadow 0.2s;
}
.form-input:focus {
  border-color: #00ffe1;
  box-shadow: 0 0 0 2px rgba(0,255,225,0.18);
  outline: none;
}
.botoes {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.2rem;
}

/* Botões */
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

@keyframes fadeInModal {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes fadeIn {
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

/* Responsivo */
@media (max-width: 700px) {
  .address-modal { padding: 1.3rem 0.5rem; }
  .form-row { grid-template-columns: 1fr; gap:0.8rem; }
  .botoes { flex-direction: column; gap:0.8rem; }
}
@media (max-width: 480px) {
  .topo h3 { font-size: 1.3rem; }
  .btn-adicionar { font-size: 0.9rem; padding: 0.6rem 1.2rem; }
  .vazio p { font-size: 1rem; }
  .endereco .info h4 { font-size: 1.1rem; }
  .endereco .info p { font-size: 0.9rem; }
  .endereco .info small { font-size: 0.8rem; }
  .btn-icon { font-size: 0.9rem; padding: 0.5rem; }
  .modal-header h3 { font-size: 1.2rem; }
  .btn-close-modal { font-size: 1.3rem; }
  .form-input { font-size: 0.9rem; }
}
</style>