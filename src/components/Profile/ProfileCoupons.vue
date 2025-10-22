<template>
  <div class="profile-coupons-section">
    <h3 class="profile-coupons-title">
      <i class="bi bi-ticket-detailed"></i>
      Meus Cupons Disponíveis
    </h3>
    <div v-if="loading" class="text-blue mb-3">Carregando cupons...</div>
    <div v-else-if="cupons.length === 0" class="text-muted">Nenhum cupom disponível no momento.</div>
    <div v-else class="row g-3">
      <div class="col-12 col-md-6 col-lg-4" v-for="cupom in cupons" :key="cupom.id">
        <div class="cupom-card">
          <div class="cupom-code">{{ cupom.code }}</div>
          <div class="cupom-desc mb-1">Desconto: <b>{{ cupom.discount_percentage }}%</b></div>
          <div class="cupom-validade text-muted">Válido de {{ formatDate(cupom.start_date) }} até {{ formatDate(cupom.end_date) }}</div>
          <div class="cupom-desc mt-1" v-if="cupom.description">{{ cupom.description }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getAllCoupons } from '@/services/apiService'

const cupons = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const allCupons = await getAllCoupons()
    const now = new Date()
    cupons.value = allCupons.filter(c =>
      new Date(c.start_date) <= now && new Date(c.end_date) >= now
    )
  } finally {
    loading.value = false
  }
})

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('pt-BR')
}
</script>

<style scoped>
.profile-coupons-section {
  background: #eaf6ff;
  border-radius: 1.2rem;
  box-shadow: 0 4px 24px #399bff20;
  border: 1.5px solid #b8d8ff;
  padding: 2rem 1.2rem;
  margin-bottom: 2rem;
  color: #232e47;
}
.profile-coupons-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #232e47;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.profile-coupons-title i {
  color: #399bff;
  font-size: 1.3rem;
}
.cupom-card {
  background: #ffffff; /* Fundo branco */
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); /* Sombra leve */
  border: 1.5px solid #e0e7ff; /* Borda azul clara */
  padding: 1rem;
  transition: all 0.2s ease-in-out;
}
.cupom-card:hover {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1); /* Sombra mais forte */
  transform: translateY(-4px);
}
.cupom-code {
  font-family: 'Orbitron', sans-serif;
  color: #007bff; /* Azul vibrante */
  font-size: 1.2rem;
  font-weight: 700;
}
.cupom-desc {
  color: #00aaff;
  font-size: 1.08rem;
}
.cupom-validade {
  font-size: 0.98rem;
}
.text-blue {
  color: #00aaff !important;
}
@media (max-width: 768px) {
  .profile-coupons-section {
    padding: 1.2rem 0.5rem;
    border-radius: 1rem;
  }
}
</style>
