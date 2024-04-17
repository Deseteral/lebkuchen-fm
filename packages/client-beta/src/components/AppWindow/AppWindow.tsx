import { Portal } from 'solid-js/web';
import { JSX, createEffect } from 'solid-js';
import styles from './AppWindow.module.css';

interface AppWindowProps {
  children: JSX.Element;
  startPosition?: {
    x: number;
    y: number;
  };
  title: string;
  close: () => void;
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
  })

  const moveWindowToFront = () => {
    if (windowRef) {
      const parent = windowRef.parentNode;
      const allWindows = parent?.childNodes! as NodeListOf<HTMLElement>;
      let biggestZIndex = 0;
      Array.from(allWindows).forEach(window => {
        if(+window.style.zIndex > biggestZIndex) {
          biggestZIndex = +window.style.zIndex
        }
      })
      windowRef.style.zIndex = `${biggestZIndex + 1}`;
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
    props.close();
  };

  return (
    <Portal
      mount={document.getElementById('windows')!}
      ref={(el) => {
        windowRef = el;
        el.className = styles.window;
        el.style.top = `${y}px`;
        el.style.left = `${x}px`;
      }}
    >
      <div class={styles.title} onMouseDown={dragMouseDown}>
        <p>{props.title}</p>
        <button type="button" class={styles.close} onClick={closeWindow}>x</button>
      </div>
      <div class={styles.content}>{props.children}</div>
    </Portal>
  );
}

export { AppWindow };
