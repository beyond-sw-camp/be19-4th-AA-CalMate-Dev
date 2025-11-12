<template>
  <section class="meal-card">
    <div class="meal-header">
      <span class="meal-label">{{ label }}</span>
      <button class="add-btn" @click="openAddModal">+ 추가</button>
    </div>

    <div v-if="!foods.length" class="meal-body empty">
      <p class="empty-text">아직 기록된 음식이 없습니다</p>
    </div>

    <div v-else class="meal-body">
      <div v-for="food in foods" :key="food.id" class="food-card">
        <div class="food-main">
          <div class="food-top">
            <span class="food-name">{{ food.name }}</span>
            <span class="food-info">{{ food.kcal }} kcal</span>
          </div>

          <div class="food-actions">
            <button class="food-edit" @click="openEditModal(food)">
              <img :src="editIcon" alt="edit" />
            </button>
            <button class="food-delete" @click="removeFood(food.id)">
              <img :src="deleteIcon" alt="delete" />
            </button>
          </div>
        </div>

        <p class="food-macro">
          P: {{ food.protein }}g&nbsp;&nbsp;
          C: {{ food.carb }}g&nbsp;&nbsp;
          F: {{ food.fat }}g
        </p>

        <div v-if="food.images && food.images.length" class="food-images">
          <div
            v-for="(img, idx) in food.images"
            :key="img.id ?? idx"
            class="food-image-wrap"
          >
            <img :src="img.url" alt="food" />
          </div>
        </div>
      </div>
    </div>

    <AddFoodModal
      v-if="showModal"
      :food-data="editingFood"
      @close="closeModal"
      @save="handleSaveFood"
    />
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AddFoodModal from './AddFoodModal.vue'
import deleteIcon from '@/assets/images/delete.png'
import editIcon from '@/assets/images/edit.png'
import { dietStore } from '@/stores/dietStore'
import { useUserStore } from '@/stores/user'
import { createDiet, getDietByType, updateDiet, deleteDiet } from '@/api/diet'
import api from '@/lib/api'

const props = defineProps({
  label: String,
})

// ✅ 상위(DietManagement + Breakfast/Lunch/...)로 이벤트 올림
const emit = defineEmits(['update-total', 'meal-point-earned'])

const mealKeyMap = {
  아침: 'breakfast',
  점심: 'lunch',
  저녁: 'dinner',
  간식: 'snack',
}

const dietTypeMap = {
  아침: 'BREAKFAST',
  점심: 'LUNCH',
  저녁: 'DINNER',
  간식: 'SNACK',
}

const mealKey = mealKeyMap[props.label] || null
const dietType = dietTypeMap[props.label] || null

const showModal = ref(false)
const editingFood = ref(null)
const foods = ref([])

const userStore = useUserStore()
const memberId = computed(() => userStore.userId)

// 백엔드 baseURL (예: http://localhost:8081)
const apiBaseURL = (api.defaults.baseURL || '').replace(/\/$/, '')

// fileUrl → 최종 img src 로 변환
const resolveFileUrl = (fileUrl) => {
  if (!fileUrl) return ''
  if (fileUrl.startsWith('http://') || fileUrl.startsWith('https://')) {
    return fileUrl
  }
  let path = fileUrl
  if (!path.startsWith('/')) {
    path = '/' + path
  }
  if (!apiBaseURL) {
    return path
  }
  return apiBaseURL + path
}

const currentDate = computed(() => {
  return new Date().toISOString().slice(0, 10)
})

// ✅ 합계 재계산 + 상위로 emit
const recalcTotal = () => {
  const total = foods.value.reduce((sum, f) => sum + Number(f.kcal || 0), 0)
  if (mealKey) {
    dietStore.meals[mealKey] = total
  }
  emit('update-total', total)
}

