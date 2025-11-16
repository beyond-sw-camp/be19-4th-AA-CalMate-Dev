import api from '@/lib/api';

const BASE_PATH = '/api/bingo';

export async function fetchMonthlyBoardSummary(memberId, yearMonth) {
  if (!memberId) throw new Error('memberId is required');
  const params = yearMonth ? { month: yearMonth } : {};
  const response = await api.get(`${BASE_PATH}/${memberId}/boards`, { params });
  const payload = response?.data;
  return payload?.data ?? payload ?? null;
}

export async function fetchBingoBoard(boardId) {
  if (!boardId) throw new Error('boardId is required');
  const { data } = await api.get(`${BASE_PATH}/boards/${boardId}`);
  return data?.data ?? data ?? null;    // 상세 응답도 동일하게 감쌀 경우 대비
}

export async function checkBingoCell({ boardId, cellId, memberId, file, extendFilePathId }) {
  if (!boardId || !cellId || !memberId || !file) {
    throw new Error('boardId, cellId, memberId, file are required');
  }

  const formData = new FormData();
  formData.append('file', file);

  const params = { memberId };
  if (extendFilePathId) params.extendFilePathId = extendFilePathId;

  const { data } = await api.post(
    `${BASE_PATH}/boards/${boardId}/cells/${cellId}/check`,
    formData,
    {
      params,
      headers: { 'Content-Type': 'multipart/form-data' },
    },
  );
  return data;
}

export async function cancelBingoCellCheck({ boardId, cellId, memberId }) {
  if (!boardId || !cellId || !memberId) {
    throw new Error('boardId, cellId, memberId are required');
  }

  const params = { memberId };
  const { data } = await api.delete(
    `${BASE_PATH}/boards/${boardId}/cells/${cellId}/check`,
    { params },
  );
  return data;
}

export async function deleteBingoFile({ fileId, memberId }) {
  if (!fileId || !memberId) {
    throw new Error('fileId, memberId are required');
  }

  const params = { memberId };
  const { data } = await api.delete(`${BASE_PATH}/files/${fileId}`, { params });
  return data;
}
