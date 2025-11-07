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

// ------------------------------------------------------------
// 1) 전역에서 쓸 Axios 인스턴스 1개 생성
// ------------------------------------------------------------
const api = axios.create({
  baseURL: 'http://localhost:8081',          // 모든 상대 경로 요청은 '/localhost:80'를 기준으로 보낸다. (Vite dev proxy로 백엔드 연결 가정)
  withCredentials: true,    // ✅ 브라우저가 HttpOnly 쿠키(리프레시 토큰)를 자동으로 전송하도록 허용
  timeout: 15000,           // 네트워크 요청 타임아웃(ms). 필요에 따라 조정 가능.
});

// ------------------------------------------------------------
// 2) 요청 인터셉터: 요청이 나가기 "직전" 액세스 토큰을 헤더에 붙인다.
// ------------------------------------------------------------
api.interceptors.request.use((config) => {
  // 매 요청마다 Pinia 스토어에서 최신 토큰을 읽는다. (앱이 createPinia() 된 뒤라면 안전)
  const user = useUserStore();              // 현재 활성화된 Pinia 인스턴스에서 user 스토어를 가져온다.
  const token = user.token;                 // 스토어가 들고 있는 액세스 토큰 문자열을 읽는다.

  // 토큰이 존재하면 Authorization 헤더를 표준 Bearer 스킴으로 세팅한다.
  if (token) {
    config.headers = config.headers || {};  // headers 객체가 없을 수도 있으므로 보장한다.
    config.headers.Authorization = `Bearer ${token}`; // "Authorization: Bearer <JWT>" 형태로 삽입.
  }

  // (선택) 여기에서 만료 임박 시 선제 리프레시 로직을 넣을 수도 있지만,
  //        보통은 응답 인터셉터(401 처리)에서 리프레시를 트리거하는 편이 단순/직관적이다.
  return config;                            // 수정된 config를 반환하면 이 설정이 실제 요청에 적용된다.
});

// ------------------------------------------------------------
// 3) 응답 인터셉터: 401이면 /auth/refresh를 자동으로 호출하고, 성공 시 원요청을 재시도
//    - 중복 리프레시 방지를 위해 isRefreshing 플래그와 대기 큐를 둔다.
// ------------------------------------------------------------
let isRefreshing = false;                   // 현재 리프레시 중인지 표시 (동시에 여러 개가 호출되는 걸 막는다)
let waitQueue = [];                         // 리프레시가 끝날 때까지 대기할 "원 요청"들의 재시도 콜백을 담는 큐

api.interceptors.response.use(
  // 정상 응답은 그대로 통과시킨다.
  (response) => response,

  // 에러 응답만 따로 처리한다.
  async (error) => {
    const original = error.config;          // 실패한 "원 요청"의 설정 객체를 참조한다.
    const status = error?.response?.status; // HTTP 상태 코드(401 등)를 꺼낸다.

    // 401(Unauthorized)이고, 아직 이 요청에 대해 재시도 마크를 안 달았으면 처리한다.
    if (status === 401 && original && !original._retry) {
      original._retry = true;               // 무한 루프를 막기 위한 커스텀 플래그 (_retry)

      // 만약 지금 리프레시가 진행 중이 아니라면, 우리가 리프레시를 시작한다.
      if (!isRefreshing) {
        isRefreshing = true;                // 이제부터 리프레시 중 상태

        try {
          // /auth/refresh 엔드포인트로 POST 요청을 보낸다.
          // - withCredentials: true → HttpOnly 쿠키(리프레시 토큰)를 자동으로 동봉
          // - X-Device-Fp: 선택 헤더 (서버에서 UA/디바이스 바인딩 검증 시 사용 가능)
          const refreshRes = await axios.post(
            '/api/auth/refresh',
            {},                              // 보통 바디는 비우고, 쿠키로 식별한다.
            {
              withCredentials: true,         // ✅ 리프레시 쿠키를 자동 전송하도록 한다.
              headers: { 'X-Device-Fp': navigator.userAgent }, // (선택) 간단한 디바이스 지문 힌트
            }
          );

          // 서버가 새 액세스 토큰을 JSON 바디로 내려준다고 가정한다.
          const newAccessToken = refreshRes.data.accessToken;

          // Pinia 스토어에 새 토큰을 반영한다. (이후 요청부터는 요청 인터셉터가 자동으로 새 토큰을 실어준다)
          const user = useUserStore();       // 스토어 인스턴스 획득
          user.setToken(newAccessToken);     // 액세스 토큰 갱신

          // 리프레시가 끝났으므로, 대기 중이던 원 요청들을 재개한다.
          // - waitQueue에 있는 각 콜백에 newAccessToken을 넘겨주면,
          //   콜백들이 Authorization 헤더를 교체하고 원 요청을 다시 보낼 것이다.
          waitQueue.forEach((resume) => resume(newAccessToken));
          waitQueue = [];                    // 큐를 비운다.
        } catch (e) {
          // 리프레시 자체가 실패했다면 더 이상 자동 복구가 불가하다.
          // - 사용자를 로그아웃시키고,
          // - 로그인 화면으로 보내는 등의 처리가 필요하다.
          waitQueue = [];                    // 큐를 비운다.
          const user = useUserStore();       // 스토어 접근
          user.logOut();                     // 모든 사용자 상태/토큰 초기화
          // 여기에서 라우터로 /login 이동 등을 수행하는 것을 권장한다.
          return Promise.reject(e);          // 상위로 에러를 그대로 전달한다.
        } finally {
          // 무엇이 되었든 리프레시 시도는 종료되었다.
          isRefreshing = false;
        }
      }

      // 여기까지 왔다는 건:
      // - 누군가 리프레시를 이미 시작했고(우리가 시작했거나, 다른 요청이 먼저 시작했거나),
      // - 우리는 그 리프레시가 끝나길 기다렸다가 원 요청을 재시도해야 한다는 뜻이다.
      return new Promise((resolve) => {
        // 새 토큰을 받으면 Authorization 헤더를 교체하고, 다시 보내도록 한다.
        waitQueue.push((newToken) => {
          original.headers = original.headers || {};           // 원 요청의 헤더 보장
          original.headers.Authorization = `Bearer ${newToken}`; // 새 토큰으로 교체
          resolve(api(original));                              // 동일 인스턴스로 "원 요청"을 재시도
        });
      });
    }

    // 401이 아니거나, 이미 재시도한 요청이라면 에러를 그대로 던진다.
    return Promise.reject(error);
  }
);

// ------------------------------------------------------------
// 4) 다른 파일에서 import 해서 사용할 수 있도록 export 한다.
//    이 인스턴스만 쓰면 프록시/쿠키/토큰/재시도 규칙이 자동으로 적용된다.
// ------------------------------------------------------------
export default api;
