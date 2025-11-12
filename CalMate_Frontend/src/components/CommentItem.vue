<template>
  <div class="comment-item">
    <div class="row">
      <strong class="name">{{ comment.authorName }}</strong>
      <span class="time">{{ comment.createdAt }}</span>
    </div>

    <!-- ✅ 수정 중인지 여부 -->
    <template v-if="isEditing">
      <input v-model="editText" class="edit-input" />
      <div class="edit-actions">
        <button @click="saveEdit">저장</button>
        <button @click="cancelEdit">취소</button>
      </div>
    </template>

    <template v-else>
      <p class="body" :class="{ deleted: comment.content === '삭제된 댓글입니다.' }">
        {{ comment.content }}
      </p>
    </template>

    <div class="actions">
      <!-- ✅ 댓글 좋아요 버튼 -->
      <button class="like-btn" @click="toggleLike">
        <span :class="{ active: liked }">❤️</span> {{ likeCount }}
      </button>

      <!-- 답글 -->
      <button class="reply-btn" @click="toggleReply">
        {{ showReply ? '취소' : '답글' }}
      </button>

      <!-- ✏️ 본인일 때만 수정/삭제 -->
      <template v-if="userStore.userId === comment.memberId">
        <button class="edit-btn" @click="startEdit">수정</button>
        <button class="delete-btn" @click="removeComment">삭제</button>
      </template>

      <!-- 🚨 신고 버튼 (다른 사람 댓글일 때만) -->
      <template v-else>
        <button class="report-btn" @click="openReportModal">🚨 신고</button>
      </template>
    </div>

    <!-- ✅ 답글 입력 -->
    <div v-if="showReply" class="reply-box">
      <input
        v-model="replyText"
        placeholder="답글을 입력하세요..."
        @keyup.enter="submitReply"
      />
      <button @click="submitReply">등록</button>
    </div>

    <!-- ✅ 대댓글 목록 -->
    <div v-if="comment.replies && comment.replies.length" class="replies">
      <CommentItem
        v-for="r in comment.replies"
        :key="r.id"
        :comment="r"
        :post-id="postId"
        @submitted="$emit('submitted')"
      />
    </div>

    <!-- ✅ 신고 모달 -->
    <div v-if="showReportModal" class="modal-overlay">
      <div class="modal-box">
        <h3>🚨 댓글 신고하기</h3>
        <p class="modal-subtext">신고 정보를 입력해주세요.</p>

        <div class="modal-form">
          <!-- ✅ 신고 제목 -->
          <label>신고 제목</label>
          <input
            type="text"
            v-model="reportForm.title"
            placeholder="신고 제목을 입력하세요"
          />

          <!-- ✅ 신고 사유 -->
          <label>신고 사유</label>
          <select v-model="reportForm.reason">
            <option value="" disabled>신고 사유를 선택하세요</option>
            <option v-for="reason in reportReasons" :key="reason" :value="reason">
              {{ reason }}
            </option>
          </select>

          <!-- ✅ 상세 내용 -->
          <label>신고 내용</label>
          <textarea
            v-model="reportForm.content"
            placeholder="신고 내용을 입력하세요..."
          ></textarea>

          <!-- ✅ 이미지 첨부 -->
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
defineOptions({ name: 'CommentItem' })

import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from "@/stores/user"
import { addComment, updateComment, deleteComment, toggleCommentLike } from '@/api/post'
import api from '@/lib/api'

const userStore = useUserStore()
const router = useRouter()

const props = defineProps({
  comment: { type: Object, required: true },
  postId: { type: [String, Number], required: true }
})
const emit = defineEmits(['submitted'])

/* ✅ 좋아요 */
const likeCount = ref(props.comment.likeCount ?? 0)
const liked = ref(props.comment.liked ?? false)

const toggleLike = async () => {
  if (!userStore.isLoggedIn) {
    alert("로그인이 필요합니다 😊")
    return router.push("/sign/signIn")
  }

  await toggleCommentLike(props.comment.id, userStore.userId)

  if (liked.value) {
    likeCount.value = Math.max(likeCount.value - 1, 0)
    liked.value = false
  } else {
    likeCount.value += 1
    liked.value = true
  }
}

/* ✅ 대댓글 */
const showReply = ref(false)
const replyText = ref('')
const toggleReply = () => (showReply.value = !showReply.value)

const submitReply = async () => {
  if (!userStore.isLoggedIn) {
    alert("로그인이 필요합니다 😊")
    return router.push("/sign/signIn")
  }
  if (!replyText.value.trim()) return

  await addComment(props.postId, {
    memberId: userStore.userId,
    content: replyText.value,
    parentId: props.comment.id
  })

  replyText.value = ''
  showReply.value = false
  emit('submitted')
}

