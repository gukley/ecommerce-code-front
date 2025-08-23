<template>
  <div class="admin-clients-container">
    <h2 class="mb-4">Clientes</h2>
    <div class="mb-3 d-flex flex-wrap align-items-center gap-2">
      <input
        v-model="search"
        type="text"
        class="form-control"
        placeholder="Buscar por nome ou email"
        style="max-width: 300px"
      />
      <span v-if="loading" class="ms-2">
        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        Carregando...
      </span>
      <span v-if="error" class="text-danger ms-2">{{ error }}</span>
    </div>
    <div class="table-responsive">
      <table class="table table-borderless align-middle table-hover tech-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Endereços</th>
            <th>Pedidos</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="client in filteredClients"
            :key="client.id"
            class="client-row"
          >
            <td>
              <span class="fw-bold text-tech">{{ client.name }}</span>
            </td>
            <td>
              <span class="text-muted">{{ client.email }}</span>
            </td>
            <td>
              <ul class="mb-0 ps-3">
                <li v-for="address in client.addresses" :key="address.id">
                  {{ address.street }}, {{ address.number }} - {{ address.neighborhood }},
                  {{ address.city }} / {{ address.state }} - CEP: {{ address.cep }}
                </li>
              </ul>
            </td>
            <td>
              <button
                class="btn btn-sm btn-outline-primary"
                @click="toggleOrders(client.id)"
              >
                <i :class="expandedClients[client.id] ? 'bi bi-chevron-up' : 'bi bi-chevron-down'"></i>
                {{ expandedClients[client.id] ? 'Ocultar' : 'Ver pedidos' }}
              </button>
            </td>
          </tr>
          <tr
            v-for="client in filteredClients"
            :key="'orders-' + client.id"
            v-show="expandedClients[client.id]"
            class="orders-row"
          >
            <td colspan="4">
              <div v-if="ordersByClient[client.id] && ordersByClient[client.id].length > 0">
                <div class="orders-list">
                  <div
                    v-for="order in ordersByClient[client.id]"
                    :key="order.id"
                    class="order-card"
                  >
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <span class="badge bg-tech-status me-2">{{ order.status }}</span>
                        <span class="order-id">#{{ order.id }}</span>
                        <span class="order-date ms-2">{{ formatDate(order.order_date) }}</span>
                      </div>
                      <span class="order-total">Total: <strong>R$ {{ order.total ?? order.total_amount ?? '0.00' }}</strong></span>
                    </div>
                    <div class="order-products mt-2">
                      <span class="fw-semibold text-tech">Produtos:</span>
                      <ul class="mb-0 ps-3">
                        <li v-for="product in order.products" :key="product.id">
                          {{ product.name }} <span v-if="product.quantity">x{{ product.quantity }}</span>
                          <span class="text-muted ms-2">R$ {{ Number(product.price ?? product.unit_price).toFixed(2) }}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="text-muted small">Nenhum pedido encontrado para este cliente.</div>
            </td>
          </tr>
          <tr v-if="!loading && filteredClients.length === 0">
            <td colspan="4" class="text-center text-muted">Nenhum cliente encontrado.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import apiService from '@/services/apiService'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'

const clients = ref([])
const loading = ref(false)
const error = ref('')
const search = ref('')
const ordersByClient = ref({})
const expandedClients = ref({})

const authStore = useAuthStore()
const router = useRouter()

onMounted(async () => {
  if (!authStore.isAuthenticated || authStore.user?.role !== 'ADMIN') {
    router.replace({ name: 'login' })
    return
  }
  await fetchClients()
})

async function fetchClients() {
  loading.value = true
  error.value = ''
  try {
    const response = await apiService.getAdminClients()
    clients.value = response.data
  } catch (err) {
    error.value = 'Erro ao carregar clientes.'
  } finally {
    loading.value = false
  }
}

async function fetchOrdersForClient(clientId) {
  if (ordersByClient.value[clientId]) return
  try {
    const orders = await apiService.getOrdersByUserId(clientId)
    ordersByClient.value[clientId] = orders
  } catch (err) {
    ordersByClient.value[clientId] = []
  }
}

function toggleOrders(clientId) {
  expandedClients.value[clientId] = !expandedClients.value[clientId]
  if (expandedClients.value[clientId] && !ordersByClient.value[clientId]) {
    fetchOrdersForClient(clientId)
  }
}

const filteredClients = computed(() => {
  if (!search.value) return clients.value
  const s = search.value.toLowerCase()
  return clients.value.filter(
    c =>
      c.name?.toLowerCase().includes(s) ||
      c.email?.toLowerCase().includes(s)
  )
})

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('pt-BR') + ' ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}
</script>

<style scoped>
.admin-clients-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 16px;
  background: #171e2b;
  border-radius: 16px;
  box-shadow: 0 4px 32px 0 rgba(0,0,0,0.13);
  color: #e8eaed;
  font-family: 'Inter', 'Roboto', Arial, sans-serif;
}
.tech-table {
  background: transparent;
}
.tech-table th, .tech-table td {
  vertical-align: middle;
  background: transparent;
  border-bottom: 1px solid #283046;
}
.tech-table th {
  color: #7ecbff;
  font-weight: 600;
  font-size: 1.05rem;
  background: #1a2332;
  border-top: none;
}
.client-row {
  background: #1a2332;
  border-radius: 8px;
  box-shadow: 0 2px 8px 0 rgba(100,181,246,0.07);
}
.orders-row td {
  background: #232d3a;
  border-bottom: none;
  border-top: none;
  padding-top: 0;
  padding-bottom: 0.5rem;
}
.order-card {
  background: #232d3a;
  border-radius: 10px;
  box-shadow: 0 2px 8px 0 rgba(100,181,246,0.08);
  margin-bottom: 12px;
  padding: 1rem 1.2rem;
  border-left: 4px solid #64b5f6;
}
.order-id {
  color: #7ecbff;
  font-weight: 500;
}
.order-date {
  color: #a0aec0;
  font-size: 0.95em;
}
.order-total {
  color: #4ade80;
  font-weight: 600;
  font-size: 1.08em;
}
.bg-tech-status {
  background: linear-gradient(90deg, #64b5f6 0%, #42a5f5 100%);
  color: #fff;
  font-weight: 600;
  font-size: 0.95em;
  border-radius: 6px;
  padding: 2px 10px;
}
.text-tech {
  color: #7ecbff;
}
.orders-list {
  margin-top: 0.5rem;
}
.btn-outline-primary {
  border-color: #64b5f6;
  color: #64b5f6;
  background: transparent;
  transition: all 0.2s;
}
.btn-outline-primary:hover {
  background: #64b5f6;
  color: #fff;
}
@media (max-width: 900px) {
  .admin-clients-container {
    padding: 12px 2px;
  }
  .tech-table th, .tech-table td {
    font-size: 0.97rem;
  }
  .order-card {
    padding: 0.7rem 0.7rem;
  }
}
@media (max-width: 600px) {
  .admin-clients-container {
    padding: 4px 0;
  }
  .tech-table th, .tech-table td {
    font-size: 0.93rem;
  }
  .order-card {
    padding: 0.5rem 0.3rem;
  }
}
</style>
