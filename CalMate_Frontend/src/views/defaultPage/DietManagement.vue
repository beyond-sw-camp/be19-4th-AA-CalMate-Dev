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

    <!-- 🔥 router-view 에 바로 @ 이벤트 달면 안 먹음 -->
    <!-- 🔥 v-slot 으로 꺼내서 component 에 이벤트 연결해야 함 -->
    <router-view v-slot="{ Component }">
      <component
        :is="Component"
        @update-total="onUpdateTotal"
        @meal-point-earned="onMealPointEarned"
      />
    </router-view>

    <!-- ✅ 포인트 모달 -->
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

// 🔥 상단에 보여줄 총 kcal
const totalKcal = computed(() => dietStore.total)

// ✅ 포인트 모달 상태
const showPointModal = ref(false)

// ✅ 모달 열기/닫기
const onMealPointEarned = () => {
  showPointModal.value = true
}
const closePointModal = () => {
  showPointModal.value = false
}

// ✅ 각 섹션에서 합계 올라오는 경우 처리
const onUpdateTotal = (sectionTotal) => {
  // 섹션별 total 을 합쳐서 dietStore.total 을 관리하고 싶다면
  // 여기서 로직 추가해서 dietStore.total 갱신해도 됨.
  // 간단히 예시로는 일단 그대로 dietStore.total 을 쓰도록 둠.
  // console.log('섹션 합계 변경:', sectionTotal)
}

// ====== localStorage 저장 (캘린더 연동용 기존 로직 유지) ======
const STORE_KEY = 'dietTotalsByDate'
const todayKey = () => {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
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

/* ✅ 포인트 모달 스타일 (커뮤니티 작성 모달이랑 비슷하게) */
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
