<!--
  파일 위치(권장): src/pages/admin/AdminDashboard.vue
  역할: /admin/dashboard 라우트에 표시될 '대시보드' 본문.
       - 상단 KPI 카드는 부모(AdminLayout)에서 렌더링됨
       - 여기서는 하단 '최근 활동' 카드/리스트를 표시
-->
<template>
  <!-- 전체 대시보드 섹션을 감싸는 래퍼(가로폭은 부모에서 이미 제한됨) -->
  <section class="dash">

    <!-- 섹션 타이틀: '최근 활동' -->
    <h2 class="section-title">
      최근 활동
    </h2>

    <!-- 보조 설명: 회색 작게 -->
    <p class="section-desc">
      최근 시스템 활동 요약
    </p>

    <!-- 활동 카드들을 1열~2열 반응형 그리드로 배치 -->
    <div class="activity-grid">
      <!-- 활동 카드 #1: '일일 활성 사용자' (예시 수치 표시) -->
      <ActivityCard
        title="일일 활성 사용자"
        :value="todayActiveUsers"
        subtitle="오늘 활동한 사용자"
        tone="pink"
      >
        <!-- 아이콘 슬롯(간단한 SVG, 외부 라이브러리 없이 사용 가능) -->
        <template #icon>
          <!-- 차트/활성 느낌의 아이콘 -->
          <svg viewBox="0 0 24 24" class="icon">
            <path d="M3 17h2v2H3v-2zm4-4h2v6H7v-6zm4-6h2v12h-2V7zm4 8h2v4h-2v-4zm4-10h2v14h-2V5z"/>
          </svg>
        </template>
      </ActivityCard>

      <!-- 활동 카드 #2: '처리 대기 항목' (신고+문의 대기 합계) -->
      <ActivityCard
        title="처리 대기 항목"
        :value="pendingTotal"
        subtitle="신고 + 문의"
        tone="indigo"
      >
        <!-- 경고/알림 느낌의 아이콘 -->
        <template #icon>
          <svg viewBox="0 0 24 24" class="icon">
            <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
          </svg>
        </template>
      </ActivityCard>
    </div>

    <!-- (선택) 상세 목록 미리보기 영역: 데이터가 없으면 EmptyState 사용 -->
    <section class="preview">
      <!-- 미리보기 제목 -->
      <h3 class="preview-title">요약 목록</h3>

      <!-- 그리드: 좌측 '대기중 신고', 우측 '대기중 문의' -->
      <div class="preview-grid">
        <!-- 대기중 신고 표 형태 요약 -->
        <article class="panel">
          <header class="panel-head">
            <h4>대기중 신고</h4>
            <!-- 우측 링크 버튼(라우팅은 사용자가 구성) -->
            <RouterLink class="link" to="/admin/main-dashboard/reports">전체 보기</RouterLink>
          </header>

          <!-- 데이터가 없는 경우 공통 EmptyState 컴포넌트 표시 -->
          <EmptyState
            v-if="pendingReports.length === 0"
            title="신고가 없습니다"
            description="대기중인 신고 항목이 없습니다."
          />

          <!-- 데이터가 있는 경우 간단한 테이블로 3개만 미리보기 -->
          <table v-else class="mini-table">
            <thead>
              <tr>
                <th>신고자</th>
                <th>대상</th>
                <th>유형</th>
                <th>시간</th>
              </tr>
            </thead>
            <tbody>
              <!-- 앞에서 최대 3건까지만 노출 -->
              <tr v-for="row in pendingReports.slice(0, 3)" :key="row.id">
                <td>{{ row.reporter }}</td>
                <td>{{ row.target }}</td>
                <td>{{ row.type }}</td>
                <td>{{ row.when }}</td>
              </tr>
            </tbody>
          </table>
        </article>

        <!-- 대기중 문의 표 형태 요약 -->
        <article class="panel">
          <header class="panel-head">
            <h4>대기중 문의</h4>
            <RouterLink class="link" to="/admin/main-dashboard/inquiries">전체 보기</RouterLink>
          </header>

          <EmptyState
            v-if="pendingInquiries.length === 0"
            title="문의가 없습니다"
            description="대기중인 문의 항목이 없습니다."
          />

          <table v-else class="mini-table">
            <thead>
              <tr>
                <th>작성자</th>
                <th>제목</th>
                <th>상태</th>
                <th>시간</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in pendingInquiries.slice(0, 3)" :key="row.id">
                <td>{{ row.author }}</td>
                <td class="ellipsis">{{ row.title }}</td>
                <td>{{ row.status }}</td>
                <td>{{ row.when }}</td>
              </tr>
            </tbody>
          </table>
        </article>
      </div>
    </section>
  </section>
