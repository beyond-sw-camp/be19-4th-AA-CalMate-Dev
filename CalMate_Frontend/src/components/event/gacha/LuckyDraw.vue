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

    <div class="history-trigger-card">
      <button type="button" class="history-trigger" @click="openHistoryModal">
        <div>
          <p class="history-trigger__eyebrow">내가 뽑은 목록</p>
          <p class="history-trigger__title">최근 보상을 한눈에 확인해보세요</p>
        </div>
        <div class="history-trigger__meta">
          <span class="history-trigger__count">{{ historyTotalLabel }}</span>
          <span class="history-trigger__chevron" aria-hidden="true">↗</span>
        </div>
      </button>
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
            <div class="reward-modal__image-wrapper">
              <img
                v-if="currentRewardImage"
                :src="currentRewardImage"
                :alt="currentReward.name"
                class="reward-modal__image"
              />
              <div v-else class="reward-modal__image-fallback">
                {{ getRewardEmoji(currentReward.type) }}
              </div>
            </div>
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

  <Teleport to="body">
    <transition name="history-modal">
      <div
        v-if="showHistoryModal"
        class="history-modal"
        role="dialog"
        aria-modal="true"
        aria-label="내가 뽑은 보상 목록"
      >
        <div class="history-modal__backdrop" @click="closeHistoryModal" />
        <div class="history-modal__content">
          <button type="button" class="history-modal__close" @click="closeHistoryModal">
            ✕
          </button>
          <header class="history-modal__header">
            <p class="history-modal__eyebrow">행운의 뽑기</p>
            <h3>내가 뽑은 보상 목록</h3>
            <p class="history-modal__subtitle">이번 이벤트에서 획득한 보상을 확인하세요.</p>
          </header>

          <section class="history-modal__stats">
            <article
              v-for="stat in historyStatCards"
              :key="stat.key"
              class="history-modal__stat-card"
            >
              <p>{{ stat.label }}</p>
              <strong>{{ stat.value }}</strong>
              <small v-if="stat.suffix">{{ stat.suffix }}</small>
            </article>
          </section>

          <section class="history-modal__body">
            <p v-if="historyError" class="history-modal__error">{{ historyError }}</p>

            <div v-else-if="!historyItems.length && !historyLoading" class="history-modal__empty">
              <div class="history-modal__gift">🎁</div>
              <p>아직 뽑은 보상이 없습니다.</p>
              <small>행운의 뽑기를 시도해보세요!</small>
            </div>

            <div v-else>
              <ul class="history-modal__list">
                <li v-for="item in historyItems" :key="item.id" class="history-modal__row">
                  <div class="history-modal__rarity">
                    {{ rarityConfig[item.rarity]?.emoji || '🎁' }}
                  </div>
                  <div class="history-modal__list-text">
                    <p>{{ item.name }}</p>
                    <small>{{ item.description }}</small>
                  </div>
                  <div class="history-modal__list-meta">
                    <Badge variant="outline" class="history-modal__rarity-badge">
                      {{ rarityConfig[item.rarity]?.label || '보상' }}
                    </Badge>
                    <span>{{ formatHistoryDate(item.wonAt) }}</span>
                  </div>
                </li>
              </ul>

              <div class="history-modal__footer">
                <button
                  v-if="historyHasMore"
                  type="button"
                  class="history-modal__load"
                  :disabled="historyLoading"
                  @click="loadMoreHistory"
                >
                  {{ historyLoading ? '불러오는 중...' : '더 불러오기' }}
                </button>
                <p v-else class="history-modal__footer-text">
                  {{ historyItems.length ? '마지막 기록까지 모두 확인했어요.' : '' }}
                </p>
              </div>
            </div>

            <p v-if="historyLoading && !historyItems.length" class="history-modal__loading">
              불러오는 중입니다...
            </p>
          </section>
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
  fetchMemberDrawHistory,
  drawGacha,
} from '@/api/gacha';
import Badge from '../ui/Badge.vue';
import VintageDrawBoard from './VintageDrawBoard.vue';
import { drawReward as drawRewardFallback } from '../lib/rewardsData.js';
import { LUCKY_DRAW_TICKET_COST } from '../lib/pointsSystem.js';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const DEFAULT_API_BASE_URL = 'http://localhost:8081';
const API_BASE_URL = (import.meta.env?.VITE_API_BASE_URL || DEFAULT_API_BASE_URL).replace(/\/$/, '');
const WS_BASE_URL = (import.meta.env?.VITE_WS_BASE_URL || API_BASE_URL).replace(/\/$/, '');

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
const stompClient = ref(null);
const subscription = ref(null);
const stompConnected = ref(false);
const currentTopic = ref('');
const showHistoryModal = ref(false);
const historyItems = ref([]);
const historyLoading = ref(false);
const historyError = ref('');
const historyPage = ref(1);
const historyHasMore = ref(false);
const historyStats = ref(createDefaultHistoryStats());
const historyTotal = ref(0);
const historyNeedsRefresh = ref(true);
const historyModalListener = ref(null);

