<!--
  파일 위치(권장): src/components/admin/ActivityCard.vue
  역할: 대시보드 하단에 쓰이는 소형 카드 UI.
      - 상단 아이콘 슬롯 + 제목 + 큰 값 + 보조 라벨(부제)
      - tone prop 으로 파스텔 테마 변경 (Admin StatCard와 톤 체계 통일)
-->
<template>
  <!-- 카드 뼈대: 파스텔 배경 + 둥근 테두리 + 옅은 그림자 -->
  <article class="card" :class="toneClass">
    <!-- 좌: 아이콘(옵션) -->
    <div class="icon-wrap">
      <slot name="icon" />
    </div>
    <!-- 우: 텍스트 묶음 -->
    <div class="texts">
      <p class="title">{{ title }}</p>
      <p class="value">{{ value }}</p>
      <p class="subtitle" v-if="subtitle">{{ subtitle }}</p>
    </div>
  </article>
</template>

<script setup>
// 컴포지션 API: 계산 속성을 위해 computed 사용
import { computed } from 'vue'

// 프롭 정의
const props = defineProps({
  title:    { type: String, required: true },            // 카드 상단 제목
  value:    { type: [Number, String], required: true },  // 중앙 큰 값
  subtitle: { type: String, default: '' },               // 하단 보조 텍스트
  tone:     { type: String, default: 'purple' }          // 파스텔 톤 키워드
})

// 톤 클래스 계산: tone-*
const toneClass = computed(() => `tone-${props.tone}`)
</script>

<style scoped>
/* 카드 레이아웃: 아이콘 28px + 텍스트 컬럼 */
.card{
  display: grid;
  grid-template-columns: 28px 1fr;
  gap: 12px;

  padding: 18px;
  border-radius: 16px;

  background: #f7f9fb;
  border: 1px solid rgba(0,0,0,.04);
  box-shadow: 0 6px 18px rgba(17,24,39,.04);
  color: #374151;
}

/* 아이콘 위치 정렬 */
.icon-wrap{
  display:flex; align-items:flex-start; justify-content:center;
  padding-top: 2px;
}

/* 텍스트 덩어리 */
.texts{ display:flex; flex-direction:column; gap:6px; }
.title{ font-size: 14px; font-weight: 700; color:#6b7280; }
.value{ font-size: 26px; font-weight: 800; letter-spacing: -0.4px; }
.subtitle{ font-size: 13px; color:#6b7280; }

/* 톤 팔레트(StatCard와 동일 계열) */
.tone-blue   { color:#1d4ed8; background:#f1f6ff; border-color:#e1ebff; }
.tone-green  { color:#0f766e; background:#eafaf7; border-color:#d3f4ec; }
.tone-orange { color:#c2410c; background:#fff3e8; border-color:#ffe3c9; }
.tone-purple { color:#6d28d9; background:#f6f1ff; border-color:#e7dcff; }
.tone-cyan   { color:#0e7490; background:#e9fbff; border-color:#d1f4ff; }
.tone-yellow { color:#a16207; background:#fff9e6; border-color:#ffefbf; }
.tone-red    { color:#b91c1c; background:#ffecec; border-color:#ffd6d6; }
.tone-indigo { color:#4338ca; background:#eef1ff; border-color:#dfe4ff; }
.tone-pink   { color:#be185d; background:#ffeaf4; border-color:#ffd2e8; }
.tone-gray   { color:#374151; background:#f7f9fb; border-color:rgba(0,0,0,.05); }

/* 아이콘 공통 크기 */
:global(.icon){ width:22px; height:22px; fill: currentColor; }
</style>
