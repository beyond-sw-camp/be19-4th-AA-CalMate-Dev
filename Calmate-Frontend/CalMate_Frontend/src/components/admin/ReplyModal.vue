<template>
  <!-- 전체 오버레이(배경 클릭 시 취소) -->
  <div class="overlay" @click="$emit('cancel')">
    <!-- 모달 박스(내부 클릭은 전파 중지) -->
    <div class="modal" @click.stop>
      <!-- 제목: 부모에서 전달 -->
      <h3 class="title">{{ title }}</h3>
      <!-- 원문 요약(제목만 간단 표기) -->
      <p class="question">질문: {{ question }}</p>
      <!-- 답변 입력 폼 -->
      <label class="label">답변 내용</label>
      <textarea
        class="textarea"
        :value="content"
        @input="$emit('update:content', $event.target.value)"
        placeholder="여기에 답변을 작성하세요..."
      />
      <!-- 액션 버튼: 취소/전송 -->
      <div class="actions">
        <button class="btn ghost" @click="$emit('cancel')">취소</button>
        <button class="btn success" @click="$emit('submit')">전송</button>
      </div>
    </div>
  </div>
</template>

<script setup>
/* 프롭 정의: v-model 스타일을 위해 content는 update:content 이벤트로 동기화 */
const props = defineProps({
  title:   { type: String, required: true },   // 모달 제목
  question:{ type: String, default: '' },      // 문의 제목(간단 표기)
  content: { type: String, default: '' }       // 답변 본문(양방향 업데이트)
})
</script>

<style scoped>
/* 오버레이: 반투명 어둡게 */
.overlay{
  position: fixed; inset: 0; background: rgba(17,24,39,.4);
  display:grid; place-items:center; z-index: 50;
}
/* 모달 상자 */
.modal{
  width: min(640px, 92vw);
  background:#fff; border-radius: 16px; padding: 18px;
  border:1px solid #e5e7eb; box-shadow: 0 10px 30px rgba(0,0,0,.12);
}
.title{ font-size: 18px; font-weight: 800; }
.question{ margin-top: 6px; color:#374151; }
.label{ display:block; margin-top: 12px; font-weight:700; }
.textarea{
  margin-top: 6px; width: 100%; min-height: 140px; resize: vertical;
  border:1px solid #e5e7eb; border-radius: 12px; padding: 10px 12px;
  outline: none;
}
.textarea:focus{ border-color:#cbd5e1; box-shadow: 0 0 0 3px rgba(37,99,235,.08); }
.actions{ display:flex; justify-content:flex-end; gap:8px; margin-top: 14px; }
.btn{ padding:10px 14px; border-radius:12px; border:1px solid #e5e7eb; background:#fff; cursor:pointer; }
.btn.ghost{ }
.btn.success{ background:#eafaf7; border-color:#d3f4ec; color:#0f766e; }
.btn.success:hover{ background:#e0f5ef; }
</style>
