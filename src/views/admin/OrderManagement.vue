<template>
  <div class="order-management p-4">
    <h2 class="fw-bold text-primary-ggtech mb-4">Gerenciamento de Pedidos</h2>
    
    <!-- Filtros -->
    <div class="filters-section mb-4">
      <div class="row g-3">
        <div class="col-md-3">
          <label class="form-label text-light">Status:</label>
          <select v-model="selectedStatus" class="form-select filter-select">
            <option value="">Todos os Status</option>
            <option value="pending">Pendente</option>
            <option value="processing">Processando</option>
            <option value="shipped">Enviado</option>
            <option value="delivered">Entregue</option>
            <option value="cancelled">Cancelado</option>
          </select>
        </div>
        <div class="col-md-3">
          <label class="form-label text-light">Período:</label>
          <select v-model="selectedPeriod" class="form-select filter-select">
            <option value="">Todos os Períodos</option>
            <option value="today">Hoje</option>
            <option value="week">Última Semana</option>
            <option value="month">Último Mês</option>
            <option value="custom">Período Personalizado</option>
          </select>
        </div>
        <div class="col-md-3" v-if="selectedPeriod === 'custom'">
          <label class="form-label text-light">Data Inicial:</label>
          <input type="date" v-model="startDate" class="form-control filter-input">
        </div>
        <div class="col-md-3" v-if="selectedPeriod === 'custom'">
          <label class="form-label text-light">Data Final:</label>
          <input type="date" v-model="endDate" class="form-control filter-input">
        </div>
        <div class="col-md-3">
          <label class="form-label text-light">Buscar por ID:</label>
          <input 
            type="text" 
            v-model="searchId" 
            placeholder="Digite o ID do pedido"
            class="form-control filter-input"
          >
        </div>
        <div class="col-md-12">
          <button @click="clearFilters" class="btn btn-outline-secondary btn-sm me-2">
            <i class="bi bi-x-circle me-1"></i>Limpar Filtros
          </button>
          <span class="text-muted">
            <i class="bi bi-info-circle me-1"></i>
            {{ filteredOrders.length }} de {{ orders.length }} pedidos
          </span>
        </div>
      </div>
    </div>
    
    <div v-if="filteredOrders.length" class="table-responsive">
      <table class="table table-dark table-striped table-hover rounded-table">
                 <thead>
           <tr>
             <th>ID</th>
             <th>Usuário</th>
             <th>Endereço</th>
             <th>Status</th>
             <th>Data</th>
             <th>Produtos</th>
           </tr>
         </thead>
                   <tbody>
            <tr v-for="order in filteredOrders" :key="order.id">
             <td>{{ order.id }}</td>
             <td>{{ order.user_id }}</td>
             <td>
               <div v-if="addresses[order.address_id]">
                 {{ formatAddress(addresses[order.address_id]) }}
               </div>
               <div v-else class="text-muted">
                 <small>Carregando...</small>
                 <button @click="getAddressData(order.address_id)" class="btn btn-sm btn-link p-0 ms-2">
                   <i class="bi bi-arrow-clockwise"></i>
                 </button>
               </div>
             </td>
             <td>
               <span :class="getStatusClass(order.status)">{{ order.status }}</span>
             </td>
             <td>{{ new Date(order.order_date).toLocaleString() }}</td>
            <td>
              <ul>
                <li v-for="(product, idx) in order.products" :key="idx">
                  <img :src="product.image_path ? (baseUrl + product.image_path) : '/placeholder-product.png'" alt="Produto">
                  <div>
                    <strong>{{ product.name }}</strong>
                    <span>Preço: R$ {{ Number(product.price).toFixed(2) }}</span>
                  </div>
                </li>
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div v-else-if="orders.length && !filteredOrders.length" class="alert alert-warning mt-4 text-center">
      <i class="bi bi-search me-2"></i>
      Nenhum pedido encontrado com os filtros aplicados.
      <button @click="clearFilters" class="btn btn-link ms-2">Limpar filtros</button>
    </div>
    
    <div v-else-if="!orders.length" class="alert alert-info mt-4 text-center">
      <i class="bi bi-inbox me-2"></i>
      Nenhum pedido encontrado.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { getOrderByAdmin, getAddressById } from '@/services/apiService'
