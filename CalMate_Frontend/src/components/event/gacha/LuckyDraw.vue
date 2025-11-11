<template>
  <section class="gacha-card shadow-soft">
    <header class="gacha-header">
      <div>
        <p class="gacha-eyebrow">행운의 뽑기</p>
        <h3>행운의 뽑기판</h3>
        <p class="gacha-subtitle">포인트를 사용해 특별한 보상을 받아보세요.</p>
      </div>
      <div class="points-chip">
        <Gift class="chip-icon" />
        <div>
          <p>사용 가능 포인트</p>
          <strong>{{ formattedAvailablePoints }}</strong>
        </div>
      </div>
    </header>

    <div class="draw-panel">
      <div class="draw-panel__top">
        <span>행운의 뽑기판</span>
        <div class="draw-panel__meta">
          <span>남은 기회 <strong>{{ remainingDraws }}</strong>회</span>
          <span>{{ progressCount }} / {{ totalSlots }}</span>
          <span v-if="lastPickedSlot">선택 번호 <strong>{{ lastPickedSlot }}</strong>번</span>
        </div>
      </div>
      <div class="draw-panel__board">
        <VintageDrawBoard
          :available-slots="remainingDraws"
          :total-slots="totalSlots"
          :revealed-slots="revealedSlotsForBoard"
          :disabled="boardDisabled"
          @complete="handleSlotComplete"
        />
      </div>
      <div class="draw-progress">
        <span>진행률</span>
        <div class="draw-progress__track">
          <div class="draw-progress__fill" :style="{ width: `${progressPercent}%` }" />
        </div>
        <span class="draw-progress__value">{{ progressPercent }}%</span>
      </div>
    </div>

    <p v-if="loadError" class="draw-error">{{ loadError }}</p>

    <p class="draw-hint">보라색 셀을 직접 클릭해 원하는 번호를 선택하세요.</p>

    <div class="ticket-info">
      <div class="ticket-row">
        <span>뽑기 비용</span>
        <span>{{ LUCKY_DRAW_TICKET_COST }} 포인트</span>
      </div>
      <div class="ticket-row">
        <span>사용 가능 포인트</span>
        <span>{{ formattedAvailablePointsPlain }}</span>
      </div>
      <div class="ticket-row">
        <span>남은 뽑기 횟수</span>
        <span>{{ remainingDraws }}회</span>
      </div>
    </div>

    <div class="probability-card">
      <div class="probability-header">
        <span>📊</span>
        등급별 확률
      </div>
      <div class="probability-list">
        <div
          v-for="rarity in rarityStats"
          :key="rarity.key"
          class="probability-row"
        >
          <div class="probability-label">
            <span class="probability-emoji">{{ rarity.emoji }}</span>
            <span>{{ rarity.label }}</span>
          </div>
          <div class="probability-meter">
            <div class="probability-track">
              <div
                :class="['probability-fill', `probability-fill--${rarity.key}`]"
                :style="{ width: `${rarity.chance}%` }"
              />
            </div>
            <span>{{ rarity.chance }}%</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="recentRewards.length" class="history-card">
      <div class="history-header">
        <h4>최근 획득 보상</h4>
        <span>{{ wonRewards.length }}개</span>
      </div>
      <div class="history-list">
        <div
          v-for="(reward, index) in recentRewards"
          :key="`${reward.name}-${index}`"
          class="history-item"
        >
          <div class="history-emoji">{{ getRewardEmoji(reward.type) }}</div>
          <div class="history-text">
            <p>{{ reward.name }}</p>
            <small>{{ reward.description }}</small>
          </div>
          <Badge variant="outline" class="history-badge">
            {{ rarityConfig[reward.rarity].emoji }}
          </Badge>
        </div>
      </div>
    </div>
  </section>
  <Teleport to="body">
    <transition name="reward-modal">
      <div
        v-if="showResult && currentReward"
        class="reward-modal"
        role="dialog"
        aria-modal="true"
        aria-label="추첨 결과"
      >
        <div class="reward-modal__backdrop" @click="closeResultModal" />
        <div class="reward-modal__content">
          <button type="button" class="reward-modal__close" @click="closeResultModal">
            ✕
          </button>
          <div class="reward-modal__hero">
            <Sparkles class="reward-modal__sparkle" />
            <p>축하합니다!</p>
          </div>
          <div class="reward-modal__body">
            <div class="reward-modal__emoji">{{ getRewardEmoji(currentReward.type) }}</div>
            <div class="reward-modal__details">
              <p class="reward-modal__name">{{ currentReward.name }}</p>
              <p class="reward-modal__desc">{{ currentReward.description }}</p>
              <Badge variant="secondary" class="reward-modal__badge">
                {{ rarityConfig[currentReward.rarity].emoji }}
                {{ rarityConfig[currentReward.rarity].label }}
              </Badge>
            </div>
          </div>
          <button type="button" class="reward-modal__cta" @click="closeResultModal">
            확인
          </button>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount, ref, watch } from 'vue';
