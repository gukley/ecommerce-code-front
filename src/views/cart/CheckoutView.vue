<template>
  <div class="checkout-page bg-dark text-white min-vh-100 py-5">
    <div class="container">
      <!-- Barra de Progresso -->
      <div class="checkout-steps d-flex justify-content-center mb-5">
        <div class="step" :class="{ active: etapa >= 1 }"><span>1</span> Endereço</div>
        <div class="step" :class="{ active: etapa >= 2 }"><span>2</span> Pagamento</div>
        <div class="step" :class="{ active: etapa === 3 }"><span>3</span> Confirmação</div>
      </div>
      <div v-if="etapa === 1" class="row g-4 flex-lg-row-reverse">
        <!-- Resumo do Pedido -->
        <div class="col-lg-5">
          <OrderSummary :cartItems="cartItems" :totalPrice="totalPrice" :frete="frete" />
        </div>
        <!-- Formulário de Endereço -->
        <div class="col-lg-7">
          <div class="card bg-secondary shadow p-4 mb-4">
            <h4 class="mb-3">Endereço de Entrega</h4>
            <form @submit.prevent="validarEndereco">
              <div class="row g-3">
                <div class="col-12 col-md-6">
                  <label class="form-label">Nome Completo</label>
                  <input v-model="endereco.nome" :class="inputClass('nome')" type="text" class="form-control" required />
                  <div v-if="erros.nome" class="invalid-feedback d-block">{{ erros.nome }}</div>
                </div>
                <div class="col-12 col-md-6">
                  <label class="form-label">CEP</label>
                  <input v-model="endereco.cep" :class="inputClass('cep')" type="text" class="form-control" maxlength="9" @input="mascararCep" required />
                  <div v-if="erros.cep" class="invalid-feedback d-block">{{ erros.cep }}</div>
                </div>
                <div class="col-12 col-md-8">
                  <label class="form-label">Rua</label>
                  <input v-model="endereco.rua" :class="inputClass('rua')" type="text" class="form-control" required />
                  <div v-if="erros.rua" class="invalid-feedback d-block">{{ erros.rua }}</div>
                </div>
                <div class="col-6 col-md-2">
                  <label class="form-label">Número</label>
                  <input v-model="endereco.numero" :class="inputClass('numero')" type="text" class="form-control" required />
                  <div v-if="erros.numero" class="invalid-feedback d-block">{{ erros.numero }}</div>
                </div>
                <div class="col-6 col-md-2">
                  <label class="form-label">Comp.</label>
                  <input v-model="endereco.complemento" type="text" class="form-control" />
                </div>
                <div class="col-12 col-md-6">
                  <label class="form-label">Cidade</label>
                  <input v-model="endereco.cidade" :class="inputClass('cidade')" type="text" class="form-control" required />
                  <div v-if="erros.cidade" class="invalid-feedback d-block">{{ erros.cidade }}</div>
                </div>
                <div class="col-12 col-md-6">
                  <label class="form-label">Estado</label>
                  <input v-model="endereco.estado" :class="inputClass('estado')" type="text" class="form-control" required />
                  <div v-if="erros.estado" class="invalid-feedback d-block">{{ erros.estado }}</div>
                </div>
              </div>
              <div class="d-flex align-items-center gap-3 mt-4">
                <input v-model="cepFrete" type="text" class="form-control w-auto" maxlength="9" placeholder="Calcule o frete (CEP)" @input="mascararCepFrete" style="max-width: 180px;" />
                <button type="button" class="btn btn-outline-info" @click="calcularFrete">Calcular Frete</button>
                <span v-if="frete !== null" class="text-success ms-2">Frete: R$ {{ frete.toFixed(2) }}</span>
              </div>
              <div class="form-check mt-4">
                <input class="form-check-input" type="checkbox" v-model="salvarEndereco" id="salvarEndereco">
                <label class="form-check-label" for="salvarEndereco">
                  Salvar este endereço para próximas compras
                </label>
              </div>
              <button type="submit" class="btn btn-main-action w-100 mt-4">Avançar para Pagamento</button>
            </form>
          </div>
        </div>
      </div>
      <div v-else-if="etapa === 2" class="row g-4 flex-lg-row-reverse">
        <div class="col-lg-5">
          <OrderSummary :cartItems="cartItems" :totalPrice="totalPrice" :frete="frete" />
        </div>
        <div class="col-lg-7">
          <div class="card bg-secondary shadow p-4 mb-4">
            <h4 class="mb-3">Pagamento</h4>
            <form @submit.prevent="finalizarPedido">
              <div class="mb-3">
                <label class="form-label">Método de Pagamento</label>
                <select v-model="pagamento.metodo" class="form-select" required>
                  <option value="">Selecione...</option>
                  <option value="cartao">Cartão de Crédito</option>
                  <option value="pix">Pix</option>
                  <option value="boleto">Boleto</option>
                </select>
              </div>
              <div v-if="pagamento.metodo === 'cartao'">
                <div class="mb-3">
                  <label class="form-label">Número do Cartão</label>
                  <input v-model="pagamento.cartao" type="text" class="form-control" maxlength="19" placeholder="0000 0000 0000 0000" required />
                </div>
                <div class="row">
                  <div class="col-6 mb-3">
                    <label class="form-label">Validade</label>
                    <input v-model="pagamento.validade" type="text" class="form-control" maxlength="5" placeholder="MM/AA" required />
                  </div>
                  <div class="col-6 mb-3">
                    <label class="form-label">CVV</label>
                    <input v-model="pagamento.cvv" type="text" class="form-control" maxlength="4" placeholder="123" required />
                  </div>
                </div>
                <div class="mb-3">
                  <label class="form-label">Nome no Cartão</label>
                  <input v-model="pagamento.nome" type="text" class="form-control" required />
                </div>
              </div>
              <div v-if="pagamento.metodo === 'pix'" class="mb-3">
                <div class="alert alert-info">Chave Pix: <strong>ecommerce@ggtech.com</strong></div>
              </div>
              <div v-if="pagamento.metodo === 'boleto'" class="mb-3">
                <div class="alert alert-info">O boleto será gerado após finalizar o pedido.</div>
              </div>
              <button type="submit" class="btn btn-main-action w-100 mt-4">
                <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                Finalizar Pedido
              </button>
            </form>
          </div>
        </div>
      </div>
      <div v-else-if="etapa === 3">
        <div class="row justify-content-center">
          <div class="col-lg-7">
            <div class="card bg-success bg-opacity-75 shadow p-5 text-center">
              <i class="bi bi-check-circle display-1 mb-3"></i>
              <h2 class="fw-bold mb-3">Pedido realizado com sucesso!</h2>
              <p class="fs-5 mb-4">Seu pedido foi recebido e está sendo processado.<br>Você receberá atualizações por e-mail.</p>
              <button class="btn btn-main-action px-5" @click="router.push('/')">Voltar para Home</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useCartStore } from '@/stores/cartStore';
