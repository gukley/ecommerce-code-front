<template>
  <div class="category-management p-4">
    <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-4">
      <h2 class="fw-bold text-primary-ggtech m-0">Gerenciamento de Categorias</h2>
      <button class="btn btn-gradient-add" @click="showCreateModal = true">
        <span class="add-icon"><i class="bi bi-plus-circle"></i></span>
        <span class="add-label">Adicionar Nova Categoria</span>
      </button>
    </div>

    <div v-if="isLoading" class="d-flex justify-content-center my-5">
      <div class="spinner-border text-primary-ggtech" role="status">
        <span class="visually-hidden">Carregando...</span>
      </div>
    </div>
    
    <Transition name="fade" mode="out-in">
      <div v-if="!isLoading" :key="categories.length">
        <div class="category-grid">
          <div
            v-for="cat in categories"
            :key="cat.id"
            class="category-card"
          >
            <div class="category-card-imgbox">
              <img
                :src="cat.image_url || '/placeholder-category.png'"
                :alt="cat.name"
                class="category-card-img"
              />
              <label class="upload-label" title="Alterar imagem">
                <input type="file" class="d-none" @change="e => uploadImage(cat.id, e.target.files[0])" accept="image/*" />
                <i class="bi bi-camera-fill"></i>
              </label>
            </div>
            <div class="category-card-info">
              <div class="category-name">{{ cat.name }}</div>
              <div class="category-desc text-muted mb-2">{{ cat.description }}</div>
            </div>
            <div class="category-card-actions d-flex gap-2 justify-content-end">
              <button class="btn btn-outline-accent" @click="openEditModal(cat)">
                <i class="bi bi-pencil"></i>
              </button>
              <button class="btn btn-outline-danger" @click="deleteCategory(cat.id)">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

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
  deleteCategory as apiDeleteCategory,
  updateCategoryImage,
} from '@/services/apiService';
import { useAuthStore } from '@/stores/authStore';
import { useToast } from 'vue-toastification';
import CategoryFormModal from '@/components/Admin/AdminCategoryFormModal.vue';

const auth = useAuthStore();
const categories = ref([]);
const showCreateModal = ref(false);
const editingCategory = ref(null);
const isLoading = ref(false);
const toast = useToast();
const baseUrl = import.meta.env.VITE_API_URL;

const loadCategories = async () => {
  if (!auth.user || !auth.user.id) return;
  isLoading.value = true;
  try {
    const res = await getCategoriesByUser(auth.user.id);
    categories.value = res.map(cat => ({
      ...cat,
      image_url: cat.image_path
        ? `${baseUrl}${cat.image_path.startsWith('/') ? '' : '/'}${cat.image_path}`
        : null
    }));
  } catch (error) {
    console.error("Erro ao carregar categorias:", error);
    toast.error("Erro ao carregar categorias.");
  } finally {
    isLoading.value = false;
  }
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
  toast.success('Categoria salva com sucesso!');
}

const deleteCategory = async (id) => {
  if (confirm('Deseja realmente excluir esta categoria? Esta ação não pode ser desfeita.')) {
    try {
      await apiDeleteCategory(id);
      await loadCategories();
      toast.success('Categoria excluída com sucesso!');
    } catch (error) {
      console.error("Erro ao excluir categoria:", error);
      toast.error("Erro ao excluir categoria.");
    }
  }
};

const uploadImage = async (id, file) => {
  try {
    await updateCategoryImage(id, file);
    await loadCategories();
    toast.success('Imagem da categoria atualizada com sucesso!');
  } catch (error) {
    console.error("Erro ao fazer upload da imagem:", error);
    toast.error("Erro ao fazer upload da imagem.");
  }
};

onMounted(loadCategories);
</script>

<style scoped>
.category-management {
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

.btn-gradient-add {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 2px 12px #667eea30;
}

.btn-gradient-add:hover {
  transform: translateY(-2px) scale(1.03);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
  color: white;
}

.add-icon {
  font-size: 1.2rem;
}

.add-label {
  font-weight: 500;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 2rem;
  margin-top: 0.5rem;
}

.category-card {
  background: linear-gradient(135deg, #181e2a 0%, #232e47 100%);
  border: 1px solid #232e47;
  border-radius: 1.2rem;
  padding: 1.2rem 1.2rem 1rem 1.2rem;
  box-shadow: 0 4px 20px #232e4720;
  transition: all 0.25s cubic-bezier(.4,2,.3,1);
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
}

.category-card:hover {
  transform: translateY(-6px) scale(1.025);
  box-shadow: 0 12px 32px #399bff30;
  border-color: #399bff;
}

.category-card-imgbox {
  position: relative;
  margin-bottom: 1rem;
  border-radius: 0.7rem;
  overflow: hidden;
  background: #232e47;
  box-shadow: 0 2px 12px #232e4720;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 120px;
}

.category-card-img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 0.7rem;
  background: #181e2a;
  border: 2px solid #399bff40;
  box-shadow: 0 2px 8px #399bff20;
  transition: transform 0.2s;
}

.category-card-img:hover {
  transform: scale(1.08);
}

.upload-label {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: linear-gradient(135deg, #399bff 0%, #42a5f5 100%);
  color: white;
  padding: 0.45rem;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.1rem;
  box-shadow: 0 2px 8px #399bff30;
  border: 2px solid #fff2;
  z-index: 2;
}

.upload-label:hover {
  background: linear-gradient(135deg, #42a5f5 0%, #399bff 100%);
  transform: scale(1.12);
}

.category-name {
  font-size: 1.1rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.2rem;
  letter-spacing: 0.5px;
}

.category-desc {
  color: #b0b7c3;
  font-size: 0.95rem;
  line-height: 1.4;
  min-height: 36px;
  max-height: 48px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.category-card-actions {
  margin-top: 0.7rem;
}

.btn-outline-accent {
  color: #399bff;
  border-color: #399bff;
  background: transparent;
  transition: all 0.2s;
  font-weight: 600;
  border-radius: 0.5rem;
  padding: 0.4rem 0.8rem;
}

.btn-outline-accent:hover {
  background-color: #399bff;
  border-color: #399bff;
  color: #fff;
}

.btn-outline-danger {
  color: #f56565;
  border-color: #f56565;
  background: transparent;
  transition: all 0.2s;
  font-weight: 600;
  border-radius: 0.5rem;
  padding: 0.4rem 0.8rem;
}

.btn-outline-danger:hover {
  background-color: #f56565;
  border-color: #f56565;
  color: #fff;
}

.spinner-border {
  color: #64b5f6;
}

/* Responsividade */
@media (max-width: 1024px) {
  .category-grid {
    gap: 1.2rem;
  }
  .category-card-imgbox {
    height: 90px;
  }
  .category-card-img {
    width: 70px;
    height: 70px;
  }
}

@media (max-width: 768px) {
  .category-management {
    padding: 1rem 0.5rem;
  }
  .text-primary-ggtech {
    font-size: 1.8rem;
  }
  .btn-gradient-add {
    width: 100%;
    justify-content: center;
  }
  .category-grid {
    gap: 0.8rem;
  }
  .category-card {
    padding: 0.8rem 0.7rem 0.7rem 0.7rem;
  }
  .category-card-imgbox {
    height: 60px;
  }
  .category-card-img {
    width: 44px;
    height: 44px;
  }
  .category-desc {
    min-height: 24px;
    max-height: 32px;
    font-size: 0.85rem;
  }
}
</style>