<template>
  <div id="app">
    <AppHeader v-if="!$route.meta.hideHeader" />

    <router-view />

    </div>
</template>

<script setup>
import { useRoute } from 'vue-router';

const route = useRoute();
</script>

<style>
</style>