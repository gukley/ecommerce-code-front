<template>
  <div class="checkout-form">
    <!-- Indicador de etapas -->
    <div class="steps-indicator">
      <div :class="['step', etapa === 1 ? 'active' : '', etapa > 1 ? 'done' : '']">
        <i class="bi bi-geo-alt"></i>
        <span>Endereço</span>
      </div>
      <div :class="['step', etapa === 2 ? 'active' : '', etapa > 2 ? 'done' : '']">
        <i class="bi bi-credit-card"></i>
        <span>Pagamento</span>
      </div>
      <div :class="['step', etapa === 3 ? 'active' : '', etapa > 3 ? 'done' : '']">
        <i class="bi bi-check2-circle"></i>
        <span>Confirmação</span>
      </div>
    </div>

    <!-- Etapa 1: Endereço -->
    <div v-if="etapa === 1" class="form-section">
      <div class="section-header">
        <i class="bi bi-geo-alt"></i>
        <h4>Endereço de Entrega</h4>
      </div>

      <!-- Lista de endereços salvos -->
      <div v-if="enderecos.length > 0 && !modoNovoEndereco" class="address-selection">
        <div class="selection-header">
          <label class="form-label">Selecione um endereço salvo:</label>
        </div>
        <div class="address-options">
          <div v-for="end in enderecos" :key="end.id" class="address-option">
            <input
              class="address-radio"
              type="radio"
              :id="'endereco-'+end.id"
              :value="end.id"
              v-model="enderecoSelecionadoId"
            >
            <label class="address-label" :for="'endereco-'+end.id">
              <div class="address-info">
                <div class="address-street">{{ end.street }}, {{ end.number }}</div>
                <div class="address-details">{{ end.city }}/{{ end.state }} - CEP: {{ end.zip }}</div>
                <div v-if="end.country" class="address-country">{{ end.country }}</div>
              </div>
            </label>
          </div>
        </div>

        <button class="btn-secondary" @click="modoNovoEndereco = true">
          <i class="bi bi-plus-circle"></i>
          Cadastrar novo endereço
        </button>
      </div>

      <!-- Formulário para novo endereço -->
      <form v-if="modoNovoEndereco || enderecos.length === 0" @submit.prevent="avancarEtapaEndereco" class="address-form">
        <div class="form-grid">
          <div class="form-group full-width">
            <label class="form-label" for="street">Rua</label>
            <input id="street" type="text" class="form-input" v-model="form.street" required />
          </div>
          <div class="form-group">
            <label class="form-label" for="number">Número</label>
            <input id="number" type="number" class="form-input" v-model.number="form.number" required />
          </div>
          <div class="form-group">
            <label class="form-label" for="city">Cidade</label>
            <input id="city" type="text" class="form-input" v-model="form.city" required />
          </div>
          <div class="form-group">
            <label class="form-label" for="state">Estado</label>
            <input id="state" type="text" class="form-input" v-model="form.state" required />
          </div>
          <div class="form-group">
            <label class="form-label" for="country">País</label>
            <input id="country" type="text" class="form-input" v-model="form.country" required />
          </div>
          <div class="form-group">
            <label class="form-label" for="zip">CEP</label>
            <input id="zip" type="text" class="form-input" v-model="form.zip" required />
          </div>
        </div>
        <div class="form-actions">
          <button v-if="enderecos.length > 0" type="button" class="btn-secondary" @click="modoNovoEndereco = false">
            <i class="bi bi-arrow-left"></i>
            Selecionar endereço salvo
          </button>
          <button type="submit" class="btn-primary">
            <i class="bi bi-check-circle"></i>
            Continuar
          </button>
        </div>
      </form>

      <!-- Botão continuar quando endereço já existe -->
      <button v-else class="btn-primary w-100" @click="avancarEtapaEndereco">
        <i class="bi bi-check-circle"></i>
        Continuar
      </button>
    </div>

    <!-- Etapa 2: Pagamento -->
    <PaymentSelection
      v-if="etapa === 2"
      v-model="metodoPagamento"
      @etapaChange="handleEtapaChangeFromPayment"
      @dadosColetados="handleDadosColetadosFromPayment"
    />
    <!-- Etapa 3: Confirmação (Sugestão para adicionar!) -->
    <!-- <OrderSummary v-if="etapa === 3" ... /> -->
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, watch } from 'vue';
import { createAddress, getAllAddresses } from '@/services/apiService';
import { useToast } from 'vue-toastification';
import PaymentSelection from './PaymentSelection.vue';

