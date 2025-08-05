<template>
    <div class="form-section payment-section">
      <div class="section-header">
        <i class="bi bi-credit-card"></i>
        <h4>Método de Pagamento</h4>
      </div>
  
      <div class="payment-options">
        <label class="payment-option">
          <input type="radio" v-model="selectedPaymentMethod" value="pix" class="payment-radio" />
          <span class="payment-text">
            <i class="bi bi-qr-code"></i>
            Pix
          </span>
        </label>
        <label class="payment-option">
          <input type="radio" v-model="selectedPaymentMethod" value="boleto" class="payment-radio" />
          <span class="payment-text">
            <i class="bi bi-file-earmark-text"></i>
            Boleto
          </span>
        </label>
        <label class="payment-option">
          <input type="radio" v-model="selectedPaymentMethod" value="cartao" class="payment-radio" />
          <span class="payment-text">
            <i class="bi bi-credit-card"></i>
            Cartão de Crédito
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
  
  // Estado local para o método de pagamento, sincronizado com a prop modelValue
  const selectedPaymentMethod = ref(props.modelValue || 'pix');
  
  // Observa mudanças na prop modelValue para manter o estado interno sincronizado
  watch(() => props.modelValue, (newVal) => {
    if (newVal !== selectedPaymentMethod.value) {
      selectedPaymentMethod.value = newVal;
    }
  });
  
  // Observa mudanças no estado interno e emite para o pai
  watch(selectedPaymentMethod, (newVal) => {
    emit('update:modelValue', newVal);
  });
  
  // Função para confirmar o pagamento e emitir os dados
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
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
    padding: 2.5rem 2rem;
    margin-bottom: 2rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  .section-header {
    display: flex;
    align-items: center;
    gap: 16px;
    padding-bottom: 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }
  .section-header i {
    font-size: 24px;
    color: #007bff; 
  }
  .section-header h4 {
    margin: 0;
    color: #ffffff;
    font-weight: 600;
    font-size: 20px;
  }
  .payment-section {
    animation: fadeIn 0.5s ease-out;
  }
  .payment-options {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .payment-option {
    position: relative;
    display: flex;
    align-items: center;
    padding: 16px 20px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  .payment-option:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.2);
  }
  .payment-radio {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
  }
  .payment-radio:checked + .payment-text {
    color: #007bff; 
  }
  .payment-radio:checked + .payment-text::before {
    content: '';
    position: absolute;
    top: 50%;
    right: 20px;
    transform: translateY(-50%);
    width: 18px;
    height: 18px;
    background: #007bff;
    border-radius: 50%;
    transition: all 0.2s ease;
  }
  .payment-radio:checked + .payment-text::after {
    content: '✓';
    position: absolute;
    top: 50%;
    right: 22px;
    transform: translateY(-50%);
    color: #fff;
    font-weight: bold;
    font-size: 12px;
  }
  .payment-text {
    display: flex;
    align-items: center;
    gap: 12px;
    color: #ffffff;
    font-size: 16px;
    font-weight: 500;
    transition: color 0.2s ease;
    width: 100%;
  }
  .payment-text i {
    font-size: 20px;
    color: #a0a0a0;
    transition: color 0.2s ease;
  }
  .payment-radio:checked + .payment-text i {
    color: #007bff;
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
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .btn-primary {
    background: linear-gradient(145deg, #007bff, #0056b3);
    color: #fff;
    border: none;
    padding: 14px 28px;
    font-size: 16px;
    box-shadow: 0 4px 15px rgba(0, 123, 255, 0.3);
  }
  .btn-primary:hover {
    background: linear-gradient(145deg, #0056b3, #007bff);
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(0, 123, 255, 0.4);
  }
  .btn-secondary {
    background: transparent;
    color: #007bff;
    border: 1px solid #007bff;
    padding: 12px 24px;
    font-size: 15px;
  }
  .btn-secondary:hover {
    background: rgba(0, 123, 255, 0.1);
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
  }
  </style>