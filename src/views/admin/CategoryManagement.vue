<template>
  <div class="category-management p-4">
    <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-4">
      <h2 class="fw-bold text-primary-ggtech m-0">Gerenciamento de Categorias</h2>
      <!-- Botão customizado conforme imagem enviada -->
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
        <div class="row g-4">
          <div 
            v-for="cat in categories"
            :key="cat.id"
            class="col-12 col-sm-6 col-md-4"
          >
            <div class="category-card">
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
:root {
  --admin-bg-primary: #0f0f23;
  --admin-bg-secondary: #181828;
  --admin-accent-primary: #00ffe1;
  --admin-accent-secondary: #8f5fe8;
  --admin-text-primary: #ffffff;
  --admin-text-muted: rgba(255,255,255,0.65);
  --admin-card-radius: 1.2em;
  --admin-shadow-medium: 0 6px 24px rgba(0,0,0,0.16);
  --admin-outline-accent: 2px solid var(--admin-accent-primary);
}


.btn-gradient-add {
  background: linear-gradient(90deg, #15fbe3 0%, #8f5fe8 100%);
  color: #fff;
  border: none;
  font-size: 1.08rem;
  border-radius: 6px;
  font-weight: 500;
  padding: 0.55em 1.6em;
  display: flex;
  align-items: center;
  gap: 9px;
  box-shadow: 0 1px 7px rgba(0,255,225,0.18);
  transition: filter 0.16s, transform 0.13s;
  letter-spacing: 0.01em;
}
.btn-gradient-add:hover {
  filter: brightness(1.08);
  transform: translateY(-1px) scale(1.01);
}
.add-icon {
  font-size: 1.15em;
}
.add-label {
  font-size: 1em;
  font-weight: 500;
}

.category-management {
  background: var(--admin-bg-primary);
  min-height: calc(100vh - 70px);
  color: var(--admin-text-primary);
  font-family: 'Inter', Arial, Helvetica, sans-serif;
  padding: 2rem 4vw;
}

.text-primary-ggtech {
  color: var(--admin-accent-primary) !important;
  font-weight: 700;
  text-shadow: 0 0 18px rgba(0, 255, 225, 0.45);
  font-size: 2rem;
  letter-spacing: 0.04em;
}

.category-card {
  background: var(--admin-bg-secondary);
  border-radius: var(--admin-card-radius);
  box-shadow: var(--admin-shadow-medium);
  padding: 1.5rem;
  transition: box-shadow 0.2s, transform 0.2s;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  position: relative;
  min-height: 320px;
}
.category-card:hover {
  box-shadow: 0 12px 30px rgba(0,255,225,0.11), var(--admin-shadow-medium);
  transform: translateY(-3px) scale(1.015);
}

.category-card-imgbox {
  position: relative;
  width: 84px;
  height: 84px;
  margin-bottom: 0.5em;
  align-self: center;
}
.category-card-img {
  width: 84px;
  height: 84px;
  object-fit: cover;
  border-radius: 50%;
  border: 3px solid var(--admin-accent-primary);
  background: #fff;
  box-shadow: 0 2px 16px rgba(0,255,225,0.14);
}
.upload-label {
  position: absolute;
  bottom: 2px; right: 2px;
  background: var(--admin-accent-primary);
  color: #fff;
  border-radius: 50%;
  width: 28px; height: 28px;
  font-size: 1.2em;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 0 8px rgba(0,255,225,0.18);
  border: 2px solid #fff;
  transition: background 0.2s;
}
.upload-label:hover {
  background: var(--admin-accent-secondary);
}

.category-card-info {
  text-align: center;
}
.category-name {
  font-size: 1.22em;
  font-weight: 700;
  color: var(--admin-accent-primary);
  margin-bottom: 0.15em;
  letter-spacing: 0.03em;
}
.category-desc {
  font-size: 1em;
  color: var(--admin-text-muted);
  min-height: 2.2em;
}

.category-card-actions {
  position: absolute;
  top: 1.1em; right: 1.3em;
  z-index: 2;
}
.btn-outline-accent {
  border: var(--admin-outline-accent);
  color: var(--admin-accent-primary);
  background: transparent;
  border-radius: 12px;
  padding: 0.35em 0.8em;
  font-size: 1em;
  transition: background 0.15s, color 0.15s;
}
.btn-outline-accent:hover {
  background: var(--admin-accent-primary);
  color: #fff;
}

.btn-outline-danger {
  border: 2px solid #ff6b6b;
  color: #ff6b6b;
  background: transparent;
  border-radius: 12px;
  padding: 0.35em 0.8em;
  font-size: 1em;
  transition: background 0.15s, color 0.15s;
}
.btn-outline-danger:hover {
  background: #ff6b6b;
  color: #fff;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* RESPONSIVO */
@media (max-width: 900px) {
  .category-card { min-height: 260px; padding: 1rem;}
  .category-management { padding: 2rem 2vw; }
  .category-card-img, .category-card-imgbox { width: 68px; height: 68px;}
}
@media (max-width: 600px) {
  .category-management { padding: 1rem 1vw; }
  .category-card { min-height: 210px; }
  .category-card-img, .category-card-imgbox { width: 54px; height: 54px;}
  .category-card-actions { top: 0.9em; right: 1em; }
}
</style>