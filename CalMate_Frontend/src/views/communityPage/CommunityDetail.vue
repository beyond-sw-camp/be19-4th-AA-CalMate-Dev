<template>
  <div class="detail-wrap">
    <!-- 뒤로가기 -->
    <button class="back-btn" @click="router.back()">← 돌아가기</button>

    <!-- 카드 -->
    <div class="detail-card">
      <!-- 작성자 + 작성일 -->
      <div class="post-header">
        <div class="author">{{ post.authorName }}</div>
        <div class="time">{{ post.createdAt }}</div>
      </div>

      <!-- ✅ 제목 + 수정/삭제 같은 줄 -->
      <div class="title-action-row">
        <!-- 제목 -->
        <template v-if="!isEditing">
          <h2 class="title">{{ post.title }}</h2>
        </template>
        <template v-else>
          <input v-model="form.title" class="edit-title" placeholder="제목을 입력하세요" />
        </template>

        <!-- 수정 / 삭제 / 저장 / 취소 -->
        <div class="post-action">
          <!-- ✅ 작성자 본인일 때만 버튼 노출 -->
          <template v-if="!isEditing && post.memberId === userStore.userId">
            <button class="edit-btn" @click="startEdit">수정</button>
            <button class="delete-btn" @click="deletePost">삭제</button>
          </template>

          <!-- 타인 게시물일 경우 신고 버튼 -->
          <template v-else-if="!isEditing && post.memberId !== userStore.userId">
            <button class="report-btn" @click="openReportModal">🚨 신고</button>
          </template>
          
          <!-- 수정 모드 -->
          <template v-else-if="isEditing">
            <button class="save-btn" @click="saveEdit" :disabled="saving">
              {{ saving ? '저장 중...' : '저장' }}
            </button>
            <button class="cancel-btn-ghost" @click="cancelEdit" :disabled="saving">취소</button>
          </template>
        </div>
      </div>

      <!-- ✅ 카테고리 수정 -->
      <div v-if="isEditing" class="form-group">
        <label>카테고리</label>
        <select v-model="form.tagId">
          <option value="1">운동</option>
          <option value="2">식단</option>
          <option value="3">Before&After</option>
          <option value="4">자유게시판</option>
        </select>
      </div>

      <!-- 내용 -->
      <template v-if="!isEditing">
        <p class="content">{{ post.content }}</p>
      </template>
      <template v-else>
        <textarea v-model="form.content" class="edit-content" placeholder="내용을 입력하세요"></textarea>
      </template>

      <!-- ✅ 상세조회 이미지 -->
      <div v-if="!isEditing && post.images?.length" class="post-images">
        <img
          v-for="(img, i) in post.images"
          :key="i"
          :src="`${api.defaults.baseURL}${img}`"
          class="detail-img"
        />
      </div>

      <!-- ✅ 수정 모드 이미지 미리보기 -->
      <div v-if="isEditing" class="image-edit-block">
        <label class="label">기존 이미지</label>

        <div class="edit-image-list" v-if="existingImages.length">
          <div class="edit-image-item" v-for="(img, i) in existingImages" :key="i">
            <img :src="`${api.defaults.baseURL}${img}`" class="preview-img" />
            <button class="delete-img-btn" @click="removeExistingImage(i)">삭제</button>
          </div>
        </div>

        <label class="label">새 이미지 추가</label>
        <input type="file" multiple @change="handleFiles" />

        <div v-if="previews.length" class="edit-image-list">
          <img v-for="(img, i) in previews" :key="i" :src="img" class="preview-img" />
        </div>
      </div>

      <!-- 좋아요/댓글 -->
      <div class="post-footer">
        <button class="like-btn" @click="toggleLikePost">
          <span :class="{ active: liked }">❤️</span> {{ likeCount }}
        </button>
        <div>💬 {{ post.comments }}</div>
      </div>
    </div>

    <!-- 댓글 -->
    <div class="comment-section">
      <h3>댓글</h3>

      <div class="comment-write">
        <input
          v-model="newComment"
          placeholder="댓글을 입력하세요..."
          @keyup.enter="submitComment"
        />
        <button @click="submitComment">등록</button>
      </div>

      <div class="comment-list">
        <CommentItem
          v-for="c in comments"
          :key="c.id"
          :comment="c"
          :post-id="route.params.postId"
          @submitted="loadComments"
        />
      </div>
    </div>

    <!-- ✅ 신고 모달 -->
    <div v-if="showReportModal" class="modal-overlay">
      <div class="modal-box">
        <h3>🚨 게시글 신고하기</h3>
        <p class="modal-subtext">신고 정보를 입력해주세요.</p>

        <div class="modal-form">
          <label>신고 제목</label>
          <input
            type="text"
            v-model="reportForm.title"
            placeholder="신고 제목을 입력하세요"
          />

          <label>신고 사유</label>
          <select v-model="reportForm.reason">
            <option value="" disabled>신고 사유를 선택하세요</option>
            <option v-for="reason in reportReasons" :key="reason" :value="reason">
              {{ reason }}
            </option>
          </select>

          <label>신고 내용</label>
          <textarea
            v-model="reportForm.content"
            placeholder="신고 내용을 입력하세요..."
          ></textarea>

          <label>이미지 첨부 (선택, 여러 장 가능)</label>
          <input type="file" multiple @change="handleFiles" />

          <div v-if="previewImages.length" class="preview-list">
            <img v-for="(img, i) in previewImages" :key="i" :src="img" class="preview-img" />
          </div>
        </div>

        <div class="modal-actions">
          <button class="modal-btn" @click="submitReport">제출</button>
          <button class="cancel-btn" @click="closeReportModal">취소</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "@/lib/api";
