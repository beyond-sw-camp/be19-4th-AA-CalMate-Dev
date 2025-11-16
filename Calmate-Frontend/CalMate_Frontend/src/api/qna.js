// src/api/qna.js
import api from '@/lib/api'

// Backend base: /api/qna

// Create QnA: POST /api/qna { memberId, title, contents }
export const createQna = ({ memberId, title, contents }) =>
  api.post('/api/qna', { memberId, title, contents })

// List: GET /api/qna?limit=&offset=
export const getQnaList = ({ limit = 10, offset = 0 } = {}) =>
  api.get('/api/qna', { params: { limit, offset } })

// My list: GET /api/qna/my?memberId=&limit=&offset=
export const getMyQnaList = ({ memberId, limit = 10, offset = 0 }) =>
  api.get('/api/qna/my', { params: { memberId, limit, offset } })

// Detail: GET /api/qna/{id}
export const getQnaDetail = (id) => api.get(`/api/qna/${id}`)

// Update: PATCH /api/qna/{id} { title, contents }
export const updateQna = ({ id, title, contents }) =>
  api.patch(`/api/qna/${id}`, { title, contents })

// Delete: DELETE /api/qna/{id}
export const deleteQna = (id) => api.delete(`/api/qna/${id}`)

// Comments
// Create comment: POST /api/qna/{qnaId}/comments { memberId, comment, parentCommentId? }
export const createQnaComment = ({ qnaId, memberId, comment, parentCommentId }) =>
  api.post(`/api/qna/${qnaId}/comments`, { memberId, comment, parentCommentId })

// Update comment: PATCH /api/qna/comments/{commentId} { comment }
export const updateQnaComment = ({ commentId, comment }) =>
  api.patch(`/api/qna/comments/${commentId}`, { comment })

// Delete comment: DELETE /api/qna/comments/{commentId}
export const deleteQnaComment = (commentId) =>
  api.delete(`/api/qna/comments/${commentId}`)
