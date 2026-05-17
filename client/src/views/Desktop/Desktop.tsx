import { For, onCleanup, onMount } from 'solid-js';
import styles from './Desktop.module.css';
import { UserAccountService } from '../../services/user-account-service';
import { MenuBar } from '@components/MenuBar/MenuBar';
import { SocketConnectionClient } from '../../services/socket-connection-client';
import { PlayXSoundEventHandler } from '../../services/play-x-sound-event-handler';
import { PlayerStateService } from '../../apps/Player/services/player-state-service';
import { DesktopManager } from '../../services/desktop-manager';
import { initWindowManager, cleanupWindowManager } from '../../services/window-manager';
import { NotificationDaemon } from '../../services/notification-daemon';
import { ToastContainer } from '../../components/ToastContainer/ToastContainer';
import { ApplicationHost } from '../../apps/ApplicationHost';
import { getApplicationDefinition } from '../../apps/application-definitions';
import { DesktopIcon } from '@components/DesktopIcon/DesktopIcon';
import { ApplicationServer } from '../../services/application-server';
import { DesktopLayoutService } from '../../services/desktop-layout-service';
import { DesktopDragService } from '../../services/desktop-drag-service';
import { PhIcon, PhIconType } from '@components/PhIcon/PhIcon';
import { createDesktopDndController } from './create-desktop-dnd-controller';

function Desktop() {
  let desktopRef!: HTMLElement;
  const dnd = createDesktopDndController(() => desktopRef);

  onMount(() => {
    UserAccountService.checkLoginStateAndRedirect();
    SocketConnectionClient.connect();
    PlayXSoundEventHandler.initialize();
    PlayerStateService.initialize();
    NotificationDaemon.initialize();
    initWindowManager();
    DesktopLayoutService.initialize();

    const cleanupGlobalHandlers = dnd.registerGlobalHandlers();
    onCleanup(cleanupGlobalHandlers);
  });

  onCleanup(() => {
    SocketConnectionClient.disconnect();
    PlayXSoundEventHandler.cleanup();
    PlayerStateService.cleanup();
    NotificationDaemon.cleanup();
    cleanupWindowManager();
  });

  return (
    <>
      <MenuBar isUserLoggedIn={true} />
      <ToastContainer />
      <main
        ref={(el) => (desktopRef = el)}
        data-desktop-drop-root="true"
        class={styles.desktop}
        onDragOver={dnd.onDesktopDragOver}
        onDrop={(e) => {
          e.preventDefault();
          dnd.onDesktopDrop(e);
        }}
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) DesktopManager.clearAll();
        }}
      >
        <For each={DesktopLayoutService.iconOrder()}>
          {(appId) => {
            const definition = getApplicationDefinition(appId);
            if (!definition) return null;

            return (
              <DesktopIcon
                label={definition.title}
                iconIndex={definition.iconIndex}
                selected={DesktopManager.selectedIconId() === appId}
                removeMode={dnd.isTrashActive() && dnd.draggedDesktopAppId() === appId}
                onClick={() => DesktopManager.selectIcon(appId)}
                onDoubleClick={() => ApplicationServer.open(appId)}
                draggable
                onDragStart={(e) => dnd.onIconDragStart(appId, e)}
                onDragOver={dnd.onIconDragOver}
                onDrop={(e) => dnd.onIconDrop(appId, e)}
                onDragEnd={dnd.onIconDragEnd}
              />
            );
          }}
        </For>
        {DesktopDragService.dragPayload()?.source === 'desktop' && (
          <div
            class={`${styles.trashDropZone} ${dnd.isTrashActive() ? styles.trashDropZoneActive : ''}`}
            onDragOver={dnd.onTrashDragOver}
            onDragLeave={dnd.onTrashDragLeave}
            onDrop={(e) => {
              e.preventDefault();
              dnd.onTrashDrop(e);
            }}
          >
            <PhIcon type={PhIconType.Bold} icon="trash" size={52} />
          </div>
        )}
        <ApplicationHost />
      </main>
    </>
  );
}

export { Desktop };
