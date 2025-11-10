<template>
  <!--
    전체 가입 카드
    - 폭은 적당히 줄이고 가운데 정렬
  -->
  <div class="auth-page">
    <section class="card-wrap">
        <!-- 상단 로고/타이틀 영역 -->
        <header class="head">
        <div class="logo">🍽️</div>
        <h1 class="title">회원가입</h1>
        <p class="subtitle">건강한 식단 관리를 시작해보세요</p>
        </header>

        <!-- 실제 폼 -->
        <form class="grid" @submit.prevent="handleSubmit">
        <!-- ===== 1열: 이름 ===== -->
        <div class="field">
            <label class="label">이름 <span class="req">*</span></label>
            <input
            class="input"
            type="text"
            placeholder="홍길동"
            v-model.trim="form.name"
            @blur="validate('name')"
            />
            <p v-if="errors.name" class="error">{{ errors.name }}</p>
        </div>

        <!-- ===== 2열: 이메일 ===== -->
        <div class="field">
            <label class="label">이메일 <span class="req">*</span></label>
            <input
            class="input"
            type="email"
            placeholder="your@email.com"
            v-model.trim="form.email"
            @blur="validate('email')"
            />
            <p v-if="errors.email" class="error">{{ errors.email }}</p>
        </div>

        <!-- ===== 1열: 비밀번호 ===== -->
        <div class="field">
            <label class="label">비밀번호 <span class="req">*</span></label>
            <input
            class="input"
            type="password"
            placeholder="최소 8자 이상"
            v-model="form.password"
            @blur="validate('password')"
            />
            <p v-if="errors.password" class="error">{{ errors.password }}</p>
        </div>

        <!-- ===== 2열: 비밀번호 확인 ===== -->
        <div class="field">
            <label class="label">비밀번호 확인 <span class="req">*</span></label>
            <input
            class="input"
            type="password"
            placeholder="비밀번호 재입력"
            v-model="form.passwordConfirm"
            @blur="validate('passwordConfirm')"
            />
            <p v-if="errors.passwordConfirm" class="error">{{ errors.passwordConfirm }}</p>
        </div>

        <!-- ===== 1열: 전화번호 ===== -->
        <div class="field">
            <label class="label">전화번호 <span class="req">*</span></label>
            <input
            class="input"
            type="tel"
            placeholder="010-1234-5678"
            v-model.trim="form.phone"
            @blur="validate('phone')"
            />
            <p v-if="errors.phone" class="error">{{ errors.phone }}</p>
        </div>

        <!-- ===== 2열: 생년월일 ===== -->
        <div class="field">
            <label class="label">생년월일 <span class="req">*</span></label>
            <input
            class="input"
            type="date"
            v-model="form.birth"
            @blur="validate('birth')"
            />
            <p v-if="errors.birth" class="error">{{ errors.birth }}</p>
        </div>

        <!-- ===== 1열: 성별 ===== -->
        <div class="field">
            <label class="label">성별 <span class="req">*</span></label>
            <select class="input" v-model="form.gender" @blur="validate('gender')">
            <option value="" disabled>선택하세요</option>
            <option value="male">남성</option>
            <option value="female">여성</option>
            <option value="other">기타</option>
            </select>
            <p v-if="errors.gender" class="error">{{ errors.gender }}</p>
        </div>

        <!-- ===== 2열: 키(cm) ===== -->
        <div class="field">
            <label class="label">키(cm) <span class="req">*</span></label>
            <input
            class="input"
            type="number"
            inputmode="decimal"
            placeholder="예: 175"
            v-model.number="form.height"
            @blur="validate('height')"
            min="50"
            max="250"
            step="0.1"
            />
            <p v-if="errors.height" class="error">{{ errors.height }}</p>
        </div>

        <!-- ===== 1열: 몸무게(kg) ===== -->
        <div class="field">
            <label class="label">몸무게(kg) <span class="req">*</span></label>
            <input
            class="input"
            type="number"
            inputmode="decimal"
            placeholder="예: 68"
            v-model.number="form.weight"
            @blur="validate('weight')"
            min="20"
            max="400"
            step="0.1"
            />
            <p v-if="errors.weight" class="error">{{ errors.weight }}</p>
        </div>

        <!-- ===== 2열: 기초대사량(BMR, kcal) ===== -->
        <div class="field">
            <label class="label">
            기초대사량(BMR, kcal) <span class="req">*</span>
            </label>
            <div class="bmr-row">
            <input
                class="input"
                type="number"
                inputmode="numeric"
                placeholder="예: 1674"
                v-model.number="form.bmr"
                @blur="validate('bmr')"
                min="500"
                max="5000"
                step="1"
            />
            <button class="btn ghost" type="button" @click="autoCalcBMR">
                자동 계산
            </button>
            </div>
            <p v-if="errors.bmr" class="error">{{ errors.bmr }}</p>
            <p class="helper">※ 자동 계산은 Mifflin-St Jeor 공식을 사용합니다.</p>
        </div>

        <!-- ===== 전체 폭: 제출 버튼 ===== -->
        <div class="field span-2">
            <button class="btn primary" type="submit">다음 단계</button>
        </div>
        </form>

        <!-- 하단 링크 -->
        <footer class="foot">
        이미 계정이 있으신가요?
        <a href="javascript:void(0)" @click="$emit('toLogin')">로그인</a>
        </footer>
    </section>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

