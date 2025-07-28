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

.product-management {
  background-color: var(--admin-bg-primary);
  min-height: calc(100vh - 100px);
  color: var(--admin-text-primary);
  padding: 2rem;
}

.text-primary-ggtech {
  color: var(--admin-accent-primary) !important;
  font-weight: 700;
  text-shadow: 0 0 10px rgba(0, 255, 225, 0.3);
}

.btn-main-action {
  background: linear-gradient(135deg, var(--admin-accent-primary) 0%, var(--admin-accent-secondary) 100%);
  color: #fff;
  border: 1px solid rgba(0, 255, 225, 0.3);
  font-size: 1.15rem;
  border-radius: 50px;
  box-shadow: 0 4px 16px rgba(0, 255, 225, 0.2);
  transition: all 0.3s ease;
  font-weight: 600;
}

.btn-main-action:hover {
  background: linear-gradient(135deg, var(--admin-accent-secondary) 0%, var(--admin-accent-primary) 100%);
  color: #fff;
  box-shadow: 0 8px 25px rgba(0, 255, 225, 0.3);
  transform: translateY(-2px);
  border-color: rgba(0, 255, 225, 0.5);
}

/* Search Bar */
.search-bar {
  max-width: 340px;
  border-radius: 50px !important;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 255, 225, 0.16);
  border: 2px solid var(--admin-border-light);
  background: var(--admin-bg-secondary);
  transition: box-shadow 0.2s, border-color 0.2s;
}
.search-bar:focus-within {
  box-shadow: 0 4px 18px rgba(0, 255, 225, 0.22);
  border-color: var(--admin-accent-primary);
}
.search-input {
  background-color: var(--admin-bg-secondary);
  border: none;
  color: var(--admin-text-primary);
  border-radius: 50px 0 0 50px !important;
  padding-left: 1.5rem;
  font-size: 1.12rem;
  font-weight: 600;
  box-shadow: none;
  letter-spacing: 0.02em;
}
.search-input::placeholder {
  color: var(--admin-text-muted);
  opacity: 1;
  font-weight: 500;
}
.search-input:focus {
  background: var(--admin-bg-tertiary);
  box-shadow: none;
  outline: none;
  color: var(--admin-text-primary);
}
.search-icon {
  background-color: var(--admin-bg-tertiary);
  border: none;
  color: var(--admin-accent-primary);
  border-radius: 0 50px 50px 0 !important;
  padding-right: 1.5rem;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}
</style>