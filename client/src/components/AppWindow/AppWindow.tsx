import { Portal } from 'solid-js/web';
import { JSX, createEffect, onCleanup, untrack } from 'solid-js';
import styles from './AppWindow.module.css';
import { AppIcon } from '@components/AppIcon/AppIcon';
import { IconSpriteIndex } from '@components/AppIcon/IconSpritesheet';
import { PhIcon, PhIconType } from '@components/PhIcon/PhIcon';
import {
  activeWindowEl,
  setActiveWindow,
  clearActiveWindow,
  getActiveWindowPosition,
  getBiggestZIndex,
  getMenuBarHeight,
  clampWindowToViewport,
  registerWindow,
  unregisterWindow,
  isInActiveGroup,
} from '../../services/window-manager';
import { saveWindowRect, loadWindowRect } from '../../services/window-storage';

interface AppWindowProps {
  children: JSX.Element;
  appId?: string;
  startPosition?: {
    x: number;
    y: number;
  };
  startSize?: {
    width?: string;
    height?: string;
    minWidth?: string;
    minHeight?: string;
  };
  title: string;
  close?: () => void;
  centered?: boolean;
  iconIndex?: IconSpriteIndex;
  phIcon?: { type: PhIconType; icon: string };
  onRectChange?: (x: number, y: number, width: number, height: number) => void;
  parentAppId?: string;
  closeWithParent?: boolean;
  resizable?: boolean;
}

const SPAWN_OFFSET = 40;

function getCurrentRect(el: HTMLDivElement) {
  return {
    x: el.offsetLeft,
    y: el.offsetTop,
    width: el.offsetWidth,
    height: el.offsetHeight,
  };
}

function clampToViewport(rect: { x: number; y: number; width: number; height: number }) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const minVisible = 100;

  return {
    x: Math.max(0, Math.min(rect.x, vw - minVisible)),
    y: Math.max(0, Math.min(rect.y, vh - minVisible)),
    width: Math.min(rect.width, vw),
    height: Math.min(rect.height, vh),
  };
}

