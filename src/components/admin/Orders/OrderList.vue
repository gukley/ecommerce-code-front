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
        <!-- ...existing code... -->
      </tbody>
    </table>
    <!-- Modal de detalhes do pedido -->
    <div v-if="showModal" class="modal d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.7);">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content admin-modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Detalhes do Pedido</h5>
            <button type="button" class="btn-close custom-btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body p-4">
            <!-- ...existing code... -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// ...existing code...
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
  --admin-border-light: rgba(255, 255, 255, 0.1);
  --admin-shadow-light: rgba(0, 0, 0, 0.4);
  --admin-danger: #ff6b6b;
  --admin-border-medium: rgba(255, 255, 255, 0.2);
}

.admin-order-list-bg {
  background: var(--admin-bg-secondary);
  color: var(--admin-text-primary);
  border-radius: 1.25rem;
  border: 1px solid var(--admin-border-light);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
}

.admin-order-title {
  color: var(--admin-accent-primary);
  font-weight: 600;
  font-size: 1.6rem;
}

.admin-order-table {
  background: var(--admin-bg-primary);
  color: var(--admin-text-primary);
  border-radius: 0.75rem;
  overflow: hidden;
  border: 1px solid var(--admin-border-medium);
}

.admin-order-table th {
  background: var(--admin-bg-tertiary);
  color: var(--admin-accent-primary);
  font-weight: 500;
  border-bottom: 1px solid var(--admin-border-light);
}

.admin-order-table td {
  color: var(--admin-text-secondary);
  border-bottom: 1px solid var(--admin-border-light);
}

.admin-order-table tr:last-child td {
  border-bottom: none;
}

.admin-modal-content {
  background: var(--admin-bg-secondary);
  color: var(--admin-text-primary);
  border-radius: 1.25rem;
  border: 1px solid var(--admin-border-light);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
}

.modal-header {
  border-bottom: 1px solid var(--admin-border-light);
  background-color: var(--admin-bg-tertiary);
  padding: 1.25rem 1.5rem;
}

.modal-title {
  font-weight: 600;
  color: var(--admin-accent-primary);
  font-size: 1.4rem;
}

.custom-btn-close {
  background: none;
  border: none;
  color: var(--admin-text-muted);
  font-size: 1.5rem;
  cursor: pointer;
  transition: color 0.2s ease, transform 0.2s ease;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23e0e0e0'%3e%3cpath d='M.293.293a1 1 0 0 1 1.414 0L8 6.586 14.293.293a1 1 0 1 1 1.414 1.414L9.414 8l6.293 6.293a1 1 0 0 1-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 0 1-1.414-1.414L6.586 8 .293 1.707a1 1 0 0 1 0-1.414z'/%3e%3c/svg%3e");
  background-size: 1em;
  background-repeat: no-repeat;
  background-position: center;
  opacity: 1;
}

.custom-btn-close:hover {
  color: var(--admin-danger);
  transform: rotate(90deg);
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23ff6b6b'%3e%3cpath d='M.293.293a1 1 0 0 1 1.414 0L8 6.586 14.293.293a1 1 0 1 1 1.414 1.414L9.414 8l6.293 6.293a1 1 0 0 1-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 0 1-1.414-1.414L6.586 8 .293 1.707a1 1 0 0 1 0-1.414z'/%3e%3c/svg%3e");
}

.admin-order-btn {
  background: linear-gradient(135deg, var(--admin-accent-primary) 0%, var(--admin-accent-secondary) 100%);
  color: #fff !important;
  border: none;
  border-radius: 50px;
  font-weight: 600;
  padding: 0.5rem 1.2rem;
  box-shadow: 0 4px 16px rgba(0, 255, 225, 0.2);
  transition: all 0.3s ease;
}

.admin-order-btn:hover {
  background: linear-gradient(135deg, var(--admin-accent-secondary) 0%, var(--admin-accent-primary) 100%);
  color: #fff !important;
  box-shadow: 0 8px 25px rgba(0, 255, 225, 0.3);
  transform: translateY(-2px);
}

.admin-order-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* ...existing code for other elements... */
</style>