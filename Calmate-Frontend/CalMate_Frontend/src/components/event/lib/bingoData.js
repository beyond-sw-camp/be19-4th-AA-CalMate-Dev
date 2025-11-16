import { POINTS_RULES } from './pointsSystem.js';
import { getCurrentYearMonthInKst } from '@/utils/date.js';

export const BINGO_TASKS = [
  { id: 'hydrate', label: '💧', description: '물 2L 마시기' },
  { id: 'stretch', label: '🤸', description: '아침 스트레칭 10분' },
  { id: 'mindful', label: '🧘', description: '명상 5분' },
  { id: 'steps', label: '🚶', description: '걸음 수 8,000보 달성' },
  { id: 'sleep', label: '🌙', description: '7시간 숙면' },
  { id: 'protein', label: '🍗', description: '단백질 식단 챙기기' },
  { id: 'veggies', label: '🥦', description: '채소 3가지 이상 먹기' },
  { id: 'cardio', label: '❤️', description: '유산소 20분' },
  { id: 'journal', label: '📓', description: '건강 일지 작성' },
  { id: 'photo', label: '📷', description: '오늘의 운동 인증샷' },
  { id: 'water', label: '🚰', description: '식전 물 한 컵' },
  { id: 'core', label: '🪢', description: '코어 운동 3세트' },
  { id: 'stairs', label: '🪜', description: '계단 오르기 도전' },
  { id: 'gratitude', label: '🙏', description: '감사한 일 3가지 적기' },
  { id: 'snack', label: '🍎', description: '건강한 간식 선택' },
  { id: 'walk', label: '🌳', description: '산책 15분' },
  { id: 'interval', label: '⚡', description: '인터벌 트레이닝' },
  { id: 'pushup', label: '💪', description: '팔굽혀펴기 20회' },
  { id: 'plank', label: '🧱', description: '플랭크 60초' },
  { id: 'yoga', label: '🧘‍♀️', description: '저녁 요가' },
  { id: 'cycling', label: '🚴', description: '자전거 타기' },
  { id: 'hiit', label: '🔥', description: 'HIIT 4세트' },
  { id: 'reading', label: '📚', description: '자기계발 독서' },
  { id: 'fasting', label: '⏱️', description: '야식 끊기' },
  { id: 'smile', label: '😊', description: '긍정 문장 말하기' },
  { id: 'dance', label: '🎵', description: '댄스 운동' },
  { id: 'friends', label: '👥', description: '운동 인증 공유' },
  { id: 'foam', label: '🌀', description: '폼롤러 스트레칭' },
  { id: 'sun', label: '☀️', description: '햇빛 10분 쐬기' },
  { id: 'stairs2', label: '🏃', description: '런지 20회' },
];

const BOARD_SIZE = 5;

const mulberry32 = (seed) => {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const seedFromString = (input) => {
  if (!input) return 1;
  return Array.from(input).reduce((acc, char) => acc + char.charCodeAt(0), 0) || 1;
};

const seededShuffle = (items, seedKey) => {
  const random = mulberry32(seedFromString(seedKey));
  const list = [...items];
  for (let i = list.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
};

const createCell = (task, monthKey, index) => ({
  id: `${monthKey}-${task.id}-${index}`,
  label: task.label,
  description: task.description,
  completed: false,
  date: null,
  photo: null,
  points: task.points ?? POINTS_RULES.BINGO_LINE,
});

export function generateBingoBoard(monthKey = getCurrentYearMonthInKst()) {
  const tasks = seededShuffle(BINGO_TASKS, monthKey);
  const board = [];

  for (let row = 0; row < BOARD_SIZE; row += 1) {
    const rowItems = [];
    for (let col = 0; col < BOARD_SIZE; col += 1) {
      const index = row * BOARD_SIZE + col;
      const task = tasks[index] ?? {
        id: `placeholder-${index}`,
        label: '⭐',
        description: '자유 미션',
        points: POINTS_RULES.BINGO_LINE,
      };
      rowItems.push(createCell(task, monthKey, index));
    }
    board.push(rowItems);
  }

  return board;
}

const isCellCompleted = (cell) => Boolean(cell && cell.completed);

export function checkBingoLines(board) {
  if (!Array.isArray(board) || !board.length) return 0;
  const size = board.length;
  let lines = 0;

  for (let row = 0; row < size; row += 1) {
    const rowData = Array.isArray(board[row]) ? board[row] : [];
    if (rowData.length && rowData.every(isCellCompleted)) {
      lines += 1;
    }
  }

  for (let col = 0; col < size; col += 1) {
    let complete = true;
    for (let row = 0; row < size; row += 1) {
      if (!Array.isArray(board[row]) || !isCellCompleted(board[row][col])) {
        complete = false;
        break;
      }
    }
    if (complete) lines += 1;
  }

  let primaryComplete = true;
  let secondaryComplete = true;
  for (let i = 0; i < size; i += 1) {
    if (!Array.isArray(board[i]) || !isCellCompleted(board[i][i])) primaryComplete = false;
    if (!Array.isArray(board[i]) || !isCellCompleted(board[i][size - 1 - i]))
      secondaryComplete = false;
  }
  if (primaryComplete) lines += 1;
  if (secondaryComplete) lines += 1;

  return lines;
}

export function isBingoComplete(board) {
  if (!Array.isArray(board) || !board.length) return false;
  return board.every((row) => Array.isArray(row) && row.every(isCellCompleted));
}
