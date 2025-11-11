<template>
  <label :class="[baseClass, props.class]" v-bind="attrs">
    <slot />
  </label>
</template>

<script setup>
import { useAttrs } from 'vue';

const props = defineProps({
  class: {
    type: [String, Array, Object],
    default: '',
  },
});

const attrs = useAttrs();
const baseClass = 'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70';
</script>
