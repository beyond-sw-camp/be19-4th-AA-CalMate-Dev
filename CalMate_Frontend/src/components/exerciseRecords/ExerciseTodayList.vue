<template>
  <div class="today-wrapper">
    <h3 class="title">오늘의 운동</h3>

    <div v-if="records.length === 0" class="empty">
      아직 기록된 운동이 없습니다
    </div>

    <div v-else class="list">
      <div
        v-for="item in records"
        :key="item.id"
        class="record-card"
      >
        <div class="header-row">
          <p class="summary">
            <span class="type">{{ item.type }}</span>
            <span class="dot">·</span>
            <span class="time">{{ item.minutes }}분</span>
            <span class="dot">·</span>
            <span class="cal">{{ item.kcal }} kcal</span>
          </p>

          <div class="actions">
            <button class="icon-btn" type="button">
              <img :src="uploadIcon" alt="공유" class="icon-img" />
            </button>
            <button
              class="icon-btn delete"
              type="button"
              @click="$emit('delete', item.id)"
            >
              <img :src="deleteIcon" alt="삭제" class="icon-img" />
            </button>
          </div>
        </div>

        <div class="image-wrap">
          <img :src="item.imageUrl || exampleImage" alt="운동 사진" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import uploadIcon from '@/assets/images/exerciseRecords/upload.png'
import deleteIcon from '@/assets/images/delete.png'
import exampleImage from '@/assets/images/exerciseRecords/exerciseexample.png'

defineProps({
  records: {
    type: Array,
    default: () => []
  }
})

defineEmits(['delete'])
</script>

<style scoped>
.today-wrapper {
  margin-top: 24px;
  border-radius: 20px;
  border: 1px solid #e5e6eb;
  padding: 20px 22px;
  background-color: #ffffff;
}

.title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
}

.empty {
  text-align: center;
  color: #8c8f99;
  padding: 40px 0;
  font-size: 14px;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.record-card {
  border-radius: 16px;
  border: 1px solid #eceef2;
  padding: 18px 20px;
  background-color: #ffffff;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.summary {
  font-size: 15px;
  font-weight: 600;
  color: #111827;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
}

.type {
  font-weight: 600;
}

.time,
.cal {
  font-weight: 500;
  color: #4b5563;
}

.dot {
  margin: 0 2px;
  color: #9ca3af;
}

.actions {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
}

.icon-btn {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  border: 1px solid #e2e4ea;
  background-color: #ffffff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.icon-btn.delete {
  border-color: #f3c2c2;
}

.icon-img {
  width: 16px;
  height: 16px;
  display: block;
}

.image-wrap {
  margin-top: 14px;
  width: 100%;
  border-radius: 14px;
  overflow: hidden;
}

.image-wrap img {
  width: 100%;
  height: 280px;
  object-fit: cover;
  border-radius: 14px;
  display: block;
}
</style>
