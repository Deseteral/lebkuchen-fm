import { Soundboard } from '../../apps/Soundboard/Soundboard';
import { onMount } from 'solid-js';
import * as EventStreamClientService from '../../services/event-stream-client-service'
import { checkLoginStateAndRedirect } from '../../services/user-account-service';
import styles from './Desktop.module.css';

function Desktop() {
  onMount(() => {
    EventStreamClientService.connect();
    checkLoginStateAndRedirect();
  });

  return (
    <main class={styles.desktop}>
      <Soundboard />
      <Soundboard />
      <Soundboard />
    </main>
  );
}

export { Desktop };
