import api from "@/lib/api";   // ✅ 전역 Axios 인스턴스 가져오기

// 게시글 목록 조회, 상세 조회
export const fetchPostList = () => api.get("/community/posts");
export const fetchPostDetail = (id) => api.get(`/community/post/${id}`);

// 댓글, 대댓글 조회 및 작성
export const fetchComments = (postId) => api.get(`/community/post/${postId}/comments`);
export const addComment = (postId, data) => api.post(`/community/post/${postId}/comments`, data);

// 댓글 수정
export const updateComment = (postId, commentId, content, memberId) => {
  return api.patch(
    `/community/post/${postId}/comments/${commentId}?memberId=${memberId}`,
    { content }
  )
}
// 댓글 삭제
export const deleteComment = (postId, commentId, memberId) => {
  return api.delete(
    `/community/post/${postId}/comments/${commentId}?memberId=${memberId}`
  )
}
// 댓글 좋아요 토글
export const toggleCommentLike = (commentId, memberId) => {
  return api.post(`/community/comment/${commentId}/like`, null, {
    params: { memberId }
  });
};

// 게시글 좋아요 토글
export const togglePostLike = (postId, memberId) => {
  return api.post(`/community/post/${postId}/like`, null, {
    params: { memberId }
  });
};

// 커뮤니티 좋아요 랭킹 조회
export const fetchCommunityRanking = () => {
  return api.get("/community/ranking");
};