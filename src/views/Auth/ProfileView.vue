<template>
  <div class="profile-page bg-dark text-white min-vh-100 d-flex flex-column align-items-center justify-content-center">
    <div class="profile-card shadow-lg animate-fade-in">
      <div class="profile-banner position-relative">
        <div class="banner-gradient"></div>
        <div class="profile-avatar-wrapper">
          <img v-if="user?.image_path" :src="BASE_URL + user.image_path" class="profile-avatar" alt="Avatar" />
          <div v-else class="profile-avatar-placeholder"><i class="bi bi-person fs-1"></i></div>
        </div>
      </div>
      <div class="profile-content text-center px-4 pb-4 pt-2">
        <h2 class="fw-bold mb-1 profile-name" v-if="!editando">{{ user?.name }}</h2>
        <input v-else v-model="form.name" class="form-control mb-2" placeholder="Nome" />
        <p class="text-muted mb-3 profile-email" v-if="!editando">{{ user?.email }}</p>
        <input v-else v-model="form.email" class="form-control mb-2" placeholder="E-mail" />
        <!-- Se quiser exibir mais infos, adicione aqui -->
        <div class="profile-actions d-flex flex-column flex-sm-row justify-content-center gap-3 mt-3">
          <button v-if="!editando" class="btn btn-main-action px-4" @click="editarPerfil">Editar Perfil</button>
          <button v-if="!editando" class="btn btn-outline-danger px-4" @click="logout">Sair</button>
          <button v-if="editando" class="btn btn-success px-4" @click="salvarEdicao">Salvar</button>
          <button v-if="editando" class="btn btn-secondary px-4" @click="cancelarEdicao">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
const BASE_URL = 'http://35.196.79.227:8000';
const authStore = useAuthStore();
const router = useRouter();
const user = ref(null);
const editando = ref(false);
const form = ref({ name: '', email: '' });

onMounted(async () => {
  await authStore.getUserProfile();
  user.value = authStore.user;
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
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
.profile-page {
  background: linear-gradient(135deg, #18182a 60%, #23233a 100%);
  font-family: 'Inter', sans-serif;
}
.profile-card {
  background: #23233a;
  border: 1.5px solid #8f5fe8;
  border-radius: 2rem;
  box-shadow: 0 8px 32px rgba(143, 95, 232, 0.10);
  max-width: 420px;
  width: 100%;
  overflow: hidden;
  padding: 0;
  animation: fadeInUp 0.8s cubic-bezier(.39,.575,.56,1) both;
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
}
.profile-email {
  color: #b0b0b0;
  font-size: 1.08rem;
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
@media (max-width: 600px) {
  .profile-card {
    max-width: 98vw;
    border-radius: 1.2rem;
  }
  .profile-content {
    margin-top: 48px;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
}
</style> 