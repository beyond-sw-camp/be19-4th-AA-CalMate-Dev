// src/data/foodData.js
// 식단 데이터 - 프론트엔드에서 검색 기능을 위한 로컬 데이터

/**
 * @typedef {Object} FoodItem
 * @property {string} id - 음식 고유 ID
 * @property {string} name - 음식 이름
 * @property {string} cuisine - 음식 카테고리 (KOREAN, CHINESE, JAPANESE, WESTERN, SPANISH, LATE_NIGHT, SNACK)
 * @property {number} gram - 1회 제공량 (g)
 * @property {number} kcal - 칼로리
 * @property {number} carbo - 탄수화물 (g)
 * @property {number} protein - 단백질 (g)
 * @property {number} fat - 지방 (g)
 * @property {number} sodium - 나트륨 (mg)
 */

// ============================================================
// 1. 한식 (KOREAN)
// ============================================================
/** @type {FoodItem[]} */
export const KOREAN_FOOD_DATA = [
  { id: "KOR_001", name: "김치찌개", cuisine: "KOREAN", gram: 350, kcal: 280, carbo: 10.5, protein: 18, fat: 17, sodium: 950 },
  { id: "KOR_002", name: "된장찌개", cuisine: "KOREAN", gram: 330, kcal: 250, carbo: 12, protein: 17, fat: 14, sodium: 980 },
  { id: "KOR_003", name: "순두부찌개", cuisine: "KOREAN", gram: 360, kcal: 310, carbo: 14, protein: 19, fat: 20, sodium: 1020 },
  { id: "KOR_004", name: "비빔밥", cuisine: "KOREAN", gram: 380, kcal: 560, carbo: 82, protein: 17, fat: 14, sodium: 960 },
  { id: "KOR_005", name: "돌솥비빔밥", cuisine: "KOREAN", gram: 420, kcal: 610, carbo: 86, protein: 19, fat: 16, sodium: 1000 },
  { id: "KOR_006", name: "갈비탕", cuisine: "KOREAN", gram: 420, kcal: 430, carbo: 8, protein: 32, fat: 26, sodium: 1200 },
  { id: "KOR_007", name: "콩나물국밥", cuisine: "KOREAN", gram: 480, kcal: 520, carbo: 68, protein: 20, fat: 10, sodium: 1250 },
  { id: "KOR_008", name: "제육볶음", cuisine: "KOREAN", gram: 200, kcal: 420, carbo: 12, protein: 24, fat: 30, sodium: 820 },
  { id: "KOR_009", name: "돼지불고기", cuisine: "KOREAN", gram: 210, kcal: 430, carbo: 16, protein: 23, fat: 29, sodium: 840 },
  { id: "KOR_010", name: "잡채", cuisine: "KOREAN", gram: 180, kcal: 320, carbo: 45, protein: 7, fat: 10, sodium: 620 },
  { id: "KOR_011", name: "오징어볶음", cuisine: "KOREAN", gram: 200, kcal: 360, carbo: 24, protein: 22, fat: 14, sodium: 830 },
  { id: "KOR_012", name: "돼지고기김치찌개", cuisine: "KOREAN", gram: 380, kcal: 310, carbo: 12, protein: 20, fat: 18, sodium: 980 },
  { id: "KOR_013", name: "차돌된장찌개", cuisine: "KOREAN", gram: 360, kcal: 340, carbo: 13, protein: 19, fat: 21, sodium: 1020 },
  { id: "KOR_014", name: "부대전골", cuisine: "KOREAN", gram: 450, kcal: 580, carbo: 26, protein: 26, fat: 34, sodium: 1600 },
  { id: "KOR_015", name: "감자탕", cuisine: "KOREAN", gram: 450, kcal: 540, carbo: 18, protein: 30, fat: 32, sodium: 1450 },
  { id: "KOR_016", name: "갈치조림", cuisine: "KOREAN", gram: 250, kcal: 320, carbo: 18, protein: 24, fat: 12, sodium: 980 },
  { id: "KOR_017", name: "고등어조림", cuisine: "KOREAN", gram: 260, kcal: 340, carbo: 16, protein: 26, fat: 14, sodium: 1040 },
  { id: "KOR_018", name: "닭볶음탕", cuisine: "KOREAN", gram: 380, kcal: 520, carbo: 26, protein: 32, fat: 26, sodium: 1180 },
  { id: "KOR_019", name: "간장계란밥", cuisine: "KOREAN", gram: 250, kcal: 430, carbo: 60, protein: 14, fat: 14, sodium: 720 },
  { id: "KOR_020", name: "참치마요덮밥", cuisine: "KOREAN", gram: 320, kcal: 620, carbo: 78, protein: 20, fat: 22, sodium: 980 },

  { id: "KOR_021", name: "소고기미역국", cuisine: "KOREAN", gram: 350, kcal: 220, carbo: 10, protein: 18, fat: 10, sodium: 720 },
  { id: "KOR_022", name: "콩나물국", cuisine: "KOREAN", gram: 330, kcal: 120, carbo: 10, protein: 7, fat: 3, sodium: 560 },
  { id: "KOR_023", name: "북어국", cuisine: "KOREAN", gram: 330, kcal: 150, carbo: 8, protein: 14, fat: 5, sodium: 620 },
  { id: "KOR_024", name: "소고기무국", cuisine: "KOREAN", gram: 340, kcal: 190, carbo: 9, protein: 15, fat: 8, sodium: 640 },
  { id: "KOR_025", name: "육개장", cuisine: "KOREAN", gram: 380, kcal: 310, carbo: 14, protein: 22, fat: 18, sodium: 980 },
  { id: "KOR_026", name: "우거지해장국", cuisine: "KOREAN", gram: 380, kcal: 280, carbo: 16, protein: 19, fat: 14, sodium: 940 },
  { id: "KOR_027", name: "곰탕", cuisine: "KOREAN", gram: 420, kcal: 360, carbo: 6, protein: 26, fat: 22, sodium: 900 },
  { id: "KOR_028", name: "닭칼국수", cuisine: "KOREAN", gram: 420, kcal: 540, carbo: 82, protein: 20, fat: 10, sodium: 1020 },
  { id: "KOR_029", name: "바지락칼국수", cuisine: "KOREAN", gram: 430, kcal: 480, carbo: 78, protein: 17, fat: 8, sodium: 980 },
  { id: "KOR_030", name: "들깨칼국수", cuisine: "KOREAN", gram: 430, kcal: 550, carbo: 76, protein: 17, fat: 16, sodium: 960 },

  { id: "KOR_031", name: "비빔국수", cuisine: "KOREAN", gram: 380, kcal: 520, carbo: 86, protein: 14, fat: 10, sodium: 980 },
  { id: "KOR_032", name: "잔치국수", cuisine: "KOREAN", gram: 380, kcal: 460, carbo: 80, protein: 12, fat: 8, sodium: 920 },
  { id: "KOR_033", name: "콩국수", cuisine: "KOREAN", gram: 420, kcal: 580, carbo: 68, protein: 24, fat: 18, sodium: 720 },
  { id: "KOR_034", name: "김치우동", cuisine: "KOREAN", gram: 400, kcal: 520, carbo: 82, protein: 15, fat: 11, sodium: 1150 },
  { id: "KOR_035", name: "어묵우동", cuisine: "KOREAN", gram: 400, kcal: 480, carbo: 80, protein: 13, fat: 9, sodium: 1100 },
  { id: "KOR_036", name: "떡국", cuisine: "KOREAN", gram: 380, kcal: 480, carbo: 78, protein: 14, fat: 9, sodium: 880 },
  { id: "KOR_037", name: "떡만두국", cuisine: "KOREAN", gram: 420, kcal: 540, carbo: 82, protein: 18, fat: 13, sodium: 980 },
  { id: "KOR_038", name: "국밥(돼지국밥)", cuisine: "KOREAN", gram: 450, kcal: 630, carbo: 36, protein: 30, fat: 34, sodium: 1300 },
  { id: "KOR_039", name: "순대국밥", cuisine: "KOREAN", gram: 450, kcal: 640, carbo: 32, protein: 28, fat: 38, sodium: 1280 },
  { id: "KOR_040", name: "쌀국수(한식스타일)", cuisine: "KOREAN", gram: 400, kcal: 480, carbo: 82, protein: 16, fat: 7, sodium: 840 },

  { id: "KOR_041", name: "곤드레나물밥", cuisine: "KOREAN", gram: 330, kcal: 480, carbo: 78, protein: 13, fat: 8, sodium: 720 },
  { id: "KOR_042", name: "버섯불고기덮밥", cuisine: "KOREAN", gram: 340, kcal: 560, carbo: 74, protein: 20, fat: 16, sodium: 940 },
  { id: "KOR_043", name: "소고기덮밥", cuisine: "KOREAN", gram: 340, kcal: 580, carbo: 76, protein: 22, fat: 18, sodium: 980 },
  { id: "KOR_044", name: "참치김치볶음밥", cuisine: "KOREAN", gram: 320, kcal: 580, carbo: 80, protein: 18, fat: 18, sodium: 1120 },
  { id: "KOR_045", name: "새우볶음밥", cuisine: "KOREAN", gram: 320, kcal: 560, carbo: 78, protein: 16, fat: 16, sodium: 880 },
  { id: "KOR_046", name: "야채볶음밥", cuisine: "KOREAN", gram: 310, kcal: 520, carbo: 82, protein: 12, fat: 12, sodium: 780 },
  { id: "KOR_047", name: "소고기채소볶음밥", cuisine: "KOREAN", gram: 330, kcal: 580, carbo: 80, protein: 18, fat: 18, sodium: 900 },
  { id: "KOR_048", name: "카레라이스(한식)", cuisine: "KOREAN", gram: 350, kcal: 620, carbo: 92, protein: 14, fat: 16, sodium: 1040 },
  { id: "KOR_049", name: "잡곡밥", cuisine: "KOREAN", gram: 200, kcal: 300, carbo: 62, protein: 7, fat: 2, sodium: 4 },
  { id: "KOR_050", name: "현미밥", cuisine: "KOREAN", gram: 200, kcal: 280, carbo: 58, protein: 6, fat: 2, sodium: 3 },

  { id: "KOR_051", name: "오징어덮밥", cuisine: "KOREAN", gram: 340, kcal: 560, carbo: 78, protein: 19, fat: 14, sodium: 980 },
  { id: "KOR_052", name: "낙지덮밥", cuisine: "KOREAN", gram: 340, kcal: 570, carbo: 76, protein: 21, fat: 15, sodium: 1000 },
  { id: "KOR_053", name: "제육덮밥", cuisine: "KOREAN", gram: 340, kcal: 590, carbo: 74, protein: 22, fat: 18, sodium: 1040 },
  { id: "KOR_054", name: "김치전골", cuisine: "KOREAN", gram: 420, kcal: 420, carbo: 20, protein: 22, fat: 24, sodium: 1280 },
  { id: "KOR_055", name: "해물순두부찌개", cuisine: "KOREAN", gram: 360, kcal: 320, carbo: 14, protein: 20, fat: 19, sodium: 1040 },
  { id: "KOR_056", name: "참치찌개", cuisine: "KOREAN", gram: 350, kcal: 310, carbo: 13, protein: 19, fat: 18, sodium: 980 },
  { id: "KOR_057", name: "김치어묵볶음", cuisine: "KOREAN", gram: 200, kcal: 260, carbo: 18, protein: 12, fat: 12, sodium: 980 },
  { id: "KOR_058", name: "어묵볶음", cuisine: "KOREAN", gram: 180, kcal: 220, carbo: 20, protein: 10, fat: 9, sodium: 820 },
  { id: "KOR_059", name: "멸치볶음", cuisine: "KOREAN", gram: 80, kcal: 150, carbo: 10, protein: 11, fat: 6, sodium: 520 },
  { id: "KOR_060", name: "진미채볶음", cuisine: "KOREAN", gram: 80, kcal: 180, carbo: 12, protein: 10, fat: 8, sodium: 580 },

  { id: "KOR_061", name: "감자조림", cuisine: "KOREAN", gram: 150, kcal: 210, carbo: 32, protein: 3, fat: 7, sodium: 520 },
  { id: "KOR_062", name: "연근조림", cuisine: "KOREAN", gram: 130, kcal: 190, carbo: 32, protein: 3, fat: 4, sodium: 460 },
  { id: "KOR_063", name: "메추리알장조림", cuisine: "KOREAN", gram: 120, kcal: 220, carbo: 10, protein: 12, fat: 12, sodium: 720 },
  { id: "KOR_064", name: "우엉조림", cuisine: "KOREAN", gram: 120, kcal: 180, carbo: 30, protein: 4, fat: 4, sodium: 420 },
  { id: "KOR_065", name: "시금치나물", cuisine: "KOREAN", gram: 90, kcal: 60, carbo: 5, protein: 4, fat: 3, sodium: 180 },
  { id: "KOR_066", name: "콩나물무침", cuisine: "KOREAN", gram: 90, kcal: 70, carbo: 6, protein: 4, fat: 3, sodium: 220 },
  { id: "KOR_067", name: "도라지무침", cuisine: "KOREAN", gram: 90, kcal: 80, carbo: 9, protein: 3, fat: 3, sodium: 260 },
  { id: "KOR_068", name: "고사리나물", cuisine: "KOREAN", gram: 90, kcal: 80, carbo: 8, protein: 3, fat: 4, sodium: 240 },
  { id: "KOR_069", name: "숙주나물", cuisine: "KOREAN", gram: 90, kcal: 60, carbo: 5, protein: 3, fat: 3, sodium: 200 },
  { id: "KOR_070", name: "무생채", cuisine: "KOREAN", gram: 80, kcal: 50, carbo: 6, protein: 2, fat: 2, sodium: 220 },

  { id: "KOR_071", name: "배추김치", cuisine: "KOREAN", gram: 70, kcal: 20, carbo: 3, protein: 1, fat: 0.5, sodium: 260 },
  { id: "KOR_072", name: "깍두기", cuisine: "KOREAN", gram: 70, kcal: 25, carbo: 4, protein: 1, fat: 0.5, sodium: 280 },
  { id: "KOR_073", name: "열무김치", cuisine: "KOREAN", gram: 70, kcal: 20, carbo: 3, protein: 1, fat: 0.3, sodium: 260 },
  { id: "KOR_074", name: "오이소박이", cuisine: "KOREAN", gram: 70, kcal: 25, carbo: 4, protein: 1, fat: 0.5, sodium: 260 },
  { id: "KOR_075", name: "총각김치", cuisine: "KOREAN", gram: 70, kcal: 25, carbo: 4, protein: 1, fat: 0.5, sodium: 280 },
  { id: "KOR_076", name: "파김치", cuisine: "KOREAN", gram: 70, kcal: 25, carbo: 4, protein: 1, fat: 0.5, sodium: 280 },
  { id: "KOR_077", name: "부추김치", cuisine: "KOREAN", gram: 70, kcal: 25, carbo: 4, protein: 1, fat: 0.5, sodium: 260 },
  { id: "KOR_078", name: "깻잎장아찌", cuisine: "KOREAN", gram: 60, kcal: 60, carbo: 6, protein: 2, fat: 3, sodium: 520 },
  { id: "KOR_079", name: "무말랭이무침", cuisine: "KOREAN", gram: 70, kcal: 80, carbo: 14, protein: 2, fat: 2, sodium: 360 },
  { id: "KOR_080", name: "배추겉절이", cuisine: "KOREAN", gram: 70, kcal: 25, carbo: 4, protein: 1, fat: 0.5, sodium: 260 },

  { id: "KOR_081", name: "오징어채무침", cuisine: "KOREAN", gram: 90, kcal: 140, carbo: 12, protein: 10, fat: 5, sodium: 520 },
  { id: "KOR_082", name: "골뱅이무침", cuisine: "KOREAN", gram: 120, kcal: 200, carbo: 18, protein: 13, fat: 6, sodium: 620 },
  { id: "KOR_083", name: "막국수", cuisine: "KOREAN", gram: 380, kcal: 540, carbo: 88, protein: 14, fat: 10, sodium: 960 },
  { id: "KOR_084", name: "냉모밀", cuisine: "KOREAN", gram: 380, kcal: 500, carbo: 82, protein: 14, fat: 7, sodium: 880 },
  { id: "KOR_085", name: "비빔막국수", cuisine: "KOREAN", gram: 380, kcal: 560, carbo: 90, protein: 15, fat: 10, sodium: 980 },
  { id: "KOR_086", name: "한우불고기", cuisine: "KOREAN", gram: 200, kcal: 420, carbo: 16, protein: 24, fat: 26, sodium: 820 },
  { id: "KOR_087", name: "닭다리구이", cuisine: "KOREAN", gram: 200, kcal: 380, carbo: 6, protein: 28, fat: 26, sodium: 520 },
  { id: "KOR_088", name: "고추장삼겹구이", cuisine: "KOREAN", gram: 180, kcal: 520, carbo: 10, protein: 20, fat: 44, sodium: 720 },
  { id: "KOR_089", name: "불족발", cuisine: "KOREAN", gram: 200, kcal: 480, carbo: 18, protein: 26, fat: 30, sodium: 980 },
  { id: "KOR_090", name: "양념돼지갈비", cuisine: "KOREAN", gram: 220, kcal: 560, carbo: 24, protein: 24, fat: 32, sodium: 940 },

  { id: "KOR_091", name: "해물파볶음밥", cuisine: "KOREAN", gram: 320, kcal: 580, carbo: 82, protein: 18, fat: 16, sodium: 920 },
  { id: "KOR_092", name: "베이컨김치볶음밥", cuisine: "KOREAN", gram: 320, kcal: 600, carbo: 80, protein: 17, fat: 20, sodium: 1120 },
  { id: "KOR_093", name: "우삼겹볶음밥", cuisine: "KOREAN", gram: 320, kcal: 620, carbo: 78, protein: 19, fat: 22, sodium: 980 },
  { id: "KOR_094", name: "닭가슴살덮밥", cuisine: "KOREAN", gram: 320, kcal: 520, carbo: 72, protein: 24, fat: 10, sodium: 820 },
  { id: "KOR_095", name: "버섯덮밥", cuisine: "KOREAN", gram: 320, kcal: 500, carbo: 78, protein: 12, fat: 10, sodium: 760 },
  { id: "KOR_096", name: "참치마요삼각김밥", cuisine: "KOREAN", gram: 110, kcal: 210, carbo: 32, protein: 5, fat: 7, sodium: 420 },
  { id: "KOR_097", name: "불고기삼각김밥", cuisine: "KOREAN", gram: 110, kcal: 220, carbo: 33, protein: 6, fat: 7, sodium: 440 },
  { id: "KOR_098", name: "충무김밥", cuisine: "KOREAN", gram: 230, kcal: 420, carbo: 78, protein: 10, fat: 6, sodium: 720 },
  { id: "KOR_099", name: "유부초밥", cuisine: "KOREAN", gram: 200, kcal: 380, carbo: 64, protein: 9, fat: 9, sodium: 580 },
  { id: "KOR_100", name: "볶음김치주먹밥", cuisine: "KOREAN", gram: 220, kcal: 420, carbo: 68, protein: 9, fat: 9, sodium: 780 },

  { id: "KOR_101", name: "치즈주먹밥", cuisine: "KOREAN", gram: 220, kcal: 440, carbo: 70, protein: 10, fat: 10, sodium: 820 },
  { id: "KOR_102", name: "간장버터밥", cuisine: "KOREAN", gram: 230, kcal: 420, carbo: 64, protein: 7, fat: 12, sodium: 680 },
  { id: "KOR_103", name: "버터장조림비빔밥", cuisine: "KOREAN", gram: 320, kcal: 620, carbo: 80, protein: 20, fat: 20, sodium: 980 },
  { id: "KOR_104", name: "참치김치전", cuisine: "KOREAN", gram: 190, kcal: 440, carbo: 48, protein: 10, fat: 20, sodium: 980 },
  { id: "KOR_105", name: "고추장두부조림", cuisine: "KOREAN", gram: 180, kcal: 260, carbo: 10, protein: 16, fat: 16, sodium: 720 },
  { id: "KOR_106", name: "두부김치", cuisine: "KOREAN", gram: 200, kcal: 320, carbo: 14, protein: 18, fat: 18, sodium: 820 },
  { id: "KOR_107", name: "간장두부조림", cuisine: "KOREAN", gram: 180, kcal: 240, carbo: 8, protein: 16, fat: 14, sodium: 700 },
  { id: "KOR_108", name: "해물된장찌개", cuisine: "KOREAN", gram: 360, kcal: 290, carbo: 13, protein: 18, fat: 15, sodium: 1000 },
  { id: "KOR_109", name: "차돌김치볶음밥", cuisine: "KOREAN", gram: 330, kcal: 640, carbo: 82, protein: 18, fat: 22, sodium: 1180 },
  { id: "KOR_110", name: "마늘보쌈정식", cuisine: "KOREAN", gram: 420, kcal: 780, carbo: 46, protein: 32, fat: 46, sodium: 1340 }

];

