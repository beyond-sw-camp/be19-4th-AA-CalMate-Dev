<template>
  <!-- 하단 식사 추천 단일 카드 -->
  <article class="meal__item">
    <!-- 상단 태그(시간대) -->
    <div class="meal__tag" :class="tagClass">
      {{ tag }}
    </div>

    <!-- 제목 -->
    <h3 class="meal__title">{{ title }}</h3>

    <!-- 칼로리 -->
    <p class="meal__kcal">{{ kcal }} kcal</p>

    <!-- 설명 -->
    <p class="meal__desc">{{ desc }}</p>
  </article>
</template>

<script setup>
// 매우 상세 주석: props로 텍스트와 스타일(variant)을 제어
import { computed } from 'vue'

const props = defineProps({
  tag: { type: String, default: '' },          // 태그 텍스트(예: ☀️ 아침)
  variant: { type: String, default: 'morning' },// 색상 테마: morning/lunch/dinner/snack
  title: { type: String, default: '' },        // 카드 제목
  kcal: { type: [String, Number], default: 0 },// 숫자(문자도 허용)
  desc: { type: String, default: '' }          // 설명 문구
})

// variant 값에 따라 태그 배경/색을 결정
const tagClass = computed(() => {
  switch (props.variant) {
    case 'lunch':  return 'meal__tag--yellow'
    case 'dinner': return 'meal__tag--blue'
    case 'snack':  return 'meal__tag--red'
    default:       return '' // morning (기본 오렌지)
  }
})
</script>

<style scoped>
/* 페이지 변수 폴백 */
:root {
  --line:#e9edf4;
  --shadow:0 8px 24px rgba(15,23,42,.06);
  --muted:#7d8896;
}

/* 카드 박스 */
.meal__item{
  border:1px solid var(--line);
  border-radius:14px;
  background:#fff;
  padding:14px;
  box-shadow:var(--shadow);
}

/* 태그(시간대) 기본 */
.meal__tag{
  display:inline-block; padding:4px 10px; border-radius:999px; font-size:12px;
  background:#fff4e6; color:#ff8a00; margin-bottom:8px;       /* morning */
}
/* 점심/저녁/간식 컬러 변형 */
.meal__tag--yellow{ background:#fff9d9; color:#d79a00; }       /* lunch */
.meal__tag--blue{   background:#eaf3ff; color:#3b82f6; }       /* dinner */
.meal__tag--red{    background:#ffe7ee; color:#e34e89; }       /* snack */

/* 제목/부제 스타일 */
.meal__title{ margin:0 0 2px; font-size:14px; font-weight:800; }
.meal__kcal{  margin:0 0 6px; color:#586578; font-weight:700; }
.meal__desc{  margin:0; color:var(--muted); font-size:12px; }
</style>
