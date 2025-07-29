<template>
    <div class="perfil-card">
      <div class="avatar">
        <img v-if="user?.image_path" :src="baseUrl + user.image_path" alt="Avatar" />
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
</template>

<script setup> 
import { defineProps, defineModel } from 'vue'

const props = defineProps({ 
    user: { 
        type: Object,
        default: () => ({})
    },
    editando: { 
        type: Boolean,
        default: false
    },
    baseUrl: { 
        type: String,
        required: true
    }
});

const form = defineModel('form', { 
    type: Object,
    default: () => ({ name: '', email: '' })
})
</script>

<style scoped> 
.perfil-card { 
    background: #1a1a2e;
    border-radius: 12px;
    padding: 2rem;
    text-align: center;
    border: 1px solid rgba(255, 255, 255, 0.1);
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
    color: rgba(255, 255, 255, 0.7);
}

.info input { 
    width: 100%;
    padding: 0.5rem;
    margin-bottom: 0.5rem;
    background: #24243a;
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #fff;
    border-radius: 6px;
}
</style>