// ============================================================
// 2. 중식 (CHINESE)
// ============================================================
/** @type {FoodItem[]} */
export const CHINESE_FOOD_DATA = [
  { id: "CHI_001", name: "짜장면", cuisine: "CHINESE", gram: 400, kcal: 740, carbo: 110, protein: 17, fat: 22, sodium: 1250 },
  { id: "CHI_002", name: "짬뽕", cuisine: "CHINESE", gram: 450, kcal: 680, carbo: 82, protein: 32, fat: 20, sodium: 1680 },
  { id: "CHI_003", name: "간짜장", cuisine: "CHINESE", gram: 420, kcal: 780, carbo: 105, protein: 22, fat: 27, sodium: 1350 },
  { id: "CHI_004", name: "볶음짬뽕", cuisine: "CHINESE", gram: 420, kcal: 800, carbo: 98, protein: 28, fat: 32, sodium: 1580 },
  { id: "CHI_005", name: "탕수육", cuisine: "CHINESE", gram: 250, kcal: 610, carbo: 70, protein: 20, fat: 26, sodium: 820 },
  { id: "CHI_006", name: "깐풍기", cuisine: "CHINESE", gram: 250, kcal: 720, carbo: 60, protein: 28, fat: 38, sodium: 920 },
  { id: "CHI_007", name: "고추잡채", cuisine: "CHINESE", gram: 200, kcal: 420, carbo: 34, protein: 18, fat: 22, sodium: 690 },
  { id: "CHI_008", name: "마파두부", cuisine: "CHINESE", gram: 250, kcal: 420, carbo: 17, protein: 22, fat: 28, sodium: 880 },
  { id: "CHI_009", name: "칠리새우", cuisine: "CHINESE", gram: 240, kcal: 520, carbo: 36, protein: 27, fat: 24, sodium: 880 },
  { id: "CHI_010", name: "양장피", cuisine: "CHINESE", gram: 300, kcal: 450, carbo: 55, protein: 20, fat: 18, sodium: 950 },
  { id: "CHI_011", name: "유산슬", cuisine: "CHINESE", gram: 280, kcal: 380, carbo: 20, protein: 25, fat: 22, sodium: 890 },
  { id: "CHI_012", name: "팔보채", cuisine: "CHINESE", gram: 320, kcal: 480, carbo: 25, protein: 30, fat: 28, sodium: 1020 },
  { id: "CHI_013", name: "유린기", cuisine: "CHINESE", gram: 260, kcal: 690, carbo: 45, protein: 30, fat: 42, sodium: 980 },
  { id: "CHI_014", name: "라조기", cuisine: "CHINESE", gram: 270, kcal: 710, carbo: 40, protein: 32, fat: 45, sodium: 1010 },
  { id: "CHI_015", name: "동파육", cuisine: "CHINESE", gram: 300, kcal: 820, carbo: 15, protein: 28, fat: 70, sodium: 960 },
  { id: "CHI_016", name: "멘보샤", cuisine: "CHINESE", gram: 150, kcal: 510, carbo: 30, protein: 15, fat: 38, sodium: 720 },
  { id: "CHI_017", name: "볶음밥", cuisine: "CHINESE", gram: 380, kcal: 720, carbo: 100, protein: 18, fat: 25, sodium: 1150 },
  { id: "CHI_018", name: "잡채밥", cuisine: "CHINESE", gram: 420, kcal: 780, carbo: 110, protein: 20, fat: 28, sodium: 1280 },
  { id: "CHI_019", name: "짜장밥", cuisine: "CHINESE", gram: 430, kcal: 760, carbo: 115, protein: 19, fat: 24, sodium: 1230 },
  { id: "CHI_020", name: "짬뽕밥", cuisine: "CHINESE", gram: 480, kcal: 700, carbo: 85, protein: 34, fat: 22, sodium: 1700 },
  { id: "CHI_021", name: "마파두부밥", cuisine: "CHINESE", gram: 400, kcal: 690, carbo: 90, protein: 24, fat: 30, sodium: 1100 },
  { id: "CHI_022", name: "유산슬밥", cuisine: "CHINESE", gram: 410, kcal: 650, carbo: 88, protein: 26, fat: 24, sodium: 1050 },
  { id: "CHI_023", name: "새우볶음밥", cuisine: "CHINESE", gram: 390, kcal: 730, carbo: 102, protein: 22, fat: 26, sodium: 1180 },
  { id: "CHI_024", name: "게살볶음밥", cuisine: "CHINESE", gram: 390, kcal: 710, carbo: 100, protein: 20, fat: 24, sodium: 1160 },
  { id: "CHI_025", name: "삼선볶음밥", cuisine: "CHINESE", gram: 400, kcal: 750, carbo: 105, protein: 25, fat: 27, sodium: 1220 },
  { id: "CHI_026", name: "삼선짜장", cuisine: "CHINESE", gram: 430, kcal: 790, carbo: 112, protein: 24, fat: 26, sodium: 1300 },
  { id: "CHI_027", name: "삼선짬뽕", cuisine: "CHINESE", gram: 480, kcal: 730, carbo: 88, protein: 38, fat: 24, sodium: 1720 },
  { id: "CHI_028", name: "사천짜장", cuisine: "CHINESE", gram: 410, kcal: 800, carbo: 110, protein: 23, fat: 28, sodium: 1400 },
  { id: "CHI_029", name: "사천탕수육", cuisine: "CHINESE", gram: 260, kcal: 650, carbo: 75, protein: 22, fat: 28, sodium: 880 },
  { id: "CHI_030", name: "크림새우", cuisine: "CHINESE", gram: 240, kcal: 580, carbo: 40, protein: 25, fat: 35, sodium: 810 },
  { id: "CHI_031", name: "깐쇼새우", cuisine: "CHINESE", gram: 240, kcal: 540, carbo: 38, protein: 26, fat: 26, sodium: 860 },
  { id: "CHI_032", name: "군만두", cuisine: "CHINESE", gram: 180, kcal: 420, carbo: 40, protein: 15, fat: 22, sodium: 650 },
  { id: "CHI_033", name: "물만두", cuisine: "CHINESE", gram: 180, kcal: 320, carbo: 35, protein: 16, fat: 14, sodium: 620 },
  { id: "CHI_034", name: "찐만두", cuisine: "CHINESE", gram: 180, kcal: 310, carbo: 36, protein: 16, fat: 13, sodium: 610 },
  { id: "CHI_035", name: "꽃빵", cuisine: "CHINESE", gram: 100, kcal: 280, carbo: 55, protein: 7, fat: 3, sodium: 400 },
  { id: "CHI_036", name: "해물누룽지탕", cuisine: "CHINESE", gram: 450, kcal: 580, carbo: 70, protein: 25, fat: 22, sodium: 1150 },
  { id: "CHI_037", name: "삼선누룽지탕", cuisine: "CHINESE", gram: 460, kcal: 600, carbo: 72, protein: 28, fat: 23, sodium: 1180 },
  { id: "CHI_038", name: "백짬뽕", cuisine: "CHINESE", gram: 450, kcal: 650, carbo: 80, protein: 30, fat: 18, sodium: 1650 },
  { id: "CHI_039", name: "울면", cuisine: "CHINESE", gram: 470, kcal: 620, carbo: 85, protein: 22, fat: 18, sodium: 1450 },
  { id: "CHI_040", name: "기스면", cuisine: "CHINESE", gram: 460, kcal: 590, carbo: 82, protein: 25, fat: 16, sodium: 1420 },
  { id: "CHI_041", name: "마라탕", cuisine: "CHINESE", gram: 500, kcal: 850, carbo: 40, protein: 30, fat: 65, sodium: 1800 },
  { id: "CHI_042", name: "마라샹궈", cuisine: "CHINESE", gram: 400, kcal: 920, carbo: 35, protein: 28, fat: 75, sodium: 1750 },
  { id: "CHI_043", name: "꿔바로우", cuisine: "CHINESE", gram: 230, kcal: 630, carbo: 65, protein: 18, fat: 32, sodium: 780 },
  { id: "CHI_044", name: "계란탕", cuisine: "CHINESE", gram: 300, kcal: 250, carbo: 10, protein: 15, fat: 18, sodium: 850 },
  { id: "CHI_045", name: "오향장육", cuisine: "CHINESE", gram: 220, kcal: 480, carbo: 8, protein: 30, fat: 35, sodium: 820 },
  { id: "CHI_046", name: "해파리냉채", cuisine: "CHINESE", gram: 180, kcal: 220, carbo: 20, protein: 15, fat: 10, sodium: 700 },
  { id: "CHI_047", name: "난자완스", cuisine: "CHINESE", gram: 280, kcal: 600, carbo: 25, protein: 28, fat: 45, sodium: 940 },
  { id: "CHI_048", name: "경장육사", cuisine: "CHINESE", gram: 250, kcal: 530, carbo: 20, protein: 26, fat: 38, sodium: 880 },
  { id: "CHI_049", name: "부추잡채", cuisine: "CHINESE", gram: 210, kcal: 400, carbo: 30, protein: 16, fat: 24, sodium: 680 },
  { id: "CHI_050", name: "잡탕밥", cuisine: "CHINESE", gram: 430, kcal: 700, carbo: 95, protein: 28, fat: 25, sodium: 1250 },
  { id: "CHI_051", name: "새우완자탕", cuisine: "CHINESE", gram: 350, kcal: 320, carbo: 15, protein: 22, fat: 18, sodium: 920 },
  { id: "CHI_052", name: "해물우동", cuisine: "CHINESE", gram: 480, kcal: 630, carbo: 90, protein: 26, fat: 17, sodium: 1500 },
  { id: "CHI_053", name: "삼선우동", cuisine: "CHINESE", gram: 490, kcal: 650, carbo: 92, protein: 28, fat: 18, sodium: 1520 },
  { id: "CHI_054", name: "고추짬뽕", cuisine: "CHINESE", gram: 460, kcal: 720, carbo: 85, protein: 34, fat: 23, sodium: 1750 },
  { id: "CHI_055", name: "차돌짬뽕", cuisine: "CHINESE", gram: 490, kcal: 880, carbo: 80, protein: 40, fat: 42, sodium: 1820 },
  { id: "CHI_056", name: "굴짬뽕", cuisine: "CHINESE", gram: 470, kcal: 700, carbo: 83, protein: 36, fat: 21, sodium: 1710 },
  { id: "CHI_057", name: "중국냉면", cuisine: "CHINESE", gram: 500, kcal: 610, carbo: 95, protein: 20, fat: 15, sodium: 1350 },
  { id: "CHI_058", name: "어향동고", cuisine: "CHINESE", gram: 280, kcal: 560, carbo: 30, protein: 25, fat: 38, sodium: 930 },
  { id: "CHI_059", name: "전가복", cuisine: "CHINESE", gram: 350, kcal: 530, carbo: 28, protein: 35, fat: 30, sodium: 1050 },
  { id: "CHI_060", name: "양고기볶음", cuisine: "CHINESE", gram: 250, kcal: 620, carbo: 12, protein: 28, fat: 50, sodium: 880 },
  { id: "CHI_061", name: "마라롱샤", cuisine: "CHINESE", gram: 300, kcal: 580, carbo: 20, protein: 30, fat: 42, sodium: 1100 },
  { id: "CHI_062", name: "지삼선", cuisine: "CHINESE", gram: 280, kcal: 480, carbo: 35, protein: 8, fat: 35, sodium: 850 },
  { id: "CHI_063", name: "어향가지", cuisine: "CHINESE", gram: 260, kcal: 450, carbo: 30, protein: 10, fat: 32, sodium: 830 },
  { id: "CHI_064", name: "건두부볶음", cuisine: "CHINESE", gram: 220, kcal: 390, carbo: 15, protein: 20, fat: 28, sodium: 780 },
  { id: "CHI_065", name: "토마토계란볶음", cuisine: "CHINESE", gram: 230, kcal: 340, carbo: 18, protein: 16, fat: 25, sodium: 710 },
  { id: "CHI_066", name: "연유꽃빵", cuisine: "CHINESE", gram: 130, kcal: 410, carbo: 60, protein: 8, fat: 15, sodium: 450 },
  { id: "CHI_067", name: "샤오롱바오", cuisine: "CHINESE", gram: 150, kcal: 360, carbo: 30, protein: 18, fat: 20, sodium: 580 },
  { id: "CHI_068", name: "우육면", cuisine: "CHINESE", gram: 500, kcal: 730, carbo: 85, protein: 35, fat: 28, sodium: 1600 },
  { id: "CHI_069", name: "딴딴면", cuisine: "CHINESE", gram: 450, kcal: 780, carbo: 90, protein: 25, fat: 35, sodium: 1550 },
  { id: "CHI_070", name: "해물짜장면", cuisine: "CHINESE", gram: 440, kcal: 770, carbo: 112, protein: 23, fat: 24, sodium: 1280 },
  { id: "CHI_071", name: "쟁반짜장", cuisine: "CHINESE", gram: 600, kcal: 1250, carbo: 180, protein: 40, fat: 45, sodium: 2100 },
  { id: "CHI_072", name: "쟁반짬뽕", cuisine: "CHINESE", gram: 650, kcal: 1180, carbo: 150, protein: 50, fat: 42, sodium: 2400 },
  { id: "CHI_073", name: "고추잡채밥", cuisine: "CHINESE", gram: 400, kcal: 680, carbo: 92, protein: 20, fat: 24, sodium: 980 },
  { id: "CHI_074", name: "유니짜장", cuisine: "CHINESE", gram: 410, kcal: 750, carbo: 108, protein: 18, fat: 23, sodium: 1260 },
  { id: "CHI_075", name: "새우완자", cuisine: "CHINESE", gram: 200, kcal: 410, carbo: 25, protein: 20, fat: 28, sodium: 780 },
  { id: "CHI_076", name: "깐풍새우", cuisine: "CHINESE", gram: 240, kcal: 560, carbo: 38, protein: 28, fat: 32, sodium: 900 },
  { id: "CHI_077", name: "유린육", cuisine: "CHINESE", gram: 260, kcal: 670, carbo: 42, protein: 28, fat: 40, sodium: 960 },
  { id: "CHI_078", name: "라조육", cuisine: "CHINESE", gram: 270, kcal: 690, carbo: 38, protein: 30, fat: 43, sodium: 990 },
  { id: "CHI_079", name: "짜춘권", cuisine: "CHINESE", gram: 150, kcal: 380, carbo: 35, protein: 12, fat: 22, sodium: 630 },
  { id: "CHI_080", name: "춘권", cuisine: "CHINESE", gram: 140, kcal: 360, carbo: 33, protein: 11, fat: 20, sodium: 610 },
  { id: "CHI_081", name: "게살스프", cuisine: "CHINESE", gram: 250, kcal: 280, carbo: 20, protein: 15, fat: 16, sodium: 750 },
  { id: "CHI_082", name: "산라탕", cuisine: "CHINESE", gram: 280, kcal: 310, carbo: 18, protein: 16, fat: 20, sodium: 820 },
  { id: "CHI_083", name: "오향족발", cuisine: "CHINESE", gram: 280, kcal: 730, carbo: 10, protein: 32, fat: 65, sodium: 910 },
  { id: "CHI_084", name: "새우춘권", cuisine: "CHINESE", gram: 150, kcal: 390, carbo: 34, protein: 14, fat: 23, sodium: 640 },
  { id: "CHI_085", name: "소고기볶음", cuisine: "CHINESE", gram: 240, kcal: 580, carbo: 15, protein: 28, fat: 45, sodium: 870 },
  { id: "CHI_086", name: "청경채볶음", cuisine: "CHINESE", gram: 180, kcal: 210, carbo: 10, protein: 5, fat: 18, sodium: 550 },
  { id: "CHI_087", name: "사천식닭날개", cuisine: "CHINESE", gram: 220, kcal: 630, carbo: 20, protein: 25, fat: 50, sodium: 930 },
  { id: "CHI_088", name: "오이무침", cuisine: "CHINESE", gram: 120, kcal: 130, carbo: 10, protein: 3, fat: 9, sodium: 480 },
  { id: "CHI_089", name: "짜사이", cuisine: "CHINESE", gram: 80, kcal: 70, carbo: 6, protein: 2, fat: 5, sodium: 600 },
  { id: "CHI_090", name: "탕수만두", cuisine: "CHINESE", gram: 250, kcal: 600, carbo: 65, protein: 18, fat: 30, sodium: 840 },
  { id: "CHI_091", name: "고기튀김", cuisine: "CHINESE", gram: 200, kcal: 550, carbo: 30, protein: 20, fat: 38, sodium: 760 },
  { id: "CHI_092", name: "새우탕수육", cuisine: "CHINESE", gram: 240, kcal: 590, carbo: 65, protein: 22, fat: 28, sodium: 810 },
  { id: "CHI_093", name: "해물덮밥", cuisine: "CHINESE", gram: 420, kcal: 670, carbo: 93, protein: 26, fat: 22, sodium: 1210 },
  { id: "CHI_094", name: "송이덮밥", cuisine: "CHINESE", gram: 410, kcal: 640, carbo: 90, protein: 20, fat: 23, sodium: 1080 },
  { id: "CHI_095", name: "죽순볶음", cuisine: "CHINESE", gram: 200, kcal: 280, carbo: 15, protein: 8, fat: 22, sodium: 730 },
  { id: "CHI_096", name: "매운짜장면", cuisine: "CHINESE", gram: 410, kcal: 760, carbo: 111, protein: 18, fat: 24, sodium: 1300 },
  { id: "CHI_097", name: "고기짬뽕", cuisine: "CHINESE", gram: 480, kcal: 850, carbo: 78, protein: 38, fat: 40, sodium: 1800 },
  { id: "CHI_098", name: "찹쌀탕수육", cuisine: "CHINESE", gram: 240, kcal: 640, carbo: 72, protein: 19, fat: 30, sodium: 800 },
  { id: "CHI_099", name: "칠리만두", cuisine: "CHINESE", gram: 230, kcal: 530, carbo: 55, protein: 16, fat: 25, sodium: 870 },
  { id: "CHI_100", name: "크림탕수육", cuisine: "CHINESE", gram: 260, kcal: 670, carbo: 70, protein: 20, fat: 35, sodium: 830 },
  { id: "CHI_101", name: "매운탕수육", cuisine: "CHINESE", gram: 260, kcal: 630, carbo: 72, protein: 20, fat: 27, sodium: 860 },
  { id: "CHI_102", name: "볶음우동", cuisine: "CHINESE", gram: 400, kcal: 700, carbo: 95, protein: 20, fat: 25, sodium: 1350 },
  { id: "CHI_103", name: "마라우육면", cuisine: "CHINESE", gram: 510, kcal: 820, carbo: 88, protein: 36, fat: 35, sodium: 1780 },
  { id: "CHI_104", name: "마파가지밥", cuisine: "CHINESE", gram: 400, kcal: 670, carbo: 88, protein: 18, fat: 28, sodium: 1060 },
  { id: "CHI_105", name: "공기밥", cuisine: "CHINESE", gram: 210, kcal: 310, carbo: 70, protein: 5, fat: 1, sodium: 10 },
  { id: "CHI_106", name: "계란볶음밥", cuisine: "CHINESE", gram: 370, kcal: 700, carbo: 98, protein: 19, fat: 24, sodium: 1130 },
  { id: "CHI_107", name: "소고기짜장면", cuisine: "CHINESE", gram: 430, kcal: 810, carbo: 115, protein: 24, fat: 28, sodium: 1320 },
  { id: "CHI_108", name: "해물백짬뽕", cuisine: "CHINESE", gram: 470, kcal: 670, carbo: 82, protein: 35, fat: 20, sodium: 1680 },
  { id: "CHI_109", name: "유슬짜장", cuisine: "CHINESE", gram: 420, kcal: 770, carbo: 108, protein: 22, fat: 26, sodium: 1290 }
];

