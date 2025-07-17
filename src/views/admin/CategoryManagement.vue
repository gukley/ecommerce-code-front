<template> 
  <div class="container py-4"> 
    <h2>Gerenciamento de Categorias</h2>
    <button class="btn btn-primary mb-3" @click="showCreateModal = true">+ Nova Categoria</button>

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