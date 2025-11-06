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
      },
    ],
  },
];
