import { Portal } from 'solid-js/web';
import { JSX, createEffect } from 'solid-js';
import styles from './AppWindow.module.css';
import {AppIcon} from "@components/AppIcon/AppIcon";

interface AppWindowProps {
  children: JSX.Element;
  startPosition?: {
    x: number;
    y: number;
  };
  startSize?: {
    width?: string;
    height?: string;
  };
  title: string;
  close?: () => void;
  centered?: boolean;
  iconIndex: [number, number];
}

function AppWindow(props: AppWindowProps) {
  let windowRef!: HTMLDivElement;
  let nextX = 0;
  let nextY = 0;
  let x = 100;
  let y = 100;

  createEffect(() => {
    x = props.startPosition?.x || x;
    y = props.startPosition?.y || y;
  });

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
    }
  };

  const closeDragElement = () => {
    document.onmouseup = null;
    document.onmousemove = null;
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
    if (props.close) {
      props.close();
    }
  };

  return (
    <Portal
      mount={document.getElementById('windows')!}
      ref={(el) => {
        windowRef = el;
        if (props.centered) {
          el.classList.add(styles.window);
          el.style.top = '50%';
          el.style.left = '50%';
          el.style.transform = 'translate(-50%, -50%)';
        } else {
          el.classList.add(styles.window, styles.resizeable);
          el.style.top = `${y}px`;
          el.style.left = `${x}px`;
        }
        el.style.zIndex = `${getBiggestZIndex() + 1}`;
        if (props.startSize?.height) {
          el.style.height = props.startSize.height;
        }
        if (props.startSize?.width) {
          el.style.width = props.startSize.width;
        }
        windowRef.addEventListener('click', moveWindowToFront);
      }}
    >
      <div class={styles.title} onMouseDown={dragMouseDown}>
        <AppIcon size={16} iconIndex={props.iconIndex} />
        <p>{props.title}</p>
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
