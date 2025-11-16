<template>
  <MealSection
    label="아침"
    @update-total="$emit('update-total', $event)"
    @meal-point-earned="$emit('meal-point-earned')"
  />
</template>

<script setup>
import MealSection from './MealSection.vue'

const emit = defineEmits(['update-total', 'meal-point-earned'])
</script>

<style scoped></style>
