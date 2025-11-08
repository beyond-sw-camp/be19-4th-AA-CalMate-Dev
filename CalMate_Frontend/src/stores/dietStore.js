import { reactive, computed } from 'vue'

export const dietStore = reactive({
  meals: {
    breakfast: 0,
    lunch: 0,
    dinner: 0,
    snack: 0
  },
  get total() {
    return Object.values(this.meals).reduce((a, b) => a + b, 0)
  }
})
