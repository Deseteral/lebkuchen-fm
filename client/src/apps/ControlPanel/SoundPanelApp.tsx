import { ApplicationWindow } from '@components/ApplicationWindow/ApplicationWindow';
import { SOUND_MANAGER_ICON_INDEX } from '@components/AppIcon/IconSpritesheet';
import { SoundSettings } from './components/SoundSettings/SoundSettings';

interface SoundPanelAppProps {
  startPosition?: { x: number; y: number };
  onRectChange?: (x: number, y: number, width: number, height: number) => void;
  onClose?: () => void;
}

function SoundPanelApp(props: SoundPanelAppProps) {
  return (
    <ApplicationWindow
      id="sound-panel"
      title="Sound"
      iconIndex={SOUND_MANAGER_ICON_INDEX}
      startSize={{ width: '400px', height: '240px' }}
      startPosition={props.startPosition}
      onRectChange={props.onRectChange}
      onClose={props.onClose}
      showIcon={false}
      autoOpen
      persistWindowRect={false}
    >
      <SoundSettings />
    </ApplicationWindow>
  );
}

export { SoundPanelApp };
