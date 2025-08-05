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
          <button @click="recarregarDados" class="btn-atualizar" title="Atualizar dados">
            <i class="bi bi-arrow-clockwise"></i>
          </button>
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
            :orders="orderStore.orders"
            :baseUrl="BASE_URL"
            :loading="orderStore.loading"
            @load-orders="orderStore.fetchUsersOrders"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup> 
import { ref, onMounted, watch } from 'vue'
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
const activeTab = ref('perfil')

// Watcher para carregar pedidos quando a aba for ativada
watch(activeTab, async (newTab) => {
    if (newTab === 'pedidos' && orderStore.shouldRefetch()) {
        try {
            await orderStore.fetchUsersOrders();
        } catch (error) {
            console.error('Erro ao carregar pedidos:', error);
        }
    }
});

onMounted(async () => { 
    try {
        // Verificar se há token (autenticação básica)
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }
        
        // Primeiro carregar o perfil do usuário para verificar se o token é válido
        try {
            await authStore.getUserProfile();
            user.value = authStore.user;
        } catch (profileError) {
            if (profileError.response?.status === 401) {
                router.push('/login');
                return;
            }
            throw profileError;
        }
        
        // Se chegou até aqui, o token é válido, carregar os outros dados
        await Promise.all([
            carregarEnderecos(),
            orderStore.fetchUsersOrders()
        ]);
        
    } catch (error) {
        console.error('Erro ao carregar dados do perfil:', error);
        toast.error('Erro ao carregar dados do perfil');
    }
})

// Função para recarregar todos os dados
async function recarregarDados() {
    try {
        await Promise.all([
            authStore.getUserProfile(),
            carregarEnderecos(),
            orderStore.fetchUsersOrders()
        ])
        user.value = authStore.user
        toast.success('Dados recarregados!')
    } catch (error) {
        console.error('❌ Erro ao recarregar dados:', error)
        toast.error('Erro ao recarregar dados')
    }
}

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
        await authStore.getUserProfile() 
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
    try {
        const data = await getAllAddresses();
        enderecos.value = data || [];
    } catch (error) {
        console.error('❌ Erro ao carregar endereços:', error);
        enderecos.value = [];
        toast.error('Erro ao carregar endereços');
    }
}

function abrirModalEndereco(endereco = null) { 
  if (endereco) { 
    enderecoEditando.value = { 
      street: endereco.street || '',
      number: endereco.number || null,
      zip: endereco.zip || endereco.zip || '',
      city: endereco.city || '',
      state: endereco.state || '',
      country: endereco.country || 'Brasil',
      neighborhood: endereco.neighborhood || '',
      complement: endereco.complement || '',
      id: endereco.id || null
    }
  } else { 
    enderecoEditando.value = { 
      street: '',
      number: null,
      neighborhood: '',
      city: '',
      state: '',
      zip: '',
      complement: '',
      country: 'Brasil',
      id: null
    }
  }
  showModalEndereco.value = true
}

function fecharModalEndereco() { 
    showModalEndereco.value = false
    enderecoEditando.value = {}; 
}

async function salvarEndereco(enderecoData) { 
    try { 
        if (enderecoData.id) { 
            const enderecoAtualizado = await updateAddress(enderecoData.id, enderecoData);
            toast.success('Endereço atualizado!');
            
            // Atualizar o item diretamente no array local
            const index = enderecos.value.findIndex(e => e.id === enderecoData.id);
            if (index !== -1) {
                enderecos.value[index] = { ...enderecoAtualizado };
            }
          } else { 
            const novoEndereco = await createAddress(enderecoData);
            toast.success('Endereço adicionado!');
            enderecos.value.push(novoEndereco);
        }
        
        // Fecha o modal após o sucesso
        showModalEndereco.value = false;
        enderecoEditando.value = {};
        await carregarEnderecos();

    } catch (e) { 
       console.error("❌ Erro ao salvar endereço:", e)
       if (e.response && e.response.status === 422 && e.response.data && e.response.data.detail) { 
         const details = e.response.data.detail.map(d => d.msg).join(', ')
         toast.error(`Erro de validação: ${details}`)
       } else { 
         toast.error('Erro ao salvar endereço.')
       }
    }
}

