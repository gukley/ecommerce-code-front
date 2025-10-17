<template>
  <div class="coupon-input-modern mb-3">
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
        class="btn btn-coupon-modern"
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
.coupon-input-modern {
  background: #fff;
  border-radius: 1.1rem;
  padding: 1.2rem 1rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 12px #7c3aed10;
  border: 1.5px solid #e5e7eb;
}
.form-label {
  color: #7c3aed;
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
  background: #fff;
  color: #23233a;
  font-size: 1rem;
  padding: 0.7rem 1.1rem;
  box-shadow: 0 2px 8px #7c3aed10;
  transition: border 0.2s, background 0.2s;
}
.coupon-input-box:focus {
  border-color: #7c3aed;
  background: #f9fafb;
  outline: none;
}
.btn-coupon-modern {
  border-radius: 0 1.5rem 1.5rem 0;
  background: linear-gradient(90deg, #4f46e5 0%, #9333ea 100%);
  color: #fff;
  font-weight: 700;
  border: none;
  transition: background 0.18s, box-shadow 0.18s, transform 0.18s;
  padding: 0.5em 1.2em;
  box-shadow: 0 2px 8px #9333ea10;
}
.btn-coupon-modern:hover {
  background: linear-gradient(90deg, #9333ea 0%, #4f46e5 100%);
  transform: translateY(-2px) scale(1.04);
  box-shadow: 0 4px 18px #9333ea30;
}
.text-danger {
  color: #ff6b6b;
}
.text-success {
  color: #43e97b;
}
</style>