import { Gift, Sparkles } from 'lucide-vue-next';
import { useUserStore } from '@/stores/user';
import {
  fetchActiveGachaEvent,
  fetchEventPrizes,
  fetchMemberBoardCells,
  openBoardCell,
  recordGachaDrawLog,
} from '@/api/gacha';
import Badge from '../ui/Badge.vue';
import VintageDrawBoard from './VintageDrawBoard.vue';
import { drawReward as drawRewardFallback } from '../lib/rewardsData.js';
import { LUCKY_DRAW_TICKET_COST } from '../lib/pointsSystem.js';

const props = defineProps({
  availablePoints: {
    type: Number,
    default: null,
  },
});

const emit = defineEmits(['points-used']);
const userStore = useUserStore();
const memberId = computed(() => userStore.userId);
// const memberId = computed(() => 3);

const currentReward = ref(null);
const wonRewards = ref([]);
const showResult = ref(false);
const lastPickedSlot = ref(null);
const rewardModalListener = ref(null);
const boardResetTimer = ref(null);

const boardCells = ref([]);
const boardSnapshot = ref(null);
const prizePool = ref([]);
const eventInfo = ref(null);
const isLoadingBoard = ref(false);
const isDrawing = ref(false);
const isAutoDrawing = ref(false);
const autoDrawPending = ref(0);
const loadError = ref('');

const localRevealedSlots = ref(new Set());
const LOCAL_REWARD_KEY = 'wonRewards';
const LOCAL_SLOT_KEY = 'revealedDrawSlots';
const FALLBACK_SLOT_COUNT = 100;
const AUTO_REROLL_TRIGGER_RARITY = 'legendary';
const AUTO_REROLL_BATCH = 100; // 10 x 10 automatic draws
const AUTO_REROLL_DELAY_MS = 350;
const BOARD_RESET_DELAY_MS = 400;

const rarityConfig = {
  common: {
    key: 'common',
    label: '꽝',
    emoji: '⚪',
    chance: 70,
  },
  rare: {
    key: 'rare',
    label: '레어',
    emoji: '🔵',
    chance: 25,
  },
  epic: {
    key: 'epic',
    label: '에픽',
    emoji: '🟣',
    chance: 4,
  },
  legendary: {
    key: 'legendary',
    label: '전설',
    emoji: '🟡',
    chance: 1,
  },
};

const rarityOrder = ['common', 'rare', 'epic', 'legendary'];

const sortedBoardCells = computed(() => {
  if (!boardCells.value || !boardCells.value.length) return [];
  return [...boardCells.value].sort((a, b) => {
    if (a.rows != null && b.rows != null && a.rows !== b.rows) return a.rows - b.rows;
    if (a.cols != null && b.cols != null && a.cols !== b.cols) return a.cols - b.cols;
    return (a.id || 0) - (b.id || 0);
  });
});

const revealedSlotsFromServer = computed(() => {
  if (!sortedBoardCells.value.length) return [];
  const indexes = [];
  sortedBoardCells.value.forEach((cell, index) => {
    if (cell.status === 'OPENED') {
      indexes.push(index);
    }
  });
  return indexes;
});

