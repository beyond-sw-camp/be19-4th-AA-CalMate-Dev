<template>
  <div class="diary-wrap">
    <header>
      <h2 class="title">일기</h2>
      <p class="sub">오늘의 상태를 기록하세요</p>
    </header>

    <!-- 입력 카드 -->
    <section class="d-card">
      <div class="date-head">
        <span class="emoji">📅</span>
        {{ todayLabel }}
      </div>

      <div class="d-field">
        <label class="d-label">현재 체중 (kg)</label>
        <input
          class="d-input"
          type="number"
          step="0.1"
          v-model="weight"
          placeholder="체중을 입력하세요"
        />
      </div>

      <div class="d-field">
        <label class="d-label">오늘의 기분</label>
        <div class="d-mood-row">
          <button
            v-for="m in moodOptions"
            :key="m.value"
            type="button"
            class="d-mood"
            :class="{ 'is-active': mood === m.value }"
            @click="mood = m.value"
          >
            <div class="d-mood-emoji">{{ m.icon }}</div>
            <div class="d-mood-text">{{ m.label }}</div>
          </button>
        </div>
      </div>

      <div class="d-field">
        <label class="d-label">컨디션</label>
        <input
          class="d-input"
          v-model="condition"
          placeholder="예: 피곤함, 에너지 넘침, 근육통 등"
        />
      </div>

      <div class="d-field">
        <label class="d-label">메모</label>
        <textarea
          class="d-textarea"
          rows="5"
          v-model="notes"
          placeholder="오늘 있었던 일, 느낀 점, 목표 등을 자유롭게 작성하세요"
        ></textarea>
      </div>

      <div class="d-field">
        <label class="d-label">사진 추가 (선택)</label>
        <div class="d-photo-actions">
          <div class="d-photo-url">
            <input
              class="d-input flex-1"
              v-model="photoUrl"
              placeholder="이미지 URL 입력"
            />
            <button
              class="d-btn-ghost"
              type="button"
              @click="handleAddPhotoUrl"
            >
              추가
            </button>
          </div>
          <div class="d-photo-file">
            <button
              class="d-btn-ghost"
              type="button"
              @click="triggerFileInput"
            >
              <span class="mr">📷</span>파일에서 선택
            </button>
            <input
              ref="fileInputRef"
              type="file"
              accept="image/*"
              class="hidden"
              @change="handleImageUpload"
            />
          </div>
        </div>

        <div v-if="photos.length" class="d-thumbs">
          <div
            v-for="(p, i) in photos"
            :key="`${p}-${i}`"
            class="d-thumb"
          >
            <img :src="p" :alt="`일기 사진 ${i + 1}`" />
            <button
              class="d-thumb-del"
              type="button"
              @click="handleRemovePhoto(i)"
              aria-label="사진 삭제"
            >
              ×
            </button>
          </div>
        </div>
      </div>

      <button
        type="button"
        class="d-btn-primary"
        @click="handleSave"
      >
        저장하기
      </button>
    </section>

    <!-- 오늘 쓴 일기 요약 -->
    <section
      v-if="todayEntry"
      class="today-card"
    >
      <header class="today-head">
        <h3>오늘 쓴 일기</h3>
      </header>

      <div class="today-body">
        <div class="today-date">
          {{ formatDate(todayEntry.date) }}
        </div>

        <div class="today-row">
          <span class="today-label">기분</span>
          <span class="today-value">
            {{ todayMood.icon }} {{ todayMood.label }}
          </span>
        </div>

        <div
          v-if="todayEntry.weight !== undefined"
          class="today-row"
        >
          <span class="today-label">현재 체중</span>
          <span class="today-value">
            {{ todayEntry.weight }} kg
          </span>
        </div>

        <div
          v-if="todayEntry.condition"
          class="today-row"
        >
          <span class="today-label">컨디션</span>
          <span class="today-value multiline">
            {{ todayEntry.condition }}
          </span>
        </div>

        <div
          v-if="todayEntry.notes"
          class="today-row"
        >
          <span class="today-label">메모</span>
          <span class="today-value multiline">
            {{ todayEntry.notes }}
          </span>
        </div>

        <div
          v-if="todayEntry.photos && todayEntry.photos.length"
          class="today-row today-photos"
        >
          <span class="today-label">사진</span>
          <div class="today-photo-list">
            <img
              v-for="(p, i) in todayEntry.photos"
              :key="`${p}-${i}`"
              :src="p"
              :alt="`오늘 일기 사진 ${i + 1}`"
            />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'
