<template>
  <span class="badge" :class="klass">{{ label }}</span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: { type: String, required: true } // 'post' | 'user'
})

const label = computed(() => props.type === 'post' ? '게시물' : '사용자')
const klass = computed(() => props.type === 'post' ? 'tone-indigo' : 'tone-purple')
</script>

<style scoped>
.badge{
  display:inline-block; padding:6px 10px; border-radius:999px;
  font-size:12px; font-weight:700; border:1px solid transparent;
}
.tone-indigo{ color:#4338ca; background:#eef1ff; border-color:#dfe4ff; }
.tone-purple{ color:#6d28d9; background:#f6f1ff; border-color:#e7dcff; }
</style>
