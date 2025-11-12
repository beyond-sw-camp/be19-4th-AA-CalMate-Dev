<template>
  <div class="cal-wrap">
    <header class="page-head">
      <h2 class="page-title">활동 캘린더</h2>
      <p class="page-sub">날짜별 식단, 운동, 일기 기록을 확인하세요</p>
    </header>

    <div class="cols">
      <!-- Left: Calendar -->
      <section class="card calendar">
        <header class="cal-head">
          <button class="nav-btn" type="button" @click="previousMonth" aria-label="이전 달">‹</button>
          <div class="month"><span class="emoji">🗓️</span> {{ monthLabel }}</div>
          <button class="nav-btn" type="button" @click="nextMonth" aria-label="다음 달">›</button>
        </header>
        <div class="month-badges" @click="toggleBadgePopover" title="이번 달 트로피 개수">
          🏆 총 개수: <span class="count">{{ monthBadgeCount }}</span>
        </div>

        <div class="daynames">
          <span v-for="(day, i) in dayNames" :key="day" :class="dayColor(i)">{{ day }}</span>
        </div>

        <div class="grid">
          <template v-for="cell in calendarCells" :key="cell.key">
            <div v-if="cell.isPlaceholder" class="cell placeholder" />
            <button
              v-else
              class="cell"
              :class="[{ today: cell.isToday, selected: cell.isSelected }]"
              type="button"
              @click="selectDate(cell.dayNumber)"
            >
              <span class="num">{{ cell.dayNumber }}</span>
              <div class="marks">
                <span v-if="cell.flags.diet" class="mark diet" title="식단" />
                <span v-if="cell.flags.exercise" class="mark exercise" title="운동" />
                <span v-if="cell.flags.diary" class="mark diary" title="일기" />
              </div>
              <span v-if="cell.flags.allDone" class="trophy" title="올클리어">🏆</span>
            </button>
          </template>
        </div>

        <footer class="legend">
          <span class="dot green"></span> 식단
          <span class="dot blue"></span> 운동
          <span class="dot purple"></span> 일기
        </footer>
      </section>

      <!-- Right: Details -->
      <section class="card details">
        <h3 class="details-title">
          {{ selectedDate ? selectedLabel + ' 상세' : '날짜를 선택하세요' }}
        </h3>

        <div v-if="!selectedDate" class="empty">
          <div class="empty-icon">📅</div>
          <div class="empty-text">날짜를 선택하여 상세 내용을 확인하세요</div>
        </div>

        <div v-else class="detail-body">
          <!-- 요약 박스 클릭 → 식단 페이지 -->
          <div class="summary clickable" @click="goDiet">
            <div class="row">
              <div class="label">섭취 칼로리</div>
              <div class="value">{{ summary.intakeKcal }}<span class="unit">kcal</span></div>
            </div>
            <div class="row">
              <div class="label">소모 칼로리</div>
              <div class="value">{{ summary.burnKcal }}<span class="unit">kcal</span></div>
            </div>
            <div class="row total">
              <div class="label">순 칼로리</div>
              <div class="value">{{ summary.netKcal }}<span class="unit">kcal</span></div>
            </div>
          </div>

          <!-- 운동 박스 클릭 → 운동 페이지 -->
          <div class="workout" v-if="exerciseRecords.length" @click="goExercise">
            <div class="e-head">
              <span class="dot blue"></span>
              <span class="e-title">운동</span>
            </div>
            <ul class="e-list">
              <li v-for="(r, idx) in exerciseRecords" :key="idx" class="e-item">
                <div class="e-type">{{ r.type }}</div>
                <div class="e-meta">{{ r.minutes }}분 · {{ r.kcal }} kcal</div>
              </li>
            </ul>
          </div>
          <div class="workout" v-else @click="goExercise">
            <div class="e-head">
              <span class="dot blue"></span>
              <span class="e-title">운동</span>
            </div>
            <div class="j-empty">운동 기록이 없습니다.</div>
          </div>

          <div class="journal clickable" v-if="journalEntry" @click="openDiary">
            <div class="j-head">
              <span class="dot purple"></span>
              <span class="j-title">일기</span>
            </div>
            <div class="j-body">
              <div class="j-line" v-if="journalEntry.mood">
                기분: <span class="badge">{{ journalEntry.moodLabel }}</span>
              </div>
              <div class="j-line" v-if="journalEntry.condition">
                컨디션: {{ journalEntry.condition }}
              </div>
              <div class="j-notes" v-if="journalEntry.notes">
                {{ journalEntry.notes }}
              </div>
              <div class="j-empty" v-else>작성된 메모가 없습니다.</div>
            </div>
          </div>
        </div>
      </section>
      
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { fetchExerciseRecords } from '@/api/exerciseRecords'
import { getDietByType } from '@/api/diet'
import { useUserStore } from '@/stores/user'

