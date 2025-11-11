<template>
  <div class="qna-wrap">
    <div class="top-actions">
      <button class="back-btn" type="button" @click="goBack">← 취소</button>
    </div>

    <section class="hero">
      <div class="hero-icon">❓</div>
      <div>
        <h2 class="hero-title">문의 작성</h2>
        <p class="hero-sub">궁금한 점을 자세히 알려주세요</p>
      </div>
    </section>

    <section class="card">
      <form @submit.prevent="submitQna" class="form">
        <div class="form-row">
          <label class="form-label">문의 유형</label>
          <select v-model="form.category" class="input select">
            <option v-for="o in categoryOptions" :key="o.value" :value="o.value">
              {{ o.label }}
            </option>
          </select>
        </div>

        <div class="form-row">
          <label class="form-label">제목</label>
          <input v-model="form.title" class="input" placeholder="문의 제목을 입력해 주세요" required />
        </div>

        <div class="form-row">
          <label class="form-label">내용</label>
          <textarea v-model="form.content" class="input textarea" rows="6" placeholder="문의 내용을 자세히 입력해 주세요" required></textarea>
        </div>

        <div class="actions">
          <button class="btn-primary" type="submit">문의 저장</button>
          <button class="btn-ghost" type="button" @click="resetForm">취소</button>
        </div>
      </form>
    </section>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from '../../lib/toast.js'

const router = useRouter()
const route = useRoute()
const { success, error: toastError } = useToast()

const inquiries = ref([])
const editingId = ref(null)

const form = reactive({
  category: '기술지원',
  title: '',
  content: '',
})

const categoryOptions = [
  { value: '기술지원', label: '기술지원' },
  { value: '계정/결제', label: '계정/결제' },
  { value: '기능제안', label: '기능제안' },
  { value: '버그', label: '버그' },
  { value: '기타', label: '기타' },
]

onMounted(() => {
  const raw = localStorage.getItem('inquiries')
  if (raw) {
    try {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) inquiries.value = parsed
    } catch (e) {
      console.error('Failed to parse inquiries', e)
    }
  }

  const qId = route.query?.id
  if (qId) {
    const found = inquiries.value.find((it) => String(it.id) === String(qId))
    if (found) {
      // 답변 완료된 문의는 수정 불가: 상세로 돌려보내기
      if (found.answer) {
        toastError('이미 답변이 완료되어 수정할 수 없습니다')
        router.replace({ name: 'dashboard-qna-detail', params: { id: found.id } })
        return
      }
      editingId.value = found.id
      form.category = found.category
      form.title = found.title
      form.content = found.content
    }
  }
})

function goBack() {
  router.push({ name: 'dashboard-qna-list' })
}

function submitQna() {
  if (!form.title.trim()) { toastError('제목을 입력해 주세요'); return }
  if (!form.content.trim()) { toastError('내용을 입력해 주세요'); return }

  if (editingId.value) {
    const idx = inquiries.value.findIndex((it) => String(it.id) === String(editingId.value))
    if (idx !== -1) {
      const base = inquiries.value[idx]
      const updated = {
        ...base,
        category: form.category,
        title: form.title.trim(),
        content: form.content.trim(),
        updatedAt: new Date().toISOString(),
      }
      inquiries.value.splice(idx, 1, updated)
      localStorage.setItem('inquiries', JSON.stringify(inquiries.value))
      success('문의가 수정되었습니다')
      router.push({ name: 'dashboard-qna-detail', params: { id: editingId.value } })
      return
    }
  }

  const newInquiry = {
    id: `inquiry_${Date.now()}`,
    category: form.category,
    title: form.title.trim(),
    content: form.content.trim(),
    status: '접수중',
    createdAt: new Date().toISOString(),
  }
  inquiries.value = [newInquiry, ...inquiries.value]
  localStorage.setItem('inquiries', JSON.stringify(inquiries.value))
  success('문의가 등록되었습니다')
  resetForm()
  router.push({ name: 'dashboard-qna-detail', params: { id: newInquiry.id } })
}

function resetForm() {
  form.category = '기술지원'
  form.title = ''
  form.content = ''
}
</script>

<style scoped>
.qna-wrap { display: flex; flex-direction: column; gap: 16px; }
.top-actions { margin-top: 2px; }
.back-btn { background: transparent; border: 0; color: #6b7280; font-size: 14px; cursor: pointer; }
.back-btn:hover { color: #111827; }

.hero { display: flex; align-items: center; gap: 16px; padding: 18px 20px; border-radius: 18px; background: linear-gradient(90deg, #f7e9ff, #f0f7ff); border: 1px solid #f0f0f3; }
.hero-icon { font-size: 22px; }
.hero-title { margin: 0; font-size: 20px; font-weight: 700; color: #111827; }
.hero-sub { margin: 2px 0 0; font-size: 13px; color: #6b7280; }

.card { background: #fff; border: 1px solid #efeff4; border-radius: 18px; padding: 18px; }
.form { display: flex; flex-direction: column; gap: 12px; }
.form-row { display: flex; flex-direction: column; gap: 6px; }
.form-label { font-size: 13px; color: #6b7280; }
.input { width: 100%; border: 1px solid #e6e8ee; background: #f5f6fa; border-radius: 12px; padding: 12px 14px; font-size: 14px; }
.input:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.18); background: #fff; }
.select { appearance: none; background-image: linear-gradient(45deg, transparent 50%, #9ca3af 50%), linear-gradient(135deg, #9ca3af 50%, transparent 50%); background-position: calc(100% - 18px) 16px, calc(100% - 12px) 16px; background-size: 6px 6px, 6px 6px; background-repeat: no-repeat; }
.textarea { resize: vertical; min-height: 140px; }

.actions { display: flex; gap: 10px; align-items: center; }
.btn-primary { flex: 1; background: #0b0b2b; color: #fff; border: 0; padding: 12px 16px; border-radius: 999px; font-weight: 700; cursor: pointer; }
.btn-primary:hover { background: #11113a; }
.btn-ghost { background: #fff; border: 1px solid #e6e8ee; color: #111827; padding: 10px 14px; border-radius: 12px; cursor: pointer; }
.btn-ghost:hover { background: #f3f4f8; }
</style>