import { useToast } from '../../lib/toast.js'

const { success } = useToast()
const router = useRouter()

const route = useRoute()
const todayKey = (() => {
  const q = route?.query?.date
  if (typeof q === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(q)) return q
  return new Date().toISOString().split('T')[0]
})()

const todayLabel = computed(() =>
  new Date(todayKey).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }),
)

const entries = ref([])

const weight = ref('')
const mood = ref('good')
const condition = ref('')
const notes = ref('')
const photos = ref([])
const photoUrl = ref('')
const fileInputRef = ref(null)

const moodOptions = [
  { value: 'great', label: '아주 좋음', icon: '😊' },
  { value: 'good', label: '좋음', icon: '🙂' },
  { value: 'okay', label: '보통', icon: '😐' },
  { value: 'bad', label: '나쁨', icon: '🙁' },
  { value: 'terrible', label: '최악', icon: '😭' },
]

// 오늘 일기 computed
const todayEntry = computed(() =>
  entries.value.find((e) => e.date === todayKey) || null,
)

// 오늘 기분 표시용
const todayMood = computed(() => {
  const target = todayEntry.value
    ? moodOptions.find((m) => m.value === todayEntry.value.mood)
    : moodOptions.find((m) => m.value === mood.value)
  return (
    target || { label: '기록 없음', icon: '📝' }
  )
})

onMounted(() => {
  const raw = localStorage.getItem('journalEntries')
  if (!raw) return
  try {
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) {
      entries.value = parsed
      const today = parsed.find((e) => e.date === todayKey)
      if (today) {
        weight.value =
          today.weight !== undefined
            ? String(today.weight)
            : ''
        mood.value = today.mood ?? 'good'
        condition.value = today.condition ?? ''
        notes.value = today.notes ?? ''
        photos.value = today.photos ?? []
      }
    }
  } catch {
    // 파싱 실패 시 무시
  }
})

function triggerFileInput() {
  fileInputRef.value?.click()
}

function handleImageUpload(e) {
  const file = e.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onloadend = () => {
    if (reader.result) {
      photos.value = [...photos.value, reader.result]
    }
  }
  reader.readAsDataURL(file)
  e.target.value = ''
}

function handleAddPhotoUrl() {
  const url = photoUrl.value.trim()
  if (!url) return
  photos.value = [...photos.value, url]
  photoUrl.value = ''
}

function handleRemovePhoto(i) {
  photos.value = photos.value.filter(
    (_, idx) => idx !== i,
  )
}

function handleSave() {
  const entry = {
    id: todayKey,
    date: todayKey,
    weight: weight.value
      ? parseFloat(weight.value)
      : undefined,
    mood: mood.value,
    condition: condition.value,
    notes: notes.value,
    photos: photos.value.length
      ? photos.value
      : undefined,
  }

  const filtered = entries.value.filter(
    (e) => e.date !== todayKey,
  )
  const updated = [entry, ...filtered].sort(
    (a, b) =>
      new Date(b.date) - new Date(a.date),
  )

  entries.value = updated
  localStorage.setItem(
    'journalEntries',
    JSON.stringify(updated),
  )

  success('일기가 저장되었습니다!')
  router.push({ name: 'main-diary-done', query: { date: todayKey } })
}

// 날짜 출력용
function formatDate(dateStr) {
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return dateStr
  }
}
</script>