/* ---------------------------
 * 1) 양식 데이터 상태
 * --------------------------- */
const form = reactive({
  name: '',
  email: '',
  password: '',
  passwordConfirm: '',
  phone: '',
  birth: '',
  gender: '',
  height: null, // cm
  weight: null, // kg
  bmr: null     // kcal
})

/* ---------------------------
 * 2) 에러 메시지 상태
 *    (필드명과 동일 키)
 * --------------------------- */
const errors = reactive({
  name: '',
  email: '',
  password: '',
  passwordConfirm: '',
  phone: '',
  birth: '',
  gender: '',
  height: '',
  weight: '',
  bmr: ''
})

/* ---------------------------
 * 3) 유효성 검사 규칙
 *    - 간단/직관적인 규칙으로 구성
 *    - 메시지는 요구사항대로 붉은색으로 표시
 * --------------------------- */
const rules = {
  name(v) {
    if (!v) return '이름을 입력하세요.'
    if (v.length < 2) return '이름은 2자 이상이어야 합니다.'
    return ''
  },
  email(v) {
    if (!v) return '이메일을 입력하세요.'
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
    return ok ? '' : '올바른 이메일 형식이 아닙니다.'
  },
  password(v) {
    if (!v) return '비밀번호를 입력하세요.'
    if (v.length < 8) return '비밀번호는 최소 8자 이상이어야 합니다.'
    return ''
  },
  passwordConfirm(v, all) {
    if (!v) return '비밀번호 확인을 입력하세요.'
    if (v !== all.password) return '비밀번호가 일치하지 않습니다.'
    return ''
  },
  phone(v) {
    if (!v) return '전화번호를 입력하세요.'
    const ok = /^0\d{1,2}-\d{3,4}-\d{4}$/.test(v)
    return ok ? '' : '전화번호 형식(예: 010-1234-5678)이 아닙니다.'
  },
  birth(v) {
    if (!v) return '생년월일을 선택하세요.'
    return ''
  },
  gender(v) {
    if (!v) return '성별을 선택하세요.'
    return ''
  },
  height(v) {
    if (v === null || v === undefined || v === '') return '키를 입력하세요.'
    if (Number(v) < 50 || Number(v) > 250) return '키는 50~250cm 사이여야 합니다.'
    return ''
  },
  weight(v) {
    if (v === null || v === undefined || v === '') return '몸무게를 입력하세요.'
    if (Number(v) < 20 || Number(v) > 400) return '몸무게는 20~400kg 사이여야 합니다.'
    return ''
  },
  bmr(v) {
    if (v === null || v === undefined || v === '') return 'BMR을 입력하거나 자동 계산을 눌러주세요.'
    if (Number(v) < 500 || Number(v) > 5000) return 'BMR은 500~5000kcal 사이여야 합니다.'
    return ''
  }
}

/* ---------------------------
 * 4) 단일 필드 검사
 * --------------------------- */
function validate(key) {
  // 규칙 함수가 있다면 실행 → 해당 에러 메시지 저장
  if (rules[key]) {
    errors[key] = rules[key](form[key], form)
  }
}

/* ---------------------------
 * 5) 전체 폼 검사
 * --------------------------- */
function validateAll() {
  Object.keys(rules).forEach((k) => validate(k))
  // 에러가 하나라도 있으면 false
  return !Object.values(errors).some(Boolean)
}

/* ---------------------------
 * 6) BMR 자동 계산 (Mifflin-St Jeor)
 *    - 성별/키/몸무게/생년월일 필요
 * --------------------------- */
function autoCalcBMR() {
  // 입력값 선검사 (간단 안내)
  const missing = []
  if (!form.gender) missing.push('성별')
  if (!form.height) missing.push('키')
  if (!form.weight) missing.push('몸무게')
  if (!form.birth)  missing.push('생년월일')
  if (missing.length) {
    errors.bmr = `${missing.join(', ')} 입력 후 자동 계산이 가능합니다.`
    return
  }

  // 나이 계산(만 나이)
  const today = new Date()
  const b = new Date(form.birth)
  let age = today.getFullYear() - b.getFullYear()
  const m = today.getMonth() - b.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < b.getDate())) age--

  // Mifflin-St Jeor (cm, kg, years)
  const s = form.gender === 'male' ? 5 : -161
  const bmr = 10 * Number(form.weight) + 6.25 * Number(form.height) - 5 * age + s

  form.bmr = Math.round(bmr)
  errors.bmr = '' // 성공 시 에러 제거
}

