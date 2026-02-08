import { For } from 'solid-js';
import { Song } from '../../../../types/player-state';
import styles from './SongsQueue.module.css';
import { AppWindow } from '@components/AppWindow/AppWindow';
import { PLAYER_ICON_INDEX } from '@components/AppIcon/IconSpritesheet';

const APP_WINDOW_TITLE_BAR_HEIGHT = 28;

interface SongQueueProps {
  queue: Song[] | null;
  closeAction: () => void;
  containerRef: HTMLDivElement;
}

function SongsQueue(props: SongQueueProps) {
  // eslint-disable-next-line solid/reactivity
  const containerPosition = props.containerRef.getBoundingClientRect();

  return (
    <AppWindow
      title="Queue"
      iconIndex={PLAYER_ICON_INDEX}
      close={props.closeAction}
      startSize={{ width: '400px', height: '160px' }}
      startPosition={{
        y: containerPosition.y - APP_WINDOW_TITLE_BAR_HEIGHT,
        x: containerPosition.x + containerPosition.width,
      }}
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
