import { ApplicationWindow } from '@components/ApplicationWindow/ApplicationWindow';
import { SoundSettings } from './components/SoundSettings/SoundSettings';

function SoundPanelApp() {
  return (
    <ApplicationWindow id="sound-panel" startSize={{ width: '400px', height: '240px' }}>
      <SoundSettings />
    </ApplicationWindow>
  );
}

export { SoundPanelApp };
