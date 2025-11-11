<template>
  <div class="space-y-4">
    <!-- 빙고 판 컴포넌트 -->
    <BingoBoardCard
      :board="board"
      :completed-lines="completedLines"
      :total-points="totalPoints"
      @cell-click="handleCellClick"
    />

    <!-- 모달 컴포넌트 -->
    <BingoVerificationModal
      :selected-cell="selectedCell"
      :board="board"
      :completed-lines="completedLines"
      :total-points="totalPoints"
      @update:board="board = $event"
      @update:completedLines="completedLines = $event"
      @update:totalPoints="totalPoints = $event"
      @close="selectedCell = null"
    />
  </div>
</template>

<script>
import { ref, onMounted, defineComponent } from 'vue';
import BingoBoardCard from './Bingoboardcard.vue';
import BingoVerificationModal from './BingoVerificationModal.vue';
import { generateBingoBoard } from '../lib/bingoData.js';

export default defineComponent({
  name: 'MonthlyBingoChallenge',
  components: {
    BingoBoardCard,
    BingoVerificationModal,
  },
  setup() {
    const board = ref([]);
    const completedLines = ref(0);
    const totalPoints = ref(0);
    const selectedCell = ref(null);

    const currentMonth = new Date().toISOString().slice(0, 7);

    onMounted(() => {
      const stored = localStorage.getItem('bingoBoard');
      if (stored) {
        try {
          const data = JSON.parse(stored);
          if (data.month === currentMonth && Array.isArray(data.cells)) {
            board.value = data.cells;
            completedLines.value = data.completedLines ?? 0;
            totalPoints.value = data.points ?? 0;
            return;
          }
        } catch (err) {
          console.error('Failed to parse stored bingo board', err);
        }
      }

      const newBoard = generateBingoBoard(currentMonth);
      board.value = newBoard;
      saveBoard(newBoard, 0, 0);
    });

    function saveBoard(cells, lines, points) {
      localStorage.setItem(
        'bingoBoard',
        JSON.stringify({
          month: currentMonth,
          cells,
          completedLines: lines,
          points,
        }),
      );
    }

    function handleCellClick(rowIndex, colIndex) {
      const cell = board.value[rowIndex]?.[colIndex];
      if (!cell) return;

      selectedCell.value = { row: rowIndex, col: colIndex };
    }

    return {
      board,
      completedLines,
      totalPoints,
      selectedCell,
      handleCellClick,
    };
  },
});
</script>
