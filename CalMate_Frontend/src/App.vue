<template>
  <RouterView />
</template>

<script setup>
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import api from '@/lib/api'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

onMounted(async () => {
  const enableHealth = import.meta.env.VITE_ENABLE_HEALTH_CHECK === 'true'
  if (enableHealth) {
    try {
      const response = await api.get('/health')
      console.log('health:', response?.data)
    } catch (e) {
      console.debug('Health check skipped:', e?.message || e)
    }
  } else {
    console.debug('Health check disabled (VITE_ENABLE_HEALTH_CHECK!=true)')
  }

  console.log('이름:', userStore.name)
  console.log('로그인 상태:', userStore.isLoggedIn)
})
</script>
