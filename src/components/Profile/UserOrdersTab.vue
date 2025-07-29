<template> 
    <div class="tab"> 
        <div class="pedidos"> 
            <h3>Meus Pedidos</h3>

            <div v-if="orders.length === 0" class="vazio"> 
                <p>Nenhum pedido encontrado</p>
                <button @click="$router.push('/')">Fazer compra</button>
            </div>

            <div v-else class="lista"> 
                <div v-for="order in orders" :key="order.id" class="pedido"> 
                    <div class="topo"> 
                        <h4>Pedido #{{ order.id }}</h4>
                        <span class="status" :class="order.status">{{ getStatusText(order.status) }}</span>
                    </div>
                    <div class="produtos"> 
                        <div v-for="(product, idx) in order.products" :key="idx" class="produto"> 
                            <img :src="product.image_path ? (baseUrl + ProductCard.image_path) : '/placeholder-product.png'" alt="Produto" />
                            <span>{{ product.name }}</span>
                            <span>R$ {{ Number(product.price).toFixed(2) }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
  orders: {
    type: Array,
    default: () => []
  },
  baseUrl: {
    type: String,
    required: true
  }
});

function getStatusText(status) {
  const textos = {
    'pending': 'Pendente',
    'processing': 'Processando',
    'shipped': 'Enviado',
    'delivered': 'Entregue',
    'cancelled': 'Cancelado'
  };
  return textos[status] || status;
}
</script>

<style scoped> 
.tab { 
  animation: fadeIn 0.3s ease
}
.topo { 
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}
.topo h3 { 
  margin: 0;
  font-size: 1.2rem;
}

.vazio { 
  text-align: center;
  padding: 3rem 2rem;
  color: rgba(255, 255, 255, 0.6);
}
.vazio p { 
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
}
.vazio button { 
  background: #00ffe1;
  color: #0f0f23;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
}

.lista { 
  display: grid;
  gap: 1rem;
}
.pedido { 
  flex-direction: column;
  align-items: stretch;
  background: #24243a;
  border-radius: 8px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.pedido .topo { 
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}
.pedido .topo h4 { 
  margin: 0;
  font-size: 1.1rem;
}

.status { 
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status.pending { background: #ffa726; color: #0f0f23; }
.status.processing { background: #4fc3f7; color: #fff; }
.status.shipped { background: #00ffe1; color: #0f0f23; }
.status.delivered { background: #00d4aa; color: #0f0f23; }
.status.cancelled { background: #ff6b6b; color: #fff; }
.produtos {
  display: grid;
  gap: 0.75rem;
}
.produto { 
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: #1a1a2e;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}
.produto img {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}
.produto span { 
  flex: 1;
  font-weight: 600;
}
.produto span:last-child { 
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
}
</style>