const revealedSlotsForBoard = computed(() => {
  if (sortedBoardCells.value.length) {
    return revealedSlotsFromServer.value;
  }
  return Array.from(localRevealedSlots.value);
});

const totalSlots = computed(() =>
  sortedBoardCells.value.length ? sortedBoardCells.value.length : FALLBACK_SLOT_COUNT,
);

const coveredSlots = computed(() =>
  Math.max(totalSlots.value - revealedSlotsForBoard.value.length, 0),
);

const progressCount = computed(() => totalSlots.value - coveredSlots.value);
const progressPercent = computed(() =>
  totalSlots.value === 0 ? 0 : Math.round((progressCount.value / totalSlots.value) * 100),
);

const hasPointLimit = computed(
  () => props.availablePoints !== null && props.availablePoints !== undefined,
);

const displayPoints = computed(() =>
  hasPointLimit.value ? Math.max(0, props.availablePoints) : 0,
);

const formattedAvailablePoints = computed(() =>
  hasPointLimit.value ? `${displayPoints.value.toLocaleString()} P` : '무제한',
);

const formattedAvailablePointsPlain = computed(() =>
  hasPointLimit.value ? `${displayPoints.value.toLocaleString()} 포인트` : '무제한',
);

const maxTicketsByPoint = computed(() => {
  if (!hasPointLimit.value) {
    return Infinity;
  }
  if (LUCKY_DRAW_TICKET_COST <= 0) return 0;
  return Math.floor(displayPoints.value / LUCKY_DRAW_TICKET_COST);
});

const remainingDraws = computed(() => {
  if (coveredSlots.value <= 0) return 0;
  if (maxTicketsByPoint.value === Infinity) {
    return coveredSlots.value;
  }
  if (maxTicketsByPoint.value <= 0) return 0;
  return Math.min(coveredSlots.value, maxTicketsByPoint.value);
});

const recentRewards = computed(() => [...wonRewards.value].slice(-6).reverse());
const rarityStats = computed(() => {
  if (!prizePool.value.length) {
    return rarityOrder.map((key) => rarityConfig[key]);
  }

  const totalWeight = prizePool.value.reduce((sum, prize) => sum + getPrizeWeight(prize), 0);

  return rarityOrder.map((key) => {
    const rarityWeight = prizePool.value
      .filter((prize) => prize.rarity === key)
      .reduce((sum, prize) => sum + getPrizeWeight(prize), 0);

    const chance = totalWeight ? Math.round((rarityWeight / totalWeight) * 100) : 0;
    return {
      key,
      label: rarityConfig[key].label,
      emoji: rarityConfig[key].emoji,
      chance,
    };
  });
});

const boardDisabled = computed(
  () => isDrawing.value || isLoadingBoard.value || remainingDraws.value <= 0,
);

const serverFlowAvailable = computed(() =>
  Boolean(
    memberId.value &&
      eventInfo.value?.id &&
      sortedBoardCells.value.length &&
      prizePool.value.length,
  ),
);

onMounted(() => {
  restoreLocalRewards();
  restoreLocalSlots();

  if (memberId.value) {
    initializeGacha();
  }
});

watch(memberId, (value, oldValue) => {
  if (value && value !== oldValue) {
    initializeGacha();
  }

  if (!value) {
    resetServerState();
  }
});

watch(
  wonRewards,
  (value) => {
    try {
      localStorage.setItem(LOCAL_REWARD_KEY, JSON.stringify(value));
    } catch (err) {
      console.warn('Failed to persist rewards', err);
    }
  },
  { deep: true },
);

watch(
  localRevealedSlots,
  (value) => {
    try {
      localStorage.setItem(LOCAL_SLOT_KEY, JSON.stringify(Array.from(value)));
    } catch (err) {
      console.warn('Failed to persist slots', err);
    }
  },
  { deep: true },
);

watch(currentReward, (reward) => {
  if (reward?.rarity === AUTO_REROLL_TRIGGER_RARITY) {
    queueAutoReroll();
  }
});