const boardCells = ref([]);
const boardSnapshot = ref(null);
const prizePool = ref([]);
const eventInfo = ref(null);
const isLoadingBoard = ref(false);
const isDrawing = ref(false);
const isAutoDrawing = ref(false);
const autoDrawPending = ref(0);
const loadError = ref('');
const currentRewardImage = computed(() => getRewardImage(currentReward.value));

const localRevealedSlots = ref(new Set());
const LOCAL_REWARD_KEY = 'wonRewards';
const LOCAL_SLOT_KEY = 'revealedDrawSlots';
const FALLBACK_SLOT_COUNT = 100;
const AUTO_REROLL_TRIGGER_RARITY = 'legendary';
const AUTO_REROLL_BATCH = 100; // 10 x 10 automatic draws
const AUTO_REROLL_DELAY_MS = 350;
const BOARD_RESET_DELAY_MS = 400;
const HISTORY_PAGE_SIZE = 12;

const rarityConfig = {
  common: {
    key: 'common',
    label: '꽝',
    emoji: '⚪',
    chance: 70,
  },
  rare: {
    key: 'rare',
    label: '100포인트',
    emoji: '🔵',
    chance: 25,
  },
  epic: {
    key: 'epic',
    label: '춥파춥스',
    emoji: '🟣',
    chance: 4,
  },
  legendary: {
    key: 'legendary',
    label: '츄잉껌',
    emoji: '🟡',
    chance: 1,
  },
};

const rarityOrder = ['common', 'rare', 'epic', 'legendary'];
const rarityImageMap = {
  common: new URL('@/assets/images/gacha/reward-common.svg', import.meta.url).href,
  rare: new URL('@/assets/images/gacha/reward-rare.svg', import.meta.url).href,
  epic: new URL('@/assets/images/gacha/reward-epic.svg', import.meta.url).href,
  legendary: new URL('@/assets/images/gacha/reward-legendary.svg', import.meta.url).href,
};
const DEFAULT_REWARD_IMAGE = new URL('@/assets/images/gacha/reward-default.svg', import.meta.url).href;
const rewardNameImageMap = {
  '다이아몬드 상자': rarityImageMap.legendary,
  '골드 쿠폰': rarityImageMap.epic,
  '1000 포인트': rarityImageMap.rare,
  '100 포인트': rarityImageMap.common,
  '꽝': rarityImageMap.common,
};

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

const historyTotalLabel = computed(() => `${historyTotal.value.toLocaleString()}회`);
const historyStatCards = computed(() => [
  {
    key: 'total',
    label: '총 뽑기',
    value: historyTotalLabel.value,
    suffix: '',
  },
  {
    key: 'common',
    label: `${rarityConfig.common.label}`,
    value: `${(historyStats.value.common ?? 0).toLocaleString()} 회`,
    suffix: '',
  },
  {
    key: 'rare',
    label: `${rarityConfig.rare.label}`,
    value: `${(historyStats.value.rare ?? 0).toLocaleString()} 회`,
    suffix: '',
  },
  {
    key: 'epic',
    label: `${rarityConfig.epic.label}`,
    value: `${(historyStats.value.epic ?? 0).toLocaleString()} 회`,
    suffix: '',
  },
  {
    key: 'legendary',
    label: `${rarityConfig.legendary.label}`,
    value: `${(historyStats.value.legendary ?? 0).toLocaleString()} 회`,
    suffix: '',
  },
]);

const isRewardModalVisible = computed(() => showResult.value && Boolean(currentReward.value));

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

  // 실시간 업데이트를 위한 WebSocket 연결 시작
  connectWebSocket();
});

