<template>
  <!-- 상태에 따른 파스텔 라벨 -->
  <span class="badge" :class="klass">{{ label }}</span>
</template>

<script setup>
import { computed } from 'vue'                                  // 계산 속성 사용

const props = defineProps({
  status: { type: String, required: true }                      // 'pending' | 'answered' | 'closed'
})

/* 상태 → 한글 라벨 매핑 */
const label = computed(() => {
  if (props.status==='pending')  return '대기중'                // 미응답
  if (props.status==='answered') return '답변완료'              // 답변 완료
  if (props.status==='closed')   return '종료'                  // 종료됨
  return props.status                                             // 보호적 반환
})

/* 상태 → 톤 클래스 매핑 */
const klass = computed(() => {
  if (props.status==='pending')  return 'tone-yellow'           // 노랑(대기)
  if (props.status==='answered') return 'tone-green'            // 초록(완료)
  if (props.status==='closed')   return 'tone-gray'             // 회색(종료)
  return 'tone-gray'                                             // 기본값
})
</script>

<style scoped>
.badge{
  /* 알약 모양 라벨 */
  display:inline-block; padding:6px 10px; border-radius:999px;
  font-size:12px; font-weight:700; border:1px solid transparent;
}
/* 파스텔 팔레트 */
.tone-green  { color:#0f766e; background:#eafaf7; border-color:#d3f4ec; }
.tone-yellow { color:#a16207; background:#fff9e6; border-color:#ffefbf; }
.tone-gray   { color:#374151; background:#f7f9fb; border-color:#e5e7eb; }
</style>
