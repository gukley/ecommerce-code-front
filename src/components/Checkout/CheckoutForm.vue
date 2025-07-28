<template>
  <div>
    <!-- Etapa 1: Endereço -->
    <div>
      <h4 class="mb-3">Endereço de Entrega</h4>
      <div v-if="enderecos.length > 0 && !modoNovoEndereco">
        <div class="mb-3">
          <label class="form-label mb-2">Selecione um endereço salvo:</label>
          <div v-for="end in enderecos" :key="end.id" class="form-check mb-2">
            <input class="form-check-input" type="radio" :id="'endereco-'+end.id" :value="end.id" v-model="enderecoSelecionado">
            <label class="form-check-label" :for="'endereco-'+end.id">
              <strong>{{ end.street }}</strong>, {{ end.number }}, {{ end.city }}/{{ end.state }} - CEP: {{ end.zip }}<span v-if="end.country">, {{ end.country }}</span>
            </label>
          </div>
        </div>
        <button class="btn btn-outline-secondary mb-3" @click="modoNovoEndereco = true">Cadastrar novo endereço</button>
      </div>
      <form v-if="modoNovoEndereco || enderecos.length === 0" @submit.prevent="finalizarPedido">
        <div class="mb-3">
          <label class="form-label">Rua</label>
          <input type="text" class="form-control" v-model="form.street" required />
        </div>
        <div class="row">
          <div class="col-md-6 mb-3">
            <label class="form-label">Número</label>
            <input type="number" class="form-control" v-model.number="form.number" required />
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label">Cidade</label>
            <input type="text" class="form-control" v-model="form.city" required />
          </div>
        </div>
        <div class="mb-3">
          <label class="form-label">Estado</label>
          <input type="text" class="form-control" v-model="form.state" required />
        </div>
        <div class="mb-3">
          <label class="form-label">País</label>
          <input type="text" class="form-control" v-model="form.country" required />
        </div>
        <div class="mb-3">
          <label class="form-label">CEP</label>
          <input type="text" class="form-control" v-model="form.zip" required />
        </div>
        <button type="button" v-if="enderecos.length > 0" class="btn btn-outline-secondary mb-3" @click="modoNovoEndereco = false">Selecionar endereço salvo</button>
        <button type="submit" class="btn btn-main-action w-100">Finalizar Pedido</button>
      </form>
      <button v-else class="btn btn-main-action w-100 mt-3" @click="finalizarPedido">Finalizar Pedido</button>
    </div>
  </div>
</template>

<script setup> 
import { reactive, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cartStore';
import { useOrderStore } from '@/stores/orderStore';
import { createAddress, getAllAddresses } from '@/services/apiService';

const emit = defineEmits(['finalizado']);

const router = useRouter();
const cartStore = useCartStore();
const orderStore = useOrderStore();

const form = reactive({ 
  street: '',
  number: null,
  city: '',
  state: '',
  country: '',
  zip: '',
});

const enderecos = ref([]);
const enderecoSelecionado = ref(null);
const modoNovoEndereco = ref(false);

onMounted(async () => {
  try {
    enderecos.value = await getAllAddresses();
  } catch (e) {
  }
  if (enderecos.value.length > 0) {
    enderecoSelecionado.value = enderecos.value[0].id;
    modoNovoEndereco.value = false;
  } else {
    modoNovoEndereco.value = true;
  }
});

async function finalizarPedido() { 
  try { 
    let address_id = null;
    if (modoNovoEndereco.value) {
      // Cria o novo endereço
      const addressPayload = {
        street: form.street,
        number: form.number,
        city: form.city,
        state: form.state,
        country: form.country,
        zip: form.zip,
      };
      const address = await createAddress(addressPayload);
      address_id = address.id;
    } else {
      address_id = enderecoSelecionado.value;
    }
    // 2. Monta o payload do pedido
    const produtos = cartStore.items.map(item => ({
      product_id: item.product_id,
      quantity: item.quantity
    }));
    if (!produtos.length) {
      alert('O carrinho está vazio!');
      return;
    }
    const orderPayload = {
      address_id,
      produtos
    };
    await orderStore.createNewOrder(orderPayload);
    cartStore.clearCart();
    emit('finalizado');
  } catch (error) { 
    if (error.response && error.response.data && error.response.data.detail) {
      alert('Erro ao finalizar pedido: ' + JSON.stringify(error.response.data.detail, null, 2));
    }
  }
}
</script>

<style scoped>
.checkout-form-card {
  background: #23233a;
  border-radius: 1.2rem;
  box-shadow: 0 2px 16px rgba(0,0,0,0.08);
  padding: 2rem 2rem 1.5rem 2rem;
  margin-bottom: 2rem;
}
.form-label {
  color: #00ffe1;
  font-weight: 600;
  font-size: 1.08rem;
  letter-spacing: 0.2px;
}
.form-control {
  background: #18182a;
  color: #fff;
  border: 1.5px solid #00bcd4;
  border-radius: 0.7rem;
  font-size: 1.08rem;
  padding: 0.7rem 1.1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.form-control:focus {
  border-color: #00ffe1;
  box-shadow: 0 0 0 0.18rem rgba(0,255,225,0.10);
  background: #23233a;
  color: #fff;
}
.btn-main-action {
  background: linear-gradient(90deg, #007cf0, #00ffe1);
  color: #23243a;
  border: none;
  border-radius: 50px;
  font-size: 1.12rem;
  font-weight: 700;
  box-shadow: 0 4px 16px rgba(0,255,225,0.10);
  transition: all 0.3s ease;
  margin-top: 1.2rem;
}
.btn-main-action:hover {
  background: linear-gradient(90deg, #00ffe1, #007cf0);
  color: #18182a;
  box-shadow: 0 8px 25px rgba(0,255,225,0.18);
  transform: translateY(-2px);
}
h4 {
  color: #00ffe1;
  font-weight: 700;
  font-size: 1.35rem;
  letter-spacing: 0.2px;
  margin-bottom: 1.2rem;
}
.form-check-label {
  color: #fff !important;
  font-size: 1.08rem;
  font-weight: 500;
}
</style>