// ============================================================
// 3. 일식 (JAPANESE)
// ============================================================
/** @type {FoodItem[]} */
export const JAPANESE_FOOD_DATA = [
  { id: "JPN_001", name: "규동", cuisine: "JAPANESE", gram: 350, kcal: 650, carbo: 82, protein: 24, fat: 20, sodium: 1100 },
  { id: "JPN_002", name: "가츠동", cuisine: "JAPANESE", gram: 360, kcal: 720, carbo: 88, protein: 26, fat: 24, sodium: 1150 },
  { id: "JPN_003", name: "연어초밥(모둠)", cuisine: "JAPANESE", gram: 280, kcal: 520, carbo: 72, protein: 24, fat: 14, sodium: 860 },
  { id: "JPN_004", name: "모둠초밥", cuisine: "JAPANESE", gram: 300, kcal: 560, carbo: 78, protein: 26, fat: 15, sodium: 880 },
  { id: "JPN_005", name: "야키소바", cuisine: "JAPANESE", gram: 320, kcal: 630, carbo: 90, protein: 18, fat: 18, sodium: 980 },
  { id: "JPN_006", name: "오코노미야키", cuisine: "JAPANESE", gram: 300, kcal: 650, carbo: 72, protein: 22, fat: 28, sodium: 1020 },
  { id: "JPN_007", name: "카레우동(일식)", cuisine: "JAPANESE", gram: 380, kcal: 690, carbo: 96, protein: 20, fat: 18, sodium: 1300 },
  { id: "JPN_008", name: "돈카츠정식", cuisine: "JAPANESE", gram: 420, kcal: 780, carbo: 82, protein: 32, fat: 34, sodium: 1180 },
  { id: "JPN_009", name: "치킨가라아게정식", cuisine: "JAPANESE", gram: 430, kcal: 760, carbo: 84, protein: 30, fat: 32, sodium: 1120 },
  { id: "JPN_010", name: "스키야키", cuisine: "JAPANESE", gram: 450, kcal: 720, carbo: 40, protein: 36, fat: 42, sodium: 1350 },
  { id: "JPN_011", name: "야키토리덮밥", cuisine: "JAPANESE", gram: 360, kcal: 640, carbo: 82, protein: 26, fat: 16, sodium: 980 },
  { id: "JPN_012", name: "규마요덮밥", cuisine: "JAPANESE", gram: 350, kcal: 670, carbo: 85, protein: 25, fat: 18, sodium: 1000 },
  { id: "JPN_013", name: "사케동(연어덮밥)", cuisine: "JAPANESE", gram: 330, kcal: 620, carbo: 76, protein: 28, fat: 20, sodium: 940 },
  { id: "JPN_014", name: "스시롤(캘리포니아롤)", cuisine: "JAPANESE", gram: 220, kcal: 450, carbo: 66, protein: 12, fat: 12, sodium: 620 },
  { id: "JPN_015", name: "참치마요롤", cuisine: "JAPANESE", gram: 230, kcal: 480, carbo: 68, protein: 14, fat: 14, sodium: 650 },
  { id: "JPN_016", name: "새우튀김우동", cuisine: "JAPANESE", gram: 420, kcal: 620, carbo: 86, protein: 17, fat: 14, sodium: 1180 },
  { id: "JPN_017", name: "유부우동", cuisine: "JAPANESE", gram: 400, kcal: 520, carbo: 82, protein: 12, fat: 8, sodium: 1040 },

  { id: "JPN_018", name: "냉우동", cuisine: "JAPANESE", gram: 380, kcal: 480, carbo: 78, protein: 13, fat: 6, sodium: 960 },
  { id: "JPN_019", name: "미니가츠동", cuisine: "JAPANESE", gram: 300, kcal: 580, carbo: 70, protein: 20, fat: 20, sodium: 900 },
  { id: "JPN_020", name: "참치사시미정식", cuisine: "JAPANESE", gram: 320, kcal: 520, carbo: 52, protein: 30, fat: 14, sodium: 720 },
  { id: "JPN_021", name: "연어사시미정식", cuisine: "JAPANESE", gram: 320, kcal: 540, carbo: 50, protein: 32, fat: 16, sodium: 740 },
  { id: "JPN_022", name: "사바정식(고등어)", cuisine: "JAPANESE", gram: 360, kcal: 600, carbo: 38, protein: 32, fat: 30, sodium: 880 },
  { id: "JPN_023", name: "에비동(새우덮밥)", cuisine: "JAPANESE", gram: 340, kcal: 580, carbo: 80, protein: 20, fat: 16, sodium: 960 },
  { id: "JPN_024", name: "텐동(튀김덮밥)", cuisine: "JAPANESE", gram: 360, kcal: 700, carbo: 84, protein: 22, fat: 26, sodium: 1020 },
  { id: "JPN_025", name: "장어덮밥", cuisine: "JAPANESE", gram: 380, kcal: 760, carbo: 86, protein: 28, fat: 28, sodium: 1100 },
  { id: "JPN_026", name: "오야코동", cuisine: "JAPANESE", gram: 340, kcal: 560, carbo: 76, protein: 22, fat: 14, sodium: 900 },
  { id: "JPN_027", name: "돈부리", cuisine: "JAPANESE", gram: 330, kcal: 600, carbo: 78, protein: 24, fat: 16, sodium: 920 },

  { id: "JPN_028", name: "소바정식", cuisine: "JAPANESE", gram: 330, kcal: 520, carbo: 82, protein: 16, fat: 8, sodium: 780 },
  { id: "JPN_029", name: "야채튀김정식", cuisine: "JAPANESE", gram: 360, kcal: 620, carbo: 76, protein: 16, fat: 26, sodium: 920 },
  { id: "JPN_030", name: "가라아게카레", cuisine: "JAPANESE", gram: 380, kcal: 680, carbo: 92, protein: 22, fat: 20, sodium: 1080 },
  { id: "JPN_031", name: "규카레", cuisine: "JAPANESE", gram: 380, kcal: 720, carbo: 96, protein: 26, fat: 22, sodium: 1100 },
  { id: "JPN_032", name: "해물카레", cuisine: "JAPANESE", gram: 380, kcal: 640, carbo: 90, protein: 24, fat: 16, sodium: 1020 },
  { id: "JPN_033", name: "히레카츠정식", cuisine: "JAPANESE", gram: 420, kcal: 760, carbo: 84, protein: 32, fat: 30, sodium: 1150 },
  { id: "JPN_034", name: "멘치카츠정식", cuisine: "JAPANESE", gram: 430, kcal: 780, carbo: 86, protein: 28, fat: 34, sodium: 1180 },
  { id: "JPN_035", name: "일본식참치덮밥", cuisine: "JAPANESE", gram: 330, kcal: 580, carbo: 72, protein: 26, fat: 14, sodium: 840 },
  { id: "JPN_036", name: "냉모밀정식", cuisine: "JAPANESE", gram: 360, kcal: 500, carbo: 82, protein: 14, fat: 7, sodium: 780 },
  { id: "JPN_037", name: "야키니쿠정식", cuisine: "JAPANESE", gram: 410, kcal: 680, carbo: 48, protein: 32, fat: 34, sodium: 980 },

  { id: "JPN_038", name: "일본식달걀찜", cuisine: "JAPANESE", gram: 180, kcal: 160, carbo: 6, protein: 13, fat: 10, sodium: 380 },
  { id: "JPN_039", name: "일본식감자샐러드", cuisine: "JAPANESE", gram: 160, kcal: 240, carbo: 28, protein: 4, fat: 12, sodium: 360 },
  { id: "JPN_040", name: "새우튀김", cuisine: "JAPANESE", gram: 150, kcal: 320, carbo: 26, protein: 12, fat: 18, sodium: 480 },
  { id: "JPN_041", name: "야채튀김", cuisine: "JAPANESE", gram: 160, kcal: 280, carbo: 32, protein: 5, fat: 12, sodium: 400 },
  { id: "JPN_042", name: "가츠산도", cuisine: "JAPANESE", gram: 230, kcal: 540, carbo: 52, protein: 20, fat: 26, sodium: 640 },
  { id: "JPN_043", name: "에비산도", cuisine: "JAPANESE", gram: 230, kcal: 520, carbo: 58, protein: 18, fat: 20, sodium: 620 },
  { id: "JPN_044", name: "야키소바빵", cuisine: "JAPANESE", gram: 220, kcal: 480, carbo: 70, protein: 12, fat: 14, sodium: 620 },
  { id: "JPN_045", name: "일본식핫도그", cuisine: "JAPANESE", gram: 240, kcal: 520, carbo: 64, protein: 14, fat: 18, sodium: 680 },
  { id: "JPN_046", name: "삼겹규동", cuisine: "JAPANESE", gram: 360, kcal: 720, carbo: 84, protein: 24, fat: 26, sodium: 1160 },
  { id: "JPN_047", name: "매운가츠동", cuisine: "JAPANESE", gram: 360, kcal: 740, carbo: 80, protein: 28, fat: 30, sodium: 1180 },

  { id: "JPN_048", name: "마요규동", cuisine: "JAPANESE", gram: 350, kcal: 700, carbo: 84, protein: 25, fat: 22, sodium: 1140 },
  { id: "JPN_049", name: "에비우동", cuisine: "JAPANESE", gram: 410, kcal: 600, carbo: 82, protein: 15, fat: 12, sodium: 1080 },
  { id: "JPN_050", name: "가케소바", cuisine: "JAPANESE", gram: 380, kcal: 480, carbo: 76, protein: 14, fat: 7, sodium: 860 },

  { id: "JPN_051", name: "부타동", cuisine: "JAPANESE", gram: 350, kcal: 670, carbo: 82, protein: 26, fat: 18, sodium: 1020 },
  { id: "JPN_052", name: "치킨난반", cuisine: "JAPANESE", gram: 380, kcal: 720, carbo: 70, protein: 28, fat: 32, sodium: 1040 },
  { id: "JPN_053", name: "명란크림우동", cuisine: "JAPANESE", gram: 380, kcal: 620, carbo: 88, protein: 15, fat: 16, sodium: 1120 },
  { id: "JPN_054", name: "일본식오므라이스", cuisine: "JAPANESE", gram: 380, kcal: 630, carbo: 90, protein: 20, fat: 18, sodium: 900 },
  { id: "JPN_055", name: "초밥세트A", cuisine: "JAPANESE", gram: 300, kcal: 560, carbo: 78, protein: 24, fat: 16, sodium: 900 },
  { id: "JPN_056", name: "초밥세트B", cuisine: "JAPANESE", gram: 310, kcal: 580, carbo: 80, protein: 25, fat: 16, sodium: 920 },
  { id: "JPN_057", name: "특초밥세트", cuisine: "JAPANESE", gram: 330, kcal: 620, carbo: 82, protein: 28, fat: 18, sodium: 980 },
  { id: "JPN_058", name: "연어롤", cuisine: "JAPANESE", gram: 240, kcal: 480, carbo: 66, protein: 16, fat: 12, sodium: 620 },
  { id: "JPN_059", name: "스파이시참치롤", cuisine: "JAPANESE", gram: 240, kcal: 500, carbo: 68, protein: 15, fat: 14, sodium: 650 },
  { id: "JPN_060", name: "새우롤", cuisine: "JAPANESE", gram: 240, kcal: 460, carbo: 66, protein: 12, fat: 10, sodium: 600 },

  { id: "JPN_061", name: "일식규카츠", cuisine: "JAPANESE", gram: 360, kcal: 720, carbo: 60, protein: 30, fat: 36, sodium: 1000 },
  { id: "JPN_062", name: "사케마요덮밥", cuisine: "JAPANESE", gram: 340, kcal: 620, carbo: 76, protein: 26, fat: 20, sodium: 960 },
  { id: "JPN_063", name: "스파이시가츠동", cuisine: "JAPANESE", gram: 360, kcal: 750, carbo: 82, protein: 28, fat: 30, sodium: 1180 },
  { id: "JPN_064", name: "아부리연어덮밥", cuisine: "JAPANESE", gram: 330, kcal: 640, carbo: 74, protein: 28, fat: 22, sodium: 940 },
  { id: "JPN_065", name: "명란덮밥", cuisine: "JAPANESE", gram: 320, kcal: 580, carbo: 70, protein: 22, fat: 18, sodium: 880 },
  { id: "JPN_066", name: "일식새우튀김덮밥", cuisine: "JAPANESE", gram: 350, kcal: 660, carbo: 78, protein: 22, fat: 22, sodium: 1020 },
  { id: "JPN_067", name: "일본식고로케정식", cuisine: "JAPANESE", gram: 340, kcal: 560, carbo: 70, protein: 14, fat: 22, sodium: 680 },
  { id: "JPN_068", name: "치킨가츠동", cuisine: "JAPANESE", gram: 350, kcal: 700, carbo: 80, protein: 26, fat: 26, sodium: 1100 },
  { id: "JPN_069", name: "돈치즈가츠정식", cuisine: "JAPANESE", gram: 420, kcal: 820, carbo: 84, protein: 32, fat: 36, sodium: 1180 },
  { id: "JPN_070", name: "연어가츠동", cuisine: "JAPANESE", gram: 340, kcal: 640, carbo: 74, protein: 26, fat: 20, sodium: 940 },

  { id: "JPN_071", name: "연어알덮밥", cuisine: "JAPANESE", gram: 330, kcal: 600, carbo: 72, protein: 24, fat: 20, sodium: 860 },
  { id: "JPN_072", name: "가츠나베", cuisine: "JAPANESE", gram: 380, kcal: 680, carbo: 60, protein: 28, fat: 30, sodium: 1100 },
  { id: "JPN_073", name: "일본식된장국정식", cuisine: "JAPANESE", gram: 330, kcal: 380, carbo: 20, protein: 18, fat: 14, sodium: 800 },
  { id: "JPN_074", name: "고로케카레", cuisine: "JAPANESE", gram: 360, kcal: 650, carbo: 92, protein: 20, fat: 16, sodium: 1040 },
  { id: "JPN_075", name: "치킨규동", cuisine: "JAPANESE", gram: 350, kcal: 640, carbo: 82, protein: 25, fat: 20, sodium: 1000 },
  { id: "JPN_076", name: "우동카레", cuisine: "JAPANESE", gram: 380, kcal: 610, carbo: 88, protein: 16, fat: 14, sodium: 1100 },
  { id: "JPN_077", name: "텐자루소바", cuisine: "JAPANESE", gram: 380, kcal: 560, carbo: 82, protein: 16, fat: 10, sodium: 760 },
  { id: "JPN_078", name: "일식야끼니꾸동", cuisine: "JAPANESE", gram: 350, kcal: 680, carbo: 80, protein: 26, fat: 24, sodium: 1040 },
  { id: "JPN_079", name: "스파이시연어덮밥", cuisine: "JAPANESE", gram: 330, kcal: 620, carbo: 74, protein: 26, fat: 20, sodium: 940 },
  { id: "JPN_080", name: "닭가슴살오야코동", cuisine: "JAPANESE", gram: 340, kcal: 520, carbo: 68, protein: 28, fat: 10, sodium: 900 },

  { id: "JPN_081", name: "오로시돈가츠", cuisine: "JAPANESE", gram: 420, kcal: 740, carbo: 78, protein: 30, fat: 30, sodium: 1060 },
  { id: "JPN_082", name: "일식메밀정식", cuisine: "JAPANESE", gram: 350, kcal: 520, carbo: 82, protein: 15, fat: 8, sodium: 820 },
  { id: "JPN_083", name: "규스키동", cuisine: "JAPANESE", gram: 360, kcal: 680, carbo: 80, protein: 28, fat: 22, sodium: 1080 },
  { id: "JPN_084", name: "치킨난반덮밥", cuisine: "JAPANESE", gram: 360, kcal: 700, carbo: 78, protein: 26, fat: 24, sodium: 1040 },
  { id: "JPN_085", name: "치즈가츠동", cuisine: "JAPANESE", gram: 360, kcal: 740, carbo: 80, protein: 28, fat: 30, sodium: 1160 },
  { id: "JPN_086", name: "가라아게오므라이스", cuisine: "JAPANESE", gram: 380, kcal: 670, carbo: 88, protein: 20, fat: 20, sodium: 1000 },
  { id: "JPN_087", name: "규가츠동", cuisine: "JAPANESE", gram: 360, kcal: 720, carbo: 78, protein: 30, fat: 26, sodium: 1100 },
  { id: "JPN_088", name: "달걀규동", cuisine: "JAPANESE", gram: 350, kcal: 580, carbo: 80, protein: 20, fat: 14, sodium: 940 },
  { id: "JPN_089", name: "사케텐동", cuisine: "JAPANESE", gram: 360, kcal: 660, carbo: 78, protein: 22, fat: 24, sodium: 1000 },
  { id: "JPN_090", name: "스팸오니기리세트", cuisine: "JAPANESE", gram: 260, kcal: 520, carbo: 66, protein: 16, fat: 16, sodium: 880 },

  { id: "JPN_091", name: "연어오니기리세트", cuisine: "JAPANESE", gram: 260, kcal: 500, carbo: 64, protein: 16, fat: 14, sodium: 820 },
  { id: "JPN_092", name: "가츠오야코동", cuisine: "JAPANESE", gram: 350, kcal: 580, carbo: 76, protein: 22, fat: 14, sodium: 960 },
  { id: "JPN_093", name: "에비가츠동", cuisine: "JAPANESE", gram: 360, kcal: 690, carbo: 82, protein: 22, fat: 24, sodium: 1020 },
  { id: "JPN_094", name: "와규규동", cuisine: "JAPANESE", gram: 360, kcal: 760, carbo: 80, protein: 30, fat: 32, sodium: 1120 },
  { id: "JPN_095", name: "와규덮밥", cuisine: "JAPANESE", gram: 360, kcal: 780, carbo: 76, protein: 32, fat: 34, sodium: 1140 },
  { id: "JPN_096", name: "명란아보카도덮밥", cuisine: "JAPANESE", gram: 340, kcal: 640, carbo: 70, protein: 22, fat: 24, sodium: 880 },
  { id: "JPN_097", name: "히야시우동(냉우동)", cuisine: "JAPANESE", gram: 360, kcal: 460, carbo: 78, protein: 12, fat: 6, sodium: 880 },
  { id: "JPN_098", name: "야채가츠동", cuisine: "JAPANESE", gram: 340, kcal: 600, carbo: 82, protein: 18, fat: 14, sodium: 960 },
  { id: "JPN_099", name: "규니쿠우동", cuisine: "JAPANESE", gram: 410, kcal: 590, carbo: 82, protein: 18, fat: 12, sodium: 1080 },
  { id: "JPN_100", name: "가케우동정식", cuisine: "JAPANESE", gram: 430, kcal: 600, carbo: 84, protein: 18, fat: 12, sodium: 1120 },

  { id: "JPN_101", name: "새우크림우동", cuisine: "JAPANESE", gram: 380, kcal: 620, carbo: 86, protein: 16, fat: 18, sodium: 1120 },
  { id: "JPN_102", name: "유부초밥정식", cuisine: "JAPANESE", gram: 300, kcal: 540, carbo: 84, protein: 12, fat: 14, sodium: 900 },
  { id: "JPN_103", name: "아부리연어롤", cuisine: "JAPANESE", gram: 250, kcal: 520, carbo: 64, protein: 18, fat: 16, sodium: 760 },
  { id: "JPN_104", name: "치즈가라아게덮밥", cuisine: "JAPANESE", gram: 360, kcal: 690, carbo: 78, protein: 24, fat: 24, sodium: 1020 },
  { id: "JPN_105", name: "소고기나베정식", cuisine: "JAPANESE", gram: 420, kcal: 640, carbo: 40, protein: 30, fat: 28, sodium: 1000 },
  { id: "JPN_106", name: "새우튀김정식", cuisine: "JAPANESE", gram: 380, kcal: 620, carbo: 70, protein: 22, fat: 22, sodium: 980 },
  { id: "JPN_107", name: "명란크림라멘", cuisine: "JAPANESE", gram: 420, kcal: 680, carbo: 86, protein: 20, fat: 18, sodium: 1280 }

];

