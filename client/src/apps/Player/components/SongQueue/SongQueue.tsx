import { For } from 'solid-js';
import { Song } from '../../../../types/player-state';
import styles from './SongQueue.module.css';
import { AppWindow } from '@components/AppWindow/AppWindow';
import { PLAYER_ICON_INDEX } from '@components/AppIcon/IconSpritesheet';

interface SongQueueProps {
  queue: Song[] | null;
  closeAction: () => void;
  containerRef: HTMLDivElement;
}

function SongQueue(props: SongQueueProps) {
  // eslint-disable-next-line solid/reactivity
  const containerPosition = props.containerRef.getBoundingClientRect();

  return (
    <AppWindow
      title="Queue"
      iconIndex={PLAYER_ICON_INDEX}
      close={props.closeAction}
      startSize={{ width: '400px', height: '200px' }}
      startPosition={{
        y: containerPosition.y - 28,
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

export { SongQueue };
