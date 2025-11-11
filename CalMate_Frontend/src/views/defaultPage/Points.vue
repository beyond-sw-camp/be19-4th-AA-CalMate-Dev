<template>
  <div class="points-layout">

    <main class="points-layout__content">
      <div class="points-page space-y-8">
        <section class="summary-card shadow-soft">
      <div class="summary-heading">
        <div>
          <p class="summary-eyebrow">포인트 & 보상</p>
          <h2 class="summary-title">목표를 달성하고 다양한 보상을 받으세요</h2>
          <p class="summary-subtitle">한 걸음씩 쌓이는 기록이 더 큰 보상으로 돌아옵니다.</p>
        </div>
        <div class="summary-chip">
          <span class="chip-dot" />
          꾸준한 기록으로 등급을 올려보세요
        </div>
      </div>

      <div class="stats-grid">
        <article
          v-for="stat in statCards"
          :key="stat.id"
          class="stat-card"
        >
          <div :class="['stat-icon', stat.tint]">
            <component :is="stat.icon" class="h-5 w-5" :class="stat.iconColor" />
          </div>
          <div>
            <p class="stat-label">{{ stat.label }}</p>
            <p class="stat-value">
              {{ stat.value }}
              <span v-if="stat.suffix" class="stat-suffix">{{ stat.suffix }}</span>
            </p>
            <p v-if="stat.helper" class="stat-helper">
              {{ stat.helper }}
            </p>
          </div>
        </article>
      </div>
    </section>

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
              :class="[
                'achievement-card',
                achievement.unlocked && 'achievement-card--active',
              ]"
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
                  <span class="progress-value">
                    {{ Math.round(achievement.progress) }}%
                  </span>
                </div>

                <p class="reward-text">
                  보상:
                  <span>{{ achievement.points.toLocaleString() }} 포인트</span>
                </p>
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
              <span class="point-value">+{{ source.points }} 포인트</span>
            </div>
          </div>
        </section>
      </TabsContent>

      <TabsContent value="bingo">
        <section class="panel-card shadow-soft">
          <BingoBoard />
        </section>
      </TabsContent>

      <TabsContent value="lucky-draw">
        <section class="panel-card shadow-soft">
          <LuckyDraw
            :available-points="1000"
            @points-used="handlePointsUsed"
          />
        </section>
      </TabsContent>
        </Tabs>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { Trophy, Flame, Award, Coins, Ticket } from 'lucide-vue-next';
import Header from '@/components/Header.vue';
import Badge from '@/components/event/ui/Badge.vue';
import Tabs from '@/components/event/ui/Tabs.vue';
import TabsList from '@/components/event/ui/TabsList.vue';
import TabsTrigger from '@/components/event/ui/TabsTrigger.vue';
import TabsContent from '@/components/event/ui/TabsContent.vue';
import BingoBoard from '@/components/event/bingo/Monthlybingochallenge.vue';
import LuckyDraw from '@/components/event/gacha/LuckyDraw.vue';
import {
  POINTS_RULES,
  LUCKY_DRAW_TICKET_COST,
  calculateTotalPoints,
  calculateStreak,
} from '@/components/event/lib/pointsSystem.js';

const props = defineProps({
  profile: {
    type: Object,
    required: true,
  },
});

const totalPoints = ref(0);
const usedPoints = ref(0);
const streak = ref(0);
const badges = ref([]);
const activeTab = ref('achievements');

const availablePoints = computed(() => Math.max(0, totalPoints.value - usedPoints.value));
const luckyTickets = computed(() => Math.max(0, Math.floor(availablePoints.value / LUCKY_DRAW_TICKET_COST)));

const statCards = computed(() => [
  {
    id: 'total',
    label: '총 포인트',
    value: formatNumber(totalPoints.value),
    helper: '누적 보상 포인트',
    icon: Trophy,
    iconColor: 'text-amber-500',
    tint: 'stat-icon--gold',
  },
  {
    id: 'available',
    label: '사용 가능 포인트',
    value: formatNumber(availablePoints.value),
    helper: '바로 사용할 수 있어요',
    icon: Coins,
    iconColor: 'text-emerald-500',
    tint: 'stat-icon--mint',
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
  },
  {
    id: 'badges',
    label: '획득 뱃지',
    value: formatNumber(badges.value.length),
    suffix: '개',
    helper: '업적 달성 현황',
    icon: Award,
    iconColor: 'text-purple-500',
    tint: 'stat-icon--lilac',
  },
]);

