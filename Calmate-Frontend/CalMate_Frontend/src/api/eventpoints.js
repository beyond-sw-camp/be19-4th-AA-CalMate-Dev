import api from '@/lib/api';

const BASE_PATH = '/api/points';

export async function fetchPointSummary(memberId) {
  if (!memberId) {
    throw new Error('memberId is required to fetch point summary');
  }

  const { data } = await api.get(`${BASE_PATH}/member/${memberId}/summary`);
  return data ?? null;
}

export async function fetchPointHistory(memberId, limit = 20) {
  if (!memberId) {
    throw new Error('memberId is required to fetch point history');
  }

  const params = { limit: Math.min(Math.max(limit, 1), 100) };
  const { data } = await api.get(`${BASE_PATH}/member/${memberId}/history`, { params });
  return Array.isArray(data) ? data : [];
}
