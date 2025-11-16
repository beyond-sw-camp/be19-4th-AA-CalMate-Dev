<template>
  <div class="exercise-records">
    <div class="header">
      <div class="title-wrap">
        <h2>운동 기록</h2>
        <p class="sub">
          {{ selectedDateLabel }} {{ totalMinutes }}분 운동 · {{ totalKcal }} kcal 소모
        </p>
      </div>
      <button class="add-btn" @click="openModal">
        <img :src="plusIcon" alt="add" class="add-icon" />
        운동 추가
      </button>
    </div>

    <!-- 영양소 요약 카드 -->
    <section class="nutrition-summary">
      <div class="nutrition-card">
        <div class="nutrition-icon">
          <Clock :size="28" :stroke-width="2.5" />
        </div>
        <div class="nutrition-info">
          <div class="nutrition-label">총 운동 시간</div>
          <div class="nutrition-value">{{ totalMinutes }}분</div>
        </div>
      </div>
      <div class="nutrition-card">
        <div class="nutrition-icon">
          <Flame :size="28" :stroke-width="2.5" />
        </div>
        <div class="nutrition-info">
          <div class="nutrition-label">소모 칼로리</div>
          <div class="nutrition-value">{{ totalKcal }}</div>
        </div>
      </div>
      <div class="nutrition-card">
        <div class="nutrition-icon">
          <Dumbbell :size="28" :stroke-width="2.5" />
        </div>
        <div class="nutrition-info">
          <div class="nutrition-label">운동 횟수</div>
          <div class="nutrition-value">{{ totalCount }}회</div>
        </div>
      </div>
    </section>

    <ExerciseTodayList
      :records="records"
      @delete="deleteRecord"
      @edit="editRecord"
    />

    <!-- 운동 입력 모달 -->
    <ExerciseRecordModal
      :visible="isModalOpen"
      :initial-data="editingData"
      :mode="editingId ? 'edit' : 'create'"
      @close="closeModal"
      @save="saveRecord"
    />

    <!-- ✅ 포인트 적립 모달 -->
    <div v-if="showPointModal" class="point-modal-overlay">
      <div class="point-modal-box">
        <h3>🎉 5포인트가 적립되었습니다!</h3>
        <p>운동 기록 보상이에요 💪</p>
        <button class="point-modal-btn" @click="closePointModal">확인</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import api from '@/lib/api'
import { Clock, Flame, Dumbbell } from 'lucide-vue-next'

import ExerciseTodayList from '@/components/exerciseRecords/ExerciseTodayList.vue'
import ExerciseRecordModal from '@/components/exerciseRecords/ExerciseRecordModal.vue'

import plusIcon from '@/assets/images/exerciseRecords/plus.png'

import {
  fetchExerciseRecords,
  createExerciseRecord,
  updateExerciseRecord,
  deleteExerciseRecord as deleteExerciseRecordApi,
} from '@/api/exerciseRecords'

const apiBaseURL = (() => {
  const raw = api.defaults.baseURL || ''
  return raw.replace(/\/api$/, '').replace(/\/$/, '')
})()

const resolveFileUrl = (fileUrl) => {
  if (!fileUrl) return ''
  const cleaned = fileUrl.replace(/\/{2,}/g, '/')
  if (cleaned.startsWith('http://') || cleaned.startsWith('https://')) {
    return cleaned
  }
  const path = cleaned.startsWith('/') ? cleaned : '/' + cleaned
  return apiBaseURL + path
}

const route = useRoute()
const userStore = useUserStore()
const memberId = computed(() => userStore.userId)

