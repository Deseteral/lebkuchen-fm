import { Soundboard } from '../../apps/Soundboard/Soundboard';
import { onCleanup, onMount } from 'solid-js';
import styles from './Desktop.module.css';
import { Player } from '../../apps/Player/Player';
import { UserAccountService } from '../../services/user-account-service';
import { MenuBar } from '@components/MenuBar/MenuBar';
import { SocketConnectionClient } from '../../services/socket-connection-client';
import { Settings } from '../../apps/Settings/Settings';
import { PlayXSoundEventHandler } from '../../services/play-x-sound-event-handler';
import { PlayerStateService } from '../../apps/Player/services/player-state-service';
import { SoundUpload } from '../../apps/SoundUpload/SoundUpload';
import { Users } from '../../apps/Users/Users';
import { Terminal } from '../../apps/Terminal/Terminal';
import { DesktopManager } from '../../services/desktop-manager';
import { initWindowManager, cleanupWindowManager } from '../../services/window-manager';
import { NotificationDaemon } from '../../services/notification-daemon';
import { ToastContainer } from '../../components/ToastContainer/ToastContainer';

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
        <Player />
        <Soundboard />
        <Terminal />
        <SoundUpload />
        <Users />
        <Settings />
      </main>
    </>
  );
}

export { Desktop };
