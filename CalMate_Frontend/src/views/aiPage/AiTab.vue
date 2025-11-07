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
        <div class="tab active">
          <div class="tab-text">식단 추천</div>
        </div>
        <div class="tab inactive">
          <div class="tab-text">운동 추천</div>
        </div>
      </div>
      <div class="tab-content-wrapper">
        <div class="content-header">
          <div class="icon-wrapper-20">
          </div>
          <div class="content-title">AI 추천 식단 플랜</div>
        </div>
        <div class="plan-wrapper">
          <div class="plan-card">
            <div class="plan-header">
              <div class="plan-title-info">
                <div class="plan-title-wrapper">
                  <div class="plan-title">균형잡힌 한식 플랜</div>
                </div>
                <div class="plan-info-wrapper">
                  <div class="plan-info">2095 kcal · 단백질 157g · 탄수화물 236g · 지방 58g</div>
                </div>
              </div>
              <div class="badge difficulty-easy">
                <div class="badge-text green">쉬움</div>
              </div>
            </div>
            <div class="meal-list">
              <div class="meal-card">
                <div class="meal-header">
                  <div class="badge time">
                    <div class="badge-text dark">아침</div>
                  </div>
                  <div class="meal-kcal-wrapper" style="width: 59.52px">
                    <div class="meal-kcal">629 kcal</div>
                  </div>
                </div>
                <div class="meal-items">
                  <div class="meal-item-wrapper">
                    <div class="meal-item-text">• 현미밥 (200g)</div>
                  </div>
                  <div class="meal-item-wrapper">
                    <div class="meal-item-text">• 된장찌개</div>
                  </div>
                  <div class="meal-item-wrapper">
                    <div class="meal-item-text">• 구운 계란 2개</div>
                  </div>
                  <div class="meal-item-wrapper">
                    <div class="meal-item-text">• 김치</div>
                  </div>
                  <div class="meal-item-wrapper">
                    <div class="meal-item-text">• 시금치나물</div>
                  </div>
                </div>
              </div>
              <div class="meal-card">
                <div class="meal-header">
                  <div class="badge time">
                    <div class="badge-text dark">점심</div>
                  </div>
                  <div class="meal-kcal-wrapper" style="width: 59.52px">
                    <div class="meal-kcal">838 kcal</div>
                  </div>
                </div>
                <div class="meal-items">
                  <div class="meal-item-wrapper">
                    <div class="meal-item-text">• 현미밥 (250g)</div>
                  </div>
                  <div class="meal-item-wrapper">
                    <div class="meal-item-text">• 닭가슴살 구이 (150g)</div>
                  </div>
                  <div class="meal-item-wrapper">
                    <div class="meal-item-text">• 샐러드</div>
                  </div>
                  <div class="meal-item-wrapper">
                    <div class="meal-item-text">• 미역국</div>
                  </div>
                </div>
              </div>
              <div class="meal-card">
                <div class="meal-header">
                  <div class="badge time">
                    <div class="badge-text dark">저녁</div>
                  </div>
                  <div class="meal-kcal-wrapper" style="width: 59.52px">
                    <div class="meal-kcal">524 kcal</div>
                  </div>
                </div>
                <div class="meal-items">
                  <div class="meal-item-wrapper">
                    <div class="meal-item-text">• 현미밥 (150g)</div>
                  </div>
                  <div class="meal-item-wrapper">
                    <div class="meal-item-text">• 생선구이 (120g)</div>
                  </div>
                  <div class="meal-item-wrapper">
                    <div class="meal-item-text">• 두부</div>
                  </div>
                  <div class="meal-item-wrapper">
                    <div class="meal-item-text">• 채소볶음</div>
                  </div>
                </div>
              </div>
              <div class="meal-card">
                <div class="meal-header">
                  <div class="badge time">
                    <div class="badge-text dark">간식</div>
                  </div>
                  <div class="meal-kcal-wrapper" style="width: 59.52px">
                    <div class="meal-kcal">105 kcal</div>
                  </div>
                </div>
                <div class="meal-items" style="height: 52px">
                  <div class="meal-item-wrapper">
                    <div class="meal-item-text">• 그릭요거트</div>
                  </div>
                  <div class="meal-item-wrapper">
                    <div class="meal-item-text">• 견과류 한 줌</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="plan-footer">
              <div class="icon-wrapper-16">
              </div>
              <div class="footer-text-wrapper">
                <div class="footer-text">주간 예상 감량: 0.5kg</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

</script>

<style scoped>
/* Inter 폰트 사용을 가정합니다. */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap');

/* 기본 폰트 설정 */
div {
  font-family: 'Inter', sans-serif;
  word-wrap: break-word;
  box-sizing: border-box; /* 레이아웃 계산을 더 쉽게 만듭니다. */
}

.recommendation-page {
  width: 1271px;
  height: 3884px;
  padding-top: 32px;
  padding-left: 32px;
  padding-right: 32px;
  background: white;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 24px;
  display: inline-flex;
}

.recommendation-header {
  align-self: stretch;
  height: 54px;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
  display: inline-flex;
}

.icon-wrapper-24 {
  width: 24px;
  height: 24px;
  position: relative;
  overflow: hidden;
}

.header-text-wrapper {
  width: 319.95px;
  height: 54px;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  display: inline-flex;
}

.title-wrapper {
  align-self: stretch;
  height: 30px;
  position: relative;
}

.title {
  left: 0px;
  top: 0px;
  position: absolute;
  color: #0a0a0a;
  font-size: 20px;
  font-weight: 500;
  line-height: 30px;
}

.subtitle-wrapper {
  align-self: stretch;
  height: 24px;
  position: relative;
}

.subtitle {
  width:500px;
  left: 0px;
  top: -0.5px;
  position: absolute;
  color: #717182;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
}

