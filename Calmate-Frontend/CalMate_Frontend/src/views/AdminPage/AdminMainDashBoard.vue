<template>
  <!-- 전체 래퍼: 가로 폭 제한 + 중앙 정렬 -->
  <section class="admin-wrap">
    <!-- 페이지 타이틀 -->
    <header class="page-header">
      <h1 class="title">관리자 페이지</h1>
      <p class="subtitle">시스템 관리 및 모니터링</p>
    </header>

    <!-- KPI 카드 그리드: 4열 → 반응형으로 3/2/1열 -->
    <section class="kpi-grid">
      <StatCard title="전체 사용자" :value="kpi.totalUsers" sublabel="활성:" :subvalue="kpi.totalActive" tone="blue">
        <template #icon>
          <svg viewBox="0 0 24 24" class="icon"><path d="M12 12c2.76 0 5-2.24 5-5S14.76 2 12 2 7 4.24 7 7s2.24 5 5 5zM4 20c0-3.31 4.03-6 8-6s8 2.69 8 6v1H4v-1z"/></svg>
        </template>
      </StatCard>

      <StatCard title="활성 사용자" :value="kpi.totalActive" sublabel="비율:" :subvalue="kpi.activeRate" tone="green">
        <template #icon>
          <svg viewBox="0 0 24 24" class="icon"><path d="M12 20a8 8 0 100-16 8 8 0 000 16zm-1-4l6-6-1.41-1.41L11 13.17l-2.59-2.58L7 12l4 4z"/></svg>
        </template>
      </StatCard>

      <StatCard title="대기중 신고" :value="kpi.pendingReports" sublabel="처리 필요" :subvalue="null" tone="orange">
        <template #icon>
          <svg viewBox="0 0 24 24" class="icon"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>
        </template>
      </StatCard>

      <StatCard title="대기중 문의" :value="kpi.pendingInquiries" sublabel="답변 필요" :subvalue="null" tone="purple">
        <template #icon>
          <svg viewBox="0 0 24 24" class="icon"><path d="M20 2H4a2 2 0 00-2 2v18l4-4h14a2 2 0 002-2V4a2 2 0 00-2-2z"/></svg>
        </template>
      </StatCard>

      <StatCard title="신규 가입 (7일)" :value="kpi.newUseres" tone="cyan">
        <template #icon>
          <svg viewBox="0 0 24 24" class="icon"><path d="M15 14c2.67 0 8 1.34 8 4v2H7v-2c0-2.66 5.33-4 8-4zM15 2a5 5 0 010 10 5 5 0 010-10zM4 8H2V6h2V4h2v2h2v2H6v2H4V8z"/></svg>
        </template>
      </StatCard>

      <StatCard title="정지된 회원" :value="kpi.suspendedUsers" tone="yellow">
        <template #icon>
          <svg viewBox="0 0 24 24" class="icon"><path d="M12 2a10 10 0 1010 10A10.011 10.011 0 0012 2zm5 11H7v-2h10z"/></svg>
        </template>
      </StatCard>

      <StatCard title="차단된 회원" :value="kpi.blockedUsers" tone="red">
        <template #icon>
          <svg viewBox="0 0 24 24" class="icon"><path d="M12 2a10 10 0 00-7.07 17.07L19.07 4.93A9.956 9.956 0 0012 2zm0 20a10 10 0 007.07-17.07L4.93 19.07A9.956 9.956 0 0012 22z"/></svg>
        </template>
      </StatCard>

      <StatCard title="전체 게시물" :value="kpi.totalPosts" tone="indigo">
        <template #icon>
          <svg viewBox="0 0 24 24" class="icon"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg>
        </template>
      </StatCard>

      <StatCard title="전체 포인트" :value="kpi.totalPoints" sublabel="P" :subvalue="null" tone="pink">
        <template #icon>
          <svg viewBox="0 0 24 24" class="icon"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm1 16h-2V7h2c2.76 0 5 2.24 5 5s-2.24 5-5 5z"/></svg>
        </template>
      </StatCard>
    </section>

    <!-- 탭 + 하위 라우트 -->
    <AdminTabs :items="tabs" class="tabs" />
    <section class="child-slot">
      <RouterView />
    </section>
  </section>
