<template>
  <div class="layout-wrapper">

    <!-- ✅ 왼쪽 사이드바 -->
    <header class="layout-sidebar">
      <headerComponent />
    </header>

    <!-- ✅ 메인 콘텐츠 -->
    <main class="layout-main">
      <RouterView />
    </main>

    <!-- ✅ 오른쪽 랭킹 -->
    <aside class="layout-aside">
      <CommunityRanking />
    </aside>

  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import headerComponent from '@/components/Header.vue'
import CommunityRanking from '@/components/CommunityRanking.vue'
</script>

<style scoped>
.layout-wrapper {
  display: grid;
  grid-template-columns: 260px 1fr 300px;
  height: 100vh;
  overflow: hidden;
}

/* 왼쪽 사이드바 */
.layout-sidebar {
  height: 100%;
  border-right: 1px solid #f0f0f3;
  background: white;
  position: sticky;
  top: 0;
  z-index: 20; /* ✅ 좌측은 그대로 */
}

/* 메인 */
.layout-main {
  padding: 24px;
  overflow-y: auto;
  background-color: #fafafa;
  position: relative; /* ✅ 메인이 위에 오도록 */
  z-index: 10;
}

/* 오른쪽 aside */
.layout-aside {
  padding: 24px;
  border-left: 1px solid #f0f0f3;
  background: #ffffff;
  overflow-y: auto;
  position: relative;
  z-index: 1; /* ✅ 가장 아래 레벨로 내려줌 */
}
</style>
