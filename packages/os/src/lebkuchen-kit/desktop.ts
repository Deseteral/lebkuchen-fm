import css from './css';

export function createDesktop() {
  const desktop = document.createElement('div');
  desktop.className = css`
    background-color: #fff7e4;
    width: 100vw;
    height: 100vh;
  `;
  desktop.setAttribute('data-os-desktop', '');

  const windowContainer = document.createElement('div');
  windowContainer.setAttribute('data-os-window-container', '');

  document.body.appendChild(desktop);
  document.body.appendChild(windowContainer);
}

export function changeDesktopColor(color: string) {
  const desktop = document.querySelector('[data-os-desktop]') as HTMLElement;
  desktop.style.backgroundColor = color;
}
