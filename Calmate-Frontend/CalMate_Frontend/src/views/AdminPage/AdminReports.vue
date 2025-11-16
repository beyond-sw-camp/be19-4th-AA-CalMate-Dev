<!--
  파일 경로(권장): src/pages/admin/AdminReports.vue
  역할: /admin/reports 라우트로 진입했을 때 보이는 신고 관리 화면
       - 검색/필터/테이블/페이지네이션/개별/일괄 처리(+확인 모달)
-->
<template>
  <!-- 전체 컨테이너 -->
  <section class="reports-wrap">
    <!-- 섹션 타이틀/설명 -->
    <h2 class="section-title">신고 관리</h2>
    <p class="section-desc">사용자 신고 내역 및 처리</p>

    <!-- 상단 툴바: 검색 + 필터 + 일괄 처리 -->
    <div class="toolbar">
      <!-- 좌측: 검색 -->
      <div class="search">
        <input
          v-model.trim="query"
          type="search"
          class="search-input"
          placeholder="신고자/대상/사유 검색"
          @keyup.enter="applyFilters"
        />
        <button class="btn" @click="applyFilters">검색</button>
        <button class="btn ghost" @click="resetFilters">초기화</button>
      </div>

      <!-- 우측: 필터군 (유형/상태) -->
      <div class="filters">
        <label class="filter-label">유형</label>
        <select v-model="type" class="select" @change="applyFilters">
          <option value="all">전체</option>
          <option value="post">게시물</option>
          <option value="user">사용자</option>
        </select>

        <label class="filter-label">상태</label>
        <select v-model="status" class="select" @change="applyFilters">
          <option value="all">전체</option>
          <option value="pending">대기중</option>
          <option value="resolved">처리완료</option>
          <option value="rejected">반려</option>
        </select>

        <!-- 일괄 처리 버튼: 체크된 행이 있을 때만 활성화 -->
        <button class="btn warn" :disabled="checkedIds.length===0" @click="openBulk('resolve')">
          선택 처리
        </button>
        <button class="btn danger" :disabled="checkedIds.length===0" @click="openBulk('reject')">
          선택 반려
        </button>
      </div>
    </div>

    <!-- 테이블 패널 -->
    <article class="panel">
      <!-- 비어있을 때 -->
      <EmptyState
        v-if="!loading && pagedRows.length===0"
        title="신고가 없습니다"
        description="조건을 바꿔 다시 검색해 주세요."
      />

      <!-- 로딩 -->
      <div v-else-if="loading" class="table-loading">
        신고 목록을 불러오는 중입니다...
      </div>

      <!-- 데이터 있을 때 -->
      <table v-else class="table">
        <thead>
          <tr>
            <!-- 전체 선택 체크박스 -->
            <th style="width:36px;">
              <input
                type="checkbox"
                :checked="isAllChecked"
                @change="toggleAll($event.target.checked)"
              />
            </th>
            <th>신고자</th>
            <th>대상</th>
            <th>유형</th>
            <th>사유</th>
            <th>상태</th>
            <th>시간</th>
            <th style="width:160px;">작업</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in pagedRows" :key="r.id">
            <!-- 개별 체크 -->
            <td>
              <input
                type="checkbox"
                :value="r.id"
                :checked="checkedIds.includes(r.id)"
                @change="toggleOne(r.id, $event.target.checked)"
              />
            </td>

            <!-- 신고자 -->
            <td class="cell">
              <div class="avatar">{{ initials(r.reporter) }}</div>
              <div class="main">{{ r.reporter }}</div>
            </td>

            <!-- 대상 -->
            <td class="cell">
              <div class="avatar gray">#</div>
              <div class="main ellipsis" :title="r.target">{{ r.target }}</div>
            </td>

            <!-- 유형 배지 -->
            <td>
              <ReportTypeBadge :type="r.type" />
            </td>

            <!-- 사유 -->
            <td class="ellipsis" :title="r.reason">{{ r.reason }}</td>

            <!-- 상태 배지 -->
            <td>
              <ReportStatusBadge :status="r.status" />
            </td>

            <!-- 시간 -->
            <td>{{ r.when }}</td>

            <!-- 작업 버튼들 -->
            <td>
              <div class="actions">
                <!-- ✅ 상세 모달 열기 -->
                <button class="btn xs" @click="openDetail(r.id)">보기</button>

                <!-- 처리/반려: 상태에 따라 버튼 비활성화 -->
                <button
                  class="btn xs success"
                  :disabled="r.status!=='pending'"
                  @click="openSingle(r, 'resolve')"
                >
                  처리
                </button>

                <button
                  class="btn xs danger"
                  :disabled="r.status!=='pending'"
                  @click="openSingle(r, 'reject')"
                >
                  반려
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- 페이지네이션 -->
      <PaginationLite
        v-if="rows.length > pageSize"
        :page="page"
        :page-size="pageSize"
        :total="filtered.length"
        @change="(p)=>page=p"
      />
    </article>

    <!-- 확인 모달(개별/일괄 공용) -->
    <ConfirmModal
      v-if="confirm.open"
      :title="confirm.title"
      :message="confirm.message"
      :ok-text="confirm.okText"
      :cancel-text="'취소'"
      @ok="applyAction"
      @cancel="confirm.open=false"
    />

    <!-- ✅ 신고 상세 모달 -->
    <ReportDetailModal
      v-if="detailOpen"
      :report-id="detailId"
      @close="closeDetail"
    />
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import EmptyState from '@/components/admin/EmptyState.vue'
import PaginationLite from '@/components/admin/PaginationLite.vue'
import ConfirmModal from '@/components/admin/ConfirmModal.vue'
import ReportTypeBadge from '@/components/admin/ReportTypeBadge.vue'
import ReportStatusBadge from '@/components/admin/ReportStatusBadge.vue'
import { fetchAllReports, processReport } from '@/api/report'
import ReportDetailModal from '@/components/admin/ReportDetailModal.vue'

