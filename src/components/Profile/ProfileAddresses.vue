<template>
  <section class="card addresses-card border-0 shadow-sm modern-addresses-card">
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2 class="h5 fw-bold text-blue mb-0">Meus Endereços</h2>
        <button @click="$emit('add')" class="btn btn-green btn-sm modern-btn" title="Novo Endereço">
          <i class="bi bi-plus-lg"></i>
        </button>
      </div>
      <div v-if="addresses.length === 0" class="alert alert-dark py-2">Nenhum endereço cadastrado.</div>
      <ul v-else class="list-group addresses-list">
        <li v-for="addr in addresses" :key="addr.id" class="list-group-item d-flex justify-content-between align-items-center bg-address border-0 shadow-sm rounded-3 mb-3 px-3 py-3 animate-fade modern-list-item">
          <span class="fw-medium modern-address-text">
            {{ addr.street }}, {{ addr.number }} - {{ addr.city }}, {{ addr.state }} ({{ addr.zip }})
          </span>
          <div class="d-flex gap-2">
            <button @click="$emit('edit', addr)" class="btn btn-purple btn-sm px-3 modern-btn" title="Editar">
              <i class="bi bi-pencil"></i>
            </button>
            <button @click="$emit('delete', addr.id)" class="btn btn-danger btn-sm px-3 modern-btn" title="Excluir">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>
<script setup>
const props = defineProps({ addresses: Array })
</script>
<style scoped>
.addresses-card {
  border-radius: 12px;
  background: #ffffff; /* Fundo branco */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); /* Sombra leve */
  border: 1.5px solid #e0e7ff; /* Borda azul clara */
  padding: 1.5rem;
}

.list-group-item {
  background: #f8fafc; /* Fundo claro */
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05); /* Sombra leve */
  padding: 1rem;
  transition: all 0.2s ease-in-out;
}

.list-group-item:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1); /* Sombra mais forte */
  transform: translateY(-4px);
}

.btn-green {
  background: linear-gradient(90deg, #00c853, #b2ff59); /* Gradiente verde */
  color: #fff;
}

.btn-green:hover {
  filter: brightness(1.1);
}

.btn-purple {
  background: linear-gradient(90deg, #6a5ae0, #ff6b6b); /* Gradiente roxo → laranja */
  color: #fff;
}

.btn-purple:hover {
  filter: brightness(1.1);
}
.text-blue { color: #399bff;}
.modern-list-item {
  transition: box-shadow 0.2s, background 0.2s;
  border-radius: 14px !important;
  background: #f3f4f8 !important;
}
.modern-list-item:hover {
  box-shadow: 0 4px 16px #399bff30;
  background: #eaf6ff !important;
}
@keyframes fadein {
  from { opacity: 0; transform: translateY(10px);}
  to { opacity: 1; transform: translateY(0);}
}
.animate-fade { animation: fadein 0.2s; }
</style>