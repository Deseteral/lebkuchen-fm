import { ApplicationWindow } from '@components/ApplicationWindow/ApplicationWindow';
import { Show } from 'solid-js';
import { IntegrationsSettings } from './components/IntegrationsSettings/IntegrationsSettings';
import { IntegrationsResponse } from '../../services/integrations-service';
import { ApplicationServer } from '../../services/application-server';

interface IntegrationsPanelAppProps {
  data?: IntegrationsResponse;
}

function IntegrationsPanelApp(props: IntegrationsPanelAppProps) {
  const close = () => ApplicationServer.close('integrations-panel');

  return (
    <Show when={props.data}>
      {(data) => (
        <ApplicationWindow
          id="integrations-panel"
          startSize={{ width: '520px', height: '380px', minWidth: '400px', minHeight: '300px' }}
        >
          <IntegrationsSettings data={data()} close={close} />
        </ApplicationWindow>
      )}
    </Show>
  );
}

export { IntegrationsPanelApp };
