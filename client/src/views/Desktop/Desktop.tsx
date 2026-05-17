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
import { DESKTOP_APP_IDS } from './desktop-layout';

function Desktop() {
  onMount(() => {
    UserAccountService.checkLoginStateAndRedirect();
    SocketConnectionClient.connect();
    PlayXSoundEventHandler.initialize();
    PlayerStateService.initialize();
    NotificationDaemon.initialize();
    initWindowManager();
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
        class={styles.desktop}
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) DesktopManager.clearAll();
        }}
      >
        <For each={DESKTOP_APP_IDS}>
          {(appId) => {
            const definition = getApplicationDefinition(appId);
            if (!definition) return null;

            return (
              <DesktopIcon
                label={definition.title}
                iconIndex={definition.iconIndex}
                selected={DesktopManager.selectedIconId() === appId}
                onClick={() => DesktopManager.selectIcon(appId)}
                onDoubleClick={() => ApplicationServer.open(appId)}
              />
            );
          }}
        </For>
        <ApplicationHost />
      </main>
    </>
  );
}

export { Desktop };