import CommentItem from "@/components/CommentItem.vue";
import { useUserStore } from "@/stores/user";
import { togglePostLike } from "@/api/post";

/* ---------- 상수/유틸 ---------- */
const REASON_TO_BASE_ID = {
  "욕설": 1, "도배": 2, "사기": 3, "음란물": 4, "허위사실": 5,
  "스팸": 6, "괴롭힘": 7, "명예훼손": 8, "불법 광고": 9, "기타": 10,
};
const numOrNull = v => (v === undefined || v === null || v === "" ? null : Number(v));

/* ---------- 공통 ---------- */
const userStore = useUserStore();
const route = useRoute();
const router = useRouter();

/* ---------- 게시글/수정 상태 ---------- */
const post = ref({});
const form = ref({ title: "", content: "", tagId: null });

const isEditing = ref(false);
const saving = ref(false);

const existingImages = ref([]);
const removedImages = ref([]);
const newImages = ref([]);
const previews = ref([]);

/* ---------- 좋아요/댓글 ---------- */
const likeCount = ref(0);
const liked = ref(false);

const comments = ref([]);
const newComment = ref("");

/* ---------- 신고 ---------- */
const showReportModal = ref(false);
const reportReasons = [
  "욕설","도배","사기","음란물","허위사실","스팸","괴롭힘","기타","명예훼손","불법 광고",
];
const reportForm = ref({
  title: "",
  reason: "",
  content: "",
  postId: null,
  commentId: null,
});
const reportFiles = ref([]);
const previewImages = ref([]);

/* ✅ 피신고자(작성자) ID */
const offenderId = ref(null);

/* ---------- 파일 핸들러 ---------- */
const handleFiles = (e) => {
  newImages.value = Array.from(e.target.files || []);
  previews.value = newImages.value.map(f => URL.createObjectURL(f));
};
const onReportFiles = (e) => {
  const files = Array.from(e.target.files || []);
  reportFiles.value = files;
  previewImages.value = files.map(f => URL.createObjectURL(f));
};
const removeExistingImage = (idx) => {
  removedImages.value.push(existingImages.value[idx]);
  existingImages.value.splice(idx, 1);
};

/* ---------- 보조: 작성자 ID 해소기 ---------- */
// 1) 상세 응답의 다양한 키에서 시도
function pickAuthorId(obj) {
  return Number(
    obj?.memberId ??
    obj?.authorId ??
    obj?.author?.id ??
    obj?.writerId ??
    obj?.userId
  ) || null;
}
// 2) 없으면 서버로부터 별도 조회 (엔드포인트는 필요 시 바꿔 끼우세요)
async function fetchAuthorIdFallback(postId) {
  try {
    // 예: { memberId: 123 }
    const { data } = await api.get(`/community/post/${postId}/author-id`);
    return Number(data?.memberId) || null;
  } catch {
    return null;
  }
}

/* ---------- 신고 열기/닫기 ---------- */
const openReportModal = async () => {
  if (!userStore.isLoggedIn) {
    alert("로그인이 필요합니다 😊");
    return router.push("/sign/signIn");
  }

  // 작성자 ID가 없으면 보조 조회 한 번 더 시도
  if (!offenderId.value) {
    offenderId.value = await fetchAuthorIdFallback(route.params.postId);
  }
  if (!offenderId.value) {
    return alert("작성자 ID를 불러오지 못했습니다. 새로고침 후 다시 시도해주세요.");
  }

  showReportModal.value = true;
  reportForm.value.postId = post.value.id;
  reportForm.value.commentId = null;
};

