<template>
  <RouterView />
<LoadingOverlay />
  <ToastContainer /> <!-- ✅ 여기에 추가 -->
</template>

<script setup>
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import api from '@/lib/api'
import { useUserStore } from '@/stores/user'
import LoadingOverlay from './components/LoadingOverlay.vue'
import ToastContainer from './components/ToastContainer.vue'

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

})
</script>
