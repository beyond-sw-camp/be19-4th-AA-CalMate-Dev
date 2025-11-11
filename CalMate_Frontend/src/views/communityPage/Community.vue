<template>
  <div class="community">

    <!-- ✅ 상단 카테고리 + 글쓰기 버튼 -->
    <div class="community-top">
      <ul class="category-tabs">
        <li 
          v-for="item in categories" 
          :key="item.value" 
          :class="{ active: selectedCategory === item.value }"
          @click="selectCategory(item.value)"
        >
          {{ item.label }}
        </li>
      </ul>

      <RouterLink to="/community/write" class="write-btn">
        + 글쓰기
      </RouterLink>
    </div>

    <!-- ✅ 게시글 목록 -->
    <div class="post-list">
      <CommunityPostCard
        v-for="post in filteredPosts"
        :key="post.id"
        :post="post"
      />
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import CommunityPostCard from '@/components/CommunityPostCard.vue'
import { useUserStore } from "@/stores/user"  // ✅ 내글 필터용
import { fetchPostList } from "@/api/post"
const userStore = useUserStore()

/* ✅ 카테고리 목록 */
const categories = [
  { label: "전체", value: "all" },
  { label: "내 글", value: "my" },
  { label: "식단", value: "meal" },
  { label: "운동", value: "exercise" },
  { label: "자유게시판", value: "free" },
  { label: "Before&After", value: "change" },
]

/* ✅ 카테고리 → DB tag.name 매핑 */
const categoryToTagName = {
  meal: "식단",
  exercise: "운동",
  free: "자유게시판",
  change: "Before&After"
}

/* ✅ 현재 선택된 카테고리 */
const selectedCategory = ref("all")

const posts = ref([])

// ✅ API로 목록 불러오기
onMounted(async () => {
  const res = await fetchPostList()
  posts.value = res.data
})

// ✅ 필터링
const filteredPosts = computed(() => {
  if (selectedCategory.value === "all") return posts.value

  if (selectedCategory.value === "my") {
    return posts.value.filter(p => p.authorName === userStore.nickname)   // 로그인 연동 시 여기 수정
  }

  // ✅ 카테고리 값 → DB tag.name 변환 후 필터
  return posts.value.filter(p => p.tagName === categoryToTagName[selectedCategory.value])
  // return posts.value.filter(p => p.tagName === selectedCategory.value)
})

const selectCategory = (value) => selectedCategory.value = value
</script>

<style scoped>
.community {
  width: 100%;
  max-width: 750px;
  margin: 0 auto;
}

/* ✅ 상단바 */
.community-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}

/* ✅ 카테고리 탭 */
.category-tabs {
  display: flex;
  gap: 18px;
  padding: 0;
  list-style: none;
}

.category-tabs li {
  cursor: pointer;
  font-size: 15px;
  color: #666;
  padding-bottom: 6px;
  transition: 0.2s;
}

.category-tabs li.active {
  color: #111;
  font-weight: 600;
  border-bottom: 2px solid #111;
}

/* ✅ 글쓰기 버튼 */
.write-btn {
  padding: 8px 16px;
  background: #faf7ff;
  border: 1px solid #d6caff;
  border-radius: 10px;
  font-size: 14px;
  text-decoration: none;
  color: #6c63ff;
  transition: 0.2s;
}

.write-btn:hover {
  background: #ece6ff;
}

/* ✅ 게시글 리스트 */
.post-list {
  display: flex;
  flex-direction: column;
  gap: 22px;
}
</style>
