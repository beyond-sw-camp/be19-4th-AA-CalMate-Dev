<template>
  <div class="qna-detail-wrap" v-if="item">
    <div class="topbar">
      <button class="back-link" type="button" @click="goBack">목록으로 돌아가기</button>
      <div class="top-actions" v-if="isOwner">
        <button class="btn-ghost" type="button" :disabled="hasAnswer" @click="beginEditQuestion">수정</button>
        <button class="btn-danger" type="button" @click="onDeleteQuestion">삭제</button>
      </div>
    </div>

    <section class="summary">
      <div class="summary-top">
        <span class="badge cat">{{ item.category }}</span>
        <span class="badge" :class="statusClass(displayStatus)">{{ displayStatus }}</span>
      </div>
      <h2 class="title">{{ item.title }}</h2>
      <div class="meta">
        <span class="author">작성자 {{ item.author || '일반회원' }}</span>
        <span class="dot">·</span>
        <span class="date">작성일 {{ formatDate(item.createdAt) }}</span>
      </div>
    </section>

    <section class="card">
      <header class="card-head">문의 내용</header>
      <div class="card-body">
        <div class="content-box">{{ item.content }}</div>
      </div>
    </section>

    <section v-if="isOwner && isEditingQuestion" class="owner-edit">
      <div class="form-row">
        <label class="form-label">제목</label>
        <input v-model="editTitle" class="input" placeholder="제목을 입력하세요" />
      </div>
      <div class="form-row">
        <label class="form-label">내용</label>
        <textarea v-model="editContent" class="input textarea" rows="6" placeholder="내용을 입력하세요"></textarea>
      </div>
      <div class="edit-actions">
        <button class="btn-primary" type="button" @click="onSaveQuestion">저장</button>
        <button class="btn-ghost" type="button" @click="cancelEditQuestion">취소</button>
      </div>
    </section>

    <section v-if="item.answer && !isEditingAnswer" class="answer">
      <header class="answer-head">
        <div>
          <span class="check">✔</span> 답변 완료
          <span class="badge admin">관리자</span>
        </div>
        <button v-if="isAdmin" class="edit-btn" type="button" @click="startEditAnswer">답변 수정</button>
      </header>
      <div class="divider"></div>
      <div class="answer-body">
        <div class="content-box answer-box">{{ item.answer }}</div>
      </div>
      <footer class="answer-foot">답변 시점: {{ timeAgo(item.answerAt || item.updatedAt || item.createdAt) }}</footer>
    </section>

    <section v-else-if="!isEditingAnswer" class="pending">
      <div class="pending-icon">⏳</div>
      <div>
        <div class="pending-title">답변 대기중</div>
        <div class="pending-desc">아직 답변이 등록되지 않았습니다. 빠른 시일 내 처리하겠습니다.</div>
      </div>
      <div class="pending-actions" v-if="isAdmin">
        <button class="add-answer-btn" type="button" @click="startEditAnswer">답변 등록</button>
      </div>
    </section>

    <section v-if="isEditingAnswer" class="answer-edit">
      <header class="edit-head">답변</header>
      <div class="edit-body">
        <textarea v-model="answerText" rows="6" class="input textarea" placeholder="답변 내용을 입력해주세요"></textarea>
      </div>
      <div class="edit-actions">
        <button class="btn-primary" type="button" @click="saveAnswer">저장</button>
        <button class="btn-ghost" type="button" @click="cancelEditAnswer">취소</button>
      </div>
    </section>
  </div>

  <div v-else class="not-found">
    존재하지 않는 문의입니다. <RouterLink to="/main/qna">목록으로</RouterLink>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useToast } from '../../lib/toast.js'
import { useUserStore } from '@/stores/user'
import { getQnaDetail, updateQna, deleteQna } from '@/api/qna'

const route = useRoute()
const router = useRouter()
const { success, error: toastError } = useToast()
const userStore = useUserStore()

const item = ref(null)
const isEditingQuestion = ref(false)
const editTitle = ref('')
const editContent = ref('')

const isEditingAnswer = ref(false)
const answerText = ref('')

