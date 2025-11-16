<template>
  <div class="stats-grid stats-grid--three">
    <StatCard
      v-for="item in items"
      :key="item.id"
      :label="item.label"
      :value="item.value"
      :suffix="item.suffix"
      :helper="item.helper"
      :icon="item.icon"
      :icon-color="item.iconColor"
      :tint="item.tint"
      :clickable="item.clickable"
      @click="$emit('item-click', item)"
    />
  </div>
</template>

<script setup>
import StatCard from './StatCard.vue';
defineProps({ items: { type: Array, required: true } });
defineEmits(['item-click']);
</script>

<style scoped>
.stats-grid { margin-top:1.5rem; display:grid; gap:1rem; }
.stats-grid--three { grid-template-columns: repeat(3, minmax(180px, 1fr)); }
@media (max-width: 900px) { .stats-grid--three { grid-template-columns: 1fr; } }
</style>