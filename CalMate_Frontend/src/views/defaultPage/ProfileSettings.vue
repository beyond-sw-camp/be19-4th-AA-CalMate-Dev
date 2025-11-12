<template>
  <!-- 페이지 컨테이너 -->
  <section class="profile-page">
    <!-- ================== 상단 배너 ================== -->
    <header class="hero">
      <!-- 왼쪽: 아바타 + 기본정보 -->
      <div class="hero__left">
        <!-- 아바타(클릭 시 파일선택) -->
        <button class="avatar" type="button" @click="openFilePicker" aria-label="프로필 이미지 변경">
          <img v-if="avatarUrl" :src="avatarUrl" alt="프로필 이미지" />
          <span v-else>🧑‍🍳</span>
        </button>
        <!-- 숨겨진 파일 입력 -->
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          class="sr-only"
          @change="onSelectAvatar"
        />
        <!-- 이름/메일 -->
        <div class="who">
          <div class="name-row">
            <strong class="name">{{ form.name || '사용자' }}</strong>
            <span class="badge" v-if="form.name">변경</span>
          </div>
          <p class="email">{{ form.email || 'kakao@demo.com' }}</p>
        </div>
      </div>

      <!-- 오른쪽: KPI + 비밀번호 변경 버튼 -->
      <div class="hero__right">
        <div class="kpi">
          <p class="kpi__label">목표</p>
          <p class="kpi__value">체중 감량</p>
        </div>
        <div class="kpi">
          <p class="kpi__label">현재 체중</p>
          <p class="kpi__value">{{ form.weight }} kg</p>
          <!-- <p class="kpi__unit">kg</p> -->
        </div>
        <div class="kpi">
          <p class="kpi__label">목표 칼로리</p>
          <p class="kpi__value">{{ goalKcal }} kcal</p>
          <!-- <p class="kpi__unit">kcal</p> -->
        </div>

        <!-- 비밀번호 변경 버튼(모달) -->
        <button class="btn ghost small" type="button" @click="pwdModalOpen = true">
          🔒 비밀번호 변경
        </button>
      </div>
    </header>

    <!-- ================== 기본 정보 카드 ================== -->
    <section class="card">
      <h2 class="card__title">기본 정보</h2>
      <div class="grid-2">
        <!-- 이름 -->
        <div class="field">
          <label class="label">닉네임</label>
          <input class="input" type="text"  v-model.trim="form.nickname" @blur="v('nickname')" />
          <p class="msg"><span class="error" v-if="errors.nickname">{{ errors.nickname }}</span></p>
        </div>

        <!-- 전화번호 -->
        <div class="field">
          <label class="label">전화번호</label>
          <div class="input with-icon">
            <span class="ico">📞</span>
            <input class="plain" type="tel" placeholder="010-1234-5678" v-model.trim="form.phone" @blur="v('phone')" />
          </div>
          <p class="msg"><span class="error" v-if="errors.phone">{{ errors.phone }}</span></p>
        </div>

        <!-- 생년월일 -->
        <div class="field">
          <label class="label">생년월일</label>
          <div class="input with-icon">
            <span class="ico">📅</span>
            <input disabled class="plain" type="date" v-model="form.birth" @blur="v('birth')" />
          </div>
          <p class="msg"></p>
        </div>

        <!-- 성별 -->
        <div class="field">
            <label class="label">성별</label>
            <input disabled class="input" type="text"  v-model="form.gender" @blur="v('gender')" />
            <p class="msg"><span class="error" v-if="errors.gender">{{ errors.gender }}</span></p>
        </div>

      </div>
    </section>

    <!-- ================== 신체 정보 카드 ================== -->
    <section class="card">
      <h2 class="card__title">신체 정보</h2>
      <div class="grid-2">
        <!-- 키 -->
        <div class="field">
          <label class="label">키 (cm)</label>
          <input class="input" type="number" placeholder="175" v-model.number="form.height" @blur="v('height')" min="50" max="250" step="0.1" />
          <p class="msg"><span class="error" v-if="errors.height">{{ errors.height }}</span></p>
        </div>

        <!-- 체중 -->
        <div class="field">
          <label class="label">체중 (kg)</label>
          <input class="input" type="number" placeholder="75" v-model.number="form.weight" @blur="v('weight')" min="20" max="400" step="0.1" />
          <p class="msg"><span class="error" v-if="errors.weight">{{ errors.weight }}</span></p>
        </div>

        <!-- 활동량 -->
        <div class="field span-2">
          <label class="label">활동량</label>
          <div class="input select">
            <select v-model="form.activity" @blur="v('activity')">
              <option value="">활동량 선택</option>
              <option :value="1.2">거의 활동 없음</option>
              <option :value="1.375">가벼운 활동(주 1~3회)</option>
              <option :value="1.55">보통 활동(주 3~5회)</option>
              <option :value="1.725">높은 활동(주 6~7회)</option>
              <option :value="1.9">매우 높은 활동</option>
            </select>
            <span class="arrow">▾</span>
          </div>
          <p class="msg"><span class="error" v-if="errors.activity">{{ errors.activity }}</span></p>
        </div>

        <!-- 목표 -->
        <div class="field">
          <label class="label">목표</label>
          <div class="input select">
            <select v-model="form.goal">
              <option value="lose">체중 감량</option>
              <option value="keep">체중 유지</option>
              <option value="gain">체중 증량</option>
            </select>
            <span class="arrow">▾</span>
          </div>
          <p class="msg"></p>
        </div>

        <!-- 현재 목표 설명 -->
        <div class="field">
          <label class="label">현재 목표</label>
          <div class="input muted">
            <span class="muted-text">{{ goalLabel }}</span>
          </div>
          <p class="msg"></p>
        </div>

        <!-- BMR -->
        <div class="field span-2">
          <label class="label">기초대사량(BMR, kcal)</label>
          <div class="row">
            <input class="input" type="number" placeholder="예: 1674" v-model.number="form.bmr" @blur="v('bmr')" min="500" max="5000" />
            <button type="button" class="btn ghost" @click="calcBMR">자동 계산</button>
          </div>
          <p class="helper">※ 자동 계산은 Mifflin-St Jeor 공식을 사용합니다. (예시: {{ exampleBmr }} kcal)</p>
          <p class="msg"><span class="error" v-if="errors.bmr">{{ errors.bmr }}</span></p>
        </div>
      </div>

      <!-- 저장 -->
      <div class="save-row">
        <button class="btn primary" :disabled="saving || !validAll" @click="save">
          <span class="btn-ico">💾</span> 저장하기
        </button>
      </div>
    </section>

    
    <!-- ✅ 분리된 모달 컴포넌트 -->
    <PasswordChangeModal
      v-model:open="pwdModalOpen"
      @submit="changePassword"
    />

  </section>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import PasswordChangeModal from '@/components/ProfileSettings.vue'
