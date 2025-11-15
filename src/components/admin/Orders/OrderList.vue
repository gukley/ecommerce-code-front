<template>
  <div class="admin-order-list-bg p-4">
    <h2 class="admin-order-title mb-4">Pedidos</h2>

    <table class="table admin-order-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Cliente</th>
          <th>Data</th>
          <th>Status</th>
          <th>Total</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <!-- Nota: este componente pode ser mantido como fallback/pequena lista.
             Se estiver usando OrderTable acima, pode remover este arquivo ou mantê-lo para lista resumida. -->
        <tr v-for="order in orders" :key="order.id">
          <td class="fw-bold text-info">#{{ order.id }}</td>
          <td>{{ order.user?.name || '-' }}</td>
          <td>{{ formatDate(order.order_date) }}</td>
          <td><span :class="['badge', getStatusClass(order.status)]">{{ getStatusLabel(order.status) }}</span></td>
          <td class="fw-bold text-success">R$ {{ (order.total_amount ?? order.total ?? 0).toFixed(2) }}</td>
          <td>
            <div class="d-flex gap-2">
              <button class="btn btn-sm btn-outline-info" @click="$emit('show-detail', order)"><i class="bi bi-eye"></i></button>
              <button class="btn btn-sm btn-outline-primary" @click="$emit('download-pdf', order)"><i class="bi bi-download"></i></button>
            </div>
          </td>
        </tr>
        <tr v-if="!orders || !orders.length">
          <td colspan="6" class="text-center text-muted">Nenhum pedido encontrado.</td>
        </tr>
      </tbody>
    </table>

    <!-- Modal de detalhes do pedido -->
    <div v-if="showModal" class="modal d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.7);">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content admin-modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Detalhes do Pedido</h5>
            <button type="button" class="btn-close custom-btn-close" @click="closeModal" aria-label="Fechar"></button>
          </div>
          <div class="modal-body p-4">
            <!-- Conteúdo do modal (mantive como placeholder) -->
            <slot name="modal-body"></slot>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue';
const props = defineProps({
  orders: { type: Array, default: () => [] },
  showModal: { type: Boolean, default: false }
});
const emit = defineEmits(['show-detail', 'download-pdf', 'close-modal']);

const showModalLocal = ref(props.showModal);

function closeModal() {
  showModalLocal.value = false;
  emit('close-modal');
}

function formatDate(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleString('pt-BR', { year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit' });
}
function getStatusClass(status) {
  switch (String(status).toUpperCase()) {
    case 'PENDING': return 'bg-warning text-dark';
    case 'PROCESSING': return 'bg-info';
    case 'CONFIRMED': return 'bg-info';
    case 'SHIPPED': return 'bg-primary';
    case 'DELIVERED': return 'bg-success';
    case 'CANCELLED': return 'bg-danger';
    default: return 'bg-warning text-dark';
  }
}
function getStatusLabel(status) {
  switch (String(status).toUpperCase()) {
    case 'PENDING': return 'Pendente';
    case 'PROCESSING': return 'Processando';
    case 'SHIPPED': return 'Enviado';
    case 'CANCELLED': return 'Cancelado';
    default: return 'Pendente';
  }
}
</script>

<style scoped>
:root {
  --admin-bg-primary: #0f0f23;
  --admin-bg-secondary: #181828;
  --admin-bg-tertiary: #202038;
  --admin-accent-primary: #00ffe1;
  --admin-accent-secondary: #8f5fe8;
  --admin-text-primary: #ffffff;
  --admin-text-secondary: rgba(255, 255, 255, 0.8);
  --admin-text-muted: rgba(255, 255, 255, 0.6);
  --admin-border-light: rgba(255, 255, 255, 0.06);
  --admin-shadow-light: rgba(0, 0, 0, 0.45);
}

.admin-order-list-bg {
  background: linear-gradient(180deg, rgba(27,27,38,0.9), rgba(16,16,24,0.92));
  color: var(--admin-text-primary);
  border-radius: 1rem;
  border: 1px solid var(--admin-border-light);
  box-shadow: 0 10px 30px var(--admin-shadow-light);
}

.admin-order-title {
  color: var(--admin-accent-primary);
  font-weight: 700;
  font-size: 1.6rem;
}

/* table */
.admin-order-table {
  width: 100%;
  border-collapse: collapse;
  background: linear-gradient(180deg,#111114,#12121a);
  border-radius: 0.75rem;
  overflow: hidden;
  margin-bottom: 1rem;
}
.admin-order-table th {
  background: linear-gradient(90deg,#161621,#2aa6ff);
  color: #fff;
  padding: 12px;
  font-weight:700;
}
.admin-order-table td {
  color: var(--admin-text-secondary);
  padding: 12px;
  border-bottom: 1px solid rgba(255,255,255,0.03);
}
.custom-btn-close { /* preserved styles */ }
</style>