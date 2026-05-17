import { createSignal } from 'solid-js';
import { clearWindowRect } from './window-storage';

interface WindowMetadata {
  appId: string | null;
  parentAppId?: string;
  closeWithParent?: boolean;
  title: string;
  defaultRect: { width: string; height: string };
  close?: () => void;
  persistWindowRect?: boolean;
}

const windowRegistry = new Map<HTMLDivElement, WindowMetadata>();
const focusCallbacks = new Map<string, () => void>();

const [activeWindowEl, setActiveWindowEl] = createSignal<HTMLDivElement | null>(null);
const [activeAppId, setActiveAppId] = createSignal<string | null>(null);
const [activeAppTitle, setActiveAppTitle] = createSignal<string | null>(null);

function getGroupId(meta: WindowMetadata): string | null {
  return meta.parentAppId ?? meta.appId;
}

function getGroupMembers(el: HTMLDivElement): HTMLDivElement[] {
  const meta = windowRegistry.get(el);
  if (!meta) return [el];

  const groupId = getGroupId(meta);
  if (!groupId) return [el];

  const members: HTMLDivElement[] = [];
  for (const [memberEl, memberMeta] of windowRegistry) {
    if (getGroupId(memberMeta) === groupId) {
      members.push(memberEl);
    }
  }
  return members;
}

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
  if (!meta) {
    setActiveAppId(null);
    setActiveAppTitle(null);
    return;
  }

  // If this is a child window, resolve the parent's identity for the menu bar
  if (meta.parentAppId) {
    for (const [, parentMeta] of windowRegistry) {
      if (parentMeta.appId === meta.parentAppId) {
        setActiveAppId(parentMeta.appId);
        setActiveAppTitle(parentMeta.title);
        return;
      }
    }
  }

  setActiveAppId(meta.appId ?? null);
  setActiveAppTitle(meta.title ?? null);
}

function registerWindow(
  el: HTMLDivElement,
  appId: string | null,
  title: string,
  defaultRect: { width: string; height: string },
  close?: () => void,
  focus?: () => void,
  parentAppId?: string,
  closeWithParent?: boolean,
  persistWindowRect?: boolean,
) {
  windowRegistry.set(el, {
    appId,
    parentAppId,
    closeWithParent,
    title,
    defaultRect,
    close,
    persistWindowRect,
  });
  if (appId && focus) {
    focusCallbacks.set(appId, focus);
  }
}

function unregisterWindow(el: HTMLDivElement) {
  const meta = windowRegistry.get(el);
  if (meta?.appId) {
    focusCallbacks.delete(meta.appId);
  }
  windowRegistry.delete(el);
}

function getBiggestZIndex(container: ParentNode): number {
  let biggest = 0;
  const children = container.childNodes as NodeListOf<HTMLElement>;
  for (const child of Array.from(children)) {
    const z = +child.style.zIndex;
    if (z > biggest) biggest = z;
  }
  return biggest;
}

