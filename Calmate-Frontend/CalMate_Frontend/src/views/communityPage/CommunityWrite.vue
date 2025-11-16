<template>
  <div class="write-wrap">

    <!-- ✅ 페이지 제목 -->
    <h2 class="write-title">게시글 작성</h2>

    <!-- ✅ 카테고리 선택 -->
    <div class="form-group">
      <label>카테고리</label>
      <select v-model="form.category">
        <option value="meal">식단</option>
        <option value="exercise">운동</option>
        <option value="free">자유게시판</option>
        <option value="change">Before&After</option>
      </select>
    </div>

    <!-- ✅ 제목 -->
    <div class="form-group">
      <label>제목</label>
      <input type="text" v-model="form.title" placeholder="제목을 입력하세요" />
    </div>

    <!-- ✅ 내용 -->
    <div class="form-group">
      <label>내용</label>
      <textarea v-model="form.content" placeholder="내용을 입력하세요"></textarea>
    </div>

    <!-- ✅ 이미지 업로드 -->
    <div class="form-group">
      <label>이미지 첨부 (선택, 여러장 가능)</label>
      <input type="file" multiple @change="handleFiles" />

      <div v-if="previews.length > 0" class="preview-list">
        <div v-for="(img, i) in previews" :key="i" class="preview">
          <img :src="img" alt="preview" />
        </div>
      </div>
    </div>

    <!-- ✅ 버튼 -->
    <div class="btn-row">
      <button class="cancel-btn" @click="goBack">취소</button>
      <!-- <button class="submit-btn" @click.prevent="submitPost">등록</button> -->
      <button type="button" class="submit-btn" @click="submitPost">등록</button>
    </div>

    <!-- ✅ 포인트 적립 모달 -->
    <div v-if="showPointModal" class="modal-overlay">
      <div class="modal-box">
        <h3>🎉 10포인트가 적립되었습니다!</h3>
        <p>게시글 작성 보상입니다 😊</p>
        <button class="modal-btn" @click="closePointModal">확인</button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from "@/lib/api"
import { useUserStore } from "@/stores/user"   // ✅ 추가

const userStore = useUserStore()              // ✅ 로그인 정보 사용
const router = useRouter()
const showPointModal = ref(false)

const closePointModal = () => {
  showPointModal.value = false
  router.push("/community")
}

const form = ref({
  category: 'free',
  title: '',
  content: '',
  images: []
})

const previews = ref([])

const handleFiles = (e) => {
  const files = Array.from(e.target.files)
  form.value.images = files
  previews.value = files.map(file => URL.createObjectURL(file))
}

const goBack = () => router.back()
import { nextTick } from 'vue'

const submitPost = async () => {
  // await nextTick()  // ✅ form 값이 다 반영된 뒤 전송 (빈 FormData 방지)

  // ✅ 로그인 체크
  if (!userStore.isLoggedIn) {
    alert("로그인이 필요합니다 😊")
    return router.push("/sign/signIn")
  }

  if (!form.value.title.trim() || !form.value.content.trim()) {
    return alert("제목과 내용을 입력해주세요.")
  }

  const tagMap = { meal: 2, exercise: 1, change: 3, free: 4 }

  const fd = new FormData()
  fd.append("title", form.value.title)
  fd.append("content", form.value.content)
  fd.append("tagId", tagMap[form.value.category])
  fd.append("memberId", userStore.userId)   // ✅ 로그인한 사용자 ID 적용

  form.value.images.forEach(img => fd.append("images", img))

  await api.post("/community/post", fd, {
    headers: { "Content-Type": "multipart/form-data" }
  })

  showPointModal.value = true
}
</script>

<style scoped>
.write-wrap {
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
}

.write-title {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 24px;
}

.form-group {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

input, select, textarea {
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 12px;
  font-size: 14px;
  background: #fff;
}

textarea {
  min-height: 160px;
  resize: vertical;
}


.preview-list {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.preview img {
  width: 140px;
  height: 140px;
  border-radius: 10px;
  object-fit: cover;
}

.btn-row {
  margin-top: 30px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.cancel-btn, .submit-btn {
  padding: 10px 18px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
}

.cancel-btn {
  border: 1px solid #aaa;
  background: #fff;
  color: #555;
}

.submit-btn {
  border: none;
  background: #6c63ff;
  color: #fff;
}

/* ✅ 모달 배경 (화면 어둡게) */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

/* ✅ 모달 박스 */
.modal-box {
  background: white;
  width: 380px;
  padding: 32px 26px;
  border-radius: 14px;
  text-align: center;
  animation: show 0.2s ease-out;
}

@keyframes show {
  from { transform: scale(0.85); opacity: 0 }
  to { transform: scale(1); opacity: 1 }
}

/* ✅ 버튼 */
.modal-btn {
  margin-top: 18px;
  padding: 10px 18px;
  background: #6c63ff;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
}
</style>
