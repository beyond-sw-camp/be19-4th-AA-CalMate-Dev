<template>
  <!-- 상단 KPI용 단일 카드 -->
  <article class="kpi">
    <!-- 아이콘 영역: 이모지/아이콘 문자 그대로 표시 -->
    <div class="kpi__icon">{{ icon }}</div>
    <!-- 텍스트 메타 영역 -->
    <div class="kpi__meta">
      <p class="kpi__label">{{ label }}</p>
      <p class="kpi__value"><strong>{{ value }}</strong> {{ unit }}</p>
    </div>
  </article>
</template>

<script setup>
// 각 줄 주석: props는 화면에 보이는 텍스트/아이콘/단위를 구성
const props = defineProps({
  icon: { type: String, default: '✨' },     // 좌측 아이콘(이모지/문자)
  label: { type: String, default: '' },      // 상단 작은 라벨(예: 섭취/소모)
  value: { type: [String, Number], default: 0 }, // 값(숫자/문자)
  unit: { type: String, default: 'kcal' }    // 단위(기본 kcal)
})
</script>

<style scoped>
/* 페이지 변수 폴백(페이지가 변수 제공 안 해도 동일 UI) */
:root {
  --line: #e9edf4;
  --brand-soft: #f1f0ff;
  --shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
  --radius: 14px;
  --muted: #7d8896;
}

/* KPI 카드 기본 모양(페이지 기존 kpi와 동일) */
.kpi{
  display:flex; align-items:center; gap:12px;
  border:1px solid var(--line);
  border-radius: var(--radius);
  background:#fff; padding:14px;
  box-shadow: var(--shadow);
}
.kpi__icon{
  width:40px; height:40px; display:grid; place-items:center;
  border-radius:12px; background:var(--brand-soft); font-size:20px;
}
.kpi__label{ margin:0; color:var(--muted); font-size:12px; }
.kpi__value{ margin:2px 0 0; font-size:14px; }
</style>