import { useAuthStore } from '@/stores/authStore'

const orders = ref([])
const addresses = ref({})
const authStore = useAuthStore()
const baseUrl = 'http://35.196.79.227:8000'

// Variáveis dos filtros
const selectedStatus = ref('')
const selectedPeriod = ref('')
const startDate = ref('')
const endDate = ref('')
const searchId = ref('')

// Função para buscar endereço por ID
const getAddressData = async (addressId) => {
  if (!addressId) return null
  if (addresses.value[addressId]) return addresses.value[addressId]
  
  try {
    const address = await getAddressById(addressId)
    addresses.value[addressId] = address
    return address
  } catch (error) {
    console.error('Erro ao buscar endereço:', error)
    return null
  }
}

// Função para formatar endereço
const formatAddress = (address) => {
  if (!address) return 'Endereço não encontrado'
  
  const parts = []
  if (address.street) parts.push(address.street)
  if (address.number) parts.push(address.number)
  if (address.complement) parts.push(address.complement)
  if (address.neighborhood) parts.push(address.neighborhood)
  if (address.city) parts.push(address.city)
  if (address.state) parts.push(address.state)
  if (address.zip_code) parts.push(address.zip_code)
  
  return parts.join(', ')
}

// Função para estilizar status
const getStatusClass = (status) => {
  const statusClasses = {
    'pending': 'badge bg-warning text-dark',
    'processing': 'badge bg-info text-white',
    'shipped': 'badge bg-primary text-white',
    'delivered': 'badge bg-success text-white',
    'cancelled': 'badge bg-danger text-white'
  }
  return statusClasses[status] || 'badge bg-secondary text-white'
}

// Computed para filtrar pedidos
const filteredOrders = computed(() => {
  let filtered = orders.value

  // Filtro por status
  if (selectedStatus.value) {
    filtered = filtered.filter(order => order.status === selectedStatus.value)
  }

  // Filtro por ID
  if (searchId.value) {
    filtered = filtered.filter(order => 
      order.id.toString().includes(searchId.value)
    )
  }

  // Filtro por período
  if (selectedPeriod.value) {
    const now = new Date()
    const orderDate = new Date()
    
    switch (selectedPeriod.value) {
      case 'today':
        filtered = filtered.filter(order => {
          orderDate.setTime(new Date(order.order_date).getTime())
          return orderDate.toDateString() === now.toDateString()
        })
        break
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        filtered = filtered.filter(order => {
          orderDate.setTime(new Date(order.order_date).getTime())
          return orderDate >= weekAgo
        })
        break
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        filtered = filtered.filter(order => {
          orderDate.setTime(new Date(order.order_date).getTime())
          return orderDate >= monthAgo
        })
        break
      case 'custom':
        if (startDate.value && endDate.value) {
          const start = new Date(startDate.value)
          const end = new Date(endDate.value)
          end.setHours(23, 59, 59) // Incluir o dia inteiro
          
          filtered = filtered.filter(order => {
            orderDate.setTime(new Date(order.order_date).getTime())
            return orderDate >= start && orderDate <= end
          })
        }
        break
    }
  }
return filtered
})

// Função para limpar filtros
const clearFilters = () => {
  selectedStatus.value = ''
  selectedPeriod.value = ''
  startDate.value = ''
  endDate.value = ''
  searchId.value = ''
}

