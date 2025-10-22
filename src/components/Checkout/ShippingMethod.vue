<template>
  <div class="shipping-method mt-4">
    <h5 class="mb-3">Método de Entrega</h5>
    <div class="form-check mb-2">
      <input class="form-check-input" type="radio" id="normal" value="normal" v-model="selected" />
      <label class="form-check-label" for="normal">
        Normal (5-8 dias úteis) <span class="text-muted ms-2">R$ 15,00</span>
      </label>
    </div>
    <div class="form-check">
      <input class="form-check-input" type="radio" id="express" value="express" v-model="selected" />
      <label class="form-check-label" for="express">
        Expressa (2-3 dias úteis) <span class="text-muted ms-2">R$ 35,00</span>
      </label>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
const props = defineProps({ selectedMethod: String });
const emit = defineEmits(['update:shippingMethod']);
const selected = ref(props.selectedMethod || 'normal');
watch(selected, (val) => emit('update:shippingMethod', val));
</script>

<style scoped>
.shipping-method {
  background: #ffffff;
  border-radius: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
  border: 1.5px solid #e5e7eb;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  transition: box-shadow 0.2s, border 0.2s;
}

.shipping-method:hover {
  box-shadow: 0 12px 40px rgba(106, 90, 224, 0.2);
  border-color: #6a5ae0;
}

.shipping-option {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 1rem;
  background: #f9fafb;
  transition: border 0.2s, background 0.2s;
  cursor: pointer;
}

.shipping-option:hover {
  border-color: #6a5ae0;
  background: #f3f4fa;
}

.shipping-option.active {
  border-color: #4a90e2;
  background: linear-gradient(135deg, #4a90e2, #6a5ae0);
  color: #ffffff;
}

.shipping-option i {
  font-size: 1.5rem;
  color: #6a5ae0;
}

.shipping-option.active i {
  color: #ffffff;
}

.shipping-label {
  font-size: 1rem;
  font-weight: 600;
  color: #232e47;
}

.shipping-label.active {
  color: #ffffff;
}

.shipping-price {
  font-size: 1rem;
  font-weight: 700;
  color: #4a90e2;
}

.shipping-price.active {
  color: #ffffff;
}
</style>

