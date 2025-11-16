// src/composables/useFoodSearch.js
// 식단 검색을 위한 컴포저블

import { ref, computed } from 'vue'
import { searchLocalFoods, getFoodsByCuisine, getCuisineCategories, CUISINE_TYPES } from '@/data/foodData'
import { searchFoods as searchFoodsAPI } from '@/api/diet'

/**
 * 식단 검색 기능을 제공하는 컴포저블
 * @param {Object} options - 옵션
 * @param {boolean} options.useBackend - 백엔드 검색 사용 여부 (기본값: true)
 * @param {number} options.debounceTime - 디바운스 시간 (ms, 기본값: 300)
 */
export function useFoodSearch(options = {}) {
  const {
    useBackend = true,
    debounceTime = 300
  } = options

  // 상태
  const searchKeyword = ref('')
  const searchResults = ref([])
  const isSearching = ref(false)
  const selectedCuisine = ref('') // 선택된 카테고리
  const showSearchResults = ref(false)

  let searchTimeout = null

  // 카테고리 정보
  const cuisineCategories = computed(() => getCuisineCategories())
  const cuisineTypes = computed(() => CUISINE_TYPES)

  /**
   * 음식 검색 (로컬 + 백엔드)
   */
  const search = async (keyword) => {
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }

    // 검색어가 없으면 즉시 초기화
    if (!keyword || !keyword.trim()) {
      searchResults.value = []
      showSearchResults.value = false
      isSearching.value = false
      return
    }

    isSearching.value = true

    searchTimeout = setTimeout(async () => {
      try {
        // 1. 로컬 검색
        let localResults = searchLocalFoods(keyword)

        // 선택된 카테고리가 있으면 필터링
        if (selectedCuisine.value) {
          localResults = localResults.filter(food => food.cuisine === selectedCuisine.value)
        }

        // 2. 백엔드 검색 (옵션이 활성화된 경우)
        let backendResults = []
        if (useBackend) {
          try {
            const res = await searchFoodsAPI(keyword)
            backendResults = res.data || []

            // 선택된 카테고리가 있으면 필터링
            if (selectedCuisine.value) {
              backendResults = backendResults.filter(food => food.cuisine === selectedCuisine.value)
            }
          } catch (e) {
            console.warn('백엔드 검색 실패, 로컬 검색 결과만 표시:', e)
          }
        }

        // 3. 결과 합치기 (중복 제거)
        const combinedResults = [...localResults]
        const localIds = new Set(localResults.map(f => f.id))

        backendResults.forEach(backendFood => {
          if (!localIds.has(backendFood.id)) {
            combinedResults.push(backendFood)
          }
        })

        searchResults.value = combinedResults
        showSearchResults.value = true
      } catch (e) {
        console.error('음식 검색 실패:', e)
        searchResults.value = []
        showSearchResults.value = false
      } finally {
        isSearching.value = false
      }
    }, debounceTime)
  }

  /**
   * 카테고리별 음식 목록 가져오기
   */
  const getFoodsByCategory = (cuisine) => {
    return getFoodsByCuisine(cuisine)
  }

  /**
   * 카테고리 선택
   */
  const selectCuisine = (cuisine) => {
    selectedCuisine.value = cuisine
    // 카테고리 변경 시 검색어가 있으면 다시 검색
    if (searchKeyword.value.trim()) {
      search(searchKeyword.value)
    }
  }

  /**
   * 카테고리 필터 초기화
   */
  const clearCuisineFilter = () => {
    selectedCuisine.value = ''
    // 검색어가 있으면 다시 검색
    if (searchKeyword.value.trim()) {
      search(searchKeyword.value)
    }
  }

  /**
   * 검색 초기화
   */
  const clearSearch = () => {
    searchKeyword.value = ''
    searchResults.value = []
    showSearchResults.value = false
    isSearching.value = false
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }
  }

  /**
   * 검색 결과 숨기기
   */
  const hideSearchResults = () => {
    showSearchResults.value = false
  }

  /**
   * 검색 실행
   */
  const performSearch = () => {
    search(searchKeyword.value)
  }

  return {
    // 상태
    searchKeyword,
    searchResults,
    isSearching,
    selectedCuisine,
    showSearchResults,

    // 카테고리 정보
    cuisineCategories,
    cuisineTypes,

    // 메서드
    search,
    getFoodsByCategory,
    selectCuisine,
    clearCuisineFilter,
    clearSearch,
    hideSearchResults,
    performSearch,
  }
}