async function initializeGacha() {
  if (!memberId.value) return;

  isLoadingBoard.value = true;
  loadError.value = '';

  try {
    const activeEvent = await fetchActiveGachaEvent();

    if (!activeEvent || activeEvent.id == null) {
      throw new Error(activeEvent?.message || '활성화된 가챠 이벤트가 없습니다.');
    }

    eventInfo.value = activeEvent;

    const [boardResponse, prizes] = await Promise.all([
      fetchMemberBoardCells(memberId.value, activeEvent.id),
      fetchEventPrizes(activeEvent.id),
    ]);

    const normalizedBoard = Array.isArray(boardResponse?.cells)
      ? boardResponse.cells
      : Array.isArray(boardResponse)
        ? boardResponse
        : [];

    boardSnapshot.value = !Array.isArray(boardResponse) && boardResponse ? boardResponse : null;
    boardCells.value = normalizedBoard;
    prizePool.value = (Array.isArray(prizes) ? prizes : [])
      .map((prize) => normalizePrize(prize))
      .filter(Boolean);

    hydrateHistoryFromBoard();
  } catch (error) {
    loadError.value =
      error?.response?.data?.message ||
      error?.message ||
      '가챠 데이터를 불러오지 못했습니다.';
    boardCells.value = [];
    prizePool.value = [];
  } finally {
    isLoadingBoard.value = false;
  }
}

function resetServerState() {
  boardCells.value = [];
  boardSnapshot.value = null;
  prizePool.value = [];
  eventInfo.value = null;
  loadError.value = '';
}

function restoreLocalRewards() {
  try {
    const stored = localStorage.getItem(LOCAL_REWARD_KEY);
    if (!stored) return;
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed)) {
      wonRewards.value = parsed;
    }
  } catch (error) {
    console.warn('Failed to restore rewards', error);
  }
}

function restoreLocalSlots() {
  try {
    const stored = localStorage.getItem(LOCAL_SLOT_KEY);
    if (!stored) return;
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed)) {
      localRevealedSlots.value = new Set(parsed);
    }
  } catch (error) {
    console.warn('Failed to restore slots', error);
  }
}

function normalizePrize(prize) {
  if (!prize) return null;

  let payload = null;
  if (prize.payloadJson) {
    if (typeof prize.payloadJson === 'string') {
      try {
        payload = JSON.parse(prize.payloadJson);
      } catch (error) {
        console.warn('Failed to parse prize payload', error);
      }
    } else if (typeof prize.payloadJson === 'object') {
      payload = prize.payloadJson;
    }
  }

  const rarity = (payload?.rarity || rankToRarity(prize.rank)).toLowerCase();

  return {
    id: prize.id,
    name: prize.name,
    type: (payload?.type || prize.prizeType || 'item').toLowerCase(),
    description: payload?.description || payload?.desc || '',
    payload,
    rarity: rarityOrder.includes(rarity) ? rarity : 'common',
    rank: prize.rank,
    quantity: prize.quantity,
  };
}

function rankToRarity(rank) {
  if (rank === 1) return 'legendary';
  if (rank === 2) return 'epic';
  if (rank === 3) return 'rare';
  return 'common';
}

function getPrizeWeight(prize) {
  if (!prize) return 1;
  return rarityConfig[prize.rarity]?.chance || 1;
}

function hydrateHistoryFromBoard() {
  if (!sortedBoardCells.value.length) return;

  const history = sortedBoardCells.value
    .filter((cell) => cell.status === 'OPENED' && cell.gachaPrizeId)
    .map((cell) => {
      const prize = findPrize(cell.gachaPrizeId);
      return prize
        ? {
            ...prize,
            wonAt: cell.openedAt,
          }
        : null;
    })
    .filter(Boolean);

  if (history.length) {
    wonRewards.value = history;
  }
}

function findPrize(prizeId) {
  return prizePool.value.find((prize) => prize.id === prizeId) || null;
}

