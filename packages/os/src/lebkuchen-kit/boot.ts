import clsx from 'clsx';
import css from './css';
import { card } from './controls/LKCard';
import { MenuBarClock } from './menu-bar-clock';
import { createDesktop } from './desktop';
import { addMenuBarItem, createMenuBar } from './menu-bar';
import { menuBarItem } from './controls/LKMenuBarItem';

function boot() {
  createDesktop();
  createMenuBar();

  const appsMenuBarItem = document.createElement('div');
  appsMenuBarItem.innerText = 'Apps';

  const appList = document.createElement('div');
  appList.className = clsx(card, 'hidden', css`
    position: absolute;
    width: 200px;
    padding: 8px;
  `);
  appsMenuBarItem.addEventListener('click', () => appList.classList.toggle('hidden'));
  appsMenuBarItem.appendChild(appList);

  for (let i = 0; i < 10; i += 1) {
    const c = document.createElement('div');
    c.innerText = `${i}`;
    c.className = menuBarItem;
    appList.appendChild(c);
  }

  addMenuBarItem(appsMenuBarItem, { position: 'leading' });
  addMenuBarItem(MenuBarClock(), { position: 'trailing' });
}

export default boot;
