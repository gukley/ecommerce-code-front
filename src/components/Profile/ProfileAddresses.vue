<template>
  <section class="addresses-section">
    <div class="addresses-header">
      <h2 class="addresses-title">
        <i class="bi bi-geo-alt-fill"></i>
        Meus Endereços
      </h2>
      <button @click="$emit('add')" class="btn-add-address" title="Adicionar Novo Endereço">
        <i class="bi bi-plus-circle"></i>
        <span>Adicionar</span>
      </button>
    </div>
    
    <div v-if="addresses.length === 0" class="empty-state">
      <i class="bi bi-inbox"></i>
      <p>Nenhum endereço cadastrado.</p>
    </div>
    
    <div v-else class="addresses-list">
      <div v-for="addr in addresses" :key="addr.id" class="address-item">
        <div class="address-content">
          <div class="address-icon">
            <i class="bi bi-geo-alt"></i>
          </div>
          <div class="address-info">
            <span class="address-text">
              {{ addr.street }}, {{ addr.number }} - {{ addr.city }}, {{ addr.state }} ({{ addr.zip }})
            </span>
          </div>
        </div>
        <div class="address-actions">
          <button @click="$emit('edit', addr)" class="btn-action btn-edit" title="Editar Endereço">
            <i class="bi bi-pencil"></i>
          </button>
          <button @click="handleDelete(addr.id)" class="btn-action btn-delete" title="Excluir Endereço">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
<script setup>
const props = defineProps({ addresses: Array })
const emit = defineEmits(['add', 'edit', 'delete'])

// Emite o evento de exclusão com tratamento de erro melhorado
function handleDelete(addressId) {
  emit('delete', addressId)
}
</script>
<style scoped>
.addresses-section {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1.5px solid #e0e7ff;
  padding: 1.5rem;
  font-family: 'Inter', sans-serif;
}

.addresses-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e0e7ff;
}

.addresses-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #4a90e2;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.addresses-title i {
  font-size: 1.5rem;
  color: #6a5ae0;
}

.btn-add-address {
  background: linear-gradient(135deg, #4a90e2 0%, #6a5ae0 100%);
  color: #ffffff;
  border: none;
  border-radius: 10px;
  padding: 0.6rem 1.2rem;
  font-weight: 600;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(74, 144, 226, 0.2);
}

.btn-add-address:hover {
  background: linear-gradient(135deg, #6a5ae0 0%, #4a90e2 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(74, 144, 226, 0.3);
}

.btn-add-address i {
  font-size: 1.1rem;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #6b7280;
}

.empty-state i {
  font-size: 3rem;
  color: #d1d5db;
  margin-bottom: 1rem;
  display: block;
}

.empty-state p {
  margin: 0;
  font-size: 1rem;
  color: #9ca3af;
}

.addresses-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.address-item {
  background: #f8fafc;
  border-radius: 12px;
  padding: 1.2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1.5px solid #e0e7ff;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
}

.address-item:hover {
  background: #f0f9ff;
  border-color: #4a90e2;
  box-shadow: 0 4px 16px rgba(74, 144, 226, 0.1);
  transform: translateY(-2px);
}

.address-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.address-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #4a90e2 0%, #6a5ae0 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 1.2rem;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(74, 144, 226, 0.2);
}

.address-info {
  flex: 1;
}

.address-text {
  font-size: 1rem;
  font-weight: 500;
  color: #232e47;
  line-height: 1.5;
}

.address-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.btn-action {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1.1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.btn-edit {
  background: linear-gradient(135deg, #64b5f6 0%, #42a5f5 100%);
  color: #ffffff;
}

.btn-edit:hover {
  background: linear-gradient(135deg, #42a5f5 0%, #64b5f6 100%);
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 4px 12px rgba(66, 165, 245, 0.3);
}

.btn-delete {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
  color: #ffffff;
}

.btn-delete:hover {
  background: linear-gradient(135deg, #ee5a6f 0%, #ff6b6b 100%);
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
}

/* Responsividade */
@media (max-width: 991px) {
  .addresses-section {
    padding: 1.2rem;
  }

  .addresses-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .btn-add-address {
    width: 100%;
    justify-content: center;
  }

  .address-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .address-actions {
    width: 100%;
    justify-content: flex-end;
  }
}

@media (max-width: 600px) {
  .addresses-section {
    padding: 1rem;
  }

  .addresses-title {
    font-size: 1.2rem;
  }

  .address-item {
    padding: 1rem;
  }

  .address-text {
    font-size: 0.9rem;
  }

  .btn-action {
    width: 36px;
    height: 36px;
    font-size: 1rem;
  }
}
</style>