/* ============ 1) 검색/필터/페이지 상태 ============ */
const query = ref('')           // 검색 키워드(신고자/대상/사유)
const type = ref('all')         // 유형 필터('all'|'post'|'user')
const status = ref('all')       // 상태 필터('all'|'pending'|'resolved'|'rejected')
const page = ref(1)             // 현재 페이지(1-base)
const pageSize = 10             // 페이지 당 행 수

/* ============ 2) 목록 데이터 ============ */
const rows = ref([])
const loading = ref(false)

onMounted(loadReports)

async function loadReports() {
  loading.value = true
  try {
    const data = await fetchAllReports()
    const items = data?.items ?? data ?? []     // 응답 구조에 따라 items 또는 바로 배열
    rows.value = items.map(mapReportItem)
  } finally {
    loading.value = false
  }
}

function mapReportItem(item) {
  const isPost = item.postId != null
  const when = formatDate(item.date)
  return {
    id: item.id,
    reporter: item.reporterName,
    target: item.reportedName || (isPost ? `게시글 #${item.postId}` : `회원 #${item.reportedId}`),
    type: isPost ? 'post' : 'user',
    reason: item.reportBaseTitle,
    status: item.yn ? 'resolved' : 'pending',
    when,
  }
}

/* ============ 3) 체크박스 선택 상태(일괄 처리용) ============ */
const checkedIds = ref([])
const isAllChecked = computed(() => {
  const ids = pagedRows.value.map(r => r.id)
  return ids.length > 0 && ids.every(id => checkedIds.value.includes(id))
})
function toggleAll(checked) {
  const ids = pagedRows.value.map(r => r.id)
  if (checked) {
    checkedIds.value = Array.from(new Set([...checkedIds.value, ...ids]))
  } else {
    checkedIds.value = checkedIds.value.filter(id => !ids.includes(id))
  }
}
function toggleOne(id, checked) {
  if (checked) {
    if (!checkedIds.value.includes(id)) checkedIds.value.push(id)
  } else {
    checkedIds.value = checkedIds.value.filter(x => x !== id)
  }
}

/* ============ 4) 파생 데이터(필터/검색/페이징) ============ */
const filtered = computed(() => {
  const q = query.value.toLowerCase().trim()
  return rows.value.filter(r => {
    const typeOk = type.value === 'all' ? true : r.type === type.value
    const statusOk = status.value === 'all' ? true : r.status === status.value
    const searchOk =
      !q ||
      [r.reporter, r.target, r.reason].some(v =>
        String(v).toLowerCase().includes(q),
      )
    return typeOk && statusOk && searchOk
  })
})
const start = computed(() => (page.value - 1) * pageSize)
const end = computed(() => start.value + pageSize)
const pagedRows = computed(() => filtered.value.slice(start.value, end.value))

/* ============ 5) 검색/초기화 핸들러 ============ */
function applyFilters() {
  page.value = 1
}
function resetFilters() {
  query.value = ''
  type.value = 'all'
  status.value = 'all'
  page.value = 1
}

/* ============ 6) 개별/일괄 처리 모달 ============ */
const confirm = ref({
  open: false,
  mode: 'single',
  action: null,
  targetIds: [],
  title: '',
  message: '',
  okText: '확인',
})

function openSingle(row, action) {
  confirm.value.mode = 'single'
  confirm.value.action = action
  confirm.value.targetIds = [row.id]
  const dict = {
    resolve: { t: '신고 처리', m: `이 신고를 '처리완료'로 변경할까요?`, ok: '처리' },
    reject: { t: '신고 반려', m: `이 신고를 '반려'로 변경할까요?`, ok: '반려' },
  }
  confirm.value.title = dict[action].t
  confirm.value.message = `${row.reporter} → ${row.target}\n사유: ${row.reason}\n${dict[action].m}`
  confirm.value.okText = dict[action].ok
  confirm.value.open = true
}

