<template>
    <div v-if="paginatedOrders.length" class="table-responsive">
      <table class="table table-dark">
        <thead>
          <tr>
            <th>ID</th>
            <th>Usuário</th>
            <th>Endereço</th>
            <th>Status</th>
            <th>Data</th>
            <th>Valor Total</th>
            <th class="text-center">Produtos</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in paginatedOrders" :key="order.id">
            <td>{{ order.id }}</td>
            <td>{{ order.user_id }}</td>
            <td>
              <div v-if="addresses[order.address_id]">
                {{ formatAddress(addresses[order.address_id]) }}
              </div>
              <div v-else class="text-muted">
                <small>Carregando...</small>
                <button @click="$emit('request-address-data', order.address_id)" class="btn-link ms-2">
                  <i class="bi bi-arrow-clockwise"></i>
                </button>
              </div>
            </td>
            <td>
              <span :class="getStatusClass(order.status)">{{ getStatusText(order.status) }}</span>
            </td>
            <td>{{ new Date(order.order_date).toLocaleString() }}</td>
            
            <td style="padding-right: 20px;">R$ {{ Number(order.total).toFixed(2) }}</td>
            
            <td>
              <ul class="product-list">
                <li v-for="(product, idx) in order.products" :key="idx" class="product-item">
                  <img :src="product.image_path ? (baseUrl + product.image_path) : '/placeholder-product.png'" alt="Produto">
                  <div class="product-info">
                    <div class="product-name">{{ product.name }} (x{{ product.quantity }})</div>
                    <div class="product-price">R$ {{ Number(product.price).toFixed(2) }}</div>
                  </div>
                </li>
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div v-else class="alert alert-warning">
      <i class="bi bi-exclamation-triangle me-2"></i>
      Nenhum pedido encontrado com os filtros aplicados.
      <button @click="$emit('clear-filters')" class="btn-link ms-2">Limpar filtros</button>
    </div>
  
    <!-- Controles de Paginação -->
    <div class="pagination-controls d-flex justify-content-center align-items-center my-4" v-if="totalPages > 1">
      <button class="btn btn-pagination me-2" :disabled="currentPage === 1" @click="$emit('go-to-page', currentPage - 1)">
        <i class="bi bi-chevron-left"></i> Anterior
      </button>
      <span class="page-info text-primary-ggtech">Página {{ currentPage }} de {{ totalPages }}</span>
      <button class="btn btn-pagination ms-2" :disabled="currentPage === totalPages" @click="$emit('go-to-page', currentPage + 1)">
        Próxima <i class="bi bi-chevron-right"></i>
      </button>
    </div>
  </template>
  
  <script setup>
  import { defineProps, defineEmits } from 'vue';
  
  const props = defineProps({
    paginatedOrders: {
      type: Array,
      required: true
    },
    addresses: {
      type: Object,
      required: true
    },
    currentPage: {
      type: Number,
      required: true
    },
    totalPages: {
      type: Number,
      required: true
    },
    baseUrl: {
      type: String,
      required: true
    }
  });
  
  const emit = defineEmits(['request-address-data', 'clear-filters', 'go-to-page']);
  
  // Função para formatar endereço
  const formatAddress = (address) => {
    if (!address) return 'Endereço não encontrado';
    
    const parts = [];
    if (address.street) parts.push(address.street);
    if (address.number) parts.push(address.number);
    if (address.complement) parts.push(address.complement);
    if (address.bairro) parts.push(address.bairro);
    if (address.city) parts.push(address.city);
    if (address.state) parts.push(address.state);
    if (address.zip_code) parts.push(address.zip_code);
    
    return parts.join(', ');
  };
  
  const getStatusText = (status) => { 
    const textos = { 
      'PENDING': 'Pendente',
      'PROCESSING': 'Processando',
      'SHIPPED': 'Enviado',
      'DELIVERED': 'Entregue',
      'CANCELLED': 'Cancelado'
    };
    return textos[status] || status;
  };
  
  // Função para estilizar status
  const getStatusClass = (status) => {
    const statusClasses = {
      'pending': 'status-badge status-pending',
      'processing': 'status-badge status-processing',
      'shipped': 'status-badge status-shipped',
      'delivered': 'status-badge status-delivered',
      'cancelled': 'status-badge status-cancelled'
    };
    return statusClasses[status] || 'status-badge status-pending';
  };
  </script>
  
  <style scoped>
 .table-dark {
    background-color: var(--admin-bg-secondary) !important;
    color: var(--admin-text-primary) !important;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  }
  
  .table-dark thead th {
    background-color: var(--admin-bg-tertiary) !important;
    color: var(--admin-accent-primary) !important;
    border-bottom: 2px solid var(--admin-border-medium);
    font-weight: 700;
    padding: 1rem;
  }
  
  .table-dark tbody td {
    background-color: var(--admin-bg-secondary) !important;
    color: var(--admin-text-primary) !important;
    border-bottom: 1px solid var(--admin-border-light);
    padding: 1rem;
    vertical-align: middle;
  }
  
  .table-dark tbody tr:hover {
    background-color: rgba(0, 255, 225, 0.05) !important;
  }
    .status-badge {
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-weight: 600;
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .status-pending {
    background-color: var(--admin-warning);
    color: #fff;
  }
  
  .status-processing {
    background-color: var(--admin-info);
    color: #fff;
  }
  
  .status-shipped {
    background-color: var(--admin-accent-primary);
    color: #0f0f23;
  }
  
  .status-delivered {
    background-color: var(--admin-success);
    color: #0f0f23;
  }
  
  .status-cancelled {
    background-color: var(--admin-danger);
    color: #fff;
  }
  
  .product-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .product-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.5rem 0;
    border-bottom: 1px solid var(--admin-border-light);
  }
  
  .product-item:last-child {
    border-bottom: none;
  }
  
  .product-item img {
    width: 40px;
    height: 40px;
    object-fit: cover;
    border-radius: 6px;
    border: 1px solid var(--admin-border-light);
  }
  
  .product-info {
    flex: 1;
  }
  
  .product-name {
    font-weight: 600;
    color: var(--admin-text-primary);
    margin-bottom: 0.25rem;
  }
  
  .product-price {
    font-size: 0.9rem;
    color: var(--admin-text-muted);
  }
  
  .btn-link {
    color: var(--admin-accent-primary);
    text-decoration: none;
    font-size: 0.8rem;
    background: none;
    border: none;
    padding: 0;
    margin: 0;
  }
  
  .btn-link:hover {
    color: var(--admin-accent-secondary);
  }
  
  /* Alertas */
  .alert-warning {
    background: var(--admin-bg-secondary);
    border: 1px solid var(--admin-warning);
    color: var(--admin-text-primary);
    border-radius: 12px;
    padding: 1rem;
    margin-bottom: 1rem;
  }
  
  .alert-warning .btn-link {
    color: var(--admin-warning);
    text-decoration: none;
  }
  
  .alert-warning .btn-link:hover {
    color: var(--admin-accent-primary);
  }
  
  .pagination-controls {
    margin-top: 2rem;
  }
  
  .btn-pagination {
    background: var(--admin-bg-tertiary);
    color: var(--admin-accent-primary);
    border: 1px solid var(--admin-border-medium);
    border-radius: 8px;
    padding: 0.6rem 1.2rem;
    font-weight: 600;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .btn-pagination:hover:not(:disabled) {
    background: var(--admin-accent-primary);
    color: var(--admin-bg-primary);
    border-color: var(--admin-accent-primary);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 255, 225, 0.2);
  }
  
  .btn-pagination:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .page-info {
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--admin-accent-primary);
  }
  
  /* Responsividade */
  @media (max-width: 768px) {
    .table-responsive {
      font-size: 0.9rem;
    }
  
    .pagination-controls {
      flex-direction: column;
      gap: 1rem;
    }
  
    .btn-pagination {
      width: 100%;
      justify-content: center;
    }
  }
  </style>