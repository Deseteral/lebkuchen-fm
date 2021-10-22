import css from './css';

export function createDesktop() {
  const desktop = document.createElement('div');
  desktop.className = css`
    background-color: #fff7e4;
    width: 100vw;
    height: 100vh;
  `;
  desktop.setAttribute('data-os-desktop', '');
  document.body.appendChild(desktop);
}

export function changeDesktopColor(color: string) {
  const desktop = document.querySelector('[data-os-desktop]') as HTMLElement;
  desktop.style.backgroundColor = color;
}
