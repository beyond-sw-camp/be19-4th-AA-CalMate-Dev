<template>
  <div class="space-y-4">
    <section v-if="isLoading" class="bingo-feedback">
      <p>빙고 보드를 불러오는 중입니다...</p>
    </section>

    <section v-else-if="loadError" class="bingo-feedback bingo-feedback--error">
      <p>{{ loadError }}</p>
      <button type="button" class="feedback-button" @click="loadBoard">
        다시 시도
      </button>
    </section>

    <section v-else-if="!board.length" class="bingo-feedback">
      <p>아직 생성된 빙고 보드가 없어요. 조금만 기다려주세요!</p>
    </section>

    <BingoBoardCard
      v-else
      :board="board"
      :completed-lines="completedLines"
      :total-points="totalPoints"
      @cell-click="handleCellClick"
    />

    <BingoVerificationModal
      :selected-cell="selectedCell"
      :board="board"
      :board-id="boardMeta?.boardId ?? null"
      :member-id="memberId"
      :extend-file-path-id="extendFilePathId"
      @verification-success="handleVerificationSuccess"
      @close="selectedCell = null"
    />
  </div>
</template>

<script>
import { computed, defineComponent, onMounted, ref } from 'vue';
import { useUserStore } from '@/stores/user';
import { fetchBingoBoard, fetchMonthlyBoardSummary } from '@/api/bingo';
import BingoBoardCard from './Bingoboardcard.vue';
import BingoVerificationModal from './BingoVerificationModal.vue';
import { POINTS_RULES } from '../lib/pointsSystem.js';
import { useToast } from '../lib/toast.js';
import { getCurrentYearMonthInKst } from '@/utils/date.js';
import api from '@/lib/api';

