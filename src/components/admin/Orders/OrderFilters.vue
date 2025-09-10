<template>
  <div class="filters-section card-filters mb-4">
    <div class="row g-3">
      <div class="col-md-3">
        <label class="form-label">Status:</label>
        <select :value="selectedStatus" @input="$emit('update:filters', { status: $event.target.value, period: selectedPeriod, start: startDate, end: endDate, id: searchId })" class="form-select filter-select">
          <option value="">Todos os Status</option>
          <option value="PENDING">Pendente</option>
          <option value="PROCESSING">Processando</option>
          <option value="SHIPPED">Enviado</option>
          <option value="DELIVERED">Entregue</option>
          <option value="CANCELED">Cancelado</option>
        </select>
      </div>
      <div class="col-md-3">
        <label class="form-label">Período:</label>
        <select :value="selectedPeriod" @input="$emit('update:filters', { status: selectedStatus, period: $event.target.value, start: startDate, end: endDate, id: searchId })" class="form-select filter-select">
          <option value="">Todos os Períodos</option>
          <option value="today">Hoje</option>
          <option value="week">Última Semana</option>
          <option value="month">Último Mês</option>
          <option value="custom">Período Personalizado</option>
        </select>
      </div>
      <div class="col-md-3" v-if="selectedPeriod === 'custom'">
        <label class="form-label">Data Inicial:</label>
        <input type="date" :value="startDate" @input="$emit('update:filters', { status: selectedStatus, period: selectedPeriod, start: $event.target.value, end: endDate, id: searchId })" class="form-control filter-input">
      </div>
      <div class="col-md-3" v-if="selectedPeriod === 'custom'">
        <label class="form-label">Data Final:</label>
        <input type="date" :value="endDate" @input="$emit('update:filters', { status: selectedStatus, period: selectedPeriod, start: startDate, end: $event.target.value, id: searchId })" class="form-control filter-input">
      </div>
      <div class="col-md-3">
        <label class="form-label">Buscar por ID:</label>
        <input 
          type="text" 
          :value="searchId"
          @input="$emit('update:filters', { status: selectedStatus, period: selectedPeriod, start: startDate, end: endDate, id: $event.target.value })"
          placeholder="Digite o ID do pedido"
          class="form-control filter-input"
        >
      </div>
      <div class="col-md-12">
        <button @click="$emit('clear-filters')" class="btn btn-outline-secondary btn-sm me-2">
          <i class="bi bi-x-circle me-1"></i>Limpar Filtros
        </button>
        <span class="text-muted">
          <i class="bi bi-info-circle me-1"></i>
          {{ filteredOrders.length }} de {{ orders.length }} pedidos |
          <strong class="text-success">Total: R$ {{ totalPedidos }}</strong>
        </span>
      </div>
    </div>
  </div>
</template>
<script setup>
defineProps({
  selectedStatus: String,
  selectedPeriod: String,
  startDate: String,
  endDate: String,
  searchId: String,
  orders: Array,
  filteredOrders: Array,
  totalPedidos: String
})
</script>
<style scoped>
/* ...estilos de filtro, copie da view original... */
.filters-section {
  background: var(--admin-bg-secondary);
  padding: 1.5rem;
  border-radius: 0.5rem;
  margin-bottom: 2rem;
}
.card-filters {
  box-shadow: 0 2px 12px #00000022;
  border: 1px solid #374151;
}
.filter-select, .filter-input {
  background: var(--admin-bg-tertiary);
  color: var(--admin-text-primary);
  border: 1px solid #374151;
  border-radius: 0.5rem;
}
.filter-select:focus, .filter-input:focus {
  background: var(--admin-bg-tertiary);
  border-color: #64b5f6;
  color: var(--admin-text-primary);
  box-shadow: 0 0 0 0.2rem rgba(100, 181, 246, 0.25);
}
.btn-outline-secondary {
  color: var(--admin-text-primary);
  border-color: #374151;
}
.btn-outline-secondary:hover {
  background: #23233a;
}
</style>
