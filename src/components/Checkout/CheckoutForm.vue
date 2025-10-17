<template>
  <div class="checkout-form glass-card">
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
      <div
        v-if="!modoNovoEndereco && enderecos.length > 0 && enderecoSelecionadoId && getSelectedAddressInfo()"
        class="address-continue"
      >
        <div class="selected-address-info">
          <h5>Endereço Selecionado:</h5>
          <div class="selected-address">
            <i class="bi bi-check-circle-fill"></i>
            <div class="address-details">
              <strong>{{ getSelectedAddressInfo() }}</strong>
            </div>
          </div>
        </div>
        <button class="btn-primary w-100" @click="avancarEtapaEndereco">
          <i class="bi bi-check-circle"></i>
          Continuar com este endereço
        </button>
      </div>
    </div>

    <!-- Etapa 2: Pagamento -->
    <PaymentSelection
      v-if="etapa === 2"
      v-model="metodoPagamento"
      @etapaChange="handleEtapaChangeFromPayment"
      @dadosColetados="handleDadosColetadosFromPayment"
      @pagamentoAprovado="handlePagamentoAprovado"
    />
    <!-- Etapa 3: Confirmação (Sugestão para adicionar!) -->
    <!-- <OrderSummary v-if="etapa === 3" ... /> -->
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, watch } from 'vue';
import { createAddress, getAllAddresses, createOrder } from '@/services/apiService';
import { useToast } from 'vue-toastification';
import PaymentSelection from './PaymentSelection.vue';

const props = defineProps({
  etapa: Number
});

const emit = defineEmits(['etapaChange', 'dadosColetados', 'pedidoCriado']);

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
});

