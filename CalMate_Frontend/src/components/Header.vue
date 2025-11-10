<template>
  <nav class="sidebar">
    <div class="sidebar-logo">
      <div class="logo-icon-wrap">
        <img :src="mainIcon" alt="칼로리매니저" class="logo-icon" />
      </div>
      <div class="logo-text-wrap">
        <p class="logo-title">CalMate</p>
      </div>
    </div>

    <div class="user-card">
      <div class="user-avatar">
        <img :src="userStore.profile" alt="profile" />
      </div>
      <div class="user-info">
        <p class="user-name">
          {{ userStore.nickname || '사용자' }}
        </p>
        <p class="user-meta">
          {{ userStore.gender || '남성' }}
        </p>
      </div>
    </div>

    <div
      class="nav-container"
      @mouseover="showSubmenu = true"
      @mouseleave="showSubmenu = false"
    >
      <ul class="menu">
        <li
          class="menu-item"
          :class="{ active: isActive('/main/dashboard') }"
        >
          <RouterLink class="menu-link" to="/main/dashboard">
            <img :src="dashBoardIcon" alt="" class="menu-icon" />
            <span>대시보드</span>
          </RouterLink>
        </li>

        <li class="menu-item">
          <RouterLink class="menu-link" to="#">
            <img :src="aiIcon" alt="" class="menu-icon" />
            <span>AI 추천</span>
          </RouterLink>
        </li>

        <li
          class="menu-item"
          :class="{ active: isActive('/main/dietmanagement') }"
        >
          <RouterLink class="menu-link" to="/main/dietmanagement">
            <img :src="dietManagementIcon" alt="" class="menu-icon" />
            <span>식단 관리</span>
          </RouterLink>
        </li>

        <li
          class="menu-item"
          :class="{ active: isActive('/main/exercise') }"
        >
          <RouterLink class="menu-link" to="/main/exerciseRecords">
            <img :src="exerciseRecordsIcon" alt="" class="menu-icon" />
            <span>운동 기록</span>
          </RouterLink>
        </li>

        <li class="menu-item">
          <RouterLink class="menu-link" to="#">
            <img :src="diaryIcon" alt="" class="menu-icon" />
            <span>일기</span>
          </RouterLink>
        </li>

        <li class="menu-item">
          <RouterLink class="menu-link" to="#">
            <img :src="calendarIcon" alt="" class="menu-icon" />
            <span>캘린더</span>
          </RouterLink>
        </li>

        <li
          class="menu-item"
          :class="{ active: isActive('/community/board') }"
        >
          <RouterLink class="menu-link" to="/community/board">
            <img :src="communityIcon" alt="" class="menu-icon" />
            <span>커뮤니티</span>
          </RouterLink>
        </li>

        <li class="menu-item">
          <RouterLink class="menu-link" to="#">
            <img :src="pointIcon" alt="" class="menu-icon" />
            <span>포인트</span>
          </RouterLink>
        </li>

        <li class="menu-item">
          <RouterLink class="menu-link" to="#">
            <img :src="profileIcon" alt="" class="menu-icon" />
            <span>프로필</span>
          </RouterLink>
        </li>
      </ul>
    </div>

    <button class="logout-btn" @click="open = true">
      <img :src="logoutIcon" alt="" class="logout-icon" />
      <span>로그아웃</span>
    </button>

    <MenuExtention
      :showSubmenu="showSubmenu"
      @mouseover="showSubmenu = true"
      @mouseleave="showSubmenu = false"
    />
  </nav>

  
    <!-- v-model로 열기/닫기, confirm에서 실제 로그아웃 실행 -->
  <ModalLogoutConfirm
    v-model="open"
    @confirm="handleLogout"
  />
</template>

<script setup>
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import api from '@/lib/api'


import mainIcon from '../assets/images/mainIcon.png'
import basicProfile from '../assets/images/basicprofile.png'
import dashBoardIcon from '../assets/images/header/dashBoard.png'
import aiIcon from '../assets/images/header/ai.png'
import dietManagementIcon from '../assets/images/header/dietManagement.png'
import exerciseRecordsIcon from '../assets/images/header/exerciseRecords.png'
import diaryIcon from '../assets/images/header/diary.png'
import calendarIcon from '../assets/images/header/calendar.png'
import communityIcon from '../assets/images/header/community.png'
import pointIcon from '../assets/images/header/point.png'
import profileIcon from '../assets/images/header/profile.png'
import logoutIcon from '../assets/images/header/logout.png'
import ModalLogoutConfirm from '@/components/ModalLogoutConfirm.vue'

const userStore = useUserStore()

const open = ref(false)
const showSubmenu = ref(false)

const route = useRoute()
const router = useRouter();
const isActive = (path) => route.path.startsWith(path)


async function handleLogout() {
  // await api.post('/auth/logout')
  userStore.logOut();
  // console.log('로그아웃 실행!')
  await router.push('/sign/signIn')
}

</script>

<style scoped>
.sidebar {
  width: 260px;
  height: 100vh;
  padding: 2px 20px; 
  box-sizing: border-box;
  border-right: 1px solid #f0f0f3;
  background-color: #ffffff;

  display: flex;
  flex-direction: column;
  gap: 20px;
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon-wrap {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background-color: #05020b;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-icon {
  width: 26px;
  height: 26px;
}

.logo-title {
  font-size: 18px;
  font-weight: 700;
  color: #111111;
}

.user-card {
  margin-top: 8px;
  padding: 12px 16px;
  border-radius: 16px;
  border: 1px solid #d1d1d6;
  background-color: #ffffff;

  height: 50px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-avatar img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
}

.user-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left : 1em;
}

.user-name {
  font-size: 15px;
  font-weight: 400;
  color: #111111;
}

.user-meta {
  font-size: 13px;
  color: #8d8d99;
  margin-top: -10px;
}

.nav-container {
  margin-top: 8px;
}

.menu {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.menu-item {
  border-radius: 12px;
}

.menu-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  text-decoration: none;
  border-radius: 12px;
  font-size: 13px;      
  font-weight: 400;     
  color: #1a1a1f;
}

.menu-icon {
  width: 15px;          
  height: 15px;
}

.menu-link:hover {
  background-color: #f2f2f7;
}

.menu-item.active .menu-link {
  background-color: #05020b;
  color: #ffffff;
}

.menu-item.active .menu-icon {
  filter: brightness(0) invert(1);
}

.logout-btn {
  margin-top: auto;
  width: 100%;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid #d1d1d6;
  background-color: #ffffff;

  display: flex;
  align-items: center;
  gap: 10px;

  font-size: 13px;
  font-weight: 400;
  color: #D4183D;

  cursor: pointer;
}

.logout-icon {
  width: 15px;
  height: 15px;
}

.logout-btn:hover {
  background-color: #f2f2f7;
}
</style>