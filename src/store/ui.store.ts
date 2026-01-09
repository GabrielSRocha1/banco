import { create } from 'zustand';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

interface UIState {
  isLoading: boolean;
  toasts: Toast[];
  
  setLoading: (loading: boolean) => void;
  showToast: (toast: Omit<Toast, 'id'>) => void;
  hideToast: (id: string) => void;
  clearToasts: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isLoading: false,
  toasts: [],

  setLoading: (loading) =>
    set({
      isLoading: loading,
    }),

  showToast: (toast) =>
    set((state) => ({
      toasts: [
        ...state.toasts,
        {
          ...toast,
          id: Date.now().toString(),
        },
      ],
    })),

  hideToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),

  clearToasts: () =>
    set({
      toasts: [],
    }),
}));