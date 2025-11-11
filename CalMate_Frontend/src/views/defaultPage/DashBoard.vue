<template>
  <section class="page">
    <!-- 상단 인사 영역 -->
    <header class="page__header">
      <div class="hello">
        <h1 class="hello__title">안녕하세요, {{ userStore.name }} 님</h1>
        <p class="hello__sub">오늘도 건강한 하루 되세요</p>
      </div>
      <!-- 문의하기 버튼: QnA 자식 라우트로 이동 -->
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
      <KpiCard icon="🥗" label="섭취" value="165" unit="kcal" />
      <KpiCard icon="🔥" label="소모" value="210" unit="kcal" />
      <KpiCard icon="🎯" label="목표" value="2095" unit="kcal" />
      <KpiCard icon="💜" label="남은 칼로리" value="2140" unit="kcal" />
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
          :percent="(Math.abs(netKcal) / goalKcal) * 100"
          :main="netKcal"
          :sub="`/ ${goalKcal}`"
        />
      </article>

      <!-- 오른쪽: 영양소 바 -->
      <article class="card">
        <header class="card__header">
          <h2 class="card__title">영양소 섭취</h2>
        </header>
        <ProgressBar label="단백질" :value="31" :max="90" unit="g" />
        <ProgressBar label="탄수화물" :value="60" :max="250" unit="g" />
        <ProgressBar label="지방" :value="4" :max="58" unit="g" />
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
      <ProgressBar label="식사 기록" :value="2" :max="3" unit="회" :long="true" />
      <ProgressBar label="운동 시간" :value="50" :max="60" unit="분" :long="true" />
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

    <!-- QnA 등 dashboard 자식 라우트 렌더링 영역 -->
    <router-view />
  </section>
</template>

<script setup>
import { computed } from 'vue'
import DonutGauge from '@/components/DonutGauge.vue'
import ProgressBar from '@/components/ProgressBar.vue'
import KpiCard from '@/components/KpiCard.vue'
import MealCard from '@/components/MealCard.vue'
import { useUserStore } from '@/stores/user'
import api from '@/lib/api'

const userStore = useUserStore()

const netKcal = computed(() => 650)
const goalKcal = 2095

api.get('/health').catch(() => {
  // 필요 시 에러 처리
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
