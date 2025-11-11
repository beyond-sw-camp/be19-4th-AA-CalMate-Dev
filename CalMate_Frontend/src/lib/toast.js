import { reactive } from 'vue';

const state = reactive({
  toasts: [],
});

let idCounter = 0;

export function useToast() {
  function pushToast(type, message, options = {}) {
    const id = idCounter++;
    const toast = {
      id,
      type,
      message,
      description: options.description ?? '',
      duration: options.duration ?? 3500,
    };

    state.toasts.push(toast);

    if (toast.duration > 0) {
      setTimeout(() => dismiss(id), toast.duration);
    }

    return id;
  }

  function dismiss(id) {
    const index = state.toasts.findIndex((toast) => toast.id === id);
    if (index !== -1) {
      state.toasts.splice(index, 1);
    }
  }

  return {
    success(message, options) {
      return pushToast('success', message, options);
    },
    error(message, options) {
      return pushToast('error', message, options);
    },
    info(message, options) {
      return pushToast('info', message, options);
    },
    dismiss,
  };
}

export function useToastState() {
  return state;
}