const MEAL_TYPES = ['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK']

function toKey(y, m, d) {
  const mm = String(m + 1).padStart(2, '0')
  const dd = String(d).padStart(2, '0')
  return `${y}-${mm}-${dd}`
}

function safeParse(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || 'null')
  } catch {
    return null
  }
}

const router = useRouter()
const userStore = useUserStore()
const currentDate = ref(new Date())
const selectedDate = ref(null)
const memberId = computed(() => userStore.userId)

const dayNames = ['일', '월', '화', '수', '목', '금', '토']

const monthMeta = computed(() => getDaysInMonth(currentDate.value))
const monthLabel = computed(() =>
  new Date(monthMeta.value.year, monthMeta.value.month, 1).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long'
  })
)

const selectedLabel = computed(() => {
  if (!selectedDate.value) return ''
  return selectedDate.value.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short'
  })
})

const diariesByDate = computed(() => {
  const arr = safeParse('journalEntries') || []
  const map = {}
  for (const e of arr) {
    if (!e?.date) continue
    map[e.date] = e
  }
  return map
})

const dietTotalsByDate = ref({})
const exerciseByDate = ref({})

const calendarCells = computed(() => {
  const { daysInMonth, startingDayOfWeek, year, month } = monthMeta.value
  const totalCells = Math.ceil((daysInMonth + startingDayOfWeek) / 7) * 7
  const today = new Date()
  const cells = []
  for (let i = 0; i < totalCells; i++) {
    if (i < startingDayOfWeek || i >= daysInMonth + startingDayOfWeek) {
      cells.push({ key: `empty-${i}`, isPlaceholder: true })
      continue
    }
    const day = i - startingDayOfWeek + 1
    const isToday =
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    const isSelected =
      selectedDate.value &&
      selectedDate.value.getDate() === day &&
      selectedDate.value.getMonth() === month &&
      selectedDate.value.getFullYear() === year
    const key = toKey(year, month, day)
    const hasDiary = Boolean(diariesByDate.value[key])
    const intake = Number(dietTotalsByDate.value[key]?.totalKcal || 0)
    const burn = Number(exerciseByDate.value[key]?.burnKcal || 0)
    cells.push({
      key: `${year}-${month + 1}-${day}`,
      isPlaceholder: false,
      dayNumber: day,
      isToday,
      isSelected,
      flags: {
        diary: hasDiary,
        diet: intake > 0,
        exercise: burn > 0,
        allDone: hasDiary && intake > 0 && burn > 0
      }
    })
  }
  return cells
})

const badgeDays = computed(() => {
  const { daysInMonth, year, month } = monthMeta.value
  const res = []
  for (let d = 1; d <= daysInMonth; d++) {
    const key = toKey(year, month, d)
    const hasDiary = Boolean(diariesByDate.value[key])
    const intake = Number(dietTotalsByDate.value[key]?.totalKcal || 0)
    const burn = Number(exerciseByDate.value[key]?.burnKcal || 0)
    if (hasDiary && intake > 0 && burn > 0) res.push(d)
  }
  return res
})
const monthBadgeCount = computed(() => badgeDays.value.length)
const showBadgePopover = ref(false)
function toggleBadgePopover() {
  showBadgePopover.value = !showBadgePopover.value
}

function getDaysInMonth(date) {
  const year = date.getFullYear()
  const month = date.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startingDayOfWeek = firstDay.getDay()
  return { daysInMonth, startingDayOfWeek, year, month }
}

