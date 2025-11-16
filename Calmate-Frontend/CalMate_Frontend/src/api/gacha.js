import api from '@/lib/api';

const BASE_PATH = '/api/gacha';

export async function fetchActiveGachaEvent() {
  const { data } = await api.get(`${BASE_PATH}/event/active`);
  return data;
}

export async function fetchGachaEventById(eventId) {
  if (!eventId) throw new Error('eventId is required');
  const { data } = await api.get(`${BASE_PATH}/event/${eventId}`);
  return data;
}

export async function fetchEventPrizes(eventId) {
  if (!eventId) throw new Error('eventId is required');
  const { data } = await api.get(`${BASE_PATH}/event/${eventId}/prizes`);
  return data;
}

export async function fetchMemberBoardCells(memberId, eventId) {
  if (!memberId || !eventId) throw new Error('memberId and eventId are required');
  const { data } = await api.get(
    `${BASE_PATH}/member/${memberId}/event/${eventId}/board`,
  );
  return data;
}

export async function openBoardCell(cellId, memberId, prizeId) {
  if (!cellId || !prizeId || !memberId) {
    throw new Error('cellId, memberId and prizeId are required');
  }
  const { data } = await api.put(`${BASE_PATH}/cells/${cellId}/open`, null, {
    params: { prizeId, memberId },
  });
  return data;
}

export async function recordGachaDrawLog(memberId, boardCellId, prizeId) {
  if (!memberId || !boardCellId || !prizeId) {
    throw new Error('memberId, boardCellId and prizeId are required');
  }
  const { data } = await api.post(`${BASE_PATH}/draw-logs`, null, {
    params: { memberId, boardCellId, prizeId },
  });
  return data;
}

export async function fetchMemberDrawHistory(memberId, eventId, page = 1, size = 10) {
  if (!memberId) throw new Error('memberId is required');
  const params = { page, size };
  if (eventId) {
    params.eventId = eventId;
  }
  const { data } = await api.get(`${BASE_PATH}/member/${memberId}/draw-history`, { params });
  return data;
}

export async function drawGacha(eventId, memberId, cellId) {
  if (!eventId || !memberId || !cellId) {
    throw new Error('eventId, memberId and cellId are required');
  }
  const { data } = await api.post(`${BASE_PATH}/event/${eventId}/draw`, null, {
    params: { memberId, cellId },
  });
  return data;
}