const loadFoods = async () => {
  if (!dietType || !memberId.value) return
  try {
    const res = await getDietByType({
      date: currentDate.value,
      type: dietType,
      memberId: memberId.value,
    })

    const data = res.data
    const meals = Array.isArray(data) ? data : data ? [data] : []

    foods.value = meals
      .filter((meal) => !!meal.food)
      .map((meal) => {
        const food = meal.food
        const files = meal.files || []

        const images = files
          .filter((f) => f.fileUrl)
          .map((f) => ({
            id: f.fileId,
            url: resolveFileUrl(f.fileUrl),
          }))

        return {
          id: meal.mealId,
          name: food.name,
          kcal: food.kcal,
          protein: food.protein,
          carb: food.carbo,
          fat: food.fat,
          images,
        }
      })

    recalcTotal()
  } catch (e) {
    console.error('식단 조회 실패', e)
    foods.value = []
    recalcTotal()
  }
}

const openAddModal = () => {
  editingFood.value = null
  showModal.value = true
}

const openEditModal = (food) => {
  editingFood.value = {
    ...food,
    images: food.images ? food.images.map((img) => ({ ...img })) : [],
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingFood.value = null
}

const handleSaveFood = async (food) => {
  try {
    if (!dietType || !memberId.value) return

    const bodyFood = {
      name: food.name,
      gram: 0,
      kcal: Number(food.kcal),
      carbo: Number(food.carb),
      protein: Number(food.protein),
      fat: Number(food.fat),
      sodium: 0,
    }

    // 수정
    if (editingFood.value && editingFood.value.id) {
      const filesToSend = food.imagesTouched ? food.files || [] : null
      const keepFileIdsToSend = food.imagesTouched ? food.keepFileIds || [] : null

      await updateDiet({
        id: editingFood.value.id,
        date: currentDate.value,
        type: dietType,
        memberId: memberId.value,
        food: bodyFood,
        files: filesToSend,
        keepFileIds: keepFileIdsToSend,
      })
    } else {
      // 신규 등록
      await createDiet({
        date: currentDate.value,
        type: dietType,
        memberId: memberId.value,
        food: bodyFood,
        files: food.files || [],
      })

      // 🔥 여기서 포인트 모달 트리거 (일단 항상)
      // 나중에 백엔드에서 "오늘 첫 식단 기록인지" 체크하고
      // 응답에 pointEarned 같은 플래그 넣어주면, 그때 조건 걸면 됨.
      emit('meal-point-earned')
    }

    await loadFoods()
  } catch (e) {
    console.error('식단 저장/수정 실패', e)
  } finally {
    closeModal()
  }
}

const removeFood = async (id) => {
  try {
    await deleteDiet(id)
    foods.value = foods.value.filter((f) => f.id !== id)
    recalcTotal()
  } catch (e) {
    console.error('식단 삭제 실패', e)
  }
}

onMounted(() => {
  loadFoods()
})
</script>

<style scoped>
.meal-card {
  border-radius: 16px;
  border: 1px solid #e4e4ea;
  padding: 24px;
  min-height: 180px;
  display: flex;
  flex-direction: column;
}
.meal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.meal-label {
  font-size: 16px;
  font-weight: 600;
}
.add-btn {
  padding: 8px 14px;
  border-radius: 999px;
  border: none;
  background-color: #05030d;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
}
.meal-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.meal-body.empty {
  justify-content: center;
  align-items: center;
  flex: 1;
}
.empty-text {
  font-size: 14px;
  color: #9a9aa0;
}
.food-card {
  border-radius: 12px;
  border: 1px solid #ececf0;
  padding: 14px 16px;
}
.food-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.food-top {
  display: flex;
  align-items: center;
  gap: 6px;
}
.food-name {
  font-size: 16px;
  font-weight: 600;
}
.food-info {
  font-size: 14px;
  color: #4b4c55;
}
.food-macro {
  font-size: 14px;
  color: #8f9099;
  margin-top: 4px;
}
.food-actions {
  display: flex;
  gap: 6px;
  align-items: center;
}
.food-edit,
.food-delete {
  width: 36px;
  height: 36px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  cursor: pointer;
}
.food-edit {
  border: 1px solid #d1d5db;
  background-color: #ffffff;
}
.food-edit img {
  width: 18px;
  height: 18px;
}
.food-delete {
  border: 1px solid #fca5a5;
  background-color: #ffffff;
}
.food-delete img {
  width: 18px;
  height: 18px;
}
.food-images {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}
.food-image-wrap {
  width: 110px;
  height: 110px;
  border-radius: 18px;
  overflow: hidden;
  background-color: #f3f3f6;
}
.food-image-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
