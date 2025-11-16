<template>
  <div class="summary-card">
    <div class="icon-circle" :class="colorClass">
      <img :src="icon" alt="icon" class="icon" />
    </div>
    <div class="text">
      <p class="label">{{ label }}</p>
      <p class="value">{{ value }} {{ unit }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  icon: String,
  label: String,
  value: [String, Number],
  unit: String,
  colorClass: String
})
</script>

<style scoped>
.summary-card {
  display: flex;
  width: 306px;
  height: 80px;
  align-items: center;
  justify-content: flex-start;
  border: 1px solid #eceef2;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.04);
  padding: 18px 22px;
  gap: 16px;
}

.icon-circle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.icon {
  width: 24px;
  height: 24px;
}

.icon-circle.blue {
  background-color: #DBEAFE;
}
.icon-circle.orange {
  background-color: #FFEDD4;
}
.icon-circle.green {
  background-color: #DCFCE7;
}

.text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
}
.label {
  color: #717182;
  font-weight: 400;
  font-size: 16px;
  margin-bottom: -10px;
}
.value {
  font-weight: 600;
  font-size: 16px;
  color: #0A0A0A;
}
</style>
