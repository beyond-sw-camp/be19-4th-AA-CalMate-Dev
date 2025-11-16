<template>
  <!-- 화면 중앙 정렬 -->
  <div class="auth-page">
    <section class="card-wrap">
      <!-- 상단 로고/타이틀 -->
      <header class="head">
        <div class="logo">🍽️</div>
        <h1 class="title">회원가입</h1>
        <p class="subtitle">건강한 식단 관리를 시작해보세요</p>
      </header>

      <!-- 2열 폼 -->
      <form class="grid" @submit.prevent="handleSubmit">
        <!-- 이름 -->
        <div class="field">
          <label class="label">이름 <span class="req">*</span></label>
          <input
            class="input"
            name="name"
            type="text"
            placeholder="홍길동"
            v-model.trim="form.name"
            @blur="validate('name')"
          />
          <p  class="error">{{ errors.name || ''}}</p>
        </div>

        <!-- 닉네임 -->
        <div class="field">
          <label class="label">닉네임 </label>
          <input
            class="input"
            name="nickname"
            type="text"
            placeholder="먹보"
            v-model.trim="form.nickname"
          />
          <p  class="error">{{''}}</p>
        </div>

        <!-- 이메일 -->
        <div class="field">
          <label class="label">이메일 <span class="req">*</span></label>
          <input
            class="input"
            name="email"
            type="email"
            placeholder="your@email.com"
            v-model.trim="form.email"
            @blur="validate('email')"
            autocomplete="email"
          />
          <p  class="error">{{ errors.email || '' }}</p>
        </div>

        <!-- 비밀번호 -->
        <div class="field">
          <label class="label">비밀번호 <span class="req">*</span></label>
          <input
            class="input"
            name="password"
            type="password"
            placeholder="최소 6자 이상"
            v-model="form.password"
            @blur="validate('password')"
            autocomplete="new-password"
          />
          <p  class="error">{{ errors.password || '' }}</p>
        </div>

        <!-- 비밀번호 확인 -->
        <div class="field">
          <label class="label">비밀번호 확인 <span class="req">*</span></label>
          <input
            class="input"
            name="passwordConfirm"
            type="password"
            placeholder="비밀번호 재입력"
            v-model="form.passwordConfirm"
            @blur="validate('passwordConfirm')"
            autocomplete="new-password"
          />
          <p class="error">{{ errors.passwordConfirm || '' }}</p>
        </div>

        <!-- 전화번호 -->
        <div class="field">
          <label class="label">전화번호 <span class="req">*</span></label>
          <input
            class="input"
            name="phone"
            type="tel"
            placeholder="010-1234-5678"
            v-model.trim="form.phone"
            @blur="validate('phone')"
            autocomplete="tel"
          />
          <p class="error">{{ errors.phone || '' }}</p>
        </div>

        <!-- 생년월일 -->
        <div class="field">
          <label class="label">생년월일 <span class="req">*</span></label>
          <input
            class="input"
            name="birth"
            type="date"
            v-model="form.birth"
            @blur="validate('birth')"
          />
          <p  class="error">{{ errors.birth || '' }}</p>
        </div>

        <!-- 성별 -->
        <div class="field">
          <label class="label">성별 <span class="req">*</span></label>
          <select
            class="input"
            name="gender"
            v-model="form.gender"
            @blur="validate('gender')"
          >
            <option value="" disabled>선택하세요</option>
            <option value="M">남성</option>
            <option value="F">여성</option>
          </select>
          <p  class="error">{{ errors.gender  || ''}}</p>
        </div>

        <!-- 키 -->
        <div class="field">
          <label class="label">키(cm) <span class="req">*</span></label>
          <input
            class="input"
            name="height"
            type="number"
            inputmode="decimal"
            placeholder="예: 175"
            v-model.number="form.height"
            @blur="validate('height')"
            min="50" max="250" step="0.1"
          />
          <p  class="error">{{ errors.height || '' }}</p>
        </div>

        <!-- 몸무게 -->
        <div class="field">
          <label class="label">몸무게(kg) <span class="req">*</span></label>
          <input
            class="input"
            name="weight"
            type="number"
            inputmode="decimal"
            placeholder="예: 68"
            v-model.number="form.weight"
            @blur="validate('weight')"
            min="20" max="400" step="0.1"
          />
          <p  class="error">{{ errors.weight || '' }}</p>
        </div>

        <!-- BMR -->
        <div class="field">
          <label class="label">기초대사량(BMR, kcal) <span class="req">*</span></label>
          <div class="bmr-row">
            <input
              class="input"
              name="bmr"
              type="number"
              inputmode="numeric"
              placeholder="예: 1674"
              v-model.number="form.bmr"
              @blur="validate('bmr')"
              min="500" max="5000" step="1"
            />
            <button class="btn ghost" type="button" @click="autoCalcBMR">
              자동 계산
            </button>
          </div>
          <p class="error">{{ errors.bmr || '' }}</p>
          <p class="helper">※ 자동 계산은 Mifflin-St Jeor 공식을 사용합니다.</p>
        </div>

        <!-- 제출 -->
        <div class="field span-2">
          <button class="btn primary" type="submit" :disabled="submitting">
            다음 단계
          </button>
        </div>
      </form>

      <!-- 하단 링크 -->
      <footer class="foot">
        이미 계정이 있으신가요?
        <RouterLink to="/sign/signIn">로그인</RouterLink>
        <!-- <a href="javascript:void(0)" @click="$emit('toLogin')">로그인</a> -->
      </footer>
    </section>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import api from '@/lib/api'
import { RouterLink, useRouter } from 'vue-router'

