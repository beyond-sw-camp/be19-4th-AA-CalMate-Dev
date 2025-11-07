export default [
  {
    path: '/main',
    name: 'main',
    component: () => import('@/views/layout/DefaultLayout.vue'),
    
    children: [
      {
        path: 'dashboard',
        name: 'main-dashboard', 
        component: () => import('@/views/defaultPage/DashBoard.vue'), // lazy
      },
      {
        path: 'aitab',
        name: 'aitab', 
        component: () => import('@/views/aiPage/AiTab.vue'), // lazy
      },
      {
        path: 'aiexercise',
        name: 'aiexercise', 
        component: () => import('@/views/aiPage/AiExercise.vue'), // lazy
      }
    ],
  },
];
