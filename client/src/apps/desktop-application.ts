import { WindowManager } from '@deseteral/biurko';
import { JSX } from 'solid-js';
import { IconSpriteIndex } from '@components/AppIcon/IconSpritesheet';
import { TerminalApplication } from './Terminal/terminal-application';

export type SystemEnvironment = {
  windowManager: WindowManager<() => JSX.Element>,
}

type EntryPoint =
  | ((environment: SystemEnvironment) => void)
  | ((environment: SystemEnvironment) => Promise<void>);

export interface DesktopApplication {
  name: string,
  entryPoint: EntryPoint,
  iconIndex: IconSpriteIndex,
}

export const ApplicationRegistry: DesktopApplication[] = [
  TerminalApplication,
];
