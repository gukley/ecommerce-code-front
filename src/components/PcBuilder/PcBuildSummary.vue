<template>
  <div class="pc-build-summary-card">
    <h3 class="fw-bold text-primary mb-3">Resumo da Montagem</h3>
    <ul class="summary-list mb-3">
      <li v-for="cat in categories" :key="cat.key" class="summary-item">
        <span class="summary-label">
          <i :class="`bi ${cat.icon}`"></i> {{ cat.label }}
        </span>
        <span v-if="selectedParts[cat.key]" class="summary-value">
          {{ selectedParts[cat.key].name }}
          <span class="summary-price">
            R$ {{
              typeof selectedParts[cat.key].price === 'number'
                ? selectedParts[cat.key].price.toFixed(2)
                : Number(selectedParts[cat.key].price || 0).toFixed(2)
            }}
          </span>
        </span>
        <span v-else class="summary-missing">Não selecionado</span>
      </li>
    </ul>
    <div class="summary-total mb-2">
      <span class="fw-bold">Subtotal:</span>
      <span class="summary-total-value">
        R$ {{
          typeof total === 'number'
            ? total.toFixed(2)
            : Number(total || 0).toFixed(2)
        }}
      </span>
    </div>
    <div class="summary-progress mb-3">
      <div class="progress-label">Montagem: {{ progress }}%</div>
      <div class="progress-bar">
        <div class="progress-bar-fill" :style="{ width: progress + '%' }"></div>
      </div>
    </div>
    <button
      class="btn btn-main-action w-100"
      :disabled="progress < 100"
      @click="$emit('add-to-cart')"
    >
      <i class="bi bi-cart-plus me-2"></i> Adicionar ao carrinho
    </button>
    <div v-if="progress < 100" class="summary-warning mt-2">
      <i class="bi bi-info-circle"></i> Selecione todos os itens obrigatórios para finalizar.
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  selectedParts: Object,
  categories: Array,
  total: Number,
  progress: Number
})
</script>
<style scoped>
.pc-build-summary-card {
  background: linear-gradient(135deg, #181e2a 0%, #232e47 100%);
  border-radius: 1.2rem;
  box-shadow: 0 4px 20px #232e4720;
  border: 1.5px solid #232e47;
  padding: 2rem 1.2rem;
  color: #e8eaed;
  position: sticky;
  top: 32px;
}
.summary-list {
  list-style: none;
  padding: 0;
  margin: 0 0 1.2rem 0;
}
.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.4rem 0;
  border-bottom: 1px solid #232e47;
  font-size: 1.02rem;
}
.summary-label {
  color: #90caf9;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 7px;
}
.summary-value {
  color: #fff;
  font-weight: 500;
}
.summary-price {
  color: #00ffe1;
  font-weight: 700;
  margin-left: 8px;
}
.summary-missing {
  color: #b0b7c3;
  font-style: italic;
}
.summary-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.15rem;
  font-weight: 700;
  color: #00ffe1;
  margin-bottom: 0.7rem;
}
.summary-total-value {
  font-size: 1.18rem;
  font-weight: 800;
}
.summary-progress {
  margin-bottom: 1.2rem;
}
.progress-label {
  font-size: 0.98rem;
  color: #90caf9;
  margin-bottom: 0.2rem;
}
.progress-bar {
  background: #232e47;
  border-radius: 8px;
  height: 12px;
  width: 100%;
  overflow: hidden;
}
.progress-bar-fill {
  background: linear-gradient(90deg,#64b5f6 0%,#42a5f5 100%);
  height: 100%;
  border-radius: 8px;
  transition: width 0.3s;
}
.btn-main-action {
  background: linear-gradient(90deg,#64b5f6 0%,#42a5f5 100%);
  color: #fff;
  border: none;
  font-weight: 700;
  border-radius: 0.5rem;
  padding: 0.7rem 1.2rem;
  font-size: 1.08rem;
  margin-top: 0.5rem;
  transition: background 0.2s;
}
.btn-main-action:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.summary-warning {
  color: #ff6b6b;
  font-size: 0.97rem;
  margin-top: 0.7rem;
  display: flex;
  align-items: center;
  gap: 7px;
}
</style>
