<template>
  <div class="ranking-box">
    <h3>🏆 커뮤니티 랭킹</h3>
    <p class="sub">좋아요 순위 Top 20</p>

    <ul class="rank-list">
      <li v-for="(item, index) in rankData" :key="index">
        <span class="rank-num">{{ index + 1 }}</span>
        <span class="name">{{ item.nickname }}</span>
        <span class="like">❤️ {{ item.totalLikes }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { fetchCommunityRanking } from "@/api/post"

const rankData = ref([])

const loadRank = async () => {
  try {
    const { data } = await fetchCommunityRanking()
    rankData.value = data
  } catch (e) {
    console.error("랭킹 조회 오류:", e)
  }
}

onMounted(loadRank)
</script>

<style scoped>
.ranking-box {
  background: #fff;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.rank-list {
  margin-top: 14px;
  list-style: none;
  padding: 0;
}

.rank-list li {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 14px;
}

.rank-num {
  width: 24px;
  font-weight: 600;
}
.name {
  flex: 1;
  margin-left: 8px;
}
.like {
  color: #ff4d6d;
  font-weight: 600;
}
</style>
