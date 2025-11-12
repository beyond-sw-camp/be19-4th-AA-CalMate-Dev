<template>
  <div class="ai-diet-plan-container">
    <div class="ai-button" @click="handleAiRecommend">
      <div class="button-text">AI 추천 플랜</div>
    </div>

    <div class="plan-wrapper" v-if="aiResponse">
      <div class="plan-card">
        
        <div class="plan-header">
          <div class="plan-title-info">
            <div class="plan-title-wrapper">
              <div class="plan-title">균형잡힌 영양 식단</div>
            </div>
            <div class="plan-info-wrapper">
              <div class="plan-info">{{ aiResponse.summary.total_kcal }} kcal · 
                단백질 {{ aiResponse.summary.total_protein_g }}g · 
                지방 {{ aiResponse.summary.total_fat_g }}g</div>
            </div>
          </div>
        </div>
        
        <div class="meal-list">
          
          <template v-for="(meal, mealType) in aiResponse.plan_details" :key="mealType">
            
            <div 
              class="meal-card" 
              v-if="meal && meal.items && meal.items.length > 0"
            >
              <div class="meal-header">
                <div class="meal-type-wrapper"><div class="meal-type">{{ mealTypeKorean[mealType] }}</div></div>
                <div class="meal-kcal-wrapper"><div class="meal-kcal">{{ meal.total_kcal }} kcal</div></div>
              </div>

              <div class="item-list">
                <div class="item-card" v-for="(item, index) in meal.items" :key="index">
                  <div class="item-name-wrapper"><div class="item-name">{{ item.menu_name }}</div></div>
                  <div class="item-info-wrapper"><div class="item-info">{{ item.serving_g }}g · {{ item.kcal }} kcal</div></div>
                </div>
              </div>
            </div>
          </template> </div>
        
      </div>
    </div>

    <div class="container" v-else>
        <img class="main-image" src="@/assets/images/ai/aidietbot.png" alt="AI 식단 추천 봇" />
        <div class="description">
          Calmate의 AI와 함께 당신에게 딱 맞는 건강 관리 플랜을 만나보세요!
        </div>
    </div>
    
  </div> </template>

<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import api from '@/lib/api'
import { useLoadingStore } from '@/stores/loading'

const userStore = useUserStore();
const aiResponse = ref(null);
const dietPlan = ref(null);
const loading = useLoadingStore();

const mealTypeKorean = {
  breakfast: '아침',
  lunch: '점심',
  dinner: '저녁',
  snack: '간식',
};

onMounted(() => {
  const savedPlan = sessionStorage.getItem('aiDietPlan');

  if (savedPlan) {
    aiResponse.value = JSON.parse(savedPlan);
  }
});

const handleAiRecommend = async () => {
        const payload = {
        gender: userStore.gender,
        memberId: userStore.userId, 
        height: userStore.height,
        weight: userStore.weight,
        bodyMetric: userStore.bodyMetric
    };
    console.log("payload:", payload);

    try {
        console.log('AI 서버로 요청을 보냅니다:', payload);
        loading.start();
        const response = await api.post('http://localhost:8081/ai/diet', payload, {timeout:35000});
        console.log('AI summary:', response.data.summary);
        aiResponse.value = response.data;
        sessionStorage.setItem('aiDietPlan', JSON.stringify(response.data));
        console.log('AI 추천 응답 저장 완료:', aiResponse.value);
    } catch (error) {
        console.error('AI 추천 요청 실패:', error);
    } finally {
        loading.stop(); 
    };
};
</script>

<style scoped>
/* * 💡 [2번 요청사항]
 * AiTab.vue에서 가져온 '식단 플랜' 관련 CSS입니다.
 */
.ai-diet-plan-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;

  /* reset: 아래 네 줄이 핵심 */
  padding: 0;
  background: transparent;
  border-radius: 0;
  outline: none;

  /* 정렬도 부모 흐름을 그대로 따르도록 */
  align-items: stretch;
  justify-content: initial;
}

/* 1) 컨텐츠 헤더 */
.content-header {
  display: flex;
  align-items: center;
  gap: 4px;
}
.content-title {
  color: #030213;
  font-size: 18px;
  font-weight: 600;
  line-height: 26px;
}

/* 2) 플랜 카드 */
.plan-wrapper {
  display: flex;
  flex-direction: column;
}
.plan-card {
  align-self: stretch;
  padding: 16px;
  background: #ffffff;
  border-radius: 10px;
  outline: 1px #e0e0e0 solid; /* 원본 outline 수정 */
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 3) 플랜 상단 설명 */
.plan-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}
.plan-title-info {
  display: flex;
  flex-direction: column;
}
.plan-title {
  color: #030213;
  font-size: 18px;
  font-weight: 700;
  line-height: 26px;
}
.plan-info {
  color: #717182;
  font-size: 16px;
  line-height: 24px;
}

/* 4) 끼니별 리스트 */
.meal-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.meal-card {
  align-self: stretch;
  padding: 12px;
  background: #f4f4f7; /* 배경색 변경 */
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.meal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.meal-type {
  color: #030213;
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
}
.meal-kcal {
  color: #030213;
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  white-space: nowrap; /* 줄바꿈 방지 */
}

/* 5) 개별 메뉴 아이템 리스트 */
.item-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.item-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.item-name {
  color: #363640;
  font-size: 14px;
  line-height: 20px;
}
.item-info {
  color: #717182;
  font-size: 14px;
  line-height: 20px;
  white-space: nowrap; /* 줄바꿈 방지 */
}

.ai-button {
  position: absolute;
  top: 10px;        /* tab-content-wrapper의 내부 패딩(24px) 기준 */
  right: 24px;
  z-index: 5;

  width: 154px;
  height: 40px;
  background: #030213;
  border-radius: 8px;
  cursor: pointer;

  display: flex;
  justify-content: center;
  align-items: center;
}

.button-text {
  position: static;
  color: #fff;
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;
}

/* --- (기타 아이콘 래퍼 스타일 등) --- */
.icon-wrapper-20 { width: 20px; height: 20px; }

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