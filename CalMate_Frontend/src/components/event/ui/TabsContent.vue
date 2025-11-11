<template>
  <div
    v-if="isActive"
    role="tabpanel"
    :class="[baseClass, props.class]"
    v-bind="attrs"
  >
    <slot />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useAttrs } from 'vue';
import { useTabsContext } from './tabsContext.js';

const props = defineProps({
  value: {
    type: String,
    required: true,
  },
  class: {
    type: [String, Array, Object],
    default: '',
  },
});

const attrs = useAttrs();
const { value } = useTabsContext();

const baseClass = 'mt-2 focus-visible:outline-none focus-visible:ring-0';
const isActive = computed(() => value.value === props.value);
</script>
