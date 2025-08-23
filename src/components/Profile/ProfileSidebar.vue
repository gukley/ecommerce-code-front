<template>
  <aside class="profile-sidebar modern-sidebar">
    <div class="sidebar-inner">
      <div class="avatar-box mb-3">
        <img :src="avatarUrl" alt="Avatar" class="avatar-img modern-avatar-img" />
      </div>
      <h3 class="sidebar-name">{{ user?.name || 'Usuário' }}</h3>
      <p class="sidebar-email">{{ user?.email || 'Sem email' }}</p>
      <div class="sidebar-badges mb-2">
        <span class="badge modern-badge bg-purple">
          <i class="bi bi-person-badge"></i> <strong>ID:</strong> {{ user?.id || '-' }}
        </span>
        <span class="badge modern-badge bg-green">
          <i class="bi bi-shield-lock"></i> <strong>Papel:</strong> {{ user?.role || '-' }}
        </span>
      </div>
      <button class="sidebar-btn" @click="$emit('edit')">
        <i class="bi bi-pencil"></i> Editar Perfil
      </button>
    </div>
  </aside>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  user: {
    type: Object,
    default: () => ({})
  }
})

const avatarUrl = ref('/default-avatar.png')

function resolveAvatar(user) {
  if (user?.image_path) {
    if (user.image_path.startsWith('/')) {
      return `${import.meta.env.VITE_API_BASE_URL}${user.image_path}`
    }
    return user.image_path
  }
  return '/default-avatar.png'
}

watch(
  () => props.user,
  (val) => {
    avatarUrl.value = resolveAvatar(val)
  },
  { immediate: true, deep: true }
)
</script>

<style scoped>
.profile-sidebar.modern-sidebar {
  background: linear-gradient(120deg, #181e2a 60%, #232e47 100%);
  border-radius: 26px;
  box-shadow: 0 8px 32px 0 #232e4780, 0 1.5px 0 #50b8fe;
  border: 1.5px solid #232e47;
  padding: 0;
  transition: box-shadow 0.18s;
  min-width: 270px;
  max-width: 350px;
  margin: 0 auto;
}
.profile-sidebar.modern-sidebar:hover {
  box-shadow: 0 12px 40px 0 #399bff80, 0 1.5px 0 #50b8fe;
}
.sidebar-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 38px 24px 32px 24px;
  background: rgba(24,30,42,0.92);
  border-radius: 26px;
  box-shadow: 0 2px 12px #232e4720;
}
.avatar-box {
  background: linear-gradient(120deg, #232e47 80%, #50b8fe 100%);
  border-radius: 50%;
  padding: 12px;
  box-shadow: 0 0 32px #399bff30, 0 0 0 4px #232e47;
  margin-bottom: 12px;
  transition: box-shadow 0.18s;
}
.avatar-img.modern-avatar-img {
  width: 110px;
  height: 110px;
  object-fit: cover;
  border-radius: 50%;
  border: 3px solid #50b8fe;
  box-shadow: 0 2px 16px #399bff40;
  background: #232e47;
}
.sidebar-name {
  color: #50b8fe;
  font-weight: 800;
  font-size: 1.35rem;
  margin-bottom: 2px;
  letter-spacing: 0.5px;
  text-align: center;
}
.sidebar-email {
  color: #b8d8ff;
  font-size: 0.98rem;
  margin-bottom: 10px;
  text-align: center;
  opacity: 0.85;
}
.sidebar-badges {
  display: flex;
  flex-direction: column;
  gap: 7px;
  align-items: center;
  margin-bottom: 10px;
}
.modern-badge {
  font-size: 0.93rem;
  border-radius: 9px;
  letter-spacing: 0.5px;
  box-shadow: 0 1px 6px #232e4720;
  border: 1.5px solid #232e47;
  background: rgba(80,184,254,0.10);
  padding: 6px 14px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.bg-purple { background: #a470ff !important; color: #fff !important; }
.bg-green { background: #4be3b0 !important; color: #181e2a !important; }
.sidebar-btn {
  background: linear-gradient(90deg,#50b8fe 60%, #399bff 100%);
  color: #181e2a;
  border: none;
  border-radius: 16px;
  font-weight: 700;
  letter-spacing: 1px;
  box-shadow: 0 2px 12px #399bff30;
  transition: background 0.18s, box-shadow 0.18s, color 0.18s;
  padding: 10px 32px;
  font-size: 1.08rem;
  margin-top: 10px;
  cursor: pointer;
  outline: none;
}
.sidebar-btn:hover {
  background: linear-gradient(90deg,#399bff 60%, #50b8fe 100%);
  color: #fff;
  box-shadow: 0 4px 18px #399bff60;
}
</style>