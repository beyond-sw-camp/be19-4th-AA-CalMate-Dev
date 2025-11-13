<template>
  <div class="points-layout">
    <main class="points-layout__content">
      <div class="points-page space-y-8">
        <!-- 헤더 카드 -->
        <section class="summary-card shadow-soft">
          <div class="summary-heading">
            <div>
              <p class="summary-eyebrow">포인트 & 보상</p>
              <h2 class="summary-title">활동을 기록하고 포인트를 모아보세요</h2>
              <p class="summary-subtitle">꾸준한 한 걸음이 더 큰 보상으로 돌아옵니다.</p>
            </div>

            <div class="summary-chip">
              <span class="chip-dot" />
              꾸준한 기록으로 등급을 올려보세요
            </div>
          </div>

          <!-- 통계 카드 (3개) -->
          <StatsGrid :items="statCards" @item-click="onStatItemClick"/>
        </section>

          <!-- 모달 -->
          <PointsHistoryModal
            v-model:open="showHistory"
            :total="totalPoints"
            :available="availablePoints"
            :histories="pointHistories"
          />

        <!-- 탭 -->
        <Tabs v-model="activeTab" class="w-full">
          <TabsList class="points-tabs">
            <TabsTrigger
              value="achievements"
              :class="['points-tab', { 'points-tab--active': activeTab === 'achievements' }]"
            >
              업적
            </TabsTrigger>
            <TabsTrigger
              value="bingo"
              :class="['points-tab', { 'points-tab--active': activeTab === 'bingo' }]"
            >
              빙고
            </TabsTrigger>
            <TabsTrigger
              value="lucky-draw"
              :class="['points-tab', { 'points-tab--active': activeTab === 'lucky-draw' }]"
            >
              뽑기
            </TabsTrigger>
          </TabsList>

          <!-- 업적 -->
          <TabsContent value="achievements" class="space-y-6">
            <section class="panel-card shadow-soft">
              <div class="panel-header">
                <div>
                  <p class="panel-eyebrow">업적 진행도</p>
                  <h3>업적 목록</h3>
                </div>
                <Badge variant="secondary" class="panel-badge">
                  {{ unlockedAchievements }} / {{ achievements.length }} 완료
                </Badge>
              </div>

              <div class="space-y-4">
                <article
                  v-for="achievement in achievements"
                  :key="achievement.id"
                  :class="['achievement-card', achievement.unlocked && 'achievement-card--active']"
                >
                  <div class="achievement-icon">{{ achievement.icon }}</div>

                  <div class="flex-1 space-y-3">
                    <div class="flex items-center justify-between gap-4">
                      <div>
                        <h4 class="achievement-title">{{ achievement.name }}</h4>
                        <p class="achievement-desc">{{ achievement.description }}</p>
                      </div>
                      <Badge
                        v-if="achievement.unlocked"
                        variant="default"
                        class="rounded-full px-3 py-1"
                      >
                        달성!
                      </Badge>
                    </div>

                    <div class="progress-wrapper">
                      <div class="progress-track">
                        <div
                          class="progress-fill"
                          :style="{ width: `${Math.round(achievement.progress)}%` }"
                        />
                      </div>
                      <span class="progress-value">{{ Math.round(achievement.progress) }}%</span>
                    </div>

                    <p class="reward-text">보상: <span>{{ achievement.points.toLocaleString() }} 포인트</span></p>
                  </div>
                </article>
              </div>
            </section>

            <section class="panel-card shadow-soft">
              <div class="panel-header">
                <div>
                  <p class="panel-eyebrow">포인트 가이드</p>
                  <h3>포인트 획득 방법</h3>
                </div>
              </div>

              <div class="point-list">
                <div v-for="source in pointSources" :key="source.id" class="point-item">
                  <span>{{ source.label }}</span>
                  <span class="point-value">+{{ source.points.toLocaleString() }} 포인트</span>
                </div>
              </div>
            </section>
          </TabsContent>

          <!-- 빙고 -->
          <TabsContent value="bingo">
            <section class="panel-card shadow-soft">
              <BingoBoard />
            </section>
          </TabsContent>

          <!-- 뽑기 -->
          <TabsContent value="lucky-draw">
            <section class="panel-card shadow-soft">
              <LuckyDraw :available-points="availablePoints" @points-used="handlePointsUsed" />
            </section>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { Trophy, Flame, Award } from 'lucide-vue-next';
