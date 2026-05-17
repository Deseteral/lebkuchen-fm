import { ApplicationWindow } from '@components/ApplicationWindow/ApplicationWindow';
import { SoundSettings } from './components/SoundSettings/SoundSettings';

function SoundSettingsApp() {
  return (
    <ApplicationWindow id="sound-settings" startSize={{ width: '400px', height: '240px' }}>
      <SoundSettings />
    </ApplicationWindow>
  );
}

export { SoundSettingsApp };
