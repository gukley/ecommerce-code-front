<template>
  <div class="finance-dashboard p-4">
    <div v-if="loading" class="loading-overlay">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Carregando...</span>
      </div>
    </div>
    <div v-else>
      <h2 class="fw-bold text-primary-ggtech mb-4">Financeiro</h2>
      <p class="text-light-ggtech mb-4">Acompanhe o fluxo financeiro da loja, pagamentos processados e taxas.</p>

      <!-- Cards de resumo -->
      <div class="row g-4 mb-4">
        <div class="col-md-3 col-6">
          <div class="card finance-card summary-card">
            <div class="card-body d-flex align-items-center gap-3">
              <div class="icon-container bg-gradient-blue">
                <i class="bi bi-cash-coin"></i>
              </div>
              <div>
                <div class="card-title">Receita do mês</div>
                <div class="card-value">R$ {{ receitaMes.toLocaleString('pt-BR', {minimumFractionDigits:2}) }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3 col-6">
          <div class="card finance-card summary-card">
            <div class="card-body d-flex align-items-center gap-3">
              <div class="icon-container bg-gradient-red">
                <i class="bi bi-x-circle"></i>
              </div>
              <div>
                <div class="card-title">Cancelados</div>
                <div class="card-value">{{ totalCancelados }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3 col-6">
          <div class="card finance-card summary-card">
            <div class="card-body d-flex align-items-center gap-3">
              <div class="icon-container bg-gradient-yellow">
                <i class="bi bi-hourglass-split"></i>
              </div>
              <div>
                <div class="card-title">Pendentes</div>
                <div class="card-value">{{ totalPendentes }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3 col-6">
          <div class="card finance-card summary-card">
            <div class="card-body d-flex align-items-center gap-3">
              <div class="icon-container bg-gradient-purple">
                <i class="bi bi-percent"></i>
              </div>
              <div>
                <div class="card-title">Taxas Stripe</div>
                <div class="card-value">R$ {{ totalTaxas.toLocaleString('pt-BR', {minimumFractionDigits:2}) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Filtros -->
      <div class="row g-3 mb-4">
        <div class="col-md-3 col-6">
          <label class="form-label text-light">Mês</label>
          <select v-model="filtroMes" class="form-select">
            <option value="">Todos</option>
            <option v-for="m in mesesDisponiveis" :key="m.value" :value="m.value">{{ m.label }}</option>
          </select>
        </div>
        <div class="col-md-3 col-6">
          <label class="form-label text-light">Tipo de Pagamento</label>
          <select v-model="filtroTipo" class="form-select">
        <option value="">Todos</option>
        <option v-for="tipo in tiposPagamentoDisponiveis" :key="tipo" :value="tipo">
            {{ paymentMethodLabel(tipo) }}
        </option>
        </select>
        </div>
        <div class="col-md-3 col-6">
          <label class="form-label text-light">Status</label>
          <select v-model="filtroStatus" class="form-select">
            <option value="">Todos</option>
            <option v-for="status in statusDisponiveis" :key="status" :value="status">
                {{ statusLabel(status) }}
            </option>
            </select>
        </div>
        <div class="col-md-3 col-12 d-flex align-items-end">
          <button class="btn btn-outline-info w-100" @click="exportarCSV">
            <i class="bi bi-download"></i> Exportar CSV
          </button>
        </div>
      </div>

      <!-- Gráficos -->
      <div class="row g-4 mb-4">
        <div class="col-md-4 col-12">
          <div class="card finance-card chart-card">
            <h5 class="chart-title">Receita por Mês</h5>
            <apexchart type="bar" height="260" :options="chartBarOptions" :series="chartBarSeries" />
          </div>
        </div>
        <div class="col-md-4 col-12">
          <div class="card finance-card chart-card">
            <h5 class="chart-title">Por Tipo de Pagamento</h5>
            <apexchart type="pie" height="260" :options="chartPieOptions" :series="chartPieSeries" />
          </div>
        </div>
        <div class="col-md-4 col-12">
          <div class="card finance-card chart-card">
            <h5 class="chart-title">Status dos Pagamentos</h5>
            <apexchart type="donut" height="260" :options="chartDonutOptions" :series="chartDonutSeries" />
          </div>
        </div>
      </div>

      <!-- Tabela de pagamentos -->
      <div class="card finance-card table-card">
        <div class="table-responsive">
          <table class="table table-dark table-hover align-middle">
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Email</th>
                <th>CPF</th>
                <th>Telefone</th>
                <th>Valor Total</th>
                <th>Tipo</th>
                <th>Status</th>
                <th>Data</th>
                <th>Taxa</th>
                <th>Líquido</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in paginatedPagamentos" :key="p.id">
                <td>#{{ p.id }}</td>
                <td>{{ p.customer_name || '-' }}</td>
                <td>{{ p.customer_email || '-' }}</td>
                <td>{{ p.customer_cpf || '-' }}</td>
                <td>{{ p.customer_phone || '-' }}</td>
                <td>R$ {{ p.amount ? (p.amount / 100).toLocaleString('pt-BR', {minimumFractionDigits:2}) : '-' }}</td>
                <td>{{ paymentMethodLabel(p.payment_method) }}</td>
                <td>
                  <span :class="['badge', statusBadgeClass(p.status)]">{{ statusLabel(p.status) }}</span>
                </td>
                <td>{{ formatDate(p.created_at) }}</td>
                <td>R$ {{ p.fee ? (p.fee / 100).toLocaleString('pt-BR', {minimumFractionDigits:2}) : '-' }}</td>
                <td>R$ {{ p.net ? (p.net / 100).toLocaleString('pt-BR', {minimumFractionDigits:2}) : '-' }}</td>
                <td>
                  <button class="btn btn-sm btn-outline-info" @click="abrirModal(p)">
                    <i class="bi bi-eye"></i>
                  </button>
                </td>
              </tr>
              <tr v-if="!paginatedPagamentos.length">
                <td colspan="12" class="text-center text-muted py-4">Nenhum pagamento encontrado para os filtros selecionados.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Controles de Paginação -->
      <PaginationControls
        :currentPage="currentPage"
        :totalPages="totalPages"
        @go-to-page="goToPage"
      />

      <!-- Modal de detalhes -->
      <div v-if="modalPagamento" class="modal fade show d-block" tabindex="-1" style="background:rgba(0,0,0,0.5);">
        <div class="modal-dialog modal-lg modal-dialog-centered">
          <div class="modal-content finance-modal">
            <div class="modal-header">
              <h5 class="modal-title">Detalhes do Pagamento #{{ modalPagamento.id }}</h5>
              <button type="button" class="btn-close" @click="modalPagamento = null"></button>
            </div>
            <div class="modal-body">
              <div class="row g-3">
                <div class="col-md-6">
                  <h6 class="mb-2">Cliente</h6>
                  <div><strong>Nome:</strong> {{ modalPagamento.customer_name || '-' }}</div>
                  <div><strong>Email:</strong> {{ modalPagamento.customer_email || '-' }}</div>
                  <div><strong>CPF:</strong> {{ modalPagamento.customer_cpf || '-' }}</div>
                  <div><strong>Telefone:</strong> {{ modalPagamento.customer_phone || '-' }}</div>
                  <div><strong>ID Stripe:</strong> {{ modalPagamento.stripe_customer_id || '-' }}</div>
                </div>
                <div class="col-md-6">
                  <h6 class="mb-2">Pagamento</h6>
                  <div><strong>Método:</strong> {{ paymentMethodLabel(modalPagamento.payment_method) }}</div>
                  <div><strong>Status:</strong> {{ statusLabel(modalPagamento.status) }}</div>
                  <div><strong>Valor:</strong> R$ {{ modalPagamento.amount ? (modalPagamento.amount / 100).toLocaleString('pt-BR', {minimumFractionDigits:2}) : '-' }}</div>
                  <div><strong>Taxa Stripe:</strong> R$ {{ modalPagamento.fee ? (modalPagamento.fee / 100).toLocaleString('pt-BR', {minimumFractionDigits:2}) : '-' }}</div>
                  <div><strong>Líquido:</strong> R$ {{ modalPagamento.net ? (modalPagamento.net / 100).toLocaleString('pt-BR', {minimumFractionDigits:2}) : '-' }}</div>
                  <div><strong>Data:</strong> {{ formatDate(modalPagamento.created_at) }}</div>
                </div>
              </div>
              <div class="mt-4">
                <h6>Itens do Pedido</h6>
                <table class="table table-sm table-striped">
                  <thead>
                    <tr>
                      <th>Produto</th>
                      <th>Qtd</th>
                      <th>Preço</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in modalPagamento.items || []" :key="item.id">
                      <td>{{ item.name || '-' }}</td>
                      <td>{{ item.quantity || '-' }}</td>
                      <td>R$ {{ item.unit_price ? (item.unit_price / 100).toLocaleString('pt-BR', {minimumFractionDigits:2}) : '-' }}</td>
                    </tr>
                    <tr v-if="!modalPagamento.items || !modalPagamento.items.length">
                      <td colspan="3" class="text-muted text-center">Nenhum item encontrado.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" @click="modalPagamento = null">Fechar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import VueApexCharts from 'vue3-apexcharts'
import PaginationControls from '@/components/Common/PaginationControls.vue'

const loading = ref(true)
const pagamentos = ref([])
const modalPagamento = ref(null)

// Filtros
const filtroMes = ref('')
const filtroTipo = ref('')
const filtroStatus = ref('')

// Carregar pagamentos
async function loadPayments() {
  loading.value = true
  try {
    const { data } = await axios.get('http://localhost:8000/payments/finance')
    pagamentos.value = Array.isArray(data) ? data : []
  } catch (e) {
    pagamentos.value = []
  }
  loading.value = false
}
onMounted(loadPayments)

// Meses dinâmicos
const mesesDisponiveis = computed(() => {
  const meses = new Set()
  pagamentos.value.forEach(p => {
    if (p.created_at) {
      const d = new Date(p.created_at)
      meses.add(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`)
    }
  })
  return Array.from(meses).sort().map(m => {
    const [y, mo] = m.split('-')
    return { value: m, label: `${mo}/${y}` }
  })
})

// ✅ Tipos de pagamento — fixo como “Cartão”
const tiposPagamentoDisponiveis = computed(() => ['card'])

// ✅ Status fixos
const statusDisponiveis = computed(() => ['pending', 'processing', 'shipped', 'cancelled'])

// Filtros aplicados
const pagamentosFiltrados = computed(() => {
  return pagamentos.value.filter(p => {
    let ok = true
    if (filtroMes.value) {
      const d = new Date(p.created_at)
      const mes = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      ok = ok && mes === filtroMes.value
    }
    if (filtroTipo.value) ok = ok && p.payment_method === filtroTipo.value
    if (filtroStatus.value) ok = ok && p.status === filtroStatus.value
    return ok
  })
})

// Cards
const receitaMes = computed(() =>
  pagamentosFiltrados.value.reduce((sum, p) => p.amount ? sum + p.amount : sum, 0) / 100
)
const totalCancelados = computed(() =>
  pagamentosFiltrados.value.filter(p => p.status === 'cancelled').length
)
const totalPendentes = computed(() =>
  pagamentosFiltrados.value.filter(p => p.status === 'pending').length
)
const totalTaxas = computed(() =>
  pagamentosFiltrados.value.reduce((sum, p) => p.fee ? sum + p.fee : sum, 0) / 100
)

// 📊 Gráficos
const chartBarOptions = {
  chart: { type: 'bar', background: 'transparent', toolbar: { show: false }, fontFamily: 'Inter, sans-serif' },
  theme: { mode: 'dark' },
  grid: { borderColor: '#232e47', strokeDashArray: 4 },
  dataLabels: { enabled: false },
  xaxis: {
    categories: mesesDisponiveis.value.map(m => m.label),
    labels: { style: { colors: '#e8eaed', fontWeight: 600 } }
  },
  yaxis: {
    labels: { style: { colors: '#e8eaed', fontWeight: 600 }, formatter: val => `R$ ${val.toLocaleString('pt-BR')}` }
  },
  tooltip: { theme: 'dark', y: { formatter: val => `R$ ${val.toLocaleString('pt-BR')}` } },
  colors: ['#64b5f6']
}

const chartBarSeries = computed(() => [{
  name: 'Receita',
  data: mesesDisponiveis.value.map(m => {
    const [y, mo] = m.value.split('-')
    return pagamentos.value
      .filter(p => {
        const d = new Date(p.created_at)
        return d.getFullYear() === Number(y) && (d.getMonth() + 1) === Number(mo)
      })
      .reduce((sum, p) => p.amount ? sum + p.amount / 100 : sum, 0)
  })
}])

// Tipo de pagamento (gráfico de pizza)
const chartPieOptions = {
  chart: { type: 'pie', background: 'transparent', toolbar: { show: false }, fontFamily: 'Inter, sans-serif' },
  theme: { mode: 'dark' },
  labels: ['Cartão'],
  legend: { labels: { colors: '#e8eaed' } },
  dataLabels: { style: { colors: ['#fff'] } },
  tooltip: { theme: 'dark', y: { formatter: val => `R$ ${val.toLocaleString('pt-BR')}` } },
  colors: ['#43e97b']
}
const chartPieSeries = computed(() => [
  pagamentosFiltrados.value.reduce((sum, p) => p.amount ? sum + p.amount / 100 : sum, 0)
])

// ✅ Status dos pagamentos (Donut)
const chartDonutOptions = {
  chart: { type: 'donut', background: 'transparent', toolbar: { show: false }, fontFamily: 'Inter, sans-serif' },
  theme: { mode: 'dark' },
  labels: ['Pendente', 'Processando', 'Enviado', 'Cancelado'],
  legend: { labels: { colors: '#e8eaed' } },
  dataLabels: { style: { colors: ['#fff'] } },
  tooltip: { theme: 'dark', y: { formatter: val => `${val} pagamentos` } },
  colors: ['#f9d423', '#64b5f6', '#43e97b', '#ff6b6b']
}

const chartDonutSeries = computed(() => [
  pagamentosFiltrados.value.filter(p => p.status === 'pending').length,
  pagamentosFiltrados.value.filter(p => p.status === 'processing').length,
  pagamentosFiltrados.value.filter(p => p.status === 'shipped').length,
  pagamentosFiltrados.value.filter(p => p.status === 'cancelled').length
])

// Paginação
const currentPage = ref(1)
const pageSize = 12
const paginatedPagamentos = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return pagamentosFiltrados.value.slice(start, start + pageSize)
})
const totalPages = computed(() => Math.ceil(pagamentosFiltrados.value.length / pageSize))
function goToPage(page) {
  if (page >= 1 && page <= totalPages.value) currentPage.value = page
}

// Modal
function abrirModal(pagamento) {
  modalPagamento.value = pagamento
}

// Utils
function formatDate(dateString) {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleString('pt-BR', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit'
  })
}

function statusBadgeClass(status) {
  switch (String(status).toLowerCase()) {
    case 'pending': return 'bg-warning text-dark'
    case 'processing': return 'bg-info'
    case 'shipped': return 'bg-success'
    case 'cancelled': return 'bg-danger'
    default: return 'bg-secondary'
  }
}

function statusLabel(status) {
  switch (String(status).toLowerCase()) {
    case 'pending': return 'Pendente'
    case 'processing': return 'Processando'
    case 'shipped': return 'Enviado'
    case 'cancelled': return 'Cancelado'
    default: return status
  }
}

function paymentMethodLabel(method) {
  return 'Cartão'
}

// Exportar CSV
function exportarCSV() {
  if (!pagamentosFiltrados.value.length) return
  const header = [
    'ID', 'Cliente', 'Email', 'CPF', 'Telefone', 'Valor Total', 'Tipo', 'Status', 'Data', 'Taxa', 'Líquido'
  ]
  const rows = pagamentosFiltrados.value.map(p => [
    p.id,
    p.customer_name || '',
    p.customer_email || '',
    p.customer_cpf || '',
    p.customer_phone || '',
    p.amount ? (p.amount / 100).toFixed(2) : '',
    'Cartão',
    statusLabel(p.status),
    formatDate(p.created_at),
    p.fee ? (p.fee / 100).toFixed(2) : '',
    p.net ? (p.net / 100).toFixed(2) : ''
  ])
  const csv = [header, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `pagamentos_financeiro.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
</script>


<style scoped>
.finance-dashboard {
  background: #0f1419;
  min-height: 100vh;
  color: #e8eaed;
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
.text-light-ggtech { color: #b0b7c3; font-weight: 400; }
.finance-card {
  background: linear-gradient(135deg, #181e2a 0%, #23233a 100%);
  border: 1.5px solid #232e47;
  border-radius: 1.2rem;
  box-shadow: 0 2px 12px #232e4720;
  color: #e8eaed;
}
.summary-card {
  min-height: 110px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.icon-container {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  color: #fff;
  box-shadow: 0 2px 12px #232e4720;
}
.bg-gradient-blue { background: linear-gradient(135deg, #64b5f6 0%, #42a5f5 100%); }
.bg-gradient-green { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }
.bg-gradient-yellow { background: linear-gradient(135deg, #f9d423 0%, #ff4e50 100%); color: #23233a; }
.bg-gradient-purple { background: linear-gradient(135deg, #8f5fe8 0%, #64b5f6 100%); }
.bg-gradient-red { background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%); }
.card-title {
  font-size: 1rem;
  font-weight: 600;
  color: #b0b7c3;
  margin-bottom: 2px;
}
.card-value {
  font-size: 1.35rem;
  font-weight: 800;
  color: #fff;
}
.chart-card {
  min-height: 340px;
  padding: 1.2rem 1rem 1.5rem 1rem;
}
.chart-title {
  font-size: 1.08rem;
  font-weight: 700;
  color: #64b5f6;
  margin-bottom: 1.1rem;
  letter-spacing: 0.01em;
  background: linear-gradient(90deg, #64b5f6 0%, #42a5f5 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.table-card {
  margin-top: 2rem;
  padding: 1.2rem 1rem;
}
.table {
  background: transparent;
  color: #e8eaed;
  border-radius: 0.7rem;
  overflow: hidden;
}
.table thead th {
  background: #23233a;
  color: #64b5f6;
  font-weight: 700;
  border-bottom: 2px solid #374151;
  font-size: 0.98rem;
}
.table tbody tr:hover {
  background: #232e47;
}
.badge {
  font-size: 0.92rem;
  font-weight: 600;
  padding: 0.35rem 1rem;
  border-radius: 12px;
  letter-spacing: 0.04em;
  box-shadow: 0 1px 4px #00000018;
  border: none;
}
.finance-modal {
  background: #23233a;
  color: #e8eaed;
  border-radius: 1.2rem;
  box-shadow: 0 8px 32px #00000040;
  border: 1px solid #374151;
}
.modal-header {
  border-bottom: 1px solid #374151;
  background: linear-gradient(90deg, #374151 0%, #64b5f6 100%);
}
.modal-title {
  font-size: 1.25rem;
  color: #64b5f6;
  font-weight: 700;
}
.stripe-json {
  background: #181e2a;
  color: #b0b7c3;
  border-radius: 0.7rem;
  padding: 1rem;
  font-size: 0.97rem;
  max-height: 220px;
  overflow: auto;
}
.loading-overlay {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
}
@media (max-width: 991.98px) {
  .finance-card { min-height: unset; }
  .chart-card { min-height: 260px; }
  .summary-card { min-height: 70px; }
}
@media (max-width: 600px) {
  .finance-dashboard { padding: 0.5rem 0.1rem; }
  .finance-card, .chart-card, .table-card { padding: 0.7rem 0.3rem; }
  .summary-card { min-height: 70px; }
  .chart-title { font-size: 0.98rem; }
}
</style>
