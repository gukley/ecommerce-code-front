<template>
  <div class="p-4 dashboard-container">
    <div v-if="isLoading" class="loading-overlay">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Carregando...</span>
      </div>
    </div>
    <div v-else>
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="fw-bold text-primary-ggtech">Gestão de Cupons</h2>
        <button class="btn btn-success-ggtech btn-gradient" @click="openCreateForm">
          <i class="bi bi-plus-lg me-2"></i> Adicionar Novo Cupom
        </button>
      </div>
      <p class="text-light-ggtech">Gerencie e visualize todos os cupons de desconto da sua loja.</p>

      <!-- Mensagem de sucesso quando o token está presente -->
      <div class="mb-4 d-flex align-items-center">
        <div class="alert alert-success d-flex align-items-center me-3" role="alert">
          <i class="bi bi-check-circle-fill me-2"></i>
          Token de autenticação processado com sucesso.
        </div>
      </div>

      <!-- Exibe a mensagem de erro se existir -->
      <div v-if="errorMessage" class="alert alert-danger" role="alert">
        <strong>Erro:</strong> {{ errorMessage }}
      </div>

      <!-- Componente da lista de cupons com botões de ação -->
      <CouponList 
        :coupons="coupons"
        @edit-coupon="handleEditCoupon"
        @delete-coupon="handleDeleteCoupon"
      />
    </div>

    <!-- Modal para adicionar ou editar um cupom -->
    <CouponForm 
      v-if="showCouponForm" 
      :coupon="couponToEdit"
      @submit-coupon="handleFormSubmitted" 
      @cancel="closeForm" 
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import CouponList from '@/components/Admin/CouponList.vue';
import CouponForm from '@/components/Admin/CouponForm.vue';
import { getCoupons, createCoupon, updateCoupon, deleteCoupon } from '@/services/apiService';

// Estado da aplicação
const coupons = ref([]);
const isLoading = ref(true);
const showCouponForm = ref(false);
const couponToEdit = ref(null);
const errorMessage = ref('');

// Ações do ciclo de vida
onMounted(() => {
  // Apenas chama a função de carregar cupons na inicialização
  fetchCoupons();
});

// Funções para gerenciamento de dados
const fetchCoupons = async () => {
  isLoading.value = true;
  try {
    const data = await getCoupons();
    coupons.value = data.map(item => ({
        ...item,
        is_percentage: item.discount_percentage > 0,
        expiration_date: item.end_date,
    }));
  } catch (error) {
    console.error("Erro ao carregar cupons:", error);
    errorMessage.value = error.message;
    coupons.value = [];
  } finally {
    isLoading.value = false;
  }
};

const handleFormSubmitted = async (formData) => {
  isLoading.value = true;
  errorMessage.value = '';
  try {
    let result;
    const dataToSend = {
      ...formData,
      discount_percentage: Number(formData.value) || 0,
    };
    
    if (dataToSend.id) {
      result = await updateCoupon(dataToSend.id, dataToSend);
      const index = coupons.value.findIndex(c => c.id === result.id);
      if (index !== -1) {
        coupons.value[index] = {
            ...result,
            is_percentage: result.discount_percentage > 0,
            expiration_date: result.end_date,
        };
      }
    } else {
      result = await createCoupon(dataToSend);
      coupons.value.push({
          ...result,
          is_percentage: result.discount_percentage > 0,
          expiration_date: result.end_date,
      });
    }
    closeForm();
  } catch (error) {
    console.error("Falha ao salvar o cupom:", error);
    errorMessage.value = error.message;
  } finally {
    isLoading.value = false;
  }
};

const handleDeleteCoupon = async (coupon) => {
  if (confirm(`Tem certeza que deseja excluir o cupom "${coupon.code}"?`)) {
    try {
      isLoading.value = true;
      errorMessage.value = '';
      await deleteCoupon(coupon.id);
      coupons.value = coupons.value.filter(c => c.id !== coupon.id);
    } catch (error) {
      console.error("Falha ao excluir o cupom:", error);
      errorMessage.value = error.message;
    } finally {
      isLoading.value = false;
    }
  }
};

const openCreateForm = () => {
  couponToEdit.value = null;
  showCouponForm.value = true;
  errorMessage.value = '';
};

const handleEditCoupon = (coupon) => {
  couponToEdit.value = coupon;
  showCouponForm.value = true;
  errorMessage.value = '';
};

const closeForm = () => {
  showCouponForm.value = false;
  couponToEdit.value = null;
  errorMessage.value = '';
};
</script>

<style scoped>
/* Adicionando os estilos para o botão de gradiente */
.btn-gradient {
  background: linear-gradient(135deg, var(--admin-accent-primary) 0%, var(--admin-accent-secondary) 100%);
  color: #fff !important;
  border: none;
  border-radius: 50px;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  box-shadow: 0 4px 16px rgba(0, 255, 225, 0.2);
  transition: all 0.3s ease;
}

.btn-gradient:hover {
  background: linear-gradient(135deg, var(--admin-accent-secondary) 0%, var(--admin-accent-primary) 100%);
  color: #fff !important;
  box-shadow: 0 8px 25px rgba(0, 255, 225, 0.3);
  transform: translateY(-2px);
}

.btn-gradient:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* Os outros estilos já existentes... */
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
.dashboard-container {
  background: var(--admin-bg-primary);
  color: var(--admin-text-primary);
  min-height: 100vh;
}
.text-primary-ggtech {
  color: var(--admin-accent-primary) !important;
}
.text-light-ggtech {
  color: var(--admin-text-muted) !important;
}
.loading-overlay {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: var(--admin-bg-primary);
}
.spinner-border {
  color: var(--admin-accent-primary) !important;
}
.alert-danger {
  background-color: var(--admin-danger);
  color: var(--admin-text-primary);
  border: 1px solid var(--admin-danger);
}
.alert-success {
    background-color: #28a745;
    color: #fff;
    border: 1px solid #28a745;
}
</style>
