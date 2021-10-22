import css from './css';

export function createMenuBar() {
  const menuBar = document.createElement('div');
  menuBar.className = css`
    display: flex;
    flex-direction: row;
    background-color: white;
    color: #28282e;
    height: 24px;
    width: 100vw;
    position: fixed;
    top: 0;
    left: 0;
    border-bottom: 2px solid #28282e;
    align-items: center;
    padding: 0 8px;
    z-index: 99999;
  `;

  const leadingItems = document.createElement('div');
  leadingItems.className = css`
    flex: 1;
  `;
  leadingItems.setAttribute('data-os-menu-bar-leading', '');
  menuBar.appendChild(leadingItems);

  const trailingItems = document.createElement('div');
  trailingItems.setAttribute('data-os-menu-bar-trailing', '');
  menuBar.appendChild(trailingItems);

  document.body.appendChild(menuBar);
}

interface AddMenuBarItemOptions {
  position: ('leading' | 'trailing')
}

export function addMenuBarItem(item: HTMLElement, options: AddMenuBarItemOptions) {
  const container = document.querySelector(`[data-os-menu-bar-${options.position}]`) as HTMLElement;
  container.appendChild(item);
}
