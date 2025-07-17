<template>
    <div class="d-flex admin-layout-wrapper">
      <AdminSidebar /> <div class="flex-grow-1 content-area">
        <main class="admin-main-content">
          <router-view /> </main>
      </div>
    </div>
  </template>
  
  <script setup>
  import AdminSidebar from '@/components/admin/AdminSidebar.vue'; 
  </script>
  
  <style scoped>
  .admin-layout-wrapper {
    min-height: 100vh;
    background-color: #11111c; 
    color: white;
  }
  .content-area {
    flex-grow: 1; 
    overflow-y: auto; 
  }
  .admin-main-content {
    padding: 20px; 
  }
  </style>