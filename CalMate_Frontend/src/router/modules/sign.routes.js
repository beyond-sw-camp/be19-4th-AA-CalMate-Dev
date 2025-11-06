export default [
  {
    path: '/sign',
    name: 'sign',
    component: () => import('@/views/layout/SiginLayout.vue'),
    
    children: [
      {
        path: 'signIn',
        name: 'sign-logIn', // link(to) 사용시 경로가 아닌 name을 사용해서 맵핑가능 
        component: () => import('@/views/signPage/SignIn.vue'), // lazy
      },
      {
        path: 'signUp',
        name: 'sign-signUp',
        component: () => import('@/views/signPage/SignUp.vue'),
      },
    ],
  },
];