.recommendation-content {
  align-self: stretch;
  height: 3742px;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 8px;
  display: flex;
}

.tabs-container {
  width: 951px;
  height: 36px;
  position: relative;
  background: #ececf0;
  border-radius: 14px;
}

.tab {
  width: 450px;
  height: 29px;
  padding-left: 8px;
  padding-right: 8px;
  padding-top: 4px;
  padding-bottom: 4px;
  top: 4px;
  position: absolute;
  border-radius: 14px;
  outline: 1px rgba(0, 0, 0, 0) solid;
  outline-offset: -1px;
  justify-content: center;
  align-items: center;
  gap: 6px;
  display: inline-flex;
  cursor: pointer; /* 탭이므로 클릭 가능하게 */
}

.tab.active {
  left: 3px;
  background: white;
}

.tab.inactive {
  left: 464px;
  background: transparent; /* 비활성 탭은 부모 배경색 사용 */
}

.tab-text {
  color: #0a0a0a;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
}

.tab-content-wrapper {
  width: 951px;
  flex: 1 1 0;
  position: relative;
  background: white;
  border-radius: 14px;
  outline: 1px rgba(0, 0, 0, 0.1) solid;
  outline-offset: -1px;
}

.content-header {
  width: 901px;
  height: 20px;
  left: 25px;
  top: 25px;
  position: absolute;
}

.icon-wrapper-20 {
  width: 20px;
  height: 20px;
  left: 0px;
  top: 0px;
  position: absolute;
  overflow: hidden;
}

.content-title {
  left: 28px;
  top: 1.5px;
  position: absolute;
  color: #0a0a0a;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
}

.plan-wrapper {
  width: 949px;
  height: 858px; /* auto가 더 좋을 수 있음 */
  padding-left: 24px;
  padding-right: 24px;
  left: 1px;
  top: 75px;
  position: absolute;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 16px;
  display: inline-flex;
}

.plan-card {
  align-self: stretch;
  height: auto; /* auto가 더 좋을 수 있음 */
  padding-top: 17px;
  padding-bottom: 1px;
  padding-left: 17px;
  padding-right: 17px;
  background: rgba(3, 2, 19, 0.05);
  border-radius: 10px;
  outline: 1px #030213 solid;
  outline-offset: -1px;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 12px;
  display: flex;
}

.plan-header {
  align-self: stretch;
  height: 48px;
  justify-content: space-between;
  align-items: flex-start;
  display: inline-flex;
}

.plan-title-info {
  width: 349.42px;
  height: 48px;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  display: inline-flex;
}

.plan-title-wrapper {
  align-self: stretch;
  height: 24px;
  position: relative;
}

.plan-title {
  left: 0px;
  top: -0.5px;
  position: absolute;
  color: #0a0a0a;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
}

.plan-info-wrapper {
  width: 825px; /* 부모보다 넓으므로 max-width 설정 고려 */
  max-width: 150%;
  height: 24px;
  position: relative;
}

.plan-info {
  width: 825px; /* 부모보다 넓으므로 max-width 설정 고려 */
  max-width: 150%;
  left: 0px;
  top: 0px;
  position: absolute;
  color: #717182;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
}

/* --- Badge --- */
.badge {
  height: 22px;
  padding-left: 8px;
  padding-right: 8px;
  padding-top: 2px;
  padding-bottom: 2px;
  overflow: hidden;
  border-radius: 8px;
  outline: 1px rgba(0, 0, 0, 0) solid;
  outline-offset: -1px;
  justify-content: center;
  align-items: center;
  gap: 4px;
  display: inline-flex;
}

.badge.selected {
  width: 49.14px;
  left: 127.1px;
  top: 1px;
  position: absolute;
  background: #030213;
}

.badge.difficulty-easy {
  width: 38.77px;
  background: #dcfce7;
}

.badge.time {
  width: 38.77px;
  background: #eceef2;
}

.badge-text {
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
}

.badge-text.white {
  color: white;
}

.badge-text.green {
  color: #008236;
}

.badge-text.dark {
  color: #030213;
}

/* --- Meal --- */
.meal-list {
  align-self: stretch;
  /* height: 636px; */ /* auto로 변경 */
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 8px;
  display: flex;
}

.meal-card {
  align-self: stretch;
  padding: 12px;
  background: #ececf0;
  border-radius: 4px;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 4px;
  display: flex;
}

.meal-header {
  align-self: stretch;
  height: 24px;
  justify-content: space-between;
  align-items: center;
  display: inline-flex;
}

.meal-kcal-wrapper {
  height: 24px;
  position: relative;
  /* width는 인라인으로 유지 (값이 모두 다름) */
}

.meal-kcal {
  left: 0px;
  top: -0.5px;
  position: absolute;
  color: #030213;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  white-space: nowrap; /* kcal 잘림 방지 */
}

.meal-items {
  align-self: stretch;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 4px;
  display: flex;
}

.meal-item-wrapper {
  align-self: stretch;
  height: 24px;
  position: relative;
}

.meal-item-text {
  left: 0px;
  top: 0px;
  position: absolute;
  color: #717182;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  width: auto; /* width 고정 제거 */
}

/* --- Plan Footer --- */
.plan-footer {
  align-self: stretch;
  height: 24px;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
  display: inline-flex;
}

.icon-wrapper-16 {
  width: 16px;
  height: 16px;
  position: relative;
  overflow: hidden;
}

.footer-text-wrapper {
  width: 140.12px;
  height: 24px;
  position: relative;
}

.footer-text {
  width: 296px; /* 텍스트가 길어질 수 있으므로 auto 또는 max-width 권장 */
  max-width: 150%;
  left: 0px;
  top: 0px;
  position: absolute;
  color: #030213;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
}
</style>