// ============================================================
// 4. 양식 (WESTERN)
// ============================================================
/** @type {FoodItem[]} */
export const WESTERN_FOOD_DATA = [
  { id: "WES_001", name: "마르게리타피자", cuisine: "WESTERN", gram: 120, kcal: 250, carbo: 28, protein: 10, fat: 10, sodium: 480 },
  { id: "WES_002", name: "페퍼로니피자", cuisine: "WESTERN", gram: 120, kcal: 290, carbo: 27, protein: 12, fat: 14, sodium: 520 },
  { id: "WES_003", name: "고구마피자", cuisine: "WESTERN", gram: 130, kcal: 300, carbo: 34, protein: 11, fat: 12, sodium: 500 },
  { id: "WES_004", name: "까르보나라파스타", cuisine: "WESTERN", gram: 250, kcal: 620, carbo: 72, protein: 16, fat: 26, sodium: 840 },
  { id: "WES_005", name: "미트소스파스타", cuisine: "WESTERN", gram: 250, kcal: 580, carbo: 78, protein: 18, fat: 17, sodium: 780 },
  { id: "WES_006", name: "알리오올리오", cuisine: "WESTERN", gram: 220, kcal: 520, carbo: 60, protein: 11, fat: 22, sodium: 620 },
  { id: "WES_007", name: "비프스테이크", cuisine: "WESTERN", gram: 250, kcal: 680, carbo: 8, protein: 55, fat: 45, sodium: 420 },
  { id: "WES_008", name: "포크찹", cuisine: "WESTERN", gram: 240, kcal: 620, carbo: 10, protein: 48, fat: 38, sodium: 430 },
  { id: "WES_009", name: "치킨커틀릿", cuisine: "WESTERN", gram: 230, kcal: 560, carbo: 32, protein: 30, fat: 28, sodium: 520 },
  { id: "WES_010", name: "프렌치토스트", cuisine: "WESTERN", gram: 160, kcal: 280, carbo: 38, protein: 9, fat: 10, sodium: 380 },
  { id: "WES_011", name: "에그베네딕트", cuisine: "WESTERN", gram: 210, kcal: 430, carbo: 29, protein: 19, fat: 26, sodium: 690 },
  { id: "WES_012", name: "맥앤치즈", cuisine: "WESTERN", gram: 200, kcal: 420, carbo: 55, protein: 14, fat: 16, sodium: 700 },
  { id: "WES_013", name: "갈릭버터새우", cuisine: "WESTERN", gram: 180, kcal: 300, carbo: 6, protein: 23, fat: 20, sodium: 420 },
  { id: "WES_014", name: "라자냐", cuisine: "WESTERN", gram: 250, kcal: 600, carbo: 62, protein: 26, fat: 28, sodium: 740 },
  { id: "WES_015", name: "미트볼링귀니", cuisine: "WESTERN", gram: 300, kcal: 680, carbo: 90, protein: 24, fat: 22, sodium: 780 },
  { id: "WES_016", name: "치킨리조또", cuisine: "WESTERN", gram: 300, kcal: 540, carbo: 78, protein: 18, fat: 16, sodium: 720 },
  
  { id: "WES_021", name: "토마토파스타", cuisine: "WESTERN", gram: 250, kcal: 520, carbo: 78, protein: 15, fat: 12, sodium: 760 },
  { id: "WES_022", name: "로제파스타", cuisine: "WESTERN", gram: 260, kcal: 640, carbo: 82, protein: 16, fat: 20, sodium: 820 },
  { id: "WES_023", name: "버섯크림파스타", cuisine: "WESTERN", gram: 250, kcal: 600, carbo: 76, protein: 14, fat: 22, sodium: 780 },
  { id: "WES_024", name: "봉골레파스타", cuisine: "WESTERN", gram: 240, kcal: 510, carbo: 70, protein: 18, fat: 14, sodium: 720 },
  { id: "WES_025", name: "치킨파스타", cuisine: "WESTERN", gram: 260, kcal: 650, carbo: 80, protein: 22, fat: 20, sodium: 850 },
  { id: "WES_026", name: "게살파스타", cuisine: "WESTERN", gram: 250, kcal: 570, carbo: 74, protein: 20, fat: 16, sodium: 760 },
  { id: "WES_027", name: "새우크림파스타", cuisine: "WESTERN", gram: 260, kcal: 680, carbo: 82, protein: 21, fat: 24, sodium: 860 },
  { id: "WES_028", name: "토마토리조또", cuisine: "WESTERN", gram: 300, kcal: 580, carbo: 88, protein: 15, fat: 16, sodium: 720 },
  { id: "WES_029", name: "버섯리조또", cuisine: "WESTERN", gram: 300, kcal: 600, carbo: 90, protein: 14, fat: 18, sodium: 740 },
  { id: "WES_030", name: "해산물리조또", cuisine: "WESTERN", gram: 310, kcal: 640, carbo: 92, protein: 19, fat: 20, sodium: 820 },

  { id: "WES_031", name: "크림리조또", cuisine: "WESTERN", gram: 300, kcal: 630, carbo: 88, protein: 15, fat: 19, sodium: 840 },
  { id: "WES_032", name: "치즈리조또", cuisine: "WESTERN", gram: 290, kcal: 670, carbo: 86, protein: 18, fat: 24, sodium: 880 },
  { id: "WES_033", name: "버팔로치킨버거", cuisine: "WESTERN", gram: 250, kcal: 690, carbo: 46, protein: 32, fat: 34, sodium: 1020 },
  { id: "WES_034", name: "더블치즈버거", cuisine: "WESTERN", gram: 260, kcal: 720, carbo: 44, protein: 34, fat: 38, sodium: 1100 },
  { id: "WES_035", name: "아보카도버거", cuisine: "WESTERN", gram: 250, kcal: 650, carbo: 40, protein: 30, fat: 32, sodium: 900 },
  { id: "WES_036", name: "그릴드치킨버거", cuisine: "WESTERN", gram: 240, kcal: 580, carbo: 36, protein: 32, fat: 24, sodium: 860 },
  { id: "WES_037", name: "머쉬룸버거", cuisine: "WESTERN", gram: 250, kcal: 620, carbo: 42, protein: 30, fat: 30, sodium: 940 },
  { id: "WES_038", name: "클래식햄버거", cuisine: "WESTERN", gram: 240, kcal: 600, carbo: 38, protein: 28, fat: 30, sodium: 880 },
  { id: "WES_039", name: "쉬림프버거", cuisine: "WESTERN", gram: 240, kcal: 610, carbo: 40, protein: 26, fat: 30, sodium: 920 },
  { id: "WES_040", name: "스파이시치킨버거", cuisine: "WESTERN", gram: 250, kcal: 700, carbo: 44, protein: 33, fat: 36, sodium: 1080 },

  { id: "WES_041", name: "시금치크림스프", cuisine: "WESTERN", gram: 210, kcal: 240, carbo: 16, protein: 6, fat: 14, sodium: 520 },
  { id: "WES_042", name: "브로콜리수프", cuisine: "WESTERN", gram: 210, kcal: 220, carbo: 17, protein: 6, fat: 11, sodium: 480 },
  { id: "WES_043", name: "옥수수스프", cuisine: "WESTERN", gram: 200, kcal: 210, carbo: 28, protein: 5, fat: 7, sodium: 450 },
  { id: "WES_044", name: "토마토스프", cuisine: "WESTERN", gram: 200, kcal: 190, carbo: 26, protein: 4, fat: 6, sodium: 420 },
  { id: "WES_045", name: "감자스프", cuisine: "WESTERN", gram: 200, kcal: 230, carbo: 30, protein: 4, fat: 9, sodium: 540 },
  { id: "WES_046", name: "바질토마토샐러드", cuisine: "WESTERN", gram: 180, kcal: 240, carbo: 14, protein: 8, fat: 16, sodium: 380 },
  { id: "WES_047", name: "그릭샐러드", cuisine: "WESTERN", gram: 190, kcal: 260, carbo: 12, protein: 8, fat: 20, sodium: 420 },
  { id: "WES_048", name: "로메인샐러드", cuisine: "WESTERN", gram: 150, kcal: 120, carbo: 10, protein: 5, fat: 6, sodium: 200 },
  { id: "WES_049", name: "치킨샐러드", cuisine: "WESTERN", gram: 220, kcal: 320, carbo: 18, protein: 26, fat: 12, sodium: 520 },
  { id: "WES_050", name: "연어샐러드", cuisine: "WESTERN", gram: 230, kcal: 340, carbo: 16, protein: 28, fat: 14, sodium: 540 },

  { id: "WES_051", name: "감바스브런치", cuisine: "WESTERN", gram: 280, kcal: 450, carbo: 18, protein: 24, fat: 30, sodium: 600 },
  { id: "WES_052", name: "브런치플래터", cuisine: "WESTERN", gram: 320, kcal: 520, carbo: 30, protein: 24, fat: 28, sodium: 700 },
  { id: "WES_053", name: "치킨브런치", cuisine: "WESTERN", gram: 320, kcal: 560, carbo: 36, protein: 28, fat: 28, sodium: 720 },
  { id: "WES_054", name: "에그스크램블플레이트", cuisine: "WESTERN", gram: 300, kcal: 420, carbo: 24, protein: 22, fat: 24, sodium: 620 },
  { id: "WES_055", name: "팬케이크세트", cuisine: "WESTERN", gram: 300, kcal: 540, carbo: 82, protein: 12, fat: 18, sodium: 620 },
  { id: "WES_056", name: "프렌치프라이", cuisine: "WESTERN", gram: 150, kcal: 420, carbo: 50, protein: 4, fat: 22, sodium: 520 },
  { id: "WES_057", name: "양념감자", cuisine: "WESTERN", gram: 160, kcal: 450, carbo: 55, protein: 4, fat: 22, sodium: 560 },
  { id: "WES_058", name: "치즈프라이", cuisine: "WESTERN", gram: 170, kcal: 520, carbo: 54, protein: 8, fat: 26, sodium: 720 },
  { id: "WES_059", name: "어니언링", cuisine: "WESTERN", gram: 140, kcal: 380, carbo: 44, protein: 4, fat: 20, sodium: 500 },
  { id: "WES_060", name: "모짜스틱", cuisine: "WESTERN", gram: 120, kcal: 420, carbo: 32, protein: 10, fat: 26, sodium: 460 },

  { id: "WES_061", name: "포테이토피자", cuisine: "WESTERN", gram: 130, kcal: 310, carbo: 34, protein: 12, fat: 14, sodium: 520 },
  { id: "WES_062", name: "콤비네이션피자", cuisine: "WESTERN", gram: 130, kcal: 330, carbo: 36, protein: 13, fat: 16, sodium: 580 },
  { id: "WES_063", name: "바베큐치킨피자", cuisine: "WESTERN", gram: 140, kcal: 360, carbo: 38, protein: 14, fat: 18, sodium: 650 },
  { id: "WES_064", name: "쉬림프피자", cuisine: "WESTERN", gram: 140, kcal: 350, carbo: 40, protein: 15, fat: 14, sodium: 600 },
  { id: "WES_065", name: "고르곤졸라피자", cuisine: "WESTERN", gram: 130, kcal: 320, carbo: 30, protein: 11, fat: 16, sodium: 540 },
  { id: "WES_066", name: "페스토파스타", cuisine: "WESTERN", gram: 240, kcal: 580, carbo: 70, protein: 14, fat: 22, sodium: 760 },
  { id: "WES_067", name: "트러플파스타", cuisine: "WESTERN", gram: 240, kcal: 610, carbo: 72, protein: 16, fat: 24, sodium: 820 },
  { id: "WES_068", name: "살치살스테이크", cuisine: "WESTERN", gram: 260, kcal: 690, carbo: 6, protein: 48, fat: 48, sodium: 540 },
  { id: "WES_069", name: "토마호크스테이크", cuisine: "WESTERN", gram: 300, kcal: 900, carbo: 4, protein: 60, fat: 70, sodium: 600 },
  { id: "WES_070", name: "립아이스테이크", cuisine: "WESTERN", gram: 260, kcal: 780, carbo: 3, protein: 52, fat: 60, sodium: 550 },

  { id: "WES_071", name: "몽골리안비프", cuisine: "WESTERN", gram: 240, kcal: 560, carbo: 28, protein: 32, fat: 28, sodium: 720 },
  { id: "WES_072", name: "치킨텐더", cuisine: "WESTERN", gram: 180, kcal: 460, carbo: 24, protein: 28, fat: 24, sodium: 620 },
  { id: "WES_073", name: "치킨윙세트", cuisine: "WESTERN", gram: 200, kcal: 520, carbo: 16, protein: 30, fat: 32, sodium: 750 },
  { id: "WES_074", name: "바비큐립", cuisine: "WESTERN", gram: 300, kcal: 780, carbo: 40, protein: 40, fat: 42, sodium: 980 },
  { id: "WES_075", name: "포크립", cuisine: "WESTERN", gram: 320, kcal: 820, carbo: 36, protein: 42, fat: 48, sodium: 1020 },
  { id: "WES_076", name: "갈릭버터포테이토", cuisine: "WESTERN", gram: 180, kcal: 380, carbo: 48, protein: 4, fat: 18, sodium: 450 },
  { id: "WES_077", name: "트러플감자", cuisine: "WESTERN", gram: 180, kcal: 420, carbo: 46, protein: 5, fat: 20, sodium: 480 },
  { id: "WES_078", name: "맥앤베이컨", cuisine: "WESTERN", gram: 230, kcal: 520, carbo: 54, protein: 16, fat: 22, sodium: 760 },
  { id: "WES_079", name: "바질크림리조또", cuisine: "WESTERN", gram: 300, kcal: 620, carbo: 88, protein: 14, fat: 20, sodium: 820 },
  { id: "WES_080", name: "머쉬룸오믈렛", cuisine: "WESTERN", gram: 240, kcal: 380, carbo: 12, protein: 20, fat: 28, sodium: 420 },

  { id: "WES_081", name: "치즈오믈렛", cuisine: "WESTERN", gram: 240, kcal: 410, carbo: 10, protein: 22, fat: 30, sodium: 450 },
  { id: "WES_082", name: "햄오믈렛", cuisine: "WESTERN", gram: 240, kcal: 420, carbo: 12, protein: 23, fat: 30, sodium: 480 },
  { id: "WES_083", name: "베이컨오믈렛", cuisine: "WESTERN", gram: 240, kcal: 440, carbo: 11, protein: 24, fat: 32, sodium: 520 },
  { id: "WES_084", name: "토스트세트", cuisine: "WESTERN", gram: 220, kcal: 340, carbo: 46, protein: 10, fat: 12, sodium: 520 },
  { id: "WES_085", name: "베이글세트", cuisine: "WESTERN", gram: 200, kcal: 310, carbo: 52, protein: 9, fat: 8, sodium: 580 },
  { id: "WES_086", name: "크로와상샌드위치", cuisine: "WESTERN", gram: 220, kcal: 480, carbo: 36, protein: 16, fat: 28, sodium: 620 },
  { id: "WES_087", name: "치킨샌드위치", cuisine: "WESTERN", gram: 230, kcal: 520, carbo: 44, protein: 24, fat: 22, sodium: 720 },
  { id: "WES_088", name: "에그샌드위치", cuisine: "WESTERN", gram: 200, kcal: 420, carbo: 36, protein: 12, fat: 22, sodium: 580 },
  { id: "WES_089", name: "베이컨샌드위치", cuisine: "WESTERN", gram: 220, kcal: 540, carbo: 38, protein: 20, fat: 28, sodium: 740 },
  { id: "WES_090", name: "클럽샌드위치", cuisine: "WESTERN", gram: 260, kcal: 620, carbo: 52, protein: 24, fat: 26, sodium: 760 },

  { id: "WES_091", name: "시푸드샐러드", cuisine: "WESTERN", gram: 230, kcal: 350, carbo: 18, protein: 26, fat: 14, sodium: 520 },
  { id: "WES_092", name: "볼로네제파스타", cuisine: "WESTERN", gram: 260, kcal: 610, carbo: 78, protein: 20, fat: 22, sodium: 780 },
  { id: "WES_093", name: "레몬버터연어", cuisine: "WESTERN", gram: 260, kcal: 540, carbo: 8, protein: 32, fat: 40, sodium: 480 },
  { id: "WES_094", name: "크랩케이크", cuisine: "WESTERN", gram: 200, kcal: 420, carbo: 28, protein: 22, fat: 24, sodium: 600 },
  { id: "WES_095", name: "미트로프", cuisine: "WESTERN", gram: 240, kcal: 580, carbo: 22, protein: 28, fat: 38, sodium: 700 },
  { id: "WES_096", name: "바질페스토치킨", cuisine: "WESTERN", gram: 250, kcal: 520, carbo: 12, protein: 36, fat: 28, sodium: 600 },
  { id: "WES_097", name: "그릴드새우", cuisine: "WESTERN", gram: 200, kcal: 260, carbo: 4, protein: 28, fat: 14, sodium: 440 },
  { id: "WES_098", name: "치킨파르마", cuisine: "WESTERN", gram: 260, kcal: 680, carbo: 40, protein: 32, fat: 38, sodium: 860 },
  { id: "WES_099", name: "구운야채플레이트", cuisine: "WESTERN", gram: 220, kcal: 240, carbo: 28, protein: 6, fat: 10, sodium: 280 },
  { id: "WES_100", name: "버섯그라탕", cuisine: "WESTERN", gram: 250, kcal: 530, carbo: 38, protein: 16, fat: 32, sodium: 720 },

  { id: "WES_101", name: "감자그라탕", cuisine: "WESTERN", gram: 250, kcal: 520, carbo: 40, protein: 14, fat: 30, sodium: 700 },
  { id: "WES_102", name: "연어크림파스타", cuisine: "WESTERN", gram: 260, kcal: 670, carbo: 80, protein: 22, fat: 26, sodium: 880 },
  { id: "WES_103", name: "베이컨알프레도", cuisine: "WESTERN", gram: 250, kcal: 700, carbo: 78, protein: 20, fat: 32, sodium: 900 },
  { id: "WES_104", name: "치킨라자냐", cuisine: "WESTERN", gram: 260, kcal: 650, carbo: 68, protein: 22, fat: 28, sodium: 820 },
  { id: "WES_105", name: "칠리콘카르네", cuisine: "WESTERN", gram: 240, kcal: 580, carbo: 42, protein: 26, fat: 28, sodium: 790 },
  { id: "WES_106", name: "바비큐치킨샐러드", cuisine: "WESTERN", gram: 240, kcal: 350, carbo: 22, protein: 26, fat: 14, sodium: 680 },
  { id: "WES_107", name: "시푸드필라프", cuisine: "WESTERN", gram: 300, kcal: 580, carbo: 82, protein: 22, fat: 16, sodium: 760 },
  { id: "WES_108", name: "버섯필라프", cuisine: "WESTERN", gram: 300, kcal: 560, carbo: 86, protein: 18, fat: 14, sodium: 720 },
  { id: "WES_109", name: "치킨필라프", cuisine: "WESTERN", gram: 300, kcal: 600, carbo: 88, protein: 24, fat: 16, sodium: 760 },
  { id: "WES_110", name: "스테이크샐러드", cuisine: "WESTERN", gram: 240, kcal: 390, carbo: 16, protein: 26, fat: 20, sodium: 620 },

  { id: "WES_111", name: "프렌치어니언수프", cuisine: "WESTERN", gram: 230, kcal: 260, carbo: 22, protein: 8, fat: 16, sodium: 680 },
  { id: "WES_112", name: "초리조파스타", cuisine: "WESTERN", gram: 260, kcal: 640, carbo: 78, protein: 20, fat: 24, sodium: 900 },
  { id: "WES_113", name: "치킨시저파스타", cuisine: "WESTERN", gram: 260, kcal: 620, carbo: 80, protein: 22, fat: 20, sodium: 820 },
  { id: "WES_114", name: "버팔로치킨샐러드", cuisine: "WESTERN", gram: 240, kcal: 380, carbo: 20, protein: 26, fat: 20, sodium: 720 },
  { id: "WES_115", name: "시금치리조또", cuisine: "WESTERN", gram: 300, kcal: 580, carbo: 90, protein: 18, fat: 14, sodium: 720 },
  { id: "WES_116", name: "베이컨리조또", cuisine: "WESTERN", gram: 300, kcal: 620, carbo: 92, protein: 20, fat: 16, sodium: 780 },
  { id: "WES_117", name: "크림스테이크파스타", cuisine: "WESTERN", gram: 280, kcal: 720, carbo: 78, protein: 32, fat: 28, sodium: 880 },
  { id: "WES_118", name: "토마토스테이크파스타", cuisine: "WESTERN", gram: 280, kcal: 680, carbo: 82, protein: 30, fat: 22, sodium: 820 },
  { id: "WES_119", name: "알프레도닭가슴살", cuisine: "WESTERN", gram: 260, kcal: 540, carbo: 20, protein: 40, fat: 26, sodium: 720 },
  { id: "WES_120", name: "트러플리조또", cuisine: "WESTERN", gram: 300, kcal: 630, carbo: 88, protein: 16, fat: 20, sodium: 840 }

];

