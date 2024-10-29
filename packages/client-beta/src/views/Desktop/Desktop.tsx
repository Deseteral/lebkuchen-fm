import { Soundboard } from '../../apps/Soundboard/Soundboard';
import { onMount } from 'solid-js';
import { checkLoginStateAndRedirect } from '../../services/user-account-service';
import styles from './Desktop.module.css';
import { Player } from '../../apps/Player/Player';

function Desktop() {
  onMount(() => {
    checkLoginStateAndRedirect();
  });

  return (
    <main class={styles.desktop}>
      <Soundboard />
      <Soundboard />
      <Soundboard />
      <Player />
    </main>
  );
}

export { Desktop };
