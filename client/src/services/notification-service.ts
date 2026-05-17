import { createSignal } from 'solid-js';
import { AppNotification } from '../types/notification';

const MAX_HISTORY = 100;
const TOAST_DISMISS_MS = 5000;
const TOAST_CLOSE_ANIMATION_MS = 180;

interface NotificationOptions {
  key?: string;
  sticky?: boolean;
  showInPanel?: boolean;
  showToast?: boolean;
}

const [notifications, setNotifications] = createSignal<AppNotification[]>([]);
const [activeToasts, setActiveToasts] = createSignal<AppNotification[]>([]);
const [closingToastIds, setClosingToastIds] = createSignal<Set<string>>(new Set());
const toastTimers = new Map<string, ReturnType<typeof setTimeout>>();

function removeToastTimer(id: string) {
  const timer = toastTimers.get(id);
  if (timer) {
    clearTimeout(timer);
    toastTimers.delete(id);
  }
}

function finalizeDismiss(id: string) {
  removeToastTimer(id);
  setActiveToasts((current) => current.filter((toast) => toast.id !== id));
  setClosingToastIds((current) => {
    const next = new Set(current);
    next.delete(id);
    return next;
  });
}

function dismissToast(id: string) {
  if (!activeToasts().some((toast) => toast.id === id)) return;

  setClosingToastIds((current) => {
    if (current.has(id)) return current;
    const next = new Set(current);
    next.add(id);
    return next;
  });
  setTimeout(() => finalizeDismiss(id), TOAST_CLOSE_ANIMATION_MS);
}

function scheduleDismiss(id: string) {
  removeToastTimer(id);
  toastTimers.set(
    id,
    setTimeout(() => dismissToast(id), TOAST_DISMISS_MS),
  );
}

function addNotification(title: string, message: string, options: NotificationOptions = {}) {
  const showInPanel = options.showInPanel ?? true;
  const showToast = options.showToast ?? true;

  const notification: AppNotification = {
    id: crypto.randomUUID(),
    key: options.key,
    title,
    message,
    timestamp: Date.now(),
    sticky: options.sticky,
  };

  if (showInPanel) {
    setNotifications((current) => {
      const next = [notification, ...current];
      if (next.length > MAX_HISTORY) {
        return next.slice(0, MAX_HISTORY);
      }
      return next;
    });
  }

  if (showToast) {
    setActiveToasts((current) => {
      const next = [notification, ...current];
      return next;
    });

    if (!options.sticky) {
      scheduleDismiss(notification.id);
    }
  }

  return notification.id;
}

function findToastByKey(key: string): AppNotification | undefined {
  return activeToasts().find((toast) => toast.key === key);
}

function dismissToastByKey(key: string) {
  const toast = findToastByKey(key);
  if (!toast) return;
  dismissToast(toast.id);
}

function upsertToastByKey(
  title: string,
  message: string,
  options: NotificationOptions & { key: string },
) {
  const existingToast = findToastByKey(options.key);
  if (existingToast) {
    return existingToast.id;
  }

  return addNotification(title, message, {
    ...options,
    showInPanel: options.showInPanel ?? false,
    showToast: options.showToast ?? true,
  });
}

function clearAll() {
  toastTimers.forEach((timer) => clearTimeout(timer));
  toastTimers.clear();
  setNotifications([]);
  setActiveToasts([]);
  setClosingToastIds(new Set<string>());
}

const NotificationService = {
  notifications,
  activeToasts,
  closingToastIds,
  addNotification,
  dismissToast,
  dismissToastByKey,
  upsertToastByKey,
  clearAll,
};

export { NotificationService };
