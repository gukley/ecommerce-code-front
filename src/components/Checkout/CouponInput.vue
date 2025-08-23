<template>
  <div class="coupon-input-container mb-3">
    <label class="form-label" for="coupon-code">Cupom de desconto</label>
    <div class="input-group">
      <input
        id="coupon-code"
        v-model="couponCode"
        type="text"
        class="form-control"
        placeholder="Digite o código do cupom"
        :disabled="loading"
        @keyup.enter="applyCoupon"
      />
      <button
        class="btn btn-primary"
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
.coupon-input-container {
  background: #181828;
  border-radius: 0.75rem;
  padding: 1.2rem 1rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 12px #00ffe120;
}
.form-label {
  color: #8fd6fb;
  font-weight: 600;
  margin-bottom: 0.5rem;
}
.input-group {
  display: flex;
  gap: 0.5rem;
}
.form-control {
  border-radius: 0.5rem;
  border: 1.5px solid #399bff40;
  background: #23233a;
  color: #fff;
  font-size: 1rem;
  padding: 0.7rem 1rem;
}
.btn-primary {
  background: linear-gradient(135deg, #399bff 0%, #42a5f5 100%);
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  padding: 0.7rem 1.2rem;
  transition: all 0.2s;
}
.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.text-danger {
  color: #ff6b6b;
}
.text-success {
  color: #43e97b;
}
</style>

