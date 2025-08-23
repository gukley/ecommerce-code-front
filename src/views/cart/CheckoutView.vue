<template>
  <div class="checkout-ggtech py-5">
    <div class="container">
      <!-- Botão de voltar no topo -->
      <div class="checkout-back-btn mb-3">
        <button class="btn btn-outline-primary btn-back" @click="voltarParaHome">
          <i class="bi bi-arrow-left"></i>
          Voltar
        </button>
      </div>
      <div class="row g-4 justify-content-center">
        <!-- Coluna esquerda: Etapas do checkout -->
        <div class="col-lg-7 col-12">
          <div class="bg-white rounded-4 shadow-sm p-4 mb-4 main-card">
            <CheckoutSteps :etapa="etapaAtual <= 3 ? etapaAtual : 3" />
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
              :endereco="enderecoSelecionado"
              :metodo-pagamento="metodoPagamento"
              @confirmarPedido="confirmarPedido"
              :applied-coupon="appliedCoupon"
              :desconto-cupom="descontoCupom"
            />
            <ConfirmationSuccess
              v-if="etapaAtual === 4"
              @voltar="voltarParaHome"
            />
          </div>
        </div>
        <!-- Coluna direita: Resumo do carrinho e cupom -->
        <div class="col-lg-5 col-12 d-flex flex-column align-items-center">
          <div class="side-panel">
            <CartSummary
              :cart="cart"
              :frete="frete"
              :total="total"
              :desconto-cupom="descontoCupom"
              :applied-coupon="appliedCoupon"
              @alterarQuantidade="alterarQuantidade"
            />
            <div class="coupon-panel mt-4 w-100">
              <CouponInput @cupom-aplicado="appliedCoupon = $event" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

import CheckoutSteps from '@/components/Checkout/CheckoutSteps.vue';
import CheckoutForm from '@/components/Checkout/CheckoutForm.vue';
import OrderReview from '@/components/Checkout/OrderReview.vue';
import ConfirmationSuccess from '@/components/Checkout/ConfirmationSuccess.vue';
import CartSummary from '@/components/Checkout/CartSummary.vue';
import CouponInput from '@/components/Checkout/CouponInput.vue';

import { useCartStore } from '@/stores/cartStore';
import { createOrder } from '@/services/apiService';

const etapaAtual = ref(1);
const router = useRouter();
const cartStore = useCartStore();
const toast = useToast();

const cart = computed(() => cartStore.detailedItems);

// Redireciona se o carrinho estiver vazio ao montar ou durante o fluxo
watch(
  cart,
  (newVal) => {
    if (!newVal || newVal.length === 0) {
      router.push('/');
    }
  },
  { immediate: true }
);

const frete = ref(15);
const appliedCoupon = ref(null);

// Novo: calcula desconto do cupom
const descontoCupom = computed(() => {
  if (!appliedCoupon.value || !appliedCoupon.value.discount_percentage) return 0;
  // Aplica desconto sobre o subtotal dos produtos (sem frete)
  const subtotal = cart.value.reduce((sum, item) => {
    const price = item.product?.price || 0;
    return sum + price * item.quantity;
  }, 0);
  return Math.round((subtotal * appliedCoupon.value.discount_percentage) / 100);
});

const total = computed(() =>
  cart.value.reduce((sum, item) => {
    const price = item.product?.price || 0;
    return sum + price * item.quantity;
  }, 0) + frete.value - descontoCupom.value
);

const enderecoSelecionado = ref(null);
const metodoPagamento = ref(null);

function handleDadosColetados(dados) {
  enderecoSelecionado.value = dados.endereco;
  metodoPagamento.value = dados.metodoPagamento;
}

// Garante que ao entrar na etapa 3, se não houver endereço, volta para etapa 1
watch(etapaAtual, (val) => {
  if (val === 3 && (!enderecoSelecionado.value || !enderecoSelecionado.value.id)) {
    etapaAtual.value = 1;
  }
});

function verificarEnderecoSelecionado() {
  // Verifica se o endereço está presente e tem ID
  if (!enderecoSelecionado.value || !enderecoSelecionado.value.id) {
    alert('Por favor, selecione um endereço antes de confirmar o pedido.');
    etapaAtual.value = 1;
    return false;
  }
  return true;
}

