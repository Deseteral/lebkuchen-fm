import { DesktopIcon } from '@components/DesktopIcon/DesktopIcon';
import { createSignal, onCleanup, onMount } from 'solid-js';
import { AppWindow } from '@components/AppWindow/AppWindow';
import { YouTubePlayer } from './components/YouTubePlayer/YouTubePlayer';
import { PLAYER_ICON_INDEX } from '@components/AppIcon/IconSpritesheet';
import styles from './Player.module.css';
import { EventStreamClient } from '../../services/event-stream-client';
import { LocalEventTypes, LocalPlayerStateUpdateEvent } from '../../types/local-events';
import { PlayerControls } from './components/PlayerControls/PlayerControls';
import { SongsQueue } from './components/SongsQueue/SongsQueue';
import { Song } from '../../types/player-state';

function Player() {
  const [showWindow, setShowWindow] = createSignal(false);
  const [showQueue, setShowQueue] = createSignal(false);
  const [currentlyPlayingSong, setCurrentlyPlayingSong] = createSignal<string | null>(null);
  const [playingNextSong, setPlayingNextSong] = createSignal<string | null>(null);
  const [songQueue, setSongQueue] = createSignal<Song[] | null>(null);
  const [isPlaying, setIsPlaying] = createSignal(false);
  let buttonRef!: HTMLButtonElement;
  let containerRef!: HTMLDivElement;
  const closeWindow = () => setShowWindow(false);
  const toggleWindow = () => {
    setShowWindow((prev: boolean) => !prev);
    if (buttonRef) {
      buttonRef.blur();
    }
  };

  const onPlayerStateUpdate = (event: LocalPlayerStateUpdateEvent) => {
    console.log('Player state update in player:', event.state);
    const newCurrentlyPlayingSong = event.state?.currentlyPlaying?.song?.name;
    const queue = event.state?.queue;
    const newPlayingNextSong = queue?.[0] ? queue[0].name : null;

    setSongQueue(queue || null);
    setIsPlaying(Boolean(event.state?.isPlaying));

    if (currentlyPlayingSong() !== newCurrentlyPlayingSong) {
      setCurrentlyPlayingSong(newCurrentlyPlayingSong || null);
    }

    if (playingNextSong() !== newPlayingNextSong) {
      setPlayingNextSong(newPlayingNextSong || null);
    }
  };

  onMount(() => {
    EventStreamClient.subscribe<LocalPlayerStateUpdateEvent>(
      LocalEventTypes.LocalPlayerStateUpdate,
      onPlayerStateUpdate,
    );
  });

  onCleanup(() => {
    EventStreamClient.unsubscribe<LocalPlayerStateUpdateEvent>(
      LocalEventTypes.LocalPlayerStateUpdate,
      onPlayerStateUpdate,
    );
  });

  return (
    <>
      <DesktopIcon
        label="Player"
        buttonRef={(el: HTMLButtonElement) => (buttonRef = el)}
        toggleWindow={toggleWindow}
        iconIndex={PLAYER_ICON_INDEX}
      />
      {showWindow() && (
        <AppWindow
          title="Player"
          close={closeWindow}
          iconIndex={PLAYER_ICON_INDEX}
          startSize={{
            width: currentlyPlayingSong() ? '600px' : '400px',
            height: currentlyPlayingSong() ? '500px' : '180px',
            minWidth: '400px',
            minHeight: '180px',
          }}
        >
          <div class={styles.playerContainer} ref={(el: HTMLDivElement) => (containerRef = el)}>
            <section class={styles.player}>
              <YouTubePlayer />
            </section>
            <section class={styles.controls}>
              <h1 class={styles.songTitle}>
                {currentlyPlayingSong() || 'No songs are currently playing.'}
              </h1>
              {playingNextSong() && <p class={styles.nextSong}>Next: {playingNextSong()}</p>}
              <hr class={styles.divider} />
              <PlayerControls
                queueButtonAction={() => setShowQueue((prev: boolean) => !prev)}
                isPlaying={isPlaying()}
              />
            </section>
            {showQueue() && (
              <SongsQueue
                queue={songQueue()}
                containerRef={containerRef}
                closeAction={() => setShowQueue(false)}
              />
            )}
          </div>
        </AppWindow>
      )}
    </>
  );
}

export { Player };
