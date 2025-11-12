<template>
  <div class="diet-page">
    <header class="header">
      <h2 class="title">식단 관리</h2>
      <p class="subtitle">
        {{ selectedDateLabel }} 총 {{ totalKcal }} kcal 섭취
      </p>
    </header>

    <nav class="tab-bar">
      <router-link
        :to="{ path: '/main/dietmanagement/breakfast', query: route.query }"
        class="tab"
        :class="{ active: route.path === '/main/dietmanagement/breakfast' }"
      >
        아침
      </router-link>
      <router-link
        :to="{ path: '/main/dietmanagement/lunch', query: route.query }"
        class="tab"
        :class="{ active: route.path === '/main/dietmanagement/lunch' }"
      >
        점심
      </router-link>
      <router-link
        :to="{ path: '/main/dietmanagement/dinner', query: route.query }"
        class="tab"
        :class="{ active: route.path === '/main/dietmanagement/dinner' }"
      >
        저녁
      </router-link>
      <router-link
        :to="{ path: '/main/dietmanagement/snack', query: route.query }"
        class="tab"
        :class="{ active: route.path === '/main/dietmanagement/snack' }"
      >
        간식
      </router-link>
    </nav>

    <router-view v-slot="{ Component }">
      <component
        :is="Component"
        @update-total="onUpdateTotal"
        @meal-point-earned="onMealPointEarned"
      />
    </router-view>

    <div v-if="showPointModal" class="modal-overlay">
      <div class="modal-box">
        <h3>🎉 5포인트가 적립되었습니다!</h3>
        <p>오늘의 식단 기록 보상입니다 😊</p>
        <button class="modal-btn" @click="closePointModal">확인</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { ref, computed, watchEffect } from 'vue'
import { dietStore } from '@/stores/dietStore'

const route = useRoute()

const totalKcal = computed(() => dietStore.total)

const selectedDateStr = computed(() => {
  const q = route.query.date
  if (typeof q === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(q)) return q

  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
})

const selectedDateLabel = computed(() => {
  const d = new Date(selectedDateStr.value)
  if (Number.isNaN(d.getTime())) return selectedDateStr.value
  return d.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})

const showPointModal = ref(false)

const onMealPointEarned = () => {
  showPointModal.value = true
}
const closePointModal = () => {
  showPointModal.value = false
}

const onUpdateTotal = () => {}

const STORE_KEY = 'dietTotalsByDate'

const loadMap = () => {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY) || '{}')
  } catch {
    return {}
  }
}
const saveMap = (map) => localStorage.setItem(STORE_KEY, JSON.stringify(map))

watchEffect(() => {
  const map = loadMap()
  map[selectedDateStr.value] = { totalKcal: Number(totalKcal.value) || 0 }
  saveMap(map)
})
</script>

<style scoped>
.diet-page {
  padding: 32px 24px;
}

.header {
  margin-bottom: 24px;
}

.title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 4px;
}

.subtitle {
  font-size: 14px;
  color: #9a9aa0;
}

.tab-bar {
  display: flex;
  justify-content: space-between;
  background-color: #f3f3f6;
  border-radius: 999px;
  padding: 6px;
  margin-bottom: 36px;
}

.tab {
  flex: 1;
  text-align: center;
  padding: 14px 0;
  border-radius: 999px;
  font-size: 15px;
  text-decoration: none;
  color: #333;
  background-color: transparent;
  transition: all 0.2s ease;
}

.tab.active {
  background-color: #fff;
  font-weight: 600;
  color: #000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-box {
  background: white;
  width: 380px;
  padding: 32px 26px;
  border-radius: 14px;
  text-align: center;
  animation: show 0.2s ease-out;
}

@keyframes show {
  from {
    transform: scale(0.85);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.modal-btn {
  margin-top: 18px;
  padding: 10px 18px;
  background: #6c63ff;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
}
</style>