const isOwner = computed(() => String(userStore?.userId || '') === String(item.value?.memberId || ''))
const isAdmin = computed(() => {
  try {
    const roles = userStore?.roles || []
    return Array.from(roles).some(r => String(r).includes('ADMIN'))
  } catch { return false }
})
const hasAnswer = computed(() => Boolean(item.value?.answer))
const displayStatus = computed(() => (item.value?.answer ? '완료' : '접수'))

onMounted(async () => {
  await refreshDetail()
})

async function refreshDetail(){
  try {
    const id = route.params.id
    const res = await getQnaDetail(id)
    const d = res?.data
    if (!d) return
    item.value = mapDetail(d)
  } catch (e) {
    console.error('Load detail failed', e)
  }
}

function mapDetail(d){
  const base = {
    id: d.id,
    title: d.title,
    content: d.contents,
    createdAt: d.createdAt,
    memberId: d.memberId,
    author: d.memberId,
    category: '일반',
  }
  // 관리자(memberId=2)의 최상위 댓글을 답변으로 매핑
  const all = Array.isArray(d.comments) ? d.comments : []
  const adminAnswer = all.find(c => String(c.memberId) === '2' && (!c.parentCommentId || Number(c.parentCommentId) === 0))
  const answerTxt = adminAnswer?.comment || ''
  const answerAt = adminAnswer?.createdAt || null
  return { ...base, answer: answerTxt || undefined, answerAt }
}

function goBack(){ history.length > 1 ? history.back() : router.push('/main/qna') }

function statusClass(s){
  switch (s) {
    case '접수': return 'st-wait'
    case '진행중':
    case '처리중': return 'st-proc'
    case '완료': return 'st-done'
    default: return 'st-wait'
  }
}

