<template>
  <div class="category-management p-4">
    <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-4">
      <h2 class="fw-bold text-primary-ggtech m-0">Gerenciamento de Categorias</h2>
      <button class="btn btn-gradient-add" @click="showCreateModal = true">
        <span class="add-icon"><i class="bi bi-plus-circle"></i></span>
        <span class="add-label">Adicionar Nova Categoria</span>
      </button>
    </div>

    <!-- Barra de busca -->
    <div class="d-flex flex-wrap gap-3 align-items-center mb-4">
      <div class="input-group search-bar">
        <input
          type="text"
          class="form-control search-input"
          placeholder="Buscar categoria por nome..."
          v-model="searchTerm"
          autocomplete="off"
        />
        <span class="input-group-text search-icon"><i class="bi bi-search"></i></span>
      </div>
      <div class="category-stats ms-auto">
        <span class="stats-badge">
          <i class="bi bi-grid me-2"></i>
          Total: <strong>{{ filteredCategories.length }}</strong>
        </span>
      </div>
    </div>

    <div v-if="isLoading" class="d-flex justify-content-center my-5">
      <div class="spinner-border text-primary-ggtech" role="status">
        <span class="visually-hidden">Carregando...</span>
      </div>
    </div>
    
    <Transition name="fade" mode="out-in">
      <div v-if="!isLoading" :key="filteredCategories.length">
        <div v-if="filteredCategories.length === 0" class="alert alert-info text-center">
          <i class="bi bi-info-circle me-2"></i>
          Nenhuma categoria encontrada.
        </div>
        <div v-else class="category-table-responsive">
          <table class="table table-dark rounded-table align-middle text-white category-table">
            <thead>
              <tr>
                <th class="text-primary-ggtech">Nome</th>
                <th class="text-primary-ggtech text-center">Produtos</th>
                <th class="text-primary-ggtech text-center">Imagem</th>
                <th class="text-primary-ggtech text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="cat in filteredCategories" :key="cat.id" class="category-row">
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
import { ref, onMounted, computed } from 'vue';
import {
  getCategoriesByUser,
  getCategories,
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
const searchTerm = ref('');

const loadCategories = async () => {
  isLoading.value = true;
  try {
    const res = await getCategories(); // Carrega todas as categorias
    categories.value = res.map(cat => ({
      ...cat,
      image_url: cat.image_path
        ? `${baseUrl}${cat.image_path.startsWith('/') ? '' : '/'}${cat.image_path}`
        : null,
      product_count: typeof cat.product_count === 'number' ? cat.product_count : (cat.products?.length ?? 0),
      is_active: typeof cat.is_active === 'boolean' ? cat.is_active : true
    }));
  } catch (error) {
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

const filteredCategories = computed(() => {
  if (!searchTerm.value.trim()) return categories.value;
  const term = searchTerm.value.toLowerCase();
  return categories.value.filter(cat => 
    cat.name?.toLowerCase().includes(term)
  );
});

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

.search-bar {
  max-width: 400px;
}

.search-input {
  border-right: none;
  background-color: #1a2332;
  border: 1px solid #374151;
  color: #e8eaed;
  border-radius: 0.5rem 0 0 0.5rem;
}

.search-input:focus {
  background-color: #1a2332;
  border-color: #64b5f6;
  color: #e8eaed;
  box-shadow: 0 0 0 0.2rem rgba(100, 181, 246, 0.25);
  outline: none;
}

.search-icon {
  background-color: #1a2332;
  border: 1px solid #374151;
  border-left: none;
  color: #64b5f6;
  border-radius: 0 0.5rem 0.5rem 0;
}

.stats-badge {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.95rem;
  box-shadow: 0 2px 12px #667eea30;
  display: inline-flex;
  align-items: center;
}

.alert-info {
  background: linear-gradient(135deg, #181e2a 0%, #23233a 100%);
  border: 1px solid #374151;
  border-radius: 1rem;
  color: #b0b7c3;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.category-table-responsive {
  /* fundo opaco e sem blur para máximo contraste */
  background: #0b1220;
  border-radius: 1.5rem;
  box-shadow: 0 6px 30px rgba(0,0,0,0.65);
  padding: 2rem 1.5rem;
  overflow-x: auto;
  margin-bottom: 2rem;
  border: 1px solid rgba(255,255,255,0.04);
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
}

/* Cabeçalho totalmente opaco, alto contraste e fixo no topo do container */
.category-table thead th {
  background-color: #0f1724 !important;
  color: #ffffff !important;
  font-size: 1.05rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  padding: 1rem 0.9rem !important;
  text-align: center;
  text-shadow: none !important;
  filter: none !important;
  opacity: 1 !important;
  border-bottom: 2px solid rgba(255,255,255,0.03);
  position: sticky;
  top: 0;
  z-index: 20;
}

/* Remove gradientes/clip que podem "borrar" o texto do th */
.category-table th,
.category-table thead th,
.category-table th .text-primary-ggtech {
  background-image: none !important;
  -webkit-background-clip: initial !important;
  -webkit-text-fill-color: initial !important;
}

/* Células com alto contraste e sem sombras que atrapalham leitura */
.category-table td {
  color: #e6eef8 !important;
  font-size: 1rem;
  padding: 0.95rem 0.9rem !important;
  text-shadow: none !important;
}

/* Garante que a coluna "Nome" fique alinhada e legível */
.category-name-cell {
  color: #ffffff !important;
  text-align: left;
  padding-left: 1.2rem;
}

/* Responsividade: mantém contraste em telas menores */
@media (max-width: 991.98px) {
  .category-table-responsive { padding: 1.2rem 0.8rem; }
  .category-table thead th, .category-table td { padding: 0.75rem 0.6rem; font-size: 0.95rem; }
  .category-name-cell { padding-left: 0.8rem; }
}

.category-table th, .category-table td {
  border: none;
}

.category-table th {
  background: linear-gradient(90deg, #1b2233 0%, #2c3e68 100%); /* Gradiente mais escuro */
  color: #ffffff; /* Change text color to white for better visibility */
  font-size: 1.1rem; /* Aumentei o tamanho da fonte */
  font-weight: 800; /* Negrito para maior destaque */
  letter-spacing: 0.04em;
  padding: 1rem 0.7rem;
  text-align: center;
  text-shadow: 0 0 4px rgba(0, 0, 0, 0.6); /* Sombra para destacar o texto */
  border-top: none;
  opacity: 1 !important; /* Remove qualquer opacidade */
  filter: none !important; /* Remove o blur */
  backdrop-filter: none !important; /* Remove o efeito de desfoque */
}

.category-table td {
  background: transparent;
  color: #e8eaed; /* Texto claro */
  font-size: 1rem; /* Ajustei o tamanho da fonte */
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
  color: #ffffff; /* Texto branco puro */
  letter-spacing: 0.2px;
  text-align: left;
}

.inactive-cat {
  opacity: 0.5;
  text-decoration: line-through;
}

.badge-products {
  background: linear-gradient(90deg, #232e47 0%, #64b5f6 100%);
  color: #ffffff; /* Texto branco puro */
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
  font-size: 0.9rem; /* Aumentei o tamanho da fonte */
  color: #b0b7c3; /* Texto cinza claro */
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
  .category-table thead th, .category-table td {
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