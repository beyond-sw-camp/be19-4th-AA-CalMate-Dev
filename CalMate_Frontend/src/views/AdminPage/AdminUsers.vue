<!--
  파일 경로(권장): src/pages/admin/AdminUsers.vue
  역할: /admin/users 라우트로 진입했을 때 표시되는 사용자 관리 화면의 본문
       - 상단 KPI 카드는 부모(AdminLayout)에서 렌더링되므로, 여기선 리스트/검색/필터/액션만 담당
-->
<template>
  <!-- 전체 컨테이너: 부모에서 이미 좌우 폭을 제한했으므로 내부 여백만 관리 -->
  <section class="users-wrap">
    <!-- 섹션 제목 -->
    <h2 class="section-title">사용자 관리</h2>
    <!-- 보조 설명 -->
    <p class="section-desc">전체 사용자 목록 및 관리</p>

    <!-- 검색/필터 바: 좌측 검색, 우측 상태 필터 -->
    <div class="toolbar">
      <!-- 검색 입력: 이름/이메일로 검색 -->
      <div class="search">
        <!-- v-model로 양방향 바인딩하여 입력값을 상태에 보관 -->
        <input
          v-model.trim="query"
          type="search"
          class="search-input"
          placeholder="사용자 검색 (이름, 이메일)"
          @keyup.enter="applyFilters"  
        />
        <!-- 적용 버튼: 모바일에서도 명확히 동작하도록 별도 버튼 제공 -->
        <button class="btn" @click="applyFilters">검색</button>
        <!-- 초기화 버튼: 입력과 필터를 모두 기본값으로 되돌림 -->
        <button class="btn ghost" @click="resetFilters">초기화</button>
      </div>

      <!-- 상태 필터: 전체/활성/정지/차단 -->
      <div class="filters">
        <label class="filter-label">상태</label>
        <select v-model="status" class="select" @change="applyFilters">
          <option value="all">전체</option>
          <option value="active">활성</option>
          <option value="suspended">정지</option>
          <option value="blocked">차단</option>
        </select>
      </div>
    </div>

    <!-- 데이터 테이블 패널 -->
    <article class="panel">
      <!-- 테이블이 비었을 때의 빈 상태 처리 -->
      <EmptyState
        v-if="pagedRows.length === 0"
        title="사용자가 없습니다"
        description="조건을 바꿔 다시 검색해 주세요."
      />

      <!-- 데이터가 있을 때만 테이블 표시 -->
      <table v-else class="table">
        <thead>
          <tr>
            <th>사용자</th>      <!-- 이름(닉네임) -->
            <th>이메일</th>      <!-- 이메일 -->
            <th>상태</th>        <!-- active/suspended/blocked -->
            <th>가입일</th>      <!-- 가입일 -->
            <th>게시물</th>      <!-- 게시물 수 -->
            <th>포인트</th>      <!-- 포인트 -->
            <th style="width:140px">작업</th> <!-- 보기/정지/차단 버튼 -->
          </tr>
        </thead>
        <tbody>
          <!-- 현재 페이지에 해당하는 행만 렌더링 -->
          <tr v-for="u in pagedRows" :key="u.id">
            <!-- 사용자 이름/닉네임 -->
            <td>
              <div class="user-cell">
                <!-- 간단한 아바타 이니셜 (의존성 없이 구현) -->
                <div class="avatar">{{ initials(u.name) }}</div>
                <div class="name">{{ u.name }}</div>
              </div>
            </td>

            <!-- 이메일 -->
            <td>{{ u.email }}</td>

            <!-- 상태 배지: 재사용 컴포넌트로 색상/라벨 통일 -->
            <td><StatusBadge :status="u.status" /></td>

            <!-- 가입일: 간단한 날짜 문자열 -->
            <td>{{ u.joined }}</td>

            <!-- 게시물 수 -->
            <td>{{ u.posts }}</td>

            <!-- 포인트 -->
            <td>{{ u.points }}</td>

            <!-- 작업 버튼들 -->
            <td>
              <div class="actions">
                <!-- 보기: 상세 페이지로 라우팅(링크만; 실제 라우트는 사용자가 구성) -->
                <RouterLink class="btn xs" :to="`/admin/users/${u.id}`">보기</RouterLink>

                <!-- 정지/해제 토글: 상태에 따라 라벨 바뀜 -->
                <button
                  class="btn xs warn"
                  @click="openConfirm(u, u.status === 'suspended' ? 'unsuspend' : 'suspend')"
                >
                  {{ u.status === 'suspended' ? '정지 해제' : '정지' }}
                </button>

                <!-- 차단/해제 토글 -->
                <button
                  class="btn xs danger"
                  @click="openConfirm(u, u.status === 'blocked' ? 'unblock' : 'block')"
                >
                  {{ u.status === 'blocked' ? '차단 해제' : '차단' }}
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- 하단 페이지네이션: 재사용 컴포넌트 -->
      <PaginationLite
        v-if="rows.length > pageSize"
        :page="page"
        :page-size="pageSize"
        :total="filtered.length"
        @change="(p) => page = p"
      />
    </article>

    <!-- 확인 모달: 정지/차단 등 파괴적 작업 전에 사용자 확인 -->
    <ConfirmModal
      v-if="confirm.open"
      :title="confirm.title"
      :message="confirm.message"
      :ok-text="confirm.okText"
      :cancel-text="'취소'"
      @ok="applyAction"
      @cancel="confirm.open = false"
    />
  </section>