function pickServerPrize() {
  if (!prizePool.value.length) return null;

  const weighted = prizePool.value.map((prize) => ({
    prize,
    weight: getPrizeWeight(prize),
  }));

  const totalWeight = weighted.reduce((sum, item) => sum + item.weight, 0);
  let target = Math.random() * totalWeight;

  for (const item of weighted) {
    target -= item.weight;
    if (target <= 0) {
      return item.prize;
    }
  }

  return weighted.length ? weighted[weighted.length - 1].prize : null;
}

function queueAutoReroll() {
  autoDrawPending.value += AUTO_REROLL_BATCH;
  if (!isAutoDrawing.value) {
    void runAutoReroll();
  }
}

async function runAutoReroll() {
  if (isAutoDrawing.value) return;
  isAutoDrawing.value = true;

  try {
    while (autoDrawPending.value > 0) {
      if (remainingDraws.value <= 0) {
        autoDrawPending.value = 0;
        break;
      }

      const nextSlot = findNextAvailableSlot();
      if (nextSlot === null || nextSlot === undefined) {
        autoDrawPending.value = 0;
        break;
      }

      autoDrawPending.value -= 1;
      await handleSlotComplete(nextSlot);

      if (AUTO_REROLL_DELAY_MS > 0) {
        await delay(AUTO_REROLL_DELAY_MS);
      }
    }
  } finally {
    isAutoDrawing.value = false;
  }
}

function findNextAvailableSlot() {
  if (sortedBoardCells.value.length) {
    const index = sortedBoardCells.value.findIndex((cell) => cell.status !== 'OPENED');
    return index >= 0 ? index : null;
  }

  for (let index = 0; index < totalSlots.value; index += 1) {
    if (!localRevealedSlots.value.has(index)) {
      return index;
    }
  }

  return null;
}

function delay(ms = AUTO_REROLL_DELAY_MS) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function handleSlotComplete(slotIndex) {
  if (isDrawing.value) return;
  if (remainingDraws.value <= 0) {
    showResult.value = false;
    return;
  }

  if (typeof slotIndex === 'number') {
    lastPickedSlot.value = slotIndex + 1;
  } else {
    lastPickedSlot.value = null;
  }

  if (!serverFlowAvailable.value) {
    runLocalDraw(slotIndex);
    return;
  }

  const targetCell = sortedBoardCells.value[slotIndex];
  if (!targetCell) {
    loadError.value = '선택한 셀 정보를 찾을 수 없습니다.';
    return;
  }

  if (targetCell.status === 'OPENED') {
    return;
  }

  const reward = pickServerPrize();
  if (!reward) {
    loadError.value = '추첨 가능한 경품이 없습니다.';
    return;
  }

  isDrawing.value = true;
  loadError.value = '';

  try {
    await openBoardCell(targetCell.id, memberId.value, reward.id);
    await recordGachaDrawLog(memberId.value, targetCell.id, reward.id);

    const openedAt = new Date().toISOString();
    boardCells.value = boardCells.value.map((cell) =>
      cell.id === targetCell.id
        ? { ...cell, status: 'OPENED', gachaPrizeId: reward.id, openedAt }
        : cell,
    );

    currentReward.value = reward;
    wonRewards.value = [...wonRewards.value, { ...reward, wonAt: openedAt }];
    showResult.value = true;
    emit('points-used', LUCKY_DRAW_TICKET_COST);
    scheduleBoardReset();
  } catch (error) {
    loadError.value =
      error?.response?.data?.message || '추첨 처리 중 오류가 발생했습니다.';
    showResult.value = false;
  } finally {
    isDrawing.value = false;
  }
}

function runLocalDraw(slotIndex) {
  const reward = drawRewardFallback();
  currentReward.value = reward;
  wonRewards.value = [...wonRewards.value, { ...reward, wonAt: new Date().toISOString() }];
  showResult.value = true;
  emit('points-used', LUCKY_DRAW_TICKET_COST);

  const updated = new Set(localRevealedSlots.value);
  updated.add(slotIndex);
  localRevealedSlots.value = updated;
  scheduleBoardReset();
}

function getRewardEmoji(type) {
  if (type === 'coupon') return '🎟️';
  if (type === 'avatar') return '👤';
  if (type === 'title') return '🏷️';
  return '🎖️';
}