const pointSources = Object.freeze([
  { id: 'meal', label: '식단 기록 (하루당)', points: POINTS_RULES.MEAL_LOGGED },
  { id: 'workout', label: '운동 기록 (회당)', points: POINTS_RULES.WORKOUT_LOGGED },
  { id: 'journal', label: '일기 작성 (회당)', points: POINTS_RULES.JOURNAL_LOGGED },
  { id: 'streak7', label: '7일 연속 기록', points: POINTS_RULES.STREAK_7_DAYS },
  { id: 'streak30', label: '30일 연속 기록', points: POINTS_RULES.STREAK_30_DAYS },
  { id: 'calorie', label: '목표 칼로리 달성 (±10%)', points: POINTS_RULES.CALORIE_TARGET_MET },
  { id: 'workoutGoal', label: '주 3회 운동 달성', points: POINTS_RULES.WORKOUT_WEEKLY_GOAL },
  { id: 'bingoLine', label: '빙고 라인 완성 (라인당)', points: POINTS_RULES.BINGO_LINE },
  { id: 'bingoComplete', label: '빙고 완성', points: POINTS_RULES.BINGO_COMPLETE },
  { id: 'beforeAfter', label: 'Before&After 월간 1위', points: POINTS_RULES.BEFORE_AFTER_MONTHLY_TOP },
]);

const achievements = computed(() => [
  {
    id: '1',
    name: '7일 연속 기록',
    description: '7일 동안 연속으로 활동을 기록하세요',
    icon: '🔥',
    unlocked: streak.value >= 7,
    progress: Math.min((streak.value / 7) * 100, 100),
    points: 100,
  },
  {
    id: '2',
    name: '30일 연속 기록',
    description: '30일 동안 연속으로 활동을 기록하세요',
    icon: '⭐',
    unlocked: streak.value >= 30,
    progress: Math.min((streak.value / 30) * 100, 100),
    points: 500,
  },
  {
    id: '3',
    name: '100 포인트 달성',
    description: '총 100 포인트를 획득하세요',
    icon: '🏆',
    unlocked: totalPoints.value >= 100,
    progress: Math.min((totalPoints.value / 100) * 100, 100),
    points: 100,
  },
  {
    id: '4',
    name: '500 포인트 달성',
    description: '총 500 포인트를 획득하세요',
    icon: '💎',
    unlocked: totalPoints.value >= 500,
    progress: Math.min((totalPoints.value / 500) * 100, 100),
    points: 500,
  },
  {
    id: '5',
    name: '1000 포인트 달성',
    description: '총 1000 포인트를 획득하세요',
    icon: '👑',
    unlocked: totalPoints.value >= 1000,
    progress: Math.min((totalPoints.value / 1000) * 100, 100),
    points: 1000,
  },
]);

const unlockedAchievements = computed(() =>
  achievements.value.filter((achievement) => achievement.unlocked).length,
);

onMounted(loadPointsData);

watch(
  () => props.profile,
  () => {
    loadPointsData();
  },
  { deep: true },
);

function loadPointsData() {
  const { points } = calculateTotalPoints(props.profile);
  const currentStreak = calculateStreak();
  const storedUsedPoints = localStorage.getItem('usedPoints');
  usedPoints.value = storedUsedPoints ? parseInt(storedUsedPoints, 10) : 0;
  totalPoints.value = points;
  streak.value = currentStreak;

  const badgeList = [];
  if (currentStreak >= 7) badgeList.push('7일 연속 기록');
  if (currentStreak >= 30) badgeList.push('30일 연속 기록');
  if (points >= 100) badgeList.push('100 포인트 달성');
  if (points >= 500) badgeList.push('500 포인트 달성');
  if (points >= 1000) badgeList.push('1000 포인트 달성');
  badges.value = badgeList;

  localStorage.setItem(
    'userPoints',
    JSON.stringify({
      total: points,
      streak: currentStreak,
      badges: badgeList,
      usedPoints: usedPoints.value,
    }),
  );
}

function handlePointsUsed(pointsToUse) {
  usedPoints.value += pointsToUse;
  localStorage.setItem('usedPoints', usedPoints.value.toString());
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString();
}
</script>

<style scoped>
.points-layout {
  display: flex;
  min-height: 100vh;
  background: #f8f9ff;
}

.points-layout__sidebar {
  flex-shrink: 0;
}