// ============================================================
// 5. 스페인식 (SPANISH)
// ============================================================
/** @type {FoodItem[]} */
export const SPANISH_FOOD_DATA = [
  { id: "SPA_001", name: "감바스알아히요", cuisine: "SPANISH", gram: 220, kcal: 510, carbo: 4, protein: 24, fat: 44, sodium: 650 },
  { id: "SPA_002", name: "해산물빠에야", cuisine: "SPANISH", gram: 320, kcal: 620, carbo: 82, protein: 26, fat: 18, sodium: 980 },
  { id: "SPA_003", name: "치킨빠에야", cuisine: "SPANISH", gram: 320, kcal: 600, carbo: 80, protein: 28, fat: 16, sodium: 940 },
  { id: "SPA_004", name: "스페인또르티야", cuisine: "SPANISH", gram: 200, kcal: 420, carbo: 32, protein: 14, fat: 24, sodium: 620 },
  { id: "SPA_005", name: "추로스", cuisine: "SPANISH", gram: 120, kcal: 380, carbo: 44, protein: 5, fat: 20, sodium: 260 },
  { id: "SPA_006", name: "하몽샐러드", cuisine: "SPANISH", gram: 220, kcal: 300, carbo: 10, protein: 18, fat: 18, sodium: 520 },
];