</template>

<script setup>
// 컴포지션 API에서 사용할 도구 임포트
import { computed, ref } from 'vue'                       // 반응형 변수(ref)와 파생값(computed) 사용
import EmptyState from '@/components/admin/EmptyState.vue'// 공통 빈 상태 컴포넌트
import StatusBadge from '@/components/admin/StatusBadge.vue' // 상태 배지(색상/라벨 공통)
import PaginationLite from '@/components/admin/PaginationLite.vue' // 간단 페이지네이션
import ConfirmModal from '@/components/admin/ConfirmModal.vue'     // 확인 모달

/* ---------------------------
   1) 조회/필터 상태
----------------------------*/
// 검색어(이름/이메일)
const query = ref('')                         // 입력창과 양방향 바인딩
// 상태 필터 (all/active/suspended/blocked)
const status = ref('all')                     // 드롭다운과 양방향 바인딩
// 페이지네이션 상태: 현재 페이지(1부터 시작)와 페이지 크기
const page = ref(1)                           // 현재 페이지
const pageSize = 10                           // 페이지 당 행 개수(고정)

/* ---------------------------
   2) 목록 데이터 (데모용)
   실제로는 API로 교체하면 됨
----------------------------*/
const rows = ref([
  // id: 고유키 / name: 이름 / email / status: 'active'|'suspended'|'blocked'
  // joined: 가입일 / posts: 게시물 수 / points: 포인트
  // ▼ 데모 데이터 몇 줄(필요시 삭제 후 API 대입)
  { id: 1, name: '김철수', email: 'chulsoo@example.com', status: 'active',    joined: '2025-02-01', posts: 2,  points: 30 },
  { id: 2, name: '이영희', email: 'younghee@example.com', status: 'suspended', joined: '2025-01-15', posts: 0,  points: 12 },
  { id: 3, name: '박민수', email: 'minsu@example.com',    status: 'blocked',   joined: '2024-12-22', posts: 11, points: 120 },
  { id: 4, name: '홍길동', email: 'gildong@example.com',  status: 'active',    joined: '2024-11-03', posts: 5,  points: 45 },
  { id: 5, name: '홍길동', email: 'gildong@example.com',  status: 'active',    joined: '2024-11-03', posts: 5,  points: 45 },
  { id: 6, name: '홍길동', email: 'gildong@example.com',  status: 'active',    joined: '2024-11-03', posts: 5,  points: 45 },
  { id: 7, name: '홍길동', email: 'gildong@example.com',  status: 'active',    joined: '2024-11-03', posts: 5,  points: 45 },
  { id: 8, name: '홍길동', email: 'gildong@example.com',  status: 'active',    joined: '2024-11-03', posts: 5,  points: 45 },
  { id: 9, name: '홍길동', email: 'gildong@example.com',  status: 'active',    joined: '2024-11-03', posts: 5,  points: 45 },
  { id: 10, name: '홍길동', email: 'gildong@example.com',  status: 'active',    joined: '2024-11-03', posts: 5,  points: 45 },
  { id: 11, name: '홍길동', email: 'gildong@example.com',  status: 'active',    joined: '2024-11-03', posts: 5,  points: 45 },
  { id: 12, name: '홍길동', email: 'gildong@example.com',  status: 'active',    joined: '2024-11-03', posts: 5,  points: 45 },
  { id: 13, name: '홍길동', email: 'gildong@example.com',  status: 'active',    joined: '2024-11-03', posts: 5,  points: 45 },
  { id: 14, name: '홍길동', email: 'gildong@example.com',  status: 'active',    joined: '2024-11-03', posts: 5,  points: 45 },
])

