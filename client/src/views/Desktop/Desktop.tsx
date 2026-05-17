import { onCleanup, onMount } from 'solid-js';
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
        <ApplicationHost />
      </main>
    </>
  );
}

export { Desktop };