</template>

<script setup>
import { reactive , onMounted, ref} from 'vue'
import { RouterView } from 'vue-router'
import StatCard from '@/components/admin/StatCard.vue'
import AdminTabs from '@/components/admin/AdminTabs.vue'
import api from '@/lib/api'


const kpi = reactive({
  totalUsers: 0,
  totalActive: 0,
  activeUsers: 0,
  activeRate: 0,
  pendingReports: 0,
  pendingInquiries: 0,
  newUseres: 0,
  suspendedUsers: 0,
  blockedUsers: 0,
  totalPosts: 0,
  totalPoints: 0
})

const tabs = [
  { label: '대시보드',   to:  '/admin/main-dashboard/dashboard' },
  { label: '사용자 관리', to: '/admin/main-dashboard/users' },
  { label: '신고 관리',   to: '/admin/main-dashboard/reports' },
  { label: '문의 관리',   to: '/admin/main-dashboard/inquiries' }
]

// 대시보드 데이터 조회
onMounted(async () =>  {
  try{
    const response = 
      await api.get('/admin/dashboard');
    
    console.log(response.data);

    const {result} = response.data;
    
    kpi.totalUsers = result.responseData.totalMembers;
    kpi.totalActive = result.responseData.activeMembers;
    kpi.blockedUsers = result.responseData.blockedMembers;
    kpi.suspendedUsers = result.responseData.stopedMembers;
    kpi.newUseres = result.responseData.newMembers;
    kpi.activeRate = Math.round(kpi.totalActive / kpi.totalUsers * 100 * 100) / 100;

    kpi.totalPosts = result.dashboard.post;
    kpi.totalPoints = result.dashboard.point;
    kpi.pendingReports = result.dashboard.report;
    kpi.pendingInquiries = result.dashboard.qna;

  }
  catch (error)
  {
      // // 에러 처리
      // if (error.response) {
      //     console.error('❌ 서버 오류 코드:', error.response.status);
      //     console.error('❌ 오류 내용:', error.response.data);
      //     const errorMessage = error.response.status >= 500 ? 
      //     '서버 이상' : error.response.data.message;
      //     openModal(errorMessage,'로그인 실패', true);
      //     console.log('asdasd\n',errorMessage);
      // } else if (error.request) {
      //     // 요청은 갔지만 응답이 없을 때 (네트워크 문제 등)
      //     console.error('❌ 응답 없음:', error.request);
      // } else {
      //     // 기타 오류
      //     console.error('❌ 요청 설정 중 오류:', error.message);
      // }
  }
})




</script>

<style scoped>
/* 전체 패딩/폭: 스샷처럼 여백 넉넉하게 */
.admin-wrap { max-width: 1280px; margin: 0 auto; padding: 24px; }

/* 타이틀 영역 */
.page-header { margin-bottom: 8px; }
.title { font-size: 28px; font-weight: 800; letter-spacing: -0.2px; }
.subtitle { margin-top: 4px; color: #6b7280; }

/* 카드 그리드: 카드 간격을 크게, 좌우 정렬이 딱 맞도록 */
.kpi-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin-top: 8px;
}
@media (max-width: 1100px) { .kpi-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
@media (max-width: 860px)  { .kpi-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 520px)  { .kpi-grid { grid-template-columns: 1fr; } }

/* 탭 + 컨텐츠 영역 간격 */
.tabs { margin-top: 18px; }
.child-slot { margin-top: 14px; }

/* 공통 아이콘 크기(StatCard의 아이콘 슬롯에 적용) */
.icon { width: 22px; height: 22px; fill: currentColor; }
</style>
