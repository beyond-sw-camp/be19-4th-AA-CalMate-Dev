<template>
  <!--
    Teleport로 <body> 최상단에 렌더링하여
    부모 레이아웃의 overflow/position 등에 구애받지 않게 함
  -->
  <Teleport to="body">
    <!--
      v-if: 열림 상태일 때만 DOM 생성
      role="dialog" + aria-modal="true": 보조기기 접근성 힌트
      @keydown.esc: ESC 눌러 닫기
    -->
    <div
      v-if="modelValue"
      class="overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="logout-title"
      aria-describedby="logout-desc"
      @keydown.esc.prevent.stop="close"
      tabindex="-1"
      ref="overlayEl"
      @click="onBackdrop"
    >
      <!-- 모달 카드 -->
      <div class="modal" @click.stop>
        <!-- 제목 -->
        <h3 id="logout-title" class="title">로그아웃 하시겠습니까?</h3>

        <!-- 부제 설명 -->
        <p id="logout-desc" class="desc">
          로그아웃하면 다시 로그인해야 서비스를 이용할 수 있습니다. 저장되지 않은 정보가 있다면 먼저 저장해주세요.
        </p>

        <!-- 버튼 영역 -->
        <div class="actions">
          <button type="button" class="btn ghost" @click="close" ref="cancelBtn">
            취소
          </button>

          <button type="button" class="btn danger" @click="confirm">
            로그아웃
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
/*
  - 이 모달은 v-model로 열림/닫힘을 제어한다.
  - 확인 버튼 클릭 시 'confirm' 이벤트를 emit하므로,
    부모에서 실제 로그아웃 로직을 실행하면 된다.
*/
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'

/* ===== Props / Emits ===== */
const props = defineProps({
  /* v-model 값: true면 모달 열림 */
  modelValue: { type: Boolean, default: false },
  /* 바깥(배경) 클릭으로 닫을지 여부 */
  closeOnBackdrop: { type: Boolean, default: true },
})
const emit = defineEmits(['update:modelValue', 'confirm'])

/* ===== Refs: 포커스 관리 ===== */
const overlayEl = ref(null)   // 오버레이 컨테이너
const cancelBtn = ref(null)   // '취소' 버튼(초점 기본)

function open() {
  // 오버레이에 포커스를 부여해 ESC 키 입력을 받도록 함
  // 그리고 첫 포커스를 '취소' 버튼으로 이동
  requestAnimationFrame(() => {
    overlayEl.value?.focus()
    cancelBtn.value?.focus()
  })
}

function close() {
  emit('update:modelValue', false)
}

function confirm() {
  // 부모에 'confirm' 알림 → 부모가 실제 로그아웃 수행
  emit('confirm')
  // 닫기
  close()
}

function onBackdrop(e) {
  // 배경 클릭 시 닫기 (모달 카드 영역은 @click.stop으로 이벤트 중단)
  if (!props.closeOnBackdrop) return
//   if (e.target === overlayEl.value) close()
}

/* ===== 열림 상태 감시 → 열리면 포커스 세팅 ===== */
watch(
  () => props.modelValue,
  (v) => {
    if (v) open()
  },
  { immediate: true }
)

/* ===== 페이지 스크롤 잠금 (열릴 때 body 스크롤 방지) ===== */
const originalOverflow = ref('')
onMounted(() => {
  watch(
    () => props.modelValue,
    (v) => {
      if (v) {
        originalOverflow.value = document.body.style.overflow
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = originalOverflow.value || ''
      }
    },
    { immediate: true }
  )
})

onBeforeUnmount(() => {
  // 컴포넌트가 언마운트될 때 원복(예외 상황 대비)
  document.body.style.overflow = originalOverflow.value || ''
})
</script>

<style scoped>
/* === 배경 오버레이 === */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(2, 10, 28, 0.35); /* 살짝 어두운 블러 배경 */
  display: grid;
  place-items: center;                /* 중앙 정렬 */
  z-index: 9999;
  outline: none;                      /* focus outline 제거 */
}

/* === 모달 카드 === */
.modal {
  width: 460px;
  max-width: calc(100vw - 40px);
  border-radius: 14px;
  background: #ffffff;
  padding: 20px 20px 16px 20px;
  box-shadow:
    0 20px 60px rgba(15, 23, 42, 0.18),
    0 2px 8px rgba(15, 23, 42, 0.06);
  border: 1px solid #eef1f6;
}

/* 제목/설명 */
.title {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 800;
  color: #111827;
}
.desc {
  margin: 0 0 16px 0;
  font-size: 13px;
  line-height: 1.6;
  color: #6b7280;
}

/* 버튼 영역 */
.actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 8px;
}

/* 버튼 공통 */
.btn {
  appearance: none;
  border: 1px solid transparent;
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 13px;
  cursor: pointer;
  transition: transform .03s ease, background .2s ease, border-color .2s ease;
}
.btn:active { transform: translateY(1px); }

/* 취소(유리/회색) */
.btn.ghost {
  background: #ffffff;
  color: #374151;
  border-color: #e5e7eb;
}
.btn.ghost:hover {
  border-color: #d1d5db;
}

/* 로그아웃(분홍/위험) */
.btn.danger {
  background: #e34e89;     /* 분홍 레드 */
  color: white;
  border-color: #e34e89;
}
.btn.danger:hover {
  background: #d53b79;
  border-color: #d53b79;
}
</style>
