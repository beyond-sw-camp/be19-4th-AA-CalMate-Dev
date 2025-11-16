export default [
  {
    path: '/community',
    name: 'community',
    component: () => import('@/views/layout/CommunityLayout.vue'),

    children: [
      {
        path: '', // ✅ 기본 경로 (http://localhost:5173/community)
        name: 'community-main',
        component: () => import('@/views/communityPage/Community.vue'),
      },
      {
        path: 'write', // http://localhost:5173/community/write ✅ 글쓰기
        name: 'community-write',
        component: () => import('@/views/communityPage/CommunityWrite.vue'),
      },
      {
        path: ':postId', // http://localhost:5173/community/3 ✅ 상세보기
        name: 'community-detail',
        component: () => import('@/views/communityPage/CommunityDetail.vue'),
        props: true      // ✅ 이거 엄청 중요!
      },
    ],
  },
];

