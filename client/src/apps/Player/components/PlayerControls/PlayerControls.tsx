import styles from '../../Player.module.css';
import { Button, ButtonVariant } from '@components/Button/Button';
import clsx from 'clsx';
import { PlayerActions } from '../../services/player-actions';
import { PlayerInput } from '../PlayerInput/PlayerInput';
import pauseIcon from '../../../../icons/pause-icon.png';
import playIcon from '../../../../icons/play-icon.png';
import queueIcon from '../../../../icons/queue-icon.png';
import randomIcon from '../../../../icons/random-icon.png';
import searchIcon from '../../../../icons/search-icon.png';
import skipIcon from '../../../../icons/skip-icon.png';

interface PlayerControlsProps {
  queueButtonAction: () => void;
  isPlaying: boolean;
}

function PlayerControls(props: PlayerControlsProps) {
  const onSearchFormSubmit = (e: Event) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const phrase = form.searchInput.value as string;

    PlayerActions.searchAndPlaySong(phrase);
    form.reset();
  };

  return (
    <div class={styles.buttonsRow}>
      <div class={styles.controlButtons}>
        <Button variant={ButtonVariant.IconGrouped} title="For now I do nothing :(">
          <img src={skipIcon} class={clsx(styles.buttonIcon, styles.reversed)} alt="" />
        </Button>
        <Button
          onClick={props.isPlaying ? PlayerActions.playerPause : PlayerActions.playerResume}
          variant={ButtonVariant.IconGrouped}
          title={props.isPlaying ? 'Pause' : 'Play'}
        >
          {props.isPlaying ? (
            <img src={pauseIcon} class={styles.buttonIcon} alt="" />
          ) : (
            <img src={playIcon} class={styles.buttonIcon} alt="" />
          )}
        </Button>
        <Button
          variant={ButtonVariant.IconGrouped}
          title="Skip song"
          onClick={PlayerActions.skipSong}
        >
          <img src={skipIcon} class={styles.buttonIcon} alt="" />
        </Button>
      </div>
      <div class={styles.additionalButtons}>
        <form class={styles.searchForm} onSubmit={onSearchFormSubmit}>
          <PlayerInput title="/q - by YT id, /r - random" placeholder="Search" name="searchInput" />
          <Button variant={ButtonVariant.Icon} title="Search">
            <img src={searchIcon} class={styles.buttonIcon} alt="" />
          </Button>
        </form>
        <Button
          variant={ButtonVariant.Icon}
          title="Play random song"
          onClick={PlayerActions.playRandomSong}
        >
          <img src={randomIcon} class={styles.buttonIcon} alt="" />
        </Button>
        <Button variant={ButtonVariant.Icon} title="Queue" onClick={props.queueButtonAction}>
          <img src={queueIcon} class={styles.buttonIcon} alt="" />
        </Button>
      </div>
    </div>
  );
}

export { PlayerControls };