import { useUserStore } from '@/stores/user'
import api from '@/lib/api';
import { useToast } from '@/lib/toast';

const {success , error, info} = useToast();

const userStore = useUserStore();

/* 비밀번호 변경 모달 */
const pwdModalOpen = ref(false)
async function changePassword({ current, next }){
  // TODO: await api.post('/change-password', { current, next })
  alert(`비밀번호 변경\n현재: ${current}\n새: ${next}`)
}

/* ---------------- 폼 상태 ---------------- */
const form = reactive({
  name: '',
  nickname: '',
  phone: '',
  birth: '',
  gender: '',
  birthYear: 1990,
  height: 175,
  weight: 75,
  activity: 1.55,
  goal: 'lose',
  bmr: null
})

form.name = userStore.name;
form.nickname = userStore.nickname;
form.phone = userStore.phone;
form.birth = userStore.birth;
form.gender = userStore.gender;
form.height = userStore.height;
form.weight = userStore.weight;
form.bmr = userStore.bodyMetric;

/* ------------- 에러(고정 높이 영역에 표시) ------------- */
const errors = reactive({
  nickname: '', phone: '',nickname: '',
  height: '', weight: '', activity: '', bmr: ''
})

/* ------------- 아바타 업로드 ------------- */
const fileInput = ref(null)
const avatarUrl = ref('')   // 미리보기 URL
avatarUrl.value = userStore.profile;
function openFilePicker(){ fileInput.value?.click() }

async function onSelectAvatar(e){
  const input = e.target
  const file = input.files?.[0]
  input.value = '' // 같은 파일 다시 선택 가능하게 초기화

  if (!file) return
  if (!file.type.startsWith('image/')) return alert('이미지 파일만 업로드 가능해요.')
  if (file.size > 5 * 1024 * 1024) return alert('5MB 이하만 업로드 가능합니다.')

  try {
    // uploading.value = true
    const form = new FormData()
    form.append('singleFile', file)

    const res = await api.post(`/member/Profile/${userStore.userId}`,
      form,
      {
      }
    )

    const { httpStatus, result } = res.data ?? {}
    const { responseData } = result ?? {}
    const {
      urlPath,
      successUpload,
      dirPath,
      filePath,
      exceptionMessage,
    } = responseData ?? {}

    console.log('업로드 응답:', { httpStatus, successUpload, urlPath, dirPath, filePath, exceptionMessage })

    if (httpStatus !== 200 || !successUpload || !urlPath) {
      alert('프로필 변경 실패: ' + (exceptionMessage || '알 수 없는 오류'))
      return
    }

    userStore.changeProfile('');
    setTimeout(async() => {
      await userStore.changeProfile(urlPath)
      avatarUrl.value = urlPath;
    },300)
  } catch (err) {
    console.error(err)
    alert('업로드 실패 :' , err)
  } finally {
    // uploading.value = false
  }
}

