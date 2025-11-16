<template>
  <div class="diet-page">
    <!-- 헤더 영역 -->
    <header class="header">
      <div class="title-wrap">
        <h2>식단 관리</h2>
        <p class="sub">
          {{ selectedDateLabel }} · 총 {{ totalKcal.toLocaleString() }} kcal 섭취
        </p>
      </div>
    </header>

    <!-- 영양소 요약 카드 -->
    <section class="nutrition-summary">
      <div class="nutrition-card">
        <div class="nutrition-icon">
          <Flame :size="32" :stroke-width="2.5" />
        </div>
        <div class="nutrition-info">
          <div class="nutrition-label">칼로리</div>
          <div class="nutrition-value">{{ totalKcal }}</div>
        </div>
      </div>
      <div class="nutrition-card">
        <div class="nutrition-icon">
          <Beef :size="32" :stroke-width="2.5" />
        </div>
        <div class="nutrition-info">
          <div class="nutrition-label">단백질</div>
          <div class="nutrition-value">{{ totalProtein }}g</div>
        </div>
      </div>
      <div class="nutrition-card">
        <div class="nutrition-icon">
          <Wheat :size="32" :stroke-width="2.5" />
        </div>
        <div class="nutrition-info">
          <div class="nutrition-label">탄수화물</div>
          <div class="nutrition-value">{{ totalCarb }}g</div>
        </div>
      </div>
      <div class="nutrition-card">
        <div class="nutrition-icon">
          <Droplet :size="32" :stroke-width="2.5" />
        </div>
        <div class="nutrition-info">
          <div class="nutrition-label">지방</div>
          <div class="nutrition-value">{{ totalFat }}g</div>
        </div>
      </div>
    </section>

    <!-- 식사 탭 -->
    <nav class="tab-bar">
      <router-link
        :to="{ path: '/main/dietmanagement/breakfast', query: route.query }"
        class="tab"
        :class="{ active: route.path === '/main/dietmanagement/breakfast' }"
      >
        <span class="tab-icon">
          <Sunrise :size="20" :stroke-width="2.5" />
        </span>
        <span class="tab-text">아침</span>
      </router-link>
      <router-link
        :to="{ path: '/main/dietmanagement/lunch', query: route.query }"
        class="tab"
        :class="{ active: route.path === '/main/dietmanagement/lunch' }"
      >
        <span class="tab-icon">
          <Sun :size="20" :stroke-width="2.5" />
        </span>
        <span class="tab-text">점심</span>
      </router-link>
      <router-link
        :to="{ path: '/main/dietmanagement/dinner', query: route.query }"
        class="tab"
        :class="{ active: route.path === '/main/dietmanagement/dinner' }"
      >
        <span class="tab-icon">
          <Moon :size="20" :stroke-width="2.5" />
        </span>
        <span class="tab-text">저녁</span>
      </router-link>
      <router-link
        :to="{ path: '/main/dietmanagement/snack', query: route.query }"
        class="tab"
        :class="{ active: route.path === '/main/dietmanagement/snack' }"
      >
        <span class="tab-icon">
          <Cookie :size="20" :stroke-width="2.5" />
        </span>
        <span class="tab-text">간식</span>
      </router-link>
    </nav>

    <router-view v-slot="{ Component }">
      <component
        :is="Component"
        @update-total="onUpdateTotal"
        @update-nutrition="onUpdateNutrition"
        @meal-point-earned="onMealPointEarned"
      />
    </router-view>

    <!-- 포인트 적립 모달 -->
    <div v-if="showPointModal" class="modal-overlay">
      <div class="modal-box">
        <div class="modal-icon">🎉</div>
        <h3 class="modal-title">포인트 적립!</h3>
        <p class="modal-desc">오늘의 식단 기록 보상으로<br/><strong>5포인트</strong>가 적립되었습니다</p>
        <button class="modal-btn" @click="closePointModal">확인</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { ref, computed, watchEffect } from 'vue'
import { dietStore } from '@/stores/dietStore'
import { Flame, Beef, Wheat, Droplet, Sunrise, Sun, Moon, Cookie } from 'lucide-vue-next'

