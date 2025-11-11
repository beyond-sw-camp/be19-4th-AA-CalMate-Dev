<template>
  <div class="qna-detail-wrap" v-if="item">
    <button class="back-link" type="button" @click="goBack">목록으로 돌아가기</button>

    <section class="summary">
      <div class="summary-top">
        <span class="badge cat">{{ item.category }}</span>
        <span class="badge" :class="statusClass(displayStatus)">{{ displayStatus }}</span>
      </div>
      <h2 class="title">{{ item.title }}</h2>
      <div class="meta">{{ timeAgo(item.createdAt) }}</div>
    </section>

    <section class="card">
      <header class="card-head">문의 내용</header>
      <div class="card-body">
        <div class="content-box">{{ item.content }}</div>
      </div>
    </section>

    <section v-if="item.answer && !isEditing" class="answer">
      <header class="answer-head">
        <div><span class="check">✔</span> 답변이 도착했어요</div>
        <button class="edit-btn" type="button" @click="startEdit">답변 수정</button>
      </header>
      <div class="divider"></div>
      <div class="answer-body">
        <div class="content-box answer-box">{{ item.answer }}</div>
      </div>
      <footer class="answer-foot">답변 일시: {{ timeAgo(item.answerAt || item.updatedAt || item.createdAt) }}</footer>
    </section>
    <section v-else-if="!isEditing" class="pending">
      <div class="pending-icon">⏱️</div>
      <div>
        <div class="pending-title">답변 대기중</div>
        <div class="pending-desc">아직 답변이 등록되지 않았습니다. 빠른 시일 내에 답변 드리겠습니다.</div>
      </div>
      <div class="pending-actions">
        <button class="add-answer-btn" type="button" @click="startEdit">답변 등록</button>
      </div>
    </section>

    <section v-if="isEditing" class="answer-edit">
      <header class="edit-head">답변 입력</header>
      <div class="edit-body">
        <textarea v-model="answerText" rows="6" class="input textarea" placeholder="답변 내용을 입력해 주세요"></textarea>
      </div>
      <div class="edit-actions">
        <button class="btn-primary" type="button" @click="saveAnswer">저장</button>
        <button class="btn-ghost" type="button" @click="cancelEdit">취소</button>
        <button v-if="item.answer" class="btn-danger" type="button" @click="clearAnswer">답변 삭제</button>
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

const route = useRoute()
const router = useRouter()
const item = ref(null)
const isEditing = ref(false)
const answerText = ref('')
const { success, error: toastError } = useToast()

const displayStatus = computed(() => {
  if (item.value?.answer) return '완료'
  return item.value?.status || '대기중'
})

onMounted(() => {
  const id = route.params.id
  const raw = localStorage.getItem('inquiries')
  if (!raw) return
  try {
    const list = JSON.parse(raw)
    if (Array.isArray(list)) {
      item.value = list.find((it) => String(it.id) === String(id)) || null
    }
  } catch (e) {
    console.error('Failed to parse inquiries', e)
  }
})

function goBack() {
  history.length > 1 ? history.back() : router.push('/main/qna')
}

function statusClass(s) {
  switch (s) {
    case '대기중':
    case '대기 중':
    case '진행대기':
    case '처리대기':
    case '??기중':
    case '?�기중':
      return 'st-wait'
    case '처리중':
    case '처리 중':
    case '진행중':
    case '진행 중':
    case '처리�?':
      return 'st-proc'
    case '완료':
    case '?�료':
      return 'st-done'
    default:
      return 'st-wait'
  }
}

function timeAgo(ts) {
  try {
    const t = new Date(ts).getTime()
    const diff = Math.floor((Date.now() - t) / 1000)
    if (diff < 60) return '방금 전'
    if (diff < 3600) return `${Math.floor(diff / 60)}분 전`
    if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`
    return `${Math.floor(diff / 86400)}일 전`
  } catch {
    return ts
  }
}

function startEdit() {
  answerText.value = item.value?.answer || ''
  isEditing.value = true
}

function cancelEdit() {
  isEditing.value = false
}

function persistUpdate(updater) {
  const raw = localStorage.getItem('inquiries')
  if (!raw) return false
  try {
    const list = JSON.parse(raw)
    const idx = list.findIndex((it) => String(it.id) === String(item.value.id))
    if (idx === -1) return false
    const updated = { ...list[idx] }
    updater(updated)
    list[idx] = updated
    localStorage.setItem('inquiries', JSON.stringify(list))
    item.value = updated
    return true
  } catch (e) {
    console.error(e)
    return false
  }
}

function saveAnswer() {
  const txt = (answerText.value || '').trim()
  if (!txt) {
    toastError('답변 내용을 입력해 주세요')
    return
  }
  const ok = persistUpdate((updated) => {
    updated.answer = txt
    updated.answerAt = new Date().toISOString()
    updated.status = '완료'
  })
  if (ok) {
    success('답변이 저장되었습니다')
    isEditing.value = false
  } else {
    toastError('저장 중 오류가 발생했습니다')
  }
}

function clearAnswer() {
  const ok = persistUpdate((updated) => {
    delete updated.answer
    delete updated.answerAt
    updated.status = '대기중'
  })
  if (ok) {
    success('답변이 삭제되었습니다')
    isEditing.value = false
  } else {
    toastError('삭제 중 오류가 발생했습니다')
  }
}
</script>

<style scoped>
.qna-detail-wrap { display: flex; flex-direction: column; gap: 16px; }
.back-link { background: transparent; border: 0; color: #6b7280; font-size: 14px; text-align: left; cursor: pointer; }
.back-link:hover { color: #111827; }

.summary { background: #f5f9ff; border: 1px solid #e7eefc; border-radius: 18px; padding: 16px 18px; }
.summary-top { display: flex; gap: 8px; align-items: center; margin-bottom: 8px; }
.badge { display: inline-flex; align-items: center; gap: 6px; border-radius: 999px; padding: 3px 8px; font-size: 12px; font-weight: 700; background: #f3f4f6; color: #374151; }
.badge.cat { background: #e8f0ff; color: #1d4ed8; }
.st-wait { background: #fff7ed; color: #c2410c; }
.st-proc { background: #e0f2fe; color: #0369a1; }
.st-done { background: #ecfdf5; color: #047857; }
.title { margin: 0; font-size: 18px; font-weight: 800; color: #111827; }
.meta { margin-top: 6px; font-size: 12px; color: #9ca3af; }

.card { background: #fff; border: 1px solid #efeff4; border-radius: 18px; overflow: hidden; }
.card-head { padding: 14px 16px; font-weight: 700; color: #374151; border-bottom: 1px solid #f1f2f6; background: #fff; }
.card-body { padding: 16px; }
.content-box { background: #f7f8fb; border: 1px solid #eef0f4; border-radius: 12px; padding: 14px; color: #374151; white-space: pre-wrap; }

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

.not-found { color: #6b7280; }

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
