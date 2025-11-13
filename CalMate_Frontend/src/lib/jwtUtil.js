// JWT 문자열에서 payload(JSON)를 꺼내서 객체로 반환하는 함수
export function parseJwt(token) {
  // 1) 토큰이 없으면 바로 null 반환 (방어 코드)
  if (!token) return null;

  // 2) JWT는 "header.payload.signature" 구조라서 '.' 기준으로 나눈다.
  const parts = token.split('.');

  // 3) 토큰 형식이 이상한 경우 (3부분이 아니면) null 반환
  if (parts.length !== 3) return null;

  // 4) 우리가 필요한 건 가운데 부분(payload)이므로 꺼낸다.
  const base64Url = parts[1];

  // 5) JWT는 base64 *URL-safe* 형식이라서, 일반 base64로 바꿔줘야 한다.
  //    - '-'  -> '+'
  //    - '_'  -> '/'
  let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

  // 6) base64 문자열 길이가 4의 배수가 되도록 '=' 패딩을 붙여준다.
  //    (일반 atob는 길이가 4의 배수가 아니면 에러가 나는 경우가 있음)
  while (base64.length % 4 !== 0) {
    base64 += '=';
  }

  try {
    // 7) window.atob로 base64 디코딩 → 이 시점에서 그냥 문자열(JSON 텍스트)
    const jsonStr = window.atob(base64);

    // 8) JSON.parse 해서 실제 JS 객체로 변환
    const payload = JSON.parse(jsonStr);

    // 9) payload 반환 (여기 안에 exp, sub, username 등 들어있음)
    return payload;
  } catch (e) {
    // 10) 디코딩/파싱 중에 오류가 나면 null 반환 (깨진 토큰 방어)
    console.error('parseJwt error:', e);
    return null;
  }
}


// JWT에서 만료 시간(exp)을 꺼내서 Date 객체로 반환하는 함수
export function getTokenExpiryDate(token) {
  // 1) 먼저 payload를 파싱한다.
  const payload = parseJwt(token);

  // 2) payload가 없거나 exp가 없다면 null 반환
  if (!payload || typeof payload.exp !== 'number') {
    return null;
  }

  // 3) exp는 "초 단위"이므로 JS Date(밀리초 단위)로 만들려면 * 1000
  const expiryDate = new Date(payload.exp * 1000);

  // 4) 완성된 Date 객체 반환
  return expiryDate;
}

// JWT가 "이미" 만료됐는지 여부를 true/false로 알려주는 함수
export function isTokenExpired(token) {
  // 1) 만료 시간을 Date로 가져온다.
  const expiryDate = getTokenExpiryDate(token);

  // 2) 만료 시간이 없으면 "만료된 것으로" 취급 (방어적)
  if (!expiryDate) return true;

  // 3) 현재 시간(클라이언트 기준) 가져오기
  const now = new Date();

  // 4) 현재 시간이 만료 시간 이후라면 -> 이미 만료(true)
  return now >= expiryDate;
}

// JWT가 "곧" 만료될 예정인지 체크하고 싶을 때 (예: 1분 이내)
export function isTokenExpiringSoon(token, thresholdSeconds = 60) {
  // 1) 만료 시간 가져오기
  const expiryDate = getTokenExpiryDate(token);
  if (!expiryDate) return true; // 알 수 없으면 만료 임박으로 취급

  // 2) 현재 시각
  const now = new Date();

  // 3) 남은 시간(밀리초 단위)
  const diffMs = expiryDate.getTime() - now.getTime();

  // 4) 남은 시간을 초 단위로 환산
  const diffSeconds = diffMs / 1000;

  // 5) 남은 시간이 thresholdSeconds 이하이면 "곧 만료(true)"로 판단
  return diffSeconds <= thresholdSeconds;
}
