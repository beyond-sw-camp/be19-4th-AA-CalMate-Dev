<template>
  <div class="diet-page">
    <header class="header">
      <h2 class="title">식단 관리</h2>
      <p class="subtitle">오늘 총 {{ totalKcal }} kcal 섭취</p>
    </header>

    <nav class="tab-bar">
      <router-link
        to="/main/dietmanagement/breakfast"
        class="tab"
        :class="{ active: route.path === '/main/dietmanagement/breakfast' }"
      >
        아침
      </router-link>
      <router-link
        to="/main/dietmanagement/lunch"
        class="tab"
        :class="{ active: route.path === '/main/dietmanagement/lunch' }"
      >
        점심
      </router-link>
      <router-link
        to="/main/dietmanagement/dinner"
        class="tab"
        :class="{ active: route.path === '/main/dietmanagement/dinner' }"
      >
        저녁
      </router-link>
      <router-link
        to="/main/dietmanagement/snack"
        class="tab"
        :class="{ active: route.path === '/main/dietmanagement/snack' }"
      >
        간식
      </router-link>
    </nav>

    <router-view />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { computed, watchEffect } from 'vue'
import { dietStore } from '@/stores/dietStore'

const route = useRoute()
const totalKcal = computed(() => dietStore.total)

// Persist daily intake total for Calendar integration
const STORE_KEY = 'dietTotalsByDate'
const todayKey = () => {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
const loadMap = () => {
  try { return JSON.parse(localStorage.getItem(STORE_KEY) || '{}') } catch { return {} }
}
const saveMap = (map) => localStorage.setItem(STORE_KEY, JSON.stringify(map))

watchEffect(() => {
  const map = loadMap()
  map[todayKey()] = { totalKcal: Number(totalKcal.value) || 0 }
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
</style>
