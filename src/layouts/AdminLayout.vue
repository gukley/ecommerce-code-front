<template>
    <div class="d-flex admin-layout-wrapper">
      <AdminSidebar />
      <div class="flex-grow-1 content-area">
        <main class="admin-main-content">
          <router-view />
        </main>
      </div>
    </div>
  </template>
  
  <script setup>
  import AdminSidebar from '@/components/admin/AdminSidebar.vue'; 
  </script>
  
  <style scoped>
  .admin-layout-wrapper {
    min-height: 100vh;
    background: linear-gradient(135deg, #0f0f23 0%, #24243a 100%);
    color: white;
  }
  .content-area {
    flex-grow: 1; 
    overflow-y: auto; 
    background: var(--admin-bg-primary);
  }
  .admin-main-content {
    padding: 20px; 
    background: var(--admin-bg-primary);
    min-height: 100vh;
  }
  </style>