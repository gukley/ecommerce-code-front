<template>
  <div class="profile-page bg-dark text-white min-vh-100 d-flex flex-column align-items-center justify-content-center">
    <div class="profile-main-layout d-flex flex-column align-items-stretch justify-content-center gap-4 w-100">
      <div class="tabs-container card shadow-lg p-0 mb-4 animate-fade-in">
        <ul class="nav nav-tabs nav-justified bg-dark" role="tablist">
          <li class="nav-item" role="presentation">
            <button class="nav-link" :class="{active: activeTab === 'perfil'}" @click="activeTab = 'perfil'">Perfil</button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link" :class="{active: activeTab === 'enderecos'}" @click="activeTab = 'enderecos'">Endereços</button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link" :class="{active: activeTab === 'pedidos'}" @click="activeTab = 'pedidos'">Meus Pedidos</button>
          </li>
        </ul>
        <div class="tab-content p-4 bg-dark rounded-bottom">
          <!-- Aba Perfil -->
          <div v-if="activeTab === 'perfil'">
            <div class="profile-card-content text-center">
              <button @click="$router.push('/')" class="btn btn-back-profile position-absolute top-0 start-0 m-3 p-2"><i class="bi bi-arrow-left"></i></button>
              <div class="profile-banner position-relative mb-4">
                <div class="banner-gradient"></div>
                <div class="profile-avatar-wrapper">
                  <img v-if="user?.image_path" :src="BASE_URL + user.image_path" class="profile-avatar" alt="Avatar" />
                  <div v-else class="profile-avatar-placeholder"><i class="bi bi-person fs-1"></i></div>
                </div>
              </div>
              <h2 class="fw-bold mb-1 profile-name" v-if="!editando">{{ user?.name }}</h2>
              <input v-else v-model="form.name" class="form-control mb-2" placeholder="Nome" />
              <p class="text-muted mb-3 profile-email" v-if="!editando">{{ user?.email }}</p>
              <input v-else v-model="form.email" class="form-control mb-2" placeholder="E-mail" />
              <div class="profile-actions d-flex flex-column flex-sm-row justify-content-center gap-3 mt-3">
                <button v-if="!editando" class="btn btn-main-action px-4" @click="editarPerfil">Editar Perfil</button>
                <button v-if="!editando" class="btn btn-outline-danger px-4" @click="logout">Sair</button>
                <button v-if="editando" class="btn btn-success px-4" @click="salvarEdicao">Salvar</button>
                <button v-if="editando" class="btn btn-secondary px-4" @click="cancelarEdicao">Cancelar</button>
              </div>
            </div>
          </div>
          <!-- Aba Endereços -->
          <div v-if="activeTab === 'enderecos'">
            <div class="address-section-card p-4 mb-4 align-self-start w-100">
              <h4 class="fw-bold mb-4 text-center text-gradient">Meus Endereços</h4>
              <div v-if="enderecos.length === 0" class="text-muted mb-3 text-center">Nenhum endereço cadastrado.</div>
              <ul class="list-group mb-4 address-list">
                <li v-for="end in enderecos" :key="end.id" class="list-group-item address-list-item d-flex justify-content-between align-items-center">
                  <div>
                    <div><strong>{{ end.street }}</strong>, {{ end.number }}</div>
                    <div>{{ end.neighborhood }} - {{ end.city }}/{{ end.state }}</div>
                    <div v-if="end.complement">{{ end.complement }}</div>
                    <div>CEP: {{ end.zip_code }}</div>
                  </div>
                  <div>
                    <button class="btn btn-sm btn-outline-primary me-2" @click="abrirModalEndereco(end)"><i class="bi bi-pencil"></i></button>
                    <button class="btn btn-sm btn-outline-danger" @click="removerEndereco(end.id)"><i class="bi bi-trash"></i></button>
                  </div>
                </li>
              </ul>
              <div class="d-flex justify-content-center">
                <button class="btn btn-main-action px-4" @click="abrirModalEndereco()"><i class="bi bi-plus-lg"></i> Novo Endereço</button>
              </div>
            </div>
            <!-- Modal de Endereço -->
            <div v-if="showModalEndereco" class="modal fade show d-block" tabindex="-1" style="background:rgba(0,0,0,0.4)">
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title">{{ enderecoEditando.id ? 'Editar Endereço' : 'Novo Endereço' }}</h5>
                    <button type="button" class="btn-close" @click="fecharModalEndereco"></button>
                  </div>
                  <div class="modal-body">
                    <form @submit.prevent="salvarEndereco">
                      <input v-model="enderecoEditando.street" class="form-control mb-2" placeholder="Rua" required />
                      <input v-model="enderecoEditando.number" class="form-control mb-2" placeholder="Número" required />
                      <input v-model="enderecoEditando.neighborhood" class="form-control mb-2" placeholder="Bairro" required />
                      <input v-model="enderecoEditando.city" class="form-control mb-2" placeholder="Cidade" required />
                      <input v-model="enderecoEditando.state" class="form-control mb-2" placeholder="Estado" required />
                      <input v-model="enderecoEditando.zip_code" class="form-control mb-2" placeholder="CEP" required />
                      <input v-model="enderecoEditando.complement" class="form-control mb-2" placeholder="Complemento (opcional)" />
                      <div class="d-flex justify-content-end mt-3">
                        <button type="button" class="btn btn-secondary me-2" @click="fecharModalEndereco">Cancelar</button>
                        <button type="submit" class="btn btn-success">Salvar</button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- Aba Pedidos -->
          <div v-if="activeTab === 'pedidos'">
            <div class="orders-section-card p-4 mb-4 align-self-start w-100">
              <h4 class="fw-bold mb-4 text-center text-gradient">Meus Pedidos</h4>
              <div v-if="orders.length === 0" class="text-muted mb-3 text-center">Nenhum pedido encontrado.</div>
              <table v-else class="table table-dark mt-2">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Status</th>
                    <th>Data</th>
                    <th>Produtos</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="order in orders" :key="order.id">
                    <td>{{ order.id }}</td>
                    <td>{{ order.status }}</td>
                    <td>{{ new Date(order.order_date).toLocaleString() }}</td>
                    <td>
                      <ul>
                        <li v-for="(product, idx) in order.products" :key="idx">
                          <img :src="product.image_path ? (BASE_URL + product.image_path) : '/placeholder-product.png'" alt="Produto" style="width:30px; height:30px; object-fit:cover; border-radius:6px; margin-right:8px;">
                          {{ product.name }} (R$ {{ Number(product.price).toFixed(2) }})
                        </li>
                      </ul>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
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
    await authStore.updateUserProfile(form.value); // Precisa implementar na store
    await authStore.getUserProfile();
    user.value = authStore.user;
    editando.value = false;
    alert('Dados atualizados com sucesso!');
  } catch (e) {
    alert('Erro ao atualizar dados.');
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
      toast.success('Endereço atualizado com sucesso!');
    } else {
      await createAddress(enderecoEditando.value);
      toast.success('Endereço adicionado com sucesso!');
    }
    await carregarEnderecos();
    showModalEndereco.value = false;
  } catch (e) {
    toast.error('Erro ao salvar endereço.');
  }
}
async function removerEndereco(id) {
  try {
    await deleteAddress(id);
    await carregarEnderecos();
    toast.success('Endereço removido com sucesso!');
  } catch (e) {
    toast.error('Erro ao remover endereço.');
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
.profile-page {
  background: linear-gradient(135deg, #18182a 60%, #23233a 100%);
  font-family: 'Inter', sans-serif;
}
.profile-main-layout {
  width: 100%;
  max-width: 950px;
  margin-top: 40px;
  margin-bottom: 40px;
  align-items: flex-start;
}
.profile-card {
  min-width: 320px;
  max-width: 420px;
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: flex-start;
}
.profile-banner {
  height: 110px;
  background: linear-gradient(90deg, #8f5fe8 60%, #00ffe1 100%);
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}
.banner-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(35,35,58,0.2) 60%, rgba(0,0,0,0.3) 100%);
  z-index: 1;
}
.profile-avatar-wrapper {
  position: absolute;
  left: 50%;
  bottom: -48px;
  transform: translateX(-50%);
  z-index: 2;
  box-shadow: 0 4px 24px rgba(143, 95, 232, 0.18);
  border-radius: 50%;
  background: #23233a;
  padding: 6px;
}
.profile-avatar {
  width: 96px;
  height: 96px;
  object-fit: cover;
  border-radius: 50%;
  border: 3px solid #00ffe1;
  box-shadow: 0 0 0 4px #8f5fe8, 0 2px 8px rgba(143, 95, 232, 0.10);
  background: #18182a;
}
.profile-avatar-placeholder {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background: #35354d;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8f5fe8;
  font-size: 3rem;
  border: 3px solid #00ffe1;
  box-shadow: 0 0 0 4px #8f5fe8, 0 2px 8px rgba(143, 95, 232, 0.10);
}
.profile-content {
  margin-top: 56px;
}
.profile-name {
  font-size: 2rem;
  color: #fff;
  letter-spacing: 0.5px;
  margin-top: 60px; /* Espaço extra para o avatar */
}
.profile-email {
  color: #fff !important;
  font-size: 1.13rem;
  font-weight: bold;
  letter-spacing: 0.2px;
  margin-bottom: 1.2rem;
  margin-top: 0.5rem;
}
.profile-actions {
  margin-top: 1.5rem;
}
.btn-main-action {
  background: linear-gradient(90deg, #a362ff, #8f5fe8);
  color: white;
  border: none;
  font-size: 1.08rem;
  border-radius: 50px;
  box-shadow: 0 5px 20px rgba(163, 98, 255, 0.13);
  transition: all 0.3s ease;
  font-weight: 600;
}
.btn-main-action:hover {
  background: linear-gradient(90deg, #8f5fe8, #00ffe1);
  color: #23233a;
  transform: translateY(-2px) scale(1.04);
  box-shadow: 0 8px 25px rgba(163, 98, 255, 0.22);
}
.btn-outline-danger {
  border-radius: 50px;
  font-weight: 600;
  font-size: 1.08rem;
  border-width: 2px;
  transition: background 0.2s, color 0.2s;
}
.btn-outline-danger:hover {
  background: #ff4d6d;
  color: #fff;
  border-color: #ff4d6d;
}
.animate-fade-in {
  opacity: 0;
  transform: translateY(30px);
  animation: fadeInUp 0.8s cubic-bezier(.39,.575,.56,1) forwards;
  animation-delay: 0.1s;
}
@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
@media (max-width: 900px) {
  .profile-main-layout {
    flex-direction: column !important;
    align-items: center !important;
    gap: 0.5rem;
  }
  .profile-card, .address-section-card {
    max-width: 98vw;
    min-width: unset;
    height: auto;
  }
  .profile-name {
    margin-top: 70px; /* Mais espaço em telas pequenas */
  }
}
.profile-card-content {
  margin-top: 56px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.address-section-card {
  background: #23233a;
  border: 2px solid #8f5fe8;
  border-radius: 1.5rem;
  box-shadow: 0 4px 24px rgba(143, 95, 232, 0.10);
  max-width: 420px;
  width: 100%;
  margin-top: 0;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: flex-start;
}
.address-section-card h4.text-gradient {
  background: linear-gradient(90deg, #8f5fe8 60%, #00ffe1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
}
.address-list {
  background: transparent;
  border: none;
  padding: 0;
}
.address-list-item {
  background: #18182a !important;
  border: 1.5px solid #8f5fe8;
  border-radius: 1rem !important;
  margin-bottom: 1rem;
  color: #fff;
  box-shadow: 0 2px 8px rgba(143, 95, 232, 0.08);
  padding: 1rem 1.2rem;
}
.address-list-item:last-child {
  margin-bottom: 0;
}
.address-section-card .btn-main-action {
  font-size: 1.08rem;
  border-radius: 50px;
  font-weight: 600;
  box-shadow: 0 5px 20px rgba(163, 98, 255, 0.13);
  background: linear-gradient(90deg, #a362ff, #8f5fe8);
  color: white;
  border: none;
  transition: all 0.3s ease;
}
.address-section-card .btn-main-action:hover {
  background: linear-gradient(90deg, #8f5fe8, #00ffe1);
  color: #23233a;
  transform: translateY(-2px) scale(1.04);
  box-shadow: 0 8px 25px rgba(163, 98, 255, 0.22);
}
.btn-back-profile {
  background: #23233a;
  border: 2px solid #8f5fe8;
  color: #8f5fe8;
  border-radius: 50%;
  font-size: 1.2rem;
  z-index: 10;
  transition: background 0.2s, color 0.2s, border 0.2s;
}
.btn-back-profile:hover, .btn-back-profile:focus {
  background: #8f5fe8;
  color: #23233a;
  border-color: #00ffe1;
}
</style> 