function AppWindow(props: AppWindowProps) {
  let windowRef!: HTMLDivElement;
  let titleRef!: HTMLDivElement;
  let resizeTimer: ReturnType<typeof setTimeout> | undefined;
  let resizeObserver: ResizeObserver | undefined;
  let nextX = 0;
  let nextY = 0;
  // eslint-disable-next-line solid/reactivity
  let x = props.startPosition?.x || 100;
  // eslint-disable-next-line solid/reactivity
  let y = props.startPosition?.y || 100;

  const defaultWidth = () => props.startSize?.width || '320px';
  const defaultHeight = () => props.startSize?.height || '240px';

  const isActive = () => activeWindowEl() === windowRef;

  const moveWindowToFront = () => {
    if (windowRef) {
      setActiveWindow(windowRef);
    }
  };

  const saveRect = () => {
    if (windowRef) {
      const rect = getCurrentRect(windowRef);
      if (props.appId) {
        saveWindowRect(props.appId, rect);
      }
      props.onRectChange?.(rect.x, rect.y, rect.width, rect.height);
    }
  };

  const closeDragElement = () => {
    document.onmouseup = null;
    document.onmousemove = null;
    if (windowRef) {
      clampWindowToViewport(windowRef);
      saveRect();
    }
  };

  const elementDrag = (e: MouseEvent) => {
    e.preventDefault();
    nextX = x - e.clientX;
    nextY = y - e.clientY;
    x = e.clientX;
    y = e.clientY;
    if (windowRef) {
      const newTop = Math.max(getMenuBarHeight(), windowRef.offsetTop - nextY);
      windowRef.style.top = `${newTop}px`;
      windowRef.style.left = `${windowRef.offsetLeft - nextX}px`;
    }
  };

  const dragMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    moveWindowToFront();
    x = e.clientX;
    y = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  };

  const closeWindow = (e: MouseEvent) => {
    e.stopPropagation();
    clearActiveWindow(windowRef);
    if (props.close) {
      props.close();
    }
  };

  onCleanup(() => {
    if (resizeObserver) resizeObserver.disconnect();
    if (resizeTimer) clearTimeout(resizeTimer);
    if (windowRef) {
      unregisterWindow(windowRef);
      clearActiveWindow(windowRef);
      windowRef.removeEventListener('click', moveWindowToFront);
    }
  });

  createEffect(() => {
    if (!titleRef) return;
    if (isActive()) {
      titleRef.classList.add(styles.titleActive);
    } else {
      titleRef.classList.remove(styles.titleActive);
    }
  });

  return (
    <Portal
      mount={document.getElementById('windows')!}
      ref={(el) => {
        windowRef = el;
        el.classList.add(styles.window);
        if (props.resizable !== false) {
          el.classList.add(styles.resizeable);
        }

        const width = defaultWidth();
        const height = defaultHeight();

        // Register window metadata for menu bar integration
        registerWindow(
          el,
          props.appId ?? null,
          props.title,
          { width, height },
          props.close,
          moveWindowToFront,
          props.parentAppId,
          props.closeWithParent,
        );

        // Try to restore saved position/size
        const savedRect = props.appId ? loadWindowRect(props.appId) : null;

        if (props.centered) {
          el.style.top = '50%';
          el.style.left = '50%';
          el.style.transform = 'translate(-50%, -50%)';

          requestAnimationFrame(() => {
            const rect = el.getBoundingClientRect();
            el.style.top = `${rect.top}px`;
            el.style.left = `${rect.left}px`;
            el.style.transform = '';
            x = rect.left;
            y = rect.top;
            saveRect();
          });
        } else if (savedRect && !props.startPosition) {
          const clamped = clampToViewport(savedRect);
          el.style.top = `${clamped.y}px`;
          el.style.left = `${clamped.x}px`;
          el.style.width = `${clamped.width}px`;
          el.style.height = `${clamped.height}px`;
          x = clamped.x;
          y = clamped.y;
          saveRect();
        } else {
          if (!props.startPosition) {
            const activePos = untrack(() => getActiveWindowPosition());
            if (activePos) {
              x = activePos.x + SPAWN_OFFSET;
              y = activePos.y + SPAWN_OFFSET;
            }
          }
          el.style.top = `${y}px`;
          el.style.left = `${x}px`;
        }

        el.style.zIndex = `${getBiggestZIndex(el.parentNode!) + 1}`;

        // Only set default size if we didn't restore from saved rect
        if (!savedRect || props.startPosition || props.centered) {
          el.style.height = height;
          el.style.width = width;
        }

        el.style.minHeight = props.startSize?.minHeight ?? '100px';
        el.style.minWidth = props.startSize?.minWidth ?? '200px';

        // Save initial placement (centered saves after rAF above)
        if (!props.centered) {
          saveRect();
        }

        // ResizeObserver for persisting size changes
        if (props.appId) {
          resizeObserver = new ResizeObserver(() => {
            if (resizeTimer) clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => saveRect(), 300);
          });
          resizeObserver.observe(el);
        }

        queueMicrotask(() => setActiveWindow(el));
        windowRef.addEventListener('click', moveWindowToFront);
      }}
    >
      <div ref={(el) => (titleRef = el)} class={styles.title} onMouseDown={dragMouseDown}>
        {props.iconIndex && <AppIcon size={16} iconIndex={props.iconIndex} />}
        {props.phIcon && <PhIcon type={props.phIcon.type} icon={props.phIcon.icon} size={16} />}
        <p class={styles.titleText}>{props.title}</p>
        {!!props.close && (
          <button type="button" class={styles.close} onClick={closeWindow}>
            <span class={styles.xSign}>+</span>
          </button>
        )}
      </div>
      <div class={styles.content}>
        {props.children}
      </div>
      {!isInActiveGroup(windowRef) && (
        <div class={styles.clickGuard} onMouseDown={moveWindowToFront} />
      )}
    </Portal>
  );
}

export { AppWindow };
