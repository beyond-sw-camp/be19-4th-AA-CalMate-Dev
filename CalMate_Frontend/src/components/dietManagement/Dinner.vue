<template>
  <MealSection label="저녁" @update-total="$emit('update-total', $event)" />
</template>

<script setup>
import MealSection from './MealSection.vue'
const emit = defineEmits(['update-total'])
</script>

<style scoped></style>