function timeAgo(ts){
  try {
    const t = new Date(ts).getTime()
    const diff = Math.floor((Date.now() - t) / 1000)
    if (diff < 60) return '방금 전'
    if (diff < 3600) return `${Math.floor(diff / 60)}분 전`
    if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`
    return `${Math.floor(diff / 86400)}일 전`
  } catch { return String(ts) }
}

function formatDate(ts){
  try {
    return new Date(ts).toLocaleString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
  } catch { return String(ts) }
}

function beginEditQuestion(){
  editTitle.value = item.value?.title || ''
  editContent.value = item.value?.content || ''
  isEditingQuestion.value = true
}
function cancelEditQuestion(){ isEditingQuestion.value = false }

async function onSaveQuestion(){
  const title = (editTitle.value || '').trim()
  const contents = (editContent.value || '').trim()
  if (!title) return toastError('제목을 입력하세요')
  if (!contents) return toastError('내용을 입력하세요')
  try {
    await updateQna({ id: item.value.id, title, contents })
    await refreshDetail()
    isEditingQuestion.value = false
    success('수정되었습니다')
  } catch (e) {
    console.error('QnA update failed', e)
    toastError('수정 중 오류가 발생했습니다')
  }
}

function startEditAnswer(){
  if (!isAdmin.value) { toastError('관리자만 답변을 등록/수정할 수 있습니다'); return }
  answerText.value = item.value?.answer || ''
  isEditingAnswer.value = true
}
function cancelEditAnswer(){ isEditingAnswer.value = false }
function saveAnswer(){ toastError('답변 저장 API 연동 필요') }

async function onDeleteQuestion(){
  try {
    await deleteQna(item.value.id)
    success('삭제되었습니다')
    router.push('/main/qna')
  } catch (e) {
    console.error('QnA delete failed', e)
    toastError('삭제 중 오류가 발생했습니다')
  }
}
</script>

<style scoped>
.qna-detail-wrap { display: flex; flex-direction: column; gap: 16px; }
.topbar { display:flex; align-items:center; justify-content:space-between; }
.top-actions { display:flex; gap:8px; }
.back-link { background: transparent; border: 0; color: #6b7280; font-size: 14px; text-align: left; cursor: pointer; }
.back-link:hover { color: #111827; }

.summary { background: #f5f9ff; border: 1px solid #e7eefc; border-radius: 18px; padding: 16px 18px; position: relative; }
.summary-top { display: flex; gap: 8px; align-items: center; margin-bottom: 8px; }
.badge { display: inline-flex; align-items: center; gap: 6px; border-radius: 999px; padding: 3px 8px; font-size: 12px; font-weight: 700; background: #f3f4f6; color: #374151; }
.badge.cat { background: #e8f0ff; color: #1d4ed8; }
.badge.admin { margin-left: 8px; background: #eef2ff; color: #1d4ed8; }
.st-wait { background: #fff7ed; color: #c2410c; }
.st-proc { background: #e0f2fe; color: #0369a1; }
.st-done { background: #ecfdf5; color: #047857; }
.title { margin: 0; font-size: 18px; font-weight: 800; color: #111827; }
.meta { margin-top: 6px; font-size: 12px; color: #9ca3af; display: flex; gap: 6px; align-items: center; }
.dot { opacity: .6; }
.author { color: #374151; }
.date { color: #6b7280; }

.card { background: #fff; border: 1px solid #efeff4; border-radius: 18px; overflow: hidden; }
.card-head { padding: 14px 16px; font-weight: 700; color: #374151; border-bottom: 1px solid #f1f2f6; background: #fff; }
.card-body { padding: 16px; }
.content-box { background: #f7f8fb; border: 1px solid #eef0f4; border-radius: 12px; padding: 14px; color: #374151; white-space: pre-wrap; }

.owner-edit { background:#fff; border:1px solid #efeff4; border-radius:12px; padding:12px; margin-top:8px; }
.form-row { display:flex; flex-direction:column; gap:6px; margin-bottom:10px; }
.form-label { font-size: 13px; color: #6b7280; }

.answer { background: #ecfdf5; border: 1px solid #d1fae5; border-radius: 18px; overflow: hidden; }
.answer-head { padding: 14px 16px; font-weight: 800; color: #065f46; display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.answer .divider { border-top: 1px solid #d1fae5; }
.answer-body { padding: 16px; }
.answer-box { background: #f0fdf4; border-color: #d1fae5; }
.answer-foot { padding: 12px 16px; color: #6b7280; border-top: 1px solid #d1fae5; font-size: 13px; }
.check { color: #16a34a; }
.edit-btn { background: #ffffff; border: 1px solid #d1fae5; color: #065f46; border-radius: 10px; padding: 6px 10px; font-weight: 700; cursor: pointer; }
.edit-btn:hover { background: #f0fdf4; }

.pending { display: flex; gap: 12px; align-items: flex-start; background: #fffaf0; border: 1px solid #fbeed3; color: #a16207; border-radius: 18px; padding: 16px; }
.pending-icon { font-size: 18px; line-height: 1; margin-top: 2px; }
.pending-title { font-weight: 800; margin-bottom: 4px; }
.pending-desc { color: #a16207; }
.pending-actions { margin-left: auto; margin-top: 8px; }
.add-answer-btn { background: #0b0b2b; color: #fff; border: 0; padding: 10px 14px; border-radius: 12px; font-weight: 700; cursor: pointer; }
.add-answer-btn:hover { background: #11113a; }

.answer-edit { background: #ffffff; border: 1px solid #efeff4; border-radius: 18px; }
.edit-head { padding: 14px 16px; font-weight: 800; color: #374151; border-bottom: 1px solid #f1f2f6; }
.edit-body { padding: 16px; }
.input { width: 100%; border: 1px solid #e6e8ee; background: #f5f6fa; border-radius: 12px; padding: 12px 14px; font-size: 14px; }
.input:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,.18); background: #fff; }
.textarea { resize: vertical; min-height: 140px; }
.edit-actions { display: flex; gap: 10px; padding: 12px 16px; border-top: 1px solid #f1f2f6; }
.btn-primary { background: #0b0b2b; color: #fff; border: 0; padding: 10px 14px; border-radius: 12px; font-weight: 700; cursor: pointer; }
.btn-primary:hover { background: #11113a; }
.btn-ghost { background: #fff; border: 1px solid #e6e8ee; color: #111827; padding: 10px 14px; border-radius: 12px; cursor: pointer; }
.btn-ghost:hover { background: #f3f4f8; }
.btn-danger { background: #fee2e2; border: 1px solid #fecaca; color: #b91c1c; padding: 10px 14px; border-radius: 12px; cursor: pointer; }
.btn-danger:hover { background: #fecaca; }
</style>
