// src/lib/api.js
// ============================================================
// 이 파일은 "앱 전역에서 단 하나만" 사용하는 Axios 인스턴스를 만든다.
// - baseURL: '/localhost:80' (개발 프록시 기준)
// - withCredentials: true (리프레시 토큰 쿠키 자동 전송)
// - 요청 인터셉터: Pinia의 access token을 Authorization 헤더로 자동 부착
// - 응답 인터셉터: 401 나오면 /auth/refresh 자동 호출 → 성공 시 원요청 재시도
// ============================================================

import axios from 'axios';                  // axios 본체를 가져온다.
import { useUserStore } from '@/stores/user'; // Pinia의 사용자 스토어(액세스 토큰을 꺼내오기 위함)
import { useToast } from '@/lib/toast'
import router from '@/router/index.routes';
import { parseJwt, getTokenExpiryDate, isTokenExpired, isTokenExpiringSoon } from '@/lib/jwtUtil';

const {success, error : toastError , info} = useToast();
// 날짜 한국 시간으로 출력하기
const formattedTimeForKor =  () => {
  const now = new Date();
  const formatted = now.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).replace(/\./g, '').replace(/ /g, '-').replace('오전', '').replace('오후', '');

  return formatted;
}


// api.defaults.baseURL;
// ------------------------------------------------------------
// 1) 전역에서 쓸 Axios 인스턴스 1개 생성
// ------------------------------------------------------------
const api = axios.create({
  // baseURL: API_BASE_URL,          // 모든 상대 경로 요청은 '/localhost:80'를 기준으로 보낸다. (Vite dev proxy로 백엔드 연결 가정)
  // baseURL: 'http://localhost:80/back',          // 모든 상대 경로 요청은 '/localhost:80'를 기준으로 보낸다. (Vite dev proxy로 백엔드 연결 가정)
  // baseURL: '/back',          // 모든 상대 경로 요청은 '/localhost:80'를 기준으로 보낸다. (Vite dev proxy로 백엔드 연결 가정)
  baseURL: 'http://localhost:8081',          // 모든 상대 경로 요청은 '/localhost:80'를 기준으로 보낸다. (Vite dev proxy로 백엔드 연결 가정)
  withCredentials: true,    // ✅ 브라우저가 HttpOnly 쿠키(리프레시 토큰)를 자동으로 전송하도록 허용
  timeout: 15000,           // 네트워크 요청 타임아웃(ms). 필요에 따라 조정 가능.
});

export const API_BASE_URL = api.defaults.baseURL;
// console.log('API_BASE_URL::' , API_BASE_URL);


// ─────────────────────────────────────────────────────────────────────────────
// 2) 전역 상태 변수 (모듈 스코프)
//    - refreshPromise: 진행 중인 리프레시 요청을 기록하는 "하나의" Promise
//                      동시에 여러 요청이 401을 만나도 새로 만들지 않고
//                      모두가 이 Promise를 await 하도록 만들기 위해 사용
//    - isRefreshing:   (선택) 디버깅/가독성을 위한 보조 플래그
//    - EXCLUDED_URLS:  인터셉터가 "자기 자신(/refresh)"을 다시 건드려 무한루프
//                      나는 경우를 막기 위해, 리프레시/로그인 등의 URL을 제외
// ─────────────────────────────────────────────────────────────────────────────
let refreshPromise = null;                 // ✔ 진행 중인 리프레시 요청이 없으면 null
let isRefreshing = false;                  // ✔ 디버깅용 플래그
const EXCLUDED_URLS = [                    // ✔ 인터셉터 제외 대상 URL들
  '/member/refresh',                       //    - 실제 리프레시 호출 경로
  '/login',                               //    - 로그인 요청
];
const refreshUrl = '/member/refresh';


// ─────────────────────────────────────────────────────────────────────────────
// 3) 요청 인터셉터 (request interceptor)
//    - 모든 요청이 서버로 나가기 "직전"에 실행된다.
//    - Pinia 스토어에서 현재 보관 중인 access token을 꺼내 Authorization 헤더에 실어준다.
//    - 이미 헤더가 있으면 덮어쓰지 않고, 없을 때만 세팅한다(원하면 항상 교체해도 됨).
// ─────────────────────────────────────────────────────────────────────────────
api.interceptors.request.use((config) => {
  // 매 요청마다 Pinia 스토어에서 최신 토큰을 읽는다. (앱이 createPinia() 된 뒤라면 안전)
  // const user = useUserStore();              // 현재 활성화된 Pinia 인스턴스에서 user 스토어를 가져온다.
  const user = useUserStore();   
  const token = user.token;                 // 스토어가 들고 있는 액세스 토큰 문자열을 읽는다.
  console.log(`[${formattedTimeForKor()}] 백엔드 요청:`,`[${config.method}]`,`${api.defaults.baseURL + config.url}`,config);
  // 토큰이 존재하면 Authorization 헤더를 표준 Bearer 스킴으로 세팅한다.
  if (token) {
    config.headers = config.headers || {};  // headers 객체가 없을 수도 있으므로 보장한다.
    config.headers.Authorization = `Bearer ${token}`; // "Authorization: Bearer <JWT>" 형태로 삽입.
  }

  // (선택) 여기에서 만료 임박 시 선제 리프레시 로직을 넣을 수도 있지만,
  //        보통은 응답 인터셉터(401 처리)에서 리프레시를 트리거하는 편이 단순/직관적이다.
  return config;                            // 수정된 config를 반환하면 이 설정이 실제 요청에 적용된다.
});