const today = new Date()
const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
  2,
  '0',
)}-${String(today.getDate()).padStart(2, '0')}`

const selectedDateStr = computed(() => {
  const q = route.query.date
  if (typeof q === 'string' && q.match(/^\d{4}-\d{2}-\d{2}$/)) return q
  return todayStr
})

const selectedDateLabel = computed(() => {
  const d = new Date(selectedDateStr.value)
  if (Number.isNaN(d.getTime())) return selectedDateStr.value
  return d.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})

const records = ref([])
const isModalOpen = ref(false)
const editingId = ref(null)
const editingData = ref(null)
const showPointModal = ref(false)

const loadRecords = async () => {
  try {
    if (!memberId.value) return

    const res = await fetchExerciseRecords({
      memberId: memberId.value,
      date: selectedDateStr.value,
    })

    const list = res.data || []

    records.value = list.map((r) => {
      const files = (r.files || []).map((f) => ({
        ...f,
        url: resolveFileUrl(f.url),
        thumbUrl: resolveFileUrl(f.thumbUrl || f.url),
      }))

      return {
        id: r.exerciseId,
        type: r.type,
        minutes: r.min,
        kcal: r.burnedKcal,
        files,
        imageUrl: files.length ? files[0].url : null,
      }
    })
  } catch (e) {
    console.error('운동 기록 조회 실패', e)
  }
}

onMounted(loadRecords)
watch(selectedDateStr, loadRecords)

const openModal = () => {
  editingId.value = null
  editingData.value = null
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  editingId.value = null
  editingData.value = null
}

const closePointModal = () => {
  showPointModal.value = false
}

const saveRecord = async (payload) => {
  try {
    if (!memberId.value) {
      alert('로그인 정보가 없습니다.')
      return
    }

    if (editingId.value) {
      await updateExerciseRecord(editingId.value, {
        memberId: memberId.value,
        date: selectedDateStr.value,
        type: payload.type,
        category: null,
        minutes: payload.minutes,
        kcal: payload.kcal,
        files: payload.files,
        keepFileIds: payload.keepFileIds,
      })
    } else {
      await createExerciseRecord({
        memberId: memberId.value,
        date: selectedDateStr.value,
        type: payload.type,
        category: null,
        minutes: payload.minutes,
        kcal: payload.kcal,
        files: payload.files,
      })

      // ✅ 기록할 때마다 무조건 포인트 모달 표시
      showPointModal.value = true
    }

    await loadRecords()
    closeModal()
  } catch (e) {
    console.error('운동 기록 저장 실패', e)
    alert('운동 기록 저장에 실패했습니다.')
  }
}

const deleteRecord = async (id) => {
  try {
    await deleteExerciseRecordApi(id)
    await loadRecords()
  } catch (e) {
    console.error('운동 기록 삭제 실패', e)
    alert('운동 기록 삭제에 실패했습니다.')
  }
}

const editRecord = (id) => {
  const target = records.value.find((r) => r.id === id)
  if (!target) return
  editingId.value = id
  editingData.value = {
    type: target.type,
    minutes: target.minutes,
    kcal: target.kcal,
    files: target.files,
    imageUrl: target.imageUrl,
  }
  isModalOpen.value = true
}

const totalMinutes = computed(() =>
  records.value.reduce((sum, r) => sum + (Number(r.minutes) || 0), 0),
)
const totalKcal = computed(() =>
  records.value.reduce((sum, r) => sum + (Number(r.kcal) || 0), 0),
)
const totalCount = computed(() => records.value.length)
</script>

<style scoped>
.exercise-records {
  padding: 24px 32px;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
.title-wrap h2 {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 4px;
  color: #0a0a0a;
}
.title-wrap .sub {
  font-size: 16px;
  color: #717182;
}
.add-btn {
  background-color: #030213;
  color: #ffffff;
  padding: 10px 18px;
  border-radius: 14px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
}
.add-icon {
  width: 16px;
  height: 16px;
}
/* 영양소 요약 카드 */
.nutrition-summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 16px;
}

.nutrition-card {
  background: #ffffff;
  border-radius: 14px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 14px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #e9edf4;
}

.nutrition-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.1);
}

.nutrition-icon {
  width: 48px;
  height: 48px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nutrition-card:nth-child(1) .nutrition-icon {
  background: #dbeafe;
  color: #3b82f6;
}

.nutrition-card:nth-child(2) .nutrition-icon {
  background: #ffe9d6;
  color: #ea580c;
}

.nutrition-card:nth-child(3) .nutrition-icon {
  background: #f5ecff;
  color: #a855f7;
}

.nutrition-info {
  flex: 1;
}

.nutrition-label {
  font-size: 12px;
  color: #7d8896;
  font-weight: 600;
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.nutrition-value {
  font-size: 24px;
  font-weight: 800;
  color: #161a1d;
  line-height: 1;
}

/* 반응형 */
@media (max-width: 1024px) {
  .nutrition-summary {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .exercise-records {
    padding: 16px;
  }

  .nutrition-summary {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .nutrition-card {
    padding: 16px;
  }

}

/* ✅ 포인트 모달 */
.point-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.point-modal-box {
  background: white;
  width: 380px;
  padding: 32px 26px;
  border-radius: 14px;
  text-align: center;
  animation: point-show 0.2s ease-out;
}

@keyframes point-show {
  from {
    transform: scale(0.85);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.point-modal-btn {
  margin-top: 18px;
  padding: 10px 18px;
  background: #6c63ff;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
}
</style>
