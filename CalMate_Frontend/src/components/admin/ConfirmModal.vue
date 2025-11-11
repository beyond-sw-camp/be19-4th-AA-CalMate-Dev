<template>
  <!-- 반투명 오버레이 -->
  <div class="overlay" @click="$emit('cancel')">
    <!-- 모달 박스: 클릭 전파 방지 -->
    <div class="modal" @click.stop>
      <h3 class="title">{{ title }}</h3>
      <p class="message">{{ message }}</p>
      <div class="actions">
        <button class="btn ghost" @click="$emit('cancel')">{{ cancelText }}</button>
        <button class="btn danger" @click="$emit('ok')">{{ okText }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
/* 간단 확인 모달: 제목/메시지/버튼 라벨을 프롭으로 받아
   ok, cancel 이벤트를 부모로 내보냄 */
const props = defineProps({
  title: { type: String, required: true },
  message: { type: String, required: true },
  okText: { type: String, default: '확인' },
  cancelText: { type: String, default: '취소' }
})
</script>

<style scoped>
.overlay{
  position: fixed; inset: 0; background: rgba(17,24,39,.4);
  display:grid; place-items:center; z-index: 50;
}
.modal{
  width: min(520px, 92vw);
  background:#fff; border-radius: 16px; padding: 18px;
  border:1px solid #e5e7eb; box-shadow: 0 10px 30px rgba(0,0,0,.12);
}
.title{ font-size: 18px; font-weight: 800; }
.message{ margin-top: 10px; color:#374151; white-space: pre-line; }
.actions{ display:flex; justify-content:flex-end; gap:8px; margin-top: 16px; }

.btn{ padding: 10px 14px; border-radius: 12px; border:1px solid #e5e7eb; background:#fff; cursor:pointer; }
.btn.ghost{ }
.btn.danger{ background:#ffebeb; border-color:#ffd6d6; color:#b91c1c; }
.btn.danger:hover{ background:#ffe1e1; }
</style>
