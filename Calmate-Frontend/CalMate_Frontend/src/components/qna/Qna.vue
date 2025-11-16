<template>
  <div class="qna-wrap">
    <div class="top-actions">
      <button class="back-btn" type="button" @click="goBack">목록으로</button>
    </div>

    <section class="hero">
      <div class="hero-icon">📝</div>
      <div>
        <h2 class="hero-title">문의 작성</h2>
        <p class="hero-sub">제목과 내용을 입력해 주세요</p>
      </div>
    </section>

    <section class="card">
      <form @submit.prevent="handleSubmit" class="form">
        <div class="form-row">
          <label class="form-label">문의 유형</label>
          <select v-model="form.category" class="input select">
            <option v-for="o in categoryOptions" :key="o.value" :value="o.value">{{ o.label }}</option>
          </select>
        </div>

        <div class="form-row">
          <label class="form-label">제목</label>
          <input v-model="form.title" class="input" placeholder="제목을 입력하세요" required />
        </div>

        <div class="form-row">
          <label class="form-label">내용</label>
          <textarea v-model="form.content" class="input textarea" rows="6" placeholder="내용을 입력하세요" required></textarea>
        </div>

        <div class="actions">
          <button class="btn-primary" type="submit">문의 등록</button>
          <button class="btn-ghost" type="button" @click="resetForm">취소</button>
        </div>
      </form>
    </section>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from '../../lib/toast.js'
import { useUserStore } from '@/stores/user'
import { createQna } from '@/api/qna'

const { success, error: toastError } = useToast()
const router = useRouter()
const user = useUserStore()

const form = reactive({ category: '기타', title: '', content: '' })
const categoryOptions = [
  { value: '기술지원', label: '기술지원' },
  { value: '계정/결제', label: '계정/결제' },
  { value: '기능제안', label: '기능제안' },
  { value: '신고', label: '신고' },
  { value: '기타', label: '기타' },
]

function goBack(){ history.back() }

async function handleSubmit(){
  if (!form.title.trim()) return toastError('제목을 입력하세요')
  if (!form.content.trim()) return toastError('내용을 입력하세요')
  if (!user?.userId) return toastError('로그인이 필요합니다')
  try {
    await createQna({ memberId: user.userId, title: form.title.trim(), contents: form.content.trim() })
    success('문의가 등록되었습니다')
    resetForm()
    router.push('/main/qna')
  } catch (e) {
    console.error('QnA create failed', e?.response?.status, e?.response?.data || e)
    toastError('등록 중 오류가 발생했습니다')
  }
}

function resetForm(){ form.category = '기타'; form.title = ''; form.content = '' }
</script>

<style scoped>
.qna-wrap { display: flex; flex-direction: column; gap: 16px; }
.top-actions { margin-top: 2px; }
.back-btn { background: transparent; border: 0; color: #6b7280; font-size: 14px; cursor: pointer; }
.back-btn:hover { color: #111827; }

.hero { display: flex; align-items: center; gap: 16px; padding: 18px 20px; border-radius: 18px; background: linear-gradient(90deg, #f7e9ff, #f0f9ff); border: 1px solid #f0f0f3; }
.hero-icon { font-size: 22px; }
.hero-title { margin: 0; font-size: 20px; font-weight: 700; color: #111827; }
.hero-sub { margin: 2px 0 0; font-size: 13px; color: #6b7280; }

.card { background: #fff; border: 1px solid #efeff4; border-radius: 18px; padding: 18px; }
.form { display: flex; flex-direction: column; gap: 12px; }
.form-row { display: flex; flex-direction: column; gap: 6px; }
.form-label { font-size: 13px; color: #6b7280; }
.input { width: 100%; border: 1px solid #e6e8ee; background: #f5f6fa; border-radius: 12px; padding: 12px 14px; font-size: 14px; }
.input:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,.18); background: #fff; }
.select { appearance: none; background-image: linear-gradient(45deg, transparent 50%, #9ca3af 50%), linear-gradient(135deg, #9ca3af 50%, transparent 50%); background-position: calc(100% - 18px) 16px, calc(100% - 12px) 16px; background-size: 6px 6px, 6px 6px; background-repeat: no-repeat; }
.textarea { resize: vertical; min-height: 140px; }

.actions { display: flex; gap: 10px; align-items: center; }
.btn-primary { flex: 1; background: #0b0b2b; color: #fff; border: 0; padding: 12px 16px; border-radius: 999px; font-weight: 700; cursor: pointer; }
.btn-primary:hover { background: #11113a; }
.btn-ghost { background: #fff; border: 1px solid #e6e8ee; color: #111827; padding: 10px 14px; border-radius: 12px; cursor: pointer; }
.btn-ghost:hover { background: #f3f4f8; }
</style>
