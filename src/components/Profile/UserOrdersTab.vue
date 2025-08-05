<template> 
  <div class="tab"> 
    <div class="pedidos"> 
      <h3>Meus Pedidos</h3>

      <div v-if="loading" class="loading">
        <p>Carregando pedidos...</p>
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <div v-else-if="processedOrders.length === 0" class="vazio"> 
        <p>Nenhum pedido encontrado</p>
        <button @click="$router.push('/')" class="btn-primary">Fazer compra</button>
      </div>

      <div v-else class="lista">
        <div class="resumo-total card-glow">
          <p>Total de pedidos realizados: <strong>R$ {{ formatCurrency(totalPedidos) }}</strong></p>
        </div>
        
        <div v-for="order in processedOrders" :key="order.id" class="pedido card-glow"> 
          <div class="topo"> 
            <h4>Pedido #{{ order.id }}</h4>
            <span class="status" :class="order.status">{{ getStatusText(order.status) }}</span>
          </div>
          
          <div class="produtos"> 
            <div v-for="(product, idx) in order.processed_products" :key="idx" class="produto"> 
              <img 
                :src="product.image_path ? (baseUrl + product.image_path) : '/placeholder-product.png'" 
                :alt="product.name"
                @error="$event.target.src = '/placeholder-product.png'"
              />
              
              <div class="detalhes-produto">
                <span>{{ product.name }}</span>
                <small class="categoria">{{ product.category || 'Categoria não informada' }}</small>
              </div>
              
              <span class="quantidade">{{ product.quantity }}x</span>
              <span class="preco-unitario">R$ {{ formatCurrency(product.price) }}</span>
            </div>
          </div>
          
          <div class="total" :class="{ 'cancelado': order.status === 'CANCELED' }">
            <strong>Total do Pedido: R$ {{ formatCurrency(order.calculated_total_amount || 0) }}</strong>
          </div>
          <div class="acoes" v-if="order.status === 'PENDING'"> 
            <button class="btn-cancelar" @click="handleCancelOrder(order.id)">Cancelar Pedido</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, onMounted, computed } from 'vue';
import { useOrderStore } from '@/stores/orderStore';
import { useToast } from 'vue-toastification';

