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
    default: 'div',
  },
  class: {
    type: [String, Array, Object],
    default: '',
  },
});

const attrs = useAttrs();
const baseClass =
  'rounded-3xl border border-muted bg-card text-card-foreground shadow-sm';
</script>
