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
const baseClass =
  'inline-flex h-10 items-center justify-start rounded-lg bg-muted p-1 text-muted-foreground';
</script>
