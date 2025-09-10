<template>
  <div class="address-modal-backdrop">
    <div class="address-modal-card clean">
      <div class="address-modal-header d-flex justify-content-between align-items-center mb-3">
        <h5 class="modal-title">
          <i class="bi bi-geo-alt text-tech me-2"></i>
          {{ address?.id ? 'Editar Endereço' : 'Novo Endereço' }}
        </h5>
        <button type="button" class="btn-close" @click="$emit('close')"></button>
      </div>
      <form @submit.prevent="handleSubmit">
        <div class="row g-3">
          <div class="col-md-6">
            <label class="form-label" for="addressStreet">Rua</label>
            <input v-model="form.street" id="addressStreet" type="text" class="form-control clean-input" required />
          </div>
          <div class="col-md-3">
            <label class="form-label" for="addressNumber">Número</label>
            <input v-model="form.number" id="addressNumber" type="text" class="form-control clean-input" required />
          </div>
          <div class="col-md-3">
            <label class="form-label" for="addressZip">CEP</label>
            <input v-model="form.zip" id="addressZip" type="text" class="form-control clean-input" required maxlength="9" />
          </div>
          <div class="col-md-6">
            <label class="form-label" for="addressCity">Cidade</label>
            <input v-model="form.city" id="addressCity" type="text" class="form-control clean-input" required />
          </div>
          <div class="col-md-6">
            <label class="form-label" for="addressState">Estado</label>
            <input v-model="form.state" id="addressState" type="text" class="form-control clean-input" required maxlength="2" />
          </div>
          <div class="col-12">
            <label class="form-label" for="addressComplement">Complemento</label>
            <input v-model="form.complement" id="addressComplement" type="text" class="form-control clean-input" />
          </div>
        </div>
        <div class="d-flex justify-content-end gap-2 mt-4">
          <button type="submit" class="btn btn-tech px-4">
            <i :class="form.id ? 'bi bi-save' : 'bi bi-plus-circle'"></i>
            {{ form.id ? 'Salvar' : 'Adicionar' }}
          </button>
          <button type="button" class="btn btn-outline-secondary px-4" @click="$emit('close')">
            <i class="bi bi-x-circle"></i> Cancelar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  address: Object
})

const emit = defineEmits(['close', 'saved'])

const form = ref({
  id: null,
  street: '',
  number: '',
  zip: '',
  city: '',
  state: '',
  complement: ''
})

watch(() => props.address, (addr) => {
  if (addr) {
    form.value = { ...addr }
  } else {
    form.value = {
      id: null,
      street: '',
      number: '',
      zip: '',
      city: '',
      state: '',
      complement: ''
    }
  }
}, { immediate: true })

function handleSubmit() {
  emit('saved', { ...form.value })
  emit('close')
}
</script>

<style scoped>
.address-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(24,30,42,0.18);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(2px);
}
.address-modal-card.clean {
  background: #fff;
  border-radius: 1.2rem;
  box-shadow: 0 8px 32px #232e4720;
  border: none;
  padding: 2.2rem 2rem 2rem 2rem;
  min-width: 350px;
  max-width: 480px;
  width: 100%;
  color: #232e47;
  animation: modalIn 0.18s;
}
@keyframes modalIn {
  from { opacity: 0; transform: translateY(30px);}
  to { opacity: 1; transform: translateY(0);}
}
.address-modal-header {
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 1rem;
  margin-bottom: 1.2rem;
}
.text-tech {
  color: #50b8fe;
}
.clean-input {
  background: #f8f9fa;
  color: #232e47;
  border: 1.5px solid #e5e7eb;
  border-radius: 10px;
  padding: 0.7rem 1rem;
  font-size: 1.05rem;
  box-shadow: 0 2px 8px #232e4710;
  transition: border 0.2s, background 0.2s;
}
.clean-input:focus {
  border-color: #50b8fe;
  background: #fff;
  color: #232e47;
  outline: none;
}
.btn-tech {
  background: linear-gradient(90deg,#50b8fe 60%, #399bff 100%);
  color: #fff;
  border: none;
  font-weight: 600;
  border-radius: 10px;
  box-shadow: 0 2px 8px #50b8fe20;
  transition: background 0.18s, color 0.18s, box-shadow 0.18s;
}
.btn-tech:hover {
  background: linear-gradient(90deg,#399bff 60%, #50b8fe 100%);
  color: #fff;
  box-shadow: 0 4px 18px #50b8fe40;
}
.btn-outline-secondary {
  background: transparent;
  color: #232e47;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-weight: 500;
  transition: background 0.18s, color 0.18s;
}
.btn-outline-secondary:hover {
  background: #e5e7eb;
  color: #232e47;
}
@media (max-width: 600px) {
  .address-modal-card.clean {
    padding: 1.2rem 0.4rem 1rem 0.4rem;
    min-width: 0;
    max-width: 99vw;
  }
  .address-modal-header {
    padding-bottom: 0.7rem;
  }
}
</style>