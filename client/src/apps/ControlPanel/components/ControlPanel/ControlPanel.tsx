import { createSignal } from 'solid-js';
import { PhIcon, PhIconType } from '@components/PhIcon/PhIcon';
import { Dialog } from '@components/Dialog/Dialog';
import { getIntegrations } from '../../../../services/integrations-service';
import { ApplicationServer } from '../../../../services/application-server';
import styles from './ControlPanel.module.css';

interface ControlPanelProps {
  panelPosition?: { x: number; y: number };
}

function ControlPanel(props: ControlPanelProps) {
  const [errorMessage, setErrorMessage] = createSignal<string | null>(null);

  const openIntegrations = async () => {
    if (ApplicationServer.isOpen('integration-settings')) {
      ApplicationServer.openOrFocus('integration-settings');
      return;
    }

    try {
      const data = await getIntegrations();
      ApplicationServer.openOrFocus('integration-settings', {
        startPosition: spawnOffsetPosition(),
        payload: data,
      });
    } catch (error) {
      if (error instanceof Response && error.status === 403) {
        setErrorMessage("You don't have permission to access Integrations");
      } else {
        setErrorMessage('Failed to load integrations configuration');
      }
    }
  };

  const openSound = () => {
    ApplicationServer.openOrFocus('sound-settings', { startPosition: spawnOffsetPosition() });
  };

  const openIntegrationsPanel = async () => {
    await openIntegrations();
  };

  const spawnOffsetPosition = () => {
    if (!props.panelPosition) return undefined;
    return { x: props.panelPosition.x + 40, y: props.panelPosition.y + 40 };
  };

  return (
    <>
      <div class={styles.grid}>
        <button
          class={styles.item}
          onDblClick={openSound}
          onKeyDown={(e) => e.key === 'Enter' && openSound()}
        >
          <PhIcon type={PhIconType.Bold} icon="faders" size={48} />
          <span>Sound Settings</span>
        </button>
        <button
          class={styles.item}
          onDblClick={() => void openIntegrationsPanel()}
          onKeyDown={(e) => e.key === 'Enter' && void openIntegrationsPanel()}
        >
          <PhIcon type={PhIconType.Bold} icon="plug" size={48} />
          <span>Integration Settings</span>
        </button>
      </div>

      {errorMessage() && (
        <Dialog variant="error" message={errorMessage()!} close={() => setErrorMessage(null)} />
      )}
    </>
  );
}

export { ControlPanel };
