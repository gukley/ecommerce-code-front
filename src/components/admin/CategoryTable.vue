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
  background: linear-gradient(145deg, #23233a, #1a1a2e);
  border-radius: 1.5rem;
  box-shadow: 0 2px 16px rgba(143, 95, 232, 0.10);
  padding: 2rem 1.5rem;
}

.table-dark {
  --bs-table-bg: #2a2a3e;
  --bs-table-striped-bg: #3a3a4e;
  --bs-table-hover-bg: #4a4a5e;
  color: white;
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
  border-color: #3f3f50;
  font-size: 1.05rem;
}

.text-primary-ggtech {
  color: #00ffe1 !important;
  font-weight: 700;
  letter-spacing: 0.5px;
  font-size: 1.1rem;
}

.category-thumb {
  width: 56px;
  height: 56px;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid #8f5fe8;
  box-shadow: 0 2px 8px rgba(143, 95, 232, 0.10);
}

.upload-input {
  background: #23233a;
  color: #8f5fe8;
  border: 1px solid #8f5fe8;
  border-radius: 1rem;
  font-size: 0.95rem;
  padding: 0.3rem 0.7rem;
  margin-right: 0.5rem;
  font-family: 'Poppins', Arial, sans-serif;
}

.btn-info {
  background: linear-gradient(90deg, #00ffe1 0%, #8f5fe8 100%);
  border: none;
  color: #1a1a2e;
  font-weight: 600;
  font-family: 'Poppins', Arial, sans-serif;
  border-radius: 1.2rem;
  transition: all 0.2s cubic-bezier(.4,2,.3,1);
}
.btn-info:hover {
  background: linear-gradient(90deg, #8f5fe8 0%, #00ffe1 100%);
  color: #23233a;
}

.btn-danger {
  background: linear-gradient(90deg, #f44336 0%, #d32f2f 100%);
  border: none;
  color: white;
  font-weight: 600;
  font-family: 'Poppins', Arial, sans-serif;
  border-radius: 1.2rem;
  transition: all 0.2s cubic-bezier(.4,2,.3,1);
}
.btn-danger:hover {
  background: linear-gradient(90deg, #d32f2f 0%, #f44336 100%);
  color: #fff;
}

.category-name-cell {
  font-family: 'Poppins', Arial, sans-serif;
  font-weight: 600;
  font-size: 1.1rem;
  color: #fff;
  letter-spacing: 0.2px;
}
</style>