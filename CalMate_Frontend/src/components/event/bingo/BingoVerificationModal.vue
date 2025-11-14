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
                :disabled="currentCell?.completed"
                @change="handleImageChange"
              />
            </label>
          </section>

          <section
            v-if="currentCell?.uploads?.length"
            class="existing-proof"
          >
            <p class="existing-proof__title">기존 인증 사진</p>
            <div class="existing-proof__grid">
              <img
                v-for="(p, index) in currentCell.uploads"
                :key="p.id ?? p.uploadId ?? index"
                :src="resolveFileUrl(p.path || p.fullUrl || p.url || '')"
                alt="기존 인증 이미지"
                class="existing-proof__image"
              />
            </div>
          </section>

          <p class="upload-helper">최대 10MB, 이미지 파일만 가능합니다.</p>

          <div v-if="currentCell && currentCell.completed" class="completed-banner">
            <span>✓</span>
            <p>{{ formatDate(currentCell.checkedAt) }}에 인증 완료</p>
          </div>

          <footer class="verification-footer">
            <Button variant="outline" @click="closeModal">
              {{ currentCell && currentCell.completed ? '닫기' : '취소' }}
            </Button>
            <Button
              v-if="currentCell && currentCell.completed"
              variant="destructive"
              class="cancel-button"
              :disabled="isCancelling"
              @click="handleCancelVerification"
            >
              {{ isCancelling ? '취소 중...' : '인증 취소' }}
            </Button>
            <Button
              v-else
              class="submit-button"
              :disabled="!uploadedFile || isSubmitting"
              @click="handleSubmitVerification"
            >
              {{ isSubmitting ? '업로드 중...' : '인증 완료' }}
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
import { useToast } from '../lib/toast.js';
import { cancelBingoCellCheck, checkBingoCell, deleteBingoFile } from '@/api/bingo';
import api from '@/lib/api';

const LOOPBACK_HOSTS = new Set(['localhost', '127.0.0.1', '::1']);

