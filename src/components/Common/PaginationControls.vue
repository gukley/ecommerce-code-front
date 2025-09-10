<template>
  <div class="d-flex justify-content-center my-3 pagination-controls">
    <button class="btn btn-pagination me-2" :disabled="currentPage === 1" @click="$emit('go-to-page', currentPage - 1)">
      <i class="bi bi-chevron-left"></i> Anterior
    </button>
    <span class="pagination-info page-info">Página {{ currentPage }} de {{ totalPages }}</span>
    <button class="btn btn-pagination ms-2" :disabled="currentPage === totalPages" @click="$emit('go-to-page', currentPage + 1)">
      Próxima <i class="bi bi-chevron-right"></i>
    </button>
  </div>
</template>
<script setup>
defineProps({
  currentPage: Number,
  totalPages: Number
})
</script>
<style scoped>
.pagination-controls {
  margin-top: 1.5rem;
}
.btn-pagination {
  background: linear-gradient(90deg,#64b5f6 0%,#42a5f5 100%);
  color: #fff;
  border: none;
  font-weight: 600;
  border-radius: 0.5rem;
  padding: 0.5rem 1.2rem;
  margin: 0 0.2rem;
  transition: background 0.2s;
}
.btn-pagination:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.page-info {
  color: #90caf9;
  font-weight: 600;
  font-size: 1.05rem;
  margin: 0 0.7rem;
}
</style>
