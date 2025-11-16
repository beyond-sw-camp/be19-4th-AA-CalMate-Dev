import { createApp } from 'vue'
import App from './App.vue'
import indexRoutes from './router/index.routes.js'

import { createPinia } from 'pinia';             // Pinia 컨테이너 생성 함수
import piniaPersistedState from 'pinia-plugin-persistedstate' // 스토리지에 상태를 저장 하기 위해 사용.(새로 고침하면 원래는 pinia 저장 값이 날라감)



const app = createApp(App);

const pinia = createPinia();                     // 2) Pinia 루트 인스턴스 생성
pinia.use(piniaPersistedState);                     
app.use(pinia);                                  // 3) 앱에 Pinia 연결

app.use(indexRoutes);
app.mount('#app');
