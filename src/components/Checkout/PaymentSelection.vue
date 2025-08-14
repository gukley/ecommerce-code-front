<template>
  <div class="form-section payment-section">
    <div class="section-header">
      <i class="bi bi-credit-card"></i>
      <h4>Método de Pagamento</h4>
    </div>
    <div class="payment-options">
      <label class="payment-option" :class="{ selected: selectedPaymentMethod === 'pix' }">
        <input type="radio" v-model="selectedPaymentMethod" value="pix" class="payment-radio" />
        <span class="payment-text">
          <i class="bi bi-qr-code"></i>
          Pix <span class="description">Transferência instantânea</span>
        </span>
      </label>
      <label class="payment-option" :class="{ selected: selectedPaymentMethod === 'boleto' }">
        <input type="radio" v-model="selectedPaymentMethod" value="boleto" class="payment-radio" />
        <span class="payment-text">
          <i class="bi bi-file-earmark-text"></i>
          Boleto <span class="description">Pagamento em até 2 dias úteis</span>
        </span>
      </label>
      <label class="payment-option" :class="{ selected: selectedPaymentMethod === 'cartao' }">
        <input type="radio" v-model="selectedPaymentMethod" value="cartao" class="payment-radio" />
        <span class="payment-text">
          <i class="bi bi-credit-card"></i>
          Cartão de Crédito <span class="description">Aprovação imediata</span>
        </span>
      </label>
    </div>
    <div class="form-actions">
      <button type="button" class="btn-secondary" @click="goBack">
        <i class="bi bi-arrow-left"></i>
        Voltar
      </button>
      <button type="button" class="btn-primary" @click="confirmPayment">
        <i class="bi bi-check-circle"></i>
        Revisar Pedido
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useToast } from 'vue-toastification';

const props = defineProps({
  modelValue: String
});

const emit = defineEmits(['update:modelValue', 'etapaChange', 'dadosColetados']);

const toast = useToast();

const selectedPaymentMethod = ref(props.modelValue || 'pix');

watch(() => props.modelValue, (newVal) => {
  if (newVal !== selectedPaymentMethod.value) {
    selectedPaymentMethod.value = newVal;
  }
});
watch(selectedPaymentMethod, (newVal) => {
  emit('update:modelValue', newVal);
});
function confirmPayment() {
  if (!selectedPaymentMethod.value) {
    toast.warning('Por favor, selecione um método de pagamento.');
    return;
  }
  emit('dadosColetados', { metodoPagamento: selectedPaymentMethod.value });
  emit('etapaChange', 3);
}
function goBack() {
  emit('etapaChange', 1);
}
</script>

<style scoped>
.form-section {
  background: #1e1e2d;
  border-radius: 14px;
  box-shadow: 0 12px 36px rgba(0, 255, 225, 0.08);
  padding: 2.5rem 2rem;
  margin-bottom: 2rem;
  border: 1.5px solid rgba(0,255,225,0.08);
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.section-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(0,255,225,0.07);
}
.section-header i {
  font-size: 26px;
  color: #00ffe1;
}
.section-header h4 {
  margin: 0;
  color: #fff;
  font-weight: 700;
  font-size: 21px;
}
.payment-section {
  animation: fadeIn 0.5s cubic-bezier(.4,.2,.2,1);
}
.payment-options {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.payment-option {
  position: relative;
  display: flex;
  align-items: center;
  padding: 18px 22px;
  background: linear-gradient(120deg, #23233a 60%, #2a2a3e 100%);
  border: 1.5px solid rgba(0,255,225,0.09);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(.4,.2,.2,1);
}
.payment-option:hover,
.payment-option.selected {
  background: rgba(0,255,225,0.09);
  border-color: #00ffe1;
  box-shadow: 0 4px 18px rgba(0,255,225,0.13);
}
.payment-radio {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}
.payment-radio:checked + .payment-text {
  color: #00ffe1;
}
.payment-text {
  display: flex;
  align-items: center;
  gap: 13px;
  color: #fff;
  font-size: 17px;
  font-weight: 600;
  transition: color 0.2s cubic-bezier(.4,.2,.2,1);
  width: 100%;
  position: relative;
}
.payment-text i {
  font-size: 22px;
  color: #8f5fe8;
  transition: color 0.2s;
  filter: drop-shadow(0 0 7px #8f5fe8);
}
.payment-radio:checked + .payment-text i {
  color: #00ffe1;
  filter: drop-shadow(0 0 8px #00ffe1);
}
.payment-option.selected .payment-text i {
  color: #00ffe1;
  filter: drop-shadow(0 0 8px #00ffe1);
}
.description {
  font-size: 13px;
  color: #8fd6fb;
  font-weight: 500;
  margin-left: 12px;
  background: rgba(0,255,225,0.07);
  border-radius: 8px;
  padding: 2px 12px;
  letter-spacing: 0.01em;
}
.form-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 16px;
  margin-top: 8px;
}
.btn-primary,
.btn-secondary {
  border-radius: 50px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(.4,.2,.2,1);
  display: flex;
  align-items: center;
  gap: 8px;
}
.btn-primary {
  background: linear-gradient(145deg, #00ffe1 0%, #8f5fe8 100%);
  color: #181828;
  border: none;
  padding: 14px 28px;
  font-size: 17px;
  box-shadow: 0 4px 15px rgba(0,255,225,0.13);
}
.btn-primary:hover {
  background: linear-gradient(145deg, #8f5fe8 0%, #00ffe1 100%);
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(0,255,225,0.22);
}
.btn-secondary {
  background: transparent;
  color: #00ffe1;
  border: 1.5px solid #00ffe1;
  padding: 12px 24px;
  font-size: 16px;
}
.btn-secondary:hover {
  background: rgba(0,255,225,0.09);
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
@media (max-width: 768px) {
  .form-section {
    padding: 2rem 1.25rem;
  }
  .form-actions {
    flex-direction: column;
    gap: 12px;
  }
  .btn-primary,
  .btn-secondary {
    width: 100%;
    justify-content: center;
    padding: 14px 24px;
  }
  .section-header h4 {
    font-size: 18px;
  }
  .payment-option {
    padding: 13px 10px;
  }
}
</style>