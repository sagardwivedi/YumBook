import { useEffect, useState } from "react";
import type { ToastProps, ToastActionElement } from "~/components/ui/toast";

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;

type ToastetToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

enum ToastActionTypes {
  ADD_TOAST = "ADD_TOAST",
  UPDATE_TOAST = "UPDATE_TOAST",
  DISMISS_TOAST = "DISMISS_TOAST",
  REMOVE_TOAST = "REMOVE_TOAST",
}

let toastIdCounter = 0;

const generateToastId = (): string => {
  toastIdCounter = (toastIdCounter + 1) % Number.MAX_SAFE_INTEGER;
  return toastIdCounter.toString();
};

type ToastAction =
  | { type: ToastActionTypes.ADD_TOAST; toast: ToastetToast }
  | { type: ToastActionTypes.UPDATE_TOAST; toast: Partial<ToastetToast> }
  | { type: ToastActionTypes.DISMISS_TOAST; toastId?: string }
  | { type: ToastActionTypes.REMOVE_TOAST; toastId?: string };

interface ToastState {
  toasts: ToastetToast[];
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const scheduleToastRemoval = (toastId: string) => {
  if (toastTimeouts.has(toastId)) return;

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatchToastAction({ type: ToastActionTypes.REMOVE_TOAST, toastId });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
};

const toastReducer = (state: ToastState, action: ToastAction): ToastState => {
  switch (action.type) {
    case ToastActionTypes.ADD_TOAST:
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case ToastActionTypes.UPDATE_TOAST:
      return {
        ...state,
        toasts: state.toasts.map((toast) =>
          toast.id === action.toast.id ? { ...toast, ...action.toast } : toast,
        ),
      };

    case ToastActionTypes.DISMISS_TOAST: {
      const { toastId } = action;

      if (toastId) {
        scheduleToastRemoval(toastId);
      } else {
        for (const id of toastTimeouts.keys()) {
          scheduleToastRemoval(id);
        }
      }

      return {
        ...state,
        toasts: state.toasts.map((toast) =>
          toast.id === toastId || toastId === undefined
            ? { ...toast, open: false }
            : toast,
        ),
      };
    }
    case ToastActionTypes.REMOVE_TOAST:
      return {
        ...state,
        toasts: action.toastId
          ? state.toasts.filter((toast) => toast.id !== action.toastId)
          : [],
      };

    default:
      return state;
  }
};

const toastListeners: Array<(state: ToastState) => void> = [];
let toastMemoryState: ToastState = { toasts: [] };

const dispatchToastAction = (action: ToastAction) => {
  toastMemoryState = toastReducer(toastMemoryState, action);
  for (const listener of toastListeners) {
    listener(toastMemoryState);
  }
};

type ToastPropsWithoutId = Omit<ToastetToast, "id">;

function toast(props: ToastPropsWithoutId) {
  const id = generateToastId();

  const updateToast = (updatedProps: Partial<ToastetToast>) =>
    dispatchToastAction({
      type: ToastActionTypes.UPDATE_TOAST,
      toast: { ...updatedProps, id },
    });

  const dismissToast = () =>
    dispatchToastAction({ type: ToastActionTypes.DISMISS_TOAST, toastId: id });

  dispatchToastAction({
    type: ToastActionTypes.ADD_TOAST,
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismissToast();
      },
    },
  });

  return { id, dismissToast, updateToast };
}

const useToast = () => {
  const [state, setState] = useState<ToastState>(toastMemoryState);

  useEffect(() => {
    toastListeners.push(setState);
    return () => {
      const index = toastListeners.indexOf(setState);
      if (index > -1) {
        toastListeners.splice(index, 1);
      }
    };
  }, []);

  return {
    ...state,
    toast,
    dismissToast: (toastId?: string) =>
      dispatchToastAction({ type: ToastActionTypes.DISMISS_TOAST, toastId }),
  };
};

export { toast, useToast };
