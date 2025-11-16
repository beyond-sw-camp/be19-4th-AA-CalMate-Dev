<template>
  <!-- ✅ 반투명 배경(자기 자신 클릭 시 닫힘) -->
  <div v-if="open" class="backdrop" @click.self="handleClose">
    <!-- ✅ 모달 -->
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="pwd-title">
      <h3 id="pwd-title" class="modal__title">비밀번호 변경</h3>

      <!-- 현재 비밀번호 -->
      <div class="field">
        <label class="label" for="curr">현재 비밀번호</label>
        <input
          id="curr"
          class="input"
          type="password"
          v-model="curr"
          @blur="validatePassword()"
          placeholder="현재 비밀번호"
          autocomplete="current-password"
        />
        <!-- 에러가 없어도 높이를 유지 -->
        <p class="msg"><span class="error" v-if="err.current">{{ err.current }}</span></p>
      </div>

      <!-- 새 비밀번호 -->
      <div class="field">
        <label class="label" for="next">새 비밀번호</label>
        <input
          id="next"
          class="input"
          type="password"
          v-model="nextPwd"
          @blur="validate('next')"
          placeholder="최소 6자 이상 권장"
          autocomplete="new-password"
        />
        <p class="msg"><span class="error" v-if="err.next">{{ err.next }}</span></p>
      </div>

      <!-- 새 비밀번호 확인 -->
      <div class="field">
        <label class="label" for="confirm">새 비밀번호 확인</label>
        <input
          id="confirm"
          class="input"
          type="password"
          v-model="confirm"
          @blur="validate('confirm')"
          placeholder="새 비밀번호 재입력"
          autocomplete="new-password"
        />
        <p class="msg"><span class="error" v-if="err.confirm">{{ err.confirm }}</span></p>
      </div>

      <div class="actions">
        <button class="btn ghost" type="button" @click="handleClose">취소</button>
        <button
          class="btn primary"
          type="button"
          :disabled="submitting || !isValidAll"
          @click="handleSubmit"
        >
          변경
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch, onMounted, onBeforeUnmount } from 'vue'
import api from '@/lib/api'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore();

const props = defineProps({
  open: { type: Boolean, default: false }
})
const emit = defineEmits(['update:open', 'submit'])

const curr = ref('')
const nextPwd = ref('')
const confirm = ref('')
const submitting = ref(false)

const err = reactive({
  current: '',
  next: '',
  confirm: ''
})

const pwRegex =
  /.{6,}$/ // 6자 이상, 영문+숫자 1개 이상

async function validatePassword() {
  if (!curr.value) err.current = '최소 6자 이상이어야 합니다.'
  else if (!pwRegex.test(curr.value))
    err.current = '6자리 이상 입력 해 주세요.'
  else if (pwRegex.test(curr.value)) {
      try {
          const response = await api.post('/member/password-info',
            {
                "id"       : userStore.userId,
                "password" : curr.value
            }
          );
          err.current = ''
      } catch(e) {
          console.log(e)
          err.current = '비밀번호가 틀렸습니다.'
      }
  }    
}

function validate(key) {
  if (key === 'next') {
    if (!nextPwd.value) err.next = '새 비밀번호를 입력하세요.'
    else if (nextPwd.value.length < 6) err.next = '최소 6자 이상이어야 합니다.'
    else err.next = ''
    if (confirm.value) validate('confirm')
  } else if (key === 'confirm') {
    if (!confirm.value) err.confirm = '새 비밀번호 확인을 입력하세요.'
    else if (confirm.value !== nextPwd.value) err.confirm = '비밀번호가 일치하지 않습니다.'
    else err.confirm = ''
  }
}

const isValidAll = computed(() => {
  validate('current'); validate('next'); validate('confirm')
  return !err.current && !err.next && !err.confirm
})

function resetAll() {
  curr.value = ''
  nextPwd.value = ''
  confirm.value = ''
  err.current = err.next = err.confirm = ''
}

function handleClose() {
  emit('update:open', false)
  resetAll()
}

async function handleSubmit() {
  if (!isValidAll.value) return
  try {
    submitting.value = true
    emit('submit', { current: curr.value, next: nextPwd.value })
    handleClose()
  } finally {
    submitting.value = false
  }
}

/* ESC 로 닫기 (선택 기능) */
function onKey(e) {
  if (props.open && e.key === 'Escape') handleClose()
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))

watch(() => props.open, (ov) => { if (!ov) resetAll() })
</script>

<style scoped>
.backdrop{ position:fixed; inset:0; background:rgba(15,23,42,.45); display:grid; place-items:center; z-index:1000; }
.modal{ width:420px; max-width:calc(100vw - 32px); background:#fff; border-radius:14px; padding:16px; box-shadow:0 10px 30px rgba(0,0,0,.25); }
.modal__title{ margin:0 0 10px; font-size:16px; font-weight:800; }

.field{ display:grid; gap:6px; margin-top:8px; }
.label{ font-size:12px; font-weight:700; color:#111827; }
.input{
  height:42px; border:1px solid #e7ebf3; background:#f7f8fb; border-radius:10px;
  padding:0 12px; font-size:14px; transition:border-color .2s ease, background .2s ease, box-shadow .2s ease;
}
.input:focus{ outline:none; border-color:#cfd6e3; background:#fff; box-shadow:0 0 0 3px rgba(92,107,192,.12); }

/* 에러 표시 영역 고정 높이 */
.msg{ min-height:18px; line-height:18px; font-size:12px; }
.error{ color:#ef4444; }

.actions{ display:flex; justify-content:flex-end; gap:8px; margin-top:12px; }
.btn{ height:42px; border-radius:10px; padding:0 14px; font-size:14px; border:1px solid transparent; cursor:pointer; transition:background .2s, border-color .2s, transform .03s; }
.btn:active{ transform:translateY(1px); }
.btn.primary{ background:#0f172a; color:#fff; }
.btn.primary:disabled{ background:#94a3b8; cursor:not-allowed; }
.btn.ghost{ background:#fff; border-color:#e5e7eb; color:#374151; }
</style>
