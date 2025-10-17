<template>
  <div class="modal-backdrop">
    <div class="modal-content">
      <h3>{{ address?.id ? 'Editar Endereço' : 'Novo Endereço' }}</h3>
      <form @submit.prevent="save">
        <input v-model="form.street" placeholder="Rua" required />
        <input v-model.number="form.number" placeholder="Número" required type="number" />
        <input v-model="form.zip" placeholder="CEP (8 dígitos)" required maxlength="8" minlength="8" />
        <input v-model="form.bairro" placeholder="Bairro" required />
        <input v-model="form.city" placeholder="Cidade" required />
        <input v-model="form.state" placeholder="Estado" required />
        <input v-model="form.country" placeholder="País" required />
        <div class="d-flex gap-2 mt-3">
          <button type="submit" class="btn btn-success">Salvar</button>
          <button type="button" class="btn btn-secondary" @click="$emit('close')">Cancelar</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
const props = defineProps({ address: Object })
const emit = defineEmits(['close', 'saved'])

const form = ref({
  street: '',
  number: '',
  zip: '',
  bairro: '',
  city: '',
  state: '',
  country: ''
})

watch(() => props.address, (addr) => {
  if (addr) {
    form.value = { ...addr }
  } else {
    form.value = {
      street: '', number: '', zip: '', bairro: '', city: '', state: '', country: ''
    }
  }
}, { immediate: true })

function save() {
  emit('saved', { ...form.value, id: props.address?.id })
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
  background: rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; z-index: 9999;
}
.modal-content {
  background: #fff; border-radius: 1rem; padding: 2rem; min-width: 320px; max-width: 400px;
  box-shadow: 0 8px 32px #232e4780;
}
input { margin-bottom: 0.7rem; width: 100%; padding: 0.6rem; border-radius: 8px; border: 1px solid #b8d8ff; }
</style>