<template>
  <section class="bingo-card shadow-soft">
    <header class="bingo-header">
      <div>
        <p class="bingo-eyebrow">월간 챌린지</p>
        <h3>월간 빙고 챌린지</h3>
      </div>
      <div class="bingo-status">
        <span class="status-chip">{{ completedCount }}/25 완료</span>
        <span class="status-chip status-chip--dark">{{ completedLines }} 라인</span>
      </div>
    </header>

    <div class="bingo-board">
      <button
        v-for="item in boardItems"
        :key="item.cell.id"
        type="button"
        class="bingo-cell"
        :class="{ 'bingo-cell--done': item.cell.completed }"
        :title="item.cell.description"
        @click="$emit('cell-click', item.row, item.col)"
      >
        <template v-if="item.cell.photo">
          <img
            :src="resolveFileUrl(item.cell.photo)"
            :alt="item.cell.label"
            class="bingo-photo"
          />
          <span class="bingo-cell__label">{{ item.cell.label }}</span>
        </template>
        <template v-else>
          <div class="bingo-cell__body">
            <span class="bingo-cell__title">{{ item.cell.label }}</span>
            <span v-if="item.cell.description && item.cell.description !== item.cell.label" class="bingo-cell__desc">
              {{ item.cell.description }}
            </span>
          </div>
        </template>
      </button>
    </div>

    <div class="bingo-footer">
      <div class="footer-row">
        <span>라인당 보상</span>
        <span>{{ POINTS_RULES.BINGO_LINE }} 포인트</span>
      </div>
      <div class="footer-row footer-row--highlight">
        <span>획득한 포인트</span>
        <span>{{ totalPoints }} 포인트</span>
      </div>
    </div>

    <p class="bingo-hint">목표를 달성하려면 셀을 클릭하세요</p>
  </section>
</template>

<script>
import { computed, defineComponent } from 'vue';
import { POINTS_RULES } from '../lib/pointsSystem.js';
import api from '@/lib/api';

function resolveFileUrl(path) {
  if (!path) return '';
  if (/^https?:/i.test(path)) return path;

  const normalized = path.startsWith('/') ? path : `/${path}`;
  const baseURL = api.defaults?.baseURL;
  if (!baseURL) return normalized;

  if (typeof window !== 'undefined') {
    try {
      const baseHost = new URL(baseURL).hostname;
      const pageHost = window.location.hostname;
      if (LOOPBACK_HOSTS.has(baseHost) && !LOOPBACK_HOSTS.has(pageHost)) {
        return normalized;
      }
    } catch (error) {
      console.warn('Failed to resolve bingo file URL', error);
      return normalized;
    }
  }

  return `${baseURL}${normalized}`;
}

export default defineComponent({
  name: 'BingoBoardCard',
  components: {
  },
  props: {
    board: {
      type: Array,
      required: true,
    },
    completedLines: {
      type: Number,
      required: true,
    },
    totalPoints: {
      type: Number,
      required: true,
    },
  },
  emits: ['cell-click'],
  setup(props) {
    const boardItems = computed(() =>
      props.board.flatMap((row, rowIndex) =>
        row.map((cell, colIndex) => ({
          cell,
          row: rowIndex,
          col: colIndex,
        })),
      ),
    );

    const completedCount = computed(() =>
      props.board.flat().filter((cell) => cell.completed).length,
    );

    return {
      boardItems,
      completedCount,
      POINTS_RULES,
      api,
      resolveFileUrl,
    };
  },
});
</script>

<style scoped>
.bingo-card {
  border-radius: 32px;
  border: 1px solid #edf0f7;
  background: #ffffff;
  padding: 2rem;
}

.bingo-header {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

@media (min-width: 640px) {
  .bingo-header {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.bingo-eyebrow {
  color: #a0aec0;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 0.3rem;
}

.bingo-header h3 {
  font-size: 1.4rem;
  font-weight: 700;
  color: #0f172a;
}

.bingo-status {
  display: flex;
  gap: 0.5rem;
}

.status-chip {
  border-radius: 999px;
  padding: 0.4rem 1rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: #475569;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
}

.status-chip--dark {
  background: #0f172a;
  color: #fff;
  border-color: #0f172a;
}

.bingo-board {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.bingo-cell {
  aspect-ratio: 1 / 1;
  border-radius: 18px;
  border: 1px solid #e5e7eb;
  background: #fff;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 1rem;
  text-align: left;
  position: relative;
  transition: transform 0.15s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}

.bingo-cell:hover {
  transform: translateY(-2px);
  border-color: #d4d8f0;
  box-shadow: 0 6px 16px rgba(15, 23, 42, 0.08);
}

.bingo-cell--done {
  border-color: #c4d7f4;
  background: #f4f7ff;
  box-shadow: inset 0 0 0 1px rgba(59, 130, 246, 0.35);
}

.bingo-photo {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 22px;
}

.bingo-cell__label {
  position: relative;
  z-index: 1;
  font-size: 1.4rem;
  color: #fff;
  text-shadow: 0 2px 15px rgba(0, 0, 0, 0.45);
}

.bingo-emoji {
  font-size: 2rem;
}

.bingo-cell__body {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.bingo-cell__title {
  font-size: 0.95rem;
  font-weight: 600;
  color: #1e293b;
  line-height: 1.4;
}

.bingo-cell__desc {
  font-size: 0.85rem;
  color: #64748b;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.bingo-footer {
  border-radius: 24px;
  background: #f8f9ff;
  border: 1px solid #ebeefe;
  padding: 1rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  font-size: 0.95rem;
  color: #0f172a;
}

.footer-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.footer-row--highlight span:last-child {
  color: #7c3aed;
  font-weight: 600;
}

.bingo-hint {
  margin-top: 1rem;
  text-align: center;
  font-size: 0.9rem;
  color: #94a3b8;
}

.shadow-soft {
  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.08);
}
</style>
