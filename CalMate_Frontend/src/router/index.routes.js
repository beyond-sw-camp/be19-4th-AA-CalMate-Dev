import { createRouter, createWebHistory } from 'vue-router';
import dashBoardRoutes from './modules/dashBoard.routes';
import signRoutes from './modules/sign.routes';
import communityRoutes from './modules/community.routes';

const routes = [
  ...dashBoardRoutes,
  ...signRoutes,
  ...communityRoutes,
//   {
//     path: '/main',
//     component: () => import('@/views/layout/DefaultLayout.vue'),
//     children: [
//       {
//         path: 'diary',
//         name: 'diary',
//         component: () => import('@/views/diary/Diary.vue'),
//       },
//     ],
//   },
//   { path: '/', redirect: '/main/diary' },
// ];

//   {
//     path: '/main',
//     component: () => import('@/views/layout/DefaultLayout.vue'),
//     children: [
//       {
//         path: 'calender',
//         name: 'calender',
//         component: () => import('@/views/calender/Calender.vue'),
//       },
//     ],
//   },
//   { path: '/', redirect: '/main/calender' },
// ];


  {
    path: '/main',
    component: () => import('@/views/layout/DefaultLayout.vue'),
    children: [
      {
        path: 'qna',
        name: 'qna-list',
        component: () => import('@/views/qna/QnaList.vue'),
      },
      {
        path: 'qna/new',
        name: 'qna-new',
        component: () => import('@/views/qna/Qna.vue'),
      },
      {
        path: 'qna/:id',
        name: 'qna-detail',
        component: () => import('@/views/qna/QnaDetail.vue'),
      }
    ],
  },
  { path: '/', redirect: '/main/qna' },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});



// router.beforeEach((to, from, next) => {
//   const userStore = useUserStore()
  
//   // "/"(root) 경로로 들어왔을 때 로그인 유무에 따라 rooting
//   if (to.path === '/') {
//     if (userStore.isLoggedIn) {
//       // 로그인 O → 홈이나 대시보드 등으로 이동
//       next({ name: 'main-dashboard' }) 
//       // next({ name: 'community-board' }) 
//     } else {
//       // 로그인 X → 로그인 페이지로 이동
//       next({ name: 'sign-logIn' })
//     }
//   } else {
//     next()
//   }
// })

export default router;