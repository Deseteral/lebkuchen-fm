import { Soundboard } from '../../apps/Soundboard/Soundboard';
import { onMount } from 'solid-js';
import { checkLoginStateAndRedirect } from '../../services/user-account-service';
import styles from './Desktop.module.css';
import { Player } from '../../apps/Player/Player';
import { MenuBar } from '../MenuBar/MenuBar';

function Desktop() {
  onMount(() => {
    checkLoginStateAndRedirect();
  });

  return (
    <>
      <MenuBar />
      <main class={styles.desktop}>
        <Soundboard />
        <Player />
      </main>
    </>
  );
}

export { Desktop };
