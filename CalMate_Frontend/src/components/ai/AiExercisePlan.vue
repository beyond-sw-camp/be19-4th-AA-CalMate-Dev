<template>
    <div class="ai-button" @click="exerciseAiRecommend">
      <div class="button-text">AI 추천 플랜</div>
    </div>

  <div class="plan-card" v-if="aiResponse">
    <div class="plan-header">
      <div class="plan-info">
        <div class="plan-title-wrapper">
          <div class="plan-title">{{ aiResponse.planTitle || '운동 플랜' }}</div>
        </div>
        <div class="plan-details-wrapper">
          <div class="plan-detail">{{ detailText }}</div>
        </div>
      </div>
    </div>
    <div class="plan-content">
      <div class="plan-type-card">
        <div class="plan-type-text">{{ aiResponse.planTypeText || '운동 유형' }}</div>
      <div class="plan-exercise-list">
        <div
            class="plan-exercise-item"
            v-for="(item, idx) in (aiResponse.planExerciseItem || [])"
            :key="idx"
          >
          <div class="plan-exercise-text">• {{ item }}</div>
        </div>
    </div>
      </div>
    </div>
  </div><div class="container" v-else>
        <img class="main-image" src="@/assets/images/ai/aidietbot.png" alt="AI 식단 추천 봇" />
        <div class="description">
          Calmate의 AI와 함께 당신에게 딱 맞는 건강 관리 플랜을 만나보세요!
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import api from '@/lib/api'
import { useLoadingStore } from '@/stores/loading'

const userStore = useUserStore();
const aiResponse = ref(null);
const aiExercisePlan = ref(null);
const loading = useLoadingStore();

onMounted(() => {
  const savedPlan = sessionStorage.getItem('aiExercisePlan');

  if (savedPlan) {
    aiResponse.value = JSON.parse(savedPlan);
  }
});

const exerciseAiRecommend = async () => {
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
        const response = await api.post('ai/exercise', payload, {timeout:35000});
        aiResponse.value = response.data;
        sessionStorage.setItem('aiExercisePlan', JSON.stringify(response.data));
        console.log('AI 추천 응답 저장 완료:', aiResponse.value);
    } catch (error) {
        console.error('AI 추천 요청 실패:', error);
    } finally {
        loading.stop(); 
    };
};

</script>

<style scoped>
.ai-button {
  position: absolute;
  top: 10px;
  right: 24px;
  z-index: 5;
  width: 154px;
  height: 40px;
  background: #030213;
  border-radius: 8px;
  cursor: pointer;
  display: flex; justify-content: center; align-items: center;
}
.button-text { color:#fff; font-size:16px; line-height:24px; font-weight:400; }

/* 컨테이너/카드 기본 (첫 번째와 동일 톤) */
.plan-card {
  align-self: stretch;
  padding: 16px;
  background: #ffffff;
  border-radius: 10px;
  outline: 1px #e0e0e0 solid;
  display: flex;
  flex-direction: column;
  gap: 12px;
}


.plan-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}
.plan-title { color:#030213; font-size:18px; font-weight:700; line-height:26px; }
.plan-detail { color:#717182; font-size:16px; line-height:24px; }

/* 운동 타입/리스트 카드 */
.plan-type-card {
  align-self: stretch;
  padding: 12px;
  background: #f4f4f7;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.plan-type-text { color:#030213; font-size:16px; font-weight:700; line-height:24px; }

/* 리스트 스타일을 식단 탭과 비슷하게 */
.plan-exercise-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.plan-exercise-item {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.plan-exercise-text {
  color:#363640;  /* 항목 제목색 */
  font-size:14px;
  line-height:20px;
}

/* ⬇️ 빈 상태(첫 번째 스샷과 동일하게 중앙·박스화) */
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background: #ffffff;
  border-radius: 10px;
  outline: 1px #e0e0e0 solid;
  gap: 16px;
  min-height: 300px;       /* 카드 높이감 */
}
.main-image {
  width: 150px;            /* 첫 번째와 동일 크기 */
  height: 150px;
  object-fit: contain;
}
.description {
  color: #717182;
  font-size: 16px;

  line-height: 24px;
  text-align: center;
}




</style>