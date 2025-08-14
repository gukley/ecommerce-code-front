<template>
  <div class="checkout-page">
    <div class="checkout-container">
      <div class="checkout-header">
        <button @click="voltarParaHome" class="btn-back">
          <i class="bi bi-arrow-left"></i>
          <span>Voltar para Home</span>
        </button>
        <h1 class="checkout-title">
          <i class="bi bi-cart-check gradient-icon"></i>
          Finalizar Pedido
        </h1>
      </div>

      <div class="checkout-content">
        <CheckoutSteps :etapa="etapaAtual <= 3 ? etapaAtual : 3" />

        <div class="checkout-main">
          <CheckoutForm
            v-if="etapaAtual <= 2"
            :etapa="etapaAtual"
            @etapaChange="etapaAtual = $event"
            @dadosColetados="handleDadosColetados"
            @finalizado="etapaAtual = 3"
          />

          <OrderReview
            v-if="etapaAtual === 3"
            :cart="cart"
            :frete="frete"
            :total="total"
            @confirmarPedido="confirmarPedido"
          />

          <ConfirmationSuccess
            v-if="etapaAtual === 4"
            @voltar="voltarParaHome"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

import CheckoutSteps from '@/components/Checkout/CheckoutSteps.vue';
import CheckoutForm from '@/components/Checkout/CheckoutForm.vue';
import OrderReview from '@/components/Checkout/OrderReview.vue';
import ConfirmationSuccess from '@/components/Checkout/ConfirmationSuccess.vue';

import { useCartStore } from '@/stores/cartStore';
import { createOrder } from '@/services/apiService';

const etapaAtual = ref(1);
const router = useRouter();
const cartStore = useCartStore();

const cart = computed(() => cartStore.detailedItems);

// >>> ADICIONE ESTES CAMPOS <<<
const frete = ref(15);
const total = computed(() =>
  cart.value.reduce((sum, item) => {
    const price = item.product?.price || 0;
    return sum + price * item.quantity;
  }, 0) + frete.value
);

const enderecoSelecionado = ref(null);
const metodoPagamento = ref(null);

function handleDadosColetados(dados) {
  // Você recebe { endereco, metodoPagamento } do emit do CheckoutForm
  enderecoSelecionado.value = dados.endereco;
  metodoPagamento.value = dados.metodoPagamento;
}

function verificarEnderecoSelecionado() {
  if (!enderecoSelecionado.value) {
    alert('Por favor, selecione um endereço antes de confirmar o pedido.');
    return false;
  }
  return true;
}

async function confirmarPedido() {
  try {
    if (cart.value.length === 0) {
      alert('Seu carrinho está vazio.');
      return;
    }

    if (!verificarEnderecoSelecionado()) {
      return;
    }

    const orderData = {
      items: cart.value.map(item => ({
        product_id: item.product?.id,
        quantity: item.quantity,
        unit_price: parseFloat(item.product.price)
      })),
      address_id: enderecoSelecionado.value.id,
      payment_method: metodoPagamento.value,
      total_amount: total.value,
      shipping_cost: frete.value
    };

    const response = await createOrder(orderData);

    if (response) {
      cartStore.clearCart();
      etapaAtual.value = 4;
    }

  } catch (error) {
    alert('Erro ao finalizar o pedido.');
  }
}

function voltarParaHome() {
  router.push('/');
}
</script>

<style scoped>
.checkout-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #181828 0%, #23233a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 1.5rem;
  font-family: 'Inter', sans-serif;
}
.checkout-container {
  background: #1e1e2d;
  border-radius: 20px;
  box-shadow: 0 12px 40px rgba(0,255,225,0.10);
  border: 1.5px solid rgba(0,255,225,0.09);
  padding: 3rem 2.5rem;
  width: 100%;
  max-width: 900px;
  backdrop-filter: blur(8px);
  animation: slideIn 0.6s cubic-bezier(0.4,0.2,0.2,1);
}
.checkout-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2.7rem;
  padding-bottom: 1.6rem;
  border-bottom: 1px solid rgba(0,255,225,0.09);
}
.btn-back {
  background: linear-gradient(90deg, #00ffe1 0%, #8f5fe8 100%);
  color: #181828;
  border: none;
  border-radius: 30px;
  padding: 10px 22px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: filter 0.15s, box-shadow 0.20s;
  display: flex;
  align-items: center;
  gap: 9px;
  box-shadow: 0 2px 10px rgba(0,255,225,0.11);
}
.btn-back:hover {
  filter: brightness(1.07);
  box-shadow: 0 4px 18px rgba(0,255,225,0.18);
}
.checkout-title {
  color: #fff;
  font-weight: 800;
  font-size: 2.1rem;
  margin: 0;
  text-align: center;
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  background: linear-gradient(120deg, #15fbe3 0%, #8f5fe8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  letter-spacing: 0.03em;
}
.gradient-icon {
  font-size: 2.1rem;
  background: linear-gradient(120deg, #00ffe1 0%, #8f5fe8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
}
.checkout-content {
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
}
.checkout-main {
  animation: fadeIn 0.5s cubic-bezier(.4,.2,.2,1);
}

/* Steps (visualização) - se quiser customizar aqui */
.checkout-content ::v-deep .steps-indicator {
  margin-bottom: 1.7rem;
}

/* Animações */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
/* Responsividade */
@media (max-width: 900px) {
  .checkout-container {
    padding: 2rem 1rem;
    border-radius: 15px;
    max-width: 99vw;
  }
  .checkout-header {
    flex-direction: column;
    gap: 20px;
    text-align: center;
    padding-bottom: 1.2rem;
  }
  .checkout-title {
    font-size: 1.5rem;
  }
  .btn-back {
    align-self: flex-start;
    font-size: 14px;
    padding: 8px 17px;
  }
}
@media (max-width: 600px) {
  .checkout-page {
    padding: 0.7rem;
  }
  .checkout-container {
    padding: 1rem 0.3rem;
    border-radius: 10px;
  }
  .checkout-title {
    font-size: 1.05rem;
  }
}
</style>