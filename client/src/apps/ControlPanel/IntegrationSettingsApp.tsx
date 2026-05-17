import { ApplicationWindow } from '@components/ApplicationWindow/ApplicationWindow';
import { Show } from 'solid-js';
import { IntegrationsSettings } from './components/IntegrationsSettings/IntegrationsSettings';
import { IntegrationsResponse } from '../../services/integrations-service';
import { ApplicationServer } from '../../services/application-server';

interface IntegrationSettingsAppProps {
  data?: IntegrationsResponse;
}

function IntegrationSettingsApp(props: IntegrationSettingsAppProps) {
  const close = () => ApplicationServer.close('integration-settings');

  return (
    <Show when={props.data}>
      {(data) => (
        <ApplicationWindow
          id="integration-settings"
          startSize={{ width: '520px', height: '380px', minWidth: '400px', minHeight: '300px' }}
        >
          <IntegrationsSettings data={data()} close={close} />
        </ApplicationWindow>
      )}
    </Show>
  );
}

export { IntegrationSettingsApp };
