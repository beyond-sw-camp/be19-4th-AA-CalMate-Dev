<template>
  <div v-if="visible" class="overlay">
    <div class="modal">
      <div class="modal-header">
        <div>
          <h3>운동 {{ isEdit ? '수정하기' : '기록하기' }}</h3>
          <p class="sub">오늘의 운동을 {{ isEdit ? '수정' : '기록' }}하세요</p>
        </div>
        <button class="close-btn" @click="onClose">
          <img :src="closeIcon" alt="close" class="close-icon" />
        </button>
      </div>

      <div class="modal-body">
        <div class="field">
          <span class="field-label">운동 종류</span>
          <input
            v-model="form.type"
            type="text"
            class="field-input"
            placeholder="운동을 입력해주세요!!"
          />
        </div>

        <div class="field">
          <span class="field-label">운동 시간 (분)</span>
          <input
            v-model="form.minutes"
            type="text"
            class="field-input"
            placeholder="운동 시간(분)을 입력해주세요!!"
          />
        </div>

        <div class="field">
          <span class="field-label">소모 칼로리 (kcal)</span>
          <input
            v-model="form.kcal"
            type="text"
            class="field-input"
            placeholder="소모 칼로리를 입력해주세요!!"
          />
        </div>

        <div class="field">
          <div class="field-top">
            <span class="field-label">사진 추가 (선택)</span>
            <button class="add-btn" type="button" @click="openFileDialog">
              추가
            </button>
          </div>

          <div class="image-box">
            <div
              v-if="!form.existingPreviews.length && !form.previews.length"
              class="placeholder-wrap"
            >
              <span class="placeholder-text">
                아직 이미지가 추가되지 않았습니다.
              </span>
            </div>

            <div v-else class="preview-grid">
              <div
                v-for="(item, idx) in form.existingPreviews"
                :key="'ex-' + (item.id ?? idx)"
                class="preview-item"
              >
                <img :src="item.url" alt="기존 이미지" />
                <button
                  type="button"
                  class="delete-badge"
                  @click.stop="removeExisting(idx)"
                >
                  ×
                </button>
              </div>

              <div
                v-for="(item, idx) in form.previews"
                :key="'new-' + idx"
                class="preview-item"
              >
                <img :src="item.url" alt="새 이미지" />
                <button
                  type="button"
                  class="delete-badge"
                  @click.stop="removePreview(idx)"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="submit-btn" type="button" @click="onSubmit">
          {{ isEdit ? '수정하기' : '기록하기' }}
        </button>
      </div>
    </div>

    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      multiple
      class="file-input-hidden"
      @change="onFileChange"
    />
  </div>
</template>

<script setup>
import { reactive, ref, computed, watch } from 'vue'
import closeIcon from '@/assets/images/close.png'

const props = defineProps({
  visible: { type: Boolean, default: false },
  mode: { type: String, default: 'create' },
  initialData: {
    type: Object,
    default: () => null,
  },
})

const emit = defineEmits(['close', 'save'])

const isEdit = computed(() => props.mode === 'edit')

const fileInput = ref(null)

const form = reactive({
  type: '',
  minutes: '',
  kcal: '',
  files: [],
  previews: [],
  existingPreviews: [],
})

const clearObjectUrls = () => {
  form.previews.forEach((p) => {
    if (p.isObjectUrl) {
      URL.revokeObjectURL(p.url)
    }
  })
}

const resetForm = () => {
  form.type = ''
  form.minutes = ''
  form.kcal = ''
  clearObjectUrls()
  form.files = []
  form.previews = []
  form.existingPreviews = []
}

const fillFormFromInitial = () => {
  if (!props.initialData) return
  form.type = props.initialData.type ?? ''
  form.minutes =
    props.initialData.minutes != null ? String(props.initialData.minutes) : ''
  form.kcal =
    props.initialData.kcal != null ? String(props.initialData.kcal) : ''
  clearObjectUrls()
  form.files = []
  form.previews = []
  form.existingPreviews = (props.initialData.files || []).map((f) => ({
    id: f.fileId ?? f.id,
    url: f.url,
  }))
}

