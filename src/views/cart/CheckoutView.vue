<template>
  <div class="checkout-page">
    <div class="checkout-container">
      <div class="checkout-header">
        <button @click="voltarParaHome" class="btn-back">
          <i class="bi bi-arrow-left"></i>
          Voltar para Home
        </button>
        <h1 class="checkout-title">Finalizar Pedido</h1>
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
import { ref, computed, watch } from 'vue';
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

// Estados para guardar os dados do formulário
const enderecoSelecionado = ref(null);
const metodoPagamento = ref(null);

// Usar os itens detalhados com dados do produto para exibir e calcular
const cart = computed(() => cartStore.detailedItems);

// Valor fixo do frete (pode futuramente ser calculado)
const frete = ref(15);

// Calcular total: soma quantidade * preço + frete
const total = computed(() => {
  return cart.value.reduce((sum, item) => {
    const price = item.product?.price || 0;
    return sum + price * item.quantity;
  }, 0) + frete.value;
});

cartStore.initCart();

// Função para coletar os dados do formulário (Etapa 1 e 2)
function handleDadosColetados(dados) {
  enderecoSelecionado.value = dados.endereco;
  metodoPagamento.value = dados.metodoPagamento; 
}

async function confirmarPedido() {
  try {
    // Adicione esta verificação para garantir que o carrinho não esteja vazio
    if (cart.value.length === 0) {
      alert('Seu carrinho está vazio. Adicione produtos antes de finalizar o pedido.');
      return; // Interrompe a execução da função
    }

    // 1. Coletar os dados para enviar à API
    const orderData = {
      items: cart.value.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: parseFloat(item.product.price)
      })),
      address_id: enderecoSelecionado.value?.id,
      payment_method: metodoPagamento.value,
      total_amount: total.value,
      shipping_cost: frete.value
    };

    console.log('Dados do pedido sendo enviados:', orderData);

    // 2. Chamar a API para criar o pedido
    const response = await createOrder(orderData);

    // 3. Lidar com a resposta
    if (response) {
      console.log('Pedido criado com sucesso:', response);
      cartStore.clearCart();
      etapaAtual.value = 4;
    }

  } catch (error) {
    console.error('Erro ao criar o pedido:', error);
    alert('Ocorreu um erro ao finalizar o pedido. Tente novamente.');
  }
}

function voltarParaHome() {
  router.push('/');
}

watch(cart, (newVal) => {
});
</script>

<style scoped>
.checkout-page {
  min-height: 100vh;
  background: #12121c; 
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 1.5rem;
  font-family: 'Inter', sans-serif;
}
.checkout-container {
  background: #1e1e2d;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 3rem;
  width: 100%;
  max-width: 900px;
  backdrop-filter: blur(8px);
  animation: slideIn 0.6s ease-out;
}
.checkout-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}
.btn-back {
  background: transparent;
  color: #a0a0a0;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}
.btn-back:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
  border-color: #ffffff;
}
.checkout-title {
  color: #ffffff;
  font-weight: 600;
  font-size: 28px;
  margin: 0;
  text-align: center;
  flex: 1;
}
.checkout-content {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}
.checkout-main {
  animation: fadeIn 0.5s ease-out;
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
@media (max-width: 768px) {
  .checkout-page {
    padding: 1rem;
  }
  .checkout-container {
    padding: 2rem 1.5rem;
    border-radius: 12px;
  }
  .checkout-header {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
  .checkout-title {
    font-size: 24px;
  }
  .btn-back {
    align-self: flex-start;
  }
}
</style>