function setActiveWindow(el: HTMLDivElement) {
  if (!el.parentNode) return;

  const currentZ = +el.style.zIndex;
  const maxZ = getBiggestZIndex(el.parentNode);

  // Bring all group members to front together
  const members = getGroupMembers(el);
  if (members.length > 1) {
    const baseZ = maxZ + 1;
    let z = baseZ;
    for (const member of members) {
      if (member !== el) {
        member.style.zIndex = `${z}`;
        z++;
      }
    }
    el.style.zIndex = `${z}`;
  } else if (maxZ > currentZ) {
    el.style.zIndex = `${maxZ + 1}`;
  }

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

function activateWindow(appId: string): boolean {
  const focus = focusCallbacks.get(appId);
  if (focus) {
    focus();
    return true;
  }
  return false;
}

function resetActiveWindowPosition() {
  const el = activeWindowEl();
  if (!el) return;

  const meta = windowRegistry.get(el);
  if (!meta) return;

  if (meta.appId && meta.persistWindowRect !== false) {
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

  // If this is a parent window, close children that have closeWithParent
  if (meta.appId) {
    for (const [, childMeta] of windowRegistry) {
      if (childMeta.parentAppId === meta.appId && childMeta.closeWithParent && childMeta.close) {
        childMeta.close();
      }
    }
  }

  meta.close();
}

function isInActiveGroup(el: HTMLDivElement): boolean {
  const active = activeWindowEl();
  if (!active) return false;
  if (active === el) return true;

  const myMeta = windowRegistry.get(el);
  const activeMeta = windowRegistry.get(active);
  if (!myMeta || !activeMeta) return false;

  const myGroup = getGroupId(myMeta);
  const activeGroup = getGroupId(activeMeta);
  return myGroup !== null && myGroup === activeGroup;
}

function deactivateAllWindows() {
  setActiveWindowEl(null);
  updateActiveMetadata(null);
}

// --- Viewport clamping ---

const CLAMP_VISIBLE_PX = 40;
const CLAMP_ANIMATION_MS = 150;
let cachedMenuBarHeight = 0;
let resizeTimer: ReturnType<typeof setTimeout> | undefined;

function getMenuBarHeight(): number {
  return cachedMenuBarHeight;
}

function clampWindowToViewport(el: HTMLDivElement) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const availableHeight = Math.max(CLAMP_VISIBLE_PX, vh - cachedMenuBarHeight);

  const left = el.offsetLeft;
  const top = el.offsetTop;
  let width = el.offsetWidth;
  let height = el.offsetHeight;

  const clampedWidth = Math.min(width, vw);
  const clampedHeight = Math.min(height, availableHeight);

  if (clampedWidth !== width) {
    el.style.width = `${clampedWidth}px`;
    width = clampedWidth;
  }

  if (clampedHeight !== height) {
    el.style.height = `${clampedHeight}px`;
    height = clampedHeight;
  }

  const minLeft = -(width - CLAMP_VISIBLE_PX);
  const maxLeft = vw - CLAMP_VISIBLE_PX;
  const minTop = cachedMenuBarHeight;
  const maxTop = vh - CLAMP_VISIBLE_PX;

  const clampedLeft = Math.max(minLeft, Math.min(left, maxLeft));
  const clampedTop = Math.max(minTop, Math.min(top, maxTop));

  if (clampedLeft === left && clampedTop === top) return;

  el.style.transition = `top ${CLAMP_ANIMATION_MS}ms ease-out, left ${CLAMP_ANIMATION_MS}ms ease-out`;
  el.style.left = `${clampedLeft}px`;
  el.style.top = `${clampedTop}px`;

  setTimeout(() => {
    el.style.transition = '';
  }, CLAMP_ANIMATION_MS);
}

function clampAllWindowsToViewport() {
  for (const [el] of windowRegistry) {
    clampWindowToViewport(el);
  }
}

function handleResize() {
  if (resizeTimer) clearTimeout(resizeTimer);
  resizeTimer = setTimeout(clampAllWindowsToViewport, 100);
}

function initWindowManager() {
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--menu-bar-height');
  cachedMenuBarHeight = parseInt(raw, 10) || 0;
  window.addEventListener('resize', handleResize);
}

function cleanupWindowManager() {
  window.removeEventListener('resize', handleResize);
  if (resizeTimer) clearTimeout(resizeTimer);
}

export {
  activeWindowEl,
  activeAppId,
  activeAppTitle,
  setActiveWindow,
  clearActiveWindow,
  activateWindow,
  deactivateAllWindows,
  getActiveWindowPosition,
  getBiggestZIndex,
  getMenuBarHeight,
  registerWindow,
  unregisterWindow,
  resetActiveWindowPosition,
  closeActiveWindow,
  isInActiveGroup,
  clampWindowToViewport,
  initWindowManager,
  cleanupWindowManager,
};
