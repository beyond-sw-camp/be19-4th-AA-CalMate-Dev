<template>
  <div class="done-wrap">
    <header class="done-head">
      <div class="left">
        <button class="back" type="button" @click="goBack" aria-label="뒤로 가기">← 뒤로</button>
        <div>
          <h2 class="title">오늘의 일기</h2>
          <p class="date">{{ dateLabel }}</p>
        </div>
      </div>
      <div class="head-actions">
        <button class="edit" type="button" @click="editEntry">수정하기</button>
        <button class="danger" type="button" @click="deleteEntry">삭제하기</button>
      </div>
    </header>

    <!-- 포인트 모달 -->
    <div v-if="showPointModal" class="modal-overlay" @click="closePointModal">
      <div class="modal-box" @click.stop>
        <h3>🎉 5포인트가 적립되었습니다!</h3>
        <p>오늘의 일기 기록 보상입니다 😊</p>
        <button class="modal-btn" @click="closePointModal">확인</button>
      </div>
    </div>

    <section class="card mood">
      <div class="mood-icon">{{ moodIcon }}</div>
      <div class="mood-text">
        <div class="mood-sub">오늘의 기분</div>
        <div class="mood-main">{{ moodLabel }}</div>
      </div>
    </section>

    <section class="card block">
      <header class="block-head">
        <span class="icon">💪</span>
        <span>오늘의 컨디션</span>
      </header>
      <div class="block-body">{{ entry?.condition || '작성된 내용이 없습니다.' }}</div>
    </section>

    <section class="card block">
      <header class="block-head">
        <span class="icon">📝</span>
        <span>오늘의 메모</span>
      </header>
      <div class="block-body">{{ entry?.memo || '작성된 내용이 없습니다.' }}</div>
    </section>

    <section class="card block" v-if="(entry?.files || []).length">
      <header class="block-head">
        <span class="icon">🖼️</span>
        <span>사진</span>
      </header>
      <div class="photo-list">
        <img
          v-for="(p,i) in entry.files"
          :key="p.id ?? i"
          :src="resolveFileUrl(p.path)"
          :alt="`일기 사진 ${i+1}`"
        />
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from '../../lib/toast.js'
import { useUserStore } from '@/stores/user'
import { getDiaryByDate, deleteDiary, toDiaryClientMood } from '@/api/diary'
import { getCalendarByDay, updateCalendar } from '@/api/calendar'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const { success, error: toastError } = useToast()

const entry = ref(null)
const isLoading = ref(false)
const memberId = computed(() => userStore.userId || null)
const showPointModal = ref(false)

const dateKey = computed(() => {
  const q = route.query?.date
  if (typeof q === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(q)) return q
  return new Date().toISOString().split('T')[0]
})

const dateLabel = computed(() => {
  try {
    return new Date(dateKey.value).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    })
  } catch {
    return dateKey.value
  }
})

const moodMap = {
  great:    { label: '아주 좋음',   icon: '😄' },
  good:     { label: '좋음',       icon: '🙂' },
  okay:     { label: '보통',       icon: '😐' },
  bad:      { label: '나쁨',       icon: '🙁' },
  terrible: { label: '아주 나쁨',  icon: '😣' }
}

const clientMood = computed(() => (entry.value?.mood ? toDiaryClientMood(entry.value.mood) : null))
const moodLabel = computed(() => moodMap[clientMood.value]?.label || '기록 없음')
const moodIcon = computed(() => moodMap[clientMood.value]?.icon || '🙂')

watch(
  () => [dateKey.value, memberId.value],
  () => {
    loadDiary()
  },
  { immediate: true }
)

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081'
const resolveFileUrl = (path) => {
  if (!path) return ''
  if (/^https?:/i.test(path)) return path
  return `${API_BASE_URL}${path}`
}

async function loadDiary() {
  if (!memberId.value) {
    entry.value = null
    return
  }
  isLoading.value = true
  try {
    const { data } = await getDiaryByDate({
      memberId: memberId.value,
      date: dateKey.value
    })
    entry.value = Array.isArray(data) && data.length ? data[0] : null
  } catch (error) {
    console.error('loadDiary error', error)
    toastError('일기를 불러오는 중 오류가 발생했습니다.')
    entry.value = null
  } finally {
    isLoading.value = false
  }
}

