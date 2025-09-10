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
              <td class="fw-bold text-coupon-code">{{ coupon.code }}</td>
              <td>
                <span v-if="coupon.discount_percentage > 0" class="badge badge-discount">
                  {{ coupon.discount_percentage }}%
                </span>
                <span v-else class="text-muted">N/A</span>
              </td>
              <td class="text-coupon-date">{{ formatDate(coupon.end_date) }}</td>
              <td>
                <span :class="`badge rounded-pill ${getCouponStatusClass(coupon)}`">
                  {{ formatStatus(coupon) }}
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
  
  const formatStatus = (coupon) => {
    // Considera expirado se passou da data de expiração
    if (coupon.end_date) {
      const expirationDate = new Date(coupon.end_date);
      const now = new Date();
      if (expirationDate < now) {
        return 'Expirado';
      }
    }
    return 'Ativo';
  };

  const getCouponStatusClass = (coupon) => {
    if (coupon.end_date) {
      const expirationDate = new Date(coupon.end_date);
      const now = new Date();
      if (expirationDate < now) {
        return 'bg-danger text-white';
      }
    }
    return 'bg-success text-white';
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
  
  /* Estilos adicionais para melhorar a aparência */
  .text-muted {
    color: #9ca3af !important;
    font-style: italic;
  }
  
  .fw-bold {
    color: #f9fafb;
    font-weight: 700;
  }
  
  /* Animação para as linhas da tabela */
  .table-custom tbody tr {
    transition: all 0.3s ease;
  }
  
  /* Estilo para o container principal */
  .coupon-list-container {
    background: linear-gradient(135deg, #1a2332 0%, #2d3748 100%);
    border: 1px solid #374151;
    border-radius: 1rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    overflow: hidden;
  }
  
  /* Estilo para o cabeçalho da tabela */
  .table-custom thead {
    position: sticky;
    top: 0;
    z-index: 10;
  }
  
  .text-primary-ggtech {
    background: linear-gradient(90deg, #64b5f6 0%, #42a5f5 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-weight: 700;
  }
  
  /* Estilo para a tabela */
  .table-custom {
    color: #e8eaed;
    border-collapse: separate;
    border-spacing: 0;
    background: transparent;
  }
  
  .table-custom th {
    background: linear-gradient(135deg, #374151 0%, #4b5563 100%);
    color: #f9fafb;
    border: none;
    font-weight: 600;
    padding: 1rem;
    text-transform: uppercase;
    font-size: 0.875rem;
    letter-spacing: 0.05em;
  }
  
  .table-custom td {
    border-top: 1px solid #374151;
    border-bottom: 1px solid #374151;
    padding: 1rem;
    background: transparent;
    transition: background-color 0.2s ease;
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
    background: linear-gradient(135deg, #374151 0%, #4b5563 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
  
  .table-custom tbody tr:hover td {
    border-color: #64b5f6;
  }
  
  /* Estilo para os botões de ação */
  .btn-outline-info-ggtech {
    background: linear-gradient(135deg, #64b5f6 0%, #42a5f5 100%);
    border: 2px solid #64b5f6;
    color: white;
    transition: all 0.3s ease;
    border-radius: 0.5rem;
    font-weight: 600;
  }
  
  .btn-outline-info-ggtech:hover {
    background: linear-gradient(135deg, #42a5f5 0%, #64b5f6 100%);
    border-color: #42a5f5;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(100, 181, 246, 0.4);
  }
  
  .btn-outline-danger {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    border: 2px solid #ef4444;
    color: white;
    transition: all 0.3s ease;
    border-radius: 0.5rem;
    font-weight: 600;
  }
  
  .btn-outline-danger:hover {
    background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
    border-color: #dc2626;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
  }
  
  /* Estilo para os badges */
  .badge {
    font-weight: 600;
    padding: 0.5rem 1rem;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  
  .bg-success {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
  }
  
  .bg-danger {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%) !important;
  }
  
  .bg-warning {
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%) !important;
  }
  
  .bg-secondary {
    background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%) !important;
  }
  
  /* Estilo para o alerta de informação */
  .alert-info-ggtech {
    background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
    border: 1px solid #60a5fa;
    color: white;
    border-radius: 0.75rem;
    padding: 1rem 1.5rem;
    font-weight: 500;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }

  .text-coupon-code {
    font-size: 1.1rem;
    color: #fff !important;
    letter-spacing: 1px;
    font-weight: 700;
    /* Removido o gradiente/text-fill para garantir contraste */
    background: none !important;
    -webkit-background-clip: unset !important;
    -webkit-text-fill-color: unset !important;
    background-clip: unset !important;
  }

  .badge-discount {
    background: linear-gradient(90deg, #43e97b 0%, #38f9d7 100%);
    color: #181e2a !important;
    font-weight: 700;
    font-size: 1rem;
    border-radius: 8px;
    padding: 0.4em 1em;
    margin: 0 0.2em;
    letter-spacing: 0.5px;
    box-shadow: 0 2px 8px #43e97b40;
  }

  .text-coupon-date {
    font-size: 1rem;
    color: #b0b7c3;
    font-weight: 500;
  }

  .table-custom th, .table-custom td {
    font-size: 1rem;
  }
  </style>
