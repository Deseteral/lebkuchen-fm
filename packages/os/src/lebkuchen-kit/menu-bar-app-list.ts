import clsx from 'clsx';
import h from 'hyperscript';
import { menuBarItem } from './controls/LKMenuBarItem';
import { card } from './controls/LKCard';
import css from './css';
import App from './app';

export function MenuBarAppList(appRegistry: App[]) {
  const appList = h('div',
    appRegistry.map((appDefinition) => (
      h('div', `${appDefinition.icon} ${appDefinition.name}`, {
        className: menuBarItem,
        onclick: () => appDefinition.main(appDefinition),
      })),
    ),
    {
      className: clsx(card, 'hidden', css`
        position: absolute;
        width: 200px;
        padding: 8px;
      `),
    });

  const appsMenuBarItem = h('div', 'Apps', appList, {
    onclick: () => appList.classList.toggle('hidden'),
  });

  return appsMenuBarItem;
}
