import clsx from 'clsx';
import css from './css';
import { card } from './controls/LKCard';
import { MenuBarClock } from './menu-bar-clock';
import { createDesktop } from './desktop';
import { addMenuBarItem, createMenuBar } from './menu-bar';
import { menuBarItem } from './controls/LKMenuBarItem';
import App from './app';
import LebkuchenSprache from '../apps/lebkuchen-sprache/main';
import LogConsole from '../apps/log-console/main';

function createAppListMenuBarItem(appRegistry: App[]) {
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

  appRegistry.forEach((appDefinition) => {
    const c = document.createElement('div');
    c.innerText = `${appDefinition.icon} ${appDefinition.name}`;
    c.className = menuBarItem;
    c.addEventListener('click', () => appDefinition.main(appDefinition));
    appList.appendChild(c);
  });

  addMenuBarItem(appsMenuBarItem, { position: 'leading' });
}

function boot() {
  createDesktop();
  createMenuBar();

  const appRegistry = [
    LebkuchenSprache,
    LogConsole,
  ];

  createAppListMenuBarItem(appRegistry);

  addMenuBarItem(MenuBarClock(), { position: 'trailing' });
}

export default boot;