const route = useRoute()

const totalKcal = computed(() => dietStore.total)
const totalProtein = ref(0)
const totalCarb = ref(0)
const totalFat = ref(0)

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

const onUpdateNutrition = (nutrition) => {
  if (nutrition) {
    totalProtein.value = nutrition.protein || 0
    totalCarb.value = nutrition.carb || 0
    totalFat.value = nutrition.fat || 0
  }
}

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
  padding: 24px 32px;
  background: #ffffff;
  min-height: 100vh;
}

/* 헤더 영역 */
.header {
  margin-bottom: 24px;
}

.title-wrap h2 {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 4px;
  color: #0a0a0a;
}

.title-wrap .sub {
  font-size: 16px;
  color: #717182;
}

/* 영양소 요약 카드 */
.nutrition-summary {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 16px;
}

.nutrition-card {
  background: #ffffff;
  border-radius: 14px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 14px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #e9edf4;
}

.nutrition-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.1);
}

.nutrition-icon {
  width: 48px;
  height: 48px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nutrition-card:nth-child(1) .nutrition-icon {
  background: #ffe9d6;
  color: #ea580c;
}

.nutrition-card:nth-child(2) .nutrition-icon {
  background: #ffe9d6;
  color: #ea580c;
}

.nutrition-card:nth-child(3) .nutrition-icon {
  background: #fff7e1;
  color: #f59e0b;
}

.nutrition-card:nth-child(4) .nutrition-icon {
  background: #dbeafe;
  color: #3b82f6;
}

.nutrition-info {
  flex: 1;
}

.nutrition-label {
  font-size: 12px;
  color: #7d8896;
  font-weight: 600;
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.nutrition-value {
  font-size: 24px;
  font-weight: 800;
  color: #161a1d;
  line-height: 1;
}

/* 탭 바 */
.tab-bar {
  display: flex;
  justify-content: space-between;
  background: #f3f3f6;
  border-radius: 999px;
  padding: 6px;
  margin-bottom: 28px;
}

.tab {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 14px 12px;
  border-radius: 999px;
  text-decoration: none;
  color: #7d8896;
  background-color: transparent;
  transition: all 0.2s ease;
  position: relative;
}

.tab:hover {
  background: rgba(108, 92, 231, 0.05);
  color: #6c5ce7;
}

.tab.active {
  background: #ffffff;
  color: #161a1d;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transform: translateY(-1px);
}

.tab-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
}

.tab.active .tab-icon {
  transform: scale(1.1);
}

.tab-text {
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.3px;
}

/* 모달 */
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
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-box {
  background: #ffffff;
  width: 400px;
  max-width: 90%;
  padding: 36px 28px;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.2);
  animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideUp {
  from {
    transform: translateY(30px) scale(0.95);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

.modal-icon {
  font-size: 64px;
  margin-bottom: 16px;
  animation: bounce 0.6s ease-in-out;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.modal-title {
  font-size: 22px;
  font-weight: 800;
  color: #161a1d;
  margin: 0 0 12px 0;
}

.modal-desc {
  font-size: 15px;
  color: #7d8896;
  line-height: 1.6;
  margin: 0 0 24px 0;
}

.modal-desc strong {
  color: #6c5ce7;
  font-weight: 800;
}

.modal-btn {
  width: 100%;
  padding: 14px 24px;
  background: #6c5ce7;
  color: #ffffff;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.modal-btn:hover {
  background: #5b4bc4;
  transform: translateY(-1px);
}

.modal-btn:active {
  transform: translateY(0);
}

/* 반응형 */
@media (max-width: 1024px) {
  .nutrition-summary {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .diet-page {
    padding: 16px;
  }

  .header {
    padding: 24px 20px;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .calorie-badge {
    width: 100%;
  }

  .title {
    font-size: 24px;
  }

  .nutrition-summary {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .nutrition-card {
    padding: 16px;
  }


  .tab {
    padding: 12px 8px;
  }


  .tab-text {
    font-size: 12px;
  }
}
</style>