import { useToast } from 'vue-toastification';
import { createAddress, createOrder } from '@/services/apiService';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const toast = useToast(); // <-- ESSA LINHA É OBRIGATÓRIA

const cart = useCartStore();
const cartItems = computed(() => cart.detailedItems || []);
const totalPrice = computed(() => cart.totalPrice || 0);
const router = useRouter();
const authStore = useAuthStore();

const etapa = ref(1); // 1: endereço, 2: pagamento, 3: confirmação
const loading = ref(false);

const endereco = ref({
  nome: '', rua: '', numero: '', complemento: '', cidade: '', estado: '', cep: ''
});
const salvarEndereco = ref(false);
const frete = ref(null);
const cepFrete = ref('');
const erros = ref({});

const pagamento = ref({ metodo: '', cartao: '', validade: '', cvv: '', nome: '' });

function mascararCep() {
  let v = endereco.value.cep.replace(/\D/g, '');
  if (v.length > 5) v = v.slice(0,5) + '-' + v.slice(5,8);
  endereco.value.cep = v;
}
function mascararCepFrete() {
  let v = cepFrete.value.replace(/\D/g, '');
  if (v.length > 5) v = v.slice(0,5) + '-' + v.slice(5,8);
  cepFrete.value = v;
}

// Calcular frete automaticamente ao preencher o CEP do endereço
watch(() => endereco.value.cep, (novoCep) => {
  if (novoCep && novoCep.length === 9) {
    cepFrete.value = novoCep;
    calcularFrete();
  }
});

