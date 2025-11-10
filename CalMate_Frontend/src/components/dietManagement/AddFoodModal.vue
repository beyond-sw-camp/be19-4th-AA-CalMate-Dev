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
          <input v-model="form.name" type="text" class="field-input" placeholder="음식 이름을 입력해주세요" />
        </div>

        <div class="field-row">
          <div class="field">
            <label>칼로리 (kcal)</label>
            <input v-model="form.kcal" type="text" class="field-input" placeholder="예: 300" />
          </div>
          <div class="field">
            <label>P (단백질, g)</label>
            <input v-model="form.protein" type="text" class="field-input" placeholder="예: 5.6" />
          </div>
        </div>

        <div class="field-row">
          <div class="field">
            <label>C (탄수화물, g)</label>
            <input v-model="form.carb" type="text" class="field-input" placeholder="예: 66" />
          </div>
          <div class="field">
            <label>F (지방, g)</label>
            <input v-model="form.fat" type="text" class="field-input" placeholder="예: 0.5" />
          </div>
        </div>

        <div class="field">
          <div class="field-top">
            <label>사진 추가 (선택)</label>
            <button class="add-btn" @click="openFileDialog">추가</button>
          </div>

          <div class="image-box">
            <div v-if="!form.previews.length" class="placeholder">
              아직 이미지가 없습니다.
            </div>
            <div v-else class="preview-grid">
              <div v-for="(src, i) in form.previews" :key="i" class="preview">
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

      <input ref="fileInput" type="file" accept="image/*" multiple class="hidden" @change="onFileChange" />
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import closeIcon from '@/assets/images/close.png'

const emit = defineEmits(['close', 'save'])
const fileInput = ref(null)
const form = reactive({ name: '', kcal: '', protein: '', carb: '', fat: '', previews: [] })

const onClose = () => emit('close')
const openFileDialog = () => fileInput.value?.click()
const onFileChange = e => Array.from(e.target.files).forEach(f => form.previews.push(URL.createObjectURL(f)))
const removePreview = i => form.previews.splice(i, 1)
const onSubmit = () => {
  if (!form.name || !form.kcal) return alert('이름과 칼로리를 입력해주세요.')
  emit('save', { ...form })
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
