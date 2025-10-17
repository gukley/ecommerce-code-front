<!-- filepath: src/components/PaymentSelection.vue -->
<template>
  <div class="form-section payment-section">
    <div class="section-header">
      <i class="bi bi-credit-card"></i>
      <h4>Método de Pagamento</h4>
    </div>
    
    <!-- Campo de e-mail dinâmico -->
    <div class="form-group">
      <label for="checkout-email">E-mail para recebimento</label>
      <input
        id="checkout-email"
        v-model="checkoutEmail"
        type="email"
        class="form-input"
        required
        placeholder="seu@email.com"
      />
    </div>

    <!-- Seleção do método de pagamento -->
    <div class="payment-methods">
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
      
      <div class="payment-option">
        <input
          type="radio"
          id="boleto"
          value="boleto"
          v-model="selectedMethod"
          class="payment-radio"
        />
        <label for="boleto" class="payment-label">
          <i class="bi bi-receipt"></i>
          <span>Boleto Bancário</span>
        </label>
      </div>
    </div>

    <!-- Card Payment -->
    <div v-if="selectedMethod === 'card'" class="card-section">
      <div v-if="!clientSecret">
        <button class="btn-primary" @click="criarPaymentIntent" :disabled="loading || !checkoutEmail">
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

    <!-- Boleto Payment -->
    <div v-if="selectedMethod === 'boleto'" class="boleto-section">
      <div class="boleto-info">
        <i class="bi bi-info-circle"></i>
        <p>Preencha os dados para gerar o boleto bancário.</p>
      </div>
      <form @submit.prevent="criarCheckoutBoleto">
        <div class="form-group">
          <label for="boleto-nome">Nome completo</label>
          <input id="boleto-nome" v-model="boletoNome" type="text" class="form-input" required />
        </div>
        <div class="form-group">
          <label for="boleto-cpf">CPF</label>
          <input id="boleto-cpf" v-model="boletoCpf" type="text" class="form-input" required maxlength="14" placeholder="000.000.000-00" />
        </div>
        <button class="btn-primary" type="submit" :disabled="loading || !boletoNome || !boletoCpf || !checkoutEmail">
          {{ loading ? 'Processando...' : 'Gerar Boleto' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { useToast } from 'vue-toastification';
import { useCartStore } from '@/stores/cartStore';
import { createCheckoutSession } from '@/services/apiService'

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
const selectedMethod = ref(props.modelValue || 'card');

// Campos para boleto e e-mail dinâmico
const boletoNome = ref('');
const boletoCpf = ref('');
const checkoutEmail = ref('');

// Stripe public key (coloque em .env se desejar)
const STRIPE_PUBLIC_KEY = 'pk_test_51S3OdoAyTfunaRVJZVCU8yQouIu9PtRQlkMaIYZeqPhWAW7EhKSZJK3f9vFV5uylSUyvnnpRQSQrLnCHNUQMkgKk00GuNvTFTz';

watch(selectedMethod, (newValue) => {
  emit('update:modelValue', newValue);
});

async function criarPaymentIntent() {
  loading.value = true;
  try {
    const items = cartStore.detailedItems.map(p => ({
      name: p.product?.name || p.name || 'Produto',
      amount: Number(p.product?.price || p.price),
      quantity: p.quantity
    }));

    const payload = {
      items,
      email: checkoutEmail.value,
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
      emit('pagamentoAprovado', {
        paymentIntent,
        items: cartStore.detailedItems.map(item => ({
          product_id: item.product?.id || item.product_id,
          quantity: item.quantity,
          unit_price: Number(item.product?.price || item.unit_price || 0),
          name: item.product?.name || 'Produto',
          amount: Number(item.product?.price || item.unit_price || 0) * item.quantity
        })),
        email: checkoutEmail.value,
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

  async function criarCheckoutBoleto() {
  loading.value = true;
  try {
    if (!boletoNome.value || !boletoCpf.value || !checkoutEmail.value) {
      toast.error('Preencha nome, CPF e e-mail.');
      loading.value = false;
      return;
    }
    const items = cartStore.detailedItems.map(p => ({
      name: p.product?.name || p.name || 'Produto',
      amount: Number(p.product?.price || p.price),
      quantity: p.quantity
    }));

  const payload = {
      items,
      email: checkoutEmail.value,
      payer: {
        name: boletoNome.value,
        tax_id: boletoCpf.value
      },
      metadata: { order_id: cartStore.orderId },
      success_url: window.location.origin + '/sucesso',
      cancel_url: window.location.origin + '/cancelado'
    };

   const data = await createCheckoutSession(payload);
    if (data && data.url) {
      window.location.href = data.url;
    } else {
      toast.error('Erro ao gerar boleto.');
    }
  } catch (err) {
    toast.error('Erro ao gerar boleto: ' + (err.response?.data?.detail || err.message || err));
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.payment-section {
  background: #f9fafb;
  border-radius: 1.2rem;
  padding: 1.2rem 1rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 12px #7c3aed10;
  border: 1.5px solid #e5e7eb;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #b8d8ff;
  background: linear-gradient(90deg, #ede9fe 0%, #f9fafb 100%);
}

.section-header i {
  font-size: 1.5rem;
  color: #7c3aed;
}

.section-header h4 {
  margin: 0;
  color: #4f46e5;
  font-weight: 700;
  font-size: 1.25rem;
  letter-spacing: 0.01em;
}

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
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  background: #fff;
  color: #4f46e5;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  font-weight: 600;
  box-shadow: 0 1px 6px #7c3aed10;
}

.payment-label i {
  font-size: 1.5rem;
  color: #7c3aed;
}

.payment-label span {
  font-weight: 600;
  font-size: 0.95rem;
}

.payment-radio:checked + .payment-label {
  border-color: #7c3aed;
  background: linear-gradient(135deg, #ede9fe 0%, #f9fafb 100%);
  box-shadow: 0 4px 20px #7c3aed20;
  color: #7c3aed;
}

.payment-radio:checked + .payment-label i {
  color: #4f46e5;
}

.pix-section, .card-section, .boleto-section {
  margin-top: 1rem;
}

.pix-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: #ede9fe;
  border: 1.5px solid #b8d8ff;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  color: #7c3aed;
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
  border: 2px solid #7c3aed;
  color: #232e47;
  font-size: 1.15rem;
  box-shadow: 0 2px 12px #7c3aed22;
  min-height: 56px;
}

.card-element ::placeholder {
  color: #b8d8ff;
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
  background: linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
  border: none;
  padding: 0.875rem 1.5rem;
  font-size: 1rem;
  border-radius: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px #7c3aed30;
  width: 100%;
}

.btn-primary:hover {
  background: linear-gradient(90deg, #7c3aed 0%, #4f46e5 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px #7c3aed40;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.boleto-section {
  margin-top: 1rem;
  background: #ede9fe;
  border-radius: 0.7rem;
  padding: 1.2rem 1rem;
  border: 1.5px solid #b8d8ff;
  box-shadow: 0 1px 6px #7c3aed10;
}

.boleto-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  color: #7c3aed;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  color: #4f46e5;
  font-weight: 600;
  font-size: 15px;
  margin-bottom: 7px;
  margin-left: 2px;
  letter-spacing: 0.01em;
}

.form-input {
  background: #fff;
  border: 1.5px solid #e5e7eb;
  border-radius: 0.7rem;
  padding: 12px 16px;
  color: #232e47;
  font-size: 16px;
  transition: all 0.2s;
  min-width: 0;
  box-shadow: 0 1px 6px #7c3aed10;
}

.form-input:focus {
  outline: none;
  border-color: #7c3aed;
  background: #f9fafb;
  box-shadow: 0 0 0 2px #7c3aed30;
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