async function selectDate(day) {
  const { year, month } = monthMeta.value
  const dateObj = new Date(year, month, day)
  selectedDate.value = dateObj
  if (!memberId.value) return
  const dateKey = toKey(year, month, day)

  try {
    const dietResponses = await Promise.all(
      MEAL_TYPES.map(type =>
        getDietByType({ date: dateKey, type, memberId: memberId.value })
      )
    )
    const dietList = dietResponses.flatMap(res => res.data || [])
    const intakeKcal = dietList.reduce((sum, item) => {
      const kcalFromFood =
        item?.food && item.food.kcal != null ? Number(item.food.kcal) : 0
      const kcalDirect =
        item?.kcal != null ? Number(item.kcal) : 0
      const kcal = !isNaN(kcalFromFood) && kcalFromFood > 0 ? kcalFromFood : kcalDirect
      return sum + (isNaN(kcal) ? 0 : kcal)
    }, 0)

    dietTotalsByDate.value = {
      ...dietTotalsByDate.value,
      [dateKey]: { totalKcal: intakeKcal }
    }

    const { data: exerciseList = [] } = await fetchExerciseRecords({
      memberId: memberId.value,
      date: dateKey
    })
    const normalizedExerciseList = Array.isArray(exerciseList)
      ? exerciseList.map(r => ({
          ...r,
          minutes: r.min,
          kcal: r.burnedKcal
        }))
      : []
    const burnKcal = normalizedExerciseList.reduce((sum, item) => {
      const v = Number(item.kcal ?? 0)
      return sum + (isNaN(v) ? 0 : v)
    }, 0)
    exerciseByDate.value = {
      ...exerciseByDate.value,
      [dateKey]: {
        burnKcal,
        records: normalizedExerciseList
      }
    }
  } catch (e) {
    console.error('calendar selectDate error', e)
    dietTotalsByDate.value = {
      ...dietTotalsByDate.value,
      [dateKey]: { totalKcal: 0 }
    }
    exerciseByDate.value = {
      ...exerciseByDate.value,
      [dateKey]: { burnKcal: 0, records: [] }
    }
  }
}

function previousMonth() {
  const d = currentDate.value
  currentDate.value = new Date(d.getFullYear(), d.getMonth() - 1, 1)
  showBadgePopover.value = false
}

function nextMonth() {
  const d = currentDate.value
  currentDate.value = new Date(d.getFullYear(), d.getMonth() + 1, 1)
  showBadgePopover.value = false
}

function dayColor(index) {
  if (index === 0) return 'sun'
  if (index === 6) return 'sat'
  return ''
}

const summary = computed(() => {
  if (!selectedDate.value) return { intakeKcal: 0, burnKcal: 0, netKcal: 0 }
  const key = toKey(
    selectedDate.value.getFullYear(),
    selectedDate.value.getMonth(),
    selectedDate.value.getDate()
  )
  const intakeKcal = Number(dietTotalsByDate.value[key]?.totalKcal || 0)
  const burnKcal = Number(exerciseByDate.value[key]?.burnKcal || 0)
  return { intakeKcal, burnKcal, netKcal: intakeKcal - burnKcal }
})

const journalEntry = computed(() => {
  if (!selectedDate.value) return null
  const key = toKey(
    selectedDate.value.getFullYear(),
    selectedDate.value.getMonth(),
    selectedDate.value.getDate()
  )
  const entry = diariesByDate.value[key]
  if (!entry) return null
  const moodMap = {
    great: '아주 좋음',
    good: '좋음',
    normal: '보통',
    bad: '나쁨',
    terrible: '아주 나쁨'
  }
  return { ...entry, moodLabel: moodMap[entry.mood] || entry.mood }
})

const exerciseRecords = computed(() => {
  if (!selectedDate.value) return []
  const key = toKey(
    selectedDate.value.getFullYear(),
    selectedDate.value.getMonth(),
    selectedDate.value.getDate()
  )
  const rec = exerciseByDate.value[key]?.records || []
  return Array.isArray(rec) ? rec : []
})

function getSelectedDateKey() {
  if (!selectedDate.value) return null
  return toKey(
    selectedDate.value.getFullYear(),
    selectedDate.value.getMonth(),
    selectedDate.value.getDate()
  )
}

function goDiet() {
  const key = getSelectedDateKey()
  if (!key) return
  router.push({
    path: '/main/dietmanagement', 
    query: { date: key }
  })
}

function goExercise() {
  const key = getSelectedDateKey()
  if (!key) return
  router.push({
    path: '/main/exerciseRecords', 
    query: { date: key }
  })
}

function openDiary() {
  if (!selectedDate.value) return
  const key = getSelectedDateKey()
  router.push({ name: 'main-diary-done', query: { date: key } })
}
</script>