/* ------------- 검증 규칙 ------------- */
const rules = {
  nickname(v){ if(!v) return '이름을 입력하세요.'; if(v.length<2) return '닉네임은 2자 이상'; return '' },
  phone(v){ if(!v) return '전화번호를 입력하세요.'; return /^0\d{1,2}-\d{3,4}-\d{4}$/.test(v)?'':'형식(010-1234-5678)이 아닙니다.' },
  height(v){ if(v===null||v===undefined||v==='') return '키를 입력하세요.'; const n=+v; return (n<50||n>250)?'키는 50~250cm':'';
  },
  weight(v){ if(v===null||v===undefined||v==='') return '체중을 입력하세요.'; const n=+v; return (n<20||n>400)?'체중은 20~400kg':'' },
  activity(v){ return v? '':'' },
  bmr(v){ if(v===null||v===undefined||v==='') return ''; const n=+v; if(!Number.isFinite(n)) return '숫자만 입력'; return (n<500||n>5000)?'BMR은 500~5000kcal':'' }
}
function v(key){ if(rules[key]) errors[key]=rules[key](form[key]) }

/* ------------- 파생 값 ------------- */
const goalLabel = computed(()=> form.goal==='lose'?'체중 감량': form.goal==='gain'?'체중 증량':'체중 유지')
const exampleBmr = computed(()=>{
  const sexAdj = form.gender==='male'? 5 : -161
  const age = calcAge(form.birth)
  if(!form.height || !form.weight || !age) return '-'
  return Math.round(10*+form.weight + 6.25*+form.height - 5*age + sexAdj)
})
const goalKcal = computed(()=>{
  const base = Number(form.bmr) || Number(exampleBmr.value) || 0
  if(!base || !form.activity) return 0
  const tdee = base * Number(form.activity)
  const adj = form.goal==='lose'?0.85 : form.goal==='gain'?1.10 : 1
  return Math.round(tdee * adj)
})

function calcAge(ymd){
  if(!ymd) return null
  const t=new Date(), b=new Date(ymd)
  if(Number.isNaN(b.getTime())) return null
  let a=t.getFullYear()-b.getFullYear()
  const m=t.getMonth()-b.getMonth()
  if(m<0 || (m===0 && t.getDate()<b.getDate())) a--
  return a
}
function calcBMR(){
  if(!form.gender || !form.height || !form.weight || !form.birth){
    errors.bmr='성별/키/체중/생년월일 입력 후 자동 계산'
    return
  }
  const sexAdj=form.gender==='남자'?5:-161
  console.log(sexAdj);
  const age=calcAge(form.birth); if(!age){ errors.bmr='생년월일을 확인해주세요.'; return }
  form.bmr=Math.round(10*+form.weight + 6.25*+form.height - 5*age + sexAdj)
  errors.bmr=''
}

/* ------------- 저장 ------------- */
let saving=false
const validAll = computed(()=>{
  ['name','phone','birth','gender','height','weight','activity','bmr'].forEach(v)
  return !Object.values(errors).some(Boolean)
})
async function save(){
  if(!validAll.value) return
  try{
    saving=true
    // TODO: await api.post('/profile', { ...form, avatar })
    alert('저장 완료(데모)')
  } finally { saving=false }
}



</script>

