import { ApplicationWindow } from '@components/ApplicationWindow/ApplicationWindow';
import { createSignal } from 'solid-js';
import { ControlPanel } from './components/ControlPanel/ControlPanel';

function ControlPanelApp() {
  const [panelPosition, setPanelPosition] = createSignal<{ x: number; y: number } | null>(null);

  return (
    <ApplicationWindow
      id="control-panel"
      startSize={{ width: '400px', height: '280px' }}
      onRectChange={(x, y) => setPanelPosition({ x, y })}
    >
      <ControlPanel panelPosition={panelPosition() ?? undefined} />
    </ApplicationWindow>
  );
}

export { ControlPanelApp };
