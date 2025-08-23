<template>
  <div class="discount-modal-backdrop">
    <div class="discount-modal-card">
      <div class="discount-modal-header d-flex justify-content-between align-items-center mb-3">
        <h5 class="modal-title">
          <i class="bi bi-percent me-2 text-gradient"></i> Gerenciar Descontos
        </h5>
        <button type="button" class="btn-close" @click="$emit('close')"></button>
      </div>
      <div class="discount-modal-body">
        <form @submit.prevent="handleSubmit" class="mb-4">
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label text-gradient" for="discountProduct">
                <i class="bi bi-box-seam me-1"></i> Produto
              </label>
              <select v-model="form.product_id" id="discountProduct" class="form-select modern-input" required>
                <option value="" disabled>Selecione...</option>
                <option v-for="p in products" :key="p.id" :value="p.id">{{ p.name }}</option>
              </select>
            </div>
            <div class="col-md-6">
              <label class="form-label text-gradient" for="discountDesc">
                <i class="bi bi-chat-left-text me-1"></i> Descrição
              </label>
              <input v-model="form.description" id="discountDesc" type="text" class="form-control modern-input" required maxlength="120" />
            </div>
            <div class="col-md-4">
              <label class="form-label text-gradient" for="discountPercent">
                <i class="bi bi-percent me-1"></i> Percentual (%)
              </label>
              <input v-model.number="form.discount_percentage" id="discountPercent" type="number" min="0" max="100" step="0.01" class="form-control modern-input" required />
            </div>
            <div class="col-md-4">
              <label class="form-label text-gradient" for="discountStart">
                <i class="bi bi-calendar-event me-1"></i> Início
              </label>
              <input v-model="form.start_date" id="discountStart" type="datetime-local" class="form-control modern-input" required />
            </div>
            <div class="col-md-4">
              <label class="form-label text-gradient" for="discountEnd">
                <i class="bi bi-calendar-check me-1"></i> Fim
              </label>
              <input v-model="form.end_date" id="discountEnd" type="datetime-local" class="form-control modern-input" required />
            </div>
          </div>
          <div class="d-flex justify-content-end gap-2 mt-4">
            <button type="submit" class="btn btn-gradient-success px-4">
              <i :class="form.id ? 'bi bi-save' : 'bi bi-plus-circle'"></i>
              {{ form.id ? 'Salvar' : 'Criar' }}
            </button>
            <button type="button" class="btn btn-outline-light px-4" @click="resetForm">
              <i class="bi bi-x-circle"></i> Limpar
            </button>
          </div>
        </form>
        <hr class="divider" />
        <h6 class="mb-3 text-gradient"><i class="bi bi-list-check me-1"></i> Descontos Ativos</h6>
        <div class="table-responsive">
          <table class="table table-dark table-striped table-hover rounded-table">
            <thead>
              <tr>
                <th>Produto</th>
                <th>Descrição</th>
                <th>%</th>
                <th>Início</th>
                <th>Fim</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="d in discounts" :key="d.id">
                <td>
                  <span class="badge bg-gradient-product">{{ getProductName(d.product_id) }}</span>
                </td>
                <td>{{ d.description }}</td>
                <td>
                  <span class="badge bg-gradient-discount">{{ d.discount_percentage }}%</span>
                </td>
                <td>
                  <span class="badge bg-gradient-date">{{ formatDate(d.start_date) }}</span>
                </td>
                <td>
                  <span class="badge bg-gradient-date">{{ formatDate(d.end_date) }}</span>
                </td>
                <td>
                  <button class="btn btn-sm btn-gradient-info me-1" @click="editDiscount(d)" title="Editar">
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button class="btn btn-sm btn-gradient-danger" @click="deleteDiscountFn(d.id)" title="Excluir">
                    <i class="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
              <tr v-if="discounts.length === 0">
                <td colspan="6" class="text-center text-muted">Nenhum desconto ativo.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { createDiscount, updateDiscount, deleteDiscount } from '@/services/apiService'

const props = defineProps({
  products: Array,
  discounts: Array
})

const emit = defineEmits(['discount-saved', 'close'])

const form = ref({
  id: null,
  product_id: '',
  description: '',
  discount_percentage: 0,
  start_date: '',
  end_date: ''
})

function resetForm() {
  form.value = {
    id: null,
    product_id: '',
    description: '',
    discount_percentage: 0,
    start_date: '',
    end_date: ''
  }
}

function formatDate(dt) {
  if (!dt) return '-'
  const d = new Date(dt)
  return d.toLocaleString('pt-BR')
}

function getProductName(id) {
  const p = props.products.find(x => x.id === id)
  return p ? p.name : '-'
}

async function handleSubmit() {
  try {
    if (form.value.id) {
      await updateDiscount(form.value.id, form.value)
    } else {
      await createDiscount(form.value)
    }
    emit('discount-saved')
    resetForm()
  } catch (err) {
    alert('Erro ao salvar desconto')
  }
}

