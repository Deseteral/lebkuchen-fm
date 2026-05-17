import { Show } from 'solid-js';
import { Player } from './Player/Player';
import { Soundboard } from './Soundboard/Soundboard';
import { Terminal } from './Terminal/Terminal';
import { SoundUpload } from './SoundUpload/SoundUpload';
import { Users } from './Users/Users';
import { ControlPanelApp } from './ControlPanel/ControlPanelApp';
import { SoundPanelApp } from './ControlPanel/SoundPanelApp';
import { IntegrationsPanelApp } from './ControlPanel/IntegrationsPanelApp';
import { ApplicationServer } from '../services/application-server';
import { IntegrationsResponse } from '../services/integrations-service';

function ApplicationHost() {
  return (
    <>
      <Player />
      <Soundboard />
      <Terminal />
      <SoundUpload />
      <Users />
      <ControlPanelApp />
      <Show when={ApplicationServer.isOpen('sound-panel')}>
        <SoundPanelApp
          startPosition={ApplicationServer.getInstance('sound-panel')?.startPosition}
          onClose={() => ApplicationServer.close('sound-panel')}
        />
      </Show>
      <Show when={ApplicationServer.isOpen('integrations-panel')}>
        <IntegrationsPanelApp
          data={ApplicationServer.getInstance('integrations-panel')?.payload as IntegrationsResponse}
          startPosition={ApplicationServer.getInstance('integrations-panel')?.startPosition}
          onClose={() => ApplicationServer.close('integrations-panel')}
        />
      </Show>
    </>
  );
}

export { ApplicationHost };
