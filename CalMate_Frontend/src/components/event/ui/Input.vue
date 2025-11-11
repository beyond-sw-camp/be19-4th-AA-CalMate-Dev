<template>
  <input
    :type="type"
    :value="valueBinding"
    :class="[baseClass, props.class]"
    v-bind="attrs"
    @input="handleInput"
  />
</template>

<script setup>
import { computed } from 'vue';
import { useAttrs } from 'vue';

const props = defineProps({
  modelValue: {
    type: [String, Number, null],
    default: null,
  },
  type: {
    type: String,
    default: 'text',
  },
  class: {
    type: [String, Array, Object],
    default: '',
  },
});

const emit = defineEmits(['update:modelValue', 'input']);
const attrs = useAttrs();

const baseClass =
  'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';

const isFileInput = computed(() => props.type === 'file');
const valueBinding = computed(() =>
  isFileInput.value ? undefined : props.modelValue ?? '',
);

function handleInput(event) {
  if (!isFileInput.value) {
    emit('update:modelValue', event.target.value);
  }

  emit('input', event);
}
</script>