const closeReportModal = () => {
  showReportModal.value = false;
  reportForm.value = {
    title: "",
    reason: "",
    content: "",
    postId: post.value.id,
    commentId: null,
  };
  reportFiles.value = [];
  previewImages.value = [];
};

/* ---------- 신고 제출 (/reports: request + files[]) ---------- */
const submitReport = async () => {
  try {
    if (!userStore.isLoggedIn) {
      alert("로그인이 필요합니다 😊");
      return router.push("/sign/signIn");
    }
    if (!reportForm.value.reason) {
      return alert("신고 사유를 선택해주세요.");
    }

    // 마지막 방어
    if (!offenderId.value) {
      offenderId.value = await fetchAuthorIdFallback(route.params.postId);
    }
    if (!offenderId.value) {
      return alert("작성자 ID를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.");
    }

    const payload = {
      title: String(reportForm.value.title ?? ""),
      contents: String(reportForm.value.content ?? ""),
      reportedMemberId: numOrNull(offenderId.value),         // member_id2
      reporterMemberId: numOrNull(userStore.userId),         // member_id
      postId: numOrNull(reportForm.value.postId),
      commentId:
        reportForm.value.commentId === null
          ? null
          : numOrNull(reportForm.value.commentId),
      reportBaseId:
        REASON_TO_BASE_ID[reportForm.value.reason] ?? REASON_TO_BASE_ID["기타"],
    };

    const fd = new FormData();
    fd.append("request", new Blob([JSON.stringify(payload)], { type: "application/json" }));
    (reportFiles.value || []).forEach(f => f && fd.append("files", f));

    await api.post("/reports", fd);
    alert("신고가 접수되었습니다.");
    closeReportModal();
  } catch (err) {
    console.error("[REPORT ERROR]", err);
    const detail = err?.response?.data || err?.message || err;
    alert(`신고 중 오류가 발생했습니다.\n${
      typeof detail === "string" ? detail : JSON.stringify(detail)
    }`);
  }
};

/* ---------- 데이터 로드 ---------- */
const loadPost = async () => {
  const { data } = await api.get(`/community/post/${route.params.postId}`, {
    params: { memberId: userStore.userId || 0 },
  });

  post.value = data;
  offenderId.value = pickAuthorId(data); // 1차 시도

  form.value = {
    title: data.title,
    content: data.content,
    tagId: data.tagId != null ? String(data.tagId) : "",
  };
  existingImages.value = data.images ?? [];
  likeCount.value = data.likes ?? 0;
  liked.value = data.liked ?? false;
};

const loadComments = async () => {
  const { data } = await api.get(
    `/community/post/${route.params.postId}/comments`,
    { params: { memberId: userStore.userId || 0 } }
  );
    // 🔥신고 댓글/대댓글 각각 개별적으로 visibility 검사 (부모 영향 X)
  const applyDeletedLabel = (list) => {
    return list.map(c => {
      let newContent;

      if (c.visibility === 1) {
        if (c.parentId == null) {
          // 부모 댓글
          newContent = "삭제된 댓글입니다.";
        } else {
          // 대댓글
          newContent = "삭제된 댓글입니다.";
        }
      } else {
        // visibility = 0 → 원래 내용 유지
        newContent = c.content;
      }

      return {
        ...c,
        content: newContent,
        replies: c.replies ? applyDeletedLabel(c.replies) : []
      };
    });
  };

  comments.value = applyDeletedLabel(data);
};  
  // comments.value = data;


/* ---------- 수정/삭제 ---------- */
const startEdit = () => {
  if (post.value.memberId !== userStore.userId) return;
  isEditing.value = true;
};
const cancelEdit = () => {
  previews.value = [];
  newImages.value = [];
  isEditing.value = false;
};

const deletePost = async () => {
  if (post.value.memberId !== userStore.userId) return
  if (!confirm("정말 삭제하시겠습니까?")) return
  await api.delete(`/community/post/${route.params.postId}`)
  router.push("/community")
}