<style scoped>
.diary-wrap {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.title {
  margin: 0;
  font-size: 22px;
  font-weight: 800;
  color: #111827;
}
.sub {
  margin: 4px 0 0;
  color: #6b7280;
}

/* 입력 카드 */
.d-card {
  background: #fff;
  border: 1px solid #eef0f4;
  border-radius: 18px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.date-head {
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
}
.emoji {
  font-size: 18px;
}

.d-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.d-label {
  font-size: 13px;
  color: #6b7280;
}
.d-input {
  width: 100%;
  border: 1px solid #e6e8ee;
  background: #f5f6fa;
  border-radius: 12px;
  padding: 12px 14px;
  font-size: 14px;
  box-sizing: border-box;
}
.d-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px
    rgba(59, 130, 246, 0.18);
  background: #fff;
}
.d-textarea {
  width: 100%;
  border: 1px solid #e6e8ee;
  background: #f5f6fa;
  border-radius: 12px;
  padding: 12px 14px;
  font-size: 14px;
  min-height: 140px;
  resize: vertical;
  box-sizing: border-box;
}
.d-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px
    rgba(59, 130, 246, 0.18);
  background: #fff;
}

/* 기분 선택 */
.d-mood-row {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
}
.d-mood {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 16px 8px;
  border: 2px solid #e5e7eb;
  border-radius: 14px;
  background: #fff;
  cursor: pointer;
}
.d-mood:hover {
  background: #fafafb;
}
.d-mood.is-active {
  border-color: #2563eb;
  box-shadow: 0 0 0 2px
      rgba(37, 99, 235, 0.25)
    inset;
  background: #eff6ff;
}
.d-mood-emoji {
  font-size: 22px;
}
.d-mood-text {
  font-size: 13px;
  color: #111827;
  font-weight: 700;
}

/* 사진 */
.d-photo-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.d-photo-url {
  display: flex;
  gap: 8px;
}
.d-photo-file {
  display: flex;
  gap: 8px;
  align-items: center;
}
.d-btn-ghost {
  background: #fff;
  border: 1px solid #e6e8ee;
  color: #111827;
  padding: 10px 14px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 700;
}
.d-btn-ghost:hover {
  background: #f3f4f8;
}
.mr {
  margin-right: 6px;
}
.hidden {
  display: none;
}

.d-thumbs {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}
.d-thumb {
  position: relative;
  border: 1px solid #eef0f4;
  border-radius: 12px;
  overflow: hidden;
  aspect-ratio: 16 / 9;
}
.d-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.d-thumb-del {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 24px;
  height: 24px;
  border-radius: 999px;
  background: #fee2e2;
  border: 1px solid #fecaca;
  color: #b91c1c;
  cursor: pointer;
}
.d-thumb-del:hover {
  background: #fecaca;
}

/* 저장 버튼 */
.d-btn-primary {
  background: #0b0b2b;
  color: #fff;
  border: 0;
  padding: 12px 16px;
  border-radius: 999px;
  font-weight: 800;
  cursor: pointer;
}
.d-btn-primary:hover {
  background: #11113a;
}

/* 오늘 쓴 일기 카드 */
.today-card {
  margin-top: 8px;
  background: #fff;
  border: 1px solid #eef0f4;
  border-radius: 18px;
  padding: 16px;
}
.today-head h3 {
  margin: 0 0 10px;
  font-size: 16px;
  font-weight: 800;
  color: #111827;
}
.today-body {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.today-date {
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 4px;
}
.today-row {
  display: flex;
  gap: 10px;
  font-size: 14px;
}
.today-label {
  width: 70px;
  color: #9ca3af;
}
.today-value {
  color: #111827;
}
.today-value.multiline {
  white-space: pre-wrap;
}
.today-photos {
  align-items: flex-start;
}
.today-photo-list {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
.today-photo-list img {
  width: 72px;
  height: 72px;
  border-radius: 10px;
  object-fit: cover;
  border: 1px solid #e5e7eb;
}

@media (max-width: 920px) {
  .d-mood-row {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