</template>

<script setup>
// <script setup> 구문 사용: import 및 상태 선언을 간결하게 작성
import { ref } from 'vue'                         // 반응형 원시값을 위해 ref 사용
import ActivityCard from '@/components/admin/ActivityCard.vue' // 재사용 소형 카드
import EmptyState from '@/components/admin/EmptyState.vue'     // 공통 빈상태

// [데모 데이터] 오늘 활성 사용자 수(실 데이터 연동 전까지 0으로 시작)
const todayActiveUsers = ref(0)

// [데모 데이터] 대기중 '신고' 목록(실제에선 API로 받아와서 대입)
const pendingReports = ref([
  // 예: { id: 1, reporter: '김철수', target: '스팸 게시물', type: '게시물', when: '33분 전' }
  // 이미지에 맞추고 싶다면 위 예시처럼 채워 사용하면 됨
])

// [데모 데이터] 대기중 '문의' 목록
const pendingInquiries = ref([
  // 예: { id: 1, author: '홍길동', title: '비밀번호 변경 문의', status: '대기중', when: '2시간 전' }
])

// '처리 대기 항목' 값은 신고 + 문의 대기 건수의 합
const pendingTotal = ref(0)

// [초기 계산] 위 데모 데이터 기반으로 합계를 맞춤
pendingTotal.value = (pendingReports.value?.length ?? 0) + (pendingInquiries.value?.length ?? 0)
</script>

<style scoped>
/* 전체 페이지 여백 */
.dash { margin-top: 10px; }

/* 섹션 타이틀(굵고 크게) */
.section-title { font-size: 18px; font-weight: 800; letter-spacing: -0.2px; }
/* 보조 설명(회색) */
.section-desc { margin-top: 6px; color: #6b7280; }

/* 상단 활동 카드 그리드: 2열 → 모바일 1열 */
.activity-grid{
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 14px;
}
@media (max-width: 720px){
  .activity-grid{ grid-template-columns: 1fr; }
}

/* 미리보기 섹션(패널 2개 그리드) */
.preview{ margin-top: 22px; }
.preview-title{ font-weight: 700; margin-bottom: 10px; }
.preview-grid{
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}
@media (max-width: 900px){
  .preview-grid{ grid-template-columns: 1fr; }
}

/* 패널: 연한 배경 + 보더 + 라운드 */
.panel{
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 14px;
  box-shadow: 0 4px 14px rgba(17,24,39,.04);
}

/* 패널 헤더: 좌측 제목, 우측 링크 */
.panel-head{
  display:flex; align-items:center; justify-content:space-between;
  margin-bottom: 10px;
}
.panel-head h4{ font-weight: 700; }
.link{
  font-size: 13px; color:#2563eb; padding: 6px 10px; border-radius: 999px;
  background:#eef4ff; border:1px solid #dde7ff; text-decoration: none;
}
.link:hover{ background:#e4ecff; }

/* 미니 테이블: 아주 간단한 스타일 */
.mini-table{ width:100%; border-collapse: collapse; }
.mini-table thead th{
  text-align:left; font-size: 12px; color:#6b7280; font-weight:600; padding: 8px 6px;
  border-bottom:1px solid #eef2f7;
}
.mini-table tbody td{
  padding:10px 6px; border-bottom:1px solid #f3f4f6; font-size: 14px;
}
/* 긴 제목은 한 줄 말줄임 */
.ellipsis{
  max-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}

/* 아이콘 크기(슬롯) */
.icon{ width:22px; height:22px; fill: currentColor; }
</style>
