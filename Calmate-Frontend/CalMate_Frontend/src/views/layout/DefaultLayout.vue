<template>
  <div class="layout">
    <aside class="sidebar">
      <headerComponent />
    </aside>
    <main class="content">
      <RouterView />
    </main>
  </div>
</template>

<script setup>

  import {RouterLink, RouterView} from 'vue-router';
  import { onMounted } from 'vue';
  import { useUserStore } from '@/stores/user';
  import headerComponent from '@/components/Header.vue';
    const userStore = useUserStore();
</script>

<style scoped>
.layout {
  display: flex;               
  height: 100vh;               
}
.sidebar {
  width: 260px;               
  box-sizing: border-box;
}
.content {
  flex: 1;                     
  overflow-y: auto;           
  padding: 20px;
  box-sizing: border-box;
}
</style>