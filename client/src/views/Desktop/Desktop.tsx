import { Soundboard } from '../../apps/Soundboard/Soundboard';
import { onCleanup, onMount } from 'solid-js';
import styles from './Desktop.module.css';
import { Player } from '../../apps/Player/Player';
import { UserAccountService } from '../../services/user-account-service';
import { MenuBar } from '@components/MenuBar/MenuBar';
import { SocketConnectionClient } from '../../services/socket-connection-client';
import { Settings } from '../../apps/Settings/Settings';
import { PlayXSoundEventHandler } from '../../services/play-x-sound-event-handler';
import { DebugSoundUploadForm } from '../../apps/DebugSoundUploadForm/DebugSoundUploadForm';
import { Users } from '../../apps/Users/Users';

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
      <main class={styles.desktop}>
        <Player />
        <Soundboard />
        <DebugSoundUploadForm />
        <Users />
        <Settings />
      </main>
    </>
  );
}

export { Desktop };
