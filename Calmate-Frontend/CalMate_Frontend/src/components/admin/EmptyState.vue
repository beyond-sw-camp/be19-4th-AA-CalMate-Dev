<!--
  파일 위치 제안: src/components/admin/EmptyState.vue
  역할: 데이터가 없을 때 표시하는 공통 컴포넌트
  - title / description / (선택) action 슬롯
-->
<template>
  <section class="empty">
    <!-- 심플한 아이콘 영역 -->
    <div class="icon">💬</div>
    <!-- 제목 -->
    <h3 class="title">{{ title }}</h3>
    <!-- 설명 -->
    <p class="desc">{{ description }}</p>
    <!-- (선택) 액션 영역: 버튼 등을 슬롯으로 받음 -->
    <div class="actions">
      <slot />
    </div>
  </section>
</template>

<script setup>
defineProps({
  title: { type: String, default: '내용이 없습니다' },        // 기본 타이틀
  description: { type: String, default: '표시할 항목이 없습니다.' } // 기본 설명
})
</script>

<style scoped>
.empty { 
  display: grid; place-items: center;
  gap: 8px; padding: 36px; border: 1px dashed #e5e7eb; 
  border-radius: 12px; background: #fafafa;
}
.icon { font-size: 28px; }
.title { font-weight: 700; }
.desc { color: #6b7280; }
.actions { margin-top: 6px; }
</style>
