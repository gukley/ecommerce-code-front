<template>
  <div class="address-modal-overlay">
    <div class="address-modal-card">
      <div class="address-modal-header">
        <h5 class="modal-title">
          {{ mode === 'edit' ? 'Editar Endereço' : 'Novo Endereço' }}
        </h5>
        <button type="button" class="close-btn" @click="$emit('close')">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>
      <div class="address-modal-body">
        <form @submit.prevent="handleSubmit" class="d-flex flex-column gap-3">
          <div class="row g-2">
            <div class="col-12 col-md-8">
              <input v-model="form.street" class="address-input" placeholder="Rua" required />
            </div>
            <div class="col-12 col-md-4">
              <input v-model="form.number" class="address-input" placeholder="Número" required />
            </div>
            <div class="col-12 col-md-6">
              <input v-model="form.city" class="address-input" placeholder="Cidade" required />
            </div>
            <div class="col-12 col-md-3">
              <input v-model="form.state" class="address-input" placeholder="Estado" required />
            </div>
            <div class="col-12 col-md-3">
              <input v-model="form.zip" class="address-input" placeholder="CEP" required />
            </div>
          </div>
          <div class="d-flex gap-2 justify-content-end mt-2">
            <button type="submit" class="address-btn primary">
              {{ mode === 'edit' ? 'Salvar' : 'Adicionar' }}
            </button>
            <button type="button" class="address-btn" @click="$emit('close')">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { createAddress, updateAddress } from '@/services/apiService.js'
const props = defineProps({
  mode: { type: String, default: 'add' },
  address: { type: Object, default: null }
})
const emit = defineEmits(['close', 'saved'])

const form = ref({
  street: '',
  number: '',
  city: '',
  state: '',
  zip: ''
})

watch(
  () => props.address,
  (val) => {
    if (props.mode === 'edit' && val) {
      form.value = { ...val }
    } else {
      form.value = { street: '', number: '', city: '', state: '', zip: '' }
    }
  },
  { immediate: true }
)

async function handleSubmit() {
  if (props.mode === 'add') await createAddress(form.value)
  else await updateAddress(props.address.id, form.value)
  emit('saved', { ...form.value })
  emit('close')
}
</script>

<style scoped>
.address-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1200;
  background: rgba(16,22,34,0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(2px);
}
.address-modal-card {
  background: rgba(24,30,42,0.97);
  border-radius: 20px;
  box-shadow: 0 8px 40px 0 #232e47cc, 0 1.5px 0 #50b8fe;
  min-width: 350px;
  max-width: 95vw;
  width: 420px;
  animation: modalIn 0.18s;
  overflow: hidden;
}
@keyframes modalIn {
  from { opacity: 0; transform: translateY(30px);}
  to { opacity: 1; transform: translateY(0);}
}
.address-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(90deg,#232e47 60%, #399bff 100%);
  padding: 18px 24px 14px 24px;
  border-bottom: 1.5px solid #232e47;
}
.address-modal-header .modal-title {
  color: #fff;
  font-weight: 700;
  font-size: 1.18rem;
  letter-spacing: 0.5px;
  margin: 0;
}
.close-btn {
  background: none;
  border: none;
  color: #fff;
  font-size: 1.2rem;
  opacity: 0.7;
  transition: opacity 0.15s;
  cursor: pointer;
}
.close-btn:hover { opacity: 1; }
.address-modal-body {
  padding: 28px 28px 22px 28px;
  background: transparent;
}
.address-input {
  width: 100%;
  border-radius: 12px;
  background: rgba(40,48,62,0.92);
  color: #eaf6ff;
  border: 1.5px solid #399bff;
  font-size: 1.08rem;
  padding: 12px 16px;
  margin-bottom: 0;
  transition: border 0.2s, background 0.2s;
  box-shadow: 0 2px 8px #232e4720;
}
.address-input:focus {
  border-color: #50b8fe;
  background: rgba(40,48,62,1);
  color: #fff;
  outline: none;
}
.address-btn {
  border-radius: 14px;
  font-weight: 600;
  font-size: 1rem;
  padding: 8px 22px;
  border: none;
  background: #232e47;
  color: #b8d8ff;
  transition: background 0.18s, color 0.18s;
  box-shadow: 0 2px 8px #232e4720;
  cursor: pointer;
}
.address-btn.primary {
  background: linear-gradient(90deg,#50b8fe 60%, #399bff 100%);
  color: #181e2a;
  font-weight: 700;
}
.address-btn.primary:hover {
  background: linear-gradient(90deg,#399bff 60%, #50b8fe 100%);
  color: #fff;
}
.address-btn:hover:not(.primary) {
  background: #399bff;
  color: #fff;
}
</style>