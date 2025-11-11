<template>
  <div :class="[baseClass, props.class]" v-bind="attrs">
    <slot />
  </div>
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
const baseClass = 'p-6 pt-0';
</script>
