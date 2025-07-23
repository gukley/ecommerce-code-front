<template> 
    <div class="order-summary card shadow-sm p-4 bg-dark text-light"> 
        <h5 class="mb-4 text-primary">Resumo do Pedido</h5>

        <div class="d-flex justify-content-between mb-2" v-for="item in cart" :key="item.id"> 
            <span>{{ item.name }} (x{{ item.quantity }})</span>
            <span>R$ {{ (item.price * item.quantity).toFixed(2) }}</span>
        </div>

        <hr class="my-3" />

        <div class="d-flex justify-content-between"> 
            <strong>Subtotal:</strong>
            <span>R$ {{ subtotal.toFixed(2) }}</span>
        </div>
        <div class="f-flex justify-content-between"> 
            <strong>Frete:</strong>
            <span>R$ {{ frete.toFixed(2) }}</span>
        </div>
        <div class="d-flex justify-content-between fs-5 mt-3 border-top pt-3"> 
            <strong>Total:</strong>
            <strong class="text-success">R$ {{ total.toFixed(2) }}</strong>
        </div>
    </div>
</template>

<script setup> 
import { computed } from 'vue';
const props = defineProps({ 
    cart: Array,
    frete: Number,
    total: Number
});

const subtotal = computed(() => 
    props.cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
)
</script>

<style scoped> 
.order-summary {
  background: #23272f;
  border-radius: 1.2rem;
  box-shadow: 0 2px 16px rgba(0,0,0,0.10);
  border: 2px solid #00ffe1;
  font-family: 'Inter', sans-serif;
}
.order-summary h5, .order-summary strong.text-success {
  color: #00ffe1 !important;
}
</style>