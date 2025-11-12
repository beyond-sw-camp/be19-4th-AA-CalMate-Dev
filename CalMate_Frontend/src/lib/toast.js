// 📁 src/composables/useToast.js
// ─────────────────────────────────────────────────────────────────────────────
// 이 훅은 전역 토스트 상태를 관리합니다.
// • 최소 표시시간(minVisibleMs)을 강제해서 "깜빡" 나타났다 사라지는 현상을 방지
// • hover 시 일시정지/재개(pause/resume) 지원
// • 각 토스트별 타이머를 안전하게 관리(Map)
// 모든 줄에 상세 주석을 달았습니다.
// ─────────────────────────────────────────────────────────────────────────────

import { reactive } from 'vue'                                  // Vue의 반응형 상태 생성을 위해 import

// 전역 상태: 모든 토스트를 담는 배열
const state = reactive({
  toasts: [],                                                   // 화면에 렌더링할 토스트 목록
})

// 각 토스트의 setTimeout 핸들러/남은시간 등을 저장할 맵 (렌더링과 분리된 내부 관리용)
const timers = new Map()                                        // key: toast.id, value: { timeoutId, remaining, startedAt, paused }

// 고유 ID 발급용 카운터
let idCounter = 0                                                // 각 토스트에 부여할 증가형 ID

// “너무 빨리 사라지는” 것을 막기 위한 최소 표시시간(밀리초)
const MIN_VISIBLE_MS = 1400                                      // 사용자가 500ms 같은 짧은 duration을 줘도 최소 1.4초는 보이게

export function useToast() {
  // 내부 유틸: 타이머 시작
  function startTimer(id) {
    const t = timers.get(id)                                     // 이 토스트의 타이머 정보 조회
    if (!t) return                                               // 이미 삭제되었거나 없는 경우 방어

    // 이미 타이머가 있다면 제거(중복 방지). resume 시 새로 걸기 위해 필요
    if (t.timeoutId) {
      clearTimeout(t.timeoutId)                                  // 기존 타임아웃 제거
      t.timeoutId = null                                         // 레퍼런스 정리
    }

    // 타이머 시작 시각 기록(남은 시간 계산에 필요)
    t.startedAt = Date.now()                                     // 타이머 시작(또는 재개) 시각

    // 남은 시간 후 자동 dismiss 실행
    t.timeoutId = setTimeout(() => {                             // 남은 시간(remaining)만큼 후
      dismiss(id)                                                // 토스트 제거
    }, t.remaining)                                              // 현재 남은 시간 기준으로 타이머 설정
  }

  // 내부 유틸: 타이머 정지(hover 시)
  function stopTimer(id) {
    const t = timers.get(id)                                     // 타이머 정보 조회
    if (!t || t.paused) return                                   // 없거나 이미 일시정지면 무시

    if (t.timeoutId) {                                           // 동작 중인 타임아웃이 있다면
      clearTimeout(t.timeoutId)                                  // 타임아웃 제거
      t.timeoutId = null                                         // 레퍼런스 정리
    }

    // 일시정지 시점 기준으로 남은 시간을 재계산
    const elapsed = Date.now() - t.startedAt                     // 마지막 시작 이후 흐른 시간
    t.remaining = Math.max(0, t.remaining - elapsed)             // 남은 시간에서 경과 시간을 뺌(0 미만 방지)
    t.paused = true                                              // 상태 표시: 일시정지됨
  }

  // 내부 유틸: 타이머 재개(hover 해제 시)
  function resumeTimer(id) {
    const t = timers.get(id)                                     // 타이머 정보 조회
    if (!t || !t.paused) return                                  // 없거나 일시정지 상태가 아니면 무시

    t.paused = false                                             // 상태 표시: 일시정지 해제
    startTimer(id)                                               // 남은 시간 기준으로 다시 타이머 가동
  }

  // 토스트 추가(공통 엔트리)
  function pushToast(type, message, options = {}) {
    const id = idCounter++                                       // 고유 ID 발급

    // 사용자가 지정한 전체 표시 시간(없으면 3000ms). 단, 0이면 "수동으로만 닫힘" 의미(고정)
    const userDuration = options.duration ?? 3000                // 기본 3초 → 깜빡임 방지 + 충분히 읽을 시간
    const isSticky = userDuration === 0                          // 0은 자동 닫힘 없음(고정)

    // 최소 표시 시간 강제(단, sticky는 예외)
    const finalDuration = isSticky ? 0 : Math.max(userDuration, MIN_VISIBLE_MS)

    const toast = {                                              // 실제로 렌더링에 쓰일 토스트 객체
      id,                                                        // 고유 ID
      type,                                                      // 'success' | 'error' | 'info' 등
      message,                                                   // 메인 메시지(제목 느낌)
      description: options.description ?? '',                    // 부가 설명(옵션)
      duration: finalDuration,                                   // 최종 표시 시간(최소 보장 적용)
    }

    state.toasts.push(toast)                                     // 화면에 표시될 배열에 추가

    // 자동 닫힘이 필요한 경우에만 타이머 세팅
    if (finalDuration > 0) {
      timers.set(id, {                                           // 이 토스트의 타이머 데이터 초기화
        timeoutId: null,                                         // setTimeout 핸들 저장
        remaining: finalDuration,                                // 남은 시간(ms) — 초기엔 duration 전체
        startedAt: Date.now(),                                   // 타이머 시작 시각
        paused: false,                                           // 현재 일시정지 여부
      })
      startTimer(id)                                             // 타이머 가동
    }

    return id                                                    // 외부에서 필요 시 id 보관 후, 수동 dismiss 가능
  }

  // 외부 노출: 수동 닫기
  function dismiss(id) {
    // 상태 배열에서 제거
    const index = state.toasts.findIndex((t) => t.id === id)     // 해당 id의 인덱스 찾기
    if (index !== -1) {
      state.toasts.splice(index, 1)                              // 배열에서 제거(화면에서 사라짐)
    }

    // 타이머 정리
    const t = timers.get(id)                                     // 내부 타이머 정보
    if (t?.timeoutId) {                                          // 동작 중인 타이머가 있다면
      clearTimeout(t.timeoutId)                                  // 타이머 제거
    }
    timers.delete(id)                                            // 맵에서 정리(메모리 누수 방지)
  }

  // 외부 노출: hover 시 일시정지
  function pause(id) {
    stopTimer(id)                                                // 내부 stopTimer 호출
  }

  // 외부 노출: hover 해제 시 재개
  function resume(id) {
    resumeTimer(id)                                              // 내부 resumeTimer 호출
  }

  // 사용 편의용 숏컷
  return {
    // 성공/에러/정보 토스트
    success(message, options) { return pushToast('success', message, options) },
    error(message, options)   { return pushToast('error',   message, options) },
    info(message, options)    { return pushToast('info',    message, options) },

    // 제어 API
    dismiss,                                                      // 수동 닫기
    pause,                                                        // 일시정지
    resume,                                                       // 재개
  }
}

// 읽기 전용 상태 노출(컨테이너에서 렌더링용)
export function useToastState() {
  return state                                                   // { toasts: [...] }
}
