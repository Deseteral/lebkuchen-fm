import { Terminal } from './Terminal';
import { DesktopApplication, SystemEnvironment } from '../desktop-application';
import { TERMINAL_ICON_INDEX } from '@components/AppIcon/IconSpritesheet';

export const TerminalApplication: DesktopApplication = {
  name: "Terminal",
  entryPoint: (environment: SystemEnvironment) => {
    environment.windowManager.createWindow(
      { title: 'Terminal', width: 624, height: 400 },
      () => <Terminal />,
    );
  },
  iconIndex: TERMINAL_ICON_INDEX,
}
