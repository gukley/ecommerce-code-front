<template>
  <div
    class="pc-part-card"
    :class="{ 'incompatible': compatible === false }"
    @click="$emit('select')"
    tabindex="0"
    role="button"
    :aria-label="`Selecionar ${category.label}`"
  >
    <div class="icon-box mb-2">
      <i :class="`bi ${category.icon}`"></i>
    </div>
    <div class="part-label fw-bold mb-1">{{ category.label }}</div>
    <div v-if="selected" class="selected-part">
      <span class="selected-name">{{ selected.name }}</span>
      <span class="selected-price">
        R$ {{
          typeof selected.price === 'number'
            ? selected.price.toFixed(2)
            : Number(selected.price || 0).toFixed(2)
        }}
      </span>
    </div>
    <div v-else class="placeholder">Selecione uma peça</div>
    <div v-if="compatible === false" class="compat-warning">
      <i class="bi bi-exclamation-triangle"></i> Incompatível
    </div>
    <button class="btn btn-select-part mt-2" type="button">
      <i class="bi bi-search"></i> Selecionar
    </button>
  </div>
</template>
<script setup>
const props = defineProps({
  category: Object,
  selected: Object,
  compatible: { type: Boolean, default: true }
})
</script>
<style scoped>
.pc-part-card {
  background: linear-gradient(135deg, #181e2a 0%, #232e47 100%);
  border-radius: 1.2rem;
  box-shadow: 0 4px 20px #232e4720;
  border: 1.5px solid #232e47;
  padding: 1.2rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: box-shadow 0.2s, border-color 0.2s, transform 0.18s;
  min-height: 180px;
  position: relative;
}
.pc-part-card:hover, .pc-part-card:focus {
  box-shadow: 0 8px 32px #399bff30;
  border-color: #399bff;
  transform: translateY(-2px) scale(1.03);
}
.icon-box {
  font-size: 2.2rem;
  color: #64b5f6;
  margin-bottom: 0.5rem;
}
.part-label {
  font-size: 1.08rem;
  color: #90caf9;
  margin-bottom: 0.3rem;
}
.selected-part {
  color: #fff;
  font-size: 1rem;
  margin-bottom: 0.2rem;
  text-align: center;
}
.selected-name {
  font-weight: 600;
}
.selected-price {
  color: #00ffe1;
  font-weight: 700;
  margin-left: 8px;
}
.placeholder {
  color: #b0b7c3;
  font-size: 0.98rem;
  font-style: italic;
  margin-bottom: 0.2rem;
}
.compat-warning {
  color: #ff6b6b;
  font-size: 0.95rem;
  margin-top: 0.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 5px;
}
.incompatible {
  border-color: #ff6b6b;
  box-shadow: 0 0 0 2px #ff6b6b44;
}
.btn-select-part {
  background: linear-gradient(90deg,#64b5f6 0%,#42a5f5 100%);
  color: #fff;
  border: none;
  font-weight: 600;
  border-radius: 0.5rem;
  padding: 0.45rem 1.2rem;
  margin-top: 0.5rem;
  font-size: 1rem;
  transition: background 0.2s;
}
.btn-select-part:hover {
  background: linear-gradient(90deg,#42a5f5 0%,#64b5f6 100%);
  color: #fff;
}
</style>
