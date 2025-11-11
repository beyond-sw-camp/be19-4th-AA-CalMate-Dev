<template>
  <component :is="as" :class="[baseClass, props.class]" v-bind="attrs">
    <slot />
  </component>
</template>

<script setup>
import { useAttrs } from 'vue';

const props = defineProps({
  as: {
    type: String,
    default: 'h3',
  },
  class: {
    type: [String, Array, Object],
    default: '',
  },
});

const attrs = useAttrs();
const baseClass = 'text-lg font-semibold leading-none tracking-tight';
</script>
