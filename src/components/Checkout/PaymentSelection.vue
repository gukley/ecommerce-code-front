<template>
  <div class="form-section payment-section">
    <div class="section-header">
      <i class="bi bi-credit-card"></i>
      <h4>Método de Pagamento</h4>
    </div>
    
    <!-- Seleção do método de pagamento -->
    <div class="payment-methods">
      <div class="payment-option">
        <input
          type="radio"
          id="pix"
          value="pix"
          v-model="selectedMethod"
          class="payment-radio"
        />
        <label for="pix" class="payment-label">
          <i class="bi bi-qr-code"></i>
          <span>PIX</span>
        </label>
      </div>
      
      <div class="payment-option">
        <input
          type="radio"
          id="card"
          value="card"
          v-model="selectedMethod"
          class="payment-radio"
        />
        <label for="card" class="payment-label">
          <i class="bi bi-credit-card"></i>
          <span>Cartão de Crédito</span>
        </label>
      </div>
    </div>

    <!-- PIX Payment -->
    <div v-if="selectedMethod === 'pix'" class="pix-section">
      <div class="pix-info">
        <i class="bi bi-info-circle"></i>
        <p>Você será redirecionado para o PIX após confirmar o pedido.</p>
      </div>
      <button class="btn-primary" @click="avancarComPix">
        Continuar com PIX
      </button>
    </div>

    <!-- Card Payment -->
    <div v-if="selectedMethod === 'card'" class="card-section">
      <div v-if="!clientSecret">
        <button class="btn-primary" @click="criarPaymentIntent" :disabled="loading">
          {{ loading ? 'Processando...' : 'Gerar pagamento' }}
        </button>
      </div>
      <div v-else>
        <div id="card-element" class="card-element"></div>
        <button class="btn-primary" @click="confirmarPagamento" :disabled="loading">
          {{ loading ? 'Processando...' : 'Pagar' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { useToast } from 'vue-toastification';
import { useCartStore } from '@/stores/cartStore';

const props = defineProps({
  modelValue: String
});

const emit = defineEmits(['update:modelValue', 'etapaChange', 'dadosColetados', 'pagamentoAprovado']);

const toast = useToast();
const cartStore = useCartStore();
const loading = ref(false);
const clientSecret = ref(null);
const stripe = ref(null);
const elements = ref(null);
const card = ref(null);
const selectedMethod = ref(props.modelValue || 'pix');

const STRIPE_PUBLIC_KEY = 'pk_test_51S3OdoAyTfunaRVJZVCU8yQouIu9PtRQlkMaIYZeqPhWAW7EhKSZJK3f9vFV5uylSUyvnnpRQSQrLnCHNUQMkgKk00GuNvTFTz';

// Watch para atualizar o v-model
watch(selectedMethod, (newValue) => {
  emit('update:modelValue', newValue);
});

async function criarPaymentIntent() {
  loading.value = true;
  try {
    const items = cartStore.detailedItems.map(p => ({
      name: p.product?.name || p.name || 'Produto',
      amount: Number(p.product?.price || p.price) * 100, // Converter para centavos
      quantity: p.quantity
    }));

    const payload = {
      items,
      email: 'cliente@email.com',
      metadata: { order_id: cartStore.orderId }
    };

    const { data } = await axios.post(
      'http://localhost:8000/payments/create-payment-intent',
      payload
    );
    clientSecret.value = data.clientSecret;

    stripe.value = await loadStripe(STRIPE_PUBLIC_KEY);
    elements.value = stripe.value.elements();
    card.value = elements.value.create('card');
    card.value.mount('#card-element');
  } catch (err) {
    toast.error('Erro ao criar pagamento: ' + (err.response?.data?.detail || err.message));
  } finally {
    loading.value = false;
  }
}

async function confirmarPagamento() {
  loading.value = true;
  try {
    const { error, paymentIntent } = await stripe.value.confirmCardPayment(clientSecret.value, {
      payment_method: {
        card: card.value,
      }
    });
    
    if (error) {
      toast.error('Erro no pagamento: ' + error.message);
      return;
    }
    
    if (paymentIntent.status === 'succeeded') {
      toast.success('Pagamento realizado com sucesso!');
      
      // Emitir evento de pagamento aprovado com dados corretos
      emit('pagamentoAprovado', {
        paymentIntent,
        items: cartStore.detailedItems.map(item => ({
          product_id: item.product?.id || item.product_id,
          quantity: item.quantity,
          unit_price: Number(item.product?.price || item.unit_price || 0),
          name: item.product?.name || 'Produto',
          amount: Number(item.product?.price || item.unit_price || 0) * item.quantity
        })),
        email: 'cliente@email.com',
        valorTotal: cartStore.detailedItems.reduce((sum, item) => 
          sum + (item.product?.price || 0) * item.quantity, 0
        )
      });
      
      emit('etapaChange', 3);
    }
  } catch (err) {
    toast.error('Erro ao confirmar pagamento: ' + (err.response?.data?.detail || err.message));
  } finally {
    loading.value = false;
  }
}

function avancarComPix() {
  emit('dadosColetados', {
    metodoPagamento: 'pix'
  });
  emit('etapaChange', 3);
}
</script>

<style scoped>
.payment-methods {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.payment-option {
  flex: 1;
}

.payment-radio {
  display: none;
}

.payment-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border: 2px solid #374151;
  border-radius: 0.75rem;
  background: #23233a;
  color: #e8eaed;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.payment-label i {
  font-size: 1.5rem;
  color: #64b5f6;
}

.payment-label span {
  font-weight: 600;
  font-size: 0.95rem;
}

.payment-radio:checked + .payment-label {
  border-color: #399bff;
  background: linear-gradient(135deg, #232e47 0%, #399bff20 100%);
  box-shadow: 0 4px 20px #399bff30;
}

.payment-radio:checked + .payment-label i {
  color: #00ffe1;
}

.pix-section, .card-section {
  margin-top: 1rem;
}

.pix-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: rgba(100, 181, 246, 0.1);
  border: 1px solid #64b5f6;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  color: #64b5f6;
}

.pix-info i {
  font-size: 1.2rem;
}

.pix-info p {
  margin: 0;
  font-size: 0.95rem;
}

.card-element {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #fff;
  border-radius: 0.75rem;
  border: 2px solid #399bff;
  color: #232e47;
  font-size: 1.15rem;
  box-shadow: 0 2px 12px #399bff22;
  min-height: 56px;
}

.card-element ::placeholder {
  color: #399bff;
  opacity: 0.9;
  font-size: 1.08rem;
}

.card-element input, .card-element .StripeElement {
  background: transparent;
  color: #232e47 !important;
  font-size: 1.15rem;
  border: none;
  outline: none;
}

.btn-primary {
  background: linear-gradient(135deg, #64b5f6 0%, #42a5f5 100%);
  color: white;
  border: none;
  padding: 0.875rem 1.5rem;
  font-size: 1rem;
  border-radius: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(100, 181, 246, 0.3);
  width: 100%;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(100, 181, 246, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

@media (max-width: 768px) {
  .payment-methods {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .payment-label {
    padding: 0.75rem;
  }
  
  .payment-label i {
    font-size: 1.25rem;
  }
}
</style>