const props = defineProps({
  orders: {
    type: Array,
    default: () => []
  },
  baseUrl: {
    type: String,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['load-orders']);
const orderStore = useOrderStore();
const toast = useToast();

onMounted(() => {
  if (props.orders.length === 0 && !props.loading) {
    emit('load-orders');
  }
});

// Propriedade computada para processar os pedidos e adicionar os campos calculados
const processedOrders = computed(() => {
  return props.orders.map(order => {
    // Processar produtos: cada item da API é tratado como um item distinto
    // Se 'quantity' não vem da API, assume 1
    const processed_products = order.products.map(product => ({
      ...product,
      quantity: product.quantity || 1 // Assume 1 se a quantidade não for fornecida pela API
    }));

    // Calcular o total do pedido a partir dos produtos processados
    const calculated_total_amount = processed_products.reduce((sum, product) => {
      return sum + (Number(product.price) * (product.quantity || 1));
    }, 0);

    return {
      ...order,
      processed_products, // Adiciona os produtos com quantidades inferidas (ou 1)
      calculated_total_amount // Adiciona o total calculado no frontend
    };
  });
});


// Propriedade computada para somar o total de todos os pedidos
const totalPedidos = computed(() => {
  const total = processedOrders.value.reduce((acc, order) => {
    // Apenas soma o total de pedidos que não foram cancelados
    if (order.status !== 'CANCELED') { 
      return acc + (order.calculated_total_amount || 0);
    }
    return acc;
  }, 0);
  return total;
});

// Função para formatar valores monetários
function formatCurrency(value) {
  return Number(value).toFixed(2).replace('.', ',');
}

function getStatusText(status) {
  const textos = {
    'PENDING': 'Pendente',
    'PROCESSING': 'Processando',
    'SHIPPED': 'Enviado',
    'DELIVERED': 'Entregue',
    'CANCELED': 'Cancelado'
  };
  return textos[status] || status;
}

// Função para o usuário poder cancelar o pedido
async function handleCancelOrder(orderId) { 
  if (confirm('Tem certeza que deseja cancelar este pedido?')) { // Usar modal customizado em apps reais
    try { 
      await orderStore.cancelOrderById(orderId);
      toast.success('Pedido cancelado com sucesso!');
    } catch (error) { 
      console.error('Falha ao cancelar pedido:', error);
      toast.error('Erro ao cancelar pedido. Tente novamente.');
    }
  }
}
</script>

<style scoped> 
.tab { 
  animation: fadeIn 0.3s ease;
  padding: 0 1.5rem;
}
.pedidos h3 {
  margin-bottom: 2rem;
  font-size: 2rem;
  font-weight: 800;
  color: #e0e0e0;
  text-align: center;
  text-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);
}

.loading, .vazio {
  text-align: center;
  padding: 3rem 2rem;
  color: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.vazio p { 
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
  font-weight: 600;
}
.vazio .btn-primary {
  background: linear-gradient(145deg, #007bff, #0056b3);
  color: #fff;
  border: none;
  padding: 0.85rem 1.75rem;
  border-radius: 50px;
  cursor: pointer;
  font-weight: 700;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 123, 255, 0.3);
}
.vazio .btn-primary:hover {
  background: linear-gradient(145deg, #0056b3, #007bff);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 123, 255, 0.4);
}

.lista { 
  display: grid;
  gap: 1.5rem;
}

.resumo-total {
  background: #2a2a3e;
  border-radius: 12px;
  padding: 1.2rem 2rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
  text-align: right;
  font-size: 1.1rem;
  font-weight: 500;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}
.resumo-total strong {
  color: #007bff;
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: 0.5px;
}

.pedido { 
  background: #2a2a3e;
  border-radius: 12px;
  padding: 1.8rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}
.pedido:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(0, 123, 255, 0.3);
}
.pedido .topo { 
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.2rem;
  padding-bottom: 0.8rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}
.pedido .topo h4 { 
  margin: 0;
  font-size: 1.3rem;
  font-weight: 700;
  color: #ffffff;
}

.status { 
  padding: 0.35rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.15);
}

.status.PENDING { background: #ffc107; color: #343a40; }
.status.PROCESSING { background: #17a2b8; color: #fff; }
.status.SHIPPED { background: #28a745; color: #fff; }
.status.DELIVERED { background: #007bff; color: #fff; }
.status.CANCELED { background: #dc3545; color: #fff; }

.produtos {
  display: grid;
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.produto { 
  display: flex;
  align-items: center;
  gap: 1.2rem;
  padding: 1rem;
  background: #1e1e2d;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.1);
}
.produto img {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  flex-shrink: 0;
}
.detalhes-produto {
  flex-grow: 1;
}
.detalhes-produto span {
  display: block;
  font-weight: 600;
  color: #ffffff;
  font-size: 1rem;
}
.detalhes-produto .categoria {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 4px;
}
.quantidade {
  font-weight: 700;
  color: #007bff;
  font-size: 1.1rem;
  margin-right: 0.8rem;
}
.preco-unitario {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.95rem;
  flex-shrink: 0;
  font-weight: 500;
}

.total {
  text-align: right;
  padding-top: 1.2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: #007bff;
  font-size: 1.2rem;
  font-weight: 600;
}
.total strong {
  font-weight: 800;
  font-size: 1.3rem;
  letter-spacing: 0.5px;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.acoes { 
  display: flex;
  justify-content: flex-end;
  margin-top: 1.5rem;
  padding-top: 1.2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}
.btn-cancelar { 
  background: #dc3545;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.3s ease, transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 4px 10px rgba(220, 53, 69, 0.3);
}
.btn-cancelar:hover { 
  background: #c82333;
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(220, 53, 69, 0.4);
}
.total.cancelado { 
  color: #ff6b6b;
  text-decoration: line-through;
  opacity: 0.6;
}

.spinner-border {
  display: inline-block;
  width: 2rem;
  height: 2rem;
  vertical-align: -0.125em;
  border: .25em solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: .75s linear infinite spinner-border;
  color: #007bff;
}

@keyframes spinner-border {
  to { transform: rotate(360deg); }
}

.card-glow {
  box-shadow: 0 0 0 rgba(0, 123, 255, 0);
  transition: box-shadow 0.3s ease-out;
}

.card-glow:hover {
  box-shadow: 0 0 20px rgba(0, 123, 255, 0.3);
}

@media (max-width: 768px) {
  .tab {
    padding: 0 1rem;
  }
  .pedidos h3 {
    font-size: 1.6rem;
    margin-bottom: 1.5rem;
  }
  .resumo-total {
    padding: 1rem 1.5rem;
  }
  .resumo-total strong {
    font-size: 1.3rem;
  }
  .pedido {
    padding: 1.2rem;
  }
  .pedido .topo h4 {
    font-size: 1.1rem;
  }
  .status {
    font-size: 0.75rem;
    padding: 0.3rem 0.8rem;
  }
  .produtos {
    gap: 0.8rem;
  }
  .produto {
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 1rem;
  }
  .produto img {
    width: 50px;
    height: 50px;
  }
  .detalhes-produto {
    flex-basis: 100%;
    margin-top: 0.5rem;
  }
  .quantidade, .preco-unitario {
    margin-top: 0.5rem;
    font-size: 1rem;
  }
  .total {
    font-size: 1rem;
  }
  .total strong {
    font-size: 1.1rem;
  }
  .acoes {
    justify-content: center;
  }
  .btn-cancelar {
    width: 100%;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .pedidos h3 {
    font-size: 1.4rem;
    margin-bottom: 1rem;
  }
  .resumo-total {
    padding: 0.8rem 1rem;
  }
  .resumo-total strong {
    font-size: 1.1rem;
  }
  .pedido {
    padding: 1rem;
  }
  .pedido .topo h4 {
    font-size: 1rem;
  }
  .status {
    font-size: 0.7rem;
    padding: 0.3rem 0.8rem;
  }
  .produto img {
    width: 45px;
    height: 45px;
  }
  .detalhes-produto span {
    font-size: 0.95rem;
  }
  .detalhes-produto .categoria {
    font-size: 0.8rem;
  }
  .quantidade, .preco-unitario {
    font-size: 0.95rem;
  }
  .total {
    font-size: 0.9rem;
  }
  .total strong {
    font-size: 1rem;
  }
}
</style>