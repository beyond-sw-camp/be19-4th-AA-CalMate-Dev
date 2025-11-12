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


    // error('test1',{duration: 40000,description: '데이터가 성공적으로 저장되었습니다.' });
    // info('test2',{duration: 40000,description: '데이터가 성공적으로 저장되었습니다.' });
    // success('test3',{duration: 40000,description: '데이터가 성공적으로 저장되었습니다.' });
  // console.log('테스트:::::', sessionStorage.getItem('device_fp'));
  // console.log('이름:', userStore.name)
  // console.log('로그인 상태:', userStore.isLoggedIn)
})
</script>
