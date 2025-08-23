<template>
  <div class="profile-modal-overlay">
    <div class="profile-modal-card">
      <div class="profile-modal-header">
        <h5 class="modal-title">Editar Perfil</h5>
        <button type="button" class="close-btn" @click="$emit('close')">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>
      <div class="profile-modal-body">
        <form @submit.prevent="handleSubmit" class="d-flex flex-column gap-3">
          <div class="d-flex flex-column align-items-center gap-2">
            <div class="avatar-preview-box">
              <img v-if="previewUrl" :src="previewUrl" class="avatar-preview" />
              <div v-else class="avatar-placeholder"><i class="bi bi-person-circle"></i></div>
            </div>
            <label class="upload-label">
              <input type="file" class="d-none" @change="onFileChange" accept="image/*" />
              <span class="upload-btn"><i class="bi bi-upload"></i> Alterar Avatar</span>
            </label>
          </div>
          <input v-model="form.name" class="profile-input" placeholder="Nome" required />
          <input v-model="form.email" class="profile-input" placeholder="Email" required />
          <div class="d-flex gap-2 justify-content-end mt-2">
            <button type="submit" class="profile-btn primary">Salvar</button>
            <button type="button" class="profile-btn" @click="$emit('close')">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, watch } from 'vue'
import { updateUserProfile, updateUserImage } from '@/services/apiService.js'
const props = defineProps({ user: Object })
const emit = defineEmits(['close','updated'])
const form = ref({ name: props.user.name, email: props.user.email })
const file = ref(null)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

// Função para montar a URL do avatar do usuário
function resolveAvatar(user) {
  if (user?.image_path) {
    if (user.image_path.startsWith('/')) {
      return API_BASE_URL.replace(/\/$/, '') + user.image_path
    }
    return user.image_path
  }
  return '/default-avatar.png'
}

// Preview inicial: imagem do usuário
const previewUrl = ref(resolveAvatar(props.user))

// Atualiza preview se o usuário mudar (ex: ao abrir modal para outro usuário)
watch(() => props.user, (val) => {
  previewUrl.value = resolveAvatar(val)
})

// Preview ao selecionar novo arquivo
function onFileChange(e) {
  file.value = e.target.files[0]
  if (file.value) {
    previewUrl.value = URL.createObjectURL(file.value)
  } else {
    previewUrl.value = resolveAvatar(props.user)
  }
}

async function handleSubmit() {
  // Envia apenas name e email para o update de perfil
  await updateUserProfile({
    name: form.value.name,
    email: form.value.email
  })
  // Se houver imagem, envia separadamente para o endpoint correto
  if (file.value) {
    const formData = new FormData()
    formData.append('image', file.value)
    await updateUserImage(file.value) 
  }
  emit('updated')
  emit('close')
}
</script>
<style scoped>
.profile-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1200;
  background: rgba(16,22,34,0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(2px);
}
.profile-modal-card {
  background: rgba(24,30,42,0.97);
  border-radius: 20px;
  box-shadow: 0 8px 40px 0 #232e47cc, 0 1.5px 0 #50b8fe;
  min-width: 350px;
  max-width: 95vw;
  width: 400px;
  animation: modalIn 0.18s;
  overflow: hidden;
}
@keyframes modalIn {
  from { opacity: 0; transform: translateY(30px);}
  to { opacity: 1; transform: translateY(0);}
}
.profile-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(90deg,#232e47 60%, #399bff 100%);
  padding: 18px 24px 14px 24px;
  border-bottom: 1.5px solid #232e47;
}
.profile-modal-header .modal-title {
  color: #fff;
  font-weight: 700;
  font-size: 1.18rem;
  letter-spacing: 0.5px;
  margin: 0;
}
.close-btn {
  background: none;
  border: none;
  color: #fff;
  font-size: 1.2rem;
  opacity: 0.7;
  transition: opacity 0.15s;
  cursor: pointer;
}
.close-btn:hover { opacity: 1; }
.profile-modal-body {
  padding: 28px 28px 22px 28px;
  background: transparent;
}
.avatar-preview-box {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  overflow: hidden;
  background: #232e47;
  border: 3px solid #50b8fe;
  box-shadow: 0 2px 16px #399bff40;
  display: flex;
  align-items: center;
  justify-content: center;
}
.avatar-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}
.avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #399bff;
  font-size: 3rem;
  background: #181e2a;
}
.upload-label {
  margin-top: 8px;
  cursor: pointer;
}
.upload-btn {
  display: inline-block;
  background: linear-gradient(90deg,#399bff 60%, #50b8fe 100%);
  color: #181e2a;
  font-weight: 600;
  border-radius: 12px;
  padding: 6px 18px;
  font-size: 0.98rem;
  box-shadow: 0 2px 8px #399bff30;
  transition: background 0.18s, color 0.18s;
}
.upload-btn:hover {
  background: linear-gradient(90deg,#50b8fe 60%, #399bff 100%);
  color: #fff;
}
.profile-input {
  width: 100%;
  border-radius: 12px;
  background: rgba(40,48,62,0.92);
  color: #eaf6ff;
  border: 1.5px solid #399bff;
  font-size: 1.08rem;
  padding: 12px 16px;
  margin-bottom: 0;
  transition: border 0.2s, background 0.2s;
  box-shadow: 0 2px 8px #232e4720;
}
.profile-input:focus {
  border-color: #50b8fe;
  background: rgba(40,48,62,1);
  color: #fff;
  outline: none;
}
.profile-btn {
  border-radius: 14px;
  font-weight: 600;
  font-size: 1rem;
  padding: 8px 22px;
  border: none;
  background: #232e47;
  color: #b8d8ff;
  transition: background 0.18s, color 0.18s;
  box-shadow: 0 2px 8px #232e4720;
  cursor: pointer;
}
.profile-btn.primary {
  background: linear-gradient(90deg,#50b8fe 60%, #399bff 100%);
  color: #181e2a;
  font-weight: 700;
}
.profile-btn.primary:hover {
  background: linear-gradient(90deg,#399bff 60%, #50b8fe 100%);
  color: #fff;
}
.profile-btn:hover:not(.primary) {
  background: #399bff;
  color: #fff;
}
</style>