function editDiscount(d) {
  form.value = { ...d }
}

async function deleteDiscountFn(id) {
  if (confirm('Excluir desconto?')) {
    await deleteDiscount(id)
    emit('discount-saved')
    resetForm()
  }
}
</script>

<style scoped>
.discount-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(16,22,34,0.75);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(3px);
}
.discount-modal-card {
  background: linear-gradient(120deg, #181e2a 60%, #232e47 100%);
  border-radius: 24px;
  box-shadow: 0 8px 32px #232e4780, 0 1.5px 0 #50b8fe;
  border: 1.5px solid #232e47;
  padding: 2.2rem 1.5rem 1.5rem 1.5rem;
  min-width: 350px;
  max-width: 540px;
  width: 100%;
  color: #e8eaed;
  animation: modalIn 0.18s;
}
@keyframes modalIn {
  from { opacity: 0; transform: translateY(30px);}
  to { opacity: 1; transform: translateY(0);}
}
.discount-modal-header {
  border-bottom: 1.5px solid #232e47;
  padding-bottom: 1rem;
}
.discount-modal-body {
  padding-top: 1.2rem;
}
.text-gradient {
  background: linear-gradient(90deg, #00ffe1 10%, #8f5fe8 60%, #a362ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
  letter-spacing: 0.5px;
  font-size: 1.08rem;
}
.modern-input {
  background: rgba(24,30,42,0.92);
  color: #e8eaed;
  border: 1.5px solid #232e47;
  border-radius: 12px;
  padding: 0.7rem 1rem;
  font-size: 1.05rem;
  box-shadow: 0 2px 8px #232e4720;
  transition: border 0.2s, background 0.2s;
}
.modern-input:focus {
  border-color: #00ffe1;
  background: rgba(24,30,42,1);
  color: #fff;
  outline: none;
}
.divider {
  margin: 1.5rem 0 1.2rem 0;
  border: none;
  border-top: 1.5px solid #232e47;
}
.table-dark {
  --bs-table-bg: #181e2a;
  --bs-table-striped-bg: #232e47;
  --bs-table-hover-bg: #232e4722;
  color: #e8eaed;
}
.rounded-table {
  border-collapse: separate;
  border-spacing: 0;
  border-radius: 12px;
  overflow: hidden;
}
.table th, .table td {
  padding: 0.7rem;
  vertical-align: middle;
  border-color: #232e47;
  font-size: 1.02rem;
}
.badge {
  font-size: 0.92rem;
  font-weight: 600;
  border-radius: 8px;
  padding: 0.35rem 1rem;
  letter-spacing: 0.04em;
  box-shadow: 0 1px 4px #232e4720;
}
.bg-gradient-product {
  background: linear-gradient(90deg,#64b5f6 0%,#42a5f5 100%);
  color: #fff;
}
.bg-gradient-discount {
  background: linear-gradient(90deg,#00ffe1 0%,#8f5fe8 100%);
  color: #23233a;
}
.bg-gradient-date {
  background: linear-gradient(90deg,#a362ff 0%,#00ffe1 100%);
  color: #23233a;
}
.btn-gradient-success {
  background: linear-gradient(90deg,#00ffe1 60%, #8f5fe8 100%);
  color: #23233a;
  border: none;
  font-weight: 700;
  border-radius: 12px;
  box-shadow: 0 2px 8px #00ffe130;
  transition: background 0.18s, color 0.18s, box-shadow 0.18s;
}
.btn-gradient-success:hover {
  background: linear-gradient(90deg,#8f5fe8 60%, #00ffe1 100%);
  color: #fff;
  box-shadow: 0 4px 18px #00ffe160;
}
.btn-gradient-info {
  background: linear-gradient(90deg,#64b5f6 0%,#42a5f5 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  transition: background 0.18s;
}
.btn-gradient-info:hover {
  background: linear-gradient(90deg,#42a5f5 0%,#64b5f6 100%);
  color: #fff;
}
.btn-gradient-danger {
  background: linear-gradient(90deg,#ff6b6b 0%,#f44336 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  transition: background 0.18s;
}
.btn-gradient-danger:hover {
  background: linear-gradient(90deg,#f44336 0%,#ff6b6b 100%);
  color: #fff;
}
.btn-outline-light {
  background: transparent;
  color: #e8eaed;
  border: 2px solid #8f5fe8;
  border-radius: 12px;
  font-weight: 600;
  transition: background 0.18s, color 0.18s;
}
.btn-outline-light:hover {
  background: #8f5fe8;
  color: #fff;
}
@media (max-width: 600px) {
  .discount-modal-card {
    padding: 1.2rem 0.4rem 1rem 0.4rem;
    min-width: 0;
    max-width: 99vw;
  }
  .discount-modal-header {
    padding-bottom: 0.7rem;
  }
  .table th, .table td {
    padding: 0.4rem;
    font-size: 0.95rem;
  }
}
</style>
