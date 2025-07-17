<template>
    <div class="d-flex justify-content-between align-items-center mb-3 p-3 bg-dark rounded text-light">
      <div class="flex-grow-1">
        <strong>{{ item.product.name }}</strong><br />
        Preço unitário: R$ {{ item.product.price.toFixed(2) }}
      </div>
  
      <input
        type="number"
        class="form-control mx-3"
        style="width: 80px"
        v-model.number="qty"
        min="1"
        @change="emitUpdate"
      />
  
      <div>
        <button class="btn btn-outline-danger btn-sm" @click="$emit('remove', item.product.id)" title="Remover do carrinho">
          <i class="bi bi-trash"></i>
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue'
  
  const props = defineProps({
    item: Object
  })
  
  const qty = ref(props.item.quantity)
  
  watch(() => props.item.quantity, (newQty) => {
    qty.value = newQty
  })
  
  const emit = defineEmits(['update', 'remove'])
  
  const emitUpdate = () => {
    if (qty.value < 1) qty.value = 1
    emit('update', props.item.product.id, qty.value)
  }
  </script>
  