<template>
  <!-- 상태에 따른 파스텔 색상/텍스트를 통일 -->
  <span class="badge" :class="klass">{{ label }}</span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: { type: String, required: true } // 'active'|'suspended'|'blocked'
})

/* 라벨 매핑 */
const label = computed(() => {
  if (props.status === 'active') return '활성'
  if (props.status === 'suspended') return '정지'
  if (props.status === 'blocked') return '차단'
  return props.status
})

/* 색상 클래스 매핑 */
const klass = computed(() => {
  if (props.status === 'active') return 'tone-green'
  if (props.status === 'suspended') return 'tone-yellow'
  if (props.status === 'blocked') return 'tone-red'
  return 'tone-gray'
})
</script>

<style scoped>
.badge{
  display:inline-block; padding: 6px 10px; border-radius: 999px;
  font-size: 12px; font-weight: 700; border: 1px solid transparent;
}

/* 파스텔 팔레트 */
.tone-green  { color:#0f766e; background:#eafaf7; border-color:#d3f4ec; }
.tone-yellow { color:#a16207; background:#fff9e6; border-color:#ffefbf; }
.tone-red    { color:#b91c1c; background:#ffecec; border-color:#ffd6d6; }
.tone-gray   { color:#374151; background:#f7f9fb; border-color:#e5e7eb; }
</style>
