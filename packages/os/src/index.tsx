import { nanoid } from 'nanoid';
import React from 'react';
import ReactDOM from 'react-dom';
import LebkuchenSprache from './apps/test-app/LebkuchenSprache';

interface OpenWindowOptions {
  title: string,
  position?: [number, number],
}

interface WindowDescriptor {
  handle: string,
}

function openWindow({ title, position }: OpenWindowOptions): WindowDescriptor {
  const handle = nanoid();

  let posX = position ? position[0] : 100;
  let posY = position ? position[1] : 100;

  const container = document.createElement('div');
  container.className = 'window-container';

  const headerContainer = document.createElement('div');
  container.appendChild(headerContainer);
  headerContainer.className = 'window-header-container';

  const header = document.createElement('div');
  headerContainer.appendChild(header);
  header.className = 'window-header';
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
  childrenContainer.className = 'window-children-container';
  childrenContainer.innerHTML = `<div data-os-window-id="${handle}"}></div>`;

  document.body.appendChild(container);

  return {
    handle,
  };
}

const descriptor = openWindow({ title: 'test window' });

ReactDOM.render(
  <LebkuchenSprache />,
  document.querySelector(`[data-os-window-id="${descriptor.handle}"]`),
);