/* ---------------------------
   3) 파생 데이터(필터링/페이징)
----------------------------*/
// 검색 + 상태값을 모두 반영한 결과 배열
const filtered = computed(() => {
  // 소문자 비교를 위한 전처리
  const q = query.value.toLowerCase().trim()
  const s = status.value
  return rows.value.filter(r => {
    // 상태 필터(전체가 아니면 일치 항목만 통과)
    const statusOk = s === 'all' ? true : r.status === s
    // 검색 필터(공백이면 통과, 아니면 이름/이메일 중 하나라도 포함)
    const searchOk = !q || r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q)
    return statusOk && searchOk
  })
})

// 현재 페이지에 보여줄 시작/끝 인덱스 계산
const start = computed(() => (page.value - 1) * pageSize) // 0-based 시작 인덱스
const end = computed(() => start.value + pageSize)        // 0-based 끝 인덱스(미포함)

// 실제 렌더링에 쓰는 '현재 페이지 행들'
const pagedRows = computed(() => filtered.value.slice(start.value, end.value))

/* ---------------------------
   4) 동작 함수들
----------------------------*/
// 엔터/버튼 클릭 시 필터 적용: 현재는 파생(computed)로 자동 반영되므로 페이지를 1로만 리셋
function applyFilters () {
  page.value = 1 // 검색/필터 변경 시 첫 페이지로 이동
}

// 초기화: 입력과 상태 필터를 기본값으로 되돌리고 1페이지로
function resetFilters () {
  query.value = ''
  status.value = 'all'
  page.value = 1
}

// 이름에서 아바타용 이니셜 2글자 뽑기(한글 대응)
function initials (name) {
  if (!name) return 'U'                         // 이름 없을 때 기본 U
  const parts = String(name).trim().split(/\s+/)// 공백 기준 분리(영문 이름 대응)
  if (parts.length === 1) return parts[0].slice(0, 2) // 단일어면 앞 2자
  return parts[0].slice(0, 1) + parts[1].slice(0, 1)  // 복합어면 앞 글자 2개
}

/* ---------------------------
   5) 파괴적 작업(정지/차단) 확인 모달
----------------------------*/
// 모달에 표시할 정보 묶음
const confirm = ref({
  open: false,         // 모달 표시 여부
  user: null,          // 대상 사용자 객체
  action: null,        // 'suspend'|'unsuspend'|'block'|'unblock'
  title: '',           // 모달 제목
  message: '',         // 모달 본문
  okText: '확인'       // 확인 버튼 라벨
})

