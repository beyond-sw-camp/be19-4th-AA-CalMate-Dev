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
          <template v-if="!isEditing">
            <button class="edit-btn" @click="startEdit">수정</button>
            <button class="delete-btn" @click="deletePost">삭제</button>
          </template>
          <template v-else>
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

      <!-- ✅ 상세조회 이미지 표시 -->
      <div v-if="!isEditing && post.images?.length" class="post-images">
        <img v-for="(img, i) in post.images" :key="i" :src="`${api.defaults.baseURL}${img}`" class="detail-img" />
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
        <input v-model="newComment"
          placeholder="댓글을 입력하세요..."
          @keyup.enter="submitComment"/>
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

  </div>
</template>

<script setup>
import { togglePostLike } from "@/api/post";
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchPostDetail, addComment } from '@/api/post'
import api from '@/lib/api'
import CommentItem from '@/components/CommentItem.vue'

const route = useRoute()
const router = useRouter()

const removedImages = ref([])   // ✅ 삭제 요청할 이미지 목록

const post = ref({})
const existingImages = ref([])   // ✅ 기존 이미지 여러장 저장
const previews = ref([])         // ✅ 새 이미지 미리보기
const newImages = ref([])        // ✅ 새로 업로드되는 이미지들

const form = ref({ title: '', content: '', tagId: null })

const comments = ref([])
const newComment = ref('')
const memberId = 1                                // 로그인 전 임시값

const likeCount = ref(0)
const liked = ref(false)

const isEditing = ref(false)
const saving = ref(false)

const removeExistingImage = (index) => {
  removedImages.value.push(existingImages.value[index]); // ✅ 삭제 요청 목록에 추가
  existingImages.value.splice(index, 1); // ✅ 화면에서 제거
}

const loadPost = async () => {
  const { data } = await api.get(`/community/post/${route.params.postId}`, {
    params: { memberId }
  })

  post.value = data
  form.value = { title: data.title, content: data.content, tagId: data.tagId != null ? String(data.tagId) : '' } // 방어
  existingImages.value = data.images ?? []   // ✅ 배열로 저장

  likeCount.value = data.likes ?? 0
  liked.value = data.liked ?? false
}

const loadComments = async () => {
  const { data } = await api.get(`/community/post/${route.params.postId}/comments`, {
    params: { memberId }
  })
  comments.value = data
}

const handleFiles = (e) => {
  newImages.value = Array.from(e.target.files)
  previews.value = newImages.value.map(f => URL.createObjectURL(f))
}

const saveEdit = async () => {
  saving.value = true
  
  const fd = new FormData()
  fd.append('title', form.value.title)
  fd.append('content', form.value.content)
  fd.append('tagId', form.value.tagId)

  // ✅ 삭제된 기존 이미지 목록 보내기
  removedImages.value.forEach(url => {
    fd.append("deleteImages", url)
  })

  // ✅ 새 이미지 추가 업로드
  newImages.value.forEach(img => fd.append("images", img))

  await api.patch(`/community/post/${route.params.postId}`, fd, {
    headers: { "Content-Type": "multipart/form-data" }
  })

  await loadPost()
  previews.value = []
  newImages.value = []
  removedImages.value = []
  isEditing.value = false
  saving.value = false
}

const startEdit = () => {
  isEditing.value = true
}

const cancelEdit = () => {
  previews.value = []
  newImages.value = []
  isEditing.value = false
}

const deletePost = async () => {
  if (!confirm("정말 삭제하시겠습니까?")) return
  await api.delete(`/community/post/${route.params.postId}`)
  router.push("/community")
}

const toggleLikePost = async () => {
  await togglePostLike(route.params.postId, memberId)
  liked.value = !liked.value
  likeCount.value += liked.value ? 1 : -1
}

const submitComment = async () => {
  if (!newComment.value.trim()) return

  await api.post(`/community/post/${route.params.postId}/comments`, {
    memberId,
    content: newComment.value
  })
  newComment.value = ''
  loadComments()
}

onMounted(() => {
  loadPost()
  loadComments()
})
</script>

<style scoped>
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
