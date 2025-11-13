<!--
  파일 경로(권장): src/pages/admin/AdminInquiries.vue
  역할: /admin/inquiries 라우트에 표시되는 '문의 관리' 화면의 본문
       - 검색/필터/테이블/페이지네이션/개별·일괄 작업/답변 모달/확인 모달 포함
-->
<template>
  <!-- 최상위 래퍼: 부모(AdminLayout)에서 폭 제한, 여기서는 상하 여백 중심 -->
  <section class="inq-wrap">
    <!-- 섹션 제목 -->
    <h2 class="section-title">문의 관리</h2>
    <!-- 보조 설명 -->
    <p class="section-desc">사용자 문의 목록 및 응답 처리</p>

    <!-- 상단 툴바: 검색 + 상태/우선순위 필터 + 일괄 작업 -->
    <div class="toolbar">
      <!-- 좌측: 검색 인풋 묶음 -->
      <div class="search">
        <!-- 검색 입력창: 작성자/제목/내용 통합 검색 -->
        <input
          v-model.trim="query"
          type="search"
          class="search-input"
          placeholder="작성자/제목/내용 검색"
          @keyup.enter="applyFilters"
        />
        <!-- 검색 버튼: 클릭 시 필터 적용(페이지 1로 이동) -->
        <button class="btn" @click="applyFilters">검색</button>
        <!-- 초기화 버튼: 검색어와 필터를 기본값으로 리셋 -->
        <button class="btn ghost" @click="resetFilters">초기화</button>
      </div>

      <!-- 우측: 상태 + 우선순위 필터, 일괄 작업 버튼 -->
      <div class="filters">
        <!-- 상태 필터 라벨 -->
        <label class="filter-label">상태</label>
        <!-- 상태 셀렉트: all/pending/answered/closed -->
        <select v-model="status" class="select" @change="applyFilters">
          <option value="all">전체</option>
          <option value="pending">대기중</option>
          <option value="answered">답변완료</option>
          <option value="closed">종료</option>
        </select>

        <!-- 우선순위 필터 라벨 -->
        <label class="filter-label">우선순위</label>
        <!-- 우선순위 셀렉트: all/low/normal/high -->
        <select v-model="priority" class="select" @change="applyFilters">
          <option value="all">전체</option>
          <option value="low">낮음</option>
          <option value="normal">보통</option>
          <option value="high">높음</option>
        </select>

      </div>
    </div>

    <!-- 테이블 패널(박스) -->
    <article class="panel">
      <!-- 데이터 없을 때: 공통 빈 상태 표시 -->
      <EmptyState
        v-if="pagedRows.length===0"
        title="문의가 없습니다"
        description="조건을 바꿔 다시 검색해 주세요."
      />

      <!-- 데이터 있을 때: 테이블 표시 -->
      <table v-else class="table">
        <thead>
          <tr>
            <!-- 작성자/제목/우선순위/상태/시간/작업 -->
            <th>작성자</th>
            <th>제목</th>
            <th>우선순위</th>
            <th>상태</th>
            <th>시간</th>
            <th style="width:200px;">작업</th>
          </tr>
        </thead>
        <tbody>
          <!-- 현재 페이지 행만 렌더링 -->
          <tr v-for="q in pagedRows" :key="q.id">

            <!-- 작성자(아바타 이니셜 + 이름) -->
            <td class="cell">
              <div class="avatar">{{ initials(q.author) }}</div>
              <div class="main">{{ q.author }}</div>
            </td>

            <!-- 제목(말줄임) -->
            <td class="ellipsis" :title="q.title">{{ q.title }}</td>

            <!-- 우선순위 배지(공통 컴포넌트) -->
            <td><PriorityBadge :priority="q.priority" /></td>

            <!-- 상태 배지(공통 컴포넌트) -->
            <td><InquiryStatusBadge :status="q.status" /></td>

            <!-- 시간(상대 표기 예: 2시간 전) -->
            <td>{{ q.when }}</td>

            <!-- 작업 버튼: 보기/답변 -->
            <td>
              <div class="actions">
                <!-- 상세보기 (회원 페이지의 상세 보기로 이동) -->
                <button
                  class="btn xs"
                  @click="viewDetail(q.id)"
                >보기</button>

                <!-- 답변 등록/수정 -->
                <button
                  class="btn xs success"
                  @click="openReply(q)"
                >답변</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- 페이지네이션: 공통 간단 컴포넌트 -->
      <PaginationLite
        v-if="rows.length > pageSize"
        :page="page"
        :page-size="pageSize"
        :total="filtered.length"
        @change="(p)=>page=p"
      />
    </article>

    <!-- 답변 모달: 본문 입력 + 전송 -->
    <ReplyModal
      v-if="reply.open"
      :title="`문의 답변: #${reply.target?.id}`"
      :question="reply.target?.title || ''"
      :content="reply.content"
      @update:content="(v)=>reply.content=v"
      @cancel="reply.open=false"
      @submit="submitReply"
    />

  </section>
