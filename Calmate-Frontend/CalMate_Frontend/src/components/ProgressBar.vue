<template>
  <div class="bar" :class="{ 'bar--long': long }">
    <div class="bar__row">
      <span class="bar__label">{{ label }}</span>
      <span class="bar__value">{{ displayText }}</span>
    </div>
    <div class="bar__track">
      <div class="bar__fill" :style="{ width: safePercent + '%' }"></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: { type: String, default: '' },

  // 새 방식 (자동계산)
  value: { type: [Number, String], default: NaN },
  max: { type: [Number, String], default: NaN },
  unit: { type: String, default: '' },

  // 구 방식 (직접 지정)
  valueText: { type: String, default: '' },
  percent: { type: [Number, String], default: NaN },

  long: { type: Boolean, default: false }
})

// 문자열도 숫자로 변환
const toNum = (v) => {
  if (v === '' || v === null || v === undefined) return NaN
  const n = Number(v)
  return Number.isFinite(n) ? n : NaN
}

// 퍼센트 계산
const rawPercent = computed(() => {
  const p = toNum(props.percent)
  if (Number.isFinite(p)) return p
  const v = toNum(props.value)
  const m = toNum(props.max)
  if (Number.isFinite(v) && Number.isFinite(m) && m > 0) return (v / m) * 100
  return 0
})

// 0~100 범위로 보정
const safePercent = computed(() => {
  const n = toNum(rawPercent.value)
  return Math.min(100, Math.max(0, Number.isFinite(n) ? n : 0))
})

// 표시문구 계산
const displayText = computed(() => {
  if (props.valueText) return props.valueText
  const v = toNum(props.value)
  const m = toNum(props.max)
  if (Number.isFinite(v) && Number.isFinite(m)) {
    const u = props.unit || ''
    const join = (n) => (u ? `${n} ${u}` : `${n}`)
    return `${join(v)} / ${join(m)}`
  }
  return ''
})
</script>

<style scoped>
/* 전체 바 래퍼 */
.bar { display: grid; gap: 8px; margin-bottom: 14px; }
.bar:last-child { margin-bottom: 0; }

/* 상단 라인 */
.bar__row {
  margin: 0.7em 0;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}
.bar__label { font-size: 12px; color: var(--muted, #7d8896); }
.bar__value { font-size: 12px; color: var(--muted, #7d8896); }

/* 트랙/필 */
.bar__track {
  width: 100%;
  height: 10px;
  background: #eef2f8;
  border-radius: 999px;
  overflow: hidden;
}
.bar__fill {
  height: 100%;
  width: 0%;
  background: linear-gradient(90deg, var(--brand, #6c5ce7), #a08bff);
  border-radius: 999px;
  transition: width .3s ease;
}

/* 긴 바 버전 */
.bar--long .bar__track { height: 12px; }
</style>