// 모달 열기: 대상/액션에 따라 문구를 꾸며서 confirm 상태에 채움
function openConfirm (user, action) {
  confirm.value.user = user
  confirm.value.action = action
  // 액션별 라벨/문구
  const dict = {
    suspend:   { t: '사용자 정지',  m: '해당 사용자를 정지하시겠습니까?',  ok: '정지' },
    unsuspend: { t: '정지 해제',    m: '해당 사용자의 정지를 해제할까요?', ok: '해제' },
    block:     { t: '사용자 차단',  m: '해당 사용자를 차단하시겠습니까?',  ok: '차단' },
    unblock:   { t: '차단 해제',    m: '해당 사용자의 차단을 해제할까요?', ok: '해제' },
  }
  const d = dict[action]
  confirm.value.title = d.t
  confirm.value.message = `${user.name} (${user.email})\n${d.m}`
  confirm.value.okText = d.ok
  confirm.value.open = true
}

// 모달 확인 클릭: 실제 데이터 수정(데모에선 로컬 배열 변경)
// 실제 환경에서는 이 지점에서 API 호출 → 성공 시 rows 갱신 권장
function applyAction () {
  const { user, action } = confirm.value
  if (!user || !action) return
  // 상태 전이 로직(데모용)
  if (action === 'suspend')   user.status = 'suspended'
  if (action === 'unsuspend') user.status = 'active'
  if (action === 'block')     user.status = 'blocked'
  if (action === 'unblock')   user.status = 'active'
  // 모달 닫기
  confirm.value.open = false
}
</script>

<style scoped>
/* 상단 여백 */
.users-wrap { margin-top: 10px; }

/* 제목/설명 */
.section-title { font-size: 18px; font-weight: 800; letter-spacing: -0.2px; }
.section-desc { margin-top: 6px; color: #6b7280; }

/* 툴바: 좌우 정렬, 반응형에서 세로 스택 */
.toolbar{
  margin-top: 14px;
  display: flex; gap: 12px; align-items: center; justify-content: space-between;
  flex-wrap: wrap;
}

/* 검색 박스 묶음(좌측) */
.search{ display: flex; gap: 8px; flex: 1 1 520px; }
.search-input{
  flex: 1 1 auto; min-width: 220px;
  padding: 10px 12px; border-radius: 12px; border: 1px solid #e5e7eb;
  background: #fff; outline: none;
}
.search-input:focus{ border-color: #cbd5e1; box-shadow: 0 0 0 3px rgba(37,99,235,.08); }

/* 필터 묶음(우측) */
.filters{ display: flex; gap: 8px; align-items: center; }
.filter-label{ font-size: 14px; color:#6b7280; }
.select{
  padding: 10px 12px; border-radius: 12px; border: 1px solid #e5e7eb; background:#fff;
}

/* 버튼 공통 */
.btn{
  padding: 10px 14px; border-radius: 12px; border: 1px solid #dde7ff;
  background: #eef4ff; color: #1d4ed8; font-weight: 600; cursor: pointer;
}
.btn:hover{ background:#e4ecff; }
.btn.ghost{ background:#fff; color:#374151; border-color:#e5e7eb; }
.btn.xs{ padding: 6px 10px; border-radius: 10px; font-size: 12px; }
.btn.warn{ background:#fff7ed; border-color:#ffedd5; color:#c2410c; }
.btn.warn:hover{ background:#ffefe0; }
.btn.danger{ background:#ffebeb; border-color:#ffd6d6; color:#b91c1c; }
.btn.danger:hover{ background:#ffe1e1; }

/* 테이블 패널(박스) */
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

/* 사용자 셀(아바타 + 이름) */
.user-cell{ display:flex; align-items:center; gap:10px; }
.avatar{
  width: 30px; height: 30px; border-radius: 999px;
  display:grid; place-items:center;
  background:#eef4ff; color:#1d4ed8; font-weight: 800; font-size: 12px;
  border:1px solid #dde7ff;
}
.name{ font-weight: 700; }

/* 작업 버튼 묶음 */
.actions{ display:flex; gap:6px; flex-wrap: wrap; }
</style>
