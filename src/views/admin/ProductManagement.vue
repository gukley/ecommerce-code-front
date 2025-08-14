<template>
  <div class="product-management p-4">
    <h2 class="fw-bold text-primary-ggtech mb-4">Gerenciamento de Produtos</h2>

    <div class="d-flex flex-wrap gap-3 align-items-center mb-4">
      <button class="btn btn-main-action" @click="openProductModal()">
        <i class="bi bi-plus-circle me-2"></i> Adicionar Novo Produto
      </button>

      <div class="d-flex flex-wrap gap-3 align-items-center">
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
          autocomplete="off"
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

    <div class="d-flex justify-content-center my-3 pagination-controls" v-if="totalPages > 1">
      <button class="btn btn-pagination me-2" :disabled="currentPage === 1" @click="goPrevious">
        <i class="bi bi-chevron-left"></i> Anterior
      </button>
      <span class="pagination-info page-info">Página {{ currentPage }} de {{ totalPages }}</span>
      <button class="btn btn-pagination ms-2" :disabled="currentPage === totalPages" @click="goNext">
        Próxima <i class="bi bi-chevron-right"></i>
      </button>
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
import { ref, onMounted, computed, watch } from 'vue';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '@/stores/authStore';

import ProductTable from '@/components/Admin/AdminProductTable.vue';
import ProductFormModal from '@/components/Admin/AdminProductFormModal.vue';
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
const baseUrl = import.meta.env.VITE_API_URL;

const selectedCategory = ref('');
const selectedStock = ref('');

const productFormModalRef = ref(null);

// --- Filtragem e paginação ---
const filteredProducts = computed(() => filterProducts(products.value));
const totalPages = computed(() => Math.max(1, Math.ceil(filteredProducts.value.length / pageSize)));

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredProducts.value.slice(start, start + pageSize);
});

function filterProducts(productsList) {
  let result = productsList;

  if (selectedCategory.value) {
    result = result.filter(p => String(p.category_id) === String(selectedCategory.value));
  }

  if (selectedStock.value === 'in') {
    result = result.filter(p => Number(p.stock) > 0);
  } else if (selectedStock.value === 'out') {
    result = result.filter(p => Number(p.stock) === 0);
  }

  if (!searchTerm.value) return result;

  const term = searchTerm.value.toLowerCase();

  return result.filter(p =>
    p.name.toLowerCase().includes(term) ||
    (p.description?.toLowerCase() || '').includes(term) ||
    (getCategoryName(p.category_id).toLowerCase() || '').includes(term)
  );
}

const getCategoryName = (categoryId) => {
  const category = categories.value.find(cat => cat.id === categoryId);
  return category ? category.name : 'Sem categoria';
};

// --- Métodos para paginação ---
const goPrevious = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const goNext = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

// --- Métodos de dados ---
const fetchProducts = async () => {
  isLoading.value = true;
  try {
    const response = await getAllProducts();
    products.value = response
    .filter(p => p.category?.user_id === authStore.user.id)
    .map(p => ({
    ...p,
    image_url: p.image_path
      ? `${baseUrl}${p.image_path.startsWith('/') ? '' : '/'}${p.image_path}`
      : null
      }));
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

// --- Orquestração ---
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
  productFormModalRef.value?.showModal?.();
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

// --- Inicialização ---
onMounted(() => {
  if (authStore.user && authStore.user.id) {
    loadData();
  } else {
    const stopWatch = watch(() => authStore.user, (newUser) => {
      if (newUser && newUser.id) {
        loadData();
        stopWatch();
      }
    });
  }
});

async function loadData() {
  await fetchCategories();
  await fetchProducts();
}
</script>

<style scoped>
:root {
  --admin-bg-primary: #0f0f23;
  --admin-bg-secondary: #1a1a2e;
  --admin-bg-tertiary: #24243a;

  /* Cores de Acento */
  --admin-accent-primary: #00ffe1;
  --admin-accent-secondary: #8f5fe8;

  /* Cores de Texto */
  --admin-text-primary: #ffffff;
  --admin-text-secondary: rgba(255, 255, 255, 0.8);
  --admin-text-muted: rgba(255, 255, 255, 0.6);

  /* Cores de Estado */
  --admin-success: #00d4aa;
  --admin-warning: #ffa726;
  --admin-danger: #ff6b6b;
  --admin-info: #4fc3f7;

  /* Bordas */
  --border-radius-rounded: 50px;
  --admin-border-light: rgba(255, 255, 255, 0.1);
  --admin-border-medium: rgba(255, 255, 255, 0.2); 

  /* Sombras */
  --admin-shadow-light: rgba(0, 0, 0, 0.1);
}

.product-management {
  background-color: var(--admin-bg-primary);
  min-height: calc(100vh - 100px);
  color: var(--admin-text-primary);
  padding: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.text-primary-ggtech {
  color: var(--admin-accent-primary) !important;
  font-weight: 700;
  text-shadow: 0 0 10px rgba(0, 255, 225, 0.3);
  font-size: 1.9rem;
}

.btn-main-action {
  background: linear-gradient(135deg, var(--admin-accent-primary) 0%, var(--admin-accent-secondary) 100%);
  color: #fff;
  border: 1px solid rgba(0, 255, 225, 0.3);
  font-size: 1.15rem;
  border-radius: var(--border-radius-rounded);
  box-shadow: 0 4px 16px rgba(0, 255, 225, 0.2);
  transition: all 0.3s ease;
  font-weight: 600;
  padding: 0.6rem 1.8rem;
}

.btn-main-action:hover {
  background: linear-gradient(135deg, var(--admin-accent-secondary) 0%, var(--admin-accent-primary) 100%);
  color: #fff;
  box-shadow: 0 8px 25px rgba(0, 255, 225, 0.3);
  transform: translateY(-2px);
  border-color: rgba(0, 255, 225, 0.5);
}

.search-bar {
  max-width: 340px;
  border-radius: var(--border-radius-rounded) !important;
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
  border-radius: var(--border-radius-rounded) 0 0 var(--border-radius-rounded) !important;
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
  border-radius: 0 var(--border-radius-rounded) var(--border-radius-rounded) 0 !important;
  padding-right: 1.5rem;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.pagination-controls {
  margin-top: 2rem;
  display: flex; 
  align-items: center; 
}

.btn-pagination {
  background: var(--admin-bg-tertiary);
  color: var(--admin-accent-primary);
  border: 1px solid var(--admin-border-medium);
  border-radius: 8px;
  padding: 0.6rem 1.2rem;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-pagination:hover:not(:disabled) {
  background: var(--admin-accent-primary);
  color: var(--admin-bg-primary);
  border-color: var(--admin-accent-primary);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 255, 225, 0.2);
}

.btn-pagination:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info { 
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--admin-accent-primary);
}

/* Responsividade */
@media (max-width: 768px) {
  .product-management {
    padding: 1rem;
  }
  
  .text-primary-ggtech {
    font-size: 1.5rem;
  }
  
  .search-bar {
    max-width: 100%;
  }

  .btn-main-action {
    width: 100%;
    justify-content: center;
  }

  .pagination-controls {
    flex-direction: column;
    gap: 1rem;
  }

  .btn-pagination {
    width: 100%;
    justify-content: center;
  }
}
</style>
