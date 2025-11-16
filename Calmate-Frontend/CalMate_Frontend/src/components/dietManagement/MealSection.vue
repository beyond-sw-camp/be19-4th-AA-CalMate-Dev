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
import { useRoute } from 'vue-router'
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

const apiBaseURL = (api.defaults.baseURL || '').replace(/\/$/, '')

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

const route = useRoute()

const currentDate = computed(() => {
  const q = route.query.date
  if (typeof q === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(q)) return q
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
})

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
      await createDiet({
        date: currentDate.value,
        type: dietType,
        memberId: memberId.value,
        food: bodyFood,
        files: food.files || [],
      })
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
  border: 1px solid #e9edf4;
  background: #ffffff;
  padding: 24px;
  min-height: 180px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.meal-card:hover {
  box-shadow: 0 8px 24px rgba(108, 92, 231, 0.08);
  transform: translateY(-2px);
}

.meal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 14px;
  border-bottom: 1px solid #e9edf4;
}

.meal-label {
  font-size: 17px;
  font-weight: 700;
  color: #161a1d;
  display: flex;
  align-items: center;
  gap: 8px;
}

.meal-label::before {
  content: '🍴';
  font-size: 18px;
}

.add-btn {
  padding: 9px 16px;
  border-radius: 999px;
  border: none;
  background: #05030d;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.add-btn:hover {
  background: #1a1825;
  transform: translateY(-1px);
}

.add-btn:active {
  transform: translateY(0);
}

.meal-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.meal-body.empty {
  justify-content: center;
  align-items: center;
  flex: 1;
  padding: 40px 0;
}

.empty-text {
  font-size: 14px;
  color: #9a9aa0;
  font-weight: 500;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.empty-text::before {
  content: '🍽️';
  font-size: 42px;
  opacity: 0.4;
}

.food-card {
  border-radius: 12px;
  border: 1px solid #ececf0;
  background: #ffffff;
  padding: 16px 18px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.food-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 3px;
  height: 100%;
  background: #6c5ce7;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.food-card:hover {
  border-color: rgba(108, 92, 231, 0.2);
  box-shadow: 0 4px 12px rgba(108, 92, 231, 0.08);
  transform: translateX(3px);
}

.food-card:hover::before {
  opacity: 1;
}

.food-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.food-top {
  display: flex;
  align-items: center;
  gap: 10px;
}

.food-name {
  font-size: 16px;
  font-weight: 700;
  color: #161a1d;
}

.food-info {
  font-size: 14px;
  color: #6c5ce7;
  font-weight: 700;
  background: #f1f0ff;
  padding: 4px 10px;
  border-radius: 6px;
}

.food-macro {
  font-size: 14px;
  color: #7d8896;
  margin: 0;
  font-weight: 500;
}

.food-macro::before {
  content: '📊 ';
  margin-right: 2px;
}

.food-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.food-edit,
.food-delete {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  cursor: pointer;
  transition: all 0.2s ease;
}

.food-edit {
  border: 1px solid #d1d5db;
  background: #ffffff;
}

.food-edit:hover {
  border-color: #6c5ce7;
  background: #f1f0ff;
}

.food-edit img {
  width: 18px;
  height: 18px;
}

.food-delete {
  border: 1px solid #fca5a5;
  background: #ffffff;
}

.food-delete:hover {
  border-color: #ef4444;
  background: #fef2f2;
}

.food-delete img {
  width: 18px;
  height: 18px;
}

.food-images {
  display: flex;
  gap: 10px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #e9edf4;
}

.food-image-wrap {
  width: 110px;
  height: 110px;
  border-radius: 12px;
  overflow: hidden;
  background: #f3f3f6;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  cursor: pointer;
}

.food-image-wrap:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(108, 92, 231, 0.12);
}

.food-image-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.food-image-wrap:hover img {
  transform: scale(1.08);
}

/* 반응형 */
@media (max-width: 768px) {
  .meal-card {
    padding: 20px;
  }

  .meal-label {
    font-size: 16px;
  }

  .add-btn {
    padding: 8px 16px;
    font-size: 13px;
  }

  .food-name {
    font-size: 15px;
  }

  .food-info {
    font-size: 13px;
  }

  .food-macro {
    font-size: 13px;
  }

  .food-image-wrap {
    width: 100px;
    height: 100px;
  }
}
</style>
