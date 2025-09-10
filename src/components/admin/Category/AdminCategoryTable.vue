<template>
  <div class="category-table-container my-4">
    <table class="table table-dark rounded-table align-middle text-white">
      <thead>
        <tr>
          <th class="text-primary-ggtech">Nome</th>
          <th class="text-primary-ggtech text-center">Imagem</th>
          <th class="text-primary-ggtech text-center">Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="cat in categories" :key="cat.id" class="category-row">
          <td class="fw-bold fs-6 category-name-cell">{{ cat.name }}</td>
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
              <button class="btn btn-edit" @click="$emit('edit', cat)" title="Editar Categoria">
                <i class="bi bi-pencil"></i>
              </button>
              <button class="btn btn-delete" @click="$emit('delete', cat.id)" title="Excluir Categoria">
                <i class="bi bi-trash"></i>
              </button>
              <label class="upload-label" title="Enviar nova imagem">
                <input
                  type="file"
                  accept="image/*"
                  class="upload-input"
                  @change="e => $emit('upload-image', cat.id, e.target.files[0])"
                />
                <i class="bi bi-image"></i> <!-- Ícone de imagem para sugerir upload de imagem -->
              </label>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  categories: {
    type: Array,
    required: true
  }
});
defineEmits(['edit', 'delete', 'upload-image']);
</script>

<style scoped>

.category-table-container {
  background: var(--admin-bg-secondary); 
  border-radius: 1.5rem;
  box-shadow: 0 2px 16px var(--admin-shadow-light);
  padding: 2rem 1.5rem;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  border-radius: 1rem; 
  overflow: hidden; 
}

thead th {
  background: var(--admin-bg-tertiary); 
  color: var(--admin-accent-primary);
  font-weight: 700;
  letter-spacing: 0.5px;
  font-size: 1.1rem;
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid var(--admin-border-light); 
}

thead tr:first-child th:first-child {
  border-top-left-radius: 1rem;
}
thead tr:first-child th:last-child {
  border-top-right-radius: 1rem;
}

tbody tr.category-row {
  background: var(--admin-bg-secondary); 
  transition: background-color 0.3s ease;
}

tbody tr.category-row:nth-child(odd) {
  background: var(--admin-bg-tertiary); 
}

tbody tr.category-row:hover {
  background-color: rgba(0, 255, 225, 0.1); 
}

td {
  padding: 1rem;
  vertical-align: middle;
  border-bottom: 1px solid var(--admin-border-light); 
  font-size: 1rem;
  text-align: left;
  color: var(--admin-text-primary);
}

tbody tr:last-child td {
  border-bottom: none;
}

.category-name-cell {
  font-weight: 600;
  font-size: 1.1rem;
  color: var(--admin-text-primary);
  letter-spacing: 0.2px;
}

td.text-center {
  text-align: center;
}

.category-thumb {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid var(--admin-accent-primary);
  box-shadow: 0 2px 8px rgba(0, 255, 225, 0.3);
  transition: transform 0.3s ease;
}

.category-thumb:hover {
  transform: scale(1.05);
}

.no-image-text {
  font-size: 0.85rem;
  color: var(--admin-text-muted);
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
  background-color: var(--admin-accent-primary);
}

.btn-edit:hover {
  background-color: var(--admin-accent-secondary);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 255, 225, 0.4);
}

.btn-delete {
  background-color: var(--admin-danger);
}

.btn-delete:hover {
  background-color: #e53e3e;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 79, 143, 0.4);
}

.upload-label {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  border: 2px dashed var(--admin-accent-primary);
  color: var(--admin-accent-primary);
  width: 70px; 
  height: 70px; 
  border-radius: 12px; 
  cursor: pointer;
  font-size: 1.8rem; /* Ícone maior */
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2); 
  padding: 0.5rem; 
}

.upload-label:hover {
  background-color: rgba(0, 230, 230, 0.1); 
  color: var(--admin-accent-secondary); 
  border-color: var(--admin-accent-secondary);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 255, 225, 0.4);
}

.upload-input {
  display: none; 
}

/* Responsividade para telas menores */
@media (max-width: 768px) {
  .category-table-container {
    padding: 1.5rem 1rem;
  }
  thead th,
  td {
    padding: 0.8rem;
    font-size: 0.9rem;
  }
  .category-name-cell {
    font-size: 1rem;
  }
  .category-thumb {
    width: 50px;
    height: 50px;
  }
  .action-group {
    gap: 0.5rem;
  }
  .btn-edit,
  .btn-delete {
    width: 32px;
    height: 32px;
    font-size: 1.1rem;
  }
  .upload-label { 
    width: 55px; 
    height: 55px; 
    font-size: 1.2rem; 
  }
}
</style>