import StatsGrid from '@/components/event/StatsGrid.vue';
import PointsHistoryModal from '@/components/event/PointsHistoryModal.vue';
import Badge from '@/components/event/ui/Badge.vue';
import Tabs from '@/components/event/ui/Tabs.vue';
import TabsList from '@/components/event/ui/TabsList.vue';
import TabsTrigger from '@/components/event/ui/TabsTrigger.vue';
import TabsContent from '@/components/event/ui/TabsContent.vue';
import BingoBoard from '@/components/event/bingo/Monthlybingochallenge.vue';
import LuckyDraw from '@/components/event/gacha/LuckyDraw.vue';
import { fetchPointSummary, fetchPointHistory } from '@/api/eventpoints';
import { fetchBadgeCountRange } from '@/api/pointcalendar';
import { useUserStore } from '@/stores/user';
import { LUCKY_DRAW_TICKET_COST, calculateTotalPoints, calculateStreak } from '@/components/event/lib/pointsSystem.js';

const showHistory = ref(false);

const props = defineProps({
  profile: { type: Object, required: true },
});

const TEST_LUCKY_DRAW_POINTS = 5000;
const hasProfileData = computed(
  () => props.profile && Object.keys(props.profile).length > 0,
);
const resolvedProfile = computed(() =>
  hasProfileData.value
    ? props.profile
    : {
        points: TEST_LUCKY_DRAW_POINTS,
        manualPoints: 0,
      },
);

const userStore = useUserStore();
const memberId = computed(() => userStore.userId);

const totalPoints = ref(0);
const streak = ref(0);
const badges = ref([]);
const badgeCount = ref(0);
const activeTab = ref('achievements');

const availablePoints = computed(() => Math.max(0, totalPoints.value));

const pointHistories = ref([]);

/** 상단 3개 카드 */
const statCards = computed(() => [
  {
    id: 'total',
    label: '포인트',
    value: formatNumber(totalPoints.value),
    helper: '현재 포인트',
    icon: Trophy,
    iconColor: 'text-amber-500',
    tint: 'stat-icon--gold',
    clickable: true,
  },
 {
    id: 'streak',
    label: '연속 기록',
    value: formatNumber(streak.value),
    suffix: '일',
    helper: '빠짐없이 기록 중',
    icon: Flame,
    iconColor: 'text-orange-500',
    tint: 'stat-icon--sun',
    clickable: false,
  },
  {
    id: 'badges',
    label: '획득 뱃지',
    value: formatNumber(badgeCount.value),
    suffix: '개',
    helper: '업적 달성 현황',
    icon: Award,
    iconColor: 'text-purple-500',
    tint: 'stat-icon--lilac',
    clickable: false,
  },
]);

/** 하단 포인트 획득 방법 (사진과 동일한 항목/점수표) */
const pointSources = Object.freeze([
  { id: 'signup', label: '회원가입', points: 100 },
  { id: 'sign', label: '로그인', points: 10 },
  { id: 'post', label: '게시물 작성', points: 10 },
  { id: 'share', label: '운동 & 식단 & 일기 작성', points: 5 },
  { id: 'bingoLine', label: '빙고 라인 완성 (라인당)', points: 50 },
]);

/** 업적 3단계 (1000/5000/10000) */
const achievements = computed(() => [
  {
    id: 'a1',
    name: '1000 포인트 달성',
    description: '1000 포인트를 획득하세요',
    icon: '🥇',
    unlocked: totalPoints.value >= 1000,
    progress: Math.min((totalPoints.value / 1000) * 100, 100),
    points: 100,
  },
  {
    id: 'a2',
    name: '5000 포인트 달성',
    description: '5000 포인트를 획득하세요',
    icon: '💎',
    unlocked: totalPoints.value >= 5000,
    progress: Math.min((totalPoints.value / 5000) * 100, 100),
    points: 500,
  },
  {
    id: 'a3',
    name: '10000 포인트 달성',
    description: '10000 포인트를 획득하세요',
    icon: '🔥',
    unlocked: totalPoints.value >= 10000,
    progress: Math.min((totalPoints.value / 10000) * 100, 100),
    points: 1000,
  },
]);

const unlockedAchievements = computed(() => achievements.value.filter(a => a.unlocked).length);

onMounted(loadPointsData);

watch(
  () => props.profile,
  () => loadPointsData(),
  { deep: true },
);

