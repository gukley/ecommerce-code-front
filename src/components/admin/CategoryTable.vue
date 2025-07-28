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
  background: var(--admin-bg);
  border-radius: 1.5rem;
  box-shadow: 0 2px 16px rgba(0,0,0,0.10);
  padding: 2rem 1.5rem;
}
.table-dark {
  --bs-table-bg: var(--admin-bg-dark);
  --bs-table-striped-bg: var(--admin-bg-darker);
  --bs-table-hover-bg: var(--admin-bg-darkest);
  color: var(--admin-text);
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
  color: var(--admin-primary) !important;
  font-weight: 700;
  letter-spacing: 0.5px;
  font-size: 1.1rem;
}
.category-thumb {
  width: 56px;
  height: 56px;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid var(--admin-primary);
  box-shadow: 0 2px 8px rgba(0,255,225,0.10);
}
.upload-input {
  background: var(--admin-bg-dark);
  color: var(--admin-primary);
  border: 1px solid var(--admin-primary);
  border-radius: 1rem;
  font-size: 0.95rem;
  padding: 0.3rem 0.7rem;
  margin-right: 0.5rem;
  font-family: 'Poppins', Arial, sans-serif;
}
.btn-info {
  background: var(--admin-primary-dark);
  border: none;
  color: var(--admin-bg);
  font-weight: 600;
  font-family: 'Poppins', Arial, sans-serif;
  border-radius: 1.2rem;
  transition: all 0.2s cubic-bezier(.4,2,.3,1);
}
.btn-info:hover {
  background: #007cf0;
  color: #fff;
}
.btn-danger {
  background: var(--admin-danger);
  border: none;
  color: var(--admin-text);
  font-weight: 600;
  font-family: 'Poppins', Arial, sans-serif;
  border-radius: 1.2rem;
  transition: all 0.2s cubic-bezier(.4,2,.3,1);
}
.btn-danger:hover {
  background: var(--admin-danger-dark);
  color: #fff;
}
.category-name-cell {
  font-family: 'Poppins', Arial, sans-serif;
  font-weight: 600;
  font-size: 1.1rem;
  color: var(--admin-text);
  letter-spacing: 0.2px;
}
thead th {
  background: var(--admin-bg) !important;
  color: var(--admin-text) !important;
  font-weight: 700;
  letter-spacing: 0.5px;
  font-size: 1.1rem;
}
tbody tr, .table-dark tbody > tr {
  background: var(--admin-bg-dark) !important;
}
.table-dark tbody > tr > td {
  background: var(--admin-bg-dark) !important;
  color: var(--admin-text) !important;
}
.btn-info i, .btn-danger i {
  color: #fff;
  transition: color 0.2s;
}
.btn-info:hover i {
  color: #007cf0;
}
.btn-danger:hover i {
  color: #e53e3e;
}
</style>

<style>
:root {
  --admin-bg: #11111c;
  --admin-bg-dark: #181828;
  --admin-bg-darker: #23243a;
  --admin-bg-darkest: #23243a;
  --admin-primary: #007cf0;
  --admin-primary-dark: #005fa3;
  --admin-primary-gradient: linear-gradient(90deg, #007cf0 0%, #00ffe1 100%);
  --admin-danger: #e53e3e;
  --admin-danger-dark: #c53030;
  --admin-text: #fff;
  --admin-text-light: #e0e6ed;
  --admin-border: #23243a;
}
</style>