// ─────────────────────────────────────────────────────────────────────────────
// 4) 응답 인터셉터 (response interceptor)
//    - 서버에서 응답이 돌아왔을 때 실행된다.
//    - 정상 응답은 그대로 반환, 에러 응답(특히 401/403)은 토큰 리프레시를 시도한다.
//    - 핵심: 단 하나의 refreshPromise만 만들어 모두가 await 하도록 한다.
// ─────────────────────────────────────────────────────────────────────────────
api.interceptors.response.use(
  // 4-1) 성공 응답은 있는 그대로 통과
  (response) => response,

  // 4-2) 에러 응답 처리(주로 401/403)
  async (error) => {
    // 4-2-1) 실패한 "원 요청"의 설정 객체를 가져온다.
    const original = error && error.config; // ✔ 실패 요청의 axios config (재시도에 필요)
    const status = error && error.response && error.response.status; // ✔ HTTP 상태 코드
          console.log(`error 값: `, error);

    // 4-2-2) 설정 객체가 없으면(아주 특이 케이스) 더 할 수 있는 게 없으므로 그대로 던진다.
    if (!original) {
      return Promise.reject(error);
    }

    // 4-2-3) 인터셉터 제외 대상 URL이면(리프레시/로그인이 실패해서 또 들어온 경우 등),
    //        루프를 방지하기 위해 그대로 던진다.
    const url = original.url || '';
    console.log('에러 처리 url:::',original.url)
    if (EXCLUDED_URLS.some((u) => url.includes(u))) {
      return Promise.reject(error);
    }

    console.log(`original._retry 값 : ` ,original?._retry);
    // 4-2-4) 401 또는 403을 만났고, 아직 이 요청에 대해 재시도 마크를 안 달았다면 처리 시작
    if ((status === 401 || status === 403) && !original._retry) {

      const user = useUserStore();
      // console.log('토큰 값::::::', user.token);
      // console.log('토큰 만료 유무', isTokenExpired(user.token));

      if(!isTokenExpired(user.token))
      {
        return Promise.reject(error);
      }

      // payload.exp  <-- 여기서 exp 꺼낼 수 있음


      // 리프래시 요청이 에러 났을 경우 로그아웃 실행
      // if(original.url === refreshUrl)
      // {
      //     console.log('=============리프래시 에러 나는곳 탐===================')
      //     // console.log('리프래시 이상 ===========')
      //     // isRefreshing = false;                                  
      //     // refreshPromise = null;   
      //     // toastError('이상 접근 감지',{description: '비정상 접근이 갑지 되어 재 로그인 시도 부탁 드립니다.' });
      //     // const user = useUserStore();     
      //     // user.logOut();                       
      //     // await router.push('/')  
      //     // 🔥 여기서 끝내야 아래에서 또 /member/refresh 안 감
      //     return Promise.reject(error);
      // }

      // 4-2-4-1) 무한 루프 방지를 위한 커스텀 플래그
      original._retry = true;

      try {
          // console.log('리프래시 시도?')
          // ─────────────────────────────────────────────────────────
          // (A) 현재 진행 중인 리프레시가 없다면 "지금" 하나 만든다.
          //     있으면 새로 만들지 않고 그 Promise를 그대로 기다린다.
          //     → 이렇게 하면 동시 다발적인 401에도 리프레시가 1번만 일어난다.
          // ─────────────────────────────────────────────────────────
          // console.log(`original 값 : ` ,original);
          // console.log(`refreshPromise 값: `, refreshPromise);
          // console.log(`isRefreshing 값: `, isRefreshing);
          if (!refreshPromise) {
            isRefreshing = true;                                       // ✔ (선택) 플래그 on

            // 4-2-4-2) 새 리프레시 Promise 생성
            refreshPromise = (async () => {
              // 4-2-4-2-1) /refresh 호출: withCredentials로 HttpOnly 쿠키 자동 전송
              const refreshRes = await api.post(
                refreshUrl,                                            // ✔ baseURL('/member') + '/refresh' = '/member/refresh'
                {},                                                    // ✔ 보통 바디는 비움 (쿠키 기준 식별)
                {
                  withCredentials: true,                               // ✔ 쿠키 전송 필수
                  headers: {
                    // (선택) 서버가 UA/디바이스 바인딩 검증을 한다면 간단한 힌트로 디바이스 지문을 보낼 수 있다.
                    'X-Device-Fp': sessionStorage.getItem('device_fp') || '',
                  },
                }
              );

              // 4-2-4-2-2) 서버가 새 액세스 토큰을 JSON 바디로 내려준다고 가정
              const newAccessToken = refreshRes && refreshRes.data && refreshRes.data.accessToken;

              // 4-2-4-2-3) 토큰이 없다면 에러로 간주
              if (!newAccessToken) {
                throw new Error('No accessToken in refresh response');
              }

              // 4-2-4-2-4) Pinia 스토어에 새 토큰 반영 (요청 인터셉터가 이후부터 자동 부착)
              const user = useUserStore();                             // ✔ 스토어 접근
              user.setToken(newAccessToken);                           // ✔ 토큰 갱신(Pinia 상태 업데이트)
              info('토큰 재 발급',{description: '엑세스 토큰이 재 발급 되었습니다.' });
              // 4-2-4-2-5) 이 Promise의 결과값으로 새 토큰을 반환 (동시에 기다리는 요청들이 이 값을 받는다)
              return newAccessToken;
          })()
            .catch(async(e) => {
              console.log('api에서 catch빠짐 :' ,e);
              // 4-2-4-3) 리프레시 자체가 실패한 경우: 더 이상의 자동 복구가 불가
              console.log('api에서 catch빠짐2 ');
              const user = useUserStore();                           // ✔ 스토어 접근
              console.log('api에서 catch빠짐3 ');
              user.logOut();                                         // ✔ 로그인 상태 초기화/세션 정리
              console.log('api에서 catch빠짐4');
              toastError('이상 접근 감지',{description: '비정상 접근이 갑지 되어 재 로그인 시도 부탁 드립니다.' });
              console.log('api에서 catch빠짐5');
              
                 
              await router.push('/') 
              throw e;                                           // ✔ 상위로 에러 전파
            })
            .finally(() => {
              isRefreshing = false;                                  // ✔ (선택) 플래그 off
              refreshPromise = null;                                 // ✔ 다음 401을 위해 promise 슬롯 비우기
            });
          }

        // ─────────────────────────────────────────────────────────
        // (B) 여기서는 "이미 있거나 방금 만든" 공용 refreshPromise를 기다린다.
        //     모든 동시 401 요청이 같은 Promise를 await 하므로 리프레시가 1회만 수행된다.
        // ─────────────────────────────────────────────────────────
        const token = await refreshPromise;                          // ✔ 새 토큰 수신

        // ─────────────────────────────────────────────────────────
        // (C) 새 토큰으로 "원 요청"을 재시도
        // ─────────────────────────────────────────────────────────
        original.headers = original.headers || {};                   // ✔ 헤더 객체 보장
        original.headers.Authorization = `Bearer ${token}`;          // ✔ Authorization 교체
        return api(original);                                        // ✔ 동일 인스턴스로 재시도하여 결과 반환
      } catch (e) {
        // 4-2-4-5) 리프레시 실패: 상위로 에러 전파(라우터에서 /login으로 보내는 등 처리)
        return Promise.reject(e);
      }
    }

    // 4-2-5) 401/403이 아니거나, 이미 재시도한 요청이라면 그 외 에러를 그대로 전파
    return Promise.reject(error);
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// 5) 도우미(선택): 앱의 다른 곳에서 명시적으로 토큰을 세팅하고 싶을 때 사용
//    - 예: 로그인 성공 직후 서버가 바디로 accessToken을 내려주면 setAccessToken(data.accessToken)
// ─────────────────────────────────────────────────────────────────────────────
export function setAccessToken(token) {
  const user = useUserStore();             // ✔ Pinia 스토어 접근
  user.setToken(token);                    // ✔ 스토어에 토큰 저장
  // 추가로, 즉시 axios 기본 헤더에도 심어두고 싶다면 아래 라인을 풀어도 된다.
  // api.defaults.headers.common.Authorization = `Bearer ${token}`;
}



// ------------------------------------------------------------
// 4) 다른 파일에서 import 해서 사용할 수 있도록 export 한다.
//    이 인스턴스만 쓰면 프록시/쿠키/토큰/재시도 규칙이 자동으로 적용된다.
// ------------------------------------------------------------
export default api;