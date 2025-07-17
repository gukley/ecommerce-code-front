<template>
    <div class="product-management p-4">
      <h2 class="fw-bold text-primary-ggtech mb-4">Gerenciamento de Produtos</h2>
  
      <div class="d-flex justify-content-between align-items-center mb-4">
        <button class="btn btn-main-action" @click="openProductModal()">
          <i class="bi bi-plus-circle me-2"></i> Adicionar Novo Produto
        </button>
        <div class="input-group search-bar">
          <input
            type="text"
            class="form-control search-input"
            placeholder="Buscar produto..."
            v-model="searchTerm"
          />
          <span class="input-group-text search-icon"><i class="bi bi-search"></i></span>
        </div>
      </div>
  
      <ProductTable
        :products="paginatedProducts"
        :categories="categories"
        :is-loading="isLoading"
        @edit-product="openProductModal"
        @delete-product="confirmDelete"
        @update-stock="updateStock"
      />
  
      <div class="d-flex justify-content-center my-3" v-if="totalPages > 1">
        <button class="btn btn-secondary me-2" :disabled="currentPage === 1" @click="currentPage--">Anterior</button>
        <span>Página {{ currentPage }} de {{ totalPages }}</span>
        <button class="btn btn-secondary ms-2" :disabled="currentPage === totalPages" @click="currentPage++">Próxima</button>
      </div>
  
      <ProductFormModal
        :product="currentProduct"
        :categories="categories"
        :is-editing="isEditing"
        @product-saved="handleProductSaved"
        ref="productFormModalRef"
      />
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue';
  import { useToast } from 'vue-toastification';
  import { useAuthStore } from '@/stores/authStore';
  
  import ProductTable from '@/components/admin/ProductTable.vue';
  import ProductFormModal from '@/components/admin/ProductFormModal.vue';
    import {
    getAllProducts,
    getCategories,
    deleteProduct,
    updateProductStock
  } from '@/services/apiService';
  
  const toast = useToast();
  const authStore = useAuthStore();
  
  const products = ref([]);
  const categories = ref([]);
  const isLoading = ref(true);
  const searchTerm = ref('');
  const currentProduct = ref(null);
  const isEditing = ref(false);
  const currentPage = ref(1);
  const pageSize = 10;
  const totalPages = computed(() => Math.ceil(filteredProducts.value.length / pageSize));

  const paginatedProducts = computed(() => {
    const start = (currentPage.value - 1) * pageSize;
    return filteredProducts.value.slice(start, start + pageSize);
  });
  
  const productFormModalRef = ref(null);
  
  const filteredProducts = computed(() => {
    if (!searchTerm.value) {
      return products.value;
    }
    const lowerCaseSearchTerm = searchTerm.value.toLowerCase();
    return products.value.filter(product =>
      product.name.toLowerCase().includes(lowerCaseSearchTerm) ||
      product.description.toLowerCase().includes(lowerCaseSearchTerm) ||
      (getCategoryName(product.category_id) || '').toLowerCase().includes(lowerCaseSearchTerm)
    );
  });
  
  // --- Métodos de Gerenciamento de Dados (usando funções nomeadas de apiService) ---
  const fetchProducts = async () => {
    isLoading.value = true;
    try {
      const response = await getAllProducts();
      // Filtra apenas os produtos do usuário logado
      products.value = response.filter(p => p.category?.user_id === authStore.user.id);
    } catch (error) {
      toast.error('Erro ao carregar produtos: ' + (error.response?.data?.message || error.message));
    } finally {
      isLoading.value = false;
    }
  };
  
  const fetchCategories = async () => {
    try {
      const response = await getCategories(); 
      categories.value = response.filter(cat => cat.user_id === authStore.user.id);
    } catch (error) {
      toast.error('Erro ao carregar categorias: ' + (error.response?.data?.message || error.message));
    }
  };
  
  const getCategoryName = (categoryId) => {
    const category = categories.value.find(cat => cat.id === categoryId);
    return category ? category.name : 'Desconhecida';
  };
  
  // --- Métodos de Orquestração ---
  const openProductModal = (product = null) => {
    if (product) {
      isEditing.value = true;
      currentProduct.value = { ...product }; 
    } else {
      isEditing.value = false;
      currentProduct.value = { 
        name: '',
        description: '',
        price: 0,
        stock: 0,
        category_id: ''
      };
    }
    productFormModalRef.value.showModal(); 
  };
  
  const handleProductSaved = async () => {
    await fetchProducts(); 
  };
  
  const confirmDelete = async (productId) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await deleteProduct(productId); 
        toast.success('Produto excluído com sucesso!');
        await fetchProducts(); 
      } catch (error) {
        toast.error('Erro ao excluir produto: ' + (error.response?.data?.message || error.message));
      }
    }
  };
  
  const updateStock = async (product) => {
    try {
      await updateProductStock(product.id, { stock: product.stock }); 
      toast.success('Estoque atualizado!');
    } catch (error) {
      toast.error('Erro ao atualizar estoque: ' + (error.response?.data?.message || error.message));
      await fetchProducts();
    }
  };
  
  // Ao montar o componente principal
  onMounted(async () => {
    // Aguarda o usuário estar disponível
    while (!authStore.user || !authStore.user.id) {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    await fetchCategories();
    await fetchProducts();
  });
  </script>
  
  <style scoped>
  .product-management {
    background-color: #1a1a2e; /* Fundo geral da área de admin */
    min-height: calc(100vh - 100px); 
    color: white; 
    padding: 2rem;
  }
  
  .text-primary-ggtech {
    color: #8f5fe8 !important; /* Roxo principal */
  }
  
  .btn-main-action {
    background: linear-gradient(90deg, #a362ff, #8f5fe8);
    color: #fff;
    border: 2px solid #cbb6ff;
    font-size: 1.15rem;
    border-radius: 50px;
    box-shadow: 0 4px 16px rgba(163,98,255,0.18);
    transition: all 0.3s ease;
  }
  
  .btn-main-action:hover {
    background: linear-gradient(90deg, #8f5fe8, #a362ff);
    color: #fff;
    box-shadow: 0 8px 25px rgba(163,98,255,0.28);
    transform: translateY(-2px);
  }
  
  /* Search Bar */
  .search-bar {
    max-width: 300px;
    border-radius: 50px !important;
    overflow: hidden;
  }
  
  .search-input {
    background-color: #4a4a5c;
    border: none;
    color: white;
    border-radius: 50px 0 0 50px !important;
    padding-left: 1.5rem;
  }
  
  .search-input:focus {
    box-shadow: 0 0 0 0.25rem rgba(143, 95, 232, 0.25);
  }
  
  .search-icon {
    background-color: #4a4a5c;
    border: none;
    color: white;
    border-radius: 0 50px 50px 0 !important;
    padding-right: 1.5rem;
  }
  </style>