/* ✅ 수정/삭제 */
const isEditing = ref(false)
const editText = ref(props.comment.content)

const startEdit = () => {
  if (!userStore.isLoggedIn) {
    alert("로그인이 필요합니다 😊")
    return router.push("/sign/signIn")
  }
  isEditing.value = true
}

const cancelEdit = () => {
  editText.value = props.comment.content
  isEditing.value = false
}

const saveEdit = async () => {
  if (!editText.value.trim()) return
  await updateComment(props.postId, props.comment.id, editText.value, userStore.userId)
  isEditing.value = false
  emit('submitted')
}

const removeComment = async () => {
  if (!confirm("정말 삭제하시겠습니까?")) return
  await deleteComment(props.postId, props.comment.id, userStore.userId)
  emit('submitted')
}

/* ✅ 신고 기능 */
const showReportModal = ref(false)
const reportReasons = [
  "욕설", "도배", "사기", "음란물", "허위사실", "스팸", "괴롭힘", "기타", "명예훼손", "불법 광고"
]
const reportForm = ref({
  title: '',
  reason: '',
  content: '',
  victimMemberId: null,
  offenderMemberId: null,
  postId: props.postId,
  commentId: props.comment.id
})
const attachedFiles = ref([])
const previewImages = ref([])

const handleFiles = (e) => {
  attachedFiles.value = Array.from(e.target.files)
  previewImages.value = attachedFiles.value.map(file => URL.createObjectURL(file))
}

const openReportModal = () => {
  if (!userStore.isLoggedIn) {
    alert("로그인이 필요합니다 😊")
    return router.push("/sign/signIn")
  }
  showReportModal.value = true
  reportForm.value.victimMemberId = userStore.userId
  reportForm.value.offenderMemberId = props.comment.memberId
}

const closeReportModal = () => {
  showReportModal.value = false
  reportForm.value = {
    title: '',
    reason: '',
    content: '',
    victimMemberId: userStore.userId,
    offenderMemberId: props.comment.memberId,
    postId: props.postId,
    commentId: props.comment.id
  }
  attachedFiles.value = []
  previewImages.value = []
}

const submitReport = async () => {
  try {
    const fd = new FormData()
    fd.append("title", reportForm.value.title)
    fd.append("reason", reportForm.value.reason)
    fd.append("content", reportForm.value.content)
    fd.append("victimMemberId", reportForm.value.victimMemberId)
    fd.append("offenderMemberId", reportForm.value.offenderMemberId)
    fd.append("postId", reportForm.value.postId)
    fd.append("commentId", reportForm.value.commentId)
    attachedFiles.value.forEach(img => fd.append("images", img))

    await api.post('/api/report', fd, {
      headers: { "Content-Type": "multipart/form-data" }
    })
    alert('신고가 접수되었습니다.')
    closeReportModal()
  } catch (e) {
    console.error(e)
    alert('신고 중 오류가 발생했습니다.')
  }
}
</script>

<style scoped>
.comment-item { padding: 12px 0; border-bottom: 1px solid #eee; }
.row { display: flex; gap: 8px; align-items: center; }
.name { font-weight: 600; color: #111; }
.time { font-size: 12px; color: #999; }
.body { margin: 6px 0 8px; color: #333; line-height: 1.45; }

.actions { display: flex; gap: 10px; margin-top: 6px; align-items: center; }

.like-btn {
  background: none; border: none; cursor: pointer; color: #666;
  display: flex; align-items: center; gap: 4px;
}
.like-btn .active {
  color: #ff4d6d;
  transform: scale(1.2);
  transition: 0.2s;
}
.reply-btn, .edit-btn, .delete-btn, .report-btn {
  background: none; border: none; cursor: pointer; padding: 4px 0;
}
.reply-btn { color: #6c63ff; }
.edit-btn { color: #555; }
.delete-btn, .report-btn { color: #d9534f; }

.reply-box { display: flex; gap: 8px; margin: 8px 0; }
.reply-box input { flex: 1; padding: 8px; border: 1px solid #ddd; border-radius: 8px; }
.reply-box button { padding: 8px 12px; background: #6c63ff; color: #fff; border: none; border-radius: 6px; cursor: pointer; }

.edit-input { width: 100%; padding: 8px; border-radius: 6px; border: 1px solid #ccc; }
.edit-actions { display: flex; gap: 8px; margin: 6px 0; }

.replies { margin-left: 16px; border-left: 2px solid #f0f0f0; padding-left: 12px; }

.deleted { color: #9e9e9e; opacity: 0.7; font-style: italic; font-size: 13px; }

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
</style>
