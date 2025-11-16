<template>
  <div :class="[trackClass, props.class]" v-bind="attrs">
    <div class="h-full rounded-full bg-primary transition-all" :style="barStyle" />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useAttrs } from 'vue';

const props = defineProps({
  value: {
    type: Number,
    default: 0,
  },
  max: {
    type: Number,
    default: 100,
  },
  class: {
    type: [String, Array, Object],
    default: '',
  },
});

const attrs = useAttrs();
const trackClass = 'relative h-2 w-full overflow-hidden rounded-full bg-muted';

const barStyle = computed(() => {
  const max = props.max > 0 ? props.max : 100;
  const percentage = Math.min(100, Math.max(0, (props.value / max) * 100));

  return { width: `${percentage}%` };
});
</script>
