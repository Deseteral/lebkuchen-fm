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
  registerWindow,
  unregisterWindow,
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
  onPositionChange?: (x: number, y: number) => void;
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

  const getBiggestZIndex = () => {
    let biggestZIndex = 0;
    if (windowRef) {
      const parent = windowRef.parentNode;
      const allWindows = parent?.childNodes as NodeListOf<HTMLElement>;
      Array.from(allWindows).forEach((window) => {
        if (+window.style.zIndex > biggestZIndex) {
          biggestZIndex = +window.style.zIndex;
        }
      });
    }

    return biggestZIndex;
  };
  const moveWindowToFront = () => {
    if (windowRef) {
      const currentZIndex = windowRef.style.zIndex;
      const biggestZIndex = getBiggestZIndex();
      if (biggestZIndex > +currentZIndex) {
        windowRef.style.zIndex = `${getBiggestZIndex() + 1}`;
      }
      setActiveWindow(windowRef);
    }
  };

  const saveRect = () => {
    if (props.appId && windowRef) {
      saveWindowRect(props.appId, getCurrentRect(windowRef));
    }
  };

  const closeDragElement = () => {
    document.onmouseup = null;
    document.onmousemove = null;
    if (windowRef) {
      props.onPositionChange?.(windowRef.offsetLeft, windowRef.offsetTop);
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
      windowRef.style.top = `${windowRef.offsetTop - nextY}px`;
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
    if (activeWindowEl() === windowRef) {
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
        el.classList.add(styles.window, styles.resizeable);

        const width = defaultWidth();
        const height = defaultHeight();

        // Register window metadata for menu bar integration
        registerWindow(el, props.appId ?? null, props.title, { width, height }, props.close);

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
            props.onPositionChange?.(x, y);
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
          props.onPositionChange?.(x, y);
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
          props.onPositionChange?.(x, y);
        }

        el.style.zIndex = `${getBiggestZIndex() + 1}`;

        // Only set default size if we didn't restore from saved rect
        if (!savedRect || props.startPosition || props.centered) {
          el.style.height = height;
          el.style.width = width;
        }

        if (props.startSize?.minHeight) {
          el.style.minHeight = props.startSize.minHeight;
        }
        if (props.startSize?.minWidth) {
          el.style.minWidth = props.startSize.minWidth;
        }

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
      <div class={styles.content}>{props.children}</div>
    </Portal>
  );
}

export { AppWindow };
