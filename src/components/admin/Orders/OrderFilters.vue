<template>
  <div class="filters-section card-filters mb-4">
    <div class="row g-3">
      <div class="col-md-3">
        <label class="form-label">Status:</label>
        <select :value="selectedStatus" @input="$emit('update:filters', { status: $event.target.value, period: selectedPeriod, start: startDate, end: endDate, id: searchId })" class="form-select filter-select">
          <option value="">Todos os Status</option>
          <option value="PENDING">Pendente</option>
          <option value="PROCESSING">Processando</option>
          <option value="CONFIRMED">Confirmado</option>
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
          <strong class="text-success">Total: R$ {{ totalPedidosFiltrados.toFixed(2) }}</strong>
        </span>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue'
const props = defineProps({
  selectedStatus: String,
  selectedPeriod: String,
  startDate: String,
  endDate: String,
  searchId: String,
  orders: Array,
  filteredOrders: Array,
  totalPedidos: [String, Number]
})

// Corrige o total para somar corretamente o valor dos pedidos filtrados
const totalPedidosFiltrados = computed(() => {
  if (!props.filteredOrders || !props.filteredOrders.length) return 0;
  return props.filteredOrders.reduce((acc, order) => {
    // Usa order.total_amount se existir, senão soma dos itens
    if (order.total_amount !== undefined && order.total_amount !== null) {
      return acc + Number(order.total_amount);
    }
    if (!order.items || !order.items.length) return acc;
    return acc + order.items.reduce((s, item) => {
      if (item.total_price !== undefined && item.total_price !== null) {
        return s + Number(item.total_price);
      }
      const price = (item.unit_price !== undefined && item.unit_price !== null)
        ? Number(item.unit_price)
        : (item.price !== undefined && item.price !== null)
          ? Number(item.price)
          : (item.product && item.product.price !== undefined && item.product.price !== null)
            ? Number(item.product.price)
            : 0;
      const qty = Number(item.quantity ?? 1) || 1;
      return s + price * qty;
    }, 0);
  }, 0);
});
</script>
<style scoped>
.filters-section {
  background: rgba(27, 27, 38, 0.8);
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  box-shadow: 0 2px 12px rgba(27, 27, 38, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(8px);
}

.filter-select,
.filter-input {
  background: #1e1e2d;
  color: #e6e6e9;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 0.6rem 1rem;
  font-size: 1rem;
}

.filter-select:focus,
.filter-input:focus {
  border-color: #7b61ff;
  box-shadow: 0 0 0 0.2rem rgba(123, 97, 255, 0.3);
}

.btn-outline-secondary {
  color: #e6e6e9;
  border-color: rgba(255, 255, 255, 0.1);
}

.btn-outline-secondary:hover {
  background: #1b1b26;
}
</style>
