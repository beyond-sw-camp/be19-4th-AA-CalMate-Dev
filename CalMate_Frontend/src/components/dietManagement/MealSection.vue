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

        <div class="food-images">
          <div
            v-for="(src, idx) in food.images"
            :key="idx"
            class="food-image-wrap"
          >
            <img :src="src" alt="food" />
          </div>
        </div>
      </div>
    </div>

    <AddFoodModal
      v-if="showModal"
      :visible="showModal"
      :food-data="editingFood"
      @close="closeModal"
      @save="handleSaveFood"
    />
  </section>
</template>

<script setup>
import { ref } from 'vue'
import AddFoodModal from './AddFoodModal.vue'
import deleteIcon from '@/assets/images/delete.png'
import editIcon from '@/assets/images/edit.png'
import foodexample from '@/assets/images/dietManagement/foodexample.png'
import { dietStore } from '@/stores/dietStore'

const props = defineProps({
  label: String
})

const mealKeyMap = {
  아침: 'breakfast',
  점심: 'lunch',
  저녁: 'dinner',
  간식: 'snack'
}

const mealKey = mealKeyMap[props.label] || null

const showModal = ref(false)
const editingFood = ref(null)
const foods = ref([])

const recalcTotal = () => {
  const total = foods.value.reduce((sum, f) => sum + Number(f.kcal || 0), 0)
  if (mealKey) {
    dietStore.meals[mealKey] = total
  }
}

const openAddModal = () => {
  editingFood.value = null
  showModal.value = true
}

const openEditModal = food => {
  editingFood.value = { ...food }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingFood.value = null
}

const handleSaveFood = food => {
  if (editingFood.value) {
    foods.value = foods.value.map(f =>
      f.id === editingFood.value.id
        ? {
            ...f,
            ...food,
            images: food.previews?.length ? food.previews : f.images
          }
        : f
    )
  } else {
    foods.value.push({
      id: Date.now() + Math.random(),
      name: food.name,
      kcal: food.kcal,
      protein: food.protein,
      carb: food.carb,
      fat: food.fat,
      images:
        food.previews && food.previews.length
          ? food.previews
          : [foodexample]
    })
  }
  recalcTotal()
  closeModal()
}

const removeFood = id => {
  foods.value = foods.value.filter(f => f.id !== id)
  recalcTotal()
}
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