// ============================================================
// 6. 야식 (LATE_NIGHT)
// ============================================================
/** @type {FoodItem[]} */
export const LATE_NIGHT_FOOD_DATA = [
{ id: "LAT_011", name: "치킨가라아게", cuisine: "LATE_NIGHT", gram: 180, kcal: 450, carbo: 18, protein: 22, fat: 32, sodium: 740 },
{ id: "LAT_012", name: "불닭볶음면", cuisine: "LATE_NIGHT", gram: 140, kcal: 530, carbo: 74, protein: 11, fat: 18, sodium: 1460 },
{ id: "LAT_013", name: "치즈불닭", cuisine: "LATE_NIGHT", gram: 150, kcal: 580, carbo: 78, protein: 14, fat: 20, sodium: 1500 },
{ id: "LAT_014", name: "참치마요주먹밥", cuisine: "LATE_NIGHT", gram: 200, kcal: 420, carbo: 68, protein: 12, fat: 10, sodium: 680 },
{ id: "LAT_015", name: "햄치즈토스트", cuisine: "LATE_NIGHT", gram: 160, kcal: 480, carbo: 48, protein: 16, fat: 24, sodium: 760 },
{ id: "LAT_016", name: "야채김밥", cuisine: "LATE_NIGHT", gram: 240, kcal: 380, carbo: 68, protein: 9, fat: 6, sodium: 580 },
{ id: "LAT_017", name: "참치김밥", cuisine: "LATE_NIGHT", gram: 250, kcal: 480, carbo: 70, protein: 14, fat: 10, sodium: 800 },
{ id: "LAT_018", name: "돈가스김밥", cuisine: "LATE_NIGHT", gram: 260, kcal: 580, carbo: 70, protein: 16, fat: 20, sodium: 820 },
{ id: "LAT_019", name: "치즈라면", cuisine: "LATE_NIGHT", gram: 150, kcal: 550, carbo: 68, protein: 12, fat: 22, sodium: 1580 },
{ id: "LAT_020", name: "해물라면", cuisine: "LATE_NIGHT", gram: 150, kcal: 520, carbo: 62, protein: 14, fat: 20, sodium: 1480 },

{ id: "LAT_021", name: "떡만두라면", cuisine: "LATE_NIGHT", gram: 180, kcal: 600, carbo: 84, protein: 15, fat: 20, sodium: 1520 },
{ id: "LAT_022", name: "스팸구이", cuisine: "LATE_NIGHT", gram: 120, kcal: 360, carbo: 3, protein: 14, fat: 32, sodium: 980 },
{ id: "LAT_023", name: "치즈스팸구이", cuisine: "LATE_NIGHT", gram: 130, kcal: 420, carbo: 5, protein: 16, fat: 36, sodium: 1040 },
{ id: "LAT_024", name: "불막창", cuisine: "LATE_NIGHT", gram: 180, kcal: 560, carbo: 12, protein: 28, fat: 44, sodium: 1000 },
{ id: "LAT_025", name: "곱창볶음", cuisine: "LATE_NIGHT", gram: 200, kcal: 620, carbo: 24, protein: 26, fat: 42, sodium: 1180 },
{ id: "LAT_026", name: "닭발", cuisine: "LATE_NIGHT", gram: 180, kcal: 430, carbo: 16, protein: 28, fat: 18, sodium: 1040 },
{ id: "LAT_027", name: "무뼈닭발", cuisine: "LATE_NIGHT", gram: 180, kcal: 420, carbo: 14, protein: 30, fat: 16, sodium: 1020 },
{ id: "LAT_028", name: "마늘치킨", cuisine: "LATE_NIGHT", gram: 200, kcal: 520, carbo: 18, protein: 26, fat: 34, sodium: 780 },
{ id: "LAT_029", name: "간장치킨", cuisine: "LATE_NIGHT", gram: 200, kcal: 510, carbo: 20, protein: 27, fat: 30, sodium: 760 },
{ id: "LAT_030", name: "양념치킨", cuisine: "LATE_NIGHT", gram: 200, kcal: 560, carbo: 38, protein: 24, fat: 26, sodium: 820 },

{ id: "LAT_031", name: "치킨텐더", cuisine: "LATE_NIGHT", gram: 160, kcal: 380, carbo: 18, protein: 24, fat: 20, sodium: 640 },
{ id: "LAT_032", name: "치즈볼", cuisine: "LATE_NIGHT", gram: 100, kcal: 360, carbo: 40, protein: 6, fat: 18, sodium: 360 },
{ id: "LAT_033", name: "감자튀김", cuisine: "LATE_NIGHT", gram: 150, kcal: 410, carbo: 48, protein: 5, fat: 20, sodium: 320 },
{ id: "LAT_034", name: "고구마튀김", cuisine: "LATE_NIGHT", gram: 150, kcal: 430, carbo: 58, protein: 4, fat: 18, sodium: 300 },
{ id: "LAT_035", name: "치즈감자", cuisine: "LATE_NIGHT", gram: 160, kcal: 460, carbo: 52, protein: 8, fat: 20, sodium: 420 },
{ id: "LAT_036", name: "새우튀김", cuisine: "LATE_NIGHT", gram: 130, kcal: 350, carbo: 22, protein: 14, fat: 20, sodium: 580 },
{ id: "LAT_037", name: "오징어튀김", cuisine: "LATE_NIGHT", gram: 140, kcal: 370, carbo: 24, protein: 16, fat: 18, sodium: 600 },
{ id: "LAT_038", name: "핫바", cuisine: "LATE_NIGHT", gram: 90, kcal: 230, carbo: 20, protein: 8, fat: 12, sodium: 520 },
{ id: "LAT_039", name: "치즈핫도그", cuisine: "LATE_NIGHT", gram: 140, kcal: 420, carbo: 48, protein: 10, fat: 18, sodium: 640 },
{ id: "LAT_040", name: "감자핫도그", cuisine: "LATE_NIGHT", gram: 150, kcal: 440, carbo: 52, protein: 9, fat: 18, sodium: 660 },

{ id: "LAT_041", name: "컵만두", cuisine: "LATE_NIGHT", gram: 160, kcal: 330, carbo: 40, protein: 10, fat: 12, sodium: 720 },
{ id: "LAT_042", name: "컵떡볶이", cuisine: "LATE_NIGHT", gram: 180, kcal: 420, carbo: 74, protein: 6, fat: 8, sodium: 1180 },
{ id: "LAT_043", name: "컵라볶이", cuisine: "LATE_NIGHT", gram: 200, kcal: 480, carbo: 84, protein: 8, fat: 12, sodium: 1320 },
{ id: "LAT_044", name: "컵누들(매운맛)", cuisine: "LATE_NIGHT", gram: 120, kcal: 280, carbo: 42, protein: 7, fat: 8, sodium: 940 },
{ id: "LAT_045", name: "김치라면", cuisine: "LATE_NIGHT", gram: 150, kcal: 520, carbo: 64, protein: 11, fat: 20, sodium: 1540 },
{ id: "LAT_046", name: "짬뽕라면", cuisine: "LATE_NIGHT", gram: 150, kcal: 540, carbo: 68, protein: 12, fat: 20, sodium: 1600 },
{ id: "LAT_047", name: "까르보불닭", cuisine: "LATE_NIGHT", gram: 150, kcal: 570, carbo: 78, protein: 13, fat: 20, sodium: 1530 },
{ id: "LAT_048", name: "크림파스타컵", cuisine: "LATE_NIGHT", gram: 170, kcal: 420, carbo: 58, protein: 8, fat: 14, sodium: 640 },
{ id: "LAT_049", name: "로제파스타컵", cuisine: "LATE_NIGHT", gram: 170, kcal: 450, carbo: 62, protein: 9, fat: 14, sodium: 680 },
{ id: "LAT_050", name: "불닭볶음밥", cuisine: "LATE_NIGHT", gram: 250, kcal: 600, carbo: 82, protein: 14, fat: 18, sodium: 1240 },

{ id: "LAT_051", name: "치즈불닭볶음밥", cuisine: "LATE_NIGHT", gram: 260, kcal: 640, carbo: 84, protein: 16, fat: 20, sodium: 1300 },
{ id: "LAT_052", name: "삼겹살야식세트", cuisine: "LATE_NIGHT", gram: 260, kcal: 760, carbo: 12, protein: 28, fat: 60, sodium: 860 },
{ id: "LAT_053", name: "목살구이야식", cuisine: "LATE_NIGHT", gram: 260, kcal: 700, carbo: 10, protein: 30, fat: 50, sodium: 820 },
{ id: "LAT_054", name: "훈제오리야식", cuisine: "LATE_NIGHT", gram: 200, kcal: 560, carbo: 6, protein: 30, fat: 44, sodium: 720 },
{ id: "LAT_055", name: "달걀라면", cuisine: "LATE_NIGHT", gram: 150, kcal: 510, carbo: 62, protein: 13, fat: 18, sodium: 1500 },
{ id: "LAT_056", name: "차돌라면", cuisine: "LATE_NIGHT", gram: 160, kcal: 580, carbo: 64, protein: 16, fat: 24, sodium: 1580 },
{ id: "LAT_057", name: "생라면부수기", cuisine: "LATE_NIGHT", gram: 110, kcal: 480, carbo: 64, protein: 9, fat: 20, sodium: 650 },
{ id: "LAT_058", name: "허니버터칩", cuisine: "LATE_NIGHT", gram: 40, kcal: 220, carbo: 24, protein: 2, fat: 14, sodium: 130 },
{ id: "LAT_059", name: "매운어포", cuisine: "LATE_NIGHT", gram: 40, kcal: 180, carbo: 15, protein: 10, fat: 8, sodium: 380 },
{ id: "LAT_060", name: "피자조각", cuisine: "LATE_NIGHT", gram: 120, kcal: 320, carbo: 31, protein: 12, fat: 16, sodium: 580 }
];

