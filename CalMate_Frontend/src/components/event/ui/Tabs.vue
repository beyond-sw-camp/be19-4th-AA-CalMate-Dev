<template>
  <div :class="props.class" v-bind="attrs">
    <slot />
  </div>
</template>

<script setup>
import { computed, ref, provide, watch } from 'vue';
import { useAttrs } from 'vue';
import { tabsSymbol } from './tabsContext.js';

const props = defineProps({
  modelValue: {
    type: String,
    default: undefined,
  },
  defaultValue: {
    type: String,
    default: undefined,
  },
  class: {
    type: [String, Array, Object],
    default: '',
  },
});

const emit = defineEmits(['update:modelValue']);
const attrs = useAttrs();
const internalValue = ref(
  props.modelValue ?? props.defaultValue ?? '',
);

watch(
  () => props.modelValue,
  (value) => {
    if (value !== undefined) {
      internalValue.value = value;
    }
  },
);

watch(
  () => props.defaultValue,
  (value) => {
    if (props.modelValue === undefined && value !== undefined && !internalValue.value) {
      internalValue.value = value;
    }
  },
);

function setValue(value) {
  if (props.modelValue === undefined) {
    internalValue.value = value;
  }

  emit('update:modelValue', value);
}

provide(tabsSymbol, {
  value: computed(() => internalValue.value),
  setValue,
});
</script>