watch(
  () => props.visible,
  (visible) => {
    if (visible) {
      if (isEdit.value && props.initialData) {
        fillFormFromInitial()
      } else {
        resetForm()
      }
    } else {
      resetForm()
    }
  },
)

const onClose = () => emit('close')

const openFileDialog = () => {
  fileInput.value?.click()
}

const addFilesToPreviews = (files) => {
  Array.from(files).forEach((file) => {
    const url = URL.createObjectURL(file)
    form.previews.push({ url, file, isObjectUrl: true })
    form.files.push(file)
  })
}

const onFileChange = (e) => {
  const files = e.target.files
  if (files?.length) addFilesToPreviews(files)
}

const removePreview = (idx) => {
  const item = form.previews[idx]
  if (!item) return
  if (item.isObjectUrl) {
    URL.revokeObjectURL(item.url)
  }
  form.previews.splice(idx, 1)
  form.files.splice(idx, 1)
}

const removeExisting = (idx) => {
  const item = form.existingPreviews[idx]
  if (!item) return
  form.existingPreviews.splice(idx, 1)
}

const onSubmit = () => {
  if (!form.type || !form.minutes || !form.kcal) {
    alert('운동 종류, 시간, 칼로리를 입력해주세요.')
    return
  }

  emit('save', {
    type: form.type,
    minutes: Number(form.minutes) || 0,
    kcal: Number(form.kcal) || 0,
    files: form.files,
    keepFileIds: form.existingPreviews.map((p) => p.id),
  })
}
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(15, 23, 42, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}
.modal {
  width: 540px;
  max-width: 90vw;
  background-color: #fff;
  border-radius: 20px;
  padding: 26px 30px 22px;
  box-shadow: 0 22px 45px rgba(15, 23, 42, 0.35);
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 18px;
}
.modal-header h3 {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 4px;
}
.sub {
  font-size: 14px;
  color: #8f909b;
}
.close-btn {
  border: none;
  background: transparent;
  cursor: pointer;
}
.close-icon {
  width: 20px;
  height: 20px;
}
.modal-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-width: 480px;
}
.field-label {
  font-size: 13px;
  font-weight: 600;
  color: #3b3c45;
}
.field-input {
  width: 100%;
  border-radius: 12px;
  border: 1px solid transparent;
  background-color: #f5f5f7;
  padding: 10px 14px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.15s ease, background-color 0.15s ease;
}
.field-input:focus {
  border-color: #6366f1;
  background-color: #fff;
}
.field-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.add-btn {
  border-radius: 10px;
  border: 1px solid #d1d5db;
  background-color: #f5f5f7;
  font-size: 13px;
  padding: 4px 12px;
  cursor: pointer;
}
.add-btn:hover {
  background-color: #e8e8ed;
}
.image-box {
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  min-height: 180px;
  background-color: #fafbff;
  overflow: hidden;
  display: flex;
  align-items: stretch;
  user-select: none;
}
.placeholder-wrap {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
.placeholder-text {
  color: #9ca3af;
  font-size: 14px;
}
.preview-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 8px;
}
.preview-item {
  position: relative;
  width: 90px;
  height: 90px;
  border-radius: 10px;
  overflow: hidden;
  background-color: #e5e7eb;
}
.preview-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.delete-badge {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 18px;
  height: 18px;
  border-radius: 999px;
  border: none;
  background-color: rgba(0, 0, 0, 0.55);
  color: #fff;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.file-input-hidden {
  display: none;
}
.modal-footer {
  margin-top: 22px;
}
.submit-btn {
  width: 100%;
  border-radius: 12px;
  border: none;
  padding: 11px 0;
  font-size: 15px;
  font-weight: 600;
  background-color: #8687a5;
  color: #fff;
  cursor: pointer;
}
</style>
