<template>
  <!-- 좌우 버튼 + 현재/전체 페이지 표기 -->
  <div class="pager">
    <button class="nav" :disabled="page <= 1" @click="$emit('change', page - 1)">이전</button>
    <span class="info">{{ page }} / {{ totalPages }}</span>
    <button class="nav" :disabled="page >= totalPages" @click="$emit('change', page + 1)">다음</button>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  page: { type: Number, required: true },       // 현재 페이지(1-base)
  pageSize: { type: Number, required: true },   // 페이지 크기
  total: { type: Number, required: true }       // 총 항목 수
})

/* 전체 페이지 수 계산 (최소 1) */
const totalPages = computed(() =>
  Math.max(1, Math.ceil(props.total / props.pageSize))
)
</script>

<style scoped>
.pager{
  display:flex; align-items:center; justify-content:center; gap:10px;
  padding: 10px 0;
}
.nav{
  padding: 8px 12px; border-radius: 10px; border:1px solid #e5e7eb; background:#fff; cursor:pointer;
}
.nav:disabled{ opacity:.5; cursor:not-allowed; }
.info{ font-size: 13px; color:#6b7280; }
</style>
