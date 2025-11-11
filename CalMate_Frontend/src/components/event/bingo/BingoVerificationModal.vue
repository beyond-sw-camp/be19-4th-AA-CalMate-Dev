<template>
  <Teleport to="body">
    <transition name="verification-fade">
      <div v-if="isOpen" class="verification-overlay">
        <div class="verification-backdrop" @click="closeModal" />
        <div class="verification-card">
          <header class="verification-header">
            <div>
              <p class="verification-title">목표 인증하기</p>
              <p v-if="currentCell" class="verification-subtitle">
                {{ currentCell.label }} · {{ currentCell.description }}
              </p>
            </div>
            <Button variant="ghost" size="icon" class="close-button" @click="closeModal">
              <X class="h-4 w-4" />
            </Button>
          </header>

          <section class="upload-section" :class="{ 'upload-section--readonly': currentCell?.completed }">
            <div v-if="previewImage" class="preview-wrapper">
              <img :src="previewImage" alt="인증 사진" class="preview-image" />
              <Button
                v-if="!(currentCell && currentCell.completed)"
                type="button"
                variant="secondary"
                size="sm"
                class="preview-reset"
                @click="resetImage"
              >
                다시 선택
              </Button>
            </div>
            <label v-else class="upload-box">
              <div class="upload-icon">
                <Camera class="h-6 w-6" />
              </div>
              <div>
                <p class="upload-label">인증 사진</p>
                <p class="upload-hint">파일을 선택하거나 끌어다 놓으세요</p>
              </div>
              <Input
                type="file"
                accept="image/*"
                class="sr-only"
                @change="handleImageChange"
              />
            </label>
          </section>

          <p class="upload-helper">최대 10MB, 이미지 파일만 가능합니다.</p>

          <div v-if="currentCell && currentCell.completed" class="completed-banner">
            <span>✓</span>
            <p>{{ currentCell.date }}에 인증 완료</p>
          </div>

          <footer class="verification-footer">
            <Button variant="outline" @click="closeModal">
              {{ currentCell && currentCell.completed ? '닫기' : '취소' }}
            </Button>
            <Button
              v-if="currentCell && currentCell.completed"
              variant="destructive"
              @click="handleRemoveVerification"
            >
              인증 취소
            </Button>
            <Button
              v-else
              class="submit-button"
              :disabled="!uploadedImage"
              @click="handleSubmitVerification"
            >
              인증 완료
            </Button>
          </footer>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script>
import { computed, defineComponent, onBeforeUnmount, ref, watch } from 'vue';
import { Camera, X } from 'lucide-vue-next';
import Button from '../ui/Button.vue';
import Input from '../ui/Input.vue';
import { checkBingoLines, isBingoComplete } from '../lib/bingoData.js';
import { POINTS_RULES } from '../lib/pointsSystem.js';
import { useToast } from '../lib/toast.js';

