<template>
  <div class="overlay" @click.self="onClose">
    <div class="modal">
      <div class="modal-header">
        <h3>음식 추가</h3>
        <button class="close-btn" @click="onClose">
          <img :src="closeIcon" alt="close" class="close-icon" />
        </button>
      </div>

      <div class="modal-body">
        <div class="field">
          <label>음식 이름</label>
          <input
            v-model="form.name"
            type="text"
            class="field-input"
            placeholder="음식 이름을 입력해주세요"
          />
        </div>

        <div class="field-row">
          <div class="field">
            <label>칼로리 (kcal)</label>
            <input
              v-model="form.kcal"
              type="text"
              class="field-input"
              placeholder="예: 300"
            />
          </div>
          <div class="field">
            <label>P (단백질, g)</label>
            <input
              v-model="form.protein"
              type="text"
              class="field-input"
              placeholder="예: 5.6"
            />
          </div>
        </div>

        <div class="field-row">
          <div class="field">
            <label>C (탄수화물, g)</label>
            <input
              v-model="form.carb"
              type="text"
              class="field-input"
              placeholder="예: 66"
            />
          </div>
          <div class="field">
            <label>F (지방, g)</label>
            <input
              v-model="form.fat"
              type="text"
              class="field-input"
              placeholder="예: 0.5"
            />
          </div>
        </div>

        <div class="field">
          <div class="field-top">
            <label>사진 추가 (선택)</label>
            <button class="add-btn" @click="openFileDialog">추가</button>
          </div>

          <div class="image-box">
            <!-- 여기만 변경: form.previews 존재 여부 먼저 체크 -->
            <div
              v-if="!(form.previews && form.previews.length)"
              class="placeholder"
            >
              아직 이미지가 없습니다.
            </div>
            <div v-else class="preview-grid">
              <div
                v-for="(src, i) in form.previews"
                :key="i"
                class="preview"
              >
                <img :src="src" />
                <button class="delete" @click.stop="removePreview(i)">
                  <img :src="closeIcon" alt="close" class="delete-icon" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn cancel" @click="onClose">취소</button>
          <button class="btn confirm" @click="onSubmit">저장</button>
        </div>
      </div>

      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        multiple
        class="hidden"
        @change="onFileChange"
      />
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import closeIcon from '@/assets/images/close.png'

const props = defineProps({
  foodData: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'save'])
const fileInput = ref(null)

// 기존 이미지: [{ id, url }, ...]
const originalImages = ref(
  props.foodData && Array.isArray(props.foodData.images)
    ? props.foodData.images.map(img => ({ ...img }))
    : []
)

// 처음에는 기존 이미지 id 전부 유지
const keepFileIds = ref(originalImages.value.map(img => img.id))

const form = reactive({
  name: props.foodData?.name || '',
  kcal:
    props.foodData && (props.foodData.kcal || props.foodData.kcal === 0)
      ? String(props.foodData.kcal)
      : '',
  protein:
    props.foodData && (props.foodData.protein || props.foodData.protein === 0)
      ? String(props.foodData.protein)
      : '',
  carb:
    props.foodData && (props.foodData.carb || props.foodData.carb === 0)
      ? String(props.foodData.carb)
      : '',
  fat:
    props.foodData && (props.foodData.fat || props.foodData.fat === 0)
      ? String(props.foodData.fat)
      : '',
  // 항상 배열이 되도록 초기화
  previews: originalImages.value.map(img => img.url),
  files: []
})

const imagesTouched = ref(false)

const onClose = () => emit('close')

const openFileDialog = () => fileInput.value?.click()

const onFileChange = e => {
  const files = Array.from(e.target.files || [])
  if (!files.length) return

  imagesTouched.value = true

  files.forEach(f => {
    form.files.push(f)
    form.previews.push(URL.createObjectURL(f))
  })

  e.target.value = ''
}

const removePreview = i => {
  imagesTouched.value = true

  // 화면에서 제거
  form.previews.splice(i, 1)

  const originalCount = originalImages.value.length

  if (i < originalCount) {
    // 기존 이미지 삭제 → 유지 목록에서 해당 id 제거
    originalImages.value.splice(i, 1)
    keepFileIds.value = originalImages.value.map(img => img.id)
  } else {
    // 새로 추가한 파일 삭제
    const fileIndex = i - originalCount
    if (fileIndex >= 0 && fileIndex < form.files.length) {
      form.files.splice(fileIndex, 1)
    }
  }
}

const onSubmit = () => {
  if (!form.name || !form.kcal) {
    alert('이름과 칼로리를 입력해주세요.')
    return
  }

  emit('save', {
    name: form.name,
    kcal: form.kcal,
    protein: form.protein,
    carb: form.carb,
    fat: form.fat,
    previews: form.previews,
    files: form.files,
    imagesTouched: imagesTouched.value,
    keepFileIds: keepFileIds.value
  })
  emit('close')
}
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal {
  background: #fff;
  border-radius: 16px;
  width: 500px;
  max-width: 90%;
  padding: 24px;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}
.close-btn {
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.close-icon {
  width: 20px;
  height: 20px;
  display: block;
}
.field {
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
}
.field-row {
  display: flex;
  gap: 12px;
}
.field-input {
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 8px 10px;
  font-size: 14px;
  outline: none;
}
.field-input:focus {
  border-color: #000;
}
.field-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.add-btn {
  padding: 4px 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #f4f4f4;
  cursor: pointer;
}
.image-box {
  border: 2px dashed #d1d5db;
  margin-top: 5px;
  border-radius: 12px;
  min-height: 160px;
  background: #fafafa;
  display: flex;
  justify-content: center;
  align-items: center;
}
.placeholder {
  color: #aaa;
  font-size: 14px;
}
.preview-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 8px;
}
.preview {
  position: relative;
  width: 90px;
  height: 90px;
  border-radius: 10px;
  overflow: hidden;
}
.preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.delete {
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  border-radius: 999px;
  width: 18px;
  height: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.delete-icon {
  width: 12px;
  height: 12px;
  filter: invert(1);
}
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 12px;
}
.btn {
  border: none;
  border-radius: 8px;
  padding: 8px 14px;
  cursor: pointer;
}
.btn.cancel {
  background: #f3f3f6;
}
.btn.confirm {
  background: #05030d;
  color: #fff;
}
.hidden {
  display: none;
}
</style>
