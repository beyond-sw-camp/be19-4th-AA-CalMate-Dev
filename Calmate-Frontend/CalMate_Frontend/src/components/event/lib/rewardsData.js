export const RARITY_WEIGHTS = {
  common: 65,
  rare: 25,
  epic: 8,
  legendary: 2,
};

export const REWARD_POOL = [
  {
    id: 'common-coupon',
    name: '꽝',
    description: '다음 기회에',
    type: 'coupon',
    rarity: 'common',
    weight: 70,
  },
  {
    id: 'rare-coupon',
    name: '100포인트',
    description: '축하해욤',
    type: 'coupon',
    rarity: 'rare',
    weight: 35,
  },
  {
    id: 'epic-coupon',
    name: '춥파춥스',
    description: '사탕 하나 드립니다',
    type: 'coupon',
    rarity: 'epic',
    weight: 6,
  },
  {
    id: 'legendary-coupon',
    name: '츄잉껌',
    description: '쫙쫙',
    type: 'title',
    rarity: 'legendary',
    weight: 2,
  },
];

const getWeight = (reward) => reward.weight ?? RARITY_WEIGHTS[reward.rarity] ?? 1;

const createRewardId = (reward) => {
  const base = reward.id || reward.name || 'reward';
  const randomSuffix = Math.random().toString(16).slice(2, 8);
  return `${base}-${Date.now().toString(36)}-${randomSuffix}`;
};

export function drawReward(randomFn = Math.random) {
  if (typeof randomFn !== 'function') {
    throw new Error('randomFn must be a function');
  }

  const weightedPool = REWARD_POOL.map((reward) => ({
    reward,
    weight: getWeight(reward),
  })).filter((item) => item.weight > 0);

  const totalWeight = weightedPool.reduce((sum, item) => sum + item.weight, 0);
  if (!totalWeight) {
    throw new Error('Reward pool is empty');
  }

  let target = randomFn() * totalWeight;
  let selected = weightedPool[0].reward;

  for (const item of weightedPool) {
    target -= item.weight;
    if (target <= 0) {
      selected = item.reward;
      break;
    }
  }

  return {
    ...selected,
    id: createRewardId(selected),
    wonAt: new Date().toISOString(),
  };
}

export function getRewardsByRarity(rarity) {
  const key = String(rarity || '').toLowerCase();
  return REWARD_POOL.filter((reward) => reward.rarity === key);
}
