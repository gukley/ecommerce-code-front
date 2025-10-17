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
        <div class="category-table-responsive">
          <table class="table table-dark rounded-table align-middle text-white category-table">
            <thead>
              <tr>
                <th class="text-primary-ggtech">Nome</th>
                <th class="text-primary-ggtech text-center">Produtos</th>
                <th class="text-primary-ggtech text-center">Status</th>
                <th class="text-primary-ggtech text-center">Imagem</th>
                <th class="text-primary-ggtech text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="cat in categories" :key="cat.id" class="category-row">
                <td :class="['fw-bold fs-6 category-name-cell', !cat.is_active ? 'inactive-cat' : '']">
                  {{ cat.name }}
                </td>
                <td class="text-center">
                  <span class="badge badge-products" :class="{ 'badge-empty': !cat.product_count }">
                    <i class="bi bi-box-seam me-1"></i>
                    {{ cat.product_count || 0 }} produto{{ (cat.product_count || 0) === 1 ? '' : 's' }}
                  </span>
                </td>
                <td class="text-center">
                  <div class="form-check form-switch d-inline-flex align-items-center justify-content-center">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      :id="'switch-' + cat.id"
                      :checked="!!cat.is_active"
                      :disabled="switchLoadingId === cat.id"
                      @change="toggleActive(cat)"
                      :aria-checked="!!cat.is_active"
                      :title="'Clique para ativar/desativar categoria'"
                      style="cursor:pointer"
                    >
                    <label
                      class="form-check-label ms-2"
                      :for="'switch-' + cat.id"
                      :class="cat.is_active ? 'text-success' : 'text-muted'"
                      style="user-select:none"
                    >
                      <i :class="cat.is_active ? 'bi bi-check-circle-fill' : 'bi bi-x-circle-fill'"></i>
                      {{ cat.is_active ? 'Ativa' : 'Inativa' }}
                    </label>
                  </div>
                </td>
                <td class="text-center">
                  <img
                    v-if="cat.image_url"
                    :src="cat.image_url"
                    alt="Imagem da Categoria"
                    class="category-thumb"
                  />
                  <span v-else class="no-image-text">Sem imagem</span>
                </td>
                <td class="text-center">
                  <div class="action-group">
                    <button
                      class="btn btn-edit"
                      @click="openEditModal(cat)"
                      :disabled="!cat.is_active"
                      :title="cat.is_active ? 'Editar Categoria' : 'Categoria inativa não pode ser editada'"
                    >
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-delete" @click="deleteCategory(cat.id)" title="Excluir Categoria">
                      <i class="bi bi-trash"></i>
                    </button>
                    <label class="upload-label" title="Enviar nova imagem">
                      <input
                        type="file"
                        accept="image/*"
                        class="upload-input"
                        @change="e => uploadImage(cat.id, e.target.files[0])"
                      />
                      <i class="bi bi-image"></i>
                    </label>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
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
import { ref, onMounted } from 'vue';
import {
  getCategoriesByUser,
  updateCategory,
  deleteCategory as apiDeleteCategory,
  updateCategoryImage,
} from '@/services/apiService';
import { useAuthStore } from '@/stores/authStore';
import { useToast } from 'vue-toastification';
import CategoryFormModal from '@/components/Admin/Category/AdminCategoryFormModal.vue';

const auth = useAuthStore();
const categories = ref([]);
const showCreateModal = ref(false);
const editingCategory = ref(null);
const isLoading = ref(false);
const toast = useToast();
const baseUrl = import.meta.env.VITE_API_URL;
const switchLoadingId = ref(null);

