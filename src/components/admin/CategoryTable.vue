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
                <i class="bi bi-upload"></i>
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
}

thead th {
  background: var(--admin-bg-tertiary);
  color: var(--admin-accent-primary);
  font-weight: 700;
  letter-spacing: 0.5px;
  font-size: 1.1rem;
  padding: 1rem;
  text-align: left;
}

tbody tr.category-row {
  background: var(--admin-bg-secondary);
  transition: background-color 0.3s ease;
}

tbody tr.category-row:nth-child(odd) {
  background: var(--admin-bg-tertiary);
}

tbody tr.category-row:hover {
  background-color: rgba(0, 255, 225, 0.15);
}

td {
  padding: 1rem;
  vertical-align: middle;
  border-color: var(--admin-border-light);
  font-size: 1rem;
  text-align: left;
  color: var(--admin-text-primary);
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
  gap: 0.6rem;
}

.btn-edit,
.btn-delete {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1.2rem;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.btn-edit {
  background-color: var(--admin-accent-primary);
}

.btn-edit:hover {
  background-color: var(--admin-accent-secondary);
  transform: translateY(-2px);
}

.btn-delete {
  background-color: var(--admin-danger);
}

.btn-delete:hover {
  background-color: #e53e3e;
  transform: translateY(-2px);
}

/* Upload botão estilizado */
.upload-label {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--admin-bg-tertiary);
  border: 1.5px solid var(--admin-accent-primary);
  color: var(--admin-accent-primary);
  padding: 0.3rem 0.6rem;
  border-radius: 50%;
  cursor: pointer;
  width: 36px;
  height: 36px;
  font-size: 1.3rem;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.upload-label:hover {
  background-color: var(--admin-accent-primary);
  color: var(--admin-bg-primary);
}

.upload-input {
  display: none;
}
</style>
