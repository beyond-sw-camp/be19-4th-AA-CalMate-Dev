<template>
  <section class="page">
    <header class="page__header">
      <div class="hello">
        <h1 class="hello__title">안녕하세요, {{ userStore.name }} 님</h1>
        <p class="hello__sub">오늘도 건강한 하루 되세요</p>
      </div>
      <button class="ghost-btn" type="button">문의하기</button>
    </header>

    <section class="kpis">
        <KpiCard icon="🥗" label="섭취" value="165" unit="kcal" />
        <KpiCard icon="🔥" label="소모" value="210" unit="kcal" />
        <KpiCard icon="🎯" label="목표" value="2095" unit="kcal" />
        <KpiCard icon="💜" label="남은 칼로리" value="2140" unit="kcal" />
    </section>


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

    <!-- 중단 2열 -->
    <section class="grid-2">
      <!-- 왼쪽: 도넛 컴포넌트 사용 -->
      <article class="card">
        <header class="card__header">
          <h2 class="card__title">오늘의 칼로리</h2>
        </header>

        <!-- 도넛 컴포넌트 (UI 동일) -->
        <DonutGauge
            :percent="Math.abs(netKcal) / goalKcal * 100"
            :main="netKcal"
            :sub="`/ ${goalKcal}`"
        />
      </article>

      <!-- 오른쪽: 영양소 섭취 바들 -->
      <article class="card">
        <header class="card__header">
          <h2 class="card__title">영양소 섭취</h2>
        </header>

        <!-- 바 컴포넌트 (UI 동일) -->
        <ProgressBar label="단백질"   :value="31" :max="90"  unit="g" />
        <ProgressBar label="탄수화물" :value="60"  :max="250" unit="g" />
        <ProgressBar label="지방"     :value="4"  :max="58"  unit="g" />
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

      <!-- ✅ 긴 바(두꺼운 트랙) -->
      <ProgressBar label="식사 기록" :value="2" :max="3" unit="회" :long="true" />
      <ProgressBar label="운동 시간" :value="50" :max="60" unit="분" :long="true" />
    </section>

    <!-- 식사 추천 -->
    <section class="meal">
        <MealCard tag="☀️ 아침"  variant="morning" title="에너지 충전 아침" kcal="629" desc="하루를 시작하는 균형잡힌 한식" />
        <MealCard tag="🍳 점심"  variant="lunch"   title="든든한 점심"   kcal="838" desc="활동적인 오후를 위한 에너지 식단" />
        <MealCard tag="🌙 저녁"  variant="dinner"  title="가벼운 저녁"   kcal="524" desc="소화가 잘 되는 저녁 식단" />
        <MealCard tag="🍓 간식"  variant="snack"   title="단백질 간식"   kcal="105" desc="포만감이 오래가는 단백질 간식" />
    </section>

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

const userStore = useUserStore();
const netKcal = computed(() => 650)
const goalKcal = 2095
api.get('/health')

</script>


<style scoped>
/* ========== 공통 변수: 색상/여백/모서리/그림자 ========== */
:root {
  --bg: #fff;
  --ink: #161a1d;
  --muted: #7d8896;
  --line: #e9edf4;
  --brand: #6c5ce7;        /* 주요 포인트 색 */
  --brand-soft: #f1f0ff;   /* 연보라 배경 */
  --accent: #5b9cff;       /* 보조 포인트 */
  --radius: 14px;          /* 카드 둥근 모서리 */
  --shadow: 0 8px 24px rgba(15, 23, 42, 0.06); /* 부드러운 그림자 */
  --gap: 28px;             /* 카드/섹션 간격 */
}