function resolveFileUrl(path) {
  if (!path) return '';
  if (/^https?:/i.test(path)) return path;

  const normalized = path.startsWith('/') ? path : `/${path}`;
  const baseURL = api.defaults?.baseURL;
  if (!baseURL) return normalized;

  if (typeof window !== 'undefined') {
    try {
      const baseHost = new URL(baseURL).hostname;
      const pageHost = window.location.hostname;
      if (LOOPBACK_HOSTS.has(baseHost) && !LOOPBACK_HOSTS.has(pageHost)) {
        return normalized;
      }
    } catch (error) {
      console.warn('Failed to resolve bingo file URL', error);
      return normalized;
    }
  }

  return `${baseURL}${normalized}`;
}

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
    boardId: {
      type: Number,
      default: null,
    },
    memberId: {
      type: [Number, String],
      default: null,
    },
    extendFilePathId: {
      type: [Number, String],
      default: null,
    },
  },
  emits: ['close', 'verification-success'],
  setup(props, { emit }) {
    const { success, error } = useToast();
    const uploadedFile = ref(null);
    const uploadedPreview = ref(null);
    const isSubmitting = ref(false);
    const isCancelling = ref(false);
    const isOpen = computed(() => Boolean(props.selectedCell));

    const currentCell = computed(() => {
      if (!props.selectedCell) return null;
      const { row, col } = props.selectedCell;
      return props.board[row]?.[col] ?? null;
    });

    const previewImage = computed(() => {
      if (uploadedPreview.value) return uploadedPreview.value;
      if (currentCell.value?.photo) return resolveFileUrl(currentCell.value.photo);
      if (currentCell.value?.uploads?.[0]?.fullUrl) return resolveFileUrl(currentCell.value.uploads[0].fullUrl);
      return null;
    });

    watch(
      () => props.selectedCell,
      () => {
        resetImage();
        isSubmitting.value = false;
        isCancelling.value = false;
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

      uploadedFile.value = file;
      const reader = new FileReader();
      reader.onloadend = () => {
        uploadedPreview.value = reader.result;
      };
      reader.readAsDataURL(file);
    }

    async function handleSubmitVerification() {
      if (!props.selectedCell || !currentCell.value) {
        error('인증할 셀을 선택해주세요.');
        return;
      }
      if (currentCell.value.completed) {
        error('이미 인증이 완료된 셀입니다.');
        return;
      }
      if (!uploadedFile.value) {
        error('사진을 업로드해주세요.');
        return;
      }
      if (!props.boardId || !props.memberId) {
        error('사용자 정보를 확인할 수 없습니다.');
        return;
      }

      isSubmitting.value = true;
      try {
        await checkBingoCell({
          boardId: props.boardId,
          cellId: currentCell.value.cellId ?? currentCell.value.id,
          memberId: props.memberId,
          file: uploadedFile.value,
          extendFilePathId: props.extendFilePathId,
        });
        success('인증이 완료되었어요!');
        emit('verification-success');
        closeModal();
      } catch (err) {
        console.error(err);
        error('인증에 실패했습니다. 잠시 후 다시 시도해주세요.');
      } finally {
        isSubmitting.value = false;
      }
    }

    const normalizeUploadId = (upload) => {
      if (!upload || typeof upload !== 'object') return null;
      const candidate =
        upload.uploadId ??
        upload.id ??
        upload.fileId ??
        upload.file?.uploadId ??
        upload.file?.id ??
        upload.file?.fileId ??
        null;

      if (candidate == null) return null;
      const numeric = Number(candidate);
      return Number.isFinite(numeric) ? numeric : candidate;
    };

    const extractUploadFileIds = (cell) => {
      if (!cell?.uploads?.length) return [];
      const ids = [];

      cell.uploads.forEach((upload) => {
        const id = normalizeUploadId(upload);
        if (id == null) return;
        if (!ids.includes(id)) {
          ids.push(id);
        }
      });

      return ids;
    };

    async function handleCancelVerification() {
      if (!props.selectedCell || !currentCell.value) {
        error('취소할 셀을 선택해주세요.');
        return;
      }
      if (!currentCell.value.completed) {
        error('아직 인증되지 않은 셀입니다.');
        return;
      }
      if (!props.boardId || !props.memberId) {
        error('사용자 정보를 확인할 수 없습니다.');
        return;
      }

      const fileIds = extractUploadFileIds(currentCell.value);

      const confirmed = window.confirm('등록된 인증을 취소할까요? 업로드한 사진이 삭제됩니다.');
      if (!confirmed) return;

      isCancelling.value = true;
      try {
        if (fileIds.length) {
          await Promise.all(
            fileIds.map((fileId) =>
              deleteBingoFile({
                fileId,
                memberId: props.memberId,
              }),
            ),
          );
        }

        await cancelBingoCellCheck({
          boardId: props.boardId,
          cellId: currentCell.value.cellId ?? currentCell.value.id,
          memberId: props.memberId,
        });
        success('인증을 취소했어요.');
        emit('verification-success');
        closeModal();
      } catch (err) {
        console.error(err);
        error('인증 취소에 실패했습니다. 잠시 후 다시 시도해주세요.');
      } finally {
        isCancelling.value = false;
      }
    }

    function closeModal() {
      resetImage();
      isSubmitting.value = false;
      isCancelling.value = false;
      emit('close');
    }

    function resetImage() {
      uploadedFile.value = null;
      uploadedPreview.value = null;
    }

    function handleKeydown(event) {
      if (event.key === 'Escape') {
        closeModal();
      }
    }

    function formatDate(value) {
      if (!value) return '';
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return value;
      return date.toLocaleDateString();
    }

    onBeforeUnmount(() => {
      document.body.classList.remove('overflow-hidden');
      window.removeEventListener('keydown', handleKeydown);
    });

    return {
      uploadedFile,
      isOpen,
      currentCell,
      previewImage,
      isSubmitting,
      handleImageChange,
      handleSubmitVerification,
      handleCancelVerification,
      closeModal,
      resetImage,
      formatDate,
      isCancelling,
      resolveFileUrl,
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

.existing-proof {
  margin-top: 1rem;
}

.existing-proof__title {
  font-size: 0.85rem;
  font-weight: 600;
  color: #475569;
  margin-bottom: 0.5rem;
}

.existing-proof__grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.existing-proof__image {
  width: 88px;
  height: 88px;
  object-fit: cover;
  border-radius: 0.75rem;
  border: 1px solid rgba(15, 23, 42, 0.08);
  background: #f8fafc;
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

.submit-button,
.cancel-button {
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
