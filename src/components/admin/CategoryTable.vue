<template> 
  <div class="category-table-container my-4">
    <table class="table table-dark table-striped table-hover rounded-table align-middle">
      <thead>
        <tr>
          <th class="text-primary-ggtech">Nome</th>
          <th class="text-primary-ggtech">Imagem</th>
          <th class="text-end text-primary-ggtech">Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="cat in categories" :key="cat.id">
          <td class="fw-bold fs-6 category-name-cell">{{ cat.name }}</td>
          <td>
            <img
              v-if="cat.image_url"
              :src="cat.image_url"
              alt="Imagem da Categoria"
              class="img-thumbnail category-thumb"
            />
          </td>
          <td class="text-end">
            <input
              type="file"
              class="form-control form-control-sm d-inline-block w-auto me-2 upload-input"
              @change="e => $emit('upload-image', cat.id, e.target.files[0])"
            />
            <button class="btn btn-sm btn-info me-2" @click="$emit('edit', cat)">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="btn btn-sm btn-danger" @click="$emit('delete', cat.id)">
              <i class="bi bi-trash"></i>
            </button>
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
}
.table-dark {
  --bs-table-bg: var(--admin-bg-secondary);
  --bs-table-striped-bg: var(--admin-bg-tertiary);
  --bs-table-hover-bg: rgba(255, 255, 255, 0.05);
  color: var(--admin-text-primary);
}
.rounded-table {
  border-collapse: separate;
  border-spacing: 0;
  border-radius: 1rem;
  overflow: hidden;
}
th, td {
  padding: 1rem;
  vertical-align: middle;
  border-color: var(--admin-border);
  font-size: 1.05rem;
}
.text-primary-ggtech {
  color: var(--admin-accent-primary) !important;
  font-weight: 700;
  letter-spacing: 0.5px;
  font-size: 1.1rem;
}
.category-thumb {
  width: 56px;
  height: 56px;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid var(--admin-accent-primary);
  box-shadow: 0 2px 8px rgba(0, 255, 225, 0.15);
}
.upload-input {
  background: var(--admin-bg-tertiary);
  color: var(--admin-accent-primary);
  border: 1px solid var(--admin-accent-primary);
  border-radius: 1rem;
  font-size: 0.95rem;
  padding: 0.3rem 0.7rem;
  margin-right: 0.5rem;
  font-family: 'Inter', Arial, sans-serif;
}
.btn-info {
  background: var(--admin-accent-primary);
  border: 1px solid var(--admin-accent-primary);
  color: var(--admin-bg-primary);
  font-weight: 600;
  font-family: 'Inter', Arial, sans-serif;
  border-radius: 1.2rem;
  transition: all 0.3s ease;
}
.btn-info:hover {
  background: var(--admin-accent-secondary);
  border-color: var(--admin-accent-secondary);
  transform: translateY(-1px);
}
.btn-danger {
  background: var(--admin-danger);
  border: 1px solid var(--admin-danger);
  color: #fff;
  font-weight: 600;
  font-family: 'Inter', Arial, sans-serif;
  border-radius: 1.2rem;
  transition: all 0.3s ease;
}
.btn-danger:hover {
  background: #e53e3e;
  border-color: #e53e3e;
  transform: translateY(-1px);
}
.category-name-cell {
  font-family: 'Inter', Arial, sans-serif;
  font-weight: 600;
  font-size: 1.1rem;
  color: var(--admin-text-primary);
  letter-spacing: 0.2px;
}
thead th {
  background: var(--admin-bg-secondary) !important;
  color: var(--admin-text-primary) !important;
  font-weight: 700;
  letter-spacing: 0.5px;
  font-size: 1.1rem;
}
tbody tr, .table-dark tbody > tr {
  background: var(--admin-bg-secondary) !important;
}
.table-dark tbody > tr > td {
  background: var(--admin-bg-secondary) !important;
  color: var(--admin-text-primary) !important;
}
.btn-info i, .btn-danger i {
  color: #fff;
  transition: color 0.2s;
}
.btn-info:hover i {
  color: var(--admin-accent-secondary);
}
.btn-danger:hover i {
  color: #fff;
}
</style>

<style>
/* Sistema de Cores Padronizado para Admin */
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
</style>