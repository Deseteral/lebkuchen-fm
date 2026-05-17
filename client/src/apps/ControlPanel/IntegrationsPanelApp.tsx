import { ApplicationWindow } from '@components/ApplicationWindow/ApplicationWindow';
import { CONTROL_PANEL_ICON_INDEX } from '@components/AppIcon/IconSpritesheet';
import { IntegrationsSettings } from './components/IntegrationsSettings/IntegrationsSettings';
import { IntegrationsResponse } from '../../services/integrations-service';

interface IntegrationsPanelAppProps {
  data: IntegrationsResponse;
  startPosition?: { x: number; y: number };
  onRectChange?: (x: number, y: number, width: number, height: number) => void;
  onClose?: () => void;
}

function IntegrationsPanelApp(props: IntegrationsPanelAppProps) {
  return (
    <ApplicationWindow
      id="integrations-panel"
      title="Integrations"
      iconIndex={CONTROL_PANEL_ICON_INDEX}
      startSize={{ width: '520px', height: '380px', minWidth: '400px', minHeight: '300px' }}
      startPosition={props.startPosition}
      onRectChange={props.onRectChange}
      onClose={props.onClose}
      showIcon={false}
      autoOpen
      persistWindowRect={false}
    >
      <IntegrationsSettings
        data={props.data}
        close={props.onClose ?? (() => undefined)}
      />
    </ApplicationWindow>
  );
}

export { IntegrationsPanelApp };
