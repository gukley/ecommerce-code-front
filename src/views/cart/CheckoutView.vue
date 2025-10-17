<template>
  <div :class="['checkout-ggtech', themeClass, 'py-5']">
    <div class="container">
      <!-- Botão de alternância de tema -->
      <div class="d-flex justify-content-end mb-3">
        <button class="btn btn-theme-toggle" @click="toggleTheme">
          <i :class="theme === 'dark' ? 'bi bi-brightness-high' : 'bi bi-moon-stars'"></i>
          {{ theme === 'dark' ? 'Light' : 'Dark' }}
        </button>
      </div>
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
import axios from 'axios'; // Adicione esta importação

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
  freteCalculando.value = true;
  freteErro.value = '';
  frete.value = 0;
  try {
    // Consulta o ViaCEP para validar o CEP
    const response = await axios.get(`https://viacep.com.br/ws/${cepInput.replace(/\D/g, '')}/json/`);
    if (response.data.erro) {
      freteErro.value = 'CEP inválido!';
      frete.value = 0;
      return;
    }
    // Exemplo de cálculo: frete grátis para Sudeste, R$ 25 para Norte/Nordeste, R$ 15 para Sul/Centro-Oeste
    const uf = response.data.uf;
    if (['SP', 'RJ', 'MG', 'ES'].includes(uf)) {
      frete.value = 0;
    } else if (['AM', 'PA', 'MA', 'PI', 'CE', 'RN', 'PB', 'PE', 'AL', 'SE', 'BA', 'AP', 'RR', 'RO', 'TO'].includes(uf)) {
      frete.value = 25;
    } else {
      frete.value = 15;
    }
  } catch (err) {
    freteErro.value = 'Erro ao consultar CEP.';
    frete.value = 0;
  } finally {
    freteCalculando.value = false;
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

const theme = ref(localStorage.getItem('checkout_theme') || 'dark')
const themeClass = computed(() => theme.value === 'light' ? 'theme-light-checkout' : 'theme-dark-checkout')

function toggleTheme() {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
  localStorage.setItem('checkout_theme', theme.value)
}

watch(theme, (val) => {
  localStorage.setItem('checkout_theme', val)
})
</script>

<style scoped>
.checkout-ggtech {
  background: linear-gradient(120deg, #10141a 0%, #181e2a 80%, #232e47 100%);
  min-height: 100vh;
}
.glass-card {
  background: rgba(24, 30, 42, 0.97);
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
  gap: 0.5rem;
  background: none;
  border-radius: 1.5rem;
  box-shadow: none;
  border: none;
}
.coupon-panel {
  margin-top: 1.5rem;
  padding: 0;
  background: none;
}
.bg-white {
  background: none !important;
}
.rounded-4 {
  border-radius: 1.5rem !important;
}
.shadow-sm, .shadow-lg {
  box-shadow: 0 8px 32px rgba(44, 62, 80, 0.18) !important;
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
  background: linear-gradient(90deg,#232e47 0%, #399bff 100%);
  color: #fff;
  border: 2px solid #399bff;
  transition: all 0.2s;
  box-shadow: 0 2px 8px #399bff10;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.btn-back:hover {
  background: linear-gradient(90deg,#399bff 0%, #232e47 100%);
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px #399bff30;
}

/* Botão de alternância de tema sempre visível */
.btn-theme-toggle {
  background: linear-gradient(90deg, #232e47 0%, #399bff 100%);
  color: #fff;
  border: 2px solid #399bff;
  border-radius: 50px;
  font-weight: 600;
  padding: 0.5rem 1.2rem;
  margin-bottom: 0.5rem;
  font-size: 1.08rem;
  transition: background 0.18s, color 0.18s;
  box-shadow: 0 2px 8px #399bff30;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.btn-theme-toggle:hover {
  background: linear-gradient(90deg,#399bff 0%, #232e47 100%);
  color: #fff;
  box-shadow: 0 4px 18px #399bff60;
}

/* Light Theme para Checkout */
.theme-light-checkout {
  background: #f6f7fb !important;
  color: #23233a !important;
}
.theme-light-checkout .glass-card,
.theme-light-checkout .main-card,
.theme-light-checkout .side-panel {
  background: #fff !important;
  color: #23233a !important;
  border-color: #cfd8dc !important;
  box-shadow: 0 8px 32px rgba(143, 95, 232, 0.06);
}
.theme-light-checkout .btn-back {
  background: #fff !important;
  color: #399bff !important;
  border-color: #399bff !important;
}
.theme-light-checkout .btn-back:hover {
  background: #399bff !important;
  color: #fff !important;
}
.theme-light-checkout .coupon-panel {
  background: #f6f7fb !important;
}
.theme-light-checkout .shadow-lg,
.theme-light-checkout .shadow-sm {
  box-shadow: 0 8px 32px rgba(143, 95, 232, 0.08) !important;
}
.theme-light-checkout .form-control,
.theme-light-checkout .form-select {
  background: #fff !important;
  color: #23233a !important;
  border-color: #cfd8dc !important;
}
.theme-light-checkout .form-control:focus,
.theme-light-checkout .form-select:focus {
  border-color: #399bff !important;
  box-shadow: 0 0 0 2px #399bff33 !important;
}
.theme-light-checkout .alert-info,
.theme-light-checkout .alert-dark {
  background: #e9eaf3 !important;
  color: #23233a !important;
  border-color: #cfd8dc !important;
}
.theme-light-checkout .btn-theme-toggle {
  background: #fff !important;
  color: #399bff !important;
  border: 1px solid #399bff !important;
  border-radius: 50px;
  font-weight: 600;
  padding: 0.5rem 1.2rem;
  margin-bottom: 0.5rem;
  transition: background 0.18s, color 0.18s;
}
.theme-light-checkout .btn-theme-toggle:hover {
  background: #399bff !important;
  color: #fff !important;
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
  .btn-theme-toggle {
    font-size: 1rem;
    padding: 0.4rem 1rem;
  }
}
.cep-frete-box {
  margin-bottom: 1.2rem;
}
.input-group .form-control {
  border-radius: 8px 0 0 8px;
}
.input-group .btn {
  border-radius: 0 8px 8px 0;
}
</style>