</template>

<script setup>
// Vue 구성요소/도구 임포트
import { ref, computed, onMounted } from 'vue'                   // 반응형 상태와 계산 속성
import { useRouter } from 'vue-router'
import { useToast } from '@/lib/toast.js'
import EmptyState from '@/components/admin/EmptyState.vue'       // 빈 상태 공통
import PaginationLite from '@/components/admin/PaginationLite.vue' // 페이지네이션 공통
import ReplyModal from '@/components/admin/ReplyModal.vue'         // 답변 입력 모달
import InquiryStatusBadge from '@/components/admin/InquiryStatusBadge.vue' // 상태 배지 공통
import PriorityBadge from '@/components/admin/PriorityBadge.vue'            // 우선순위 배지 공통
import { getQnaList, createQnaComment, updateQnaComment } from '@/api/qna'

const router = useRouter()
const { success, error: toastError } = useToast()

/* =========================================
   1) 검색/필터/페이징 상태
========================================= */
// 검색어(작성자/제목/내용)
const query = ref('')                    // 입력과 양방향 바인딩
// 상태 필터: all/pending/answered/closed
const status = ref('all')                // 드롭다운 선택 값
// 우선순위 필터: all/low/normal/high
const priority = ref('all')              // 드롭다운 선택 값
// 현재 페이지(1-base)
const page = ref(1)                      // 페이지네이션 현재 페이지
// 페이지 당 행 수
const pageSize = 10                      // 고정 페이지 크기

/* =========================================
   2) 목록 데이터(API에서 로드)
========================================= */
// 각 항목: { id, author, title, content, priority, status, when, comments }
const rows = ref([])
const isLoading = ref(false)

// API에서 Q&A 목록 로드
async function loadQnaList() {
  isLoading.value = true
  try {
    const res = await getQnaList({ limit: 100, offset: 0 })
    const data = res?.data || []

    rows.value = data.map(item => {
      // 관리자(memberId=2)의 답변 여부 확인
      const hasAnswer = item.comments?.some(c =>
        String(c.memberId) === '2' && (!c.parentCommentId || Number(c.parentCommentId) === 0)
      )

      return {
        id: item.id,
        author: item.memberId ? `회원${item.memberId}` : '일반회원',
        title: item.title,
        content: item.contents,
        priority: 'normal', // 우선순위는 추후 필요시 백엔드에서 제공
        status: hasAnswer ? 'answered' : 'pending',
        when: timeAgo(item.createdAt),
        createdAt: item.createdAt,
        comments: item.comments || []
      }
    })
  } catch (e) {
    console.error('Failed to load QnA list', e)
    toastError('문의 목록을 불러오는데 실패했습니다')
  } finally {
    isLoading.value = false
  }
}

