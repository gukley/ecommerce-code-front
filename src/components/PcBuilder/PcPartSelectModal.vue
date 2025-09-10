<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-select-card">
      <div class="modal-header d-flex justify-content-between align-items-center mb-3">
        <h4 class="fw-bold mb-0">
          <i :class="`bi ${category.icon}`"></i> Selecionar {{ category.label }}
        </h4>
        <button class="btn-close-modal" @click="$emit('close')" aria-label="Fechar">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>
      <div class="modal-body">
        <div class="filter-bar mb-3">
          <input
            v-model="filter"
            type="text"
            class="form-control"
            placeholder="Filtrar por nome ou marca..."
          />
        </div>
        <div v-if="options.length === 0" class="alert alert-info">
          Nenhuma opção disponível.
        </div>
        <ul class="options-list">
          <li
            v-for="opt in filteredOptions"
            :key="opt.id"
            class="option-item"
            :class="{ selected: selected && selected.id === opt.id, incompatible: compatibility[category.key] === false }"
            @click="$emit('select', opt)"
            tabindex="0"
            role="button"
          >
            <div class="option-main">
              <span class="option-name fw-bold">{{ opt.name }}</span>
              <span class="option-brand text-muted ms-2">{{ opt.brand }}</span>
            </div>
            <div class="option-details">
              <span class="option-price">
                R$ {{ typeof opt.price === 'number' ? opt.price.toFixed(2) : Number(opt.price || 0).toFixed(2) }}
              </span>
              <span v-if="opt.stock > 0" class="badge bg-success ms-2">Em estoque</span>
              <span v-else class="badge bg-danger ms-2">Esgotado</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
const props = defineProps({
  category: Object,
  options: Array,
  selected: Object,
  compatibility: Object
})
const filter = ref('')
const filteredOptions = computed(() => {
  if (!filter.value) return props.options
  const f = filter.value.toLowerCase()
  return props.options.filter(
    o =>
      o.name?.toLowerCase().includes(f) ||
      o.brand?.toLowerCase().includes(f)
  )
})
</script>
<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-select-card {
  background: #232e47;
  border-radius: 1.2rem;
  box-shadow: 0 8px 32px #232e4780;
  border: 1.5px solid #399bff;
  min-width: 340px;
  max-width: 95vw;
  width: 420px;
  padding: 2rem 1.2rem;
  color: #e8eaed;
}
.modal-header {
  border-bottom: 1px solid #399bff;
  background: linear-gradient(90deg, #374151 0%, #64b5f6 100%);
  padding-bottom: 0.7rem;
}
.btn-close-modal {
  background: none;
  border: none;
  color: #e8eaed;
  font-size: 1.5rem;
  cursor: pointer;
  transition: color 0.18s;
  padding: 0 8px;
}
.btn-close-modal:hover {
  color: #64b5f6;
}
.filter-bar {
  margin-bottom: 1rem;
}
.options-list {
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 340px;
  overflow-y: auto;
}
.option-item {
  background: #181e2a;
  border-radius: 0.7rem;
  box-shadow: 0 2px 8px #399bff20;
  padding: 0.8rem 1rem;
  margin-bottom: 0.7rem;
  cursor: pointer;
  transition: box-shadow 0.18s, background 0.18s;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.option-item.selected {
  border: 2px solid #64b5f6;
  background: #232e47;
}
.option-item.incompatible {
  border: 2px solid #ff6b6b;
  background: #2d1a1a;
  color: #ff6b6b;
}
.option-main {
  font-size: 1.08rem;
  display: flex;
  align-items: center;
  gap: 8px;
}
.option-details {
  font-size: 0.97rem;
  color: #00ffe1;
  display: flex;
  align-items: center;
  gap: 8px;
}
.badge {
  font-size: 0.92rem;
  font-weight: 600;
  padding: 0.35rem 1rem;
  border-radius: 8px;
  letter-spacing: 0.04em;
  box-shadow: 0 1px 4px #00000018;
}
.bg-success {
  background: linear-gradient(90deg,#43e97b 0%,#38f9d7 100%) !important;
  color: #fff !important;
}
.bg-danger {
  background: linear-gradient(90deg,#ff6b6b 0%,#f44336 100%) !important;
  color: #fff !important;
}
</style>
