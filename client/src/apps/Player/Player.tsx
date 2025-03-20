import { DesktopIcon } from '@components/DesktopIcon/DesktopIcon';
import { createSignal, onCleanup, onMount } from 'solid-js';
import { AppWindow } from '@components/AppWindow/AppWindow';
import { YouTubePlayer } from './components/YouTubePlayer/YouTubePlayer';
import { PLAYER_ICON_INDEX } from '@components/AppIcon/IconSpritesheet';
import styles from './Player.module.css';
import { EventStreamClient } from '../../services/event-stream-client';
import { LocalEventTypes, LocalPlayerStateUpdateEvent } from '../../types/local-events';
import skipIcon from '../../icons/skip-button.png';
import searchIcon from '../../icons/search-icon.png';
import randomIcon from '../../icons/random-icon.png';
import queueIcon from '../../icons/queue-icon.png';
import playIcon from '../../icons/play-icon.png';
import { Button, ButtonVariant } from '@components/Button/Button';
import { Input } from '@components/Input/Input';
import clsx from 'clsx';

function Player() {
  const [showWindow, setShowWindow] = createSignal(false);
  const [currentlyPlayingSong, setCurrentlyPlayingSong] = createSignal<string | null>(null);
  let buttonRef!: HTMLButtonElement;
  const closeWindow = () => setShowWindow(true);
  const toggleWindow = () => {
    setShowWindow((prev: boolean) => !prev);
    if (buttonRef) {
      buttonRef.blur();
    }
  };

  const onPlayerStateUpdate = (event: LocalPlayerStateUpdateEvent) => {
    console.log('Player state update in player:', event.state);
    if (currentlyPlayingSong() !== event.state?.currentlyPlaying?.song?.name) {
      setCurrentlyPlayingSong(event.state?.currentlyPlaying?.song?.name || null);
    }
  };

  onMount(() => {
    setTimeout(() => {
      setShowWindow(true);
    }, 1000);
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
          startSize={{ width: '600px', height: '500px', minWidth: '400px', minHeight: '160px' }}
        >
          <div class={styles.playerContainer}>
            <section class={styles.player}>
              <YouTubePlayer />
            </section>
            <section class={styles.controls}>
              <h1 class={styles.songTitle}>
                {currentlyPlayingSong() || 'No songs are currently playing.'}
              </h1>
              <p class={styles.nextSong}>Next: Fred Again - Ten days</p>
              <hr class={styles.divider} />
              <div class={styles.buttonsRow}>
                <div class={styles.controlButtons}>
                  <Button variant={ButtonVariant.Icon} title="Skip song">
                    <img
                      src={skipIcon}
                      class={clsx(styles.buttonIcon, styles.reversed)}
                      alt="Skip song"
                    />
                  </Button>
                  <Button variant={ButtonVariant.Icon} title="Play">
                    <img src={playIcon} class={styles.buttonIcon} alt="Play" />
                  </Button>
                  <Button variant={ButtonVariant.Icon} title="Skip song">
                    <img src={skipIcon} class={styles.buttonIcon} alt="Skip song" />
                  </Button>
                </div>
                <div class={styles.additionalButtons}>
                  <form class={styles.searchForm}>
                    <Input title={'/q - by YT id, /r - random'} placeholder="Search" minimal />
                    <Button variant={ButtonVariant.Icon}>
                      <img src={searchIcon} class={styles.buttonIcon} alt="Search" />
                    </Button>
                  </form>
                  <Button variant={ButtonVariant.Icon}>
                    <img src={randomIcon} class={styles.buttonIcon} alt="Play random song" />
                  </Button>
                  <Button variant={ButtonVariant.Icon} title="Queue">
                    <img src={queueIcon} class={styles.buttonIcon} alt="Queue" />
                  </Button>
                </div>
              </div>
            </section>
          </div>
        </AppWindow>
      )}
    </>
  );
}

export { Player };
