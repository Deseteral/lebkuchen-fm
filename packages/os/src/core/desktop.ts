import h from 'hyperscript';
import css from '../lebkuchen-kit/css';

export function createDesktop() {
  const desktop = h('div', '', {
    className: css`
      background-color: #fff7e4;
      width: 100vw;
      height: 100vh;
    `,
    'data-os-desktop': '',
  });
  document.body.appendChild(desktop);

  const windowContainer = h('div', '', { 'data-os-window-container': '' });
  document.body.appendChild(windowContainer);
}

export function changeDesktopColor(color: string) {
  const desktop = document.querySelector('[data-os-desktop]') as HTMLElement;
  desktop.style.backgroundColor = color;
}