// ============================================================
// 7. 간식 (SNACK)
// ============================================================
/** @type {FoodItem[]} */
export const SNACK_FOOD_DATA = [
  { id: "SNK_001", name: "붕어빵", cuisine: "SNACK", gram: 80, kcal: 190, carbo: 32, protein: 5, fat: 3, sodium: 120 },
  { id: "SNK_002", name: "호빵", cuisine: "SNACK", gram: 120, kcal: 250, carbo: 45, protein: 7, fat: 3, sodium: 260 },
  { id: "SNK_003", name: "계란빵", cuisine: "SNACK", gram: 90, kcal: 210, carbo: 20, protein: 7, fat: 9, sodium: 180 },
  { id: "SNK_004", name: "쿠키", cuisine: "SNACK", gram: 30, kcal: 140, carbo: 18, protein: 2, fat: 7, sodium: 90 },
  { id: "SNK_005", name: "머핀", cuisine: "SNACK", gram: 80, kcal: 260, carbo: 32, protein: 4, fat: 11, sodium: 210 },
  { id: "SNK_006", name: "아이스크림", cuisine: "SNACK", gram: 80, kcal: 180, carbo: 22, protein: 3, fat: 9, sodium: 75 },
  { id: "SNK_007", name: "초코케이크", cuisine: "SNACK", gram: 90, kcal: 320, carbo: 34, protein: 4, fat: 18, sodium: 180 },
  { id: "SNK_008", name: "치즈케이크", cuisine: "SNACK", gram: 90, kcal: 310, carbo: 24, protein: 5, fat: 21, sodium: 190 },
  { id: "SNK_009", name: "요거트", cuisine: "SNACK", gram: 100, kcal: 90, carbo: 15, protein: 4, fat: 2.5, sodium: 60 },
  { id: "SNK_010", name: "그릭요거트", cuisine: "SNACK", gram: 100, kcal: 110, carbo: 8, protein: 9, fat: 4, sodium: 55 },
  { id: "SNK_011", name: "과일샐러드", cuisine: "SNACK", gram: 180, kcal: 150, carbo: 34, protein: 2, fat: 1, sodium: 10 },
  { id: "SNK_012", name: "감자샐러드", cuisine: "SNACK", gram: 100, kcal: 160, carbo: 20, protein: 3, fat: 8, sodium: 280 },
  { id: "SNK_013", name: "고구마말랭이", cuisine: "SNACK", gram: 40, kcal: 140, carbo: 32, protein: 1, fat: 0.5, sodium: 40 },
  { id: "SNK_014", name: "견과류믹스", cuisine: "SNACK", gram: 30, kcal: 170, carbo: 6, protein: 5, fat: 14, sodium: 2 },
  { id: "SNK_015", name: "바나나", cuisine: "SNACK", gram: 100, kcal: 89, carbo: 23, protein: 1, fat: 0.3, sodium: 1 },
  { id: "SNK_016", name: "사과", cuisine: "SNACK", gram: 100, kcal: 52, carbo: 14, protein: 0.3, fat: 0.2, sodium: 1 },
  { id: "SNK_017", name: "귤", cuisine: "SNACK", gram: 100, kcal: 45, carbo: 12, protein: 0.7, fat: 0.2, sodium: 1 },
  { id: "SNK_018", name: "포도", cuisine: "SNACK", gram: 100, kcal: 69, carbo: 18, protein: 0.6, fat: 0.2, sodium: 2 },
  { id: "SNK_019", name: "샌드위치쿠키", cuisine: "SNACK", gram: 40, kcal: 180, carbo: 22, protein: 2, fat: 9, sodium: 110 },
  { id: "SNK_020", name: "크래커", cuisine: "SNACK", gram: 30, kcal: 140, carbo: 18, protein: 3, fat: 6, sodium: 160 },

  { id: "SNK_021", name: "초콜릿바", cuisine: "SNACK", gram: 40, kcal: 220, carbo: 24, protein: 3, fat: 12, sodium: 60 },
  { id: "SNK_022", name: "카라멜캔디", cuisine: "SNACK", gram: 20, kcal: 80, carbo: 12, protein: 0.5, fat: 3, sodium: 30 },
  { id: "SNK_023", name: "젤리", cuisine: "SNACK", gram: 30, kcal: 110, carbo: 26, protein: 1, fat: 0.2, sodium: 20 },
  { id: "SNK_024", name: "마카롱", cuisine: "SNACK", gram: 25, kcal: 120, carbo: 14, protein: 2, fat: 6, sodium: 35 },
  { id: "SNK_025", name: "브라우니", cuisine: "SNACK", gram: 60, kcal: 260, carbo: 30, protein: 3, fat: 14, sodium: 140 },
  { id: "SNK_026", name: "컵케이크", cuisine: "SNACK", gram: 70, kcal: 260, carbo: 32, protein: 3, fat: 12, sodium: 150 },
  { id: "SNK_027", name: "피낭시에", cuisine: "SNACK", gram: 40, kcal: 180, carbo: 16, protein: 3, fat: 10, sodium: 80 },
  { id: "SNK_028", name: "휘낭시에초코", cuisine: "SNACK", gram: 40, kcal: 190, carbo: 18, protein: 3, fat: 10, sodium: 80 },

  { id: "SNK_029", name: "우유", cuisine: "SNACK", gram: 200, kcal: 130, carbo: 10, protein: 7, fat: 7, sodium: 100 },
  { id: "SNK_030", name: "초코우유", cuisine: "SNACK", gram: 200, kcal: 180, carbo: 28, protein: 7, fat: 6, sodium: 110 },
  { id: "SNK_031", name: "커피우유", cuisine: "SNACK", gram: 200, kcal: 160, carbo: 24, protein: 7, fat: 5, sodium: 110 },
  { id: "SNK_032", name: "두유", cuisine: "SNACK", gram: 190, kcal: 120, carbo: 10, protein: 7, fat: 5, sodium: 90 },
  { id: "SNK_033", name: "곡물두유", cuisine: "SNACK", gram: 190, kcal: 150, carbo: 20, protein: 7, fat: 5, sodium: 100 },
  { id: "SNK_034", name: "요거트드링크", cuisine: "SNACK", gram: 150, kcal: 120, carbo: 24, protein: 3, fat: 2, sodium: 60 },
  { id: "SNK_035", name: "스무디(딸기)", cuisine: "SNACK", gram: 250, kcal: 210, carbo: 46, protein: 3, fat: 2, sodium: 30 },
  { id: "SNK_036", name: "스무디(망고)", cuisine: "SNACK", gram: 250, kcal: 220, carbo: 48, protein: 3, fat: 2, sodium: 30 },

  { id: "SNK_037", name: "팝콘(버터)", cuisine: "SNACK", gram: 40, kcal: 180, carbo: 18, protein: 3, fat: 10, sodium: 220 },
  { id: "SNK_038", name: "팝콘(카라멜)", cuisine: "SNACK", gram: 40, kcal: 200, carbo: 26, protein: 2, fat: 9, sodium: 160 },
  { id: "SNK_039", name: "어니언칩", cuisine: "SNACK", gram: 50, kcal: 260, carbo: 24, protein: 3, fat: 16, sodium: 280 },
  { id: "SNK_040", name: "포테이토칩", cuisine: "SNACK", gram: 50, kcal: 270, carbo: 25, protein: 3, fat: 17, sodium: 300 },
  { id: "SNK_041", name: "김스낵", cuisine: "SNACK", gram: 20, kcal: 80, carbo: 6, protein: 3, fat: 5, sodium: 220 },
  { id: "SNK_042", name: "쌀과자", cuisine: "SNACK", gram: 30, kcal: 120, carbo: 26, protein: 2, fat: 1, sodium: 70 },
  { id: "SNK_043", name: "고구마스낵", cuisine: "SNACK", gram: 40, kcal: 180, carbo: 30, protein: 2, fat: 6, sodium: 90 },
  { id: "SNK_044", name: "바나나칩", cuisine: "SNACK", gram: 30, kcal: 150, carbo: 26, protein: 1, fat: 5, sodium: 5 },

  { id: "SNK_045", name: "모닝빵", cuisine: "SNACK", gram: 40, kcal: 120, carbo: 20, protein: 3, fat: 3, sodium: 160 },
  { id: "SNK_046", name: "크루아상", cuisine: "SNACK", gram: 60, kcal: 260, carbo: 26, protein: 5, fat: 14, sodium: 200 },
  { id: "SNK_047", name: "소보루빵", cuisine: "SNACK", gram: 80, kcal: 320, carbo: 42, protein: 6, fat: 14, sodium: 240 },
  { id: "SNK_048", name: "단팥빵", cuisine: "SNACK", gram: 80, kcal: 280, carbo: 48, protein: 7, fat: 5, sodium: 210 },
  { id: "SNK_049", name: "크림빵", cuisine: "SNACK", gram: 80, kcal: 300, carbo: 40, protein: 6, fat: 11, sodium: 220 },
  { id: "SNK_050", name: "소시지빵", cuisine: "SNACK", gram: 90, kcal: 310, carbo: 30, protein: 9, fat: 15, sodium: 420 },
  { id: "SNK_051", name: "찹쌀도넛", cuisine: "SNACK", gram: 70, kcal: 280, carbo: 34, protein: 4, fat: 14, sodium: 190 },
  { id: "SNK_052", name: "크림도넛", cuisine: "SNACK", gram: 80, kcal: 320, carbo: 36, protein: 4, fat: 18, sodium: 220 },

  { id: "SNK_053", name: "아몬드", cuisine: "SNACK", gram: 25, kcal: 145, carbo: 5, protein: 5, fat: 13, sodium: 1 },
  { id: "SNK_054", name: "캐슈넛", cuisine: "SNACK", gram: 25, kcal: 140, carbo: 8, protein: 4, fat: 11, sodium: 2 },
  { id: "SNK_055", name: "땅콩", cuisine: "SNACK", gram: 25, kcal: 150, carbo: 6, protein: 6, fat: 12, sodium: 2 },
  { id: "SNK_056", name: "견과바", cuisine: "SNACK", gram: 30, kcal: 160, carbo: 14, protein: 4, fat: 9, sodium: 70 },
  { id: "SNK_057", name: "단백질바", cuisine: "SNACK", gram: 40, kcal: 180, carbo: 16, protein: 10, fat: 6, sodium: 120 },
  { id: "SNK_058", name: "에너지바", cuisine: "SNACK", gram: 40, kcal: 190, carbo: 28, protein: 4, fat: 6, sodium: 110 },
  { id: "SNK_059", name: "요거트바", cuisine: "SNACK", gram: 35, kcal: 150, carbo: 22, protein: 3, fat: 5, sodium: 70 },
  { id: "SNK_060", name: "시리얼바", cuisine: "SNACK", gram: 30, kcal: 140, carbo: 24, protein: 2, fat: 4, sodium: 80 },

  { id: "SNK_061", name: "찐고구마", cuisine: "SNACK", gram: 120, kcal: 140, carbo: 32, protein: 2, fat: 0.3, sodium: 40 },
  { id: "SNK_062", name: "방울토마토", cuisine: "SNACK", gram: 100, kcal: 20, carbo: 5, protein: 1, fat: 0.2, sodium: 3 },

];

