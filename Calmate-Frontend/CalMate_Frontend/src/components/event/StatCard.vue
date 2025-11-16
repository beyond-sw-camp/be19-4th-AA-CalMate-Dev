<template>
  <article
    class="stat-card"
    :class="{ 'is-clickable': clickable }"
    @click="clickable && emit('click')"
  >
    <div :class="['stat-icon', tint]">
      <component :is="icon" class="h-5 w-5" :class="iconColor" />
    </div>
    <div>
      <p class="stat-label">{{ label }}</p>
      <p class="stat-value">
        {{ value }}<span v-if="suffix" class="stat-suffix">{{ suffix }}</span>
      </p>
      <p v-if="helper" class="stat-helper">{{ helper }}</p>
    </div>
  </article>
</template>

<script setup>
defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number], required: true },
  suffix: { type: String, default: '' },
  helper: { type: String, default: '' },
  icon: { type: [Object, Function, String], required: true },
  iconColor: { type: String, default: '' },
  tint: { type: String, default: '' },
  clickable: { type: Boolean, default: false },
});
const emit = defineEmits(['click']);
</script>

<style scoped>
.stat-card { display:flex; gap:1rem; padding:1.25rem; border-radius:24px; border:1px solid #f1f5f9; background:#fff; min-height:110px; }
.stat-card.is-clickable { cursor:pointer; transition: transform .08s ease, box-shadow .12s ease; }
.stat-card.is-clickable:hover { transform: translateY(-2px); box-shadow: 0 18px 30px rgba(15,23,42,.06); }
.stat-icon { width:48px; height:48px; border-radius:16px; display:flex; align-items:center; justify-content:center; }
.stat-icon--gold { background:#fff7e1; }
.stat-icon--sun { background:#ffe9d6; }
.stat-icon--lilac { background:#f5ecff; }
.stat-label { color:#94a3b8; font-size:.85rem; }
.stat-value { font-size:1.6rem; font-weight:700; color:#0f172a; line-height:1.2; }
.stat-suffix { margin-left:.25rem; font-size:1rem; color:#64748b; }
.stat-helper { color:#94a3b8; font-size:.85rem; }
</style>