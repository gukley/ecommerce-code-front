<template>
  <div class="product-table-container my-4">
    <div v-if="isLoading" class="text-center py-5">
      <div class="spinner-border text-primary-ggtech" role="status">
        <span class="visually-hidden">Carregando produtos...</span>
      </div>
      <p class="text-light mt-3">Carregando produtos...</p>
    </div>

    <div v-else-if="products.length === 0" class="alert alert-info text-center">
      Nenhum produto encontrado.
    </div>

    <div v-else class="table-responsive">
      <table class="table table-dark table-striped table-hover rounded-table">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Imagem</th>
            <th scope="col">Nome</th>
            <th scope="col">Descrição</th>
            <th scope="col">Preço</th>
            <th scope="col">Estoque</th>
            <th scope="col">Categoria</th>
            <th scope="col">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product.id">
            <td>{{ product.id }}</td>
            <td>
              <div class="product-image-card">
                <img :src="product.image_url || '/placeholder-product.png'" alt="Produto" class="product-thumb" />
              </div>
            </td>
            <td>{{ product.name }}</td>
            <td>{{ truncateText(product.description, 50) }}</td>
            <td>R$ {{ Number(product.price).toFixed(2) }}</td>
            <td>
              <input
                type="number"
                v-model.number="product.stock"
                @change="emitUpdateStock(product)"
                class="form-control stock-input"
                min="0"
              />
            </td>
            <td>{{ getCategoryName(product.category_id) }}</td>
            <td>
              <div class="d-flex">
                <button @click="$emit('edit-product', product)" class="btn btn-sm btn-info me-2" title="Editar">
                  <i class="bi bi-pencil"></i>
                </button>
                <button @click="$emit('delete-product', product.id)" class="btn btn-sm btn-danger" title="Excluir">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  products: {
    type: Array,
    required: true
  },
  categories: {
    type: Array,
    required: true
  },
  isLoading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['edit-product', 'delete-product', 'update-stock']);

const getCategoryName = (categoryId) => {
  const category = props.categories.find(cat => cat.id === categoryId);
  return category ? category.name : 'Desconhecida';
};

const truncateText = (text, maxLength) => {
  if (!text) return '';
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + '...';
  }
  return text;
};

// Emite o evento update-stock com o produto atualizado
const emitUpdateStock = (product) => {
  emit('update-stock', product);
};
</script>

<style scoped>
.table-dark {
  --bs-table-bg: var(--admin-bg-secondary);
  --bs-table-striped-bg: var(--admin-bg-tertiary);
  --bs-table-hover-bg: rgba(255, 255, 255, 0.05);
  color: var(--admin-text-primary);
}
.rounded-table {
  border-collapse: separate;
  border-spacing: 0;
  border-radius: 10px;
  overflow: hidden;
}
.rounded-table thead th:first-child {
  border-top-left-radius: 10px;
}
.rounded-table thead th:last-child {
  border-top-right-radius: 10px;
}
.rounded-table tbody tr:last-child td:first-child {
  border-bottom-left-radius: 10px;
}
.rounded-table tbody tr:last-child td:last-child {
  border-bottom-right-radius: 10px;
}
th, td {
  padding: 1rem;
  vertical-align: middle;
  border-color: var(--admin-border);
  font-size: 1.05rem;
}
.product-image-card {
  background: #23243a;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(143, 95, 232, 0.10);
  border: 1.5px solid #3f3f50;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  margin: 0 auto;
  overflow: hidden;
}
.product-thumb {
  width: 54px;
  height: 54px;
  object-fit: cover;
  border-radius: 8px;
  border: none;
  background: #18182a;
}
.stock-input {
  max-width: 80px;
  background-color: var(--admin-bg-tertiary);
  color: var(--admin-text-primary);
  border: 1px solid var(--admin-border-medium);
  border-radius: 8px;
  text-align: center;
  transition: all 0.3s ease;
}
.stock-input:focus {
  border-color: var(--admin-accent-primary);
  box-shadow: 0 0 0 0.25rem rgba(0, 255, 225, 0.18);
  outline: none;
}
.btn-info {
  background-color: var(--admin-accent-primary);
  border-color: var(--admin-accent-primary);
  color: var(--admin-bg-primary);
  transition: all 0.3s ease;
}
.btn-info:hover {
  background-color: var(--admin-accent-secondary);
  border-color: var(--admin-accent-secondary);
  transform: translateY(-1px);
}
.btn-danger {
  background-color: var(--admin-danger);
  border-color: var(--admin-danger);
  color: #fff;
  transition: all 0.3s ease;
}
.btn-danger:hover {
  background-color: #e53e3e;
  border-color: #e53e3e;
  transform: translateY(-1px);
}
.spinner-border {
  color: var(--admin-accent-primary);
}
th, .table th {
  color: var(--admin-accent-primary) !important;
  font-weight: 700;
  letter-spacing: 0.5px;
  font-size: 1.1rem;
  background: transparent;
}
thead th {
  background: var(--admin-bg-secondary) !important;
  color: var(--admin-text-primary) !important;
}
tbody tr, .table-dark tbody > tr {
  background: var(--admin-bg-secondary) !important;
}
.table-dark tbody > tr > td {
  background: var(--admin-bg-secondary) !important;
  color: var(--admin-text-primary) !important;
}
.btn-info i, .btn-danger i {
  color: #fff;
  transition: color 0.2s;
}
.btn-info:hover i {
  color: var(--admin-accent-secondary);
}
.btn-danger:hover i {
  color: #fff;
}
</style>

<style>
/* Sistema de Cores Padronizado para Admin */
:root {
/* Cores Principais - Harmonizadas com a Sidebar */
--admin-bg-primary: #0f0f23;
--admin-bg-secondary: #1a1a2e;
--admin-bg-tertiary: #24243a;

/* Cores de Acento - Consistente com a Sidebar */
--admin-accent-primary: #00ffe1;
--admin-accent-secondary: #8f5fe8;
--admin-accent-tertiary: #00d4aa;

/* Cores de Texto */
--admin-text-primary: #ffffff;
--admin-text-secondary: rgba(255, 255, 255, 0.8);
--admin-text-muted: rgba(255, 255, 255, 0.6);

/* Cores de Estado */
--admin-success: #00d4aa;
--admin-warning: #ffa726;
--admin-danger: #ff6b6b;
--admin-info: #4fc3f7;

/* Cores de Borda */
--admin-border-light: rgba(255, 255, 255, 0.1);
--admin-border-medium: rgba(255, 255, 255, 0.2);

/* Cores de Sombra */
--admin-shadow-light: rgba(0, 0, 0, 0.1);
--admin-shadow-medium: rgba(0, 0, 0, 0.2);
}
</style>