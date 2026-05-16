import { createSignal, createEffect } from 'solid-js';
import { activeWindowEl, activateWindow, deactivateAllWindows } from './window-manager';

const [selectedIconId, setSelectedIconId] = createSignal<string | null>(null);

// When a window becomes active, clear icon selection (mutually exclusive)
createEffect(() => {
  if (activeWindowEl()) {
    setSelectedIconId(null);
  }
});

function selectIcon(appId: string) {
  deactivateAllWindows();
  setSelectedIconId(appId);
}

function activateApp(appId: string): boolean {
  return activateWindow(appId);
}

function clearAll() {
  deactivateAllWindows();
  setSelectedIconId(null);
}

export const DesktopManager = {
  selectedIconId,
  selectIcon,
  activateApp,
  clearAll,
};