const isBoardFullyRevealed = () => {
  if (serverFlowAvailable.value && sortedBoardCells.value.length) {
    return sortedBoardCells.value.every((cell) => cell.status === 'OPENED');
  }

  if (!sortedBoardCells.value.length) {
    return localRevealedSlots.value.size >= totalSlots.value;
  }

  return false;
};

const scheduleBoardReset = () => {
  if (!isBoardFullyRevealed()) return;
  if (boardResetTimer.value) return;

  boardResetTimer.value = setTimeout(async () => {
    boardResetTimer.value = null;
    if (serverFlowAvailable.value) {
      await initializeGacha();
    } else {
      localRevealedSlots.value = new Set();
    }
  }, BOARD_RESET_DELAY_MS);
};

const handleModalKeydown = (event) => {
  if (event.key === 'Escape') {
    event.preventDefault();
    closeResultModal();
  }
};

const closeResultModal = () => {
  showResult.value = false;
};

watch(
  () => showResult.value && Boolean(currentReward.value),
  (isOpen) => {
    if (typeof document === 'undefined') return;
    if (isOpen) {
      document.body.classList.add('overflow-hidden');
      rewardModalListener.value = handleModalKeydown;
      window.addEventListener('keydown', rewardModalListener.value);
    } else {
      document.body.classList.remove('overflow-hidden');
      if (rewardModalListener.value) {
        window.removeEventListener('keydown', rewardModalListener.value);
        rewardModalListener.value = null;
      }
    }
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  if (rewardModalListener.value) {
    window.removeEventListener('keydown', rewardModalListener.value);
  }
  if (typeof document !== 'undefined') {
    document.body.classList.remove('overflow-hidden');
  }
  if (boardResetTimer.value) {
    clearTimeout(boardResetTimer.value);
  }
});
</script>

<style scoped>
.gacha-card {
  border-radius: 32px;
  border: 1px solid #edf0f7;
  background: #ffffff;
  padding: 2rem;
}

