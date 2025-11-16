<template>
    <div class="overlay" @click.self="close">
      <div class="modal">
        <!-- 헤더 -->
        <header class="header">
          <div class="title-wrap">
            <h3 class="title">신고 상세</h3>
            <p v-if="detail" class="subtitle">
              ID {{ detail.id }} · {{ formatDate(detail.date) }}
            </p>
          </div>
          <button class="close-btn" @click="close">✕</button>
        </header>
  
        <!-- 내용 영역 -->
        <section class="body" v-if="!loading && detail">
          <!-- 상단 요약 -->
          <div class="section">
            <h4 class="section-title">기본 정보</h4>
            <div class="row">
              <div class="col">
                <div class="label">신고자</div>
                <div class="value">
                  {{ detail.reporterName }} (ID: {{ detail.reporterId }})
                </div>
              </div>
              <div class="col">
                <div class="label">피신고자</div>
                <div class="value">
                  {{ detail.reportedName }} (ID: {{ detail.reportedId }})
                </div>
              </div>
            </div>
  
            <div class="row">
              <div class="col">
                <div class="label">유형</div>
                <div class="value">
                  <span v-if="detail.postId">게시글 신고 (postId: {{ detail.postId }})</span>
                  <span v-else-if="detail.commentId">댓글 신고 (commentId: {{ detail.commentId }})</span>
                  <span v-else>사용자 신고</span>
                </div>
              </div>
              <div class="col">
                <div class="label">처리 상태</div>
                <div class="chip" :class="detail.yn ? 'chip-done' : 'chip-pending'">
                  <span v-if="detail.yn">처리완료</span>
                  <span v-else>대기중</span>
                </div>
              </div>
            </div>
          </div>
  
          <!-- 신고 사유 -->
          <div class="section">
            <h4 class="section-title">신고 사유</h4>
            <div class="row">
              <div class="col">
                <div class="label">신고 코드</div>
                <div class="value">
                  {{ detail.reportBaseTitle }} (ID: {{ detail.reportBaseId }})
                </div>
              </div>
              <div class="col">
                <div class="label">정지 기준</div>
                <div class="value">
                  누적 {{ detail.requiredCount }}회 → {{ detail.banDays }}일 정지
                </div>
              </div>
            </div>
          </div>
  
          <!-- 제목 / 내용 -->
          <div class="section">
            <h4 class="section-title">신고 내용</h4>
            <div class="field">
              <div class="label">제목</div>
              <div class="value strong">{{ detail.title }}</div>
            </div>
            <div class="field">
              <div class="label">내용</div>
              <div class="content-box">
                <p class="value pre">{{ detail.contents }}</p>
              </div>
            </div>
          </div>
  
          <!-- 기타 정보 -->
          <div class="section">
            <h4 class="section-title">기타</h4>
            <div class="row">
              <div class="col">
                <div class="label">신고일시</div>
                <div class="value">{{ formatDate(detail.date) }}</div>
              </div>
              <div class="col">
                <div class="label">처리 관리자</div>
                <div class="value">
                  <span v-if="detail.adminId">관리자 ID: {{ detail.adminId }}</span>
                  <span v-else>미지정</span>
                </div>
              </div>
            </div>
          </div>
  
          <!-- 첨부 이미지 -->
          <div class="section" v-if="detail.files && detail.files.length">
            <h4 class="section-title">신고 이미지</h4>
            <div class="thumb-list">
              <div
                v-for="file in detail.files"
                :key="file.id"
                class="thumb-wrap"
              >
                <img
                  :src="getImageSrc(file)"
                  alt="신고 이미지"
                  class="thumb"
                />
              </div>
            </div>
          </div>
        </section>
  
        <!-- 로딩 / 에러 -->
        <section class="body" v-else>
          <div v-if="loading" class="center-text">
            신고 정보를 불러오는 중입니다...
          </div>
          <div v-else-if="error" class="center-text error">
            {{ error }}
          </div>
        </section>
  
        <!-- 푸터 -->
        <footer class="footer">
          <button class="btn ghost" @click="close">닫기</button>
        </footer>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch, onMounted } from 'vue'
  import { fetchReportDetail } from '@/api/report'
  import api from '@/lib/api'
  
  const props = defineProps({
    reportId: {
      type: [Number, String],
      required: true,
    },
  })
  
  const emit = defineEmits(['close'])
  
  const loading = ref(false)
  const error = ref('')
  const detail = ref(null)
  
  const apiBaseURL = (api.defaults.baseURL || '').replace(/\/$/, '')
  
  const resolveFileUrl = (fileUrl) => {
    if (!fileUrl) return ''
    if (fileUrl.startsWith('http://') || fileUrl.startsWith('https://')) {
      return fileUrl
    }
    let path = fileUrl
    if (!path.startsWith('/')) {
      path = '/' + path
    }
    if (!apiBaseURL) return path
    return apiBaseURL + path
  }
  
  // ✅ 파일 객체에서 안전하게 이미지 URL 만들어 주기
  const getImageSrc = (file) => {
    if (!file) return ''
    // 백엔드에서 fileUrl 만들어 줬으면 그거 우선
    const raw =
      file.fileUrl ||
      (file.path && file.reName ? `${file.path}/${file.reName}` : '')
    return resolveFileUrl(raw)
  }
  
  const loadDetail = async () => {
    if (!props.reportId) return
    loading.value = true
    error.value = ''
    try {
      const data = await fetchReportDetail(props.reportId)
      // 디버그용으로 한 번 확인해보고 싶으면 주석 풀어서 사용
      // console.log('[신고 상세]', data)
      detail.value = data
    } catch (e) {
      console.error('[신고 상세 에러]', e)
      error.value = '신고 상세 정보를 불러오는 데 실패했습니다.'
    } finally {
      loading.value = false
    }
  }
  
  onMounted(loadDetail)
  watch(
    () => props.reportId,
    () => loadDetail(),
  )
  
  const close = () => emit('close')
  
  const formatDate = (v) => {
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
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
  }
  
  .modal {
    width: 760px;
    max-width: calc(100% - 32px);
    max-height: calc(100% - 80px);
    background: #ffffff;
    border-radius: 18px;
    box-shadow: 0 18px 45px rgba(15, 23, 42, 0.2);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  
  /* 헤더 */
  .header {
    padding: 16px 20px 14px;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .title-wrap {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  
  .title {
    font-size: 17px;
    font-weight: 700;
  }
  
  .subtitle {
    font-size: 12px;
    color: #6b7280;
  }
  
  .close-btn {
    border: none;
    background: transparent;
    font-size: 20px;
    cursor: pointer;
    color: #6b7280;
  }
  
  /* 본문 */
  .body {
    padding: 16px 20px 12px;
    overflow-y: auto;
  }
  
  .section {
    padding: 12px 14px;
    border-radius: 12px;
    border: 1px solid #e5e7eb;
    background: #f9fafb;
    margin-bottom: 12px;
  }
  
  .section-title {
    font-size: 13px;
    font-weight: 600;
    color: #6b7280;
    margin-bottom: 8px;
  }
  
  .row {
    display: flex;
    gap: 12px;
    margin-bottom: 6px;
  }
  
  .col {
    flex: 1 1 0;
  }
  
  .col.full {
    flex: 1 1 100%;
  }
  
  .field + .field {
    margin-top: 10px;
  }
  
  .label {
    font-size: 12px;
    color: #6b7280;
    margin-bottom: 2px;
  }
  
  .value {
    font-size: 14px;
    color: #111827;
  }
  
  .value.strong {
    font-weight: 600;
  }
  
  .value.pre {
    white-space: pre-wrap;
    line-height: 1.5;
  }
  
  .content-box {
    border-radius: 10px;
    border: 1px solid #e5e7eb;
    background: #ffffff;
    padding: 10px 12px;
  }
  
  /* 상태 칩 */
  .chip {
    display: inline-flex;
    align-items: center;
    padding: 4px 10px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 500;
  }
  
  .chip-pending {
    background: #fef3c7;
    color: #b45309;
  }
  
  .chip-done {
    background: #dcfce7;
    color: #15803d;
  }
  
  /* 이미지 영역 */
  .thumb-list {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 4px;
  }
  
  .thumb-wrap {
    width: 140px;
    height: 140px;
    border-radius: 12px;
    overflow: hidden;
    background: #f3f4f6;
    border: 1px solid #e5e7eb;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .thumb {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  /* 푸터 */
  .footer {
    padding: 12px 20px;
    border-top: 1px solid #e5e7eb;
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }
  
  .btn {
    padding: 8px 16px;
    border-radius: 999px;
    border: 1px solid #d1d5db;
    background: #111827;
    color: #fff;
    font-size: 13px;
    cursor: pointer;
  }
  
  .btn.ghost {
    background: #fff;
    color: #111827;
  }
  
  /* 로딩/에러 */
  .center-text {
    text-align: center;
    padding: 24px 0;
    font-size: 14px;
    color: #4b5563;
  }
  
  .center-text.error {
    color: #b91c1c;
  }
  </style>
  