<template>
    <!-- Modal para o formulário de criação/edição de cupons -->
    <div class="modal d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.7);">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content admin-modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="couponModalLabel">
              {{ isEditing ? 'Editar Cupom' : 'Adicionar Novo Cupom' }}
            </h5>
            <button type="button" class="btn-close custom-btn-close" @click="$emit('cancel')"></button>
          </div>
          <div class="modal-body p-4">
            <form @submit.prevent="submitForm">
              <!-- Campo de código do cupom -->
              <div class="mb-3">
                <label for="coupon-code" class="form-label">Código do Cupom</label>
                <input type="text" class="form-control modern-input" id="coupon-code" v-model="form.code" required>
              </div>
              
              <!-- Tipo de Desconto -->
              <div class="mb-3">
                <label class="form-label">Tipo de Desconto</label>
                <div class="form-check">
                  <input class="form-check-input" type="radio" id="percentage" value="percentage" v-model="discountType">
                  <label class="form-check-label" for="percentage">Porcentagem (%)</label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="radio" id="fixed" value="fixed" v-model="discountType">
                  <label class="form-check-label" for="fixed">Valor Fixo (R$)</label>
                </div>
              </div>
  
              <!-- Valor do Desconto -->
              <div class="mb-3">
                <label for="coupon-value" class="form-label">Valor do Desconto</label>
                <input type="number" class="form-control modern-input" id="coupon-value" v-model.number="form.value" required min="0">
              </div>
  
              <!-- Data de Início e Fim -->
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="start-date" class="form-label">Data de Início</label>
                  <input type="date" class="form-control modern-input" id="start-date" v-model="form.start_date" required>
                </div>
                <div class="col-md-6 mb-3">
                  <label for="end-date" class="form-label">Data de Expiração</label>
                  <input type="date" class="form-control modern-input" id="end-date" v-model="form.end_date" required>
                </div>
              </div>
  
              <div class="d-flex justify-content-end gap-2 mt-4">
                <button type="button" class="btn btn-outline-secondary custom-btn-cancel" @click="$emit('cancel')">Cancelar</button>
                <button type="submit" class="btn btn-success custom-btn-save">{{ isEditing ? 'Salvar Alterações' : 'Salvar Cupom' }}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { reactive, ref, watch, onMounted } from 'vue';
  
  const props = defineProps({
    coupon: {
      type: Object,
      default: null,
    }
  });
  
  const emit = defineEmits(['submit-coupon', 'cancel']);
  
  const isEditing = ref(false);
  const discountType = ref('percentage');
  
  const form = reactive({
    code: '',
    value: null,
    is_percentage: true,
    start_date: '',
    end_date: '',
  });
  
  onMounted(() => {
    if (props.coupon) {
      isEditing.value = true;
      Object.assign(form, {
        ...props.coupon,
        start_date: props.coupon.start_date ? new Date(props.coupon.start_date).toISOString().split('T')[0] : '',
        end_date: props.coupon.expiration_date ? new Date(props.coupon.expiration_date).toISOString().split('T')[0] : '',
      });
      discountType.value = form.is_percentage ? 'percentage' : 'fixed';
    }
  });
  
  watch(discountType, (newType) => {
    form.is_percentage = newType === 'percentage';
  });
  
  const submitForm = () => {
    if (form.code && form.value !== null && form.start_date && form.end_date) {
      emit('submit-coupon', { ...form, id: props.coupon?.id });
    } else {
      console.error("Por favor, preencha todos os campos do formulário.");
    }
  };
  </script>
  
  <style scoped>
  :root {
    --admin-bg-primary: #0f0f23;
    --admin-bg-secondary: #181828;
    --admin-bg-tertiary: #202038;
    --admin-accent-primary: #00ffe1;
    --admin-accent-secondary: #8f5fe8;
    --admin-text-primary: #ffffff;
    --admin-text-secondary: rgba(255, 255, 255, 0.8);
    --admin-text-muted: rgba(255, 255, 255, 0.6);
    --admin-border-light: rgba(255, 255, 255, 0.1);
    --admin-shadow-light: rgba(0, 0, 0, 0.4);
    --admin-danger: #ff6b6b;
    --admin-border-medium: rgba(255, 255, 255, 0.2);
  }
  .admin-modal-content {
    background: var(--admin-bg-secondary);
    color: var(--admin-text-primary); 
    border-radius: 1.25rem;
    border: 1px solid var(--admin-border-light); 
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4); 
  }
  .modal-header {
    border-bottom: 1px solid var(--admin-border-light);
    background-color: var(--admin-bg-tertiary); 
    padding: 1.25rem 1.5rem; 
  }
  
  .modal-title {
    font-weight: 600;
    color: var(--admin-accent-primary);
    font-size: 1.4rem; 
  }
  .custom-btn-close {
    background: none; 
    border: none;
    color: var(--admin-text-muted); 
    font-size: 1.5rem; 
    cursor: pointer;
    transition: color 0.2s ease, transform 0.2s ease;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23e0e0e0'%3e%3cpath d='M.293.293a1 1 0 0 1 1.414 0L8 6.586 14.293.293a1 1 0 1 1 1.414 1.414L9.414 8l6.293 6.293a1 1 0 0 1-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 0 1-1.414-1.414L6.586 8 .293 1.707a1 1 0 0 1 0-1.414z'/%3e%3c/svg%3e");
    background-size: 1em; 
    background-repeat: no-repeat;
    background-position: center;
    opacity: 1; 
  }
  
  .custom-btn-close:hover {
    color: var(--admin-danger);
    transform: rotate(90deg);
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23ff6b6b'%3e%3cpath d='M.293.293a1 1 0 0 1 1.414 0L8 6.586 14.293.293a1 1 0 1 1 1.414 1.414L9.414 8l6.293 6.293a1 1 0 0 1-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 0 1-1.414-1.414L6.586 8 .293 1.707a1 1 0 0 1 0-1.414z'/%3e%3c/svg%3e");
  }
  .form-label {
    color: var(--admin-text-secondary);
    font-weight: 500;
    margin-bottom: 0.5rem; 
  }
  
  .modern-input {
    background: var(--admin-bg-primary); 
    color: var(--admin-text-primary); 
    border: 1px solid var(--admin-border-medium); 
    border-radius: 0.5rem;
    padding: 0.8rem 1rem;
    transition: border-color 0.3s, box-shadow 0.3s;
  }
  
  .modern-input::placeholder {
    color: var(--admin-text-muted);
  }
  
  .modern-input:focus {
    background: var(--admin-bg-primary);
    border-color: var(--admin-accent-primary); 
    box-shadow: 0 0 0 0.2rem rgba(0, 255, 225, 0.25);
    color: var(--admin-text-primary);
    outline: none;
  }
  
  .modal-footer {
    border-top: 1px solid var(--admin-border-light);
    padding: 1.25rem 1.5rem;
  }
  
  .text-muted-custom {
    color: var(--admin-text-muted);
    font-size: 0.85rem;
  }
  
  .text-link-custom {
    color: var(--admin-accent-primary);
    text-decoration: none;
    transition: color 0.2s ease;
  }
  
  .text-link-custom:hover {
    color: var(--admin-accent-secondary);
    text-decoration: underline;
  }
  .custom-btn-cancel { 
    background: transparent;
    color: var(--admin-text-secondary);
    border: 2px solid var(--admin-border-medium); 
    border-radius: 50px;
    font-weight: 600;
    padding: 0.75rem 1.5rem; 
    transition: all 0.3s ease;
  }
  
  .custom-btn-cancel:hover {
    background: var(--admin-bg-tertiary);
    color: var(--admin-text-primary); 
    border-color: var(--admin-accent-primary);
  }
  
  .custom-btn-save { 
    background: linear-gradient(135deg, var(--admin-accent-primary) 0%, var(--admin-accent-secondary) 100%); 
    color: #fff !important;
    border: none; 
    border-radius: 50px;
    font-weight: 600;
    padding: 0.75rem 1.5rem;
    box-shadow: 0 4px 16px rgba(0, 255, 225, 0.2);
    transition: all 0.3s ease;
  }
  .custom-btn-save:hover {
    background: linear-gradient(135deg, var(--admin-accent-secondary) 0%, var(--admin-accent-primary) 100%); 
    color: #fff !important;
    box-shadow: 0 8px 25px rgba(0, 255, 225, 0.3);
    transform: translateY(-2px); 
  }
  .custom-btn-save:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
  </style>
  