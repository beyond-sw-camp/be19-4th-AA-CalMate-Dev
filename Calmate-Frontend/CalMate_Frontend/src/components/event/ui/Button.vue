<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="classes"
    v-bind="attrs"
    @click="handleClick"
  >
    <slot />
  </button>
</template>

<script setup>
import { computed } from 'vue';
import { useAttrs } from 'vue';

const props = defineProps({
  variant: {
    type: String,
    default: 'default',
  },
  size: {
    type: String,
    default: 'md',
  },
  class: {
    type: [String, Array, Object],
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: 'button',
  },
});

const emit = defineEmits(['click']);
const attrs = useAttrs();

const variants = {
  default: 'bg-primary text-primary-foreground hover:bg-primary/90',
  secondary:
    'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  outline:
    'border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground',
  ghost: 'hover:bg-accent hover:text-accent-foreground',
  destructive:
    'bg-destructive text-destructive-foreground hover:bg-destructive/90',
};

const sizes = {
  sm: 'h-8 rounded-md px-3 text-xs',
  md: 'h-10 rounded-lg px-4 text-sm',
  lg: 'h-12 rounded-xl px-6 text-base',
  icon: 'h-10 w-10 rounded-lg',
};

const baseClass =
  'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';

const classes = computed(() => [
  baseClass,
  variants[props.variant] ?? variants.default,
  sizes[props.size] ?? sizes.md,
  props.class,
]);

function handleClick(event) {
  if (props.disabled) {
    event.preventDefault();
    return;
  }

  emit('click', event);
}
</script>
