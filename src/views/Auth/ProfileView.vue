<template>
  <div class="profile-page">
    <!-- Header simples -->
    <div class="header">
      <button @click="$router.push('/')" class="btn-voltar">
        <i class="bi bi-arrow-left"></i>
        Voltar
      </button>
      <h1>Meu Perfil</h1>
      <div class="acoes">
        <button v-if="!editando" @click="editarPerfil" class="btn-editar">Editar</button>
        <button v-if="editando" @click="salvarEdicao" class="btn-salvar">Salvar</button>
        <button v-if="editando" @click="cancelarEdicao" class="btn-cancelar">Cancelar</button>
        <button @click="logout" class="btn-sair">Sair</button>
      </div>
    </div>

    <!-- Conteúdo principal -->
    <div class="container">
      <!-- Card do perfil -->
      <div class="perfil-card">
        <div class="avatar">
          <img v-if="user?.image_path" :src="BASE_URL + user.image_path" alt="Avatar" />
          <i v-else class="bi bi-person"></i>
        </div>
        <div class="info">
          <div v-if="!editando">
            <h2>{{ user?.name }}</h2>
            <p>{{ user?.email }}</p>
          </div>
          <div v-else>
            <input v-model="form.name" placeholder="Nome" />
            <input v-model="form.email" placeholder="Email" />
          </div>
        </div>
      </div>

      <!-- Abas -->
      <div class="abas">
        <div class="tabs">
          <button :class="{ ativo: activeTab === 'perfil' }" @click="activeTab = 'perfil'">Perfil</button>
          <button :class="{ ativo: activeTab === 'enderecos' }" @click="activeTab = 'enderecos'">Endereços</button>
          <button :class="{ ativo: activeTab === 'pedidos' }" @click="activeTab = 'pedidos'">Pedidos</button>
        </div>

        <!-- Conteúdo das abas -->
        <div class="conteudo">
          <!-- Perfil -->
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

          <!-- Endereços -->
          <div v-if="activeTab === 'enderecos'" class="tab">
            <div class="enderecos">
              <div class="topo">
                <h3>Meus Endereços</h3>
                <button @click="abrirModalEndereco()" class="btn-adicionar">+ Novo</button>
              </div>

              <div v-if="enderecos.length === 0" class="vazio">
                <p>Nenhum endereço cadastrado</p>
                <button @click="abrirModalEndereco()">Adicionar endereço</button>
              </div>

              <div v-else class="lista">
                <div v-for="end in enderecos" :key="end.id" class="endereco">
                  <div class="info">
                    <h4>{{ end.street }}, {{ end.number }}</h4>
                    <p>{{ end.neighborhood }} - {{ end.city }}/{{ end.state }}</p>
                    <p v-if="end.complement">{{ end.complement }}</p>
                    <small>CEP: {{ end.zip_code }}</small>
                  </div>
                  <div class="acoes">
                    <button @click="abrirModalEndereco(end)"><i class="bi bi-pencil"></i></button>
                    <button @click="removerEndereco(end.id)" class="danger"><i class="bi bi-trash"></i></button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Pedidos -->
          <div v-if="activeTab === 'pedidos'" class="tab">
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
                      <img :src="product.image_path ? (BASE_URL + product.image_path) : '/placeholder-product.png'" alt="Produto" />
                      <span>{{ product.name }}</span>
                      <span>R$ {{ Number(product.price).toFixed(2) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModalEndereco" class="modal" @click="fecharModalEndereco">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ enderecoEditando.id ? 'Editar' : 'Novo' }} Endereço</h3>
          <button @click="fecharModalEndereco"><i class="bi bi-x"></i></button>
        </div>
        <form @submit.prevent="salvarEndereco">
          <input v-model="enderecoEditando.street" placeholder="Rua" required />
          <input v-model="enderecoEditando.number" placeholder="Número" required />
          <input v-model="enderecoEditando.neighborhood" placeholder="Bairro" required />
          <input v-model="enderecoEditando.city" placeholder="Cidade" required />
          <input v-model="enderecoEditando.state" placeholder="Estado" required />
          <input v-model="enderecoEditando.zip_code" placeholder="CEP" required />
          <input v-model="enderecoEditando.complement" placeholder="Complemento (opcional)" />
          <div class="botoes">
            <button type="button" @click="fecharModalEndereco">Cancelar</button>
            <button type="submit">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { getAllAddresses, createAddress, updateAddress, deleteAddress } from '@/services/apiService';
import { useToast } from 'vue-toastification';
import { useOrderStore } from '@/stores/orderStore'

const BASE_URL = 'http://35.196.79.227:8000';
const authStore = useAuthStore();
const router = useRouter();
const user = ref(null);
const editando = ref(false);
const form = ref({ name: '', email: '' });
const enderecos = ref([]);
const showModalEndereco = ref(false);
const enderecoEditando = ref({});
const toast = useToast();
const orderStore = useOrderStore()
const { orders, fetchUsersOrders } = orderStore
const activeTab = ref('perfil');

onMounted(async () => {
  await authStore.getUserProfile();
  user.value = authStore.user;
  await carregarEnderecos();
  await fetchUsersOrders();
});

function editarPerfil() {
  form.value = { name: user.value?.name || '', email: user.value?.email || '' };
  editando.value = true;
}

function cancelarEdicao() {
  editando.value = false;
}

async function salvarEdicao() {
  try {
    await authStore.updateUserProfile(form.value);
    await authStore.getUserProfile();
    user.value = authStore.user;
    editando.value = false;
    toast.success('Dados atualizados!');
  } catch (e) {
    toast.error('Erro ao atualizar dados.');
  }
}

function logout() {
  authStore.logout();
  router.push('/');
}

async function carregarEnderecos() {
  enderecos.value = await getAllAddresses();
}

function abrirModalEndereco(endereco = null) {
  if (endereco) {
    enderecoEditando.value = { ...endereco };
  } else {
    enderecoEditando.value = { street: '', number: '', neighborhood: '', city: '', state: '', zip_code: '', complement: '' };
  }
  showModalEndereco.value = true;
}

function fecharModalEndereco() {
  showModalEndereco.value = false;
}

async function salvarEndereco() {
  try {
    if (enderecoEditando.value.id) {
      await updateAddress(enderecoEditando.value.id, enderecoEditando.value);
      toast.success('Endereço atualizado!');
    } else {
      await createAddress(enderecoEditando.value);
      toast.success('Endereço adicionado!');
    }
    await carregarEnderecos();
    showModalEndereco.value = false;
  } catch (e) {
    toast.error('Erro ao salvar endereço.');
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
.profile-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f23 0%, #24243a 100%);
  color: white;
  font-family: 'Inter', sans-serif;
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background: #1a1a2e;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}
.btn-voltar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  border: 1px solid rgba(255,255,255,0.2);
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
}
.btn-voltar:hover {
  background: rgba(255,255,255,0.1);
}
.header h1 {
  margin: 0;
  font-size: 1.5rem;
  background: linear-gradient(135deg, #00ffe1, #8f5fe8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.acoes {
  display: flex;
  gap: 0.5rem;
}
.btn-editar, .btn-salvar, .btn-cancelar, .btn-sair {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
}
.btn-editar { background: #00ffe1; color: #0f0f23; }
.btn-salvar { background: #00d4aa; color: #0f0f23; }
.btn-cancelar { background: rgba(255,255,255,0.2); color: #fff; }
.btn-sair { background: #ff6b6b; color: #fff; }
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
}
.perfil-card {
  background: #1a1a2e;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  border: 1px solid rgba(255,255,255,0.1);
}
.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin: 0 auto 1rem;
  border: 3px solid #00ffe1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  color: #00ffe1;
  background: #24243a;
}
.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}
.info h2 {
  margin: 0 0 0.5rem 0;
  font-size: 1.3rem;
}
.info p {
  margin: 0;
  color: rgba(255,255,255,0.7);
}
.info input {
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  background: #24243a;
  border: 1px solid rgba(255,255,255,0.2);
  color: #fff;
  border-radius: 6px;
}
.abas {
  background: #1a1a2e;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.1);
  overflow: hidden;
}
.tabs {
  display: flex;
  background: #24243a;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}
.tabs button {
  flex: 1;
  padding: 1rem;
  background: transparent;
  border: none;
  color: rgba(255,255,255,0.7);
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
.detalhes {
  display: grid;
  gap: 1rem;
}
.item {
  padding: 1rem;
  background: #24243a;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.1);
}
.item span {
  display: block;
  font-size: 0.9rem;
  color: rgba(255,255,255,0.6);
  margin-bottom: 0.5rem;
}
.item p {
  margin: 0;
  font-weight: 600;
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
.btn-adicionar {
  background: #00ffe1;
  color: #0f0f23;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
}
.vazio {
  text-align: center;
  padding: 3rem 2rem;
  color: rgba(255,255,255,0.6);
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
.endereco, .pedido {
  background: #24243a;
  border-radius: 8px;
  padding: 1.5rem;
  border: 1px solid rgba(255,255,255,0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.endereco .info h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
}
.endereco .info p {
  margin: 0 0 0.25rem 0;
  color: rgba(255,255,255,0.7);
  font-size: 0.9rem;
}
.endereco .info small {
  color: rgba(255,255,255,0.5);
  font-size: 0.8rem;
}
.endereco .acoes {
  display: flex;
  gap: 0.5rem;
}
.endereco .acoes button {
  background: transparent;
  border: 1px solid rgba(255,255,255,0.2);
  color: rgba(255,255,255,0.7);
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
}
.endereco .acoes button:hover {
  background: rgba(255,255,255,0.1);
  color: #00ffe1;
}
.endereco .acoes button.danger:hover {
  color: #ff6b6b;
}
.pedido {
  flex-direction: column;
  align-items: stretch;
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
  border: 1px solid rgba(255,255,255,0.1);
}
.produto img {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid rgba(255,255,255,0.2);
}
.produto span {
  flex: 1;
  font-weight: 600;
}
.produto span:last-child {
  color: rgba(255,255,255,0.7);
  font-size: 0.9rem;
}
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}
.modal-content {
  background: #1a1a2e;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.1);
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}
.modal-header h3 {
  margin: 0;
}
.modal-header button {
  background: transparent;
  border: none;
  color: rgba(255,255,255,0.7);
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
}
.modal-header button:hover {
  background: rgba(255,255,255,0.1);
  color: #ff6b6b;
}
.modal-content form {
  padding: 1.5rem;
}
.modal-content input {
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  background: #24243a;
  border: 1px solid rgba(255,255,255,0.2);
  color: #fff;
  border-radius: 6px;
}
.modal-content input:focus {
  outline: none;
  border-color: #00ffe1;
}
.botoes {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255,255,255,0.1);
}
.botoes button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
}
.botoes button:first-child {
  background: rgba(255,255,255,0.2);
  color: #fff;
}
.botoes button:last-child {
  background: #00ffe1;
  color: #0f0f23;
}
@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  .container {
    grid-template-columns: 1fr;
    padding: 1rem;
  }
  .tabs {
    flex-direction: column;
  }
  .endereco {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  .endereco .acoes {
    justify-content: flex-end;
  }
}
</style> 