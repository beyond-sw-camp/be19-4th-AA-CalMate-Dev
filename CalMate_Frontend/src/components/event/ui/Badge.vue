<template>
  <span :class="classes" v-bind="attrs">
    <slot />
  </span>
</template>

<script setup>
import { computed } from 'vue';
import { useAttrs } from 'vue';

const props = defineProps({
  variant: {
    type: String,
    default: 'default',
  },
  class: {
    type: [String, Array, Object],
    default: '',
  },
});

const attrs = useAttrs();
const variants = {
  default: 'bg-primary text-primary-foreground',
  secondary: 'bg-secondary text-secondary-foreground',
  outline: 'border border-input text-foreground',
};

const baseClass =
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2';

const classes = computed(() => [
  baseClass,
  variants[props.variant] ?? variants.default,
  props.class,
]);
</script>
