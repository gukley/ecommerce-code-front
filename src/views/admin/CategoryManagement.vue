<template> 
  <div class="category-management p-4"> 
    <h2 class="fw-bold text-primary-ggtech mb-4">Gerenciamento de Categorias</h2>
    <button class="btn btn-main-action mb-4" @click="showCreateModal = true">
      <i class="bi bi-plus-circle me-2"></i> Nova Categoria
    </button>

    <CategoryTable
      :categories="categories"
      @edit="openEditModal"
      @delete="deleteCategory"
      @upload-image="uploadImage"
    />

      <CategoryFormModal
        v-if="showCreateModal || editingCategory"
        :category="editingCategory"
        @close="closeModal"
        @saved="handleSaved"
/>
</div>
</template>

<script setup> 
import { ref, onMounted} from 'vue';
import { 
  getCategoriesByUser,
  createCategory,
  updateCategory,
  deleteCategory as apiDeleteCategory,
  updateCategoryImage,
} from '@/services/apiService';
import { useAuthStore } from '@/stores/authStore';

import CategoryTable from '@/components/admin/CategoryTable.vue';
import CategoryFormModal from '@/components/admin/CategoryFormModal.vue';

const auth = useAuthStore();
const categories = ref([]);
const showCreateModal = ref(false);
const editingCategory = ref(null);

const loadCategories = async () => {
  if (!auth.user || !auth.user.id) return;
  const res = await getCategoriesByUser(auth.user.id);
  categories.value = res;
};

const openEditModal = (category) => { 
  editingCategory.value = { ...category };
};

const closeModal = () => { 
  showCreateModal.value = false;
  editingCategory.value = null;
};

const handleSaved = async () => { 
  await loadCategories();
  closeModal();
}

const deleteCategory = async (id) => { 
  if (confirm('Deseja excluir esta categoria?')) { 
    await apiDeleteCategory(id);
    await loadCategories();
  }
};

const uploadImage = async (id, file) => { 
  await updateCategoryImage(id, file);
  await loadCategories();
};

onMounted(loadCategories);
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

.category-management {
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
</style>