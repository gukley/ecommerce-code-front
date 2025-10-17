<template>
  <section class="card addresses-card border-0 shadow-sm modern-addresses-card">
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2 class="h5 fw-bold text-blue mb-0">Meus Endereços</h2>
        <button @click="$emit('add')" class="btn btn-green btn-sm modern-btn" title="Novo Endereço">
          <i class="bi bi-plus-lg"></i>
        </button>
      </div>
      <div v-if="addresses.length === 0" class="alert alert-dark py-2">Nenhum endereço cadastrado.</div>
      <ul v-else class="list-group addresses-list">
        <li v-for="addr in addresses" :key="addr.id" class="list-group-item d-flex justify-content-between align-items-center bg-address border-0 shadow-sm rounded-3 mb-3 px-3 py-3 animate-fade modern-list-item">
          <span class="fw-medium modern-address-text">
            {{ addr.street }}, {{ addr.number }} - {{ addr.city }}, {{ addr.state }} ({{ addr.zip }})
          </span>
          <div class="d-flex gap-2">
            <button @click="$emit('edit', addr)" class="btn btn-purple btn-sm px-3 modern-btn" title="Editar">
              <i class="bi bi-pencil"></i>
            </button>
            <button @click="() => deleteAddressHandler(addr.id)" class="btn btn-danger btn-sm px-3 modern-btn" title="Excluir">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { deleteAddress, getAllAddresses } from '@/services/apiService'

const props = defineProps({ addresses: Array })
const emit = defineEmits(['add', 'edit', 'delete'])

const addresses = ref([])

async function fetchAddresses() {
  addresses.value = await getAllAddresses()
}

async function deleteAddressHandler(id) {
  try {
    await deleteAddress(id)
    await fetchAddresses() // Atualiza a lista após excluir
  } catch (error) {
    // Trate o erro, ex: toast.error('Erro ao excluir endereço')
    console.error('Erro ao excluir endereço:', error)
  }
}

onMounted(fetchAddresses)
</script>
<style scoped>
.addresses-card.modern-addresses-card {
  border-radius: 18px;
  background: #f8f9fa;
  box-shadow: 0 8px 32px 0 #b8d8ff30;
  border: 1.5px solid #e5e7eb;
}
.bg-address {
  background: #f3f4f8 !important;
}
.modern-address-text {
  font-size: 1.08rem;
  letter-spacing: 0.2px;
  color: #232e47;
  font-weight: 500;
}
.btn-green.modern-btn {
  background: linear-gradient(90deg,#24e29b 60%, #4be3b0 100%);
  color: #181e2a;
  font-weight: 700;
  border-radius: 12px;
  border: none;
  box-shadow: 0 2px 8px #24e29b30;
  transition: background 0.2s, box-shadow 0.2s;
}
.btn-green.modern-btn:hover { background: linear-gradient(90deg,#4be3b0 60%, #24e29b 100%); box-shadow: 0 4px 16px #24e29b60;}
.btn-purple.modern-btn {
  background: linear-gradient(90deg,#a470ff 60%, #ff6ad5 100%);
  color: #fff;
  border-radius: 12px;
  font-weight: 700;
  border: none;
  box-shadow: 0 2px 8px #a470ff30;
  transition: background 0.2s, box-shadow 0.2s;
  padding: 7px 14px !important;
}
.btn-purple.modern-btn:hover { background: linear-gradient(90deg,#ff6ad5 60%, #a470ff 100%); color:#232e47; box-shadow: 0 4px 16px #a470ff60;}
.btn-danger.modern-btn {
  background: linear-gradient(90deg,#ff6a6a 60%, #ffb36a 100%);
  color: #fff;
  border-radius: 12px;
  font-weight: 700;
  border: none;
  box-shadow: 0 2px 8px #ff6a6a30;
  transition: background 0.2s, box-shadow 0.2s;
  padding: 7px 14px !important;
}
.btn-danger.modern-btn:hover { background: linear-gradient(90deg,#ffb36a 60%, #ff6a6a 100%); color:#232e47; box-shadow: 0 4px 16px #ff6a6a60;}
.text-blue { color: #399bff;}
.modern-list-item {
  transition: box-shadow 0.2s, background 0.2s;
  border-radius: 14px !important;
  background: #f3f4f8 !important;
}
.modern-list-item:hover {
  box-shadow: 0 4px 16px #399bff30;
  background: #eaf6ff !important;
}
@keyframes fadein {
  from { opacity: 0; transform: translateY(10px);}
  to { opacity: 1; transform: translateY(0);}
}
.animate-fade { animation: fadein 0.2s; }
</style>