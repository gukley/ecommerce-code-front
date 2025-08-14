<template>
    <!-- Componente reutilizável para exibir a lista de cupons -->
    <div class="coupon-list-container p-4 rounded-3 shadow-lg">
      <h4 class="fw-bold text-primary-ggtech mb-3">Cupons de Desconto</h4>
      
      <!-- Mostra uma mensagem se não houver cupons -->
      <div v-if="coupons.length === 0" class="alert alert-info-ggtech mt-3">
        Nenhum cupom de desconto encontrado.
      </div>
  
      <!-- Tabela responsiva para exibir os cupons -->
      <div v-else class="table-responsive">
        <table class="table table-custom align-middle text-center">
          <thead>
            <tr>
              <th>Código</th>
              <th>Desconto</th>
              <th>Expira em</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <!-- Itera sobre a lista de cupons recebida via props -->
            <tr v-for="coupon in coupons" :key="coupon.code">
              <td class="fw-bold">{{ coupon.code }}</td>
              <td>
                <!-- Corrigido: Agora exibe a propriedade correta para o desconto percentual -->
                <span v-if="coupon.is_percentage">
                  {{ coupon.discount_percentage }}%
                </span>
                <span v-else>
                  R$ {{ Number(coupon.value).toFixed(2) }}
                </span>
              </td>
              <td>{{ formatDate(coupon.expiration_date) }}</td>
              <td>
                <span :class="`badge rounded-pill bg-${getCouponStatusColor(coupon.status)}`">
                  {{ formatStatus(coupon.status) }}
                </span>
              </td>
              <td>
                <div class="d-flex justify-content-center gap-2">
                  <button 
                    class="btn btn-sm btn-outline-info-ggtech" 
                    @click="$emit('edit-coupon', coupon)"
                  >
                    <i class="bi bi-pencil-square"></i>
                  </button>
                  <button 
                    class="btn btn-sm btn-outline-danger" 
                    @click="$emit('delete-coupon', coupon)"
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script setup>
  // Define os eventos que o componente pode emitir
  const emit = defineEmits(['edit-coupon', 'delete-coupon']);
  
  const props = defineProps({
    coupons: {
      type: Array,
      required: true,
      default: () => [],
    },
  });
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A'; 
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };
  
  const getCouponStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'success';
      case 'expired': return 'danger';
      case 'inactive': return 'secondary';
      default: return 'warning';
    }
  };
  
  const formatStatus = (status) => {
    const statusMap = {
      'active': 'Ativo',
      'expired': 'Expirado',
      'inactive': 'Inativo',
    };
    return statusMap[status?.toLowerCase()] || 'Desconhecido';
  };
  </script>
  
  <style scoped>
  /* Estilos para o tema GGTECH Admin */
  :root {
    --admin-bg-primary: #0f0f23;
    --admin-bg-secondary: #181828;
    --admin-bg-tertiary: #202038;
    --admin-accent-primary: #00ffe1;
    --admin-accent-secondary: #8f5fe8;
    --admin-text-primary: #ffffff;
    --admin-text-secondary: rgba(255, 255, 255, 0.8);
    --admin-text-muted: rgba(255, 255, 255, 0.6);
    --admin-border-light: rgba(255, 255, 255, 0.1);
    --admin-shadow-light: rgba(0, 0, 0, 0.4);
    --admin-danger: #ff6b6b;
    --admin-border-medium: rgba(255, 255, 255, 0.2);
  }
  
  .coupon-list-container {
    background-color: var(--admin-bg-secondary);
    border: 1px solid var(--admin-border-light);
  }
  
  .text-primary-ggtech {
    color: var(--admin-accent-primary);
  }
  
  /* Estilo para a tabela */
  .table-custom {
    color: var(--admin-text-secondary);
    border-collapse: separate;
    border-spacing: 0;
  }
  
  .table-custom th {
    background-color: var(--admin-bg-tertiary);
    color: var(--admin-text-primary);
    border: none;
    font-weight: 600;
    padding: 1rem;
  }
  
  .table-custom td {
    border-top: 1px solid var(--admin-border-light);
    border-bottom: 1px solid var(--admin-border-light);
    padding: 1rem;
  }
  
  /* Estilos de borda arredondada para a tabela */
  .table-custom thead tr th:first-child {
    border-top-left-radius: 0.5rem;
  }
  
  .table-custom thead tr th:last-child {
    border-top-right-radius: 0.5rem;
  }
  
  .table-custom tbody tr:last-child td:first-child {
    border-bottom-left-radius: 0.5rem;
  }
  
  .table-custom tbody tr:last-child td:last-child {
    border-bottom-right-radius: 0.5rem;
  }
  
  /* Efeito hover nas linhas */
  .table-custom tbody tr:hover {
    background-color: var(--admin-bg-tertiary);
  }
  
  /* Estilo para os botões de ação */
  .btn-outline-info-ggtech {
    color: var(--admin-accent-primary);
    border-color: var(--admin-accent-primary);
    transition: all 0.2s ease-in-out;
  }
  
  .btn-outline-info-ggtech:hover {
    background-color: var(--admin-accent-primary);
    color: var(--admin-bg-primary);
  }
  
  .btn-outline-danger {
    color: var(--admin-danger);
    border-color: var(--admin-danger);
    transition: all 0.2s ease-in-out;
  }
  
  .btn-outline-danger:hover {
    background-color: var(--admin-danger);
    color: #fff;
  }
  
  /* Estilo para o alerta de informação */
  .alert-info-ggtech {
    background-color: var(--admin-bg-tertiary);
    border-color: var(--admin-border-light);
    color: var(--admin-text-secondary);
  }
  
  </style>
  