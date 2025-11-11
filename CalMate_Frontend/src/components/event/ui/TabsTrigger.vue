<template>
  <button
    type="button"
    :class="[
      baseClass,
      isActive ? activeClass : inactiveClass,
      props.class,
    ]"
    @click="handleClick"
    v-bind="attrs"
  >
    <slot />
  </button>
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

const emit = defineEmits(['click']);
const attrs = useAttrs();
const { value, setValue } = useTabsContext();

const baseClass =
  'inline-flex min-w-[5rem] items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

const activeClass = 'bg-background text-foreground shadow';
const inactiveClass = 'text-muted-foreground hover:text-foreground';

const isActive = computed(() => value.value === props.value);

function handleClick(event) {
  emit('click', event);

  if (!event.defaultPrevented) {
    setValue(props.value);
  }
}
</script>