function calcularFrete() {
  if (!cepFrete.value || cepFrete.value.length < 9) {
    toast.warning('Digite um CEP válido para calcular o frete.');
    frete.value = null;
    return;
  }
  frete.value = Math.floor(Math.random() * 21) + 10;
  toast.success('Frete calculado!');
}
function inputClass(campo) {
  return erros.value[campo] ? 'is-invalid' : '';
}
function validarEndereco() {
  erros.value = {};
  if (!endereco.value.nome) erros.value.nome = 'Nome obrigatório';
  if (!endereco.value.cep || endereco.value.cep.length < 9) erros.value.cep = 'CEP inválido';
  if (!endereco.value.rua) erros.value.rua = 'Rua obrigatória';
  if (!endereco.value.numero) erros.value.numero = 'Número obrigatório';
  if (!endereco.value.cidade) erros.value.cidade = 'Cidade obrigatória';
  if (!endereco.value.estado) erros.value.estado = 'Estado obrigatório';
  if (frete.value === null) {
    toast.error('Calcule o frete antes de avançar!');
    return;
  }
  if (Object.keys(erros.value).length === 0 && frete.value !== null) {
    etapa.value = 2;
  }
}
async function finalizarPedido() {
  if (!authStore.user || !authStore.user.id) {
    toast.error('Usuário não autenticado. Faça login novamente.');
    loading.value = false;
    return;
  }
  if (!pagamento.value.metodo) {
    toast.error('Selecione um método de pagamento!');
    return;
  }
  // Validação extra para cartão
  if (pagamento.value.metodo === 'cartao') {
    if (!pagamento.value.cartao || pagamento.value.cartao.length < 16) {
      toast.error('Preencha o número do cartão corretamente!');
      return;
    }
    if (!pagamento.value.validade || pagamento.value.validade.length < 5) {
      toast.error('Preencha a validade do cartão!');
      return;
    }
    if (!pagamento.value.cvv || pagamento.value.cvv.length < 3) {
      toast.error('Preencha o CVV do cartão!');
      return;
    }
    if (!pagamento.value.nome) {
      toast.error('Preencha o nome no cartão!');
      return;
    }
  }
  loading.value = true;
  try {
    // 1. Cria o endereço
    const addressRes = await createAddress({
      name: endereco.value.nome,
      street: endereco.value.rua,
      number: endereco.value.numero,
      complement: endereco.value.complemento,
      city: endereco.value.cidade,
      state: endereco.value.estado,
      zip: endereco.value.cep,
      country: 'Brasil'
    });
    // 2. Cria o pedido no formato esperado
    const now = new Date().toISOString();
    await createOrder({
      address_id: addressRes.id,
      coupon_id: 0,
      order_date: now,
      status: 'PENDING',
      products: cartItems.value.map(item => ({
        name: item.product.name,
        price: item.product.price,
        stock: item.product.stock,
        category_id: item.product.category_id,
        image_path: item.product.image_path,
        description: item.product.description
      })),
      user_id: authStore.user.id
    });
    cart.clearCart();
    etapa.value = 3;
  } catch (e) {
    toast.error('Erro ao finalizar pedido: ' + (e?.response?.data?.message || e.message || 'Tente novamente.'));
    console.error('Erro ao finalizar pedido:', e);
  } finally {
    loading.value = false;
  }
}
</script>

<script>
// Componente de resumo do pedido para reuso
export default {
  components: {
    OrderSummary: {
      props: ['cartItems', 'totalPrice', 'frete'],
      template: `
        <div class='card bg-secondary shadow p-4 mb-4 sticky-lg-top order-summary-card'>
          <h4 class='mb-3'>Resumo do Pedido</h4>
          <ul class='list-group list-group-flush mb-3'>
            <li v-for='item in cartItems' :key='item.product.id' class='list-group-item bg-transparent text-white d-flex justify-content-between align-items-center'>
              <span>{{ item.product.name }} <small>x{{ item.quantity }}</small></span>
              <span>R$ {{ (item.product.price * item.quantity).toFixed(2) }}</span>
            </li>
          </ul>
          <div class='d-flex justify-content-between mb-2'>
            <span>Subtotal:</span>
            <span>R$ {{ totalPrice.toFixed(2) }}</span>
          </div>
          <div class='d-flex justify-content-between mb-2'>
            <span>Frete:</span>
            <span v-if='frete !== null'>R$ {{ frete.toFixed(2) }}</span>
            <span v-else class='text-muted'>Calcule o frete</span>
          </div>
          <hr />
          <div class='d-flex justify-content-between fw-bold fs-5'>
            <span>Total:</span>
            <span>R$ {{ (totalPrice + (frete || 0)).toFixed(2) }}</span>
          </div>
        </div>
      `
    }
  }
}
</script>

<style scoped>
.checkout-page {
  background: linear-gradient(135deg, #18182a 60%, #23233a 100%);
}
.card.bg-secondary {
  background: #23233a !important;
  border: 1.5px solid #8f5fe8;
  border-radius: 1.5rem;
}
.form-label {
  color: #8f5fe8;
  font-weight: 600;
}
.checkout-steps {
  gap: 2.5rem;
}
.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #b0b0c0;
  font-weight: 600;
  font-size: 1.1rem;
  position: relative;
}
.step.active {
  color: #8f5fe8;
}
.step span {
  display: inline-block;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #23233a;
  border: 2px solid #8f5fe8;
  color: #fff;
  font-size: 1.15rem;
  font-weight: 700;
  margin-bottom: 0.3rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.step:not(:last-child)::after {
  content: '';
  position: absolute;
  right: -38px;
  top: 16px;
  width: 32px;
  height: 3px;
  background: linear-gradient(90deg, #8f5fe8, #a362ff);
  border-radius: 2px;
  z-index: 0;
}
@media (max-width: 991.98px) {
  .order-summary-card {
    position: static !important;
    margin-bottom: 2rem;
  }
}
.is-invalid {
  border-color: #ff4d6d !important;
  box-shadow: 0 0 0 0.15rem rgba(255,77,109,0.15);
}
.btn-main-action {
  color: #fff !important;
  opacity: 1 !important;
  background: linear-gradient(90deg, #a362ff, #8f5fe8) !important;
  border: 2px solid #cbb6ff !important;
}
</style>
