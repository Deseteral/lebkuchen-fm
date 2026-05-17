import { For } from 'solid-js';
import { ApplicationWindow } from '@components/ApplicationWindow/ApplicationWindow';
import { APPLICATION_DEFINITIONS } from '../application-definitions';
import { AppIcon } from '@components/AppIcon/AppIcon';
import { ApplicationServer } from '../../services/application-server';
import { DesktopDragService } from '../../services/desktop-drag-service';
import type { ApplicationId } from '../application-definitions';
import styles from './AppLauncher.module.css';

function AppLauncher() {
  const onAppDragStart = (appId: ApplicationId, e: DragEvent) => {
    DesktopDragService.writeDataTransfer(
      e.dataTransfer,
      { appId, source: 'app-launcher' },
      'copy',
      e.currentTarget as HTMLElement,
    );
    DesktopDragService.startDrag({ appId, source: 'app-launcher' });
  };

  return (
      <ApplicationWindow
        id="app-launcher"
        startSize={{ width: '360px', height: '420px', minWidth: '280px', minHeight: '240px' }}
      >
      <div class={styles.container}>
        <For each={APPLICATION_DEFINITIONS}>
          {(app) => (
            <button
              type="button"
              class={styles.appRow}
              draggable={true}
              onDragStart={(e) => onAppDragStart(app.id, e)}
              onDragEnd={() => setTimeout(() => DesktopDragService.endDrag(), 0)}
              onDblClick={() => ApplicationServer.open(app.id)}
            >
              <AppIcon size={24} iconIndex={app.iconIndex} />
              <span>{app.title}</span>
            </button>
          )}
        </For>
      </div>
    </ApplicationWindow>
  );
}

export { AppLauncher };
