import { ApplicationWindow } from '@components/ApplicationWindow/ApplicationWindow';
import { createSignal } from 'solid-js';
import { CONTROL_PANEL_ICON_INDEX } from '@components/AppIcon/IconSpritesheet';
import { ControlPanel } from './components/ControlPanel/ControlPanel';

function ControlPanelApp() {
  const [panelPosition, setPanelPosition] = createSignal<{ x: number; y: number } | null>(null);

  return (
    <ApplicationWindow
      id="control-panel"
      title="Control Panel"
      iconIndex={CONTROL_PANEL_ICON_INDEX}
      startSize={{ width: '400px', height: '280px' }}
      onRectChange={(x, y) => setPanelPosition({ x, y })}
    >
      <ControlPanel panelPosition={panelPosition() ?? undefined} />
    </ApplicationWindow>
  );
}

export { ControlPanelApp };