async function loadPointsData() {
  const { points: fallbackPoints } = calculateTotalPoints(resolvedProfile.value);
  const currentStreak = calculateStreak();
  streak.value = currentStreak;
  const { startDate, endDate } = getCurrentMonthRange();

  if (!memberId.value) {
    totalPoints.value = fallbackPoints;
    updateBadges(fallbackPoints, currentStreak);
    pointHistories.value = [];
    badgeCount.value = badges.value.length;
    return;
  }

  try {
    const [summary, histories, badgeSummary] = await Promise.all([
      fetchPointSummary(memberId.value),
      fetchPointHistory(memberId.value, 40),
      fetchBadgeCountRange({ memberId: memberId.value, startDate, endDate }),
    ]);

    const currentPoint = summary?.currentPoint ?? fallbackPoints;
    totalPoints.value = currentPoint;
    updateBadges(currentPoint, currentStreak);
    pointHistories.value = normalizeHistories(histories);
    badgeCount.value =
      typeof badgeSummary?.badgeCount === 'number' ? badgeSummary.badgeCount : badges.value.length;
  } catch (error) {
    console.warn('Failed to load member points. Falling back to profile data.', error);
    totalPoints.value = fallbackPoints;
    updateBadges(fallbackPoints, currentStreak);
    pointHistories.value = [];
    badgeCount.value = badges.value.length;
  }
}

function updateBadges(pointsValue, currentStreak) {
  const badgeList = [];
  if (currentStreak >= 7) badgeList.push('7일 연속 기록');
  if (currentStreak >= 30) badgeList.push('30일 연속 기록');
  if (pointsValue >= 1000) badgeList.push('1000 포인트 달성');
  if (pointsValue >= 5000) badgeList.push('5000 포인트 달성');
  if (pointsValue >= 10000) badgeList.push('10000 포인트 달성');
  badges.value = badgeList;
}

function normalizeHistories(items) {
  if (!Array.isArray(items)) return [];
  return items
    .map((item) => {
      if (!item) return null;
      const occurredAtDate = parseHistoryDate(
        item.occurredAt ?? item.historyTime ?? item.history_time ?? item.historyDate ?? item.createdAt,
      );
      const formattedDate = occurredAtDate ? formatHistoryDate(occurredAtDate) : '-';
      return {
        title: item.title || (item.type === 'EARN' ? '포인트 적립' : '포인트 사용'),
        occurredAt: occurredAtDate ? occurredAtDate.toISOString() : null,
        date: formattedDate,
        dateLabel: formattedDate,
        points: item.points ?? 0,
        type: item.type || 'EARN',
      };
    })
    .filter(Boolean);
}

function parseHistoryDate(value) {
  if (!value && value !== 0) return null;
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }
  if (typeof value === 'number') {
    const ms = value > 1e12 ? value : value * 1000;
    const date = new Date(ms);
    return Number.isNaN(date.getTime()) ? null : date;
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return null;
    if (/^\d+$/.test(trimmed)) {
      return parseHistoryDate(Number(trimmed));
    }
    const normalized = trimmed.includes('T') ? trimmed : trimmed.replace(' ', 'T');
    const date = new Date(normalized);
    return Number.isNaN(date.getTime()) ? null : date;
  }
  return null;
}

function formatHistoryDate(value) {
  const date = value instanceof Date ? value : parseHistoryDate(value);
  if (!date) return '-';
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate(),
  ).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(
    date.getMinutes(),
  ).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
}

function onStatItemClick(item) {
  if (item.id === 'total') {
    showHistory.value = true;
  }
}

function handlePointsUsed(pointsToUse) {
  if (pointsToUse) {
    totalPoints.value = Math.max(0, totalPoints.value - pointsToUse);
  }
  loadPointsData();
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString();
}

function getCurrentMonthRange(referenceDate = new Date()) {
  const start = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1);
  const end = new Date(referenceDate.getFullYear(), referenceDate.getMonth() + 1, 0);
  return {
    startDate: formatDateInput(start),
    endDate: formatDateInput(end),
  };
}

