import { MenuBarClock } from './menu-bar-clock';
import { createDesktop } from './desktop';
import { addMenuBarItem, createMenuBar } from './menu-bar';

function boot() {
  createDesktop();
  createMenuBar();

  const appsMenuBarItem = document.createElement('div');
  appsMenuBarItem.innerText = 'Apps';
  addMenuBarItem(appsMenuBarItem, { position: 'leading' });

  addMenuBarItem(MenuBarClock(), { position: 'trailing' });
}

export default boot;
