import { For } from 'solid-js';
import { Song } from '../../../../types/player-state';
import styles from './SongsQueue.module.css';
import { AppWindow } from '@components/AppWindow/AppWindow';
import { PLAYER_ICON_INDEX } from '@components/AppIcon/IconSpritesheet';

interface SongQueueProps {
  queue: Song[] | null;
  closeAction: () => void;
  startPosition: { x: number; y: number };
}

function SongsQueue(props: SongQueueProps) {
  return (
    <AppWindow
      title="Queue"
      iconIndex={PLAYER_ICON_INDEX}
      close={props.closeAction}
      startSize={{ width: '400px', height: '160px' }}
      startPosition={props.startPosition}
      parentAppId="player"
      closeWithParent={true}
    >
      <section class={styles.songQueueSection}>
        <h2>The song queue</h2>
        <ol class={styles.songQueueList}>
          <For each={props.queue}>{(song) => <li>{song.name}</li>}</For>
        </ol>
      </section>
    </AppWindow>
  );
}

export { SongsQueue };
