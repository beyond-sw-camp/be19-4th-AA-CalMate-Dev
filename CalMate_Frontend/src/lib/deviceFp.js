// src/utils/deviceFp.js

export function generateDeviceFp() {
  // 1) 최신 + secure context: randomUUID 지원
  if (window.crypto && typeof window.crypto.randomUUID === 'function') {
    return window.crypto.randomUUID();
  }

  // 2) randomUUID는 없지만 getRandomValues 있는 경우
  if (window.crypto && typeof window.crypto.getRandomValues === 'function') {
    const array = new Uint8Array(16);
    window.crypto.getRandomValues(array);

    // RFC4122 v4 형태로 맞춰주기
    array[6] = (array[6] & 0x0f) | 0x40;
    array[8] = (array[8] & 0x3f) | 0x80;

    const toHex = (n) => n.toString(16).padStart(2, '0');

    return [
      [...array.slice(0, 4)].map(toHex).join(''),
      [...array.slice(4, 6)].map(toHex).join(''),
      [...array.slice(6, 8)].map(toHex).join(''),
      [...array.slice(8, 10)].map(toHex).join(''),
      [...array.slice(10, 16)].map(toHex).join(''),
    ].join('-');
  }

  // 3) 그것도 안 되면 Math.random 기반 (보안성 ↓, 식별용으로는 OK)
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
