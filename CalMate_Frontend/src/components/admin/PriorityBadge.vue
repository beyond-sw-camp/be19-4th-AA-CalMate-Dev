<template>
  <!-- 우선순위에 따른 파스텔 라벨 -->
  <span class="badge" :class="klass">{{ label }}</span>
</template>

<script setup>
import { computed } from 'vue'                                  // 계산 속성

const props = defineProps({
  priority: { type: String, required: true }                    // 'low' | 'normal' | 'high'
})

/* 우선순위 → 한글 라벨 매핑 */
const label = computed(() => {
  if (props.priority==='low')    return '낮음'                  // low
  if (props.priority==='normal') return '보통'                  // normal
  if (props.priority==='high')   return '높음'                  // high
  return props.priority
})

/* 우선순위 → 톤 클래스 매핑 */
const klass = computed(() => {
  if (props.priority==='low')    return 'tone-blue'             // 파랑(낮음)
  if (props.priority==='normal') return 'tone-purple'           // 보라(보통)
  if (props.priority==='high')   return 'tone-red'              // 빨강(높음)
  return 'tone-gray'                                              
})
</script>

<style scoped>
.badge{
  display:inline-block; padding:6px 10px; border-radius:999px;
  font-size:12px; font-weight:700; border:1px solid transparent;
}
.tone-blue   { color:#1d4ed8; background:#f1f6ff; border-color:#e1ebff; }
.tone-purple { color:#6d28d9; background:#f6f1ff; border-color:#e7dcff; }
.tone-red    { color:#b91c1c; background:#ffecec; border-color:#ffd6d6; }
.tone-gray   { color:#374151; background:#f7f9fb; border-color:#e5e7eb; }
</style>