<style scoped>
.cal-wrap { display: flex; flex-direction: column; gap: 16px; }
.page-title { margin: 0; font-size: 22px; font-weight: 800; color: #111827; }
.page-sub { margin: 4px 0 0; color: #6b7280; }

.cols { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
.card { background: #fff; border: 1px solid #eef0f4; border-radius: 18px; padding: 16px; }

.calendar { display: flex; flex-direction: column; gap: 12px; }
.cal-head { display: flex; align-items: center; gap: 8px; }
.nav-btn { width: 36px; height: 36px; border-radius: 999px; border: 1px solid #e5e7eb; background: #fff; cursor: pointer; font-size: 18px; }
.nav-btn:hover { background: #f9fafb; }
.month { display: flex; align-items: center; gap: 8px; font-weight: 700; }
.emoji { font-size: 18px; }

.daynames { display: grid; grid-template-columns: repeat(7, 1fr); text-align: center; gap: 8px; color: #9ca3af; font-weight: 700; }
.daynames .sun { color: #ef4444; }
.daynames .sat { color: #3b82f6; }

.grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 8px; }
.cell { position: relative; aspect-ratio: 1/1; border: 1px solid #e5e7eb; border-radius: 12px; background: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-direction: column; }
.cell:hover { background: #f9fafb; }
.cell.placeholder { border-color: transparent; background: transparent; cursor: default; }
.cell.today { border-color: #3b82f6; box-shadow: inset 0 0 0 1px #3b82f6; }
.cell.selected { border-color: #111827; box-shadow: inset 0 0 0 2px #111827; }
.num { font-weight: 700; color: #111827; }

.marks { position: absolute; bottom: 6px; display: flex; gap: 6px; }
.mark { width: 6px; height: 6px; border-radius: 999px; display: inline-block; }
.mark.diet { background: #22c55e; }
.mark.exercise { background: #3b82f6; }
.mark.diary { background: #8b5cf6; }
.trophy { position: absolute; top: 6px; right: 6px; font-size: 14px; }

.legend { display: flex; gap: 14px; align-items: center; margin-top: 12px; padding-top: 12px; border-top: 1px solid #eef0f4; color: #6b7280; font-size: 14px; }
.dot { width: 8px; height: 8px; display: inline-block; border-radius: 999px; margin-right: 6px; }
.dot.green { background: #22c55e; }
.dot.blue { background: #3b82f6; }
.dot.purple { background: #8b5cf6; }

.details { display: flex; flex-direction: column; gap: 12px; }
.details-title { margin: 0; font-size: 16px; color: #374151; }
.empty { flex: 1; display: flex; flex-direction: column; gap: 8px; align-items: center; justify-content: center; color: #9ca3af; min-height: 220px; }
.empty-icon { font-size: 32px; }
.detail-body { display: flex; flex-direction: column; gap: 12px; }
.detail-date { font-weight: 800; color: #111827; }

.summary { border: 1px solid #eef0f4; border-radius: 12px; overflow: hidden; }
.summary .row { display: flex; justify-content: space-between; padding: 10px 12px; border-bottom: 1px solid #eef0f4; }
.summary .row:last-child { border-bottom: none; }
.summary .row.total .value { color: #16a34a; font-weight: 700; }
.summary .label { color: #6b7280; }
.summary .value { color: #111827; }
.summary .unit { margin-left: 4px; color: #9ca3af; }

.workout { border: 1px solid #eef0f4; border-radius: 12px; padding: 10px 12px; }
.e-head { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.e-title { font-weight: 700; color: #374151; }
.e-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; }
.e-item { display: flex; align-items: center; justify-content: space-between; }
.e-type { font-weight: 600; color: #111827; }
.e-meta { color: #6b7280; }

.journal { border: 1px solid #eef0f4; border-radius: 12px; padding: 10px 12px; }
.journal.clickable { cursor: pointer; }
.journal.clickable:hover { background: #fafafb; }
.j-head { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.j-title { font-weight: 700; color: #374151; }
.badge { background: #f3f4f6; color: #374151; border-radius: 8px; padding: 2px 6px; font-size: 12px; margin-left: 4px; }
.j-notes { margin-top: 6px; color: #374151; }
.j-empty { color: #9ca3af; }

.summary.clickable {
  cursor: pointer;
}

.summary.clickable:hover {
  background-color: #f9fafb;
}

.workout {
  cursor: pointer;
}

.workout:hover {
  background-color: #f9fafb;
}


@media (max-width: 980px) {
  .cols { grid-template-columns: 1fr; }
}
</style>

\n.month-badges { margin-left: auto; font-weight: 800; color: #111827; background: #fff7ed; border: 1px solid #fdebd3; padding: 6px 10px; border-radius: 999px; display: flex; align-items: center; gap: 6px; }\n.month-badges .count { color: #c2410c; }\n
