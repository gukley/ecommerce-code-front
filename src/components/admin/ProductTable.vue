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
  .product-table-container {
  }
  .table-dark {
    --bs-table-bg: var(--admin-bg-dark);
    --bs-table-striped-bg: var(--admin-bg-darker);
    --bs-table-hover-bg: var(--admin-bg-darkest);
    color: var(--admin-text);
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
    background-color: var(--admin-bg-darker);
    color: var(--admin-text);
    border: 1px solid #5a5a6e;
    border-radius: 5px;
    text-align: center;
  }
  .stock-input:focus {
    border-color: var(--admin-primary-dark);
    box-shadow: 0 0 0 0.25rem rgba(0,255,225,0.18);
  }
  .btn-info {
    background-color: var(--admin-primary-dark);
    border-color: var(--admin-primary-dark);
    color: var(--admin-text);
  }
  .btn-info:hover {
    background-color: #007cf0;
    border-color: #007cf0;
  }
  .btn-danger {
    background-color: var(--admin-danger);
    border-color: var(--admin-danger);
    color: var(--admin-text);
  }
  .btn-danger:hover {
    background-color: var(--admin-danger-dark);
    border-color: var(--admin-danger-dark);
  }
  .spinner-border {
    color: var(--admin-primary);
  }
  th, .table th {
    color: var(--admin-primary) !important;
    font-weight: 700;
    letter-spacing: 0.5px;
    font-size: 1.1rem;
    background: transparent;
  }
  thead th {
    background: var(--admin-bg) !important;
    color: var(--admin-text) !important;
  }
  tbody tr, .table-dark tbody > tr {
    background: var(--admin-bg-dark) !important;
  }
  .table-dark tbody > tr > td {
    background: var(--admin-bg-dark) !important;
    color: var(--admin-text) !important;
  }
  .btn-info i, .btn-danger i {
    color: #fff;
    transition: color 0.2s;
  }
  .btn-info:hover i {
    color: #007cf0;
  }
  .btn-danger:hover i {
    color: #e53e3e;
  }
  </style>

<style>
:root {
  --admin-bg: #11111c;
  --admin-bg-dark: #181828;
  --admin-bg-darker: #23243a;
  --admin-bg-darkest: #23243a;
  --admin-primary: #007cf0;
  --admin-primary-dark: #005fa3;
  --admin-primary-gradient: linear-gradient(90deg, #007cf0 0%, #00ffe1 100%);
  --admin-danger: #e53e3e;
  --admin-danger-dark: #c53030;
  --admin-text: #fff;
  --admin-text-light: #e0e6ed;
  --admin-border: #23243a;
}
</style>