function goBack() {
  if (history.length > 1) {
    router.back()
  } else {
    router.push({ name: 'main-calendar' })
  }
}

function editEntry() {
  router.push({ name: 'main-diary', query: { date: dateKey.value } })
}

async function deleteEntry() {
  if (!entry.value?.id) return
  if (!confirm('해당 일기를 삭제하시겠습니까?')) return
  try {
    await deleteDiary(entry.value.id)
    await syncCalendarDiaryStatus()
    success('일기가 삭제되었습니다.')
    router.push({ name: 'main-diary', query: { date: dateKey.value } })
  } catch (error) {
    console.error('deleteDiary error', error)
    toastError('일기를 삭제하는 중 오류가 발생했습니다.')
  }
}

async function syncCalendarDiaryStatus() {
  if (!memberId.value) return
  try {
    const { data } = await getCalendarByDay({
      memberId: memberId.value,
      day: dateKey.value
    })
    if (data?.id) {
      await updateCalendar({ id: data.id, diaryStatus: 0 })
    }
  } catch (error) {
    console.error('calendar sync error', error)
  }
}

function closePointModal() {
  showPointModal.value = false
}

// 페이지 진입 시 쿼리 파라미터 확인
onMounted(() => {
  if (route.query.showPoint === 'true') {
    showPointModal.value = true
  }
})
</script>

<style scoped>
.done-wrap { display: flex; flex-direction: column; gap: 18px; }
.done-head { display: flex; align-items: center; justify-content: space-between; gap: 14px; border-bottom: 1px solid #eef0f4; padding-bottom: 10px; }
.done-head .left { display: flex; align-items: center; gap: 14px; }
.back { background: none; border: none; color: #6b7280; cursor: pointer; }
.head-actions { display: flex; align-items: center; gap: 8px; }
.edit { background: #111827; color: #fff; border: none; border-radius: 10px; padding: 8px 12px; cursor: pointer; }
.danger { background: #e34e89; color: #fff; border: none; border-radius: 10px; padding: 8px 12px; cursor: pointer; }
.title { margin: 0; font-size: 20px; font-weight: 800; }
.date { margin: 2px 0 0; color: #6b7280; }

.card { background: #fff; border: 1px solid #eef0f4; border-radius: 16px; padding: 16px; }

.mood { display: flex; align-items: center; gap: 14px; background: linear-gradient(90deg, #ebf5ff, #f0f9ff); }
.mood-icon { font-size: 44px; filter: drop-shadow(0 6px 12px rgba(0,0,0,0.08)); }
.mood-text { display: grid; gap: 4px; }
.mood-sub { color: #6b7280; font-size: 13px; }
.mood-main { color: #1d4ed8; font-weight: 800; font-size: 22px; }

.block { display: grid; gap: 10px; }
.block-head { display: flex; align-items: center; gap: 8px; color: #374151; font-weight: 700; }
.block-body { background: linear-gradient(0deg, rgba(255,255,255,0.6), rgba(255,255,255,0.6)), #eef2ff; border-radius: 12px; padding: 16px; color: #374151; }
.icon { font-size: 16px; }

.photo-list { display: grid; grid-template-columns: repeat(auto-fill,minmax(120px,1fr)); gap: 10px; }
.photo-list img { width: 100%; height: 100px; object-fit: cover; border-radius: 12px; border: 1px solid #e5e7eb; }

/* 포인트 모달 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-box {
  background: white;
  border-radius: 20px;
  padding: 32px 24px;
  text-align: center;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  max-width: 320px;
  width: 90%;
  animation: modalFadeIn 0.3s ease-out;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.modal-box h3 {
  margin: 0 0 12px;
  font-size: 20px;
  font-weight: 800;
  color: #111827;
}

.modal-box p {
  margin: 0 0 24px;
  font-size: 15px;
  color: #6b7280;
}

.modal-btn {
  width: 100%;
  padding: 14px;
  background: #0b0b2b;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
}

.modal-btn:hover {
  background: #11113a;
}
</style>
