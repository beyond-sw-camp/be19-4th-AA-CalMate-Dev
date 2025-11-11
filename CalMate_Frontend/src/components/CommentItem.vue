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
      <p class="body"
        :class="{ deleted: comment.content === '삭제된 댓글입니다.' }">
        {{ comment.content }}
      </p>
    </template>

    <div class="actions">

      <!-- ✅ 댓글 좋아요 버튼 -->
      <button class="like-btn" @click="toggleLike">
        <span :class="{ active: liked }">❤️</span> {{ likeCount }}
      </button>

      <!-- 대댓글 -->
      <button class="reply-btn" @click="toggleReply">
        {{ showReply ? '취소' : '답글' }}
      </button>

      <!-- 수정 / 삭제 -->
      <button class="edit-btn" @click="startEdit">수정</button>
      <button class="delete-btn" @click="removeComment">삭제</button>
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
  </div>
</template>

<script setup>
defineOptions({ name: 'CommentItem' })

import { ref } from 'vue'
import { addComment, updateComment, deleteComment, toggleCommentLike } from '@/api/post'

const props = defineProps({
  comment: { type: Object, required: true },
  postId: { type: [String, Number], required: true }
})
const emit = defineEmits(['submitted'])

/* ✅ 좋아요 상태 */
const likeCount = ref(props.comment.likeCount ?? 0)
const liked = ref(props.comment.liked ?? false)
const memberId = 1                              // 로그인 연동 전 임시 값

// const toggleLike = async () => {
//   try {
//     const { data } = await toggleCommentLike(props.comment.id, memberId)
//     likeCount.value = data.likeCount
//     liked.value = data.liked
//   } catch (e) {
//     console.error("댓글 좋아요 오류:", e)
//   }
// }
const toggleLike = async () => {
  try {
    const { data } = await toggleCommentLike(props.comment.id, memberId)

    // 서버 응답이 likeCount, liked 를 주지 않더라도 로직 유지됨
    if (liked.value) {
      // 이미 좋아요 상태였다면 → 좋아요 취소
      likeCount.value = Math.max(likeCount.value - 1, 0)
      liked.value = false
    } else {
      // 좋아요 추가
      likeCount.value = likeCount.value + 1
      liked.value = true
    }

  } catch (e) {
    console.error("댓글 좋아요 오류:", e)
  }
}


/* ✅ 대댓글 */
const showReply = ref(false)
const replyText = ref('')
const toggleReply = () => (showReply.value = !showReply.value)

const submitReply = async () => {
  if (!replyText.value.trim()) return
  await addComment(props.postId, {
    memberId: 1,
    content: replyText.value,
    parentId: props.comment.id
  })
  replyText.value = ''
  showReply.value = false
  emit('submitted')
}

/* ✅ 수정 */
const isEditing = ref(false)
const editText = ref(props.comment.content)

const startEdit = () => (isEditing.value = true)
const cancelEdit = () => {
  editText.value = props.comment.content
  isEditing.value = false
}
const saveEdit = async () => {
  if (!editText.value.trim()) return
  await updateComment(props.postId, props.comment.id, editText.value)
  isEditing.value = false
  emit('submitted')
}

/* ✅ 삭제 */
const removeComment = async () => {
  if (!confirm("정말 삭제하시겠습니까?")) return
  await deleteComment(props.postId, props.comment.id)
  emit('submitted')
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
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  display: flex;
  align-items: center;
  gap: 4px;
}
.like-btn .active {
  color: #ff4d6d;
  transform: scale(1.2);
  transition: 0.2s;
}

.reply-btn, .edit-btn, .delete-btn {
  background: none; border: none; cursor: pointer; padding: 4px 0;
}
.reply-btn { color: #6c63ff; }
.edit-btn { color: #555; }
.delete-btn { color: #d9534f; }

.reply-box { display: flex; gap: 8px; margin: 8px 0; }
.reply-box input { flex: 1; padding: 8px; border: 1px solid #ddd; border-radius: 8px; }
.reply-box button { padding: 8px 12px; background: #6c63ff; color: #fff; border: none; border-radius: 6px; cursor: pointer; }

.edit-input { width: 100%; padding: 8px; border-radius: 6px; border: 1px solid #ccc; }
.edit-actions { display: flex; gap: 8px; margin: 6px 0; }

.replies { margin-left: 16px; border-left: 2px solid #f0f0f0; padding-left: 12px; }

.deleted {
  color: #9e9e9e;
  opacity: 0.7;
  font-style: italic;
  font-size: 13px;
}
</style>