// 컴포넌트 마운트 시 데이터 로드
onMounted(() => {
  loadQnaList()
})


/* =========================================
   3) 파생 데이터(검색/필터/페이징)
========================================= */
// 검색/필터 반영된 배열
const filtered = computed(() => {
  const q = query.value.toLowerCase().trim()                               // 검색어 전처리
  return rows.value.filter(r => {
    const statusOk   = status.value==='all'   ? true : r.status===status.value     // 상태 필터 통과 여부
    const priorityOk = priority.value==='all' ? true : r.priority===priority.value // 우선순위 필터 통과 여부
    const searchOk   = !q || [r.author, r.title, r.content]                         // 검색 대상 컬럼들
      .some(v => String(v).toLowerCase().includes(q))                               // 하나라도 포함되면 통과
    return statusOk && priorityOk && searchOk                                      // 모두 만족해야 남김
  })
})
// 현재 페이지 시작/끝 인덱스
const start = computed(() => (page.value-1)*pageSize)               // 0-base 시작
const end   = computed(() => start.value + pageSize)                // 0-base 끝(미포함)
// 현재 페이지에 노출할 행들
const pagedRows = computed(() => filtered.value.slice(start.value, end.value)) // slice로 분할

/* =========================================
   4) 검색/리셋 처리
========================================= */
// 검색 적용: 파생계산이라 페이지만 1로 리셋
function applyFilters(){ page.value = 1 }                            // 첫 페이지로 이동
// 초기화: 검색어/필터를 초기값으로 되돌림
function resetFilters(){ query.value=''; status.value='all'; priority.value='all'; page.value=1 } // 초기화

/* =========================================
   5) 답변 모달(작성/전송)
========================================= */
// 답변 모달 상태 객체
const reply = ref({
  open: false,                 // 모달 열림 여부
  target: null,                // 대상 문의 객체
  content: ''                  // 작성 중인 답변 본문
})
// 상세보기 (회원 페이지로 이동)
function viewDetail(qnaId) {
  router.push(`/main/qna/${qnaId}`)
}

// 답변 모달 열기
function openReply(row){
  reply.value.open = true              // 모달 표시
  reply.value.target = row            // 대상 설정

  // 기존 답변이 있으면 로드
  const adminComment = row.comments?.find(c =>
    String(c.memberId) === '2' && (!c.parentCommentId || Number(c.parentCommentId) === 0)
  )
  reply.value.content = adminComment?.comment || '' // 기존 답변 또는 빈 문자열
}
// 답변 전송
async function submitReply(){
  const q = reply.value.target
  if(!q) return

  const content = (reply.value.content || '').trim()
  if (!content) {
    toastError('답변 내용을 입력해주세요')
    return
  }

  try {
    const adminMemberId = 2 // 관리자 계정 ID

    // 기존 답변 찾기
    const adminComment = q.comments?.find(c =>
      String(c.memberId) === '2' && (!c.parentCommentId || Number(c.parentCommentId) === 0)
    )

    if (adminComment) {
      // 기존 답변 수정
      await updateQnaComment({ commentId: adminComment.id, comment: content })
      success('답변이 수정되었습니다')
    } else {
      // 새 답변 등록
      await createQnaComment({
        qnaId: q.id,
        memberId: adminMemberId,
        comment: content,
        parentCommentId: null
      })
      success('답변이 등록되었습니다')
    }

    // 목록 새로고침
    await loadQnaList()
    reply.value.open = false
  } catch (e) {
    console.error('Reply submit failed', e)
    toastError('답변 저장 중 오류가 발생했습니다')
  }
}

/* =========================================
   6) 유틸: 이니셜(아바타) + 시간 계산
========================================= */
// 이름에서 앞 글자 2개 추출(한글/영문 공통)
function initials (name) {
  if (!name) return 'U'                                     // fallback
  const parts = String(name).trim().split(/\s+/)            // 공백으로 분할
  if (parts.length === 1) return parts[0].slice(0, 2)       // 단일어: 앞 2자
  return parts[0].slice(0, 1) + parts[1].slice(0, 1)        // 복합어: 각 1자씩
}

