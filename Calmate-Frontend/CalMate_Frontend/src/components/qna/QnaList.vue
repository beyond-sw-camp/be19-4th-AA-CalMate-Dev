<template>
  <div class="qna-list-wrap">
    <section class="hero">
      <div class="hero-icon">❓</div>
      <div class="hero-main">
        <h2 class="hero-title">문의사항</h2>
        <p class="hero-sub">궁금한 점이나 문제가 있다면 문의해 주세요</p>
      </div>
      <RouterLink class="compose-btn" to="/main/qna/new">새 문의 작성</RouterLink>
    </section>

    <section class="card">
      <div v-if="items.length === 0" class="empty">아직 등록된 문의가 없습니다.</div>
      <div v-else class="list">
        <article
          v-for="it in items"
          :key="it.id"
          class="item"
          @click="goDetail(it.id)"
        >
          <header class="item-head">
            <span class="badge cat">{{ it.category }}</span>
            <span class="badge" :class="statusClass(it.status)">{{ it.status }}</span>
          </header>
          <h3 class="item-title">{{ it.title }}</h3>
          <p class="item-desc">{{ it.content }}</p>
          <footer class="item-foot">{{ timeAgo(it.createdAt) }} · 작성자 {{ it.author }}</footer>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { getQnaList } from '@/api/qna'

const items = ref([])
const router = useRouter()

onMounted(async () => {
  try {
    const res = await getQnaList({ limit: 20, offset: 0 })
    const list = Array.isArray(res?.data) ? res.data : []
    items.value = list.map(it => ({
      id: it.id,
      category: '일반',
      status: it.answer ? '완료' : '접수',
      title: it.title,
      content: it.contents,
      createdAt: it.createdAt,
      author: it.memberId,
    }))
  } catch (e) {
    console.error('Failed to load QnA list', e)
  }
})

function statusClass(s) {
  switch (s) {
    case '접수': return 'st-wait'
    case '진행중':
    case '처리중': return 'st-proc'
    case '완료': return 'st-done'
    default: return 'st-wait'
  }
}

function timeAgo(ts) {
  try {
    const t = new Date(ts).getTime()
    const diff = Math.floor((Date.now() - t) / 1000)
    if (diff < 60) return '방금 전'
    if (diff < 3600) return `${Math.floor(diff / 60)}분 전`
    if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`
    return `${Math.floor(diff / 86400)}일 전`
  } catch {
    return String(ts)
  }
}

function goDetail(id) {
  if (!id) return
  router.push(`/main/qna/${id}`)
}
</script>

<style scoped>
.qna-list-wrap { display: flex; flex-direction: column; gap: 16px; }
.hero { display: flex; align-items: center; gap: 16px; padding: 18px 20px; border-radius: 18px; background: linear-gradient(90deg, #f7e9ff, #f0f7ff); border: 1px solid #f0f0f3; }
.hero-icon { font-size: 22px; }
.hero-main { flex: 1; }
.hero-title { margin: 0; font-size: 20px; font-weight: 700; color: #111827; }
.hero-sub { margin: 2px 0 0; font-size: 13px; color: #6b7280; }
.compose-btn { background: #0b0b2b; color: #fff; border: 0; padding: 10px 14px; border-radius: 12px; text-decoration: none; font-weight: 700; }
.compose-btn:hover { background: #11113a; }

.card { background: #fff; border: 1px solid #efeff4; border-radius: 18px; padding: 12px; }
.empty { color: #9ca3af; padding: 24px; text-align: center; }
.list { display: flex; flex-direction: column; gap: 8px; }
.item { padding: 14px 12px; border-radius: 16px; border: 1px solid #eef0f4; cursor: pointer; transition: background-color .12s ease; }
.item:hover { background: #f9fafb; }
.item-head { display: flex; gap: 8px; align-items: center; margin-bottom: 6px; }
.badge { display: inline-flex; align-items: center; gap: 6px; border-radius: 999px; padding: 3px 8px; font-size: 12px; font-weight: 700; background: #f3f4f6; color: #374151; }
.badge.cat { background: #e8f0ff; color: #1d4ed8; }
.st-wait { background: #fff7ed; color: #c2410c; }
.st-proc { background: #e0f2fe; color: #0369a1; }
.st-done { background: #ecfdf5; color: #047857; }
.item-title { margin: 2px 0; font-size: 16px; font-weight: 700; color: #111827; }
.item-desc { margin: 0; font-size: 13px; color: #6b7280; }
.item-foot { margin-top: 8px; font-size: 12px; color: #9ca3af; }
</style>
