# 식단 데이터 (Food Data)

프론트엔드에서 식단 검색 기능을 지원하기 위한 로컬 음식 데이터베이스입니다.

## 📁 파일 구조

```
src/
├── data/
│   ├── foodData.js          # 음식 데이터 및 검색 함수
│   └── README.md            # 이 파일
├── composables/
│   └── useFoodSearch.js     # 식단 검색 컴포저블
└── components/
    └── dietManagement/
        └── AddFoodModal.vue # 음식 추가 모달 (검색 기능 포함)
```

## 🍽️ 지원하는 음식 카테고리

| 카테고리 | 코드 | 음식 개수 |
|---------|------|----------|
| 한식 | `KOREAN` | 10개 |
| 중식 | `CHINESE` | 9개 |
| 일식 | `JAPANESE` | 7개 |
| 양식 | `WESTERN` | 16개 |
| 스페인식 | `SPANISH` | 6개 |
| 야식 | `LATE_NIGHT` | 10개 |
| 간식 | `SNACK` | 12개 |

**총 70개의 음식 데이터 제공**

## 📊 음식 데이터 구조

```javascript
{
  id: "KOR_001",           // 음식 고유 ID
  name: "김치찌개",         // 음식 이름
  cuisine: "KOREAN",       // 카테고리
  gram: 350,               // 1회 제공량 (g)
  kcal: 280,               // 칼로리
  carbo: 10.5,             // 탄수화물 (g)
  protein: 18,             // 단백질 (g)
  fat: 17,                 // 지방 (g)
  sodium: 950              // 나트륨 (mg)
}
```

## 🔍 사용 방법

### 1. 기본 검색 함수 사용

```javascript
import { searchLocalFoods, getFoodsByCuisine, getFoodById } from '@/data/foodData'

// 음식 이름으로 검색
const results = searchLocalFoods('김치')
// 결과: [{ id: 'KOR_001', name: '김치찌개', ... }]

// 카테고리별 검색
const koreanFoods = getFoodsByCuisine('KOREAN')

// ID로 검색
const food = getFoodById('KOR_001')
```

### 2. Composable 사용 (권장)

```vue
<script setup>
import { useFoodSearch } from '@/composables/useFoodSearch'

const {
  searchKeyword,
  searchResults,
  isSearching,
  showSearchResults,
  search,
  clearSearch
} = useFoodSearch()

// 검색 실행
const handleSearch = (keyword) => {
  search(keyword)
}
</script>

<template>
  <div>
    <input
      v-model="searchKeyword"
      @input="search(searchKeyword)"
      placeholder="음식 검색"
    />

    <div v-if="isSearching">검색 중...</div>

    <div v-if="showSearchResults">
      <div v-for="food in searchResults" :key="food.id">
        {{ food.name }} - {{ food.kcal }}kcal
      </div>
    </div>
  </div>
</template>
```

### 3. 카테고리 필터링

```javascript
import { useFoodSearch } from '@/composables/useFoodSearch'

const {
  selectedCuisine,
  cuisineCategories,
  selectCuisine,
  clearCuisineFilter
} = useFoodSearch()

// 카테고리 선택
selectCuisine('KOREAN')

// 카테고리 필터 해제
clearCuisineFilter()

// 사용 가능한 카테고리 목록
console.log(cuisineCategories.value)
// [{ key: 'KOREAN', label: '한식', count: 10 }, ...]
```

## 🎯 AddFoodModal 컴포넌트 통합

`AddFoodModal.vue`는 이미 로컬 식단 검색 기능이 통합되어 있습니다:

- ✅ 로컬 데이터에서 우선 검색
- ✅ 백엔드 API와 병렬 검색
- ✅ 중복 제거 후 통합 결과 표시
- ✅ 200ms 디바운스 적용
- ✅ `carbo`/`carb` 필드 호환성 지원

## 🚀 검색 동작 방식

1. **로컬 우선 검색**: 프론트엔드 데이터에서 즉시 검색
2. **백엔드 병렬 검색**: API를 통해 추가 데이터 검색
3. **결과 통합**: 중복을 제거하고 두 결과를 합침
4. **백엔드 실패 시**: 로컬 검색 결과만 표시 (Graceful Degradation)

```javascript
// 검색 과정
const onSearchInput = () => {
  // 1. 로컬 검색 (즉시)
  const localResults = searchLocalFoods(keyword)

  // 2. 백엔드 검색 (병렬)
  const backendResults = await searchFoodsAPI(keyword)

  // 3. 결과 합치기 (중복 제거)
  const combined = mergeResults(localResults, backendResults)

  return combined
}
```

## 📝 새 음식 데이터 추가하기

### 1. 기존 카테고리에 추가

```javascript
// src/data/foodData.js
export const KOREAN_FOOD_DATA = [
  // ... 기존 데이터
  {
    id: "KOR_011",
    name: "새로운 음식",
    cuisine: "KOREAN",
    gram: 300,
    kcal: 400,
    carbo: 50,
    protein: 20,
    fat: 15,
    sodium: 800
  },
]
```

### 2. 새 카테고리 추가

```javascript
// 1. 새 데이터 배열 생성
export const NEW_CUISINE_DATA = [
  { id: "NEW_001", name: "음식1", cuisine: "NEW_CUISINE", ... },
]

// 2. ALL_FOOD_DATA에 추가
export const ALL_FOOD_DATA = [
  ...KOREAN_FOOD_DATA,
  ...CHINESE_FOOD_DATA,
  // ... 기존 데이터
  ...NEW_CUISINE_DATA,  // 새 카테고리 추가
]

// 3. CUISINE_TYPES에 추가
export const CUISINE_TYPES = {
  KOREAN: '한식',
  CHINESE: '중식',
  // ... 기존 타입
  NEW_CUISINE: '새 카테고리',  // 새 타입 추가
}
```

## 🔧 고급 기능

### 백엔드 검색 비활성화

```javascript
const { search } = useFoodSearch({
  useBackend: false  // 로컬 검색만 사용
})
```

### 디바운스 시간 조정

```javascript
const { search } = useFoodSearch({
  debounceTime: 500  // 500ms로 변경
})
```

## 📋 데이터 출처

- 한국영양학회 영양성분 데이터베이스
- 식품의약품안전처 식품영양성분 DB
- 일반적인 1회 제공량 기준

## ⚠️ 주의사항

1. **영양 정보 정확성**: 실제 음식의 영양 정보는 조리법과 재료에 따라 달라질 수 있습니다.
2. **필드명 호환성**: 로컬 데이터는 `carbo`, 백엔드는 `carb`를 사용할 수 있으므로 두 필드 모두 지원합니다.
3. **ID 고유성**: 새 데이터 추가 시 ID가 중복되지 않도록 주의하세요.

## 🎨 UI/UX 권장사항

1. **자동완성**: 사용자가 입력하는 동안 실시간 검색 결과 표시
2. **카테고리 탭**: 카테고리별로 빠르게 탐색할 수 있는 탭 제공
3. **최근 검색**: 자주 검색하는 음식을 저장하여 빠른 접근 제공
4. **영양 정보 표시**: 검색 결과에 칼로리, 단백질, 탄수화물, 지방 정보 표시

## 🔄 업데이트 이력

- **2025-01-14**: 초기 버전 생성 (70개 음식 데이터)
  - 한식 10개
  - 중식 9개
  - 일식 7개
  - 양식 16개
  - 스페인식 6개
  - 야식 10개
  - 간식 12개