// 시간 경과 표시 (예: "2시간 전", "어제")
function timeAgo(ts) {
  try {
    const t = new Date(ts).getTime()
    const diff = Math.floor((Date.now() - t) / 1000)
    if (diff < 60) return '방금 전'
    if (diff < 3600) return `${Math.floor(diff / 60)}분 전`
    if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`
    if (diff < 172800) return '어제'
    if (diff < 604800) return `${Math.floor(diff / 86400)}일 전`
    return `${Math.floor(diff / 604800)}주 전`
  } catch {
    return String(ts)
  }
}
</script>

<style scoped>
/* 레이아웃 상단 여백 */
.inq-wrap { margin-top: 10px; }

/* 제목/설명 */
.section-title { font-size: 18px; font-weight: 800; letter-spacing: -0.2px; }
.section-desc { margin-top: 6px; color: #6b7280; }

/* 툴바 레이아웃 */
.toolbar{
  margin-top: 14px;
  display: flex; gap: 12px; align-items: center; justify-content: space-between;
  flex-wrap: wrap;
}

/* 검색 입력 묶음 */
.search{ display: flex; gap: 8px; flex: 1 1 520px; }
.search-input{
  flex: 1 1 auto; min-width: 220px;
  padding: 10px 12px; border-radius: 12px; border: 1px solid #e5e7eb;
  background: #fff; outline: none;
}
.search-input:focus{ border-color: #cbd5e1; box-shadow: 0 0 0 3px rgba(37,99,235,.08); }

/* 필터 묶음 */
.filters{ display: flex; gap: 8px; align-items: center; }
.filter-label{ font-size: 14px; color:#6b7280; }
.select{
  padding: 10px 12px; border-radius: 12px; border: 1px solid #e5e7eb; background:#fff;
}

/* 버튼 스타일 */
.btn{
  padding: 10px 14px; border-radius: 12px; border: 1px solid #dde7ff;
  background: #eef4ff; color: #1d4ed8; font-weight: 600; cursor: pointer;
}
.btn:hover{ background:#e4ecff; }
.btn.ghost{ background:#fff; color:#374151; border-color:#e5e7eb; }
.btn.xs{ padding: 6px 10px; border-radius: 10px; font-size: 12px; }
.btn.warn{ background:#fff7ed; border-color:#ffedd5; color:#c2410c; }
.btn.danger{ background:#ffebeb; border-color:#ffd6d6; color:#b91c1c; }
.btn.danger:disabled{ opacity:.5; cursor:not-allowed; }
.btn.success{ background:#eafaf7; border-color:#d3f4ec; color:#0f766e; }

/* 패널 박스 */
.panel{
  margin-top: 12px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 10px;
  box-shadow: 0 4px 14px rgba(17,24,39,.04);
}

/* 테이블 */
.table{ width: 100%; border-collapse: collapse; }
.table thead th{
  text-align: left; font-size: 12px; color:#6b7280; font-weight: 700;
  padding: 10px 8px; border-bottom: 1px solid #eef2f7;
}
.table tbody td{ padding: 12px 8px; border-bottom: 1px solid #f3f4f6; }

/* 셀(아바타+텍스트) */
.cell{ display:flex; align-items:center; gap:10px; min-width:0; }
.avatar{
  width: 28px; height: 28px; border-radius: 999px;
  display: grid; place-items: center;
  background: #eef4ff; color: #1d4ed8; font-weight: 800; font-size: 12px;
  border: 1px solid #dde7ff;
}
.main{ font-weight: 700; min-width: 0; }
.ellipsis{ max-width: 360px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

/* 작업 버튼 묶음 */
.actions{ display:flex; gap:6px; flex-wrap:wrap; }
</style>