const router = useRouter();

/* ---------------------------
 * 1) 폼 상태
 * --------------------------- */
// const form = reactive({
//   name: '강형규10',
//   nickname: '',
//   email: 'k10@gmail.com',
//   password: 'pw1234!',
//   passwordConfirm: 'pw1234!',
//   phone: '010-0000-0000',
//   birth: '1992-04-12',
//   gender: 'M',
//   height: 183,
//   weight: 90,
//   bmr: 2000
// })
const form = reactive({
  name: '',
  nickname: '',
  email: '',
  password: '',
  passwordConfirm: '',
  phone: '',
  birth: '',
  gender: '',
  height: 0,
  weight: 0,
  bmr: 0
})

/* ---------------------------
 * 2) 에러 상태 (필드명과 동일 키)
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
 * 3) 검증 규칙
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
  password(v,all) {
    if (!v) return '비밀번호를 입력하세요.'
    if (v.length < 6) return '비밀번호는 최소 6자 이상이어야 합니다.'
    if (all.passwordConfirm.length > 0 ) 
      errors.passwordConfirm = rules.passwordConfirm(all.passwordConfirm,all);
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
    // 미래 날짜 방지
    const d = new Date(v)
    const today = new Date()
    if (Number.isNaN(d.getTime())) return '날짜 형식이 올바르지 않습니다.'
    if (d > today) return '생년월일은 오늘 이전이어야 합니다.'
    return ''
  },
  gender(v) {
    if (!v) return '성별을 선택하세요.'
    return ''
  },
  height(v) {
    if (v === null || v === '' || v === undefined) return '키를 입력하세요.'
    if (Number(v) < 50 || Number(v) > 250) return '키는 50~250cm 사이여야 합니다.'
    return ''
  },
  weight(v) {
    if (v === null || v === '' || v === undefined) return '몸무게를 입력하세요.'
    if (Number(v) < 20 || Number(v) > 400) return '몸무게는 20~400kg 사이여야 합니다.'
    return ''
  },
  bmr(v) {
    if (v === null || v === '' || v === undefined) return 'BMR을 입력하거나 자동 계산을 눌러주세요.'
    if (Number(v) < 500 || Number(v) > 5000) return 'BMR은 500~5000kcal 사이여야 합니다.'
    return ''
  }
}

/* ---------------------------
 * 4) 단일 필드 검사
 * --------------------------- */
function validate(key) {
  if (rules[key]) {
    errors[key] = rules[key](form[key], form)
  }
}

/* ---------------------------
 * 5) 전체 검사
 * --------------------------- */
function validateAll() {
  Object.keys(rules).forEach((k) => validate(k))
  return !Object.values(errors).some(Boolean)
}

/* ---------------------------
 * 6) BMR 자동계산 (Mifflin-St Jeor)
 * --------------------------- */
function autoCalcBMR() {
  const missing = []
  if (!form.gender) missing.push('성별')
  if (!form.height) missing.push('키')
  if (!form.weight) missing.push('몸무게')
  if (!form.birth)  missing.push('생년월일')
  if (missing.length) {
    errors.bmr = `${missing.join(', ')} 입력 후 자동 계산이 가능합니다.`
    return
  }

  const today = new Date()
  const b = new Date(form.birth)
  let age = today.getFullYear() - b.getFullYear()
  const m = today.getMonth() - b.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < b.getDate())) age--

  // 남성 +5, 여성 -161 (기타는 여성 기준으로 처리)
  const sexAdj = form.gender === 'm' ? 5 : -161
  const bmr = 10 * Number(form.weight) + 6.25 * Number(form.height) - 5 * age + sexAdj
  form.bmr = Math.round(bmr)
  errors.bmr = ''
}

/* ---------------------------
 * 7) 제출
 * --------------------------- */
let submitting = false
async function handleSubmit() {
try{
    submitting = true
    const response = 
      await api.post('/member/member',
      {
          email       : form.email,
          name        : form.name,
          nickname    : form.nickname,
          pw          : form.password,
          phone       : form.phone,
          birth       : form.birth,
          gender      : form.gender,
          height      : form.height,
          weight      : form.weight,
          bodyMetric  : form.bmr 

      },
      {
          headers: { 'Content-Type': 'application/json' }
      })

    console.log('data:\n',response.data);
    
    // const { httpStatus, message,  result } = response.data;
    
    // console.log('user:\n',result.user);
    // userStore.setToken(token);
    // userStore.logIn(result.user);

    
    alert('회원 가입 완료');
    router.push("/sign/signIn");

    // if(result.user.authorities.some(x => x === 'ROLE_ADMIN')){
    //     router.push("/main/dashboard");
    // } else {
    //     router.push("/main/dashboard");
    // }
    // openModal('회원 가입이 완료 되었습니다.','회원 가입', false ,true);
  }
  catch (error)
  {
    console.log(error);
    alert(error.response?.data.message);
    // openModal(e.response.data.message,'회원 가입 실패', true);
  }
  finally {
    submitting = false;
  }






}
</script>

<style scoped>
/* --- 네가 준 CSS를 그대로 유지 --- */

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
  box-sizing: border-box; /* 겹침 방지 */
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

/* 화면 중앙 정렬 */
.auth-page{
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px 16px;
  background: #f7f8fb;
}

/* 에러 문구 */
.error{
  margin: 4px 2px 0;
  line-height: 1.3;
  color:red;
  font-size: 13px;
  width : 15em;
  height: 1.5em;
  
}

/* 반응형 */
@media (max-width: 640px){
  .grid{ grid-template-columns: 1fr; }
}
</style>
