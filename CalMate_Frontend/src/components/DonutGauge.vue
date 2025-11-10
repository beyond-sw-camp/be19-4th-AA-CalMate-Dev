<template>
  <!-- 전체 도넛을 감싸는 래퍼: 중앙 정렬과 크기 기준 상자 -->
  <div class="donut-wrap">
    <!-- 도넛 링과 중앙 텍스트를 서로 겹치기 위한 기준 상자 -->
    <div class="donut-box" :style="{ width: size + 'px' }">
      <!-- 실제 링(테두리만 채워지는 부분). 진행률은 --pct(숫자)로 전달 -->
      <div
        class="donut"
        :style="{
          '--pct': safePercent,
          '--thick': thick + 'px'
        }"
      ></div>

      <!-- 중앙 텍스트: 마스크 영향 안 받도록 링의 '형제'로 배치 -->
      <div class="donut__hole">
        <p class="donut__main">{{ main }}</p>
        <p class="donut__sub">{{ sub }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
// ✅ props 정의: 퍼센트/굵기/크기/텍스트
import { computed } from 'vue'

const props = defineProps({
  // 0~100 숫자. % 기호 없이 숫자만!
  percent: { type: Number, default: 0 },
  // 링 두께(px)
  thick: { type: Number, default: 16 },
  // 외경 크기(px)
  size: { type: Number, default: 220 },
  // 중앙 큰 숫자/문구
  main: { type: [String, Number], default: '' },
  // 중앙 보조 문구
  sub: { type: [String, Number], default: '' }
})

// ✅ 안전한 클램프(0~100), NaN 방지
const safePercent = computed(() => {
  const n = Number(props.percent)
  if (!Number.isFinite(n)) return 0
  return Math.min(100, Math.max(0, n))
})
</script>

<style scoped>
/* 도넛 전체를 가운데 정렬 */
.donut-wrap {
  display: grid;
  place-items: center;
  padding: 8px 0 4px;
}

/* 링과 텍스트를 겹치기 위한 기준 박스 */
.donut-box {
  position: relative;
  aspect-ratio: 1;          /* 정원 유지 */
}

/* 링(테두리만 채움): conic-gradient + mask */
.donut {
  position: absolute;
  inset: 0;
  --pct: 0;                 /* 진행률(0~100) */
  --thick: 16px;            /* 링 두께 */
  border-radius: 50%;
  background: conic-gradient(var(--brand, #6c5ce7) calc(var(--pct) * 1%), #e5eaf2 0);
  -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - var(--thick)), #000 0);
          mask: radial-gradient(farthest-side, transparent calc(100% - var(--thick)), #000 0);
  outline: 1px solid rgba(0,0,0,.02); /* 가장자리 미세 보정 */
}

/* 중앙 텍스트(마스크 영향 X) */
.donut__hole {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  text-align: center;
  pointer-events: none;
}
.donut__main { margin: 1em; font-size: 48px; font-weight: 800; line-height: 1; }
.donut__sub  { margin: -5em 0 0; font-size: 25px; color: var(--muted, #7d8896); }
</style>
