<template>
  <div class="form-section payment-section">
    <div class="section-header">
      <i class="bi bi-credit-card"></i>
      <h4>Pagamento com Cartão de Crédito</h4>
    </div>
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
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { useToast } from 'vue-toastification';
import { useCartStore } from '@/stores/cartStore';

const toast = useToast();
const cartStore = useCartStore();
const loading = ref(false);
const clientSecret = ref(null);
const stripe = ref(null);
const elements = ref(null);
const card = ref(null);

const STRIPE_PUBLIC_KEY = 'pk_test_51S3OdoAyTfunaRVJZVCU8yQouIu9PtRQlkMaIYZeqPhWAW7EhKSZJK3f9vFV5uylSUyvnnpRQSQrLnCHNUQMkgKk00GuNvTFTz'; // Troque pela sua chave pública do Stripe

async function criarPaymentIntent() {
  loading.value = true;
  try {
    const items = cartStore.items.map(p => ({
      name: p.name,
      amount: p.price,
      quantity: p.quantity
    }));

    const payload = {
      items,
      email: 'cliente@email.com', // ou pegue do usuário logado
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
      // Redirecione ou atualize o pedido conforme necessário
    }
  } catch (err) {
    toast.error('Erro ao confirmar pagamento: ' + (err.response?.data?.detail || err.message));
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.card-element {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #23272f;
  border-radius: 0.75rem;
  border: 1px solid #374151;
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
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(100, 181, 246, 0.4);
}
</style>