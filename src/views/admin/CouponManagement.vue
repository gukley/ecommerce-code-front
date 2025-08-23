<template>
  <div class="coupon-management">
    <div v-if="couponStore.loading" class="loading-overlay">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Carregando...</span>
      </div>
    </div>
    <div v-else>
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="fw-bold text-primary-ggtech">Gestão de Cupons</h2>
        <button class="btn btn-gradient-add" @click="openCreateForm">
          <i class="bi bi-plus-lg me-2"></i> Adicionar Novo Cupom
        </button>
      </div>
      <p class="text-light-ggtech">Gerencie e visualize todos os cupons de desconto da sua loja.</p>

      <!-- Estatísticas dos cupons -->
      <div class="row g-4 mb-4">
        <div class="col-lg-3 col-md-6">
          <div class="card p-3 shadow-sm h-100 metric-card">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="icon-container total-icon">
                  <i class="bi bi-ticket-perforated"></i>
                </div>
                <div>
                  <h5 class="card-title">Total de Cupons</h5>
                  <p class="card-text fs-4 fw-bold">{{ couponStore.totalCoupons }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-md-6">
          <div class="card p-3 shadow-sm h-100 metric-card">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="icon-container active-icon">
                  <i class="bi bi-check-circle"></i>
                </div>
                <div>
                  <h5 class="card-title">Cupons Ativos</h5>
                  <p class="card-text fs-4 fw-bold">{{ couponStore.activeCoupons.length }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-md-6">
          <div class="card p-3 shadow-sm h-100 metric-card">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="icon-container valid-icon">
                  <i class="bi bi-star"></i>
                </div>
                <div>
                  <h5 class="card-title">Cupons Válidos</h5>
                  <p class="card-text fs-4 fw-bold">{{ couponStore.validCoupons.length }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-md-6">
          <div class="card p-3 shadow-sm h-100 metric-card">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="icon-container expired-icon">
                  <i class="bi bi-clock-history"></i>
                </div>
                <div>
                  <h5 class="card-title">Cupons Expirados</h5>
                  <p class="card-text fs-4 fw-bold">{{ couponStore.expiredCoupons.length }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Exibe a mensagem de erro se existir -->
      <div v-if="couponStore.error" class="alert alert-danger mb-4" role="alert">
        <strong>Erro:</strong> {{ couponStore.error }}
      </div>

      <!-- Componente da lista de cupons com botões de ação -->
      <CouponList 
        :coupons="couponStore.coupons"
        :loading="couponStore.loading"
        @edit-coupon="handleEditCoupon"
        @delete-coupon="handleDeleteCoupon"
      />
    </div>

    <!-- Modal para adicionar ou editar um cupom -->
    <CouponForm 
      v-if="showCouponForm" 
      :coupon="couponToEdit"
      :loading="couponStore.loading"
      @submit-coupon="handleFormSubmitted" 
      @cancel="closeForm" 
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useCouponStore } from '@/stores/couponStore';
import CouponList from '@/components/Admin/CouponList.vue';
import CouponForm from '@/components/Admin/CouponForm.vue';

// Store
const couponStore = useCouponStore();

// Estado local
const showCouponForm = ref(false);
const couponToEdit = ref(null);

// Ações do ciclo de vida
onMounted(async () => {
  if (couponStore.shouldRefetch()) {
    await couponStore.fetchAllCoupons();
  }
});

// Funções para gerenciamento de dados
const handleFormSubmitted = async (formData) => {
  try {
    if (formData.id) {
      await couponStore.updateExistingCoupon(formData.id, formData);
    } else {
      await couponStore.createNewCoupon(formData);
    }
    closeForm();
  } catch (error) {
    console.error("Falha ao salvar o cupom:", error);
  }
};

const handleDeleteCoupon = async (coupon) => {
  if (confirm(`Tem certeza que deseja excluir o cupom "${coupon.code}"?`)) {
    try {
      await couponStore.deleteExistingCoupon(coupon.id);
    } catch (error) {
      console.error("Falha ao excluir o cupom:", error);
    }
  }
};

const openCreateForm = () => {
  couponToEdit.value = null;
  showCouponForm.value = true;
};

const handleEditCoupon = (coupon) => {
  couponToEdit.value = coupon;
  showCouponForm.value = true;
};

const closeForm = () => {
  showCouponForm.value = false;
  couponToEdit.value = null;
};
</script>

<style scoped>
.coupon-management {
  background-color: #0f1419;
  min-height: 100vh;
  color: #e8eaed;
  padding: 2rem 1rem;
  max-width: 1280px;
  margin: 0 auto;
  font-family: 'Inter', sans-serif;
}

.text-primary-ggtech {
  background: linear-gradient(90deg, #64b5f6 0%, #42a5f5 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 700;
  font-size: 2.2rem;
  letter-spacing: 0.02em;
}

.text-light-ggtech { 
  color: #b0b7c3; 
  font-weight: 400;
}

.btn-gradient-add {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-gradient-add:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
  color: white;
}

.metric-card {
  background: linear-gradient(135deg, #1a2332 0%, #2d3748 100%);
  border: 1px solid #374151;
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  color: #e8eaed;
  transition: all 0.3s ease;
  cursor: default;
  overflow: hidden;
}

.metric-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
  border-color: #4a5568;
}

.metric-card .card-title {
  color: #a0aec0;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.5rem;
}

.metric-card .card-text {
  color: #f7fafc;
  margin-bottom: 0;
}

.icon-container {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  flex-shrink: 0;
  font-size: 1.5rem;
  color: white;
}

.total-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.active-icon {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.valid-icon {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
}

.expired-icon {
  background: linear-gradient(135deg, #f56565 0%, #e53e3e 100%);
}

.loading-overlay {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
}

.spinner-border {
  color: #64b5f6;
}

.alert-danger {
  background-color: #1a202c;
  color: #f56565;
  border: 1px solid #f56565;
  border-radius: 0.5rem;
}

/* Responsividade */
@media (max-width: 768px) {
  .coupon-management {
    padding: 1rem 0.5rem;
  }
  
  .text-primary-ggtech {
    font-size: 1.8rem;
  }
  
  .btn-gradient-add {
    width: 100%;
    justify-content: center;
  }
  
  .icon-container {
    width: 50px;
    height: 50px;
    font-size: 1.2rem;
  }
  
  .metric-card .card-title {
    font-size: 0.8rem;
  }
  
  .metric-card .card-text {
    font-size: 1.2rem;
  }
}
</style>
