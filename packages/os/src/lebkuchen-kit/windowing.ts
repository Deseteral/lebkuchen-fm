import { nanoid } from 'nanoid';
import clsx from 'clsx';
import h from 'hyperscript';
import { card } from './controls/LKCard';
import css from './css';

interface OpenWindowOptions {
  title: string,
  icon?: string,
  position?: [number, number],
  size?: [number, number],
}

interface WindowDescriptor {
  handle: string,
  contentRootElement: HTMLElement,
}

const styles = {
  windowContainer: clsx(card, css`
    position: absolute;
    z-index: 9;
  `),
  windowHeaderContainer: css`
    display: flex;
    flex-direction: row;
    align-items: center;
    border-bottom: 2px solid #28282e;
  `,
  windowChildrenContainer: css`
    padding-bottom: 8px;
    overflow: scroll;
  `,
};

function openWindow({ title, icon, position, size }: OpenWindowOptions): WindowDescriptor {
  const handle = nanoid();
  const windowContainer = document.querySelector('[data-os-window-container]') as HTMLElement;

  let [posX, posY] = (position || [100, 100]);
  const [width, height] = (size || [800, 600]);

  const header = h('div',
    h('div', (icon || ''), {
      className: css`
        padding-left: 8px;
        font-size: 12px;
      `,
    }),
    h('div', title, {
      className: css`
        flex: 1;
        padding: 8px;
      `,
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
    className: css`
      margin-right: 12px;
    `,
  });

  const windowTopBar = h('div', header, closeButton, { className: styles.windowHeaderContainer });
  const childrenContainer = h('div', h('div', '', { 'data-os-window-id': handle }), { className: styles.windowChildrenContainer, style: { width: `${width}px`, height: `${height}px` } });
  const container = h('div', windowTopBar, childrenContainer, { className: styles.windowContainer, style: { left: `${posX}px`, top: `${posY}px` } });

  // Events
  header.addEventListener('mousedown', () => {
    windowContainer.removeChild(container);
    windowContainer.append(container);
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

  windowContainer.appendChild(container);

  return {
    handle,
    contentRootElement: childrenContainer,
  };
}

export {
  openWindow,
};
