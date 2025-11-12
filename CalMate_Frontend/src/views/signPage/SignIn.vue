<template>
  <div class="login">
    <div class="card">
      <div class="brand">
        <img class="brand_logo" src="@/assets/images/mainIcon.png" alt="CalMate" />
        <h1 class="brand_title">CalMate</h1>
        <p class="brand_sub">당신만의 식단 메이커 CalMate에 오신 것을 환영합니다.</p>
      </div>

      <form class="form" @submit.prevent="signIn">
        <label class="field">
          <span class="field_label">이메일</span>
          <div class="field_ctrl">
            <img class="field_icon" src="@/assets/images/email.png" alt="email" />
            <input
              type="email"
              class="field_input"
              placeholder="CalMate@email.com"
              autocomplete="email"
              required
              v-model= "email"
            />
          </div>
        </label>

        <label class="field">
          <span class="field_label">비밀번호</span>
          <div class="field_ctrl">
            <img class="field_icon" src="@/assets/images/password.png" alt="password" />
            <input
              type="password"
              class="field_input"
              placeholder="••••••••"
              autocomplete="current-password"
              required
              v-model="pwd"
            />
          </div>
        </label>

        <div class="row_right">
          <button type="button" class="link">비밀번호를 잊으셨나요?</button>
        </div>

        
          <button class="btn_primary"  >
            <img class="btn_icon" src="@/assets/images/login.png" alt="" />
            <span>로그인</span>
          </button>

        <div class="divider"><span>또는</span></div>

        <p class="signup">
          <span class="signup_text">아직 계정이 없으신가요?</span>
          <button type="button" class="link" @click="onClick">회원가입</button>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { useRouter,RouterLink  } from 'vue-router';
import { ref, reactive } from 'vue';
import { useUserStore } from '@/stores/user';
import api from '@/lib/api';

const userStore = useUserStore();
const router = useRouter();
const email = ref('jangyoungsil@gmail.com');
const pwd = ref('pw1234!');

async function signIn() {
  try{


    // 로그인 할때 고유 아이디 세션 스토리지에 저장
    let deviceFp = localStorage.getItem('device_fp');
    if (!deviceFp) {
      deviceFp = crypto.randomUUID();
      sessionStorage.setItem('device_fp', deviceFp);
    }

    const response = 
      await api.post('/login',
      // await api.post('/member/login',                   //@@@@@@@@@@ 해당부분 잠시 수정함@@@@@@
              {
                  email: email.value,
                  pwd: pwd.value
              },
              {
                  headers: { 'Content-Type': 'application/json',
                    "X-Device-Fp" : deviceFp
                   }
              });

    // console.log('테스트1123123:::::', sessionStorage.getItem('device_fp'));
    const token = response.headers['token']; 
    console.log('token:\n',token);
    console.log('data:\n',response.data);
    
    const { httpStatus, message,  result } = response.data;
    
    result.user.profilePath = api.defaults.baseURL + result.user.profilePath;

    console.log('result.user.profile::::',result.user.profile);

    console.log('user:\n',result.user);
    userStore.setToken(token);
    userStore.logIn(result.user);

    
    if(result.user.authorities.some(x => x === 'ROLE_ADMIN')){
        router.push("/admin/main-dashboard");
    } else {
        router.push("/main/dashboard");
    }
  }
  catch (error)
  {
      // 에러 처리
      if (error.response) {
          console.error('❌ 서버 오류 코드:', error.response.status);
          console.error('❌ 오류 내용:', error.response.data);
          const errorMessage = error.response.status >= 500 ? 
          '서버 이상' : error.response.data.message;
          openModal(errorMessage,'로그인 실패', true);
          console.log('asdasd\n',errorMessage);
      } else if (error.request) {
          // 요청은 갔지만 응답이 없을 때 (네트워크 문제 등)
          console.error('❌ 응답 없음:', error.request);
      } else {
          // 기타 오류
          console.error('❌ 요청 설정 중 오류:', error.message);
      }
  }
}

const onClick = () => {
  router.push('/sign/signUp');
}

</script>


<style scoped>
* { box-sizing: border-box; }

.login{
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 40px;
  background: linear-gradient(120deg,#EFF6FF 0%,#FAF5FF 50%,#FDF2F8 100%);
}

.card{
  width: 520px;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(16,24,40,.12);
  padding: 40px 44px;
  overflow: hidden;
}

.brand{ 
  text-align: center; 
  margin-bottom: 28px; 
}
.brand_logo{ 
  width: 56px; 
  height: 56px; 
  border-radius: 14px; 
  margin-bottom: 14px; 
}
.brand_title{ 
  margin: 0; 
  font-size: 28px; 
  font-weight: 700; 
  color: #0D0C11; 
}
.brand_sub{ 
  margin-top: 8px; 
  font-size: 14px; 
  color: #6B7280; 
}

.form{ 
  display: grid; 
  gap: 18px; 
}
.field{ 
  display: grid; 
  gap: 10px; 
}
.field_label{ 
  font-size: 13px; 
  color: #0D0C11; 
}

.field_ctrl{ position: relative; }
.field_icon{
  position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
  width: 16px; height: 16px; opacity: 0.8;
}
.field_input{
  width: 100%;
  height: 40px;
  padding: 8px 12px 8px 38px;
  border: 1px solid #E5E7EB;
  border-radius: 10px;
  background: #F1F5FE;
  font-size: 14px;
  color: #101828;
  outline: none;
}
.field_input::placeholder{ color: #A8AFB9; }
.field_input:focus{ border-color: #CBD5E1; background: #fff; }

.row_right{ 
  display: flex; 
  justify-content: flex-end; 
  margin-top: -2px; }
.link{
  background: none; border: 0; padding: 0; cursor: pointer;
  color: #101828; font-weight: 600; font-size: 13px;
}

.btn_primary{
  width: 100%; height: 44px; border: 0; border-radius: 12px; cursor: pointer;
  display: inline-flex; align-items: center; justify-content: center; gap: 10px;
  background: #0B0B0B; color: #fff;
}
.btn_icon{ width: 16px; height: 16px; filter: invert(1); }

.divider{
  display: flex; align-items: center; gap: 12px;
  margin: 12px 0 -2px; color: #98A2B3; font-size: 12px;
}
.divider::before,.divider::after{
  content: ""; flex: 1 1 0; height: 1px; background: #E5E7EB;
}

.signup{
  display:flex;
  justify-content:center;
  align-items:center;
  gap:8px;           
  color:#C4C4CB;
  font-size:14px;
  margin-top:8px;
}


.signup_text{
  color:#C4C4CB;      
  font-weight:400;      
}

</style>