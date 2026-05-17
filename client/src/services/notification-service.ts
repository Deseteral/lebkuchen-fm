import { createSignal } from 'solid-js';
import { AppNotification } from '../types/notification';

const MAX_HISTORY = 100;
const TOAST_DISMISS_MS = 5000;
const TOAST_CLOSE_ANIMATION_MS = 180;

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

function addNotification(title: string, message: string) {
  const notification: AppNotification = {
    id: crypto.randomUUID(),
    title,
    message,
    timestamp: Date.now(),
  };

  setNotifications((current) => {
    const next = [notification, ...current];
    if (next.length > MAX_HISTORY) {
      return next.slice(0, MAX_HISTORY);
    }
    return next;
  });

  setActiveToasts((current) => {
    const next = [notification, ...current];
    return next;
  });

  scheduleDismiss(notification.id);
}

function clearAll() {
  toastTimers.forEach((timer) => clearTimeout(timer));
  toastTimers.clear();
  setNotifications([]);
  setActiveToasts([]);
  setClosingToastIds(new Set());
}

const NotificationService = {
  notifications,
  activeToasts,
  closingToastIds,
  addNotification,
  dismissToast,
  clearAll,
};

export { NotificationService };
