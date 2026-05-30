import { WindowManager } from '@deseteral/biurko';
import { JSX } from 'solid-js';
import { IconSpriteIndex } from '@components/AppIcon/IconSpritesheet';
import { TerminalApplication } from './Terminal/terminal-application';

type EntryPoint =
  | ((windowManager: WindowManager<() => JSX.Element>) => void)
  | ((windowManager: WindowManager<() => JSX.Element>) => Promise<void>);

export interface DesktopApplication {
  name: string,
  entryPoint: EntryPoint,
  iconIndex: IconSpriteIndex,
}

export const ApplicationRegistry: DesktopApplication[] = [
  TerminalApplication,
];
