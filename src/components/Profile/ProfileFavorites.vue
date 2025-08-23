<template>
  <section class="card border-0 shadow-sm favorites-card modern-favorites-card">
    <div class="card-body">
      <h2 class="h5 fw-bold text-blue mb-3">Favoritos</h2>
      <div v-if="favorites.length === 0" class="alert alert-dark py-2">Nenhum favorito.</div>
      <ul v-else class="list-group favorites-list">
        <li v-for="item in favorites" :key="item.id" class="list-group-item bg-dark border-0 shadow-sm rounded-3 mb-3 px-3 py-3 animate-fade modern-list-item">
          <span class="fw-semibold text-light">{{ item.name ?? 'Produto' }}</span>
          <span class="badge bg-purple modern-badge ms-2">ID: {{ item.id }}</span>
        </li>
      </ul>
    </div>
  </section>
</template>
<script setup>
const props = defineProps({ favorites: Array })
</script>
<style scoped>
.favorites-card.modern-favorites-card {
  border-radius: 18px;
  background: rgba(24,30,42,0.85);
  box-shadow: 0 8px 32px 0 #232e4780;
  backdrop-filter: blur(8px);
  border: 1.5px solid #232e47;
}
.bg-dark { background: #181e2a !important;}
.bg-purple { background: #a470ff !important; color: #fff !important; }
.text-blue { color: #50b8fe;}
.modern-badge {
  font-size: 0.92rem;
  border-radius: 8px;
  letter-spacing: 0.5px;
  box-shadow: 0 1px 6px #232e4720;
  border: 1.5px solid #232e47;
  background: rgba(80,184,254,0.08);
}
.modern-list-item {
  transition: box-shadow 0.2s, background 0.2s;
  border-radius: 14px !important;
}
.modern-list-item:hover {
  box-shadow: 0 4px 16px #399bff30;
  background: #232e47 !important;
}
@keyframes fadein {
  from { opacity: 0; transform: translateY(12px);}
  to { opacity: 1; transform: translateY(0);}
}
.animate-fade { animation: fadein 0.2s; }
</style>