<template>
  <div class="login">
    <div class="card">
      <div class="brand">
        <img class="brand_logo" src="@/assets/images/mainIcon.png" alt="CalMate" />
        <h1 class="brand_title">CalMate</h1>
        <p class="brand_sub">당신만의 식단 메이커 CalMate에 오신 것을 환영합니다.</p>
      </div>

      <form class="form">
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
            />
          </div>
        </label>

        <div class="row_right">
          <button type="button" class="link">비밀번호를 잊으셨나요?</button>
        </div>

        <button type="button" class="btn_primary">
          <img class="btn_icon" src="@/assets/images/login.png" alt="" />
          <span>로그인</span>
        </button>

        <div class="divider"><span>또는</span></div>

        <p class="signup">
          <span class="signup_text">아직 계정이 없으신가요?</span>
          <button type="button" class="link">회원가입</button>
        </p>
      </form>
    </div>
  </div>
</template>

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