// ============================================================
// 전체 음식 데이터 통합
// ============================================================
/** @type {FoodItem[]} */
export const ALL_FOOD_DATA = [
  ...KOREAN_FOOD_DATA,
  ...CHINESE_FOOD_DATA,
  ...JAPANESE_FOOD_DATA,
  ...WESTERN_FOOD_DATA,
  ...SPANISH_FOOD_DATA,
  ...LATE_NIGHT_FOOD_DATA,
  ...SNACK_FOOD_DATA,
];

// ============================================================
// 검색 함수
// ============================================================

/**
 * 음식 이름으로 검색
 * @param {string} keyword - 검색 키워드
 * @returns {FoodItem[]} - 검색 결과
 */
export const searchLocalFoods = (keyword) => {
  if (!keyword || !keyword.trim()) {
    return [];
  }

  const searchTerm = keyword.trim().toLowerCase();

  return ALL_FOOD_DATA.filter(food =>
    food.name.toLowerCase().includes(searchTerm)
  );
};

/**
 * 카테고리별로 음식 필터링
 * @param {string} cuisine - 음식 카테고리
 * @returns {FoodItem[]} - 해당 카테고리의 음식 목록
 */
export const getFoodsByCuisine = (cuisine) => {
  if (!cuisine) {
    return ALL_FOOD_DATA;
  }

  return ALL_FOOD_DATA.filter(food => food.cuisine === cuisine);
};

/**
 * 음식 ID로 검색
 * @param {string} id - 음식 ID
 * @returns {FoodItem|undefined} - 해당 음식 정보
 */
export const getFoodById = (id) => {
  return ALL_FOOD_DATA.find(food => food.id === id);
};

// ============================================================
// 카테고리 정보
// ============================================================
export const CUISINE_TYPES = {
  KOREAN: '한식',
  CHINESE: '중식',
  JAPANESE: '일식',
  WESTERN: '양식',
  SPANISH: '스페인식',
  LATE_NIGHT: '야식',
  SNACK: '간식',
};

/**
 * 카테고리 목록 가져오기
 * @returns {Array<{key: string, label: string, count: number}>}
 */
export const getCuisineCategories = () => {
  return Object.entries(CUISINE_TYPES).map(([key, label]) => ({
    key,
    label,
    count: getFoodsByCuisine(key).length
  }));
};
