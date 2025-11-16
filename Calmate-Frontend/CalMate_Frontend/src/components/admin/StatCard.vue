<template>
  <!-- 카드 틀: 파스텔 배경 + 라운드 + 매우 부드러운 그림자 -->
  <article class="card" :class="toneClass">
    <!-- 좌측 상단 아이콘(슬롯) -->
    <div class="icon-wrap">
      <slot name="icon" />
    </div>

    <!-- 텍스트 블럭 -->
    <div class="texts">
      <!-- 상단 라벨 -->
      <p class="title">{{ title }}</p>

      <!-- 중앙 큰 숫자 -->
      <p class="value">{{ displayValue }}</p>

      <!-- 하단 보조 줄 -->
      <div class="sub" v-if="sublabel || subvalue !== null">
        <span class="sublabel" v-if="sublabel">{{ sublabel }}</span>
        <span class="subvalue" v-if="subvalue !== null">{{ subvalue }} %</span>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: { type: String, required: true },
  value: { type: [Number, String], required: true },
  sublabel: { type: String, default: '' },
  subvalue: { type: [Number, String, null], default: null },
  /* tone 키: blue/green/orange/purple/cyan/yellow/red/indigo/pink/gray */
  tone: { type: String, default: 'gray' }
})

const displayValue = computed(() => (props.value ?? 0))

/* 톤 클래스 계산 */
const toneClass = computed(() => `tone-${(typeof props.tone === 'string' ? props.tone : 'gray')}`)
</script>

<style scoped>
/* ===== 카드 기본 ===== */
.card{
  /* 레이아웃: 아이콘 28px + 텍스트 */
  display: grid;
  grid-template-columns: 28px 1fr;
  column-gap: 14px;

  /* 여백: 스샷처럼 공간 넉넉히 */
  padding: 22px;

  /* 둥근 정도 크게 */
  border-radius: 18px;

  /* 파스텔 배경은 tone-* 클래스에서 채워짐, 기본 톤은 아주 엷은 회색 */
  background: #f7f9fb;
  border: 1px solid rgba(0,0,0,0.04);

  /* 그림자: 퍼짐은 넓고, 투명하게; 파스텔 질감 */
  box-shadow: 0 6px 18px rgba(17, 24, 39, 0.04);

  /* 텍스트 컬러는 tone-*에서 바꿈 */
  color: #374151;
}

/* 아이콘: 위쪽 살짝 내려오게 정렬 */
.icon-wrap{
  display:flex;
  align-items:flex-start;
  justify-content:center;
  padding-top: 4px;
  color: inherit;
}

/* 텍스트 컬럼 */
.texts{ display:flex; flex-direction:column; gap:8px; }

/* 상단 라벨(연한 회색) */
.title{
  font-size: 15px;
  font-weight: 600;
  color:#6b7280;
}

/* 메인 값: 또렷 & 크게 */
.value{
  font-size: 34px;
  font-weight: 800;
  line-height: 1.0;
  letter-spacing: -0.5px;
}

/* 보조줄(두 요소 간 살짝 간격) */
.sub{
  display:flex; gap:8px; align-items:center;
  margin-top: 6px;
}
.sublabel,.subvalue{ font-size: 14px; color:#6b7280; }

/* ===== 파스텔 톤 세트 ===== */
/* 각 톤은: 글자색(아이콘/수치) = 조금 더 진한 본색, 배경 = 매우 엷은 본색, 테두리 = 배경보다 살짝 진함 */
.tone-blue   { color:#1d4ed8; background:#f1f6ff; border-color:#e1ebff; }
.tone-green  { color:#0f766e; background:#eafaf7; border-color:#d3f4ec; }
.tone-orange { color:#c2410c; background:#fff3e8; border-color:#ffe3c9; }
.tone-purple { color:#6d28d9; background:#f6f1ff; border-color:#e7dcff; }
.tone-cyan   { color:#0e7490; background:#e9fbff; border-color:#d1f4ff; }
.tone-yellow { color:#a16207; background:#fff9e6; border-color:#ffefbf; }
.tone-red    { color:#b91c1c; background:#ffecec; border-color:#ffd6d6; }
.tone-indigo { color:#4338ca; background:#eef1ff; border-color:#dfe4ff; }
.tone-pink   { color:#be185d; background:#ffeaf4; border-color:#ffd2e8; }
.tone-gray   { color:#374151; background:#f7f9fb; border-color:rgba(0,0,0,0.05); }
</style>
