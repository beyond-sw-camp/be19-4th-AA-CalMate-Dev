import { createRouter, createWebHistory } from 'vue-router';
import personalRoutes from './modules/personal.routes';
import signRoutes from './modules/sign.routes';
import communityRoutes from './modules/community.routes';
import { useUserStore } from '@/stores/user'
import adminRoutes from './modules/admin.routes';

const routes = [
  ...personalRoutes,
  ...signRoutes,
  ...communityRoutes,
  ...adminRoutes,
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});



router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

  if(to.matched.some(record => record.meta.isAdmin)) {
    
    // 로그인 안 되어있거나, 권한이 관리자 아님
    if (!userStore.isLoggedIn || !userStore.roles.includes('ROLE_ADMIN')) {
      alert('관리자만 접근할 수 있습니다.')
      next('/') // 홈으로 리다이렉트
      return
    }
  }

  
  // "/"(root) 경로로 들어왔을 때 로그인 유무에 따라 rooting
  if (to.path === '/') {
    if (userStore.isLoggedIn) {
      console.log('라우팅 확인:', userStore.roles.values)
      // 로그인 O → 홈이나 대시보드 등으로 이동
      if(userStore.roles.includes('ROLE_ADMIN'))
        next({ name: 'admin-dashboard' })
      else
        next({ name: 'main-dashboard' }) 
    } else {
      // 로그인 X → 로그인 페이지로 이동
        next({ name: 'sign-logIn' })
    }
  } else {
    next()
  }
})

export default router;