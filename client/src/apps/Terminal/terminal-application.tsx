import { Buffer } from './Buffer';
import { DesktopApplication } from '../desktop-application';
import { WindowManager } from '@deseteral/biurko';
import { JSX } from 'solid-js';
import { TERMINAL_ICON_INDEX } from '@components/AppIcon/IconSpritesheet';

export const TerminalApplication: DesktopApplication = {
  name: "Terminal",
  entryPoint: (windowManager: WindowManager<() => JSX.Element>) => {
    windowManager.createWindow(
      { title: 'Terminal', width: 624, height: 400 },
      () => <Buffer />,
    );
  },
  iconIndex: TERMINAL_ICON_INDEX,
}
