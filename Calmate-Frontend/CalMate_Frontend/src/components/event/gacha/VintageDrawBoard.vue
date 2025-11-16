<template>
  <div class="draw-board">
    <div class="draw-board__decor draw-board__decor--left"></div>
    <div class="draw-board__decor draw-board__decor--right"></div>

    <div class="draw-board__header">
      <div>
        <p class="draw-board__title">행운의 뽑기판</p>
        <p class="draw-board__meta">남은 기회: <strong>{{ availableSlots }}</strong>회</p>
      </div>
      <span class="draw-board__count">{{ revealedCount }} / {{ totalSlots }}</span>
    </div>

    <div
      class="draw-board__grid"
      :style="{ gridTemplateColumns: `repeat(${gridSize.cols}, 1fr)` }"
    >
      <button
        v-for="index in totalSlots"
        :key="index"
        type="button"
        class="draw-board__cell"
        :class="slotClass(index - 1)"
        :disabled="isDisabled(index - 1)"
        @click="handleCellClick(index - 1)"
      >
        <span v-if="!isSlotRevealed(index - 1)">{{ index }}</span>
        <span v-else class="draw-board__cell--revealed">완료</span>
      </button>
    </div>

    <div class="draw-board__footer">
      <span class="draw-board__phrase">✨ 행운을 기원합니다 ✨</span>
      <span class="draw-board__progress-value">{{ progressPercent }}%</span>
    </div>
    <div class="draw-board__progress">
      <div class="draw-board__progress-track">
        <div class="draw-board__progress-fill" :style="{ width: `${progress}%` }"></div>
      </div>
    </div>

    <transition name="slot-pop">
      <div
        v-if="selectedSlot !== null"
        class="draw-board__bubble"
      >
        {{ selectedSlot + 1 }}번
      </div>
    </transition>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';

const props = defineProps({
  totalSlots: {
    type: Number,
    default: 0,
  },
  availableSlots: {
    type: Number,
    required: true,
  },
  revealedSlots: {
    type: Array,
    default: () => [],
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['complete']);
const selectedSlot = ref(null);
const revealedSlotsSet = ref(new Set());
const revealedCount = computed(() => revealedSlotsSet.value.size);

watch(
  () => props.revealedSlots,
  (value) => {
    if (Array.isArray(value)) {
      revealedSlotsSet.value = new Set(value);
    }
  },
  { immediate: true },
);

const gridSize = computed(() => {
  if (props.totalSlots <= 0) {
    return { rows: 1, cols: 1 };
  }
  const size = Math.round(Math.sqrt(props.totalSlots));
  return {
    rows: size,
    cols: size,
  };
});

const progress = computed(() => {
  if (props.totalSlots === 0) return 0;
  return Math.min(100, (revealedSlotsSet.value.size / props.totalSlots) * 100);
});
const progressPercent = computed(() => Math.round(progress.value));

function handleCellClick(slot) {
  if (props.disabled) return;
  if (props.availableSlots <= 0) return;
  if (isSlotRevealed(slot)) return;

  selectedSlot.value = slot;
  emit('complete', slot);

  setTimeout(() => {
    if (selectedSlot.value === slot) {
      selectedSlot.value = null;
    }
  }, 800);
}

function slotClass(slot) {
  const isRevealed = isSlotRevealed(slot);
  const isSelected = selectedSlot.value === slot;

  return [
    isRevealed ? 'draw-board__cell--done' : 'draw-board__cell--ready',
    isSelected ? 'draw-board__cell--active' : '',
  ].join(' ');
}

function isDisabled(slot) {
  if (props.disabled) return true;
  if (props.availableSlots <= 0) return true;
  return isSlotRevealed(slot);
}

function isSlotRevealed(slot) {
  return revealedSlotsSet.value.has(slot);
}
</script>

<style scoped>
.draw-board {
  position: relative;
  max-width: 720px;
  margin: 0 auto;
  border-radius: 36px;
  padding: 2rem;
  background: linear-gradient(180deg, #fff2ff 0%, #f0f7ff 100%);
  border: 1px solid #f4e1ff;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

.draw-board__decor {
  position: absolute;
  width: 18px;
  height: 18px;
  border-radius: 999px;
  background: #e0c7ff;
  top: 18px;
}

.draw-board__decor--left {
  left: 18px;
}

.draw-board__decor--right {
  right: 18px;
}

.draw-board__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.draw-board__title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #8b5cf6;
}

.draw-board__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 0.25rem;
  color: #94a3b8;
  font-size: 0.9rem;
}

.draw-board__meta strong {
  color: #7c3aed;
  font-weight: 700;
}

.draw-board__count {
  border-radius: 999px;
  padding: 0.35rem 1rem;
  background: #fff;
  border: 1px solid #e2e8f0;
  font-weight: 600;
  color: #475569;
}

.draw-board__grid {
  display: grid;
  gap: 0.75rem;
}

.draw-board__cell {
  aspect-ratio: 1/1;
  border: none;
  border-radius: 18px;
  font-size: 0.9rem;
  font-weight: 600;
  color: #7c3aed;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 20px rgba(124, 58, 237, 0.15);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: default;
}

.draw-board__cell:disabled {
  cursor: not-allowed;
}

.draw-board__cell--ready {
  background: linear-gradient(180deg, #ffe3fb 0%, #f0f7ff 100%);
  cursor: pointer;
}

.draw-board__cell--done {
  background: #f3f4f6;
  color: #94a3b8;
  box-shadow: none;
}

.draw-board__cell--active {
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(167, 139, 250, 0.35);
}

.draw-board__cell--revealed {
  font-size: 0.8rem;
}

.draw-board__footer {
  margin-top: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #a78bfa;
  font-weight: 600;
}

.draw-board__phrase {
  font-size: 0.95rem;
}

.draw-board__progress-value {
  color: #7c3aed;
}

.draw-board__progress {
  margin-top: 0.5rem;
}

.draw-board__progress-track {
  height: 10px;
  border-radius: 999px;
  background: #e2e8f0;
  overflow: hidden;
}

.draw-board__progress-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #ff9dd1, #c4b5fd);
  transition: width 0.3s ease;
}

.draw-board__bubble {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 999px;
  padding: 1.5rem 2rem;
  border: 4px solid #fff;
  background: linear-gradient(135deg, #ffd3f8 0%, #c6c8ff 100%);
  color: #7c3aed;
  font-weight: 700;
  box-shadow: 0 20px 45px rgba(124, 58, 237, 0.25);
  pointer-events: none;
}

.slot-pop-enter-active,
.slot-pop-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slot-pop-enter-from,
.slot-pop-leave-to {
  transform: translate(-50%, -50%) scale(0.8);
  opacity: 0;
}
</style>
