import {
  CONTROL_PANEL_ICON_INDEX,
  HISTORY_ICON_INDEX,
  PLAYER_ICON_INDEX,
  SOUNDBOARD_ICON_INDEX,
  SOUND_MANAGER_ICON_INDEX,
  TERMINAL_ICON_INDEX,
  USER_MANAGER_ICON_INDEX,
} from '@components/AppIcon/IconSpritesheet';
import { IconSpriteIndex } from '@components/AppIcon/IconSpritesheet';

const APPLICATION_IDS = [
  'player',
  'soundboard',
  'terminal',
  'sound-upload',
  'users',
  'app-launcher',
  'control-panel',
  'sound-panel',
  'integrations-panel',
] as const;

type ApplicationId = (typeof APPLICATION_IDS)[number];

interface ApplicationDefinition {
  id: ApplicationId;
  title: string;
  iconIndex: IconSpriteIndex;
  persistWindowRect: boolean;
}

const APPLICATION_DEFINITIONS: ApplicationDefinition[] = [
  {
    id: 'player',
    title: 'Player',
    iconIndex: PLAYER_ICON_INDEX,
    persistWindowRect: true,
  },
  {
    id: 'soundboard',
    title: 'Soundboard',
    iconIndex: SOUNDBOARD_ICON_INDEX,
    persistWindowRect: true,
  },
  {
    id: 'terminal',
    title: 'Terminal',
    iconIndex: TERMINAL_ICON_INDEX,
    persistWindowRect: true,
  },
  {
    id: 'sound-upload',
    title: 'Sound Manager',
    iconIndex: SOUND_MANAGER_ICON_INDEX,
    persistWindowRect: true,
  },
  {
    id: 'users',
    title: 'Users',
    iconIndex: USER_MANAGER_ICON_INDEX,
    persistWindowRect: true,
  },
  {
    id: 'app-launcher',
    title: 'Applications',
    iconIndex: HISTORY_ICON_INDEX,
    persistWindowRect: true,
  },
  {
    id: 'control-panel',
    title: 'Control Panel',
    iconIndex: CONTROL_PANEL_ICON_INDEX,
    persistWindowRect: true,
  },
  {
    id: 'sound-panel',
    title: 'Sound',
    iconIndex: SOUND_MANAGER_ICON_INDEX,
    persistWindowRect: false,
  },
  {
    id: 'integrations-panel',
    title: 'Integrations',
    iconIndex: CONTROL_PANEL_ICON_INDEX,
    persistWindowRect: false,
  },
];

function getApplicationDefinition(appId: string): ApplicationDefinition | undefined {
  return APPLICATION_DEFINITIONS.find((app) => app.id === appId);
}

export { APPLICATION_DEFINITIONS, APPLICATION_IDS, getApplicationDefinition };
export type { ApplicationDefinition, ApplicationId };