<style scoped>
/* 페이지 */
.profile-page{ background:#f7f8fb; padding:24px 18px; display:grid; gap:18px; }

/* 히어로 */
.hero{
  display:flex; justify-content:space-between; align-items:center;
  padding:20px; border-radius:18px;
  background: linear-gradient(90deg, #3b82f6, #06b6d4);
  color:#fff; box-shadow: 0 12px 30px rgba(15,23,42,.15);
}
.hero__left{ display:flex; align-items:center; gap:14px; }

/* 아바타(클릭가능) */
.avatar{
  width:72px; height:72px; border-radius:50%; position:relative;
  background: rgba(255,255,255,.18); display:grid; place-items:center;
  font-size:32px; border:none; cursor:pointer;
  box-shadow: inset 0 0 0 2px rgba(255,255,255,.25);
  overflow:hidden;
}
.avatar img{ width:100%; height:100%; object-fit:cover; display:block; }
.avatar__hint{
  position:absolute; left:50%; bottom:8px; transform:translateX(-50%);
  background: rgba(0,0,0,.35); padding:2px 8px; border-radius:999px; font-size:12px;
  color:#fff;
}
.sr-only{ position:absolute; width:1px; height:1px; margin:-1px; clip:rect(0 0 0 0); overflow:hidden; }

/* 이름/이메일 */
.who .name-row{ display:flex; align-items:center; gap:8px; }
.name{ font-size:18px; font-weight:800; }
.badge{ background: rgba(255,255,255,.2); padding:4px 8px; border-radius:999px; font-size:12px; }

/* KPI + 버튼 */
.hero__right{ display:grid; grid-auto-flow:column; gap:12px; align-items:center; }
.kpi{
  min-width:140px; background: rgba(255,255,255,.16);
  border-radius:14px; padding:12px; text-align:left;
  box-shadow: inset 0 0 0 1px rgba(255,255,255,.22);
}
.kpi__label{ margin:0 0 4px; font-size:12px; opacity:.9; }
.kpi__value{ margin:0; font-size:18px; font-weight:800; line-height:1.1; }
.kpi__unit{ margin:2px 0 0; font-size:12px; opacity:.95; }
.btn.small{ height:34px; padding:0 10px; font-size:13px; }

/* 카드 */
.card{
  background:#fff; border:1px solid #eef1f6; border-radius:16px;
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.06), 0 2px 8px rgba(15,23,42,.05);
  padding:18px 18px 16px;
}
.card__title{ margin:0 0 10px; font-size:16px; font-weight:800; color:#111827; }

/* 폼 레이아웃 */
.grid-2{ display:grid; grid-template-columns: 1fr 1fr; gap:14px 16px; }
.field{ display:grid; gap:6px; }
.field.span-2{ grid-column: 1 / -1; }
.label{ font-size:12px; font-weight:700; color:#111827; }

/* 입력 */
.input{
  height:42px; border:1px solid #e7ebf3; background:#f7f8fb;
  border-radius:10px; padding:0 12px; font-size:14px;
  transition: border-color .2s ease, background .2s ease, box-shadow .2s ease;
  display:flex; align-items:center; gap:8px;
}
.input:focus-within{
  border-color:#cfd6e3; background:#fff;
  box-shadow: 0 0 0 3px rgba(92,107,192,.12);
}
.input.with-icon .plain{ border:none; outline:none; width:100%; background:transparent; font-size:14px; }
.input .ico{ opacity:.66; }
.input.select{ position:relative; padding:0; }
.input.select select{
  appearance:none; border:none; outline:none; background:transparent;
  width:100%; height:100%; padding:0 36px 0 12px; font-size:14px;
}
.input.select .arrow{ position:absolute; right:10px; top:50%; transform:translateY(-50%); opacity:.6; }
.input.muted{ background:#f1f5f9; color:#334155; }
.muted-text{ opacity:.9; padding-left:2px; }

/* 메시지 영역(항상 고정 높이로 공간 확보 -> 레이아웃 흔들림 방지) */
.msg{ min-height:18px; line-height:18px; font-size:12px; }
.error{ color:#ef4444; }

/* 도움 문구/행/버튼 */
.helper{ margin:6px 2px 0; font-size:12px; color:#94a3b8; }
.row{ display:flex; gap:8px; align-items:center; }
.row .input{ flex:1; }
.save-row{ margin-top:10px; display:flex; justify-content:flex-end; }
.btn{
  height:42px; border-radius:10px; padding:0 14px; font-size:14px;
  border:1px solid transparent; cursor:pointer;
  transition: background .2s ease, border-color .2s ease, transform .03s ease;
}
.btn:active{ transform: translateY(1px); }
.btn.primary{ background:#0f172a; color:#fff; }
.btn.primary:disabled{ background:#94a3b8; cursor:not-allowed; }
.btn.ghost{ background:#fff; border-color:#e5e7eb; color:#374151; }
.btn-ico{ margin-right:6px; }

/* 모달 */
.modal-backdrop{
  position:fixed; inset:0; background:rgba(15,23,42,.45);
  display:grid; place-items:center; z-index:50;
}
.modal{
  width:420px; max-width:calc(100vw - 32px);
  background:#fff; border-radius:14px; padding:16px;
  box-shadow: 0 10px 30px rgba(0,0,0,.25);
}
.modal__title{ margin:0 0 10px; font-size:16px; font-weight:800; }
.modal__actions{ display:flex; justify-content:flex-end; gap:8px; margin-top:8px; }

/* 반응형 */
@media (max-width: 1024px){
  .hero{ flex-direction:column; align-items:flex-start; gap:12px; }
  .hero__right{ grid-auto-flow:row; grid-template-columns: 1fr 1fr 1fr; width:100%; }
}
@media (max-width: 720px){
  .grid-2{ grid-template-columns: 1fr; }
  .hero__right{ grid-template-columns: 1fr; }
}
</style>
