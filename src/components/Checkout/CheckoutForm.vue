<template>
  <div>
    <!-- Etapa 1: Endereço -->
    <div>
      <h4 class="mb-3">Endereço de Entrega</h4>
      <form @submit.prevent="finalizarPedido">
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
        <button type="submit" class="btn btn-main-action w-100">Finalizar Pedido</button>
      </form>
    </div>
  </div>
</template>

<script setup> 
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cartStore';
import { useOrderStore } from '@/stores/orderStore';
import { createAddress } from '@/services/apiService';

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

async function finalizarPedido() { 
  try { 
    // 1. Cria o endereço e pega o id
    const addressPayload = {
      street: form.street,
      number: form.number,
      city: form.city,
      state: form.state,
      country: form.country,
      zip: form.zip,
    };
    console.log('Payload de endereço:', addressPayload);
    const address = await createAddress(addressPayload);
    const address_id = address.id;
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
    console.log('Payload do pedido:', orderPayload);
    await orderStore.createNewOrder(orderPayload);
    cartStore.clearCart();
    emit('finalizado');
  } catch (error) { 
    console.error('Erro ao finalizar pedido:', error, error.response?.data);
    if (error.response && error.response.data && error.response.data.detail) {
      alert('Erro ao finalizar pedido: ' + JSON.stringify(error.response.data.detail, null, 2));
    }
  }
}
</script>

<style scoped>
.checkout-form-card {
  background: #fff;
  border-radius: 1.2rem;
  box-shadow: 0 2px 16px rgba(0,0,0,0.08);
  padding: 2rem 2rem 1.5rem 2rem;
  margin-bottom: 2rem;
}
.form-label {
  color: #222b3a;
  font-weight: 500;
}
.form-control {
  background: #fff;
  color: #222b3a;
  border: 1.5px solid #d1d5db;
  border-radius: 0.7rem;
  font-size: 1.08rem;
  padding: 0.7rem 1.1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.form-control:focus {
  border-color: #007cf0;
  box-shadow: 0 0 0 0.18rem rgba(0,124,240,0.10);
  background: #fff;
  color: #222b3a;
}
.btn-main-action {
  background: #007cf0;
  color: #fff;
  border: none;
  border-radius: 50px;
  font-size: 1.12rem;
  font-weight: 600;
  box-shadow: 0 4px 16px rgba(0,124,240,0.10);
  transition: all 0.3s ease;
  margin-top: 1.2rem;
}
.btn-main-action:hover {
  background: #005fa3;
  color: #fff;
  box-shadow: 0 8px 25px rgba(0,124,240,0.18);
  transform: translateY(-2px);
}
</style>