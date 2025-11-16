<template>
  <MealSection
    label="간식"
    @update-total="(val) => emit('update-total', val)"
    @meal-point-earned="() => emit('meal-point-earned')"
  />
</template>

<script setup>
import MealSection from './MealSection.vue'
const emit = defineEmits(['update-total', 'meal-point-earned'])
</script>

<style scoped></style>
