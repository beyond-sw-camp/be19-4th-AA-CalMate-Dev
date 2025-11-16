<!-- 📁 src/components/common/ToastContainer.vue -->
<template>
  <!--
    TransitionGroup으로 각 항목의 enter/leave/move를 자연스럽게 처리합니다.
    리스트가 줄어들 때 아래 토스트들이 "툭" 하고 점프하지 않고
    살짝 미끄러지듯 이동하도록 .toast-move를 사용합니다(FLIP).
  -->
  <TransitionGroup name="toast" tag="div" class="toast-container">
    <!--
      각 토스트 카드
      - 마우스 올리면 일시정지(hover → pause)
      - 마우스가 떠나면 재개(leave → resume)
    -->
    <div
      v-for="(toast, i) in toasts"
      :key="toast.id"
      class="toast"
      :class="toast.type"
      role="status"
      aria-live="polite"
      @mouseenter="pause(toast.id)"
      @mouseleave="resume(toast.id)"
    >
      <!-- 제목 -->
      <strong class="title">{{ toast.message }}</strong>

      <!-- 설명(옵션) -->
      <p v-if="toast.description" class="desc">{{ toast.description }}</p>

      <!-- 진행바: duration이 0이 아닌 경우에만 렌더 -->
      <div
        v-if="toast.duration > 0"
        class="progress"
        :style="progressStyle(toast)"
      />
    </div>
  </TransitionGroup>
</template>

<script setup>
// 전역 상태에서 toasts를 읽어 렌더링하고,
// hover 시 일시정지/재개를 위해 useToast의 API를 사용합니다.
import { useToastState } from '@/lib/toast.js'   // 상태(배열)
import { useToast }      from '@/lib/toast.js'   // 제어 API(pause/resume/dismiss)

const { toasts }       = useToastState()                    // 렌더링 대상
const { pause, resume } = useToast()                        // hover 제어

// 진행바 스타일: CSS 애니메이션으로 duration에 맞춰 줄어드는 바를 구현
// • animation-duration을 각 토스트 duration에 동기화
// • .toast:hover 에서 animation-play-state: paused 처리로 “시각적” 일시정지도 동기화
function progressStyle(toast) {
  return {
    // duration(ms) → CSS 초(s)로 변환
    animationDuration: `${toast.duration}ms`,
  }
}
</script>

<style scoped>
/* ───────────────────────────────── 위치/레이아웃 ───────────────────────────── */
.toast-container {
  position: fixed;
  top: 24px;                  /* 상단 고정(아래에서 위로 쌓고 싶으면 bottom:24px로 바꾸고 enter/leave Y값 반대로) */
  right: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 9999;
  pointer-events: none;       /* 컨테이너는 클릭 막고, 각 토스트가 pointer-events: auto */
}

/* ───────────────────────────────── 토스트 카드 ─────────────────────────────── */
.toast {
  pointer-events: auto;       /* 개별 카드 클릭 허용 */
  min-width: 240px;
  max-width: 380px;
  padding: 12px 16px 16px;    /* 아래에 진행바 공간 살짝 확보 */
  border-radius: 10px;
  color: #fff;
  box-shadow: 0 8px 24px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08);
  will-change: transform, opacity;
  position: relative;         /* 진행바 포지셔닝용 */
}

.toast.success { background: #16a34a; } /* 초록 */
.toast.error   { background: #dc2626; } /* 빨강 */
.toast.info    { background: #2563eb; } /* 파랑 */

.title { font-weight: 700; font-size: 14px; margin: 0; }
.desc  { font-size: 12px; margin: 6px 0 0; opacity: 0.95; line-height: 1.45; }

/* ───────────────────────────────── 진행바(자동 닫힘 시) ───────────────────── */
.progress {
  position: absolute;
  left: 8px;
  right: 8px;
  bottom: 8px;
  height: 3px;
  border-radius: 2px;
  background: rgba(255,255,255,0.7);     /* 트랙(뒷배경) 대신, 채워지는 바만 두고 싶으면 별도 엘리먼트 분리 */
  transform-origin: left center;
  /* width를 100% → 0%로 줄이는 키프레임 적용 */
  animation-name: shrink;
  animation-timing-function: linear;
  animation-fill-mode: forwards;         /* 애니메이션 끝난 뒤 상태 유지(=0%) */
}

/* hover 시 시각적으로도 진행바 일시정지 */
.toast:hover .progress {
  /* animation-play-state: paused; */
}

/* 진행바 애니메이션: 왼쪽에서 오른쪽 방향으로 줄어드는 느낌 */
@keyframes shrink {
  from { transform: scaleX(1); }
  to   { transform: scaleX(0); }
}

/* ───────────────────────────────── 트랜지션(부드러운 등장/퇴장/이동) ────────── */
/* 등장: 위에서 살짝 내려오며 나타나기(깜빡임 방지 위해 시간 충분히 부여) */
.toast-enter-from {
  opacity: 0;
  transform: translateY(-14px);            /* 살짝 위에서 */
}
.toast-enter-to {
  opacity: 1;
  transform: translateY(0);
}
.toast-enter-active {
  transition:
    transform 300ms cubic-bezier(0.22, 1, 0.36, 1),
    opacity   280ms ease-out;
}

/* 퇴장: 위로 살짝 올라가며 사라지기(지나치게 빠르지 않도록) */
.toast-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
.toast-leave-active {
  position: absolute;                       /* 레이아웃 점프 최소화 */
  transition:
    transform 240ms ease-in,
    opacity   220ms ease-in;
}

/* 재배치: 리스트 압축 시 자연스럽게 미끄러지듯 이동 */
.toast-move {
  transition: transform 260ms cubic-bezier(0.2, 0.8, 0.2, 1);
}
</style>
