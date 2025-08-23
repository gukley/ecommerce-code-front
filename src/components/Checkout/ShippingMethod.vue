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