onMounted(async () => {
  while (!authStore.user || !authStore.user.id) {
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  orders.value = await getOrderByAdmin(authStore.user.id)
  console.log('Pedidos retornados:', orders.value)
  window.pedidosAdmin = orders.value
  
  // Carregar endereços para todos os pedidos
  for (const order of orders.value) {
    if (order.address_id) {
      await getAddressData(order.address_id)
    }
  }
})
</script>

<style scoped>
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
.order-management {
  background-color: var(--admin-bg-primary) !important;
  min-height: calc(100vh - 100px);
  color: var(--admin-text-primary) !important;
  padding: 2rem;
}
.text-primary-ggtech {
  color: var(--admin-accent-primary) !important;
  font-weight: 700;
  text-shadow: 0 0 10px rgba(0, 255, 225, 0.3);
}
.table-dark {
  --bs-table-bg: var(--admin-bg-secondary) !important;
  --bs-table-striped-bg: var(--admin-bg-tertiary) !important;
  --bs-table-hover-bg: rgba(255, 255, 255, 0.05) !important;
  color: var(--admin-text-primary) !important;
}
.rounded-table {
  border-collapse: separate;
  border-spacing: 0;
  border-radius: 10px;
  overflow: hidden;
}
th, td {
  padding: 1rem;
  vertical-align: middle;
  border-color: var(--admin-border-light);
  font-size: 1.05rem;
}
th {
  color: var(--admin-accent-primary) !important;
  font-weight: 700;
  letter-spacing: 0.5px;
  font-size: 1.1rem;
  background: var(--admin-bg-secondary) !important;
}
tbody tr {
  background: var(--admin-bg-secondary) !important;
}
tbody td {
  background: var(--admin-bg-secondary) !important;
  color: var(--admin-text-primary) !important;
}
.alert-info {
  background: var(--admin-bg-secondary);
  border: 1px solid var(--admin-accent-primary);
  color: var(--admin-text-primary);
  border-radius: 12px;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  padding: 8px;
  background: var(--admin-bg-tertiary);
  border-radius: 8px;
  border: 1px solid var(--admin-border-light);
}

li img {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 6px;
  margin-right: 12px;
  border: 1px solid var(--admin-border-light);
}

li strong {
  color: var(--admin-accent-primary);
  font-weight: 600;
}

li br {
  display: none;
}

li strong + br + span {
  color: var(--admin-text-muted);
  font-size: 0.9rem;
}

li div {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

li span {
  color: var(--admin-text-muted);
  font-size: 0.9rem;
}

/* Estilos para badges de status */
.badge {
  font-size: 0.8rem;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.bg-warning {
  background-color: var(--admin-warning) !important;
}

.bg-info {
  background-color: var(--admin-info) !important;
}

.bg-primary {
  background-color: var(--admin-accent-primary) !important;
  color: var(--admin-bg-primary) !important;
}

.bg-success {
  background-color: var(--admin-success) !important;
}

.bg-danger {
  background-color: var(--admin-danger) !important;
}

.bg-secondary {
  background-color: var(--admin-text-muted) !important;
}

/* Estilo para botão de recarregar endereço */
.btn-link {
  color: var(--admin-accent-primary);
  text-decoration: none;
  font-size: 0.8rem;
}

.btn-link:hover {
  color: var(--admin-accent-secondary);
}

.text-muted {
  color: var(--admin-text-muted) !important;
}

/* Estilos para os filtros */
.filters-section {
  background: var(--admin-bg-secondary) !important;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid var(--admin-border-light);
  margin-bottom: 2rem;
}

.filter-select,
.filter-input {
  background-color: var(--admin-bg-tertiary);
  border: 1px solid var(--admin-border-medium);
  color: var(--admin-text-primary);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.filter-select:focus,
.filter-input:focus {
  background-color: var(--admin-bg-tertiary);
  border-color: var(--admin-accent-primary);
  box-shadow: 0 0 0 0.2rem rgba(0, 255, 225, 0.25);
  color: var(--admin-text-primary);
  outline: none;
}

.filter-select option {
  background-color: var(--admin-bg-tertiary);
  color: var(--admin-text-primary);
}

.form-label {
  color: var(--admin-text-secondary);
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.btn-outline-secondary {
  color: var(--admin-text-muted);
  border-color: var(--admin-border-medium);
  background: transparent;
  transition: all 0.3s ease;
}

.btn-outline-secondary:hover {
  color: var(--admin-accent-primary);
  border-color: var(--admin-accent-primary);
  background: rgba(0, 255, 225, 0.1);
}

.alert-warning {
  background: var(--admin-bg-secondary);
  border: 1px solid var(--admin-warning);
  color: var(--admin-text-primary);
  border-radius: 12px;
}

.alert-warning .btn-link {
  color: var(--admin-warning);
  text-decoration: none;
}

.alert-warning .btn-link:hover {
  color: var(--admin-accent-primary);
}
</style>