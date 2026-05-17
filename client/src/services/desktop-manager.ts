import { createSignal, createEffect, createRoot } from 'solid-js';
import { activeWindowEl, deactivateAllWindows } from './window-manager';

const [selectedIconId, setSelectedIconId] = createSignal<string | null>(null);
let desktopManagerDispose: (() => void) | null = null;

function initializeDesktopManager() {
  if (desktopManagerDispose) {
    return desktopManagerDispose;
  }

  desktopManagerDispose = createRoot((dispose) => {
    // When a window becomes active, clear icon selection (mutually exclusive)
    createEffect(() => {
      if (activeWindowEl()) {
        setSelectedIconId(null);
      }
    });

    return dispose;
  });

  return () => {
    if (!desktopManagerDispose) return;
    desktopManagerDispose();
    desktopManagerDispose = null;
  };
}

function selectIcon(appId: string) {
  deactivateAllWindows();
  setSelectedIconId(appId);
}

function clearAll() {
  deactivateAllWindows();
  setSelectedIconId(null);
}

export const DesktopManager = {
  selectedIconId,
  selectIcon,
  clearAll,
  initializeDesktopManager,
};
