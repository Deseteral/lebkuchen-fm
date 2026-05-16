import { Soundboard } from '../../apps/Soundboard/Soundboard';
import { onCleanup, onMount } from 'solid-js';
import styles from './Desktop.module.css';
import { Player } from '../../apps/Player/Player';
import { UserAccountService } from '../../services/user-account-service';
import { MenuBar } from '@components/MenuBar/MenuBar';
import { SocketConnectionClient } from '../../services/socket-connection-client';
import { Settings } from '../../apps/Settings/Settings';
import { PlayXSoundEventHandler } from '../../services/play-x-sound-event-handler';
import { SoundUpload } from '../../apps/SoundUpload/SoundUpload';
import { Users } from '../../apps/Users/Users';
import { Terminal } from '../../apps/Terminal/Terminal';
import { clearAllActive } from '../../services/window-manager';

function Desktop() {
  onMount(() => {
    UserAccountService.checkLoginStateAndRedirect();
    SocketConnectionClient.connect();
    PlayXSoundEventHandler.initialize();
  });

  onCleanup(() => {
    SocketConnectionClient.disconnect();
    PlayXSoundEventHandler.cleanup();
  });

  return (
    <>
      <MenuBar isUserLoggedIn={true} />
      <main
        class={styles.desktop}
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) clearAllActive();
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
