import api from '@/lib/api';

const BASE_PATH = '/api/calendar';

export async function fetchBadgeCountRange({ memberId, startDate, endDate }) {
  if (!startDate || !endDate) {
    throw new Error('startDate와 endDate는 필수입니다.');
  }

  const params = { startDate, endDate };
  if (memberId) params.memberId = memberId;

  const { data } = await api.get(`${BASE_PATH}/badge-count`, { params });
  return data ?? null;
}
