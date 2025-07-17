<template>
    <div class="text-end mt-4 border-top pt-3">
      <h5>Total: R$ {{ total.toFixed(2) }} ({{ count }} itens)</h5>
      <button class="btn btn-outline-warning mt-2 me-2" @click="$emit('clear')">
        Limpar Carrinho
      </button>
      <button class="btn btn-primary mt-2">
        Finalizar Compra
      </button>
    </div>
  </template>
  
  <script setup>
  defineProps({
    total: Number,
    count: Number
  })
  
  defineEmits(['clear'])
  </script>
  