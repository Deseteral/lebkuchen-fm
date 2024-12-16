import { Soundboard } from '../../apps/Soundboard/Soundboard';
import { onCleanup, onMount } from 'solid-js';
import styles from './Desktop.module.css';
import { Player } from '../../apps/Player/Player';
import { UserAccountService } from '../../services/user-account-service';
import { MenuBar } from '@components/MenuBar/MenuBar';
import { SocketConnectionClient } from '../../services/socket-connection-client';
import { Settings } from '../../apps/Settings/Settings';
import { XSoundsPlayService } from '../../services/x-sounds-play-service';
import { DebugSoundUploadForm } from '../../apps/DebugSoundUploadForm/DebugSoundUploadForm';

function Desktop() {
  onMount(() => {
    UserAccountService.checkLoginStateAndRedirect();
    SocketConnectionClient.connect();
    XSoundsPlayService.initialize();
  });

  onCleanup(() => {
    SocketConnectionClient.disconnect();
    XSoundsPlayService.cleanup();
  });

  return (
    <>
      <MenuBar isUserLoggedIn={true} />
      <main class={styles.desktop}>
        <Player />
        <Soundboard />
        <DebugSoundUploadForm />
        <Settings />
      </main>
    </>
  );
}

export { Desktop };