watch(
  () => eventInfo.value?.id,
  (eventId) => {
    if (eventId && stompConnected.value) {
      subscribeToEventTopic(eventId);
    }
    resetHistoryState();
  },
);

watch(memberId, (value, oldValue) => {
  if (value && value !== oldValue) {
    initializeGacha();
    resetHistoryState();
  }

  if (!value) {
    resetServerState();
    resetHistoryState();
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

function createDefaultHistoryStats() {
  return {
    common: 0,
    rare: 0,
    epic: 0,
    legendary: 0,
  };
}

function normalizeHistoryStats(payload) {
  const base = createDefaultHistoryStats();
  if (payload && typeof payload === 'object') {
    Object.keys(base).forEach((key) => {
      if (payload[key] != null) {
        base[key] = Number(payload[key]) || 0;
      }
    });
  }
  return base;
}

async function openHistoryModal() {
  showHistoryModal.value = true;
  historyError.value = '';

  if (historyNeedsRefresh.value || !historyItems.value.length) {
    await fetchHistory({ reset: true });
  }
}

function closeHistoryModal() {
  showHistoryModal.value = false;
}

async function fetchHistory({ reset = false, page } = {}) {
  if (!memberId.value) {
    historyError.value = '로그인 후 이용해주세요.';
    historyItems.value = [];
    historyStats.value = createDefaultHistoryStats();
    historyHasMore.value = false;
    historyTotal.value = 0;
    return;
  }

  const eventId = eventInfo.value?.id;
  const targetPage = page ?? (reset ? 1 : historyPage.value + 1);

  if (reset) {
    historyItems.value = [];
  }

  historyLoading.value = true;
  historyError.value = '';

  try {
    const payload = await fetchMemberDrawHistory(
      memberId.value,
      eventId,
      targetPage,
      HISTORY_PAGE_SIZE,
    );

    const entries = Array.isArray(payload?.content) ? payload.content : [];
    const normalized = entries.map((entry) => mapHistoryItem(entry)).filter(Boolean);

    historyItems.value = reset ? normalized : [...historyItems.value, ...normalized];
    historyPage.value = payload?.page ?? targetPage;
    historyHasMore.value = payload?.last === false;
    historyTotal.value = Number(payload?.totalElements ?? historyItems.value.length);
    historyStats.value = normalizeHistoryStats(payload?.rarityStats);
    historyNeedsRefresh.value = false;
  } catch (error) {
    console.warn('Failed to fetch draw history', error);
    historyError.value =
      error?.response?.data?.message || error?.message || '뽑기 이력을 불러오지 못했습니다.';
  } finally {
    historyLoading.value = false;
  }
}

async function loadMoreHistory() {
  if (historyLoading.value || !historyHasMore.value) return;
  await fetchHistory({ reset: false, page: historyPage.value + 1 });
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
  const description =
    payload?.description || payload?.desc || payload?.message || payload?.text || '';
  const imageUrl = payload?.imageUrl || payload?.image || payload?.iconUrl || payload?.icon;
  const type = (payload?.type || prize.prizeType || 'item').toLowerCase();

  return {
    id: prize.id,
    name: prize.name,
    type,
    description: description || defaultPrizeDescription(type, prize.name),
    payload: imageUrl ? { ...payload, imageUrl } : payload,
    imageUrl,
    rarity: rarityOrder.includes(rarity) ? rarity : 'common',
    rank: prize.rank,
    quantity: prize.quantity,
  };
}

function mapHistoryItem(entry) {
  if (!entry) return null;
  const rarity = entry.rarity || rankToRarity(entry.prizeRank);
  const payload = entry.prizePayload || {};
  const description =
    payload.description ||
    payload.desc ||
    payload.message ||
    payload.text ||
    defaultPrizeDescription(entry.prizeType, entry.prizeName);

  return {
    id: entry.id,
    name: entry.prizeName || '보상',
    rarity: rarityOrder.includes(rarity) ? rarity : 'common',
    type: typeof entry.prizeType === 'string' ? entry.prizeType.toLowerCase() : 'item',
    description,
    wonAt: entry.createdAt,
  };
}

function formatHistoryDate(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString('ko-KR', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

async function refreshHistoryAfterDraw() {
  if (!memberId.value) return;
  if (showHistoryModal.value) {
    await fetchHistory({ reset: true, page: 1 });
  } else {
    historyNeedsRefresh.value = true;
  }
}

function resetHistoryState() {
  historyItems.value = [];
  historyStats.value = createDefaultHistoryStats();
  historyTotal.value = 0;
  historyPage.value = 1;
  historyHasMore.value = false;
  historyNeedsRefresh.value = true;
  historyError.value = '';
}

const handleHistoryKeydown = (event) => {
  if (event.key === 'Escape') {
    event.preventDefault();
    closeHistoryModal();
  }
};

function rankToRarity(rank) {
  if (rank === 1) return 'legendary';
  if (rank === 2) return 'epic';
  if (rank === 3) return 'rare';
  return 'common';
}

function defaultPrizeDescription(type, name) {
  const normalized = String(type || '').toLowerCase();
  if (normalized === 'point') return '즉시 적립 포인트';
  if (normalized === 'coupon') return '교환 가능한 쿠폰';
  if (normalized === 'item') return '특별 굿즈 보상';
  if (normalized === 'nothing' || name === '꽝') return '아쉽지만 다음 기회에!';
  return '가챠 보상';
}

function resolveRarityFromTier(tier) {
  const normalized = String(tier || '').trim().toLowerCase();
  return rarityConfig[normalized]?.key || 'common';
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

function buildRewardFromServer({ prizeId, prizeTier, inventoryId }) {
  const rewardById = prizeId ? findPrize(prizeId) : null;
  if (rewardById) {
    return rewardById;
  }

  const tierName = typeof prizeTier === 'string' ? prizeTier.trim() : '';
  const rewardByName = tierName ? prizePool.value.find((p) => p.name === tierName) : null;
  if (rewardByName) {
    return rewardByName;
  }

  return {
    id: prizeId || inventoryId || generateFallbackId(),
    name: tierName || '보상',
    type: 'item',
    description: '가챠 보상',
    rarity: resolveRarityFromTier(tierName),
  };
}

function generateFallbackId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `reward-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
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

  isDrawing.value = true;
  loadError.value = '';

  try {
    // 백엔드의 가챠 뽑기 API 호출 (포인트 차감 + 셀 오픈 + 로그 기록 모두 처리됨)
    const result = await drawGacha(eventInfo.value.id, memberId.value, targetCell.id);

    if (!result.success) {
      loadError.value = result.reason || '가챠 뽑기에 실패했습니다.';
      showResult.value = false;
      return;
    }

    // 백엔드에서 오픈한 셀 정보로 업데이트
    const openedAt = new Date().toISOString();
    const openedCellId = result.cellId;
    const prizeTier = result.prizeTier;
    const prizeId = targetCell.gachaPrizeId;

    // 보드 셀 상태 업데이트
    boardCells.value = boardCells.value.map((cell) =>
      cell.id === openedCellId
        ? {
            ...cell,
            status: 'OPENED',
            openedAt,
            openedByMemberId: memberId.value,
          }
        : cell,
    );

    // 경품 정보 찾기
    const reward = buildRewardFromServer({
      prizeId,
      prizeTier,
      inventoryId: result.inventoryId,
    });

    currentReward.value = reward;
    wonRewards.value = [...wonRewards.value, { ...reward, wonAt: openedAt }];
    showResult.value = true;
    emit('points-used', LUCKY_DRAW_TICKET_COST);
    await refreshHistoryAfterDraw();
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
  refreshHistoryAfterDraw();

  const updated = new Set(localRevealedSlots.value);
  updated.add(slotIndex);
  localRevealedSlots.value = updated;
  scheduleBoardReset();
}

function getRewardEmoji(type) {
  if (type === 'coupon') return '🎟️';
  if (type === 'avatar') return '👤';
  if (type === 'title') return '🏷️';
  if (type === 'point') return '💰';
  if (type === 'nothing') return '⭕';
  return '🎖️';
}

function getRewardImage(reward) {
  if (!reward) return null;

  const directImage = reward.imageUrl || reward.payload?.imageUrl;
  if (isValidAssetUrl(directImage)) {
    return directImage;
  }

  if (rewardNameImageMap[reward.name]) {
    return rewardNameImageMap[reward.name];
  }

  const rarityKey = reward.rarity || resolveRarityFromTier(reward.name);
  if (rarityImageMap[rarityKey]) {
    return rarityImageMap[rarityKey];
  }

  return DEFAULT_REWARD_IMAGE;
}

function isValidAssetUrl(value) {
  if (!value || typeof value !== 'string') return false;
  if (/^https?:\/\//i.test(value)) return true;
  if (value.startsWith('data:')) return true;
  if (value.startsWith('/')) return true;
  return false;
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

function updateBodyScrollLock() {
  if (typeof document === 'undefined') return;
  if (isRewardModalVisible.value || showHistoryModal.value) {
    document.body.classList.add('overflow-hidden');
  } else {
    document.body.classList.remove('overflow-hidden');
  }
}

watch(
  isRewardModalVisible,
  (isOpen) => {
    if (typeof document === 'undefined') return;
    if (isOpen) {
      rewardModalListener.value = handleModalKeydown;
      window.addEventListener('keydown', rewardModalListener.value);
    } else if (rewardModalListener.value) {
      window.removeEventListener('keydown', rewardModalListener.value);
      rewardModalListener.value = null;
    }
    updateBodyScrollLock();
  },
  { immediate: true },
);

watch(
  showHistoryModal,
  (isOpen, _, onCleanup) => {
    if (typeof document === 'undefined') return;
    if (isOpen) {
      historyModalListener.value = handleHistoryKeydown;
      window.addEventListener('keydown', historyModalListener.value);
    } else if (historyModalListener.value) {
      window.removeEventListener('keydown', historyModalListener.value);
      historyModalListener.value = null;
    }
    updateBodyScrollLock();

    onCleanup(() => {
      if (historyModalListener.value) {
        window.removeEventListener('keydown', historyModalListener.value);
        historyModalListener.value = null;
      }
    });
  },
);

function connectWebSocket() {
  // WebSocket 클라이언트 생성
  const wsEndpoint = `${WS_BASE_URL}/ws-gacha`;
  const client = new Client({
    webSocketFactory: () => new SockJS(wsEndpoint),
    debug: (str) => {
      console.log('[STOMP Debug]', str);
    },
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
    onConnect: () => {
      stompConnected.value = true;
      console.log('✅ WebSocket 연결 성공!');

      if (eventInfo.value?.id) {
        subscribeToEventTopic(eventInfo.value.id);
      }
    },
    onDisconnect: () => {
      stompConnected.value = false;
      currentTopic.value = '';
      console.log('❌ WebSocket 연결 해제');
    },
    onWebSocketError: (event) => {
      console.error('웹소켓 연결 오류 - 기본값(로컬) 또는 환경 변수 설정을 확인하세요:', event);
    },
    onStompError: (frame) => {
      console.error('STOMP 오류:', frame);
    },
  });

  stompClient.value = client;
  client.activate();
}

function handleGachaUpdate(update) {
  if (!update || update.type !== 'DRAW_RESULT' || !update.cellId) {
    return;
  }

  console.log('🎰 가챠 업데이트 처리:', update);

  const openedAt = update.openedAt || new Date().toISOString();
  const updatedCells = boardCells.value.map((cell) =>
    cell.id === update.cellId
      ? {
          ...cell,
          status: 'OPENED',
          openedAt,
          openedByMemberId: update.memberId,
        }
      : cell,
  );

  boardCells.value = updatedCells;
  scheduleBoardReset();
}

function subscribeToEventTopic(eventId) {
  if (!eventId || !stompClient.value?.connected) return;

  const destination = `/topic/gacha/${eventId}`;
  if (currentTopic.value === destination && subscription.value) {
    return;
  }

  if (subscription.value) {
    subscription.value.unsubscribe();
    subscription.value = null;
  }

  subscription.value = stompClient.value.subscribe(destination, (message) => {
    console.log('📨 WebSocket 메시지 수신:', message.body);
    try {
      const update = JSON.parse(message.body);
      handleGachaUpdate(update);
    } catch (error) {
      console.error('WebSocket 메시지 파싱 오류:', error);
    }
  });
  currentTopic.value = destination;
}

function disconnectWebSocket() {
  if (subscription.value) {
    subscription.value.unsubscribe();
    subscription.value = null;
  }

  if (stompClient.value) {
    stompClient.value.deactivate();
    stompClient.value = null;
  }

  currentTopic.value = '';
  stompConnected.value = false;
  console.log('🔌 WebSocket 연결 종료');
}

onBeforeUnmount(() => {
  if (rewardModalListener.value) {
    window.removeEventListener('keydown', rewardModalListener.value);
    rewardModalListener.value = null;
  }
  if (historyModalListener.value) {
    window.removeEventListener('keydown', historyModalListener.value);
    historyModalListener.value = null;
  }
  if (typeof document !== 'undefined') {
    document.body.classList.remove('overflow-hidden');
  }
  if (boardResetTimer.value) {
    clearTimeout(boardResetTimer.value);
  }
  disconnectWebSocket();
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

.reward-modal__image-wrapper {
  width: 200px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

.reward-modal__image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 16px;
}
.reward-modal__image-fallback {
  width: 100%;
  height: 100%;
  border-radius: 20px;
  background: linear-gradient(135deg, #eef2ff, #fce7f3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: #7c3aed;
  border: 1px solid rgba(124, 58, 237, 0.25);
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

.history-trigger-card {
  margin: 1.25rem 0;
}

.history-trigger {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 20px;
  border: 1px solid #ede9fe;
  background: #f8f5ff;
  padding: 1rem 1.25rem;
  text-align: left;
  gap: 1rem;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.history-trigger:hover {
  box-shadow: 0 12px 24px rgba(99, 102, 241, 0.15);
  transform: translateY(-2px);
}

.history-trigger__eyebrow {
  font-size: 0.85rem;
  color: #9a8cfc;
  font-weight: 600;
  margin-bottom: 0.15rem;
}

.history-trigger__title {
  font-size: 1rem;
  color: #4a4a68;
}

.history-trigger__meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #7c3aed;
  font-weight: 600;
}

.history-trigger__count {
  font-size: 1.2rem;
}

.history-trigger__chevron {
  font-size: 1.4rem;
}

.history-modal {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 60;
}

.history-modal__backdrop {
  position: absolute;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
}

.history-modal__content {
  position: relative;
  width: min(640px, calc(100% - 2rem));
  background: #ffffff;
  border-radius: 32px;
  padding: 2.25rem;
  z-index: 1;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.history-modal__close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  border: none;
  background: transparent;
  font-size: 1.2rem;
  cursor: pointer;
  color: #94a3b8;
}

.history-modal__header h3 {
  font-size: 1.5rem;
  margin-top: 0.35rem;
  color: #0f172a;
}

.history-modal__eyebrow {
  font-size: 0.85rem;
  color: #a78bfa;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-weight: 600;
}

.history-modal__subtitle {
  color: #94a3b8;
  margin-top: 0.5rem;
}

.history-modal__stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
  gap: 0.75rem;
}

.history-modal__stat-card {
  border-radius: 20px;
  border: 1px solid #f1f5f9;
  background: #f9f9ff;
  padding: 0.85rem 1rem;
}

.history-modal__stat-card p {
  font-size: 0.85rem;
  color: #94a3b8;
  margin-bottom: 0.35rem;
}

.history-modal__stat-card strong {
  font-size: 1.3rem;
  color: #4c1d95;
}

.history-modal__body {
  border-radius: 24px;
  border: 1px solid #edf0f7;
  background: #fafbff;
  padding: 1.5rem;
  max-height: 50vh;
  overflow-y: auto;
}

.history-modal__list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.history-modal__row {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.9rem 1rem;
  border-radius: 18px;
  background: #fff;
  border: 1px solid #f1f5f9;
}

.history-modal__rarity {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: #f5f3ff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
}

.history-modal__list-text p {
  font-weight: 600;
  color: #0f172a;
}

.history-modal__list-text small {
  color: #94a3b8;
}

.history-modal__list-meta {
  margin-left: auto;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
  font-size: 0.85rem;
  color: #94a3b8;
}

.history-modal__rarity-badge {
  border-radius: 999px;
}

.history-modal__error {
  color: #b91c1c;
  background: #fef2f2;
  border-radius: 16px;
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
}

.history-modal__empty {
  text-align: center;
  padding: 2rem 1rem;
  color: #94a3b8;
}

.history-modal__gift {
  font-size: 3rem;
  margin-bottom: 0.75rem;
}

.history-modal__loading {
  margin-top: 1rem;
  text-align: center;
  color: #7c3aed;
}

.history-modal__footer {
  margin-top: 1rem;
  text-align: center;
}

.history-modal__load {
  border: none;
  border-radius: 999px;
  padding: 0.7rem 2rem;
  background: #7c3aed;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
}

.history-modal__load:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.history-modal__footer-text {
  color: #94a3b8;
}

.shadow-soft {
  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.08);
}
</style>