/* ========== 페이지 래퍼 ========== */
.page {
  --bg: var(--bg, #ffffff);               /* 배경색 (없으면 흰색) */
  --ink: var(--ink, #161a1d);             /* 본문 글자색 */
  --muted: var(--muted, #7d8896);         /* 보조 글자색 */
  --line: var(--line, #e9edf4);           /* 카드 테두리색 */
  --brand: var(--brand, #6c5ce7);         /* 포인트색(보라) */
  --brand-soft: var(--brand-soft, #f1f0ff);/* 연한 포인트 배경 */
  --accent: var(--accent, #5b9cff);       /* 보조 포인트(파랑) */
  --radius: 14px;                         /* 카드 둥근 모서리 */
  --shadow: 0 8px 24px rgba(15, 23, 42, .06); /* 부드러운 그림자 */
  --gap: 18px;                            /* 섹션/카드 간격 */
  background: var(--bg);                  /* 페이지 배경 */
  color: var(--ink);                      /* 기본 글자색 */
}

/* 페이지의 직계 자식이 그리드 내부에서 잘 줄어들 수 있도록 */
.page > * {
  min-width: 0;                           /* 긴 내용으로 인한 넘침 방지 */
}

.page > section,
.page > .card {
  margin-bottom: 24px;
}
.page > section:last-child,
.page > .card:last-child {
  margin-bottom: 0;
}

/* ========== 상단 인사 영역 ========== */
.page__header {
  display: flex;              /* 좌우 배치 */
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
  padding: 8px 12px;
  border-radius: 10px;
  font-size: 12px;
  color: var(--muted);
  cursor: pointer;
}
.ghost-btn:hover { border-color: #d5dce6; color: var(--ink); }

/* ========== KPI 요약 4개 ========== */
.kpis {
  display: grid;                          /* 그리드로 4칸 배치 */
  grid-template-columns: repeat(4, minmax(0, 1fr)); /* 칸이 넘칠 때 줄바꿈 */
  gap: var(--gap);                        /* 카드 사이 간격 */
}
.kpi {
  display: flex;                     /* 아이콘 + 텍스트 나란히 */
  align-items: center;
  gap: 12px;
  border: 1px solid var(--line);     /* 카드 외곽선 */
  border-radius: var(--radius);
  background: #fff;
  padding: 14px;
  box-shadow: var(--shadow);
}
.kpi__icon {
  width: 40px; height: 40px;
  display: grid; place-items: center;
  border-radius: 12px;
  background: var(--brand-soft);     /* 은은한 보라 배경 */
  font-size: 20px;                   /* 이모지 크기 */
}
.kpi__label { margin: 0; color: var(--muted); font-size: 12px; }
.kpi__value { margin: 2px 0 0; font-size: 14px; }

/* ========== 공통 카드 ========== */
.card {
  position: relative;                     /* 내부 요소 기준 배치 */
  border: 1px solid var(--line, #e7ebf3); /* 명시 테두리 + 폴백 */
  border-radius: var(--radius);           /* 둥근 모서리 */
  background: #fff;                       /* 흰 배경 */
  box-shadow: var(--shadow);              /* 그림자 */
  padding: 16px;                          /* 내부 여백 */
  overflow: hidden;                       /* 내부 요소가 튀어나오지 않게 */
}
.card__header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 10px;
}
.card__title { margin: 0; font-size: 16px; font-weight: 800; }

/* ========== 코치 카드 ========== */
.coach {
  display: flex; align-items: center; justify-content: space-between;
  background: linear-gradient(0deg, #fff, #fff), #f8faff;  /* 아주 옅은 느낌 */
}
.coach__left { display: grid; gap: 8px; }
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
  margin: 0; color: #3a4552; font-size: 14px; line-height: 1.5;
}
.coach__emoji { margin-right: 6px; }
.coach__right { display: flex; align-items: center; gap: 8px; }
.tiny {
  appearance: none; border: 1px solid var(--line); background: #fff;
  padding: 6px 10px; border-radius: 999px; font-size: 12px; color: var(--muted);
  cursor: pointer;
}
.tiny.primary { border-color: #ffd1e1; background: #fff4f8; color: #e34e89; }
.coach__more { margin-left: 6px; font-size: 12px; color: var(--muted); text-decoration: none; }
.coach__more:hover { color: var(--ink); }

/* ========== 2열 그리드 (오늘의 칼로리 / 영양소 섭취) ========== */
.grid-2 {
  display: grid;                          /* 그리드 두 칼럼 */
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); /* 내부 너비 초과 시 잘림 보정 */
  gap: var(--gap);                        /* 카드 사이 간격 */
  align-items: stretch;                   /* 두 카드 높이 자연스러운 늘어남 */
}


/* ========== 신체 지표 3분할 ========== */
.triple{
  display:grid; grid-template-columns: repeat(3, 1fr); gap: 16px;
  padding-top: 6px;
}
.triple__col{
  border:1px dashed var(--line); border-radius:12px; padding:12px;
  background:#fafcff;
}
.triple__label{ margin:0 0 6px; font-size:12px; color: var(--muted); }
.triple__value{ margin:0; font-weight:800; }

/* ========== 식사 추천 가로 카드 리스트 ========== */
.meal{
  display:grid; grid-template-columns: repeat(4, 1fr); gap: var(--gap);
}

/* ========== 반응형 ========== */
@media (max-width: 1200px){
  .grid-2{ grid-template-columns: 1fr; }
}
@media (max-width: 560px){
  .triple{ grid-template-columns: 1fr; }
}
</style>