export default defineComponent({
  name: 'BingoVerificationModal',
  components: {
    Button,
    Input,
    Camera,
    X,
  },
  props: {
    selectedCell: {
      type: Object,
      default: null,
    },
    board: {
      type: Array,
      required: true,
    },
    completedLines: {
      type: Number,
      required: true,
    },
    totalPoints: {
      type: Number,
      required: true,
    },
  },
  emits: ['update:board', 'update:completedLines', 'update:totalPoints', 'close'],
  setup(props, { emit }) {
    const { success, error, info } = useToast();
    const uploadedImage = ref(null);
    const isOpen = computed(() => Boolean(props.selectedCell));

    const currentCell = computed(() => {
      if (!props.selectedCell) return null;
      const { row, col } = props.selectedCell;
      return props.board[row]?.[col] ?? null;
    });

    const previewImage = computed(() => uploadedImage.value || currentCell.value?.photo || null);

    watch(
      () => props.selectedCell,
      () => {
        uploadedImage.value = null;
      },
    );

    watch(
      isOpen,
      (value) => {
        if (value) {
          document.body.classList.add('overflow-hidden');
          window.addEventListener('keydown', handleKeydown);
        } else {
          document.body.classList.remove('overflow-hidden');
          window.removeEventListener('keydown', handleKeydown);
        }
      },
      { immediate: true },
    );

    function handleImageChange(event) {
      const file = event.target.files?.[0];
      if (!file) return;

      if (file.size > 10 * 1024 * 1024) {
        error('파일 크기는 10MB를 초과할 수 없습니다.');
        return;
      }

      if (!file.type.startsWith('image/')) {
        error('이미지 파일만 업로드할 수 있습니다.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        uploadedImage.value = reader.result;
      };
      reader.readAsDataURL(file);
    }

    function handleSubmitVerification() {
      if (!props.selectedCell || !uploadedImage.value) {
        error('사진을 업로드해주세요.');
        return;
      }

      const { row, col } = props.selectedCell;
      const newBoard = props.board.map((rowData, i) =>
        rowData.map((cell, j) => {
          if (i === row && j === col) {
            return {
              ...cell,
              completed: true,
              date: new Date().toISOString().split('T')[0],
              photo: uploadedImage.value,
            };
          }
          return cell;
        }),
      );

      const wasComplete = isBingoComplete(props.board);
      const newLines = checkBingoLines(newBoard);
      const lineIncrease = newLines - props.completedLines;
      const newPoints = props.totalPoints + lineIncrease * POINTS_RULES.BINGO_LINE;

      emit('update:board', newBoard);
      emit('update:completedLines', newLines);

      if (!wasComplete && isBingoComplete(newBoard)) {
        emit('update:totalPoints', newPoints + POINTS_RULES.BINGO_COMPLETE);
        success(`🎉 빙고 완성! ${POINTS_RULES.BINGO_COMPLETE} 포인트 획득!`);
      } else if (lineIncrease > 0) {
        emit('update:totalPoints', newPoints);
        success(`빙고 라인 완성! ${lineIncrease * POINTS_RULES.BINGO_LINE} 포인트 획득!`);
      } else {
        emit('update:totalPoints', newPoints);
        success('인증 완료!');
      }

      closeModal();
    }

    function handleRemoveVerification() {
      if (!props.selectedCell) return;
      const { row, col } = props.selectedCell;

      const newBoard = props.board.map((rowData, i) =>
        rowData.map((cell, j) => {
          if (i === row && j === col) {
            return {
              ...cell,
              completed: false,
              date: undefined,
              photo: undefined,
            };
          }
          return cell;
        }),
      );

      const newLines = checkBingoLines(newBoard);
      const lineDecrease = props.completedLines - newLines;
      const newPoints = Math.max(0, props.totalPoints - lineDecrease * POINTS_RULES.BINGO_LINE);

      emit('update:board', newBoard);
      emit('update:completedLines', newLines);
      emit('update:totalPoints', newPoints);

      info('인증이 취소되었습니다.');
      closeModal();
    }

    function closeModal() {
      uploadedImage.value = null;
      emit('close');
    }

    function resetImage() {
      uploadedImage.value = null;
    }

    function handleKeydown(event) {
      if (event.key === 'Escape') {
        closeModal();
      }
    }

    onBeforeUnmount(() => {
      document.body.classList.remove('overflow-hidden');
      window.removeEventListener('keydown', handleKeydown);
    });

    return {
      uploadedImage,
      isOpen,
      currentCell,
      previewImage,
      handleImageChange,
      handleSubmitVerification,
      handleRemoveVerification,
      closeModal,
      resetImage,
    };
  },
});
</script>

<style scoped>
.verification-overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

.verification-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(3px);
}

.verification-card {
  position: relative;
  width: min(420px, 90vw);
  border-radius: 24px;
  background: #ffffff;
  padding: 1.75rem;
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.15);
}

.verification-header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.verification-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #0f172a;
}

.verification-subtitle {
  margin-top: 0.25rem;
  color: #94a3b8;
  font-size: 0.9rem;
}

.close-button {
  border-radius: 999px;
  width: 36px;
  height: 36px;
  color: #94a3b8;
}

.upload-section {
  border: 1px dashed #dbeafe;
  border-radius: 20px;
  padding: 1.25rem;
  background: #f8fbff;
  text-align: center;
}

.upload-section--readonly {
  border-style: solid;
  border-color: #e5e7eb;
  background: #f9fafb;
}

.upload-box {
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: center;
  cursor: pointer;
}

.upload-icon {
  width: 52px;
  height: 52px;
  border-radius: 16px;
  background: #eef2ff;
  color: #7c3aed;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-label {
  font-weight: 600;
  color: #475569;
}

.upload-hint {
  font-size: 0.85rem;
  color: #94a3b8;
}

.upload-helper {
  margin-top: 0.75rem;
  font-size: 0.8rem;
  color: #94a3b8;
}

.preview-wrapper {
  position: relative;
}

.preview-image {
  width: 100%;
  border-radius: 16px;
  object-fit: cover;
}

.preview-reset {
  margin-top: 0.75rem;
}

.completed-banner {
  margin-top: 1rem;
  display: flex;
  gap: 0.5rem;
  align-items: center;
  padding: 0.75rem 1rem;
  border-radius: 16px;
  background: #ecfdf5;
  color: #047857;
  font-weight: 600;
}

.verification-footer {
  margin-top: 1.5rem;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.submit-button {
  min-width: 110px;
}

.verification-fade-enter-active,
.verification-fade-leave-active {
  transition: opacity 0.25s ease;
}

.verification-fade-enter-from,
.verification-fade-leave-to {
  opacity: 0;
}
</style>
