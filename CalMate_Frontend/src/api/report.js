// api/report.js
import api from '@/lib/api'

export const REASON_TO_BASE_ID = {
  '욕설': 1, '도배': 2, '사기': 3, '음란물': 4, '허위사실': 5,
  '스팸': 6, '괴롭힘': 7, '명예훼손': 8, '불법 광고': 9, '기타': 10,
}

export function reasonToBaseId(reason) {
  return REASON_TO_BASE_ID[reason] ?? REASON_TO_BASE_ID['기타']
}

const n = v => (v === undefined || v === null || v === '' ? null : Number(v))

// ✅ 확정 스펙: /reports (FormData: request(JSON Blob) + files[])
export async function createReport(payload, files = []) {
  const p = {
    title: String(payload.title ?? ''),
    contents: String(payload.contents ?? ''),
    reportedMemberId: n(payload.reportedMemberId),
    reporterMemberId: n(payload.reporterMemberId),
    postId: n(payload.postId),
    commentId: n(payload.commentId),   // 댓글 신고 아니면 null 유지
    reportBaseId: n(payload.reportBaseId),
  }

  const fd = new FormData()
  fd.append('request', new Blob([JSON.stringify(p)], { type: 'application/json' }))
  ;(files || []).forEach(f => f && fd.append('files', f))

  // Axios가 FormData면 content-type 자동 설정됨(경계(boundary) 포함) → 헤더 수동 지정 불필요
  return api.post('/reports', fd)
}
