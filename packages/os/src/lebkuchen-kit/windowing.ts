import { nanoid } from 'nanoid';
import clsx from 'clsx';
import { card } from './controls/LKCard';
import css from './css';

interface OpenWindowOptions {
  title: string,
  position?: [number, number],
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
  windowHeader: css`
    cursor: move;
    flex: 1;
    padding: 8px;
  `,
  windowChildrenContainer: css`
    padding-bottom: 8px;
  `,
};

function openWindow({ title, position }: OpenWindowOptions): WindowDescriptor {
  const handle = nanoid();

  let posX = position ? position[0] : 100;
  let posY = position ? position[1] : 100;

  const container = document.createElement('div');
  container.className = styles.windowContainer;

  const headerContainer = document.createElement('div');
  container.appendChild(headerContainer);
  headerContainer.className = styles.windowHeaderContainer;

  const header = document.createElement('div');
  headerContainer.appendChild(header);
  header.className = styles.windowHeader;
  header.innerText = title;
  header.addEventListener('mousedown', (e: MouseEvent) => {
    e.preventDefault();
    let startX = e.clientX;
    let startY = e.clientY;

    // TODO: Prevent moving outside viewport bounds
    const onMouseMove = (ev: MouseEvent): void => {
      posX -= (startX - ev.clientX);
      posY -= (startY - ev.clientY);

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

  container.style.left = `${posX}px`;
  container.style.top = `${posY}px`;

  const childrenContainer = document.createElement('div');
  container.appendChild(childrenContainer);
  childrenContainer.className = styles.windowChildrenContainer;
  childrenContainer.innerHTML = `<div data-os-window-id="${handle}"}></div>`;

  document.body.appendChild(container);

  return {
    handle,
    contentRootElement: childrenContainer,
  };
}

export {
  openWindow,
};
