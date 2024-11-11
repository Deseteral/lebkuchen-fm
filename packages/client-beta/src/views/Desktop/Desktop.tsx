import { Soundboard } from '../../apps/Soundboard/Soundboard';
import { onMount } from 'solid-js';
import styles from './Desktop.module.css';
import { Player } from '../../apps/Player/Player';
import { UserAccountService } from '../../services/user-account-service';

function Desktop() {
  onMount(() => {
    UserAccountService.checkLoginStateAndRedirect();
  });

  return (
    <main class={styles.desktop}>
      <Soundboard />
      <Player />
    </main>
  );
}

export { Desktop };
