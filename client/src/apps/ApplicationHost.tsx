import { Player } from './Player/Player';
import { Soundboard } from './Soundboard/Soundboard';
import { Terminal } from './Terminal/Terminal';
import { SoundUpload } from './SoundUpload/SoundUpload';
import { Users } from './Users/Users';
import { AppLauncher } from './AppLauncher/AppLauncher';
import { ControlPanelApp } from './ControlPanel/ControlPanelApp';
import { SoundSettingsApp } from './ControlPanel/SoundSettingsApp';
import { IntegrationSettingsApp } from './ControlPanel/IntegrationSettingsApp';
import { ApplicationServer } from '../services/application-server';

function ApplicationHost() {
  return (
    <>
      <Player />
      <Soundboard />
      <Terminal />
      <SoundUpload />
      <Users />
      <AppLauncher />
      <ControlPanelApp />
      <SoundSettingsApp />
      <IntegrationSettingsApp
        data={ApplicationServer.getInstance('integration-settings')?.payload}
      />
    </>
  );
}

export { ApplicationHost };
