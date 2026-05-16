import { createSignal } from 'solid-js';
import { clearWindowRect } from './window-storage';

interface WindowMetadata {
  appId: string | null;
  title: string;
  defaultRect: { width: string; height: string };
  close?: () => void;
}

const windowRegistry = new Map<HTMLDivElement, WindowMetadata>();

const [activeWindowEl, setActiveWindowEl] = createSignal<HTMLDivElement | null>(null);
const [activeAppId, setActiveAppId] = createSignal<string | null>(null);
const [activeAppTitle, setActiveAppTitle] = createSignal<string | null>(null);

function getActiveWindowPosition(): { x: number; y: number } | null {
  const el = activeWindowEl();
  if (!el) return null;
  return { x: el.offsetLeft, y: el.offsetTop };
}

function updateActiveMetadata(el: HTMLDivElement | null) {
  if (!el) {
    setActiveAppId(null);
    setActiveAppTitle(null);
    return;
  }
  const meta = windowRegistry.get(el);
  setActiveAppId(meta?.appId ?? null);
  setActiveAppTitle(meta?.title ?? null);
}

function registerWindow(
  el: HTMLDivElement,
  appId: string | null,
  title: string,
  defaultRect: { width: string; height: string },
  close?: () => void,
) {
  windowRegistry.set(el, { appId, title, defaultRect, close });
}

function unregisterWindow(el: HTMLDivElement) {
  windowRegistry.delete(el);
}

function setActiveWindow(el: HTMLDivElement) {
  setActiveWindowEl(el);
  updateActiveMetadata(el);
}

function clearActiveWindow(el: HTMLDivElement) {
  if (activeWindowEl() !== el) return;

  const parent = el.parentNode;
  if (!parent) {
    setActiveWindowEl(null);
    updateActiveMetadata(null);
    return;
  }

  let topmost: HTMLElement | null = null;
  let highestZ = -1;

  const siblings = parent.childNodes as NodeListOf<HTMLElement>;
  for (const sibling of Array.from(siblings)) {
    if (sibling === el) continue;
    const z = +sibling.style.zIndex;
    if (z > highestZ) {
      highestZ = z;
      topmost = sibling;
    }
  }

  setActiveWindowEl(topmost as HTMLDivElement | null);
  updateActiveMetadata(topmost as HTMLDivElement | null);
}

function resetActiveWindowPosition() {
  const el = activeWindowEl();
  if (!el) return;

  const meta = windowRegistry.get(el);
  if (!meta) return;

  if (meta.appId) {
    clearWindowRect(meta.appId);
  }

  el.style.top = '100px';
  el.style.left = '100px';
  el.style.width = meta.defaultRect.width;
  el.style.height = meta.defaultRect.height;
}

function closeActiveWindow() {
  const el = activeWindowEl();
  if (!el) return;

  const meta = windowRegistry.get(el);
  if (!meta?.close) return;

  meta.close();
}

function clearAllActive() {
  setActiveWindowEl(null);
  updateActiveMetadata(null);
}

export {
  activeWindowEl,
  activeAppId,
  activeAppTitle,
  setActiveWindow,
  clearActiveWindow,
  getActiveWindowPosition,
  registerWindow,
  unregisterWindow,
  resetActiveWindowPosition,
  closeActiveWindow,
  clearAllActive,
};
