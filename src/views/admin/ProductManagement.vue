<template>
    <div class="product-management p-4">
      <h2 class="fw-bold text-primary-ggtech mb-4">Gerenciamento de Produtos</h2>
  
      <div class="d-flex flex-wrap gap-3 align-items-center mb-4">
        <button class="btn btn-main-action" @click="openProductModal()">
          <i class="bi bi-plus-circle me-2"></i> Adicionar Novo Produto
        </button>
        <div class="d-flex flex-wrap gap-2 align-items-center">
          <div>
            <label class="me-2 mb-0">Categoria:</label>
            <select v-model="selectedCategory" class="form-select d-inline-block w-auto">
              <option value="">Todas</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
            </select>
          </div>
          <div>
            <label class="me-2 mb-0">Estoque:</label>
            <select v-model="selectedStock" class="form-select d-inline-block w-auto">
              <option value="">Todos</option>
              <option value="in">Em estoque</option>
              <option value="out">Sem estoque</option>
            </select>
          </div>
        </div>
        <div class="input-group search-bar ms-auto">
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
  
  const selectedCategory = ref("");
  const selectedStock = ref("");

  const filteredProducts = computed(() => {
    let result = products.value;
    if (selectedCategory.value) {
      result = result.filter(product => String(product.category_id) === String(selectedCategory.value));
    }
    if (selectedStock.value === "in") {
      result = result.filter(product => Number(product.stock) > 0);
    } else if (selectedStock.value === "out") {
      result = result.filter(product => Number(product.stock) === 0);
    }
    if (!searchTerm.value) {
      return result;
    }
    const lowerCaseSearchTerm = searchTerm.value.toLowerCase();
    return result.filter(product =>
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
  :root {
  --admin-bg: #f4f7fa;
  --admin-bg-dark: #ffffff;
  --admin-primary: #007cf0;
  --admin-primary-dark: #005fa3;
  --admin-primary-gradient: linear-gradient(90deg, #007cf0 0%, #00ffe1 100%);
  --admin-danger: #e53e3e;
  --admin-danger-dark: #c53030;
  --admin-text: #2e2e2e;
  --admin-text-light: #6b7280;
  --admin-border: #d1d5db;
}

.product-management {
  background-color: var(--admin-bg);
  min-height: calc(100vh - 100px);
  color: var(--admin-text);
  padding: 2rem;
}

.text-primary-ggtech {
  color: var(--admin-primary) !important;
}

.btn-main-action {
  background: var(--admin-primary-gradient);
  color: #fff;
  border: none;
  font-size: 1.15rem;
  border-radius: 50px;
  box-shadow: 0 4px 16px rgba(0, 124, 240, 0.2);
  transition: all 0.3s ease;
}

.btn-main-action:hover {
  background: linear-gradient(90deg, #00ffe1 0%, #007cf0 100%);
  color: #fff;
  box-shadow: 0 8px 25px rgba(0, 124, 240, 0.25);
  transform: translateY(-2px);
}

/* Search Bar */
.search-bar {
  max-width: 340px;
  border-radius: 50px !important;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 124, 240, 0.16);
  border: 2px solid var(--admin-border);
  background: #fff;
  transition: box-shadow 0.2s, border-color 0.2s;
}
.search-bar:focus-within {
  box-shadow: 0 4px 18px rgba(0, 124, 240, 0.22);
  border-color: var(--admin-primary);
}
.search-input {
  background-color: #fff;
  border: none;
  color: #23243a;
  border-radius: 50px 0 0 50px !important;
  padding-left: 1.5rem;
  font-size: 1.12rem;
  font-weight: 600;
  box-shadow: none;
  letter-spacing: 0.02em;
}
.search-input::placeholder {
  color: #6b7280;
  opacity: 1;
  font-weight: 500;
}
.search-input:focus {
  background: #f4f7fa;
  box-shadow: none;
  outline: none;
  color: #23243a;
}
.search-icon {
  background-color: #f4f7fa;
  border: none;
  color: #007cf0;
  border-radius: 0 50px 50px 0 !important;
  padding-right: 1.5rem;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}
</style>