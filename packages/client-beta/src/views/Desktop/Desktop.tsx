import { Soundboard } from '../../apps/Soundboard/Soundboard';
import { onCleanup, onMount } from 'solid-js';
import styles from './Desktop.module.css';
import { Player } from '../../apps/Player/Player';
import { UserAccountService } from '../../services/user-account-service';
import { MenuBar } from '@components/MenuBar/MenuBar';
import { SocketConnectionClient } from '../../services/socket-connection-client';
import { Settings } from '../../apps/Settings/Settings';

function Desktop() {
  onMount(() => {
    UserAccountService.checkLoginStateAndRedirect();
    SocketConnectionClient.initializeConnection();
  });

  onCleanup(() => {
    SocketConnectionClient.disconnect();
  });

  return (
    <>
      <MenuBar isUserLoggedIn={true} />
      <main class={styles.desktop}>
        <Soundboard />
        <Player />
        <Settings />
      </main>
    </>
  );
}

export { Desktop };
