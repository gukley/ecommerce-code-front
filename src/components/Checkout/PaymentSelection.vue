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
  background: linear-gradient(135deg, #1a2332 0%, #2d3748 100%);
  border-radius: 1rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  padding: 2rem;
  margin-bottom: 1.5rem;
  border: 1px solid #374151;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #374151;
}

.section-header i {
  font-size: 1.5rem;
  color: #64b5f6;
}

.section-header h4 {
  margin: 0;
  color: #f9fafb;
  font-weight: 700;
  font-size: 1.25rem;
  letter-spacing: 0.01em;
}

.payment-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.payment-option {
  display: flex;
  align-items: center;
  padding: 1rem;
  background: linear-gradient(135deg, #374151 0%, #4b5563 100%);
  border: 2px solid #374151;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #e8eaed;
  position: relative;
}

.payment-option:hover {
  transform: translateX(5px);
  border-color: #64b5f6;
}

.payment-option.selected {
  border-color: #64b5f6;
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
  box-shadow: 0 4px 20px rgba(100, 181, 246, 0.3);
}

.payment-option.selected::before {
  content: '✓';
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #64b5f6;
  font-size: 1.25rem;
  font-weight: bold;
}

.payment-radio {
  margin-right: 1rem;
  transform: scale(1.2);
  accent-color: #64b5f6;
}

.payment-text {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 600;
  font-size: 1rem;
}

.payment-text i {
  font-size: 1.25rem;
  color: #64b5f6;
}

.description {
  font-weight: 400;
  font-size: 0.875rem;
  color: #b0b7c3;
  margin-left: 0.5rem;
}
.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #374151;
}
.btn-primary,
.btn-secondary {
  border-radius: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}
.btn-primary {
  background: linear-gradient(135deg, #64b5f6 0%, #42a5f5 100%);
  color: white;
  border: none;
  padding: 0.875rem 1.5rem;
  font-size: 1rem;
  box-shadow: 0 4px 15px rgba(100, 181, 246, 0.3);
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(100, 181, 246, 0.4);
}
.btn-secondary {
  background: transparent;
  color: #64b5f6;
  border: 2px solid #64b5f6;
  padding: 0.875rem 1.5rem;
  font-size: 1rem;
}
.btn-secondary:hover {
  background: #64b5f6;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(100, 181, 246, 0.3);
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