.points-layout__sidebar :deep(.sidebar) {
  position: sticky;
  top: 0;
  height: 100vh;
}

.points-layout__content {
  flex: 1;
  padding: 2rem;
  background: #f5f6fb;
  min-height: 100vh;
  overflow-y: auto;
}

@media (max-width: 1024px) {
  .points-layout {
    flex-direction: column;
  }

  .points-layout__sidebar :deep(.sidebar) {
    position: relative;
    height: auto;
    width: 100%;
  }
}

.points-page {
  padding-bottom: 2rem;
}

.summary-card {
  border-radius: 32px;
  border: 1px solid #edf0f7;
  background: linear-gradient(180deg, #ffffff 0%, #f9fbff 100%);
  padding: 2rem;
}

@media (min-width: 768px) {
  .summary-card {
    padding: 2.5rem;
  }
}

.summary-heading {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (min-width: 768px) {
  .summary-heading {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.summary-eyebrow {
  color: #a78bfa;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  font-size: 0.8rem;
}

.summary-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #0f172a;
}

.summary-subtitle {
  color: #64748b;
  margin-top: 0.5rem;
}

.summary-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: 999px;
  padding: 0.5rem 1.25rem;
  background: #fff;
  border: 1px solid #e2e8f0;
  color: #475569;
  font-size: 0.9rem;
}

.chip-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #34d399;
  display: inline-block;
}

.stats-grid {
  margin-top: 1.5rem;
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
}

.stat-card {
  display: flex;
  gap: 1rem;
  padding: 1.25rem;
  border-radius: 24px;
  border: 1px solid #f1f5f9;
  background: #ffffff;
  min-height: 120px;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon--gold {
  background: #fff7e1;
}

.stat-icon--mint {
  background: #e8fff4;
}

.stat-icon--sun {
  background: #ffe9d6;
}

.stat-icon--lilac {
  background: #f5ecff;
}

.stat-icon--sky {
  background: #e4f3ff;
}

.stat-label {
  color: #94a3b8;
  font-size: 0.85rem;
}

.stat-value {
  font-size: 1.6rem;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.2;
}

.stat-suffix {
  margin-left: 0.25rem;
  font-size: 1rem;
  color: #64748b;
}

.stat-helper {
  color: #94a3b8;
  font-size: 0.85rem;
}

.points-tabs {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75rem;
  padding: 0.5rem;
  border-radius: 999px;
  background: #f1f5f9;
  height: auto !important;
}

.points-tab {
  border-radius: 999px !important;
  font-weight: 600 !important;
  font-size: 0.95rem !important;
  padding: 0.65rem 0 !important;
  height: 100% !important;
  background: transparent;
  box-shadow: none;
}

.points-tab--active {
  background: #ffffff !important;
  color: #0f172a !important;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08) !important;
}

.panel-card {
  border-radius: 28px;
  border: 1px solid #edf0f7;
  background: #ffffff;
  padding: 2rem;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.panel-eyebrow {
  color: #94a3b8;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.panel-badge {
  border-radius: 999px;
}

.achievement-card {
  display: flex;
  gap: 1.25rem;
  padding: 1.25rem 1.5rem;
  border-radius: 24px;
  border: 1px solid #f1f5f9;
  background: #fcfcff;
}

.achievement-card--active {
  border-color: #c4b5fd;
  background: #f5f3ff;
}

.achievement-icon {
  width: 64px;
  height: 64px;
  border-radius: 22px;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.6), 0 12px 30px rgba(15, 23, 42, 0.08);
}

.achievement-title {
  font-size: 1rem;
  font-weight: 600;
  color: #0f172a;
}

.achievement-desc {
  color: #94a3b8;
  font-size: 0.9rem;
}

.progress-wrapper {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.progress-track {
  flex: 1;
  height: 8px;
  border-radius: 999px;
  background: #e2e8f0;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #a855f7, #6366f1);
}

.progress-value {
  font-size: 0.85rem;
  color: #94a3b8;
}

.reward-text {
  font-size: 0.9rem;
  color: #475569;
}

.reward-text span {
  color: #7c3aed;
  font-weight: 600;
}

.point-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.point-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 20px;
  border: 1px solid #f1f5f9;
  padding: 0.9rem 1.25rem;
  font-size: 0.95rem;
  color: #0f172a;
}

.point-value {
  font-weight: 600;
  color: #7c3aed;
}

.shadow-soft {
  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.06);
}
</style>
