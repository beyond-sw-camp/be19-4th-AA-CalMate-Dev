<template>
  <RouterLink :to="`/community/${post.id}`" class="post-card-link">
    <div class="post-card">

      <div class="post-header">
        <div class="author">{{ post.authorName }}</div>

        <div class="right-box">
          <div class="tag-label">#{{ post.tagName }}</div>
          <div class="time">{{ post.createdAt }}</div>
        </div>
      </div>

      <h3 class="post-title">{{ post.title }}</h3>

      <p class="content">{{ post.content }}</p>

      <div class="post-image" v-if="post.imageUrl">
        <!-- ✅ baseURL 자동 적용 -->
        <img :src="`${api.defaults.baseURL}${post.imageUrl}`" alt="post image" />
      </div>

      <div class="post-footer">
        <div class="like">❤️ {{ post.likes }}</div>
        <div class="comment">💬 {{ post.comments }}</div>
      </div>

    </div>
  </RouterLink>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import api from '@/lib/api'   // ✅ baseURL 사용을 위해 추가

const props = defineProps({
  post: Object
})
</script>

<style scoped>
.post-card-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.post-card {
  background: #fff;
  padding: 18px 20px;
  border-radius: 14px;
  border: 1px solid #e7e7eb;
  display: flex;
  flex-direction: column;
  gap: 12px;
  cursor: pointer;
  transition: 0.2s;
}

.post-card:hover { background: #fafafa; }

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.author {
  font-size: 15px;
  color: #777;
}

/* ✅ 오른쪽 박스 */
.right-box {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

/* ✅ 태그 라벨 */
.tag-label {
  background: #eef0ff;
  color: #6c63ff;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 12px;
  font-weight: 600;
}

/* ✅ 날짜를 태그 아래에 */
.time {
  font-size: 12px;
  color: #999;
}

.post-title {
  font-size: 17px;
  font-weight: 600;
  margin: 4px 0 6px;
  color: #111;
}

.content {
  font-size: 15px;
  color: #333;
  line-height: 1.45;
  white-space: pre-line;
}

.post-image img {
  width: 100%;
  border-radius: 12px;
  object-fit: cover;
}

.post-footer {
  display: flex;
  gap: 16px;
  font-size: 14px;
  color: #444;
}

.like, .comment {
  display: flex;
  align-items: center;
  gap: 4px;
}
</style>
