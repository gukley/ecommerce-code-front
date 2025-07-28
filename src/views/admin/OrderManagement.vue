<template>
  <div>
    <h2>Gerenciar Pedidos</h2>
    <table v-if="orders.length" class="table table-dark mt-4">
      <thead>
        <tr>
          <th>ID</th>
          <th>Usuário</th>
          <th>Endereço (ID)</th>
          <th>Status</th>
          <th>Data</th>
          <th>Produtos</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.id">
          <td>{{ order.id }}</td>
          <td>{{ order.user_id }}</td>
          <td>{{ order.address_id }}</td>
          <td>{{ order.status }}</td>
          <td>{{ new Date(order.order_date).toLocaleString() }}</td>
          <td>
            <ul>
              <li v-for="(product, idx) in order.products" :key="idx" style="margin-bottom: 10px;">
                <img :src="product.image_path ? (baseUrl + product.image_path) : '/placeholder-product.png'" alt="Produto" style="width:40px; height:40px; object-fit:cover; border-radius:6px; margin-right:8px;">
                <strong>{{ product.name }}</strong><br>
                Preço: R$ {{ Number(product.price).toFixed(2) }}
              </li>
            </ul>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-else class="alert alert-info mt-4">Nenhum pedido encontrado.</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getOrderByAdmin } from '@/services/apiService'
import { useAuthStore } from '@/stores/authStore'

const orders = ref([])
const authStore = useAuthStore()
const baseUrl = 'http://35.196.79.227:8000'

onMounted(async () => {
  while (!authStore.user || !authStore.user.id) {
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  orders.value = await getOrderByAdmin(authStore.user.id)
  console.log('Pedidos retornados:', orders.value)
  window.pedidosAdmin = orders.value
})
</script>

<style scoped>

</style>