const props = defineProps({
  etapa: Number
});

const emit = defineEmits(['etapaChange', 'dadosColetados']);

const toast = useToast();

const form = reactive({
  street: '',
  number: null,
  city: '',
  state: '',
  country: '',
  zip: '',
});

const enderecos = ref([]);
const enderecoSelecionadoId = ref(null);
const modoNovoEndereco = ref(false);
const metodoPagamento = ref('pix');

onMounted(async () => {
  try {
    enderecos.value = await getAllAddresses();
  } catch (e) {
    console.error("Erro ao carregar endereços:", e);
  }
  if (enderecos.value.length > 0) {
    enderecoSelecionadoId.value = enderecos.value[0].id;
    modoNovoEndereco.value = false;
  } else {
    modoNovoEndereco.value = true;
  }
});

watch(() => props.etapa, (newVal) => {
  // Use para animações de etapa se quiser
});

async function avancarEtapaEndereco() {
  let enderecoFinal = null;
  try {
    if (modoNovoEndereco.value) {
      if (!form.street || !form.number || !form.city || !form.state || !form.country || !form.zip) {
        toast.error('Por favor, preencha todos os campos do endereço.');
        return;
      }

      const addressPayload = { ...form };
      enderecoFinal = await createAddress(addressPayload);

      if (!enderecoFinal?.id) {
        toast.error('Erro: O backend não retornou o ID do endereço.');
        return;
      }

      toast.success('Novo endereço cadastrado com sucesso!');
    } else {
      enderecoFinal = enderecos.value.find(
        (end) => end.id === enderecoSelecionadoId.value
      );
      if (!enderecoFinal) {
        toast.warning('Por favor, selecione um endereço válido.');
        return;
      }
    }

    emit('dadosColetados', {
      endereco: enderecoFinal,
      metodoPagamento: metodoPagamento.value
    });

    emit('etapaChange', 2);

  } catch (error) {
    console.error('Erro ao processar o endereço:', error);
    toast.error('Ocorreu um erro ao processar o endereço. Tente novamente.');
  }
}

function handleEtapaChangeFromPayment(newEtapa) {
  emit('etapaChange', newEtapa);
}

function handleDadosColetadosFromPayment(dados) {
  emit('dadosColetados', dados);
}
</script>