function openBulk(action) {
  if (checkedIds.value.length === 0) return
  confirm.value.mode = 'bulk'
  confirm.value.action = action
  confirm.value.targetIds = [...checkedIds.value]
  const dict = {
    resolve: {
      t: '선택 신고 처리',
      m: `선택된 ${checkedIds.value.length}건을 '처리완료'로 변경할까요?`,
      ok: '일괄 처리',
    },
    reject: {
      t: '선택 신고 반려',
      m: `선택된 ${checkedIds.value.length}건을 '반려'로 변경할까요?`,
      ok: '일괄 반려',
    },
  }
  confirm.value.title = dict[action].t
  confirm.value.message = dict[action].m
  confirm.value.okText = dict[action].ok
  confirm.value.open = true
}

async function applyAction() {
  const { action, targetIds } = confirm.value

  try {
    if (action === 'resolve') {
      // ✅ 백엔드에 실제 처리 요청
      await Promise.all(targetIds.map(id => processReport(id)))
      // 목록 다시 로딩
      await loadReports()
    } else if (action === 'reject') {
      // ❗ 아직 반려용 API는 없으므로 프론트 상태만 변경
      rows.value = rows.value.map(r => {
        if (targetIds.includes(r.id)) r.status = 'rejected'
        return r
      })
    }
  } finally {
    checkedIds.value = []
    confirm.value.open = false
  }
}

/* ============ 7) 신고 상세 모달 상태 ============ */
const detailOpen = ref(false)
const detailId = ref(null)

function openDetail(id) {
  detailId.value = id
  detailOpen.value = true
}

function closeDetail() {
  detailOpen.value = false
  detailId.value = null
}

/* ============ 8) 유틸 ============ */
function initials(name) {
  if (!name) return 'U'
  const parts = String(name).trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2)
  return parts[0].slice(0, 1) + parts[1].slice(0, 1)
}

function formatDate(v) {
  if (!v) return ''
  const d = new Date(v)
  if (Number.isNaN(d.getTime())) return String(v)
  return d.toLocaleString('ko-KR', {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<style scoped>
/* 레이아웃 여백 */
.reports-wrap { margin-top: 10px; }

/* 타이포 */
.section-title { font-size: 18px; font-weight: 800; letter-spacing: -0.2px; }
.section-desc { margin-top: 6px; color:#6b7280; }

/* 툴바 */
.toolbar{
  margin-top: 14px;
  display:flex; gap:12px; align-items:center; justify-content:space-between; flex-wrap:wrap;
}

/* 검색 */
.search{ display:flex; gap:8px; flex:1 1 520px; }
.search-input{
  flex:1 1 auto; min-width:220px; padding:10px 12px; border-radius:12px;
  border:1px solid #e5e7eb; background:#fff; outline:none;
}
.search-input:focus{ border-color:#cbd5e1; box-shadow:0 0 0 3px rgba(37,99,235,.08); }

/* 필터 */
.filters{ display:flex; gap:8px; align-items:center; }
.filter-label{ font-size:14px; color:#6b7280; }
.select{
  padding:10px 12px; border-radius:12px; border:1px solid #e5e7eb; background:#fff;
}

/* 버튼 */
.btn{
  padding:10px 14px; border-radius:12px; border:1px solid #dde7ff;
  background:#eef4ff; color:#1d4ed8; font-weight:600; cursor:pointer;
}
.btn:hover{ background:#e4ecff; }
.btn.ghost{ background:#fff; color:#374151; border-color:#e5e7eb; }
.btn.xs{ padding:6px 10px; border-radius:10px; font-size:12px; }
.btn.warn{ background:#fff7ed; border-color:#ffedd5; color:#c2410c; }
.btn.warn:disabled{ opacity:.5; cursor:not-allowed; }
.btn.danger{ background:#ffebeb; border-color:#ffd6d6; color:#b91c1c; }
.btn.danger:disabled{ opacity:.5; cursor:not-allowed; }
.btn.success{ background:#eafaf7; border-color:#d3f4ec; color:#0f766e; }

/* 패널/테이블 */
.panel{
  margin-top:12px; background:#fff; border:1px solid #e5e7eb; border-radius:14px; padding:10px;
  box-shadow:0 4px 14px rgba(17,24,39,.04);
}
.table{ width:100%; border-collapse: collapse; }
.table thead th{
  text-align:left; font-size:12px; color:#6b7280; font-weight:700; padding:10px 8px;
  border-bottom:1px solid #eef2f7;
}
.table tbody td{ padding:12px 8px; border-bottom:1px solid #f3f4f6; }

/* 작업 영역 로딩 텍스트 */
.table-loading {
  padding: 24px 8px;
  text-align: center;
  color: #6b7280;
  font-size: 14px;
}

/* 셀 내부(아바타+텍스트) */
.cell{ display:flex; align-items:center; gap:10px; min-width:0; }
.avatar{
  width:28px; height:28px; border-radius:999px; display:grid; place-items:center;
  background:#eef4ff; color:#1d4ed8; font-weight:800; font-size:12px; border:1px solid #dde7ff;
}
.avatar.gray{ background:#f3f4f6; color:#6b7280; border-color:#e5e7eb; }
.main{ font-weight:700; min-width:0; }
.ellipsis{ max-width:320px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }

/* 작업 버튼 영역 */
.actions{ display:flex; gap:6px; flex-wrap:wrap; }
</style>