.gacha-header {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

@media (min-width: 640px) {
  .gacha-header {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}

.gacha-eyebrow {
  color: #a78bfa;
  font-size: 0.85rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 0.3rem;
  font-weight: 600;
}

.gacha-header h3 {
  font-size: 1.6rem;
  font-weight: 700;
  color: #0f172a;
}

.gacha-subtitle {
  color: #94a3b8;
  margin-top: 0.25rem;
}

.points-chip {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border-radius: 20px;
  background: #f8f5ff;
  padding: 0.75rem 1.25rem;
  border: 1px solid #eadbff;
}

.points-chip p {
  font-size: 0.85rem;
  color: #94a3b8;
}

.points-chip strong {
  font-size: 1.2rem;
  color: #6638b8;
}

.chip-icon {
  width: 32px;
  height: 32px;
  color: #c084fc;
}

.draw-panel {
  border-radius: 28px;
  border: 1px solid #f0e9ff;
  background: linear-gradient(180deg, #fef6ff 0%, #f3f7ff 100%);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.draw-panel__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 600;
  color: #8b5cf6;
  margin-bottom: 1rem;
}

.draw-panel__meta {
  display: flex;
  gap: 1rem;
  color: #64748b;
  font-weight: 500;
}

.draw-panel__board {
  border-radius: 24px;
  background: #ffffff;
  padding: 1.25rem;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.6);
}

.draw-progress {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1.25rem;
  font-size: 0.9rem;
  color: #94a3b8;
}

.draw-progress__track {
  height: 8px;
  border-radius: 999px;
  background: #e2e8f0;
  overflow: hidden;
}

.draw-progress__fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #f472b6, #a78bfa);
}

.draw-progress__value {
  font-weight: 600;
  color: #7c3aed;
}

.draw-error {
  margin: 0.75rem 0 0;
  color: #ef4444;
  font-size: 0.9rem;
}

.reward-modal {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.reward-modal__backdrop {
  position: absolute;
  inset: 0;
  background: rgba(15, 23, 42, 0.65);
}

.reward-modal__content {
  position: relative;
  background: #faf5ff;
  border-radius: 32px;
  padding: 2.5rem;
  max-width: 480px;
  width: calc(100% - 2rem);
  text-align: center;
  border: 1px solid rgba(168, 85, 247, 0.3);
  box-shadow: 0 30px 60px rgba(79, 70, 229, 0.25);
}

.reward-modal__close {
  position: absolute;
  top: 1rem;
  right: 1.25rem;
  border: none;
  background: transparent;
  font-size: 1.2rem;
  color: #a855f7;
  cursor: pointer;
}

.reward-modal__hero {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #a855f7;
  font-weight: 700;
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
}

.reward-modal__sparkle {
  width: 22px;
  height: 22px;
}

.reward-modal__body {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.reward-modal__emoji {
  font-size: 3rem;
}

.reward-modal__name {
  font-size: 1.4rem;
  font-weight: 700;
  color: #0f172a;
}

.reward-modal__desc {
  color: #475569;
  margin: 0.35rem 0 0.6rem;
}

.reward-modal__badge {
  border-radius: 999px;
  padding: 0.45rem 1.2rem;
}

.reward-modal__cta {
  width: 100%;
  border: none;
  border-radius: 16px;
  background: linear-gradient(135deg, #a855f7, #ec4899);
  color: #fff;
  font-weight: 600;
  padding: 0.9rem;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.reward-modal__cta:hover {
  transform: translateY(-1px);
  box-shadow: 0 12px 25px rgba(236, 72, 153, 0.35);
}

.reward-modal__cta:active {
  transform: translateY(0);
  box-shadow: none;
}

.reward-modal__details {
  text-align: center;
}

.reward-modal__content button:focus-visible {
  outline: 2px solid rgba(168, 85, 247, 0.5);
  outline-offset: 2px;
}

.reward-modal-enter-active,
.reward-modal-leave-active {
  transition: opacity 0.2s ease;
}

.reward-modal-enter-from,
.reward-modal-leave-to {
  opacity: 0;
}

.draw-hint {
  text-align: center;
  font-size: 0.9rem;
  color: #94a3b8;
  margin: 0.5rem 0 1rem;
}

.ticket-info {
  border-radius: 20px;
  background: #f4f6fb;
  padding: 1rem 1.25rem;
  margin-bottom: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.95rem;
  color: #475569;
}

.ticket-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.probability-card {
  border-radius: 24px;
  border: 1px solid #edf0f7;
  padding: 1.25rem;
  margin-bottom: 1.25rem;
  background: #ffffff;
}

.probability-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #475569;
  margin-bottom: 1rem;
}

.probability-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.probability-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.probability-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  color: #0f172a;
}

.probability-emoji {
  font-size: 1.3rem;
}

.probability-meter {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
}

.probability-track {
  flex: 1;
  height: 8px;
  border-radius: 999px;
  background: #e2e8f0;
  overflow: hidden;
}

.probability-fill {
  height: 100%;
  border-radius: 999px;
}

.probability-fill--common {
  background: linear-gradient(90deg, #d8b4fe, #a78bfa);
}

.probability-fill--rare {
  background: linear-gradient(90deg, #99f6e4, #34d399);
}

.probability-fill--epic {
  background: linear-gradient(90deg, #c4b5fd, #8b5cf6);
}

.probability-fill--legendary {
  background: linear-gradient(90deg, #fcd34d, #fb923c);
}

.history-card {
  border-radius: 24px;
  border: 1px solid #edf0f7;
  padding: 1.25rem;
  background: #fcfdff;
}

.history-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  color: #475569;
  font-weight: 600;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 260px;
  overflow-y: auto;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 18px;
  border: 1px solid #f1f5f9;
  background: #fff;
}

.history-emoji {
  font-size: 1.7rem;
}

.history-text p {
  font-weight: 600;
  color: #0f172a;
}

.history-text small {
  display: block;
  color: #94a3b8;
}

.history-badge {
  margin-left: auto;
  border-radius: 999px;
}

.shadow-soft {
  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.08);
}
</style>