<style scoped>
.checkout-form {
  max-width: 520px;
  margin: 0 auto;
  font-family: 'Inter', sans-serif;
  background: transparent;
}
.steps-indicator {
  display: flex;
  justify-content: center;
  gap: 2.2rem;
  margin-bottom: 2.2rem;
}
.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  font-size: 1.03rem;
  color: #bbb;
  font-weight: 600;
  opacity: 0.7;
  position: relative;
  transition: color 0.3s, opacity 0.3s;
}
.step i {
  font-size: 1.8rem;
  margin-bottom: 0.15rem;
  opacity: 0.85;
}
.step.active, .step.done {
  color: #00ffe1;
  opacity: 1;
}
.step.active i, .step.done i {
  color: #00ffe1;
  filter: drop-shadow(0 0 10px #00ffe1);
}
.step.done span::after {
  content: '';
  display: block;
  margin: 3px auto 0 auto;
  width: 22px;
  height: 3px;
  background: linear-gradient(90deg, #00ffe1 0%, #8f5fe8 100%);
  border-radius: 2px;
}
.form-section {
  background: #1e1e2d;
  border-radius: 15px;
  box-shadow: 0 12px 40px rgba(0,255,225,0.09);
  padding: 2.5rem 2rem;
  margin-bottom: 2rem;
  border: 1px solid rgba(0,255,225,0.06);
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.section-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(0,255,225,0.08);
}
.section-header i {
  font-size: 25px;
  color: #00ffe1;
}
.section-header h4 {
  margin: 0;
  color: #ffffff;
  font-weight: 700;
  font-size: 21px;
  letter-spacing: 0.01em;
}
.address-selection {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.selection-header label {
  font-weight: 600;
  font-size: 16px;
  color: #b0b0b0;
  margin-bottom: 8px;
}
.address-options {
  display: flex;
  flex-direction: column;
  gap: 13px;
}
.address-option {
  position: relative;
}
.address-radio {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}
.address-label {
  display: flex;
  flex-direction: column;
  padding: 16px 20px;
  background: rgba(0,255,225,0.03);
  border: 1.5px solid rgba(0,255,225,0.08);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}
.address-radio:checked + .address-label {
  border-color: #00ffe1;
  background: rgba(0,255,225,0.09);
  box-shadow: 0 4px 22px rgba(0,255,225,0.11);
}
.address-radio:checked + .address-label::before {
  content: '';
  position: absolute;
  top: 12px;
  right: 16px;
  width: 19px;
  height: 19px;
  background: linear-gradient(135deg, #00ffe1 0%, #8f5fe8 100%);
  border-radius: 50%;
  transition: all 0.2s ease;
  box-shadow: 0 0 10px #00ffe1;
}
.address-radio:checked + .address-label::after {
  content: '✓';
  position: absolute;
  top: 10px;
  right: 20px;
  color: #fff;
  font-weight: bold;
  font-size: 14px;
  text-shadow: 0 0 7px #00ffe1;
}
.address-info {
  color: #ffffff;
}
.address-street {
  font-weight: 700;
  font-size: 16px;
  margin-bottom: 4px;
}
.address-details {
  color: rgba(255, 255, 255, 0.67);
  font-size: 15px;
}
.address-country {
  color: rgba(255, 255, 255, 0.45);
  font-size: 13px;
  margin-top: 4px;
}
.address-form {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px 16px;
}
.form-group.full-width {
  grid-column: 1 / -1;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
.form-label {
  color: #8fd6fb;
  font-weight: 600;
  font-size: 15px;
  margin-bottom: 7px;
  margin-left: 2px;
  letter-spacing: 0.01em;
}
.form-input {
  background: #23233a;
  border: 1.5px solid rgba(0,255,225,0.09);
  border-radius: 8px;
  padding: 12px 16px;
  color: #fff;
  font-size: 16px;
  transition: all 0.2s ease;
  min-width: 0;
}
.form-input:focus {
  outline: none;
  border-color: #00ffe1;
  background: #23233a;
  box-shadow: 0 0 0 2px rgba(0,255,225,0.18);
}
.form-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}
/* Botões */
.form-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 16px;
  grid-column: 1 / -1;
  margin-top: 8px;
}
.btn-primary,
.btn-secondary {
  border-radius: 50px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}
.btn-primary {
  background: linear-gradient(145deg, #00ffe1 0%, #8f5fe8 100%);
  color: #181828;
  border: none;
  padding: 14px 28px;
  font-size: 17px;
  box-shadow: 0 4px 15px rgba(0,255,225,0.14);
}
.btn-primary:hover {
  background: linear-gradient(145deg, #8f5fe8 0%, #00ffe1 100%);
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(0,255,225,0.22);
}
.btn-secondary {
  background: transparent;
  color: #00ffe1;
  border: 1.5px solid #00ffe1;
  padding: 12px 24px;
  font-size: 16px;
}
.btn-secondary:hover {
  background: rgba(0,255,225,0.09);
}
.w-100 {
  width: 100%;
}

/* Responsividade */
@media (max-width: 768px) {
  .form-section {
    padding: 2rem 1.25rem;
  }
  .address-form {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  .form-actions {
    flex-direction: column;
    gap: 12px;
  }
  .btn-primary,
  .btn-secondary {
    width: 100%;
    justify-content: center;
    padding: 14px 24px;
  }
  .section-header h4 {
    font-size: 18px;
  }
  .steps-indicator {
    gap: 1.2rem;
    margin-bottom: 1.1rem;
  }
  .step i {
    font-size: 1.4rem;
  }
}
@media (max-width: 480px) {
  .checkout-form {
    padding: 0.5rem;
  }
  .form-section {
    padding: 1.2rem 0.5rem;
  }
  .steps-indicator {
    gap: 0.7rem;
  }
  .step i {
    font-size: 1.05rem;
  }
  .address-form {
    gap: 8px;
  }
  .btn-primary,
  .btn-secondary {
    font-size: 15px;
    padding: 12px 10px;
  }
}
</style>