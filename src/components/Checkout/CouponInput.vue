<template>
  <div class="coupon-input mb-3">
    <label class="form-label" for="coupon-code">Cupom de desconto</label>
    <div class="input-group">
      <input
        id="coupon-code"
        v-model="couponCode"
        type="text"
        class="form-control coupon-input-box"
        placeholder="Digite o código do cupom"
        :disabled="loading"
        @keyup.enter="applyCoupon"
      />
      <button
        class="btn btn-coupon"
        :disabled="loading || !couponCode"
        @click="applyCoupon"
      >
        Aplicar
      </button>
    </div>
    <div v-if="error" class="text-danger mt-1">{{ error }}</div>
    <div v-if="success" class="text-success mt-1">Cupom aplicado: {{ appliedCoupon.code }} ({{ appliedCoupon.discount_percentage }}%)</div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useCouponStore } from '@/stores/couponStore';

const emit = defineEmits(['cupom-aplicado']);

const couponStore = useCouponStore();
const couponCode = ref('');
const loading = ref(false);
const error = ref('');
const success = ref(false);
const appliedCoupon = ref(null);

async function applyCoupon() {
  error.value = '';
  success.value = false;
  appliedCoupon.value = null;
  if (!couponCode.value) return;
  loading.value = true;
  try {
    // Busca todos os cupons se ainda não buscou
    if (!couponStore.coupons.length) {
      await couponStore.fetchAllCoupons();
    }
    // Procura o cupom pelo código (case-insensitive)
    const found = couponStore.coupons.find(
      c => c.code.toUpperCase() === couponCode.value.trim().toUpperCase()
    );
    if (!found) {
      error.value = 'Cupom não encontrado.';
      return;
    }
    // Verifica validade
    const now = new Date();
    if (found.start_date && new Date(found.start_date) > now) {
      error.value = 'Este cupom ainda não está ativo.';
      return;
    }
    if (found.end_date && new Date(found.end_date) < now) {
      error.value = 'Este cupom está expirado.';
      return;
    }
    appliedCoupon.value = found;
    success.value = true;
    emit('cupom-aplicado', found);
  } catch (e) {
    error.value = 'Erro ao validar cupom.';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.coupon-input {
  background: #ffffff;
  border-radius: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
  border: 1.5px solid #e5e7eb;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.form-label {
  color: #6a5ae0;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.input-group {
  display: flex;
  gap: 0.5rem;
}

.coupon-input-box {
  border-radius: 1.5rem 0 0 1.5rem;
  border: 1.5px solid #e5e7eb;
  background: #f9fafb;
  color: #232e47;
  font-size: 1rem;
  padding: 0.75rem 1rem;
  transition: border 0.2s, background 0.2s;
}

.coupon-input-box:focus {
  border-color: #6a5ae0;
  background: #ffffff;
  box-shadow: 0 0 0 2px rgba(106, 90, 224, 0.3);
}

.btn-coupon {
  border-radius: 0 1.5rem 1.5rem 0;
  background: linear-gradient(90deg, #4a90e2, #6a5ae0);
  color: #ffffff;
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 700;
  transition: background 0.2s, box-shadow 0.2s;
}

.btn-coupon:hover {
  background: linear-gradient(90deg, #6a5ae0, #4a90e2);
  box-shadow: 0 4px 16px rgba(106, 90, 224, 0.2);
}

.text-danger {
  color: #ff6b6b;
}

.text-success {
  color: #43e97b;
}
</style>

