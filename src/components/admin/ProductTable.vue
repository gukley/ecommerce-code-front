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
                <img :src="product.image_url || '/placeholder-product.png'" alt="Produto" class="product-thumb" />
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
    --bs-table-bg: #2a2a3e; 
    --bs-table-striped-bg: #3a3a4e; 
    --bs-table-hover-bg: #4a4a5e; 
    color: white;
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
    border-color: #3f3f50; 
  }
  
  .product-thumb {
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .stock-input {
    max-width: 80px;
    background-color: #3b3b4d;
    color: white;
    border: 1px solid #5a5a6e;
    border-radius: 5px;
    text-align: center;
  }
  
  .stock-input:focus {
    border-color: #8f5fe8;
    box-shadow: 0 0 0 0.25rem rgba(143, 95, 232, 0.25);
  }
  
  .btn-info {
    background-color: #00bcd4; 
    border-color: #00bcd4;
    color: white;
  }
  .btn-info:hover {
    background-color: #00acc1;
    border-color: #00acc1;
  }
  
  .btn-danger {
    background-color: #f44336; 
    border-color: #f44336;
    color: white;
  }
  .btn-danger:hover {
    background-color: #d32f2f;
    border-color: #d32f2f;
  }
  
  .spinner-border {
    color: #8f5fe8; 
  }
  </style>