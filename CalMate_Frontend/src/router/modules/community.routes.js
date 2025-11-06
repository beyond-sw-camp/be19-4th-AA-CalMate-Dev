export default [
  {
    path: '/community',
    name: 'community',
    component: () => import('@/views/layout/CommunityLayout.vue'),
    
    children: [
      {
        path: 'board',
        name: 'community-board', 
        component: () => import('@/views/communityPage/Community.vue'), // lazy

        // 하위에 페이지가 더 있을 경우 아래와 같이 추가
        // children: [
        //   {
        //     path: 'side',
        //     name: 'community-board-side', 
        //     component: () => import('@/views/community/Community.vue'), // lazy
        //   }
        // ]
      },
    ],
  },
];
