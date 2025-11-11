<template>
  <div class="done-wrap">
    <header class="done-head">
      <div class="left">
        <button class="back" type="button" @click="goBack" aria-label="돌아가기">← 돌아가기</button>
        <div>
          <h2 class="title">나의 일기</h2>
          <p class="date">{{ dateLabel }}</p>
        </div>
      </div>
      <div class="head-actions">
        <button class="edit" type="button" @click="editEntry">수정하기</button>
        <button class="danger" type="button" @click="deleteEntry">삭제하기</button>
      </div>
    </header>

    <section class="card mood">
      <div class="mood-icon">{{ moodIcon }}</div>
      <div class="mood-text">
        <div class="mood-sub">오늘의 기분</div>
        <div class="mood-main">{{ moodLabel }}</div>
      </div>
    </section>

    <section class="card block">
      <header class="block-head">
        <span class="icon">💙</span>
        <span>오늘의 컨디션</span>
      </header>
      <div class="block-body">{{ entry?.condition || '작성된 내용이 없습니다.' }}</div>
    </section>

    <section class="card block">
      <header class="block-head">
        <span class="icon">📅</span>
        <span>오늘의 이야기</span>
      </header>
      <div class="block-body">{{ entry?.notes || '작성된 내용이 없습니다.' }}</div>
    </section>

    <section class="card block" v-if="(entry?.photos || []).length">
      <header class="block-head">
        <span class="icon">🖼️</span>
        <span>사진</span>
      </header>
      <div class="photo-list">
        <img v-for="(p,i) in entry.photos" :key="i" :src="p" :alt="`일기 사진 ${i+1}`" />
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const dateKey = computed(() => {
  const q = route.query?.date
  if (typeof q === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(q)) return q
  return new Date().toISOString().split('T')[0]
})

const entries = computed(() => {
  try { return JSON.parse(localStorage.getItem('journalEntries') || '[]') } catch { return [] }
})

const entry = computed(() => entries.value.find(e => e.date === dateKey.value) || null)

const dateLabel = computed(() => {
  try { return new Date(dateKey.value).toLocaleDateString('ko-KR', { year:'numeric', month:'long', day:'numeric', weekday:'long' }) } catch { return dateKey.value }
})

const moodMap = {
  great: { label: '아주 좋음', icon: '😁' },
  good: { label: '좋음', icon: '🙂' },
  okay: { label: '보통', icon: '😐' },
  bad: { label: '나쁨', icon: '☹️' },
  terrible: { label: '아주 나쁨', icon: '😫' },
}

const moodLabel = computed(() => moodMap[entry.value?.mood]?.label || '기록 없음')
const moodIcon = computed(() => moodMap[entry.value?.mood]?.icon || '📝')

function goBack(){
  if (history.length > 1) router.back(); else router.push({ name: 'main-calendar' })
}

function editEntry(){
  router.push({ name: 'main-diary', query: { date: dateKey.value } })
}

function deleteEntry(){
  if (!confirm('이 날짜의 일기를 삭제할까요?')) return
  try {
    const raw = localStorage.getItem('journalEntries')
    const arr = raw ? JSON.parse(raw) : []
    const filtered = Array.isArray(arr) ? arr.filter(e => e?.date !== dateKey.value) : []
    localStorage.setItem('journalEntries', JSON.stringify(filtered))
  } catch {}
  // 삭제 후 작성 페이지로 유도
  router.push({ name: 'main-diary', query: { date: dateKey.value } })
}
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
</style>
