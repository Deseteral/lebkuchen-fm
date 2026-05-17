import { Player } from './Player/Player';
import { Soundboard } from './Soundboard/Soundboard';
import { Terminal } from './Terminal/Terminal';
import { SoundUpload } from './SoundUpload/SoundUpload';
import { Users } from './Users/Users';
import { AppLauncher } from './AppLauncher/AppLauncher';
import { ControlPanelApp } from './ControlPanel/ControlPanelApp';
import { SoundPanelApp } from './ControlPanel/SoundPanelApp';
import { IntegrationsPanelApp } from './ControlPanel/IntegrationsPanelApp';
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
      <SoundPanelApp />
      <IntegrationsPanelApp data={ApplicationServer.getInstance('integrations-panel')?.payload} />
    </>
  );
}

export { ApplicationHost };
