<template>
  <div class="exercise-records">
    <div class="header">
      <div class="title-wrap">
        <h2>운동 기록</h2>
        <p class="sub">
          오늘 {{ totalMinutes }}분 운동 · {{ totalKcal }} kcal 소모
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
    />

    <ExerciseRecordModal
      :visible="isModalOpen"
      @close="closeModal"
      @save="addRecord"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import ExerciseSummaryCard from '@/components/exerciseRecords/ExerciseSummaryCard.vue'
import ExerciseTodayList from '@/components/exerciseRecords/ExerciseTodayList.vue'
import ExerciseRecordModal from '@/components/exerciseRecords/ExerciseRecordModal.vue'

import blueIcon from '@/assets/images/exerciseRecords/bruedumbel.png'
import orangeIcon from '@/assets/images/exerciseRecords/orangedumbel.png'
import greenIcon from '@/assets/images/exerciseRecords/greendumbel.png'
import plusIcon from '@/assets/images/exerciseRecords/plus.png'

const records = ref([])

const isModalOpen = ref(false)

const openModal = () => {
  isModalOpen.value = true
}
const closeModal = () => {
  isModalOpen.value = false
}

const addRecord = payload => {
  records.value = [
    ...records.value,
    {
      id: Date.now(),
      ...payload
    }
  ]
  isModalOpen.value = false
}

const deleteRecord = id => {
  records.value = records.value.filter(r => r.id !== id)
}

const totalMinutes = computed(() =>
  records.value.reduce((sum, r) => sum + (Number(r.minutes) || 0), 0)
)

const totalKcal = computed(() =>
  records.value.reduce((sum, r) => sum + (Number(r.kcal) || 0), 0)
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
  color: #0A0A0A;
}
.title-wrap .sub {
  font-size: 16px;
  color: #717182;
}
.add-btn {
  background-color: #030213;
  color: #FFFFFF;
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
}
</style>
