<template>
  <section class="page">
    <!-- 상단 인사 영역 -->
    <header class="page__header">
      <div class="hello">
        <h1 class="hello__title">안녕하세요, {{ userStore.name }} 님</h1>
        <p class="hello__sub">오늘도 건강한 하루 되세요</p>
      </div>
      <button
        class="ghost-btn"
        type="button"
        @click="$router.push({ name: 'dashboard-qna-list' })"
      >
        문의하기
      </button>
    </header>

    <!-- KPI 카드 -->
    <section class="kpis">
      <KpiCard icon="🥗" label="섭취" :value="todayIntakeKcal" unit="kcal" />
      <KpiCard icon="🔥" label="소모" :value="todayBurnKcal" unit="kcal" />
      <KpiCard icon="🎯" label="오늘의 칼로리" :value="netKcal" unit="kcal" />
      <KpiCard icon="🎯" label="목표" :value="goalKcal" unit="kcal" />
    </section>

    <!-- AI 코치 카드 -->
    <section class="card coach">
      <div class="coach__left">
        <div class="coach__chip">AI 코치</div>
        <p class="coach__msg">
          <span class="coach__emoji">🌟</span>
          오늘도 자신과의 약속을 지키셨네요! 작은 노력들이 쌓여 큰 변화를 만듭니다. 화이팅!
        </p>
      </div>
      <div class="coach__right">
        <button class="tiny primary" type="button">행운요소!</button>
        <button class="tiny" type="button">🔁</button>
        <button class="tiny" type="button">⚙</button>
        <a class="coach__more" href="javascript:void(0)">분소리 듣기 →</a>
      </div>
    </section>

    <!-- 중단 2열: 오늘의 칼로리 / 영양소 섭취 -->
    <section class="grid-2">
      <!-- 왼쪽: 도넛 -->
      <article class="card">
        <header class="card__header">
          <h2 class="card__title">오늘의 칼로리</h2>
        </header>
        <DonutGauge
          :percent="goalKcal ? Math.max((netKcal / goalKcal) * 100, 0) : 0"
          :main="netKcal"
          :sub="`/ ${goalKcal}`"
        />
      </article>

      <!-- 오른쪽: 영양소 바 -->
      <article class="card">
        <header class="card__header">
          <h2 class="card__title">영양소 섭취</h2>
        </header>
        <ProgressBar label="단백질" :value="todayProtein" :max="90" unit="g" />
        <ProgressBar label="탄수화물" :value="todayCarb" :max="250" unit="g" />
        <ProgressBar label="지방" :value="todayFat" :max="58" unit="g" />
      </article>
    </section>

    <!-- 신체 지표 -->
    <section class="card">
      <header class="card__header">
        <h2 class="card__title">신체 지표</h2>
      </header>
      <div class="triple">
        <div class="triple__col">
          <p class="triple__label">기초대사량 (BMR)</p>
          <p class="triple__value">{{ userStore.bodyMetric }} kcal</p>
        </div>
        <div class="triple__col">
          <p class="triple__label">일일 소모 칼로리 (TDEE)</p>
          <p class="triple__value">2595 kcal</p>
        </div>
        <div class="triple__col">
          <p class="triple__label">현재 체중</p>
          <p class="triple__value">{{ userStore.weight }} kg</p>
        </div>
      </div>
    </section>

    <!-- 오늘의 활동 -->
    <section class="card">
      <header class="card__header">
        <h2 class="card__title">오늘의 활동</h2>
      </header>
      <ProgressBar label="식사 기록" :value="todayMealCount" :max="3" unit="회" :long="true" />
      <ProgressBar label="운동 시간" :value="todayExerciseMinutes" :max="60" unit="분" :long="true" />
    </section>

    <!-- 식사 추천 -->
    <section class="meal">
      <MealCard
        tag="☀️ 아침"
        variant="morning"
        title="에너지 충전 아침"
        kcal="629"
        desc="하루를 시작하는 균형잡힌 한식"
      />
      <MealCard
        tag="🍳 점심"
        variant="lunch"
        title="든든한 점심"
        kcal="838"
        desc="활동적인 오후를 위한 에너지 식단"
      />
      <MealCard
        tag="🌙 저녁"
        variant="dinner"
        title="가벼운 저녁"
        kcal="524"
        desc="소화가 잘 되는 저녁 식단"
      />
      <MealCard
        tag="🍓 간식"
        variant="snack"
        title="단백질 간식"
        kcal="105"
        desc="포만감이 오래가는 단백질 간식"
      />
    </section>

    <router-view />
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import DonutGauge from '@/components/DonutGauge.vue'
import ProgressBar from '@/components/ProgressBar.vue'
import KpiCard from '@/components/KpiCard.vue'
import MealCard from '@/components/MealCard.vue'
import { useUserStore } from '@/stores/user'
import api from '@/lib/api'
import { fetchExerciseRecords } from '@/api/exerciseRecords'
import { getDietByType } from '@/api/diet'

const userStore = useUserStore()

const MEAL_TYPES = ['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK']
const todayStr = new Date().toISOString().slice(0, 10)

const todayIntakeKcal = ref(0)
const todayBurnKcal = ref(0)

const todayProtein = ref(0)
const todayCarb = ref(0)
const todayFat = ref(0)

const todayMealCount = ref(0)
const todayExerciseMinutes = ref(0)

const goalKcal = computed(() => Number(userStore.bodyMetric || 0))
const netKcal = computed(() => todayIntakeKcal.value - todayBurnKcal.value)

