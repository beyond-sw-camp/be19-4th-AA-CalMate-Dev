const DEFAULT_POINTS_RULES = {
  MEAL_LOGGED: 8,
  WORKOUT_LOGGED: 25,
  JOURNAL_LOGGED: 5,
  STREAK_7_DAYS: 75,
  STREAK_30_DAYS: 300,
  CALORIE_TARGET_MET: 20,
  WORKOUT_WEEKLY_GOAL: 120,
  BINGO_LINE: 50,
  BINGO_COMPLETE: 500,
  BEFORE_AFTER_MONTHLY_TOP: 500,
};

export const POINTS_RULES = Object.freeze(DEFAULT_POINTS_RULES);
export const LUCKY_DRAW_TICKET_COST = 100;

const dateKey = (value) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 10);
};

const toPositiveInt = (value) => {
  if (Array.isArray(value)) return value.length;
  const num = Number(value);
  if (!Number.isFinite(num)) return 0;
  return Math.max(0, Math.floor(num));
};

const resolveCount = (value) => {
  if (Array.isArray(value)) return value.length;
  if (typeof value === 'number' || typeof value === 'string') {
    return toPositiveInt(value);
  }
  if (value && typeof value === 'object') {
    if ('count' in value) return resolveCount(value.count);
    if ('total' in value) return resolveCount(value.total);
    if (Array.isArray(value.items)) return value.items.length;
  }
  return 0;
};

const readStoredActivityHistory = () => {
  if (typeof window === 'undefined' || !window.localStorage) return [];
  try {
    const stored = window.localStorage.getItem('activityHistory');
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const readStoredStreak = () => {
  if (typeof window === 'undefined' || !window.localStorage) return null;
  try {
    const stored = window.localStorage.getItem('userPoints');
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    return typeof parsed?.streak === 'number' ? parsed.streak : null;
  } catch {
    return null;
  }
};

const normalizeActivityHistory = (activityHistory) => {
  if (!Array.isArray(activityHistory)) return [];
  return activityHistory
    .map((entry) => {
      if (!entry) return null;
      if (typeof entry === 'string' || typeof entry === 'number' || entry instanceof Date) {
        return dateKey(entry);
      }
      if (typeof entry === 'object' && 'date' in entry) {
        return dateKey(entry.date);
      }
      return null;
    })
    .filter(Boolean);
};

export function calculateStreak(activityHistory = null, referenceDate = new Date()) {
  const history =
    normalizeActivityHistory(activityHistory ?? readStoredActivityHistory()) ?? [];

  if (!history.length) {
    return readStoredStreak() ?? 0;
  }

  const completedDays = new Set(history);
  const cursor = new Date(referenceDate);
  cursor.setHours(0, 0, 0, 0);

  let streak = 0;
  while (streak <= 366) {
    const key = dateKey(cursor);
    if (!completedDays.has(key)) break;
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak || readStoredStreak() || 0;
}

export function calculateTotalPoints(profile = {}) {
  const activityHistory = profile.activityHistory ?? null;
  const streak =
    typeof profile.streak === 'number' ? profile.streak : calculateStreak(activityHistory);

  const stats = {
    meals: resolveCount(profile.meals ?? profile.mealLogs ?? profile.mealEntries),
    workouts: resolveCount(
      profile.workouts ?? profile.workoutSessions ?? profile.activities?.workouts,
    ),
    journals: resolveCount(profile.journals ?? profile.journalEntries ?? profile.diaries),
    calorieDays: resolveCount(
      profile.calorieTargetDays ?? profile.calorieComplianceDays ?? profile.calorieDays,
    ),
    workoutGoalWeeks: resolveCount(
      profile.workoutGoalWeeks ?? profile.completedWorkoutWeeks ?? profile.weeklyWorkoutGoal,
    ),
    bingoLines: resolveCount(profile.bingo?.completedLines ?? profile.bingoLines ?? 0),
    bingoComplete: Boolean(profile.bingo?.completed ?? profile.bingoComplete),
    beforeAfterWins: resolveCount(
      profile.beforeAfterWins ?? profile.beforeAfterAwards ?? profile.challengeWins,
    ),
    basePoints: Number(profile.points ?? profile.basePoints ?? profile.totalPoints ?? 0),
    manualPoints: Number(profile.manualPoints ?? profile.extraPoints ?? 0),
  };

  const breakdown = {
    base: Math.max(0, stats.basePoints),
    meals: stats.meals * POINTS_RULES.MEAL_LOGGED,
    workouts: stats.workouts * POINTS_RULES.WORKOUT_LOGGED,
    journals: stats.journals * POINTS_RULES.JOURNAL_LOGGED,
    calorie: stats.calorieDays * POINTS_RULES.CALORIE_TARGET_MET,
    workoutGoal: stats.workoutGoalWeeks * POINTS_RULES.WORKOUT_WEEKLY_GOAL,
    bingoLines: stats.bingoLines * POINTS_RULES.BINGO_LINE,
    bingoComplete: stats.bingoComplete ? POINTS_RULES.BINGO_COMPLETE : 0,
    streakBonus: 0,
    beforeAfter: stats.beforeAfterWins * POINTS_RULES.BEFORE_AFTER_MONTHLY_TOP,
    manual: Math.max(0, stats.manualPoints),
  };

  if (streak >= 7) breakdown.streakBonus += POINTS_RULES.STREAK_7_DAYS;
  if (streak >= 30) breakdown.streakBonus += POINTS_RULES.STREAK_30_DAYS;

  const points = Object.values(breakdown).reduce((sum, value) => sum + value, 0);

  return {
    points,
    breakdown,
    streak,
  };
}
