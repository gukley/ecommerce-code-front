<template>
    <div class="profile-page">
      <UserProfileHeader
        :editando="editando"
        @editar-perfil="editarPerfil"
        @salvar-edicao="salvarEdicao"
        @cancelar-edicao="cancelarEdicao"
        @logout="logout"
      />
  
      <div class="container">
        <UserProfileCard
          :user="user"
          :editando="editando"
          v-model:form="form"
          :baseUrl="BASE_URL"
        />
  
        <div class="abas">
          <div class="tabs">
            <button :class="{ ativo: activeTab === 'perfil' }" @click="activeTab = 'perfil'">Perfil</button>
            <button :class="{ ativo: activeTab === 'enderecos' }" @click="activeTab = 'enderecos'">Endereços</button>
            <button :class="{ ativo: activeTab === 'pedidos' }" @click="activeTab = 'pedidos'">Pedidos</button>
          </div>
  
          <div class="conteudo">
            <div v-if="activeTab === 'perfil'" class="tab">
              <div class="detalhes">
                <div class="item">
                  <span>Nome:</span>
                  <p>{{ user?.name }}</p>
                </div>
                <div class="item">
                  <span>Email:</span>
                  <p>{{ user?.email }}</p>
                </div>
              </div>
            </div>
  
            <UserAddressesTab
              v-if="activeTab === 'enderecos'"
              :addresses="enderecos"
              :showModal="showModalEndereco"
              :editingAddress="enderecoEditando"
              @abrir-modal-endereco="abrirModalEndereco"
              @fechar-modal="fecharModalEndereco"
              @salvar-endereco="salvarEndereco"
              @remover-endereco="removerEndereco"
            />
  
            <UserOrdersTab
              v-if="activeTab === 'pedidos'"
              :orders="orders"
              :baseUrl="BASE_URL"
            />
          </div>
        </div>
      </div>
    </div>
</template>

<script setup> 
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { getAllAddresses, createAddress, updateAddress, deleteAddress } from '@/services/apiService'
import { useToast } from 'vue-toastification'
import { useOrderStore } from '@/stores/orderStore'

import UserProfileHeader from '@/components/Profile/UserProfileHeader.vue'
import UserProfileCard from '@/components/Profile/UserProfileCard.vue'
import UserAddressesTab from '@/components/Profile/UserAddressesTab.vue'
import UserOrdersTab from '@/components/Profile/UserOrdersTab.vue'

const BASE_URL = 'http://35.196.79.227:8000'
const authStore = useAuthStore()
const router = useRouter()
const user = ref(null)
const editando = ref(false)
const form = ref({ name: '', email: '' })
const enderecos = ref([])
const showModalEndereco = ref(false)
const enderecoEditando = ref({})
const toast = useToast()
const orderStore = useOrderStore()
const { orders, fetchUsersOrders } = orderStore
const activeTab = ref('perfil')

onMounted(async () => { 
    await authStore.getUserProfile()
    user.value = authStore.user
    await carregarEnderecos()
    await fetchUsersOrders()
})

function editarPerfil() { 
    form.value = { name: user.value?.name || '', email: user.value?.email || '' }
    editando.value = true
}

function cancelarEdicao() { 
    editando.value = false
}

async function salvarEdicao() { 
    try { 
        await authStore.updateUserProfile(form.value)
        await authStore.getUserProfille()
        user.value = authStore.user
        editando.value = false
        toast.success('Dados atualizados!')
    } catch (e) { 
      toast.error('Erro ao atualizar dados.')
    }
}

function logout() { 
    authStore.logout()
    router.push('/')
}

async function carregarEnderecos() { 
    enderecos.value = await getAllAddresses()
}

function abrirModalEndereco(endereco = null) { 
    if (endereco) { 
        enderecoEditando.value = { ...endereco }
    } else { 
        enderecoEditando.value = { street: '', number: '',  neighborhood: '', city: '', state: '', zip_code: '', complement: '' }
    }
    showModalEndereco.value = true
}

function fecharModalEndereco() { 
    showModalEndereco.value = false
}

async function salvarEndereco() { 
    try { 
        if (enderecoEditando.value.id) { 
            await updateAddress(enderecoEditando.value.id, enderecoEditando.value)
            toast.success('Endereço atualizado!')
        } else { 
            await createAddress(enderecoEditando.value)
            toast.success('Endereço adicionado!')
        }
        await carregarEnderecos()
        showModalEndereco.value = false
    } catch (e) { 
        toast.error('Erro ao salvar endereço.')
    }
}

async function removerEndereco(id) {
  if (confirm('Remover este endereço?')) {
    try {
      await deleteAddress(id);
      await carregarEnderecos();
      toast.success('Endereço removido!');
    } catch (e) {
      toast.error('Erro ao remover endereço.');
    }
  }
}
</script>

<style scoped>
/* Estilos gerais da página */
.profile-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f23 0%, #24243a 100%);
  color: white;
  font-family: 'Inter', sans-serif;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
}

/* Estilos das abas */
.abas {
  background: #1a1a2e;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
}
.tabs {
  display: flex;
  background: #24243a;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
.tabs button {
  flex: 1;
  padding: 1rem;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  font-weight: 600;
}
.tabs button.ativo {
  background: #1a1a2e;
  color: #00ffe1;
  border-bottom: 2px solid #00ffe1;
}
.conteudo {
  padding: 2rem;
}
.tab {
  animation: fadeIn 0.3s ease;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Estilos da aba Perfil */
.detalhes {
  display: grid;
  gap: 1rem;
}
.item {
  padding: 1rem;
  background: #24243a;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}
.item span {
  display: block;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 0.5rem;
}
.item p {
  margin: 0;
  font-weight: 600;
}

@media (max-width: 768px) {
  .container {
    grid-template-columns: 1fr;
    padding: 1rem;
  }
  .tabs {
    flex-direction: column;
  }
}
</style>