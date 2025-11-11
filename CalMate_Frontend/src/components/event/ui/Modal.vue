<template>
  <Teleport to="body">
    <transition name="modal-fade">
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex items-center justify-center px-4 py-6"
      >
        <div class="absolute inset-0 bg-background/80 backdrop-blur-sm" @click="handleOverlayClick" />
        <div
          class="relative z-10 w-full max-w-lg rounded-3xl bg-background p-6 shadow-xl"
          :class="props.class"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="titleId"
          :aria-describedby="descriptionId"
        >
          <button
            v-if="showClose"
            type="button"
            class="absolute right-4 top-4 rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            @click="emitClose"
          >
            <span class="sr-only">Close</span>
            ×
          </button>

          <div class="space-y-4">
            <header v-if="title || description" class="space-y-1">
              <h2
                v-if="title"
                :id="titleId"
                class="text-lg font-semibold leading-tight"
              >
                {{ title }}
              </h2>
              <p
                v-if="description"
                :id="descriptionId"
                class="text-sm text-muted-foreground"
              >
                {{ description }}
              </p>
            </header>

            <div>
              <slot />
            </div>
          </div>

          <div v-if="$slots.footer" class="mt-6 flex flex-wrap items-center justify-end gap-2">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { computed, onBeforeUnmount, watch } from 'vue';

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  class: {
    type: [String, Array, Object],
    default: '',
  },
  closeOnOverlay: {
    type: Boolean,
    default: true,
  },
  showClose: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(['close']);

const uniqueId = Math.random().toString(36).slice(2, 9);
const titleId = computed(() => (props.title ? `modal-title-${uniqueId}` : undefined));
const descriptionId = computed(() =>
  props.description ? `modal-description-${uniqueId}` : undefined,
);

function emitClose() {
  emit('close');
}

function handleOverlayClick() {
  if (props.closeOnOverlay) {
    emitClose();
  }
}

function handleKeydown(event) {
  if (event.key === 'Escape') {
    emitClose();
  }
}

watch(
  () => props.open,
  (value) => {
    if (value) {
      window.addEventListener('keydown', handleKeydown);
      document.body.classList.add('overflow-hidden');
    } else {
      window.removeEventListener('keydown', handleKeydown);
      document.body.classList.remove('overflow-hidden');
    }
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown);
  document.body.classList.remove('overflow-hidden');
});
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
