<template>
  <div class="recommendation-page">
    <div class="recommendation-header">
      <div class="icon-wrapper-24">
      </div>
      <div class="header-text-wrapper">
        <div class="title-wrapper">
          <div class="title">AI 맞춤 추천</div>
        </div>
        <div class="subtitle-wrapper">
          <div class="subtitle">당신의 기초대사량과 목표에 맞춘 식단 및 운동 추천</div>
        </div>
      </div>
    </div>
    <div class="recommendation-content">
      <div class="tabs-container">
        <router-link to="/main/ai/diet" class="tab" active-class="active">
          <div class="tab-text">식단 추천</div>
        </router-link>
        <router-link to="/main/ai/exercise" class="tab" active-class="active">
          <div class="tab-text">운동 추천</div>
        </router-link>
        </div>
      <div class="tab-content-wrapper">
        <div class="content-header">
          <div class="icon-wrapper-20">
          </div>
          <div class="content-title">AI 추천 플랜</div>
        </div>
        <div v-if="route.path === '/main/ai' || route.path === '/main/ai/'" class="container">
          <img class="main-image" src="@/assets/images/ai/aidietbot.png" alt="placeholder image" />
          <div class="description">
            Calmate의 AI와 함께 당신에게 딱 맞는 건강 관리 플랜을 만나보세요!
          </div>
        </div>
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { useUserStore } from '@/stores/user';
const userStore = useUserStore();
const route = useRoute();

const memberId = userStore.userId;
const memberGender = userStore.gender;
const memberWeight = userStore.weight;
const memberHeight = userStore.height;
const memberBodyMetrics = userStore.bodyMetrics;

</script>

<style scoped>

/* 1) 페이지 컨테이너: 고정폭 제거, 부모(main.content) 폭을 따르도록 */
.recommendation-page {
  width: 100%;
  max-width: 100%;          /* 필요하면 960~1200px 같은 max도 가능 */
  padding: 32px 20px;       /* main.content의 패딩(20px)과 조화 */
  background: white;
  display: flex;
  flex-direction: column;

  gap: 24px;
  box-sizing: border-box;
  margin: 0 auto;           /* 중앙 정렬 */
}

/* 2) 콘텐츠 래퍼: 부모 흐름을 그대로 따르기 */
.recommendation-content {
  width: 100%;
  display: flex;
  flex-direction: column;

  gap: 8px;

}

/* 3) 탭 바: 고정폭/absolute 제거 → grid로 2등분 */
.tabs-container {
  width: 100%;
  min-height: 36px;
  background: #ececf0;
  border-radius: 14px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  align-items: center;
  padding: 4px;
  box-sizing: border-box;
}

.tab {
  height: 28px;
  padding: 4px 8px;
  border-radius: 14px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  /* 💡 1. 밑줄 제거 */
  text-decoration: none; 
  /* 💡 2. <a> 태그의 기본 파란색을 무효화하고 부모 스타일 상속 */
  color: inherit;
}

.tab.active {

  background: white;
}

.tab:not(.active) {
  background: transparent;
}

/* 4) 탭 콘텐츠: absolute 제거, 내부 패딩으로 여백 확보 */
.tab-content-wrapper {
  width: 100%;
  background: white;
  border-radius: 14px;
  outline: 1px rgba(0, 0, 0, 0.1) solid;
  box-sizing: border-box;
  padding: 24px;        /* 기존 left/top 대신 패딩으로 */
  position: relative;     /* absolute → static */
}

/* 5) 헤더 라인: absolute 제거하고 좌우 정렬 */
.content-header {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;  /* 기존 top:25px 대체 */
  position: static;
}
.icon-wrapper-20 { position: static; }
.content-title {
  position: static;
  color: #0a0a0a;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
}

/* 6) 본문(플랜) 영역: absolute/고정 height 제거 */
.plan-wrapper {
  width: 100%;
  position: static;
  display: flex;
  flex-direction: column;

  gap: 16px;
  padding: 0;           /* 좌우 여백은 tab-content-wrapper가 담당 */
  height: auto;
  box-sizing: border-box;
}

/* 7) 카드/텍스트: stretch 유지하되 overflow 방지 */
.plan-card {
  align-self: stretch;
  padding: 17px;
  background: rgba(3, 2, 19, 0.05);
  border-radius: 10px;
  outline: 1px #030213 solid;
  outline-offset: -1px;

  display: flex;

  flex-direction: column;
  gap: 12px;
}

/* 8) 플랜 상단 설명: 고정폭 제거, 자동 줄바꿈 */
.plan-header { display: flex; align-items: flex-start; justify-content: space-between; }
.plan-title-info { height: auto; display: flex; flex-direction: column; }
.plan-title-wrapper { height: auto; position: static; }
.plan-title { position: static; }

.plan-info-wrapper,
.plan-info {
  width: auto;
  max-width: 100%;
  position: static;
  color: #717182;

  font-size: 16px;

  line-height: 24px;
}

/* 9) 식단 리스트는 기존 flex 흐름 유지 */
.meal-list { display: flex; flex-direction: column; gap: 8px; }
.meal-card { align-self: stretch; padding: 12px; background: #ececf0; border-radius: 4px; display: flex; flex-direction: column; gap: 4px; }
.meal-header { display: flex; justify-content: space-between; align-items: center; }
.meal-kcal-wrapper { position: static; }
.meal-kcal { position: static; white-space: nowrap; }
.meal-items { display: flex; flex-direction: column; gap: 4px; }
.meal-item-wrapper { height: auto; position: static; }
.meal-item-text { position: static; color: #717182; }

/* 10) 기타 자잘한 절대/고정 치수 제거 */
.header-text-wrapper { height: auto; display: inline-flex; flex-direction: column; }
.title-wrapper, .subtitle-wrapper { height: auto; position: static; }
.title {
  color: #030213;
  font-size: 18px;
  font-weight: 700;
  line-height: 26px;
}
.subtitle { 
  color: #717182;
  font-size: 16px;

  line-height: 24px;
  position: static; 
}
.footer-text-wrapper { position: static; width: auto; }
.footer-text { position: static; max-width: 100%; }

.container {
  display: flex;
  flex-direction: column;
  align-items: center; /* 가운데 정렬 */
  justify-content: center; /* 가운데 정렬 */
  padding: 40px 20px;
  background: #ffffff;
  border-radius: 10px;
  outline: 1px #e0e0e0 solid;
  gap: 16px;
  min-height: 300px; /* 적절한 최소 높이 */
}
.main-image {
  width: 150px; /* 이미지 크기 (조절 필요) */
  height: 150px; /* 이미지 크기 (조절 필요) */
  object-fit: contain;
}
.description {
  color: #717182;
  font-size: 16px;

  line-height: 24px;
  text-align: center;
}

</style>
