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
          <div class="main-card glass-card shadow-lg p-4 mb-4 rounded-4">
            <CheckoutSteps :etapa="etapaAtual <= 3 ? etapaAtual : 3" />
            <CheckoutForm
              v-if="etapaAtual <= 2"
              :etapa="etapaAtual"
              @etapaChange="etapaAtual = $event"
              @dadosColetados="handleDadosColetados"
              @pedidoCriado="pedidoCriado = $event"
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
              :pedido-criado="pedidoCriado"
            />
            <ConfirmationSuccess
              v-if="etapaAtual === 4"
              @voltar="voltarParaHome"
            />
          </div>
        </div>
        <!-- Coluna direita: Resumo do carrinho e cupom -->
        <div class="col-lg-5 col-12 d-flex flex-column align-items-center">
          <div class="side-panel glass-card shadow-lg">
            <!-- Campo de CEP e botão de calcular frete -->
            <div class="cep-frete-box mb-3">
              <label for="cepInput" class="form-label fw-bold">Calcule o frete pelo CEP</label>
              <div class="input-group">
                <input
                  id="cepInput"
                  v-model="cep"
                  type="text"
                  class="form-control"
                  placeholder="Digite seu CEP"
                  maxlength="9"
                  autocomplete="postal-code"
                />
                <button class="btn btn-outline-info" type="button" @click="calcularFretePorCep(cep)" :disabled="freteCalculando">
                  <span v-if="freteCalculando" class="spinner-border spinner-border-sm"></span>
                  <span v-else>Calcular</span>
                </button>
              </div>
              <div v-if="freteErro" class="text-danger small mt-1">{{ freteErro }}</div>
              <div v-if="freteCalculando" class="text-muted small mt-1">Calculando frete...</div>
              <div v-else-if="frete > 0" class="text-success small mt-1">Frete: R$ {{ frete.toFixed(2) }}</div>
              <div v-else-if="frete === 0 && cep" class="text-success small mt-1">Frete grátis para sua região!</div>
            </div>
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
import axios from 'axios';
import { getAddressByCep } from '@/services/apiService'


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

const frete = ref(0); // Inicializa como zero
const cep = ref('');
const freteCalculando = ref(false);
const freteErro = ref('');

// Função para buscar o CEP e calcular o frete
async function calcularFretePorCep(cepInput) {
  freteCalculando.value = true
  freteErro.value = ''
  frete.value = 0

  try {
    const data = await getAddressByCep(cepInput.replace(/\D/g, ''))

    // Exemplo simples de cálculo de frete baseado na UF
    const uf = data.uf
    if (['SP', 'RJ', 'MG', 'ES'].includes(uf)) {
      frete.value = 0
    } else if (['AM', 'PA', 'MA', 'PI', 'CE', 'RN', 'PB', 'PE', 'AL', 'SE', 'BA', 'AP', 'RR', 'RO', 'TO'].includes(uf)) {
      frete.value = 25
    } else {
      frete.value = 15
    }

  } catch (error) {
    freteErro.value = 'CEP inválido ou não encontrado.'
    console.error('Erro ao buscar CEP:', error)
  } finally {
    freteCalculando.value = false
  }
}


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
const pedidoCriado = ref(false);

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
    // Se o pedido já foi criado (via pagamento com cartão), apenas avança para confirmação
    if (pedidoCriado.value) {
      await cartStore.clearCart();
      toast.success('Pedido realizado com sucesso! Você será redirecionado em instantes.');
      etapaAtual.value = 4;
      setTimeout(() => {
        voltarParaHome();
      }, 4000);
      return;
    }

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
      pedidoCriado.value = true;
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
  background: linear-gradient(135deg, #f8fafc 0%, #e9f1ff 50%, #f3f4fa 100%) !important;
  min-height: 100vh;
  color: #23233a !important;
  font-family: 'Inter', 'Poppins', Arial, sans-serif;
}

/* Cartão principal e painel lateral */
.glass-card,
.side-panel {
  background: #fff !important;
  border-radius: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
  border: 1.5px solid #e5e7eb;
  padding: 2.2rem 2rem 2rem 2rem;
  margin-bottom: 2rem;
  transition: box-shadow 0.2s, border 0.2s, transform 0.2s;
}