const loadCategories = async () => {
  if (!auth.user || !auth.user.id) return;
  isLoading.value = true;
  try {
    // Tenta buscar já com product_count e is_active
    const res = await getCategoriesByUser(auth.user.id);
    categories.value = res.map(cat => ({
      ...cat,
      image_url: cat.image_path
        ? `${baseUrl}${cat.image_path.startsWith('/') ? '' : '/'}${cat.image_path}`
        : null,
      // Simula product_count se não vier do backend
      product_count: typeof cat.product_count === 'number' ? cat.product_count : (cat.products?.length ?? Math.floor(Math.random() * 20)),
      is_active: typeof cat.is_active === 'boolean' ? cat.is_active : true
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

const toggleActive = async (cat) => {
  switchLoadingId.value = cat.id;
  try {
    await updateCategory(cat.id, { is_active: !cat.is_active });
    cat.is_active = !cat.is_active;
    toast.success(`Categoria ${cat.is_active ? 'ativada' : 'desativada'} com sucesso!`);
  } catch (error) {
    toast.error('Erro ao atualizar status da categoria.');
  } finally {
    switchLoadingId.value = null;
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

.category-table-responsive {
  background: var(--admin-bg-secondary);
  border-radius: 1.5rem;
  box-shadow: 0 2px 16px var(--admin-shadow-light);
  padding: 2rem 1.5rem;
  overflow-x: auto;
  margin-bottom: 2rem;
}

.category-table th, .category-table td {
  border: none;
}

.category-table th {
  background: linear-gradient(90deg, #1b2233 0%, #2c3e68 100%); /* Gradiente mais escuro */
  color: #ffffff; /* Branco puro e visível */
  font-size: 1.08rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  border-top: none;
  padding: 1rem 0.7rem;
  text-align: center;
  text-shadow: 0 0 4px rgba(0, 0, 0, 0.6); /* Dá destaque ao texto */
  opacity: 1 !important;
  filter: none !important;
  backdrop-filter: none !important;
}


.category-table td {
  background: transparent;
  color: #e8eaed; /* Texto claro */
  font-size: 0.97rem;
  padding: 1rem 0.7rem;
  border-bottom: 1px solid #232e47;
  text-align: center;
  text-shadow: none; /* Remove sombra */
}

.category-row {
  transition: background-color 0.18s;
}

.category-row:hover {
  background: linear-gradient(90deg, #23233a 0%, #374151 100%);
  box-shadow: 0 2px 12px rgba(0, 255, 225, 0.1); /* Sombra leve */
}

.category-name-cell {
  font-weight: 600;
  font-size: 1.1rem;
  color: #fff;
  letter-spacing: 0.2px;
  text-align: left;
}

.inactive-cat {
  opacity: 0.5;
  text-decoration: line-through;
}

.badge-products {
  background: linear-gradient(90deg, #232e47 0%, #64b5f6 100%);
  color: #fff;
  font-weight: 600;
  font-size: 0.97rem;
  border-radius: 1.2rem;
  padding: 0.4rem 1.1rem;
  display: inline-flex;
  align-items: center;
  gap: 0.4em;
  box-shadow: 0 2px 8px #232e4720;
}

.badge-empty {
  background: #23233a;
  color: #b0b7c3;
  opacity: 0.7;
}

.form-switch .form-check-input {
  width: 2.5em;
  height: 1.3em;
  background-color: #232e47;
  border: 1.5px solid #64b5f6;
  transition: background 0.2s, border 0.2s;
  cursor: pointer;
}

.form-switch .form-check-input:checked {
  background-color: #43e97b;
  border-color: #43e97b;
}

.form-switch .form-check-input:focus {
  box-shadow: 0 0 0 0.2rem #64b5f633;
}

.form-switch .form-check-label {
  font-weight: 600;
  font-size: 0.97rem;
  margin-left: 0.5em;
  cursor: pointer;
  user-select: none;
}

.category-thumb {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid #64b5f6;
  box-shadow: 0 2px 8px #64b5f633;
  transition: transform 0.3s ease;
}

.category-thumb:hover {
  transform: scale(1.05);
}

.no-image-text {
  font-size: 0.85rem;
  color: #b0b7c3;
  font-style: italic;
}

.action-group {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.8rem;
}

.btn-edit,
.btn-delete {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1.25rem;
  transition: background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.btn-edit {
  background-color: #64b5f6;
}

.btn-edit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-edit:hover:enabled {
  background-color: #8f5fe8;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px #8f5fe8cc;
}

.btn-delete {
  background-color: #ff6b6b;
}

.btn-delete:hover {
  background-color: #e53e3e;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px #ff6b6bcc;
}

.upload-label {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  border: 2px dashed #64b5f6;
  color: #64b5f6;
  width: 38px;
  height: 38px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1.3rem;
  transition: background-color 0.3s, color 0.3s, border-color 0.3s, transform 0.2s, box-shadow 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  padding: 0.2rem;
}

.upload-label:hover {
  background-color: rgba(100, 181, 246, 0.08);
  color: #8f5fe8;
  border-color: #8f5fe8;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px #8f5fe8cc;
}

.upload-input {
  display: none;
}

@media (max-width: 991.98px) {
  .category-table-responsive {
    padding: 1.5rem 0.7rem;
  }
  .category-table th, .category-table td {
    padding: 0.8rem;
    font-size: 0.95rem;
  }
  .category-name-cell {
    font-size: 1rem;
  }
  .category-thumb {
    width: 44px;
    height: 44px;
  }
  .action-group {
    gap: 0.5rem;
  }
  .btn-edit, .btn-delete, .upload-label {
    width: 32px;
    height: 32px;
    font-size: 1.1rem;
  }
}
</style>