/* ---------------------------
 * 7) 제출 핸들러
 * --------------------------- */
function handleSubmit() {
  if (!validateAll()) {
    // 최상단 첫 에러 위치로 스크롤 정도만 해주면 UX↑ (선택)
    const firstErrKey = Object.keys(errors).find((k) => errors[k])
    const firstEl = document.querySelector(`[name="${firstErrKey}"]`)
    if (firstEl) firstEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
    return
  }
  // TODO: 실제 회원가입 API 호출
  // await api.post('/auth/sign-up', form)
  alert('검증 성공! 서버로 전송할 수 있습니다.')
}
</script>

<style scoped>
/* 카드 컨테이너 */
.card-wrap{
  width: 760px;
  max-width: calc(100vw - 32px);
  margin: 24px auto;
  border: 1px solid #eef1f6;
  border-radius: 16px;
  background: #fff;
  box-shadow:
    0 20px 60px rgba(15, 23, 42, 0.08),
    0 2px 8px rgba(15, 23, 42, 0.05);
  padding: 24px 24px 18px;
}

/* 상단 헤더 */
.head{ text-align:center; margin-bottom: 18px; }
.logo{
  width: 44px; height: 44px; border-radius: 12px;
  margin: 0 auto 6px; display:grid; place-items:center;
  background: #0f172a; color: #fff; font-size: 22px;
}
.title{ margin: 0; font-size: 20px; font-weight: 800; }
.subtitle{ margin: 4px 0 0; font-size: 12px; color:#7d8896; }

/* 2열 그리드 폼 */
.grid{
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px 16px;
}
.field{ display: grid; }
.field.span-2{ grid-column: 1 / -1; }

.label{
  font-size: 12px; color:#111827; margin-bottom: 6px;
  font-weight: 700;
}
.req{ color:#ef4444; }

.input{
  appearance:none; width:100%; height: 42px;
  border: 1px solid #e7ebf3;
  background:#f7f8fb;
  border-radius: 10px;
  padding: 0 12px;
  font-size: 14px;
  transition: border-color .2s ease, background .2s ease, box-shadow .2s ease;
}
.input:focus{
  outline:none;
  border-color:#cfd6e3;
  background:#ffffff;
  box-shadow: 0 0 0 3px rgba(92, 107, 192, 0.12);
}

/* BMR 자동 계산 버튼 행 */
.bmr-row{ display:flex; gap:8px; align-items:center; }
.bmr-row .input{ flex:1; }
.btn{
  appearance:none; border:1px solid transparent;
  border-radius: 10px; height: 42px; padding: 0 14px;
  font-size: 14px; cursor:pointer;
  transition: background .2s ease, border-color .2s ease, transform .03s ease;
}
.btn:active{ transform: translateY(1px); }
.btn.primary{
  background:#111827; color:#fff; width:100%;
}
.btn.ghost{
  background:#fff; color:#374151; border-color:#e5e7eb;
}
.btn.ghost:hover{ border-color:#d1d5db; }

.helper{
  margin: 6px 2px 0;
  color:#9aa4b2; font-size: 12px;
}

/* 하단 */
.foot{
  margin-top: 12px; text-align:center; font-size: 13px; color:#6b7280;
}
.foot a{ color:#111827; text-decoration: underline; }
/* ✅ 화면 중앙(가로+세로) 정렬 */
.auth-page{
  min-height: 100vh;          /* 뷰포트 전체 높이 */
  display: grid;              /* 중앙 정렬 */
  place-items: center;        /* 가로/세로 동시에 중앙 */
  padding: 24px 16px;         /* 좌우 여백 */
  background: #f7f8fb;        /* (선택)淡배경 */
}

/* (기존 card-wrap는 그대로 두고 사용) */

/* ✅ 인풋들 겹치지 않게 여백 확대 */
.grid{
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 18px;           /* 좌/우 칸 간격 */
  row-gap: 16px;              /* 위/아래 칸 간격 (↑ 기존보다 살짝 키움) */
}

/* ✅ 라벨/인풋/에러 간 간격 확보 */
.field{
  display: grid;
  gap: 6px;                   /* 라벨 ↔ 인풋, 인풋 ↔ 에러 간격 */
}

/* ✅ 인풋 겹침 방지(박스 계산 안정화) */
.input{
  box-sizing: border-box;
}

/* (선택) 에러가 나타나도 레이아웃 들뜸 최소화 */
.error{
  margin: 4px 2px 0;
  line-height: 1.3;
  color:red;
  font-size: 13px;
}


/* 반응형 */
@media (max-width: 640px){
  .grid{ grid-template-columns: 1fr; }
}
</style>
