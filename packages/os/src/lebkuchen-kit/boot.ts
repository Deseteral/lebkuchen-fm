import { MenuBarAppList } from './menu-bar-app-list';
import { MenuBarClock } from './menu-bar-clock';
import { createDesktop } from './desktop';
import { addMenuBarItem, createMenuBar } from './menu-bar';
import LebkuchenSprache from '../apps/lebkuchen-sprache/main';
import LogConsole from '../apps/log-console/main';

function boot() {
  createDesktop();
  createMenuBar();

  const appRegistry = [
    LebkuchenSprache,
    LogConsole,
  ];

  addMenuBarItem(MenuBarAppList(appRegistry), { position: 'leading' });
  addMenuBarItem(MenuBarClock(), { position: 'trailing' });
}

export default boot;
