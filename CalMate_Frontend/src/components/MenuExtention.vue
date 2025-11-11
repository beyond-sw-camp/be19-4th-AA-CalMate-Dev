<template>
  <!-- Placeholder submenu (no-op). Replace with real menu when ready. -->
  <div v-if="showSubmenu" class="submenu"></div>
  
</template>

<script setup>
defineProps({
  showSubmenu: { type: Boolean, default: false },
});
</script>

<style scoped>
.submenu { display: none; }
</style>

