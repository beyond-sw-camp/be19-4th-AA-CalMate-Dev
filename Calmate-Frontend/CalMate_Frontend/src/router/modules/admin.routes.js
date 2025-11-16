export default [
  {
    path: '/admin',
    name: 'admin',
    meta: { isAdmin: true }, // 관리자 페이지 확인을 위한 변수, 
    component: () => import('@/views/layout/AdminLayout.vue'),
    
    children: [
      {
        path: 'main-dashboard',
        name: 'admin-dashboard',
        component: () => import('@/views/AdminPage/AdminMainDashBoard.vue'), // lazy
        children: [
            {
                path: 'dashboard',
                name: 'admin-childe-dashboard',
                component: () => import('@/views/AdminPage/AdminDashboard.vue'), 
            },
            {
                path: 'users',
                name: 'admin-childe-users',
                component: () => import('@/views/AdminPage/AdminUsers.vue'), 
            },
            {
                path: 'reports',
                name: 'admin-childe-reports',
                component: () => import('@/views/AdminPage/AdminReports.vue'), 
            },
            {
                path: 'inquiries',
                name: 'admin-childe-inquiries',
                component: () => import('@/views/AdminPage/AdminInquiries.vue'), 
            },
        ]
      },
      {
        path: 'qna/:id',
        name: 'dashboard-qna-detail',
        component: () => import('@/views/qna/QnaDetail.vue'),
      },
    ],
  },
];