async function removerEndereco(id) {
    if (confirm('Remover este endereço?')) {
        try {
            await deleteAddress(id);
            
            // Remover do array local
            const index = enderecos.value.findIndex(e => e.id === id);
            if (index !== -1) {
                enderecos.value.splice(index, 1);
            }
            
            toast.success('Endereço removido!');
        } catch (e) {
            toast.error('Erro ao remover endereço.');
        }
    }
}
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f23 0%, #24243a 100%); 
  color: white;
  font-family: 'Inter', sans-serif;
  padding: 3rem 1.5rem; 
}

.container {
  max-width: 1280px; 
  margin: 2rem auto; 
  padding: 0 1rem; 
  display: grid;
  grid-template-columns: 350px 1fr; 
  gap: 2.5rem; 
}

/* Estilos das abas e conteúdo */
.abas {
  background: #1e1e2d; 
  border-radius: 16px; 
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4); 
  border: 1px solid rgba(255, 255, 255, 0.12); 
  overflow: hidden; 
  backdrop-filter: blur(5px); 
}

.tabs {
  display: flex;
  background: #2a2a3e; 
  border-bottom: 1px solid rgba(255, 255, 255, 0.15); 
  padding: 0.5rem 0;
}

.tabs button {
  flex: 1;
  padding: 1.2rem 1rem; 
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.75); 
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem; 
  transition: all 0.3s ease; 
  position: relative; 
}

.tabs button.ativo {
  color: #007bff; 
  background: rgba(0, 123, 255, 0.08);
}

.tabs button.ativo::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80%; 
  height: 3px; 
  background: #007bff; 
  border-radius: 2px 2px 0 0; 
  transition: all 0.3s ease;
}

.tabs button:hover:not(.ativo) {
  background: rgba(255, 255, 255, 0.05);
  color: #ffffff;
}

.btn-atualizar {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.7);
  padding: 0.75rem 1rem; 
  border-radius: 8px; 
  cursor: pointer;
  transition: all 0.3s ease;
  margin-left: auto;
  display: flex; 
  align-items: center;
  justify-content: center;
  font-size: 1rem; 
}

.btn-atualizar:hover {
  background: rgba(0, 123, 255, 0.15); 
  color: #007bff; 
  border-color: #007bff;
  box-shadow: 0 4px 10px rgba(0, 123, 255, 0.3); 
  transform: translateY(-2px); 
}

.conteudo {
  padding: 2.5rem; 
}

.tab {
  animation: fadeIn 0.4s ease-out; 
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(15px); } 
  to { opacity: 1; transform: translateY(0); }
}

.detalhes {
  display: grid;
  gap: 1.5rem; 
}

.item {
  padding: 1.5rem; 
  background: #2a2a3e;
  border-radius: 10px; /* Cantos arredondados */
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2); 
}

.item span {
  display: block;
  font-size: 0.95rem; 
  color: rgba(255, 255, 255, 0.65); 
  margin-bottom: 0.6rem; 
  font-weight: 500;
}

.item p {
  margin: 0;
  font-weight: 700; 
  font-size: 1.1rem; 
  color: #ffffff; 
}

/* Responsividade */
@media (max-width: 992px) { 
  .container {
    grid-template-columns: 1fr;
    padding: 1.5rem;
    gap: 2rem;
  }
  .profile-page {
    padding: 2rem 1rem;
  }
}

@media (max-width: 768px) {
  .tabs {
    flex-wrap: wrap; 
    justify-content: center;
  }
  .tabs button {
    flex: none; 
    width: 48%; 
    margin: 0.5%; 
    padding: 1rem 0.5rem;
    font-size: 0.9rem;
  }
  .tabs button.ativo::after {
    width: 60%; 
  }
  .btn-atualizar {
    width: 100%; 
    margin-top: 1rem;
  }
  .conteudo {
    padding: 2rem 1.5rem;
  }
}

@media (max-width: 480px) {
  .profile-page {
    padding: 1rem 0.5rem;
  }
  .container {
    padding: 0.5rem;
  }
  .tabs button {
    width: 98%;
    margin: 0.25rem 1%;
  }
  .conteudo {
    padding: 1.5rem 1rem;
  }
  .item {
    padding: 1.2rem;
  }
  .item span {
    font-size: 0.9rem;
  }
  .item p {
    font-size: 1rem;
  }
}
</style>