function showToast(message, type) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('calmate:toast', {
        detail: {
          message,
          type,
          timestamp: Date.now(),
        },
      }),
    );
  }

  const prefix = `[${type.toUpperCase()}]`;
  if (type === 'error') {
    console.error(prefix, message);
  } else {
    console.log(prefix, message);
  }
}

export function useToast() {
  return {
    success: (message) => showToast(message, 'success'),
    error: (message) => showToast(message, 'error'),
    info: (message) => showToast(message, 'info'),
  };
}
