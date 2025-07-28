<template> 
  <div class="checkout-bg min-vh-100 py-5 d-flex align-items-center justify-content-center">
    <div class="checkout-card">
      <button @click="voltarParaHome" class="btn btn-outline-primary mb-3 d-flex align-items-center gap-2">
        <i class="bi bi-house"></i> Voltar para Home
      </button>
      <h2 class="checkout-title text-center fw-bold mb-4">Finalizar Pedido</h2>
      <CheckoutSteps :etapa="etapaAtual" />
      <CheckoutForm
        v-if="etapaAtual <= 2"
        :etapa="etapaAtual"
        @etapaChange="etapaAtual = $event"
        @finalizado="etapaAtual = 3"
      />
      <ConfirmationSuccess
        v-if="etapaAtual === 3"
        @voltar="voltarParaHome"
      />
    </div>
  </div>
</template>

<script setup> 
import { ref } from 'vue';
import CheckoutSteps from '@/components/Checkout/CheckoutSteps.vue';
import CheckoutForm from '@/components/Checkout/CheckoutForm.vue';
import ConfirmationSuccess from '@/components/Checkout/ConfirmationSuccess.vue';
import { useRouter } from 'vue-router';

const etapaAtual = ref(1);
const router = useRouter();

function voltarParaHome() { 
  router.push('/');
}
</script>

<style scoped>
.checkout-bg {
  background: linear-gradient(135deg, #18182a 60%, #23233a 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.checkout-card {
  background: #23233a;
  border-radius: 2rem;
  box-shadow: 0 8px 32px rgba(143, 95, 232, 0.10);
  border: 2px solid #00ffe1;
  padding: 2.7rem 2.2rem 2.2rem 2.2rem;
  width: 100%;
  max-width: 540px;
  min-width: 320px;
}
.checkout-title {
  color: #00ffe1;
  font-weight: 700;
  letter-spacing: 0.5px;
  font-size: 2.1rem;
}
</style>