.glass-card:focus-within, .glass-card:hover,
.side-panel:focus-within, .side-panel:hover {
  box-shadow: 0 12px 40px rgba(106, 90, 224, 0.15);
  border-color: #6a5ae0;
  transform: translateY(-2px);
}

.main-card {
  min-height: 650px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: none;
  border-radius: 1.5rem;
  box-shadow: none;
  border: none;
}

.side-panel {
  width: 100%;
  max-width: 440px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 1.5rem;
  background: #fff;
  border-radius: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
  border: 1.5px solid #e5e7eb;
  padding: 2rem 1.5rem;
}

.coupon-panel {
  margin-top: 1.5rem;
  padding: 0;
  background: none;
}

.rounded-4 {
  border-radius: 1.5rem !important;
}
.shadow-sm, .shadow-lg {
  box-shadow: 0 8px 32px rgba(44, 62, 80, 0.18) !important;
}

/* Botão voltar */
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
  background: #fff !important;
  color: #6a5ae0 !important;
  border: 2px solid #6a5ae0 !important;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(106, 90, 224, 0.1);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.btn-back:hover {
  background: linear-gradient(90deg, #4a90e2, #6a5ae0) !important;
  color: #fff !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(106, 90, 224, 0.3);
}

/* CEP e frete */
.cep-frete-box {
  background: #f9fafb;
  border-radius: 1.1rem;
  padding: 1.2rem 1rem 1rem 1rem;
  box-shadow: 0 2px 12px rgba(106, 90, 224, 0.1);
  border: 1.5px solid #e5e7eb;
  margin-bottom: 1.5rem;
}
.cep-frete-box label {
  color: #6a5ae0;
  font-weight: 700;
  font-size: 1.08rem;
  margin-bottom: 0.5rem;
}
.input-group .form-control {
  border-radius: 1.5rem 0 0 1.5rem;
  border: 1.5px solid #e5e7eb;
  background: #fff;
  color: #23233a;
  font-size: 1rem;
  padding: 0.7rem 1.1rem;
  box-shadow: 0 2px 8px #7c3aed10;
  transition: border 0.2s, background 0.2s;
}
.input-group .form-control:focus {
  border-color: #6a5ae0;
  background: #f9fafb;
  outline: none;
}
.input-group .btn {
  border-radius: 0 1.5rem 1.5rem 0;
  background: linear-gradient(90deg, #4a90e2 0%, #6a5ae0 100%);
  color: #fff;
  font-weight: 700;
  border: none;
  transition: background 0.18s, box-shadow 0.18s, transform 0.18s;
  padding: 0.5em 1.2em;
  box-shadow: 0 2px 8px rgba(106, 90, 224, 0.1);
}
.input-group .btn:hover {
  background: linear-gradient(90deg, #6a5ae0 0%, #4a90e2 100%);
  transform: translateY(-2px) scale(1.04);
  box-shadow: 0 4px 18px rgba(106, 90, 224, 0.3);
}

/* Resumo do pedido */
.cart-summary-box {
  background: #ffffff; /* Fundo branco */
  border-radius: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06); /* Sombra leve */
  border: 1.5px solid #e5e7eb; /* Borda cinza clara */
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}
.cart-summary-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #4a90e2; /* Azul principal */
  margin-bottom: 1rem;
}
.cart-summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e5e7eb; /* Linha divisória */
  font-size: 1rem;
  color: #232e47; /* Texto escuro */
}
.cart-summary-item:last-child {
  border-bottom: none;
}
.cart-summary-item .label {
  font-weight: 600;
}
.cart-summary-item .value {
  font-weight: 700;
}
.cart-summary-total {
  font-size: 1.3rem;
  font-weight: 800;
  color: #00c9a7; /* Verde-água */
  margin-top: 1rem;
  text-align: right;
}
.cart-summary-total .label {
  font-size: 1.2rem;
}
.cart-summary-total .value {
  font-size: 1.4rem;
}
.btn-apply-coupon {
  background: linear-gradient(90deg, #4a90e2, #6a5ae0); /* Gradiente azul-roxo */
  color: #ffffff; /* Texto branco */
  border: none;
  border-radius: 1rem;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  font-weight: 700;
  transition: background 0.2s, box-shadow 0.2s;
  margin-top: 1rem;
  width: 100%;
}
.btn-apply-coupon:hover {
  background: linear-gradient(90deg, #6a5ae0, #4a90e2); /* Gradiente invertido */
  box-shadow: 0 4px 16px rgba(106, 90, 224, 0.2); /* Sombra ao passar o mouse */
}

/* Inputs cupom e CEP */
.cart-input {
  background: #fff;
  color: #232e47;
  border: 1.5px solid #e5e7eb;
  border-radius: 1.5rem;
  font-size: 1rem;
  box-shadow: 0 2px 8px #4f46e510;
  transition: border 0.2s, background 0.2s;
  padding: 0.7rem 1.1rem;
}
.cart-input:focus {
  border-color: #9333ea;
  background: #f9fafb;
  color: #232e47;
  outline: none;
}

/* Botões cupom/frete */
.btn-coupon,
.btn-frete {
  background: linear-gradient(90deg, #4f46e5 0%, #9333ea 100%);
  color: #fff;
  border: none;
  border-radius: 1.5rem;
  font-weight: 700;
  transition: background 0.18s, box-shadow 0.18s, transform 0.18s;
  padding: 0.5em 1.2em;
  box-shadow: 0 2px 8px #9333ea10;
}
.btn-coupon:hover,
.btn-frete:hover {
  background: linear-gradient(90deg, #9333ea 0%, #4f46e5 100%);
  transform: translateY(-2px) scale(1.04);
  box-shadow: 0 4px 18px #9333ea30;
}

/* Botão principal */
.btn-main-action {
  background: linear-gradient(90deg, #4f46e5 0%, #9333ea 100%);
  color: #fff;
  font-size: 1.1rem;
  border-radius: 2rem;
  padding: 0.85rem 1.5rem;
  font-weight: 700;
  border: none;
  box-shadow: 0 0 15px #9333ea10;
  transition: all 0.3s ease;
}
.btn-main-action:hover {
  transform: scale(1.03);
  background: linear-gradient(90deg, #9333ea 0%, #4f46e5 100%);
  color: #fff;
  box-shadow: 0 0 20px #9333ea30;
}

/* Botão secundário */
.btn-outline-secondary {
  background: #fff;
  color: #4f46e5;
  border: 1.5px solid #e5e7eb;
  border-radius: 2rem;
  font-weight: 600;
  transition: background 0.18s, color 0.18s, border 0.18s;
}
.btn-outline-secondary:hover {
  background: #ede9fe;
  color: #9333ea;
  border-color: #9333ea;
}

/* Responsividade */
@media (max-width: 991px) {
  .checkout-ggtech .row {
    flex-direction: column;
  }
  .side-panel {
    max-width: 100vw;
    margin: 0;
    padding: 1.2rem 0.5rem;
  }
  .glass-card {
    padding: 1.2rem 0.7rem;
  }
}
@media (max-width: 600px) {
  .main-card {
    padding: 1.2rem 0.5rem !important;
    min-height: 0;
  }
  .side-panel {
    padding: 0.7rem 0.2rem;
  }
  .checkout-back-btn {
    margin-bottom: 0.7rem;
  }
  .btn-back {
    padding: 0.5rem 1rem;
    font-size: 0.95rem;
  }
  .glass-card {
    padding: 0.7rem 0.2rem;
  }
  .cart-summary-title {
    font-size: 1rem;
    padding-left: 0.7rem;
  }
  .cart-summary-title::before {
    width: 4px;
    height: 1.2em;
    left: 0;
    top: 0.25rem;
  }
  .cart-summary-total {
    font-size: 1.1rem;
  }
}

/* Ajustes para tema */
.cart-summary-label {
  color: #4f46e5;
}
.cart-summary-value {
  color: #4f46e5;
}
.cart-summary-total {
  color: #9333ea;
}
</style>