const saveEdit = async () => {
  try {
    saving.value = true;

    const fd = new FormData();
    fd.append("title", form.value.title);
    fd.append("content", form.value.content);
    fd.append("tagId", form.value.tagId);

    removedImages.value.forEach(u => fd.append("deleteImages", u));
    newImages.value.forEach(f => fd.append("images", f));

    await api.patch(`/community/post/${route.params.postId}`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    await loadPost();
    previews.value = [];
    newImages.value = [];
    removedImages.value = [];
    isEditing.value = false;
  } finally {
    saving.value = false;
  }
};

/* ---------- 좋아요/댓글 액션 ---------- */
import { useCommunityStore } from '@/stores/community'

const communityStore = useCommunityStore()

const toggleLikePost = async () => {
  if (!userStore.isLoggedIn) {
    alert("로그인이 필요합니다 😊");
    return router.push("/sign/signIn");
  }
  await togglePostLike(route.params.postId, userStore.userId);
  liked.value = !liked.value;
  likeCount.value += liked.value ? 1 : -1;

    // ✅ 랭킹 자동 갱신 신호 보내기
  communityStore.triggerRefresh()

};
const submitComment = async () => {
  if (!userStore.isLoggedIn) {
    alert("로그인이 필요합니다 😊");
    return router.push("/sign/signIn");
  }
  if (!newComment.value.trim()) return;

  await api.post(`/community/post/${route.params.postId}/comments`, {
    memberId: userStore.userId,
    content: newComment.value,
  });
  newComment.value = "";
  loadComments();
};

/* ---------- 초기 로드 ---------- */
onMounted(() => {
  loadPost();
  loadComments();
});
</script>


<style scoped>
.report-btn {
  background: #d9534f;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 6px 12px;
  cursor: pointer;
  font-weight: 500;
}

/* ✅ 신고 모달 */
.modal-overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.55);
  display: flex; justify-content: center; align-items: center;
  z-index: 999;
}

.modal-box {
  background: white; width: 420px; padding: 28px 26px;
  border-radius: 14px; text-align: center;
}

.modal-subtext { color: #777; font-size: 14px; margin-bottom: 10px; }

.modal-form { display: flex; flex-direction: column; gap: 10px; text-align: left; }

.modal-form input, .modal-form select, .modal-form textarea {
  width: 100%; border: 1px solid #ddd; border-radius: 8px; padding: 10px; font-size: 14px;
}

.modal-form textarea { min-height: 100px; resize: vertical; }

.preview-list {
  display: flex; gap: 8px; flex-wrap: wrap; margin-top: 6px;
}

.preview-img {
  width: 90px; height: 90px; border-radius: 10px; object-fit: cover; border: 1px solid #ccc;
}
.modal-actions { display: flex; justify-content: center; gap: 10px; margin-top: 18px; }
.modal-btn {
  background: #6c63ff; color: #fff; border: none; padding: 10px 18px;
  border-radius: 8px; cursor: pointer;
}
.cancel-btn {
  border: 1px solid #aaa; background: #fff; color: #555;
  border-radius: 8px; padding: 10px 18px; cursor: pointer;
}

.detail-wrap {
  max-width: 750px;
  margin: auto;
  padding-bottom: 60px;
}

.detail-card {
  background: #fff;
  padding: 18px 20px;
  border-radius: 14px;
  border: 1px solid #e7e7eb;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.back-btn {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  margin-bottom: 14px;
}

.post-header {
  display: flex;
  justify-content: space-between;
  color: #777;
  font-size: 14px;
}

.title-action-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: -6px;
}

.post-action {
  display: flex;
  gap: 8px;
}

.edit-btn,
.save-btn {
  background: #6c63ff;
  color: #fff;
  border: none;
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;
}

.delete-btn {
  background: #d9534f;
  color: #fff;
  border: none;
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;
}

.cancel-btn-ghost,
.ghost-btn {
  background: transparent;
  border: 1px solid #bbb;
  color: #555;
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;
}

.title {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
}

.content {
  margin-top: 2px;
  font-size: 16px;
  line-height: 1.5;
}

.row-gap {
  margin-top: 8px;
  display: flex;
  gap: 8px;
}

.delete-img-btn {
  background: #d9534f;
  color: #fff;
  border: none;
  padding: 6px 12px;
  border-radius: 8px;
}

.post-footer {
  display: flex;
  gap: 14px;
  font-size: 15px;
  color: #444;
}

.comment-section {
  margin-top: 24px;
  background: #fff;
  padding: 18px 20px;
  border-radius: 14px;
  border: 1px solid #e7e7eb;
}

.comment-write {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.comment-write input {
  flex: 1;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.comment-write button {
  padding: 10px 14px;
  background: #6c63ff;
  border: none;
  border-radius: 8px;
  color: #fff;
  cursor: pointer;
}

.like-btn {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  gap: 4px;
  align-items: center;
  color: #666;
}

.like-btn .active {
  color: #ff4d6d;
  transform: scale(1.2);
  transition: 0.2s;
}

.post-images {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detail-img,
.preview-img {
  width: 100%;
  border-radius: 12px;
  object-fit: cover;
}

.edit-image-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.edit-image-list img {
  width: 140px;
  height: 140px;
  object-fit: cover;
  border-radius: 10px;
}

.edit-image-item {
  position: relative;
  width: 140px;
}

.delete-img-btn {
  margin-top: 6px;
  background: #d9534f;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 6px 10px;
  cursor: pointer;
}
</style>
