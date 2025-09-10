<template>
  <div class="pc-builder-bg py-5">
    <div class="container">
      <!-- Botão de voltar para home -->
      <div class="d-flex justify-content-start mb-3">
        <router-link to="/" class="btn-back-home">
          <i class="bi bi-arrow-left"></i> Voltar para Home
        </router-link>
      </div>
      <!-- Cabeçalho -->
      <div class="pc-builder-header d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4">
        <div>
          <h1 class="fw-bold pc-builder-title mb-2">
            <i class="bi bi-cpu me-2"></i> Monte seu PC
          </h1>
          <p class="pc-builder-subtitle mb-0">
            Escolha cada componente e monte o computador ideal para você.
          </p>
        </div>
        <button class="btn btn-outline-danger btn-restart" @click="resetBuild">
          <i class="bi bi-arrow-counterclockwise"></i> Reiniciar montagem
        </button>
      </div>
      <div class="row g-4">
        <!-- Coluna esquerda: Seleção de peças -->
        <div class="col-lg-8">
          <div class="pc-builder-cards-grid">
            <PcPartCard
              v-for="cat in categories"
              :key="cat.key"
              :category="cat"
              :selected="selectedParts[cat.key]"
              :compatible="compatibility[cat.key]"
              @select="openModal(cat.key)"
            />
          </div>
        </div>
        <!-- Coluna direita: Resumo -->
        <div class="col-lg-4">
          <PcBuildSummary
            :selected-parts="selectedParts"
            :categories="categories"
            :total="totalPrice"
            :progress="progress"
            @add-to-cart="addToCart"
          />
        </div>
      </div>
    </div>
    <!-- Modal de seleção de peça -->
    <PcPartSelectModal
      v-if="modalOpen"
      :category="modalCategory"
      :options="filteredOptions"
      :selected="selectedParts[modalCategory]"
      :compatibility="compatibility"
      @close="modalOpen = false"
      @select="selectPart"
    />
    <!-- Alerta de compatibilidade -->
    <div v-if="compatAlert" class="compat-alert">
      <i class="bi bi-exclamation-triangle-fill"></i> {{ compatAlert }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import PcPartCard from '@/components/PcBuilder/PcPartCard.vue'
import PcBuildSummary from '@/components/PcBuilder/PcBuildSummary.vue'
import PcPartSelectModal from '@/components/PcBuilder/PcPartSelectModal.vue'
import { getAllProducts, getCategories } from '@/services/apiService'

// Categorias fixas para montagem
const categories = [
  { key: 'cpu', label: 'Processador', icon: 'bi-cpu' },
  { key: 'motherboard', label: 'Placa Mãe', icon: 'bi-motherboard' },
  { key: 'ram', label: 'Memória Ram', icon: 'bi-memory' },
  { key: 'storage', label: 'SSDs e HDDs', icon: 'bi-hdd' },
  { key: 'gpu', label: 'Placa de Video', icon: 'bi-gpu-card' },
  { key: 'psu', label: 'Fonte de Alimentação', icon: 'bi-plug' },
  { key: 'case', label: 'Gabinetes', icon: 'bi-pc' },
  { key: 'cooler', label: 'Cooler e Watercoolers', icon: 'bi-fan', optional: true }
]

// Estado da montagem (carrega do localStorage se existir)
const selectedParts = ref(
  JSON.parse(localStorage.getItem('pcbuilder_selectedParts') || 'null') || {
    cpu: null, motherboard: null, ram: null, storage: null,
    gpu: null, psu: null, case: null, cooler: null
  }
)

// Salva montagem no localStorage sempre que mudar
watch(selectedParts, (val) => {
  localStorage.setItem('pcbuilder_selectedParts', JSON.stringify(val))
}, { deep: true })

// Produtos por categoria
const options = ref({
  cpu: [],
  motherboard: [],
  ram: [],
  storage: [],
  gpu: [],
  psu: [],
  case: [],
  cooler: []
})

// Carrega produtos e distribui por categoria usando nome EXATO do banco
onMounted(async () => {
  const produtos = await getAllProducts()
  const categorias = await getCategories()
  for (const cat of categories) {
    // Busca id da categoria pelo nome EXATO do banco
    const catObj = categorias.find(c => c.name.trim().toLowerCase() === cat.label.trim().toLowerCase())
    if (catObj) {
      options.value[cat.key] = produtos.filter(p => p.category_id === catObj.id)
    } else {
      options.value[cat.key] = []
    }
  }
})

// Modal de seleção
const modalOpen = ref(false)
const modalCategory = ref('')
const filteredOptions = computed(() => options.value[modalCategory.value] || [])

function openModal(categoryKey) {
  modalCategory.value = categoryKey
  modalOpen.value = true
}

const compatibility = ref({
  cpu: true, motherboard: true, ram: true, storage: true,
  gpu: true, psu: true, case: true, cooler: true
})
const compatAlert = ref('')

function selectPart(part) {
  selectedParts.value[modalCategory.value] = part
  modalOpen.value = false
  checkCompatibility()
}

function checkCompatibility() {
  compatAlert.value = ''
  if (selectedParts.value.cpu && selectedParts.value.motherboard) {
    if (selectedParts.value.cpu.socket !== selectedParts.value.motherboard.socket) {
      compatibility.value.motherboard = false
      compatAlert.value = 'Essa placa-mãe não é compatível com o processador selecionado.'
      return
    }
  }
  Object.keys(compatibility.value).forEach(k => compatibility.value[k] = true)
}

const totalPrice = computed(() => {
  return Object.values(selectedParts.value)
    .filter(Boolean)
    .reduce((sum, part) => sum + (part.price || 0), 0)
})
const progress = computed(() => {
  const total = categories.filter(c => !c.optional).length
  const selected = Object.values(selectedParts.value).filter((v, i) => v && !categories[i]?.optional).length
  return Math.round((selected / total) * 100)
})

function resetBuild() {
  Object.keys(selectedParts.value).forEach(k => selectedParts.value[k] = null)
  compatAlert.value = ''
  localStorage.removeItem('pcbuilder_selectedParts')
}

function addToCart() {
  alert('PC adicionado ao carrinho!')
}
</script>

<style scoped>
.pc-builder-bg {
  background: linear-gradient(120deg, #10141a 0%, #181e2a 80%, #232e47 100%);
  min-height: 100vh;
  font-family: 'Inter', 'Rajdhani', Arial, sans-serif;
}
.pc-builder-header {
  margin-bottom: 2rem;
}
.pc-builder-title {
  font-size: 2.3rem;
  background: linear-gradient(90deg, #64b5f6 0%, #42a5f5 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 800;
  letter-spacing: 0.03em;
}
.pc-builder-subtitle {
  color: #b0b7c3;
  font-size: 1.15rem;
  font-weight: 500;
}
.btn-restart {
  font-weight: 600;
  border-radius: 50px;
  padding: 0.7rem 1.5rem;
  font-size: 1rem;
  background: linear-gradient(90deg,#ff6b6b 0%, #f44336 100%);
  color: #fff;
  border: none;
  box-shadow: 0 2px 8px #ff6b6b22;
  transition: all 0.2s;
}
.btn-restart:hover {
  background: linear-gradient(90deg,#f44336 0%, #ff6b6b 100%);
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px #ff6b6b30;
}
.pc-builder-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
}
.compat-alert {
  position: fixed;
  bottom: 32px;
  right: 32px;
  background: linear-gradient(90deg,#ff6b6b 0%, #f44336 100%);
  color: #fff;
  font-weight: 600;
  border-radius: 12px;
  padding: 1rem 2rem;
  box-shadow: 0 2px 12px #ff6b6b33;
  z-index: 9999;
  font-size: 1.08rem;
  display: flex;
  align-items: center;
  gap: 12px;
}
.btn-back-home {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(90deg,#50b8fe 60%, #399bff 100%);
  color: #181e2a;
  font-weight: 700;
  border-radius: 14px;
  padding: 8px 22px;
  font-size: 1.08rem;
  text-decoration: none;
  box-shadow: 0 2px 12px #399bff30;
  border: none;
  transition: background 0.18s, color 0.18s, box-shadow 0.18s;
  margin-bottom: 1rem;
}
.btn-back-home:hover {
  background: linear-gradient(90deg,#399bff 60%, #50b8fe 100%);
  color: #fff;
  box-shadow: 0 4px 18px #399bff60;
}
@media (max-width: 991px) {
  .pc-builder-cards-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
     bottom: 32px;
  right: 32px;
  background: linear-gradient(90deg,#ff6b6b 0%, #f44336 100%);
  color: #fff;
  font-weight: 600;
  border-radius: 12px;
  padding: 1rem 2rem;
  box-shadow: 0 2px 12px #ff6b6b33;
  z-index: 9999;
  font-size: 1.08rem;
  display: flex;
  align-items: center;
  gap: 12px;
  }
}
@media (max-width: 991px) {
  .pc-builder-cards-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style>