function formatDateInput(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
</script>

<style scoped>
/* 레이아웃 */
.points-layout { display: flex; min-height: 100vh; background: #f8f9ff; }
.points-layout__content { flex: 1; padding: 2rem; background: #f5f6fb; min-height: 100vh; overflow-y: auto; }
.points-page { padding-bottom: 2rem; }

/* 헤더 카드 */
.summary-card {
  border-radius: 32px;
  border: 1px solid #edf0f7;
  background: linear-gradient(180deg, #ffffff 0%, #f9fbff 100%);
  padding: 2rem;
}
@media (min-width: 768px) { .summary-card { padding: 2.5rem; } }
.summary-heading { display: flex; flex-direction: column; gap: 1rem; }
@media (min-width: 768px) {
  .summary-heading { flex-direction: row; align-items: center; justify-content: space-between; }
}
.summary-eyebrow { color: #a78bfa; font-weight: 600; letter-spacing: .04em; text-transform: uppercase; font-size: .8rem; }
.summary-title { font-size: 1.8rem; font-weight: 700; color: #0f172a; }
.summary-subtitle { color: #64748b; margin-top: .5rem; }
.summary-chip { display: inline-flex; align-items: center; gap: .5rem; border-radius: 999px; padding: .5rem 1.25rem; background: #fff; border: 1px solid #e2e8f0; color: #475569; font-size: .9rem; }
.chip-dot { width: 8px; height: 8px; border-radius: 999px; background: #34d399; display: inline-block; }

/* 통계 카드 */
.stats-grid { margin-top: 1.5rem; display: grid; gap: 1rem; }
.stats-grid--three { grid-template-columns: repeat(3, minmax(180px, 1fr)); }
@media (max-width: 900px) { .stats-grid--three { grid-template-columns: repeat(1, minmax(180px, 1fr)); } }

.stat-card { display: flex; gap: 1rem; padding: 1.25rem; border-radius: 24px; border: 1px solid #f1f5f9; background: #ffffff; min-height: 110px; }
.stat-icon { width: 48px; height: 48px; border-radius: 16px; display: flex; align-items: center; justify-content: center; }
.stat-icon--gold { background: #fff7e1; }
.stat-icon--sun { background: #ffe9d6; }
.stat-icon--lilac { background: #f5ecff; }
.stat-label { color: #94a3b8; font-size: .85rem; }
.stat-value { font-size: 1.6rem; font-weight: 700; color: #0f172a; line-height: 1.2; }
.stat-suffix { margin-left: .25rem; font-size: 1rem; color: #64748b; }
.stat-helper { color: #94a3b8; font-size: .85rem; }

/* 탭 */
.points-tabs {
  margin-top: .5rem;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: .75rem;
  padding: .5rem;
  border-radius: 999px;
  background: #f1f5f9;
  height: auto !important;
}
.points-tab {
  border-radius: 999px !important;
  font-weight: 700 !important;
  font-size: .95rem !important;
  padding: .65rem 0 !important;
  height: 100% !important;
  background: transparent;
}
.points-tab--active {
  background: #ffffff !important;
  color: #0f172a !important;
  box-shadow: 0 12px 30px rgba(15, 23, 42, .08) !important;
}

/* 패널 카드 */
.panel-card { border-radius: 28px; border: 1px solid #edf0f7; background: #ffffff; padding: 2rem; }
.panel-header { display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-bottom: 1.25rem; }
.panel-eyebrow { color: #94a3b8; font-size: .85rem; text-transform: uppercase; letter-spacing: .08em; }
.panel-badge { border-radius: 999px; }

/* 업적 카드 */
.achievement-card { display: flex; gap: 1.25rem; padding: 1.25rem 1.5rem; border-radius: 24px; border: 1px solid #f1f5f9; background: #fcfcff; }
.achievement-card--active { border-color: #c4b5fd; background: #f5f3ff; }
.achievement-icon {
  width: 64px; height: 64px; border-radius: 22px; background: #ffffff;
  display: flex; align-items: center; justify-content: center; font-size: 2rem;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.6), 0 12px 30px rgba(15,23,42,.08);
}
.achievement-title { font-size: 1rem; font-weight: 600; color: #0f172a; }
.achievement-desc { color: #94a3b8; font-size: .9rem; }

/* 프로그레스바 */
.progress-wrapper { display: flex; align-items: center; gap: .75rem; }
.progress-track { flex: 1; height: 8px; border-radius: 999px; background: #e2e8f0; overflow: hidden; }
.progress-fill { height: 100%; border-radius: 999px; background: linear-gradient(90deg, #a855f7, #6366f1); }
.progress-value { font-size: .85rem; color: #94a3b8; }

/* 포인트 리스트 */
.point-list { display: flex; flex-direction: column; gap: .75rem; }
.point-item { display: flex; align-items: center; justify-content: space-between; border-radius: 20px; border: 1px solid #f1f5f9; padding: .9rem 1.25rem; font-size: .95rem; color: #0f172a; }
.point-value { font-weight: 700; color: #7c3aed; }

/* 공통 그림자 */
.shadow-soft { box-shadow: 0 20px 50px rgba(15,23,42,.06); }
</style>
