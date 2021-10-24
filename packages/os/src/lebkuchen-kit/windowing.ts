import { nanoid } from 'nanoid';
import clsx from 'clsx';
import h from 'hyperscript';
import { card } from './controls/LKCard';
import css from './css';

export type WindowHandle = string;

export interface OpenWindowOptions {
  title: string,
  icon?: string,
  position?: [number, number],
  size?: [number, number],
}

export interface WindowDescriptor {
  handle: WindowHandle,
  contentRootElement: HTMLElement,
}

const openWindows: WindowHandle[] = [];

function reorderWindows() {
  openWindows
    .map((handle) => (document.querySelector(`[data-os-window-id="${handle}"]`) as HTMLElement))
    .forEach((windowElement, idx) => {
      const windowZIndex = (5000 + idx).toString();
      windowElement.style.zIndex = windowZIndex; // eslint-disable-line no-param-reassign
    });
}

function openWindow({ title, icon, position, size }: OpenWindowOptions): WindowDescriptor {
  const handle = nanoid();
  const windowContainer = document.querySelector('[data-os-window-container]') as HTMLElement;

  let [posX, posY] = (position || [100, 100]);
  const [width, height] = (size || [800, 600]);

  const header = h('div',
    h('div', (icon || ''), {
      className: css` padding-left: 8px; font-size: 12px; `,
    }),
    h('div', title, {
      className: css` flex: 1; padding: 8px; `,
    }),
    {
      className: css`
        display: flex;
        flex-direction: row;
        align-items: center;
        flex: 1;
        cursor: move;
      `,
    });

  const closeButton = h('div', '✕', {
    className: css` margin-right: 12px; `,
  });

  const windowTopBar = h('div',
    header,
    closeButton,
    {
      className: css`
        display: flex;
        flex-direction: row;
        align-items: center;
        border-bottom: 2px solid #28282e;
      `,
    });

  const childrenContainer = h('div',
    h('div', '', { 'data-os-window-content-id': handle }),
    {
      className: css` padding-bottom: 8px; overflow: scroll; `,
      style: { width: `${width}px`, height: `${height}px` },
    });

  const container = h('div',
    windowTopBar,
    childrenContainer,
    {
      className: clsx(card, css` position: absolute; z-index: 9; `),
      style: { left: `${posX}px`, top: `${posY}px` },
      'data-os-window-id': handle,
    });

  // Events
  container.addEventListener('mousedown', () => {
    const idx = openWindows.indexOf(handle);
    openWindows.splice(idx, 1);
    openWindows.push(handle);
    reorderWindows();
  });

  header.addEventListener('mousedown', (e: MouseEvent) => {
    e.preventDefault();
    let startX = e.clientX;
    let startY = e.clientY;

    const onMouseMove = (ev: MouseEvent): void => {
      if (ev.clientX >= 0 && ev.clientX <= window.innerWidth) {
        posX -= (startX - ev.clientX);
      }

      if (ev.clientY >= 0 && ev.clientY <= window.innerHeight) {
        posY -= (startY - ev.clientY);
      }

      startX = ev.clientX;
      startY = ev.clientY;

      container.style.left = `${posX}px`;
      container.style.top = `${posY}px`;
    };

    const onMouseUp = (): void => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  closeButton.addEventListener('click', () => windowContainer.removeChild(container));

  // Render window
  windowContainer.appendChild(container);
  openWindows.push(handle);
  reorderWindows();

  return {
    handle,
    contentRootElement: childrenContainer,
  };
}

export {
  openWindow,
};
