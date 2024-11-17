import { Soundboard } from '../../apps/Soundboard/Soundboard';
import { onMount } from 'solid-js';
import { checkLoginStateAndRedirect } from '../../services/user-account-service';
import styles from './Desktop.module.css';
import { Player } from '../../apps/Player/Player';
import { SocketConnectionClient } from '../../services/socket-connection-client';

function Desktop() {
  onMount(() => {
    checkLoginStateAndRedirect();
    SocketConnectionClient.initializeConnection();
  });

  return (
    <main class={styles.desktop}>
      <Soundboard />
      <Player />
    </main>
  );
}

export { Desktop };
