import { MenuBarAppList } from './menu-bar/menu-bar-app-list';
import { MenuBarClock } from './menu-bar/menu-bar-clock';
import { createDesktop } from './desktop';
import { addMenuBarItem, createMenuBar } from './menu-bar/menu-bar';
import LebkuchenSprache from '../apps/lebkuchen-sprache/main';
import LogConsole from '../apps/log-console/main';

function boot() {
  createDesktop();
  createMenuBar();

  // TODO: Add automatic discovery of apps
  const appRegistry = [
    LebkuchenSprache,
    LogConsole,
  ];

  addMenuBarItem(MenuBarAppList(appRegistry), { position: 'leading' });
  addMenuBarItem(MenuBarClock(), { position: 'trailing' });
}

export default boot;
