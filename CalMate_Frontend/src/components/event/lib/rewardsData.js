export const RARITY_WEIGHTS = {
  common: 65,
  rare: 25,
  epic: 8,
  legendary: 2,
};

export const REWARD_POOL = [
  {
    id: 'energy-bar-pack',
    name: '단백질 바 세트',
    description: '운동 후 간편하게 먹을 수 있는 단백질 바 3개입',
    type: 'coupon',
    rarity: 'common',
    weight: 70,
  },
  {
    id: 'coffee-voucher',
    name: '헬시 카페 기프티콘',
    description: '칼로리 걱정 없는 프로틴 라떼 한 잔',
    type: 'coupon',
    rarity: 'common',
    weight: 60,
  },
  {
    id: 'emoji-pack',
    name: '챌린지 이모지 팩',
    description: '채팅에서 사용할 수 있는 귀여운 운동 이모지',
    type: 'avatar',
    rarity: 'common',
    weight: 50,
  },
  {
    id: 'yoga-pass',
    name: '요가 클래스 체험권',
    description: '프리미엄 요가 스튜디오 1회 체험권',
    type: 'coupon',
    rarity: 'rare',
    weight: 35,
  },
  {
    id: 'meal-kit',
    name: '저칼로리 밀키트',
    description: '균형 잡힌 영양을 담은 1일 밀키트 구성',
    type: 'coupon',
    rarity: 'rare',
    weight: 30,
  },
  {
    id: 'trainer-call',
    name: '트레이너 1:1 Q&A',
    description: '전문 코치와 20분 영상 상담',
    type: 'title',
    rarity: 'rare',
    weight: 20,
  },
  {
    id: 'avatar-premium',
    name: '프리미엄 아바타 세트',
    description: '프로필을 꾸밀 수 있는 한정판 아바타',
    type: 'avatar',
    rarity: 'epic',
    weight: 8,
  },
  {
    id: 'wellness-retreat',
    name: '웰니스 데이 패스',
    description: '스파 + 필라테스 + 브런치까지 즐기는 하루',
    type: 'coupon',
    rarity: 'epic',
    weight: 6,
  },
  {
    id: 'legendary-title',
    name: '전설의 챌린저',
    description: '프로필에 표시되는 시즌 한정 칭호',
    type: 'title',
    rarity: 'legendary',
    weight: 2,
  },
  {
    id: 'gear-upgrade',
    name: '프리미엄 기어 세트',
    description: '폼롤러, 밴드, 미니볼이 포함된 홈트 키트',
    type: 'coupon',
    rarity: 'legendary',
    weight: 1,
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
