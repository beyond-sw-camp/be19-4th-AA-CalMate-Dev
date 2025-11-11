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
          <div class="month"><span class="emoji">📅</span> {{ monthLabel }}</div>
          <button class="nav-btn" type="button" @click="nextMonth" aria-label="다음 달">›</button>
        </header>

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
        <h3 class="details-title">날짜를 선택하세요</h3>
        <div v-if="!selectedDate" class="empty">
          <div class="empty-icon">🗓️</div>
          <div class="empty-text">날짜를 선택하여 상세 내용을 확인하세요</div>
        </div>
        <div v-else class="detail-body">
          <div class="detail-date">{{ selectedLabel }}</div>
          <div class="detail-section">선택한 날짜의 데이터가 여기 표시됩니다.</div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const currentDate = ref(new Date())
const selectedDate = ref(null)

const dayNames = ['일','월','화','수','목','금','토']

const monthMeta = computed(() => getDaysInMonth(currentDate.value))

const monthLabel = computed(() =>
  new Date(monthMeta.value.year, monthMeta.value.month, 1).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
  })
)

const selectedLabel = computed(() => {
  if (!selectedDate.value) return ''
  return selectedDate.value.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' })
})

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
    const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
    const isSelected =
      selectedDate.value &&
      selectedDate.value.getDate() === day &&
      selectedDate.value.getMonth() === month &&
      selectedDate.value.getFullYear() === year

    cells.push({
      key: `${year}-${month + 1}-${day}`,
      isPlaceholder: false,
      dayNumber: day,
      isToday,
      isSelected,
    })
  }
  return cells
})

function getDaysInMonth(date) {
  const year = date.getFullYear()
  const month = date.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startingDayOfWeek = firstDay.getDay()
  return { daysInMonth, startingDayOfWeek, year, month }
}

function selectDate(day) {
  const { year, month } = monthMeta.value
  selectedDate.value = new Date(year, month, day)
}

function previousMonth() {
  const d = currentDate.value
  currentDate.value = new Date(d.getFullYear(), d.getMonth() - 1, 1)
}

function nextMonth() {
  const d = currentDate.value
  currentDate.value = new Date(d.getFullYear(), d.getMonth() + 1, 1)
}

function dayColor(index) {
  if (index === 0) return 'sun'
  if (index === 6) return 'sat'
  return ''
}
</script>

<style scoped>
.cal-wrap { display: flex; flex-direction: column; gap: 16px; }
.page-title { margin: 0; font-size: 22px; font-weight: 800; color: #111827; }
.page-sub { margin: 4px 0 0; color: #6b7280; }

.cols { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
.card { background: #fff; border: 1px solid #eef0f4; border-radius: 18px; padding: 16px; }

.calendar { display: flex; flex-direction: column; gap: 12px; }
.cal-head { display: flex; align-items: center; justify-content: space-between; }
.nav-btn { width: 36px; height: 36px; border-radius: 999px; border: 1px solid #e5e7eb; background: #fff; cursor: pointer; font-size: 18px; }
.nav-btn:hover { background: #f9fafb; }
.month { display: flex; align-items: center; gap: 8px; font-weight: 700; }
.emoji { font-size: 18px; }

.daynames { display: grid; grid-template-columns: repeat(7, 1fr); text-align: center; gap: 8px; color: #9ca3af; font-weight: 700; }
.daynames .sun { color: #ef4444; }
.daynames .sat { color: #3b82f6; }

.grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 8px; }
.cell { aspect-ratio: 1/1; border: 1px solid #e5e7eb; border-radius: 12px; background: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; }
.cell:hover { background: #f9fafb; }
.cell.placeholder { border-color: transparent; background: transparent; cursor: default; }
.cell.today { border-color: #3b82f6; box-shadow: inset 0 0 0 1px #3b82f6; }
.cell.selected { border-color: #111827; box-shadow: inset 0 0 0 2px #111827; }
.num { font-weight: 700; color: #111827; }

.legend { display: flex; gap: 14px; align-items: center; margin-top: 12px; padding-top: 12px; border-top: 1px solid #eef0f4; color: #6b7280; font-size: 14px; }
.dot { width: 8px; height: 8px; display: inline-block; border-radius: 999px; margin-right: 6px; }
.dot.green { background: #22c55e; }
.dot.blue { background: #3b82f6; }
.dot.purple { background: #8b5cf6; }

.details { display: flex; flex-direction: column; gap: 12px; }
.details-title { margin: 0; font-size: 16px; color: #374151; }
.empty { flex: 1; display: flex; flex-direction: column; gap: 8px; align-items: center; justify-content: center; color: #9ca3af; min-height: 220px; }
.empty-icon { font-size: 32px; }
.detail-body { display: flex; flex-direction: column; gap: 10px; }
.detail-date { font-weight: 800; color: #111827; }

@media (max-width: 980px) {
  .cols { grid-template-columns: 1fr; }
}
</style>

