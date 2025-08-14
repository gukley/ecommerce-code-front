<template>
    <div class="perfil-card">
      <div class="avatar-wrapper">
        <div class="avatar">
          <img v-if="user?.image_path" :src="baseUrl + user.image_path" alt="Avatar" />
          <i v-else class="bi bi-person-circle default-avatar"></i>
        </div>
        <div class="avatar-glow"></div>
      </div>
      <div class="info">
        <div v-if="!editando">
          <h2>{{ user?.name }}</h2>
          <p>{{ user?.email }}</p>
        </div>
        <div v-else>
          <div class="input-group">
            <label for="name">Nome</label>
            <input id="name" v-model="form.name" placeholder="Nome" />
          </div>
          <div class="input-group">
            <label for="email">Email</label>
            <input id="email" v-model="form.email" placeholder="Email" />
          </div>
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
    background: linear-gradient(135deg, #181828 0%, #24243a 100%);
    border-radius: 18px;
    padding: 2.2rem 2rem 2.1rem 2rem;
    text-align: center;
    border: 1.5px solid rgba(0,255,225,0.11);
    box-shadow: 0 8px 30px rgba(0,255,225,0.07);
    max-width: 350px;
    margin: 0 auto;
    position: relative;
  }
  
  .avatar-wrapper {
    position: relative;
    width: 110px;
    height: 110px;
    margin: 0 auto 1.1rem auto;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    border: 3px solid #00ffe1;
    background: linear-gradient(120deg, #24243a 70%, #8f5fe8 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3.3rem;
    color: #00ffe1;
    overflow: hidden;
    z-index: 2;
    box-shadow: 0 5px 24px rgba(0,255,225,0.14);
  }
  .avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }
  .default-avatar {
    color: #00ffe1;
    opacity: 0.85;
  }
  
  .avatar-glow {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    border-radius: 50%;
    z-index: 1;
    box-shadow: 0 0 24px 6px #00ffe154, 0 0 0 0 #8f5fe8;
    pointer-events: none;
  }
  
  .info {
    margin-top: 0.7rem;
  }
  
  .info h2 {
    margin: 0 0 0.5rem 0;
    font-size: 1.4rem;
    font-weight: 700;
    color: #00ffe1;
    letter-spacing: 0.03em;
  }
  
  .info p {
    margin: 0;
    color: #b2b2e6;
    font-size: 1.06rem;
  }
  
  .input-group {
    text-align: left;
    margin-bottom: 1rem;
  }
  .input-group label {
    display: block;
    font-size: 1rem;
    color: #8fd6fb;
    font-weight: 500;
    margin-bottom: 0.3rem;
    letter-spacing: 0.01em;
  }
  .input-group input {
    width: 100%;
    padding: 0.68rem;
    background: #23233a;
    border: 1px solid rgba(0,255,225,0.14);
    color: #fff;
    border-radius: 8px;
    font-size: 1rem;
    transition: border 0.19s, box-shadow 0.18s;
  }
  .input-group input:focus {
    border-color: #00ffe1;
    box-shadow: 0 0 0 2px rgba(0,255,225,0.16);
    outline: none;
  }
  
  /* Responsivo */
  @media (max-width: 500px) {
    .perfil-card {
      padding: 1.4rem 0.7rem;
    }
    .info h2 {
      font-size: 1.07rem;
    }
    .info p {
      font-size: 0.97rem;
    }
    .avatar-wrapper {
      width: 80px;
      height: 80px;
    }
    .avatar {
      width: 72px;
      height: 72px;
      font-size: 2rem;
    }
  }
  </style>