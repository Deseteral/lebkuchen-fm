import { Show } from 'solid-js';
import clsx from 'clsx';
import styles from '../../Player.module.css';
import { YouTubePlayer } from '../YouTubePlayer/YouTubePlayer';
import { PlayerControls } from '../PlayerControls/PlayerControls';
import { MarqueeText } from '../MarqueeText/MarqueeText';
import { PlayerStateService } from '../../services/player-state-service';

interface PlayerContentProps {
  onToggleQueue: () => void;
}

function PlayerContent(props: PlayerContentProps) {
  return (
    <div class={styles.playerContainer}>
      <section class={styles.player}>
        <YouTubePlayer />
      </section>
      <section class={styles.controls}>
        <p class={clsx(styles.nextSong, !PlayerStateService.playingNextSong() && styles.hidden)}>
          Next: {PlayerStateService.playingNextSong()}
        </p>
        <h1 class={styles.songTitle}>
          <Show
            when={!!PlayerStateService.currentlyPlayingSong()}
            fallback="No songs are currently playing."
          >
            <MarqueeText text={PlayerStateService.currentlyPlayingSong()!} />
          </Show>
        </h1>
        <hr class={styles.divider} />
        <PlayerControls
          queueButtonAction={props.onToggleQueue}
          isPlaying={PlayerStateService.isPlaying()}
        />
      </section>
    </div>
  );
}

export { PlayerContent };