const loadTodayStats = async () => {
  if (!userStore.userId) return

  try {
    const dietResponses = await Promise.all(
      MEAL_TYPES.map((type) =>
        getDietByType({
          date: todayStr,
          type,
          memberId: userStore.userId,
        })
      )
    )
    const dietList = dietResponses.flatMap((r) => r.data || [])

    const intake = dietList.reduce((sum, item) => {
      const kcalFromFood = Number(item?.food?.kcal ?? 0)
      const kcalDirect = Number(item?.kcal ?? 0)
      const kcal = kcalFromFood > 0 ? kcalFromFood : kcalDirect
      return sum + (isNaN(kcal) ? 0 : kcal)
    }, 0)
    todayIntakeKcal.value = intake

    todayProtein.value = dietList.reduce(
      (sum, item) => sum + (Number(item?.food?.protein) || 0),
      0
    )
    todayCarb.value = dietList.reduce(
      (sum, item) => sum + (Number(item?.food?.carbo) || 0),
      0
    )
    todayFat.value = dietList.reduce(
      (sum, item) => sum + (Number(item?.food?.fat) || 0),
      0
    )

    todayMealCount.value = dietList.length

    const { data: exerciseList = [] } = await fetchExerciseRecords({
      memberId: userStore.userId,
      date: todayStr,
    })
    const list = Array.isArray(exerciseList) ? exerciseList : []

    const burn = list.reduce((sum, r) => sum + (Number(r.burnedKcal) || 0), 0)
    todayBurnKcal.value = burn

    const minutes = list.reduce((sum, r) => sum + (Number(r.min ?? r.minutes) || 0), 0)
    todayExerciseMinutes.value = minutes
  } catch (e) {
    console.error('대시보드 오늘 통계 조회 실패', e)
    todayIntakeKcal.value = 0
    todayBurnKcal.value = 0
    todayProtein.value = 0
    todayCarb.value = 0
    todayFat.value = 0
    todayMealCount.value = 0
    todayExerciseMinutes.value = 0
  }
}

onMounted(() => {
  loadTodayStats()
  api.get('/health').catch(() => {})
})
</script>

<style scoped>
:root {
  --bg: #fff;
  --ink: #161a1d;
  --muted: #7d8896;
  --line: #e9edf4;
  --brand: #6c5ce7;
  --brand-soft: #f1f0ff;
  --accent: #5b9cff;
  --radius: 14px;
  --shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
  --gap: 28px;
}

/* 페이지 래퍼 */
.page {
  --bg: var(--bg, #ffffff);
  --ink: var(--ink, #161a1d);
  --muted: var(--muted, #7d8896);
  --line: var(--line, #e9edf4);
  --brand: var(--brand, #6c5ce7);
  --brand-soft: var(--brand-soft, #f1f0ff);
  --accent: var(--accent, #5b9cff);
  --radius: 14px;
  --shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
  --gap: 18px;
  background: var(--bg);
  color: var(--ink);
}

.page > * {
  min-width: 0;
}

.page > section,
.page > .card {
  margin-bottom: 24px;
}
.page > section:last-child,
.page > .card:last-child {
  margin-bottom: 0;
}

/* 상단 인사 영역 */
.page__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.hello__title {
  margin: 0;
  font-size: 20px;
  font-weight: 800;
}
.hello__sub {
  margin: 4px 0 0;
  color: var(--muted);
  font-size: 13px;
}
.ghost-btn {
  appearance: none;
  border: 1px solid var(--line);
  background: #fff;
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 12px;
  color: var(--muted);
  cursor: pointer;
}
.ghost-btn:hover {
  border-color: #d5dce6;
  color: var(--ink);
}

/* KPI */
.kpis {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--gap);
}

/* 공통 카드 */
.card {
  position: relative;
  border: 1px solid var(--line, #e7ebf3);
  border-radius: var(--radius);
  background: #fff;
  box-shadow: var(--shadow);
  padding: 16px;
  overflow: hidden;
}
.card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}
.card__title {
  margin: 0;
  font-size: 16px;
  font-weight: 800;
}

/* 코치 카드 */
.coach {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(0deg, #fff, #fff), #f8faff;
}
.coach__left {
  display: grid;
  gap: 8px;
}
.coach__chip {
  display: inline-block;
  padding: 6px 10px;
  font-size: 12px;
  color: var(--accent);
  background: #eef5ff;
  border-radius: 999px;
  width: fit-content;
}
.coach__msg {
  margin: 0;
  color: #3a4552;
  font-size: 14px;
  line-height: 1.5;
}
.coach__emoji {
  margin-right: 6px;
}
.coach__right {
  display: flex;
  align-items: center;
  gap: 8px;
}
.tiny {
  appearance: none;
  border: 1px solid var(--line);
  background: #fff;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  color: var(--muted);
  cursor: pointer;
}
.tiny.primary {
  border-color: #ffd1e1;
  background: #fff4f8;
  color: #e34e89;
}
.coach__more {
  margin-left: 6px;
  font-size: 12px;
  color: var(--muted);
  text-decoration: none;
}
.coach__more:hover {
  color: var(--ink);
}

/* 2열 그리드 */
.grid-2 {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: var(--gap);
  align-items: stretch;
}

/* 신체 지표 */
.triple {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  padding-top: 6px;
}
.triple__col {
  border: 1px dashed var(--line);
  border-radius: 12px;
  padding: 12px;
  background: #fafcff;
}
.triple__label {
  margin: 0 0 6px;
  font-size: 12px;
  color: var(--muted);
}
.triple__value {
  margin: 0;
  font-weight: 800;
}

/* 식사 추천 */
.meal {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--gap);
}

/* 반응형 */
@media (max-width: 1200px) {
  .grid-2 {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 560px) {
  .triple {
    grid-template-columns: 1fr;
  }
  .meal {
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
  }
}
</style>