export default defineComponent({
  name: 'MonthlyBingoChallenge',
  components: {
    BingoBoardCard,
    BingoVerificationModal,
  },
  setup() {
    const board = ref([]);
    const boardMeta = ref(null);
    const completedLines = ref(0);
    const totalPoints = ref(0);
    const selectedCell = ref(null);
    const isLoading = ref(false);
    const loadError = ref('');

    const userStore = useUserStore();
    const { error } = useToast();
    const memberId = computed(() => userStore.userId || null);
    const extendFilePathId = resolveExtendFilePathId();
    const currentMonth = getCurrentYearMonthInKst();

    const calculatePoints = (detail) => {
      const lines = detail?.completedLineCount ?? 0;
      const base = lines * POINTS_RULES.BINGO_LINE;
      const bonus = detail?.completed ? POINTS_RULES.BINGO_COMPLETE : 0;
      return base + bonus;
    };

    const clampIndex = (value, size) => {
      const index = Number.isInteger(value) ? value : 0;
      if (index < 0) return 0;
      if (index >= size) return size - 1;
      return index;
    };

    const createPlaceholderCell = (row, col) => ({
      id: `placeholder-${row}-${col}`,
      cellId: null,
      row,
      col,
      label: '⭐',
      description: '준비 중',
      completed: false,
      checkedAt: null,
      uploads: [],
      photo: null,
    });

    const parseIndex = (value) => {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : 0;
    };

    const mapCell = (cell = {}) => {
      const row = parseIndex(cell.row);
      const col = parseIndex(cell.col);
      const uploads = Array.isArray(cell.uploads) ? cell.uploads : [];
      const photo =
        uploads[0]?.fullUrl ||
        uploads[0]?.url ||
        uploads[0]?.path ||
        cell.photo ||
        cell.thumbnail ||
        null;

      return {
        id: cell.cellId ?? cell.id ?? `cell-${row}-${col}`,
        cellId: cell.cellId ?? cell.id ?? null,
        row,
        col,
        label: cell.label || '⭐',
        description: cell.label || '챌린지',
        completed: Boolean(cell.checked),
        checkedAt: cell.checkedAt ?? null,
        uploads,
        photo,
      };
    };

    const determineShift = (values, dimension) => {
      if (!values.length) return 0;
      if (values.some((value) => value === 0)) return 0;
      if (values.every((value) => value >= 1 && value <= dimension)) return -1;
      return 0;
    };

    const buildBoardGrid = (cells = [], size = 5) => {
      const dimension = Number.isInteger(size) && size > 0 ? size : 5;
      const grid = Array.from({ length: dimension }, () => Array.from({ length: dimension }, () => null));
      const rows = cells.map((cell) => parseIndex(cell.row));
      const cols = cells.map((cell) => parseIndex(cell.col));
      const rowShift = determineShift(rows, dimension);
      const colShift = determineShift(cols, dimension);

      cells.forEach((cell) => {
        const mapped = mapCell(cell);
        const rowIndex = clampIndex(mapped.row + rowShift, dimension);
        const colIndex = clampIndex(mapped.col + colShift, dimension);
        grid[rowIndex][colIndex] = { ...mapped, row: rowIndex, col: colIndex };
      });

      return grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => cell ?? createPlaceholderCell(rowIndex, colIndex)),
      );
    };

    const loadBoard = async () => {
      if (!memberId.value) {
        loadError.value = '로그인 후 이용해주세요.';
        board.value = [];
        return;
      }

      isLoading.value = true;
      loadError.value = '';
      try {
        const summary = await fetchMonthlyBoardSummary(memberId.value, currentMonth);
        if (!summary?.boardId) {
          boardMeta.value = null;
          board.value = [];
          loadError.value = '이번 달 빙고 보드를 찾을 수 없어요.';
          return;
        }

        boardMeta.value = summary;
        const detail = await fetchBingoBoard(summary.boardId);
        board.value = buildBoardGrid(detail?.cells ?? [], detail?.size ?? 5);
        completedLines.value = detail?.completedLineCount ?? 0;
        totalPoints.value = calculatePoints(detail);
      } catch (err) {
        console.error('Failed to load bingo board', err);
        loadError.value = '빙고 데이터를 불러오지 못했습니다.';
      } finally {
        isLoading.value = false;
      }
    };

    const handleCellClick = (rowIndex, colIndex) => {
      const cell = board.value[rowIndex]?.[colIndex];
      if (!cell || !cell.cellId) {
        error('아직 활성화되지 않은 칸이에요.');
        return;
      }

      selectedCell.value = { row: rowIndex, col: colIndex };
    };

    const handleVerificationSuccess = async () => {
      selectedCell.value = null;
      await loadBoard();
    };

    onMounted(loadBoard);

    return {
      board,
      boardMeta,
      completedLines,
      totalPoints,
      selectedCell,
      handleCellClick,
      handleVerificationSuccess,
      isLoading,
      loadError,
      loadBoard,
      memberId,
      extendFilePathId,
    };
  },
});

function resolveExtendFilePathId() {
  const baseURL = api.defaults?.baseURL || (typeof window !== 'undefined' ? window.location.origin : '');
  if (!baseURL) return null;

  try {
    const parsed = new URL(baseURL);
    const host = parsed.hostname || '';

    if (/localhost|127\.0\.0\.1/i.test(host)) {
      return 1;
    }
  } catch (error) {
    console.warn('Failed to resolve bingo extendFilePathId from baseURL', error);
  }

  return null;
}
</script>

<style scoped>
.bingo-feedback {
  border-radius: 24px;
  border: 1px dashed #dbeafe;
  background: #f8fbff;
  padding: 1.5rem;
  text-align: center;
  color: #475569;
}

.bingo-feedback--error {
  border-color: #fecaca;
  background: #fef2f2;
  color: #b91c1c;
}

.feedback-button {
  margin-top: 0.75rem;
  padding: 0.5rem 1.25rem;
  border-radius: 999px;
  border: none;
  background: #111827;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
}
</style>
