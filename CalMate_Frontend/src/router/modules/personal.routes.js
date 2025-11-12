export default [
  {
    path: '/main',
    name: 'main',
    component: () => import('@/views/layout/DefaultLayout.vue'),
    children: [
      {
        path: 'dashboard',
        name: 'main-dashboard',
        component: () => import('@/views/defaultPage/DashBoard.vue'),
      },
      {
        path: 'profile',
        name: 'main-profile', 
        component: () => import('@/views/defaultPage/ProfileSettings.vue'), // lazy
      },
      {
        path: 'qna',
        name: 'dashboard-qna-list',
        component: () => import('@/components/qna/QnaList.vue'),
      },
      {
        path: 'qna/new',
        name: 'dashboard-qna-new',
        component: () => import('@/components/qna/Qna.vue'),
      },
      {
        path: 'qna/:id',
        name: 'dashboard-qna-detail',
        component: () => import('@/components/qna/QnaDetail.vue'),
      },
      {
        path: 'diary',
        name: 'main-diary',
        component: () => import('@/views/diary/Diary.vue'),
      },
      {
        path: 'diary/done',
        name: 'main-diary-done',
        component: () => import('@/views/diary/DiaryDone.vue'),
      },
      {
        path: 'calendar',
        name: 'main-calendar',
        component: () => import('@/views/calendar/Calendar.vue'),
      },
      {
        path: 'exerciseRecords',
        name: 'main-exerciseRecords',
        component: () => import('@/views/defaultPage/ExerciseRecords.vue'),
      },
      {
        path: 'dietmanagement',
        name: 'main-dietmanagement',
        component: () => import('@/views/defaultPage/DietManagement.vue'),
        children: [
          {
            path: 'breakfast',
            name: 'diet-breakfast',
            component: () => import('@/components/dietManagement/Breakfast.vue'),
          },
          {
            path: 'lunch',
            name: 'diet-lunch',
            component: () => import('@/components/dietManagement/Lunch.vue'),
          },
          {
            path: 'dinner',
            name: 'diet-dinner',
            component: () => import('@/components/dietManagement/Dinner.vue'),
          },
          {
            path: 'snack',
            name: 'diet-snack',
            component: () => import('@/components/dietManagement/Snack.vue'),
          },
        ],
      },
      {
        path: 'point',
        name: 'main-point', 
        component: () => import('@/views/defaultPage/Points.vue'), 
      },
      {
        path: 'ai',
        name: 'ai-tab', 
        component: () => import('@/views/aiPage/AiTab.vue'),
        children: [
          {
            path: 'diet',
            name: 'ai-diet',
            component: () => import('@/components/ai/AiDietPlan.vue'),
          },
          {
            path: 'exercise',
            name: 'ai-exercise',
            component: () => import('@/components/ai/AiExercisePlan.vue'),
          },
        ] 
      }
    ],
  },
]
