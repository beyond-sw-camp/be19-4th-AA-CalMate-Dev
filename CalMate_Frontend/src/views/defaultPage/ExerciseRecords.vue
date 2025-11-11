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

    <div class="summary-section">
      <ExerciseSummaryCard
        :icon="blueIcon"
        label="총 운동 시간"
        :value="totalMinutes"
        unit="분"
        colorClass="blue"
      />
      <ExerciseSummaryCard
        :icon="orangeIcon"
        label="소모 칼로리"
        :value="totalKcal"
        unit="kcal"
        colorClass="orange"
      />
      <ExerciseSummaryCard
        :icon="greenIcon"
        label="운동 횟수"
        :value="totalCount"
        unit="회"
        colorClass="green"
      />
    </div>

    <ExerciseTodayList
      :records="records"
      @delete="deleteRecord"
      @edit="editRecord"
    />

    <ExerciseRecordModal
      :visible="isModalOpen"
      :initial-data="editingData"
      :mode="editingId ? 'edit' : 'create'"
      @close="closeModal"
      @save="saveRecord"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import api from '@/lib/api'

import ExerciseSummaryCard from '@/components/exerciseRecords/ExerciseSummaryCard.vue'
import ExerciseTodayList from '@/components/exerciseRecords/ExerciseTodayList.vue'
import ExerciseRecordModal from '@/components/exerciseRecords/ExerciseRecordModal.vue'

import blueIcon from '@/assets/images/exerciseRecords/bruedumbel.png'
import orangeIcon from '@/assets/images/exerciseRecords/orangedumbel.png'
import greenIcon from '@/assets/images/exerciseRecords/greendumbel.png'
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

onMounted(() => {
  loadRecords()
})

watch(selectedDateStr, () => {
  loadRecords()
})

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
.summary-section {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}
</style>