async function confirmarPedido() {
  try {
    // Sempre obtenha os itens do carrinho diretamente do store no momento do clique
    const carrinhoAtual = cartStore.detailedItems;
    if (!carrinhoAtual || carrinhoAtual.length === 0) {
      alert('Seu carrinho está vazio.');
      router.push('/');
      return;
    }

    if (!verificarEnderecoSelecionado()) {
      return;
    }

    // Garante que todos os itens possuem product_id e quantity válidos
    const items = carrinhoAtual
      .map(item => {
        const productId = item.product?.id ?? item.product_id;
        const unitPrice = item.product?.price ?? item.unit_price;
        if (productId && item.quantity) {
          return {
            product_id: productId,
            quantity: item.quantity,
            unit_price: Number(unitPrice)
          };
        }
        // Log para depuração
        console.warn('Item inválido no carrinho:', item);
        return null;
      })
      .filter(Boolean);

    // Log para depuração
    console.log('Itens do carrinho enviados para o pedido:', items);

    if (!items.length) {
      alert('Seu carrinho está vazio ou contém itens inválidos.');
      console.error('Carrinho detalhado:', carrinhoAtual);
      router.push('/');
      return;
    }

    const orderData = {
      items,
      address_id: enderecoSelecionado.value.id,
      payment_method: metodoPagamento.value,
      total_amount: Number(total.value),
      shipping_cost: Number(frete.value),
      coupon_id: appliedCoupon.value?.id ?? null // envia o id do cupom se houver
    };

    // Log do payload final para depuração
    console.log('Payload enviado para createOrder:', JSON.stringify(orderData, null, 2));

    const response = await createOrder(orderData);

    if (response) {
      // Só limpa o carrinho após o pedido ser criado com sucesso
      await cartStore.clearCart();
      toast.success('Pedido realizado com sucesso! Você será redirecionado em instantes.');
      etapaAtual.value = 4;
      // Redireciona automaticamente após 4 segundos
      setTimeout(() => {
        voltarParaHome();
      }, 4000);
    }

  } catch (error) {
    // Mostra o erro detalhado do backend
    let backendMsg = '';
    if (error?.response?.data) {
      backendMsg = JSON.stringify(error.response.data, null, 2);
    } else if (error?.message) {
      backendMsg = error.message;
    } else {
      backendMsg = String(error);
    }
    alert('Erro ao finalizar o pedido:\n' + backendMsg);
    console.error('Erro ao criar pedido:', error, '\nResposta detalhada:', backendMsg);
  }
}

function voltarParaHome() {
  router.push('/');
}

function alterarQuantidade({ productId, delta }) {
  cartStore.updateQuantity(productId, delta);
}
</script>

<style scoped>
.checkout-ggtech {
  background: #f7f9fb;
  min-height: 100vh;
}
.checkout-back-btn {
  display: flex;
  align-items: center;
  margin-bottom: 1.2rem;
}
.btn-back {
  font-weight: 600;
  border-radius: 50px;
  padding: 0.6rem 1.3rem;
  font-size: 1rem;
  background: #fff;
  color: #399bff;
  border: 2px solid #399bff;
  transition: all 0.2s;
  box-shadow: 0 2px 8px #399bff10;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.btn-back:hover {
  background: #399bff;
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px #399bff30;
}
.bg-white {
  background: #fff !important;
}
.rounded-4 {
  border-radius: 1.5rem !important;
}
.shadow-sm {
  box-shadow: 0 2px 16px rgba(44, 62, 80, 0.07) !important;
}
.main-card {
  min-height: 650px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.side-panel {
  width: 100%;
  max-width: 440px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0.5rem;
}
.coupon-panel {
  margin-top: 1.5rem;
  padding: 0;
  background: none;
}
@media (max-width: 991px) {
  .checkout-ggtech .row {
    flex-direction: column;
  }
  .side-panel {
    max-width: 100vw;
    margin: 0;
  }
}
@media (max-width: 600px) {
  .main-card {
    padding: 1.2rem 0.5rem !important;
    min-height: 0;
  }
  .side-panel {
    padding: 0;
  }
  .checkout-back-btn {
    margin-bottom: 0.7rem;
  }
  .btn-back {
    padding: 0.5rem 1rem;
    font-size: 0.95rem;
  }
}
</style>