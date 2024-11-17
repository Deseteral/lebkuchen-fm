import { Soundboard } from '../../apps/Soundboard/Soundboard';
import { onMount, onCleanup } from 'solid-js';
import styles from './Desktop.module.css';
import { Player } from '../../apps/Player/Player';
import { UserAccountService } from '../../services/user-account-service';
import { SocketConnectionClient } from '../../services/socket-connection-client';

function Desktop() {
  onMount(() => {
    UserAccountService.checkLoginStateAndRedirect();
    SocketConnectionClient.initializeConnection();
  });

  onCleanup(() => {
    SocketConnectionClient.disconnect();
  });

  return (
    <main class={styles.desktop}>
      <Soundboard />
      <Player />
    </main>
  );
}

export { Desktop };