async function avancarEtapaEndereco() {
  let enderecoFinal = null;
  try {
    if (modoNovoEndereco.value) {
      const addressPayload = {
        street: form.street,
        number: form.number,
        city: form.city,
        state: form.state,
        zip: form.zip
      };
      if (!addressPayload.street || !addressPayload.number || !addressPayload.city || !addressPayload.state || !addressPayload.zip) {
        toast.error('Por favor, preencha todos os campos do endereço.');
        return;
      }

      enderecoFinal = await createAddress(addressPayload);

      if (!enderecoFinal?.id) {
        toast.error('Erro: O backend não retornou o ID do endereço.');
        return;
      }

      enderecoSelecionadoId.value = enderecoFinal.id;
      modoNovoEndereco.value = false;

      toast.success('Novo endereço cadastrado com sucesso!');

      emit('dadosColetados', {
        endereco: enderecoFinal,
        metodoPagamento: metodoPagamento.value
      });
      emit('etapaChange', 2);
      return;
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

async function handlePagamentoAprovado({ paymentIntent, items, email, valorTotal }) {
  try {
    console.log('Dados recebidos do pagamento:', { paymentIntent, items, email, valorTotal });
    
    // Validações antes de criar o pedido
    if (!enderecoSelecionadoId.value) {
      toast.error('Endereço não selecionado');
      return;
    }
    
    if (!items || items.length === 0) {
      toast.error('Nenhum item encontrado no carrinho');
      return;
    }
    
    // Valida cada item
    const validItems = items.filter(item => {
      if (!item.product_id) {
        console.error('Item sem product_id:', item);
        return false;
      }
      if (!item.quantity || item.quantity <= 0) {
        console.error('Item com quantidade inválida:', item);
        return false;
      }
      if (!item.unit_price || item.unit_price <= 0) {
        console.error('Item com preço inválido:', item);
        return false;
      }
      return true;
    });
    
    if (validItems.length === 0) {
      toast.error('Nenhum item válido encontrado');
      return;
    }
    
    // Monta o payload do pedido com dados corretos
    const orderData = {
      items: validItems.map(item => ({
        product_id: Number(item.product_id),
        quantity: Number(item.quantity),
        unit_price: Number(item.unit_price)
      })),
      address_id: Number(enderecoSelecionadoId.value),
      payment_method: 'card',
      total_amount: Number(valorTotal),
      shipping_cost: 0,
      coupon_id: null
    }
    
    console.log('Payload do pedido validado:', JSON.stringify(orderData, null, 2));
    
    const response = await createOrder(orderData)
    if (response) {
      toast.success('Pedido gerado com sucesso!')
      emit('pedidoCriado', true)
      emit('etapaChange', 3)
    }
  } catch (err) {
    console.error('Erro detalhado ao criar pedido:', err);
    console.error('Response data:', err.response?.data);
    console.error('Response status:', err.response?.status);
    
    let errorMessage = 'Erro ao criar pedido';
    if (err.response?.data?.detail) {
      if (Array.isArray(err.response.data.detail)) {
        errorMessage = err.response.data.detail.map(e => e.msg || e).join(', ');
      } else {
        errorMessage = err.response.data.detail;
      }
    } else if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err.message) {
      errorMessage = err.message;
    }
    
    toast.error(errorMessage);
  }
}

function handleEtapaChangeFromPayment(newEtapa) {
  emit('etapaChange', newEtapa);
}

function handleDadosColetadosFromPayment(dados) {
  // Sempre enviar o endereço selecionado junto com o método de pagamento
  const enderecoFinal = enderecos.value.find(
    (end) => end.id === enderecoSelecionadoId.value
  );
  emit('dadosColetados', {
    endereco: enderecoFinal,
    metodoPagamento: dados.metodoPagamento || metodoPagamento.value
  });
}

function getSelectedAddressInfo() {
  const selectedAddress = enderecos.value.find(
    (end) => end.id === enderecoSelecionadoId.value
  );
  if (selectedAddress) {
    return `${selectedAddress.street}, ${selectedAddress.number} - ${selectedAddress.city}/${selectedAddress.state} - CEP: ${selectedAddress.zip}`;
  }
  return '';
}
</script>

<style scoped>
.checkout-form {
  max-width: 520px;
  margin: 0 auto;
  font-family: 'Inter', sans-serif;
  background: transparent;
}
.glass-card {
  background: rgba(24, 30, 42, 0.92);
  border-radius: 1.5rem;
  box-shadow: 0 8px 32px 0 #232e4780;
  border: 1.5px solid #232e47;
  backdrop-filter: blur(8px);
  padding: 2.2rem 2rem 2rem 2rem;
  margin-bottom: 2rem;
  transition: box-shadow 0.2s;
}
.glass-card:focus-within, .glass-card:hover {
  box-shadow: 0 12px 40px #399bff40;
  border-color: #399bff;
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
  background: transparent;
  box-shadow: none;
  border: none;
  padding: 0;
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #374151;
}

.section-header i {
  font-size: 1.5rem;
  color: #64b5f6;
}

.section-header h4 {
  margin: 0;
  color: #f9fafb;
  font-weight: 700;
  font-size: 1.25rem;
  letter-spacing: 0.01em;
}

.address-selection {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.selection-header label {
  font-weight: 600;
  font-size: 1rem;
  color: #e8eaed;
  margin-bottom: 0.5rem;
  display: block;
}

.address-options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.address-option {
  position: relative;
  transition: all 0.3s ease;
}

.address-option:hover {
  transform: translateX(5px);
}

.address-radio {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.address-label {
  display: flex;
  align-items: center;
  padding: 1rem;
  border: 2px solid #232e47;
  background: rgba(36, 44, 60, 0.85);
  transition: border 0.2s, background 0.2s;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #e8eaed;
}

.address-radio:checked + .address-label {
  border-color: #399bff;
  background: linear-gradient(135deg, #232e47 0%, #399bff20 100%);
  box-shadow: 0 4px 20px #399bff30;
}

.address-radio:checked + .address-label::before {
  content: '✓';
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #64b5f6;
  font-size: 1.25rem;
  font-weight: bold;
}

.address-info {
  flex: 1;
}

.address-street {
  font-weight: 600;
  font-size: 1rem;
  color: #f9fafb;
  margin-bottom: 0.25rem;
}

.address-details {
  font-size: 0.875rem;
  color: #b0b7c3;
}

.address-country {
  font-size: 0.875rem;
  color: #9ca3af;
  margin-top: 0.25rem;
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
  border: 1.5px solid #399bff40;
  border-radius: 8px;
  padding: 12px 16px;
  color: #fff;
  font-size: 16px;
  transition: all 0.2s ease;
  min-width: 0;
  box-shadow: 0 2px 8px #399bff10;
}
.form-input:focus {
  outline: none;
  border-color: #399bff;
  background: #23233a;
  box-shadow: 0 0 0 2px #399bff30;
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
  background: linear-gradient(135deg, #399bff 0%, #42a5f5 100%);
  color: white;
  border: none;
  border-radius: 0.75rem;
  padding: 0.875rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: 0 4px 15px #399bff30;
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px #399bff40;
  background: linear-gradient(135deg, #42a5f5 0%, #399bff 100%);
}
.btn-secondary {
  background: transparent;
  color: #399bff;
  border: 2px solid #399bff;
  border-radius: 0.75rem;
  padding: 0.875rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}
.btn-secondary:hover {
  background: #399bff;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px #399bff30;
}

.w-100 {
  width: 100%;
}

.address-continue {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.selected-address-info h5 {
  color: #399bff;
  font-size: 18px;
  margin-bottom: 10px;
}

.selected-address {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: rgba(57, 155, 255, 0.08);
  border: 1.5px solid #399bff40;
  border-radius: 10px;
  color: #fff;
  box-shadow: 0 2px 8px #399bff10;
}

.selected-address i {
  font-size: 24px;
  color: #399bff;
}

.address-details {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
}

/* Responsividade */
@media (max-width: 768px) {
  .glass-card {
    padding: 1.2rem 0.7rem;
  }
  .form-section {
    padding: 0;
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
}
@media (max-width: 480px) {
  .checkout-form {
    padding: 0.5rem;
  }
  .glass-card {
    padding: 0.7rem 0.2rem;
  }
}
</style>