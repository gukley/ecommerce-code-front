<template>
  <div class="product-management p-4">
    <h2 class="fw-bold text-primary-ggtech mb-4">Gerenciamento de Produtos</h2>

    <div class="d-flex flex-wrap gap-3 align-items-center mb-4">
      <button class="btn btn-main-action" @click="openProductModal()">
        <i class="bi bi-plus-circle me-2"></i> Adicionar Novo Produto
      </button>

      <button class="btn btn-discount-action" @click="openDiscountModal()">
        <i class="bi bi-percent me-2"></i> Gerenciar Descontos
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

    <DiscountModal
      v-if="showDiscountModal"
      :products="products"
      :discounts="discounts"
      @discount-saved="handleDiscountSaved"
      @close="showDiscountModal = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '@/stores/authStore';

import ProductTable from '@/components/Admin/Product/AdminProductTable.vue';
import ProductFormModal from '@/components/Admin/Product/AdminProductFormModal.vue';
import DiscountModal from '@/components/Admin/AdminDiscountModal.vue';
import {
  getAllProducts,
  getCategories,
  deleteProduct,
  updateProductStock,
  getAllDiscounts,
  createDiscount,
  updateDiscount,
  deleteDiscount
} from '@/services/apiService';

const toast = useToast();
const authStore = useAuthStore();

const products = ref([]);
const categories = ref([]);
const discounts = ref([]);
const isLoading = ref(true);
const searchTerm = ref('');
const currentProduct = ref(null);
const isEditing = ref(false);
const currentPage = ref(1);
const pageSize = 10;
const baseUrl = import.meta.env.VITE_API_URL;

const selectedCategory = ref('');
const selectedStock = ref('');
const showDiscountModal = ref(false);

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
    products.value = response.map(p => ({
      ...p,
      image_url: p.image_path
        ? `${baseUrl}${p.image_path.startsWith('/') ? '' : '/'}${p.image_path}`
        : null,
      discount: p.discount // Garante que o desconto está presente
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
    // Moderadores veem todas as categorias, admins veem apenas as suas
    const userRole = authStore.user?.role?.toUpperCase();
    if (userRole === 'MODERATOR') {
      categories.value = response;
    } else {
      categories.value = response.filter(cat => cat.user_id === authStore.user.id);
    }
  } catch (error) {
    toast.error('Erro ao carregar categorias: ' + (error.response?.data?.message || error.message));
  }
};

const fetchDiscounts = async () => {
  discounts.value = await getAllDiscounts()
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

const openDiscountModal = () => {
  showDiscountModal.value = true
}

const handleProductSaved = async () => {
  await fetchProducts();
};

const handleDiscountSaved = async () => {
  await fetchDiscounts()
  await fetchProducts()
}

const confirmDelete = async (productId) => {
  if (confirm('Tem certeza que deseja excluir este produto?')) {
    try {
      await deleteProduct(productId);
      toast.success('Produto excluído com sucesso!');
      await fetchProducts();
    } catch (error) {
      // NÃO logar o erro 403 no console — mostrar apenas um toast leve para o usuário
      const status = error?.response?.status;
      if (status === 403) {
        // mensagem leve e não intrusiva
        toast.warning('Você não tem permissão para excluir este produto.');
        return;
      }

      // Tratamento específico para erro de relacionamento com tags
      const message = error?.response?.data?.message || error?.message || '';
      if (message.includes('tag_products') || message.includes('tag_products')) {
        toast.error('Erro: Este produto possui tags associadas. Remova as tags antes de excluir o produto.');
      } else {
        // Para outros erros mostramos toast de erro e logamos DEBUG (não erro crítico)
        toast.error('Erro ao excluir produto: ' + (message || 'Tente novamente.'));
        // se quiser logar para debugging remoto, use console.debug (menos ruidoso)
        console.debug('Erro ao excluir produto:', error);
      }
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
  await fetchDiscounts()
}
</script>

<style scoped>
.product-management {
  background-color: #0f1419;
  min-height: 100vh;
  color: #e8eaed;
  padding: 2rem 1rem;
  max-width: 1280px;
  margin: 0 auto;
  font-family: 'Inter', sans-serif;
}

.text-primary-ggtech {
  background: linear-gradient(90deg, #64b5f6 0%, #42a5f5 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 700;
  font-size: 2.2rem;
  letter-spacing: 0.02em;
}

.btn-main-action {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
}

.btn-main-action:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
  color: white;
}

.btn-discount-action {
  background: linear-gradient(90deg, #00ffe1 0%, #8f5fe8 100%);
  color: #23233a;
  font-weight: 700;
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-size: 1.08rem;
  box-shadow: 0 2px 12px #00ffe130;
  transition: background 0.18s, color 0.18s, box-shadow 0.18s;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-discount-action:hover {
  background: linear-gradient(90deg, #8f5fe8 0%, #00ffe1 100%);
  color: #fff;
  box-shadow: 0 4px 18px #00ffe160;
}

.form-select, .form-control {
  background-color: #1a2332;
  border: 1px solid #374151;
  color: #e8eaed;
  border-radius: 0.5rem;
}

.form-select:focus, .form-control:focus {
  background-color: #1a2332;
  border-color: #64b5f6;
  color: #e8eaed;
  box-shadow: 0 0 0 0.2rem rgba(100, 181, 246, 0.25);
}

.form-select option {
  background-color: #1a2332;
  color: #e8eaed;
}

.search-bar {
  max-width: 300px;
}

.search-input {
  border-right: none;
}

.search-icon {
  background-color: #1a2332;
  border: 1px solid #374151;
  border-left: none;
  color: #64b5f6;
}

.btn-pagination {
  background-color: #1a2332;
  border: 1px solid #374151;
  color: #64b5f6;
  transition: all 0.3s ease;
}

.btn-pagination:hover:not(:disabled) {
  background-color: #374151;
  border-color: #4a5568;
  color: #e8eaed;
}

.btn-pagination:disabled {
  background-color: #0f1419;
  border-color: #1a2332;
  color: #4a5568;
}

.pagination-info {
  color: #b0b7c3;
  font-weight: 500;
  padding: 0.5rem 1rem;
}

label {
  color: #a0aec0;
  font-weight: 500;
}

/* Responsividade */
@media (max-width: 768px) {
  .product-management {
    padding: 1rem 0.5rem;
  }
  
  .text-primary-ggtech {
    font-size: 1.8rem;
  }
  
  .search-bar {
    max-width: 100%;
    margin-top: 1rem;
  }
}
</style>