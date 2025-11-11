<!--
  파일 위치 제안: src/components/admin/AdminTabs.vue
  역할: 상단 탭 내비게이션(대시보드/사용자/신고/문의)
  - items: [{ label, to }] 배열을 받아 router-link로 출력
-->
<template>
  <!-- 탭 바 전체 컨테이너 -->
  <nav class="tabs">
    <!-- 각 탭 항목을 순회 렌더링 -->
    <RouterLink
      v-for="it in items"
      :key="it.to"
      :to="it.to"
      class="tab"
      active-class="is-active"
    >
      <!-- 탭 라벨 텍스트 -->
      {{ it.label }}
    </RouterLink>
  </nav>
</template>

<script setup>
import { RouterLink } from 'vue-router';

/* props: items 배열만 받음 */
defineProps({
  items: {
    type: Array,
    required: true // [{ label: string, to: string }]
  }
})
</script>

<style scoped>
/* 탭 바: 밝은 배경 + 라운드 바 */
.tabs {
  display: flex;
  gap: 8px;
  background: #f3f4f6;
  padding: 6px;
  border-radius: 999px;       /* pill 모양 */
  border: 1px solid #e5e7eb;
  overflow-x: auto;
}

/* 개별 탭: pill 버튼 */
.tab {
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 14px;
  color: #6b7280;
  white-space: nowrap;
  transition: all .16s ease;
}

/* hover 시 색 변화 */
.tab:hover { background: #e5e7eb; color: #111827; }

/* 활성 탭: 진한 글자 + 흰 배경 + 그림자 */
.is-active {
  background: white;
  color: #111827;
  box-shadow: 0 1px 2px rgba(0,0,0,0.04);
  border: 1px solid #e5e7eb;
}
</style>
