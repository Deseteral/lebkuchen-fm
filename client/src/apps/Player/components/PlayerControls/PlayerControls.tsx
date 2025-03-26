import styles from './PlayerControls.module.css';
import { Button, ButtonVariant } from '@components/Button/Button';
import { PlayerActions } from '../../services/player-actions';
import { PlayerInput } from '../PlayerInput/PlayerInput';
import { PhIcon, PhIconType } from '@components/PhIcon/PhIcon';

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
          <PhIcon type={PhIconType.Fill} icon="skip-back" />
        </Button>
        <Button
          onClick={props.isPlaying ? PlayerActions.playerPause : PlayerActions.playerResume}
          variant={ButtonVariant.IconGrouped}
          title={props.isPlaying ? 'Pause' : 'Play'}
        >
          {props.isPlaying ? (
            <PhIcon type={PhIconType.Fill} icon="pause" />
          ) : (
            <PhIcon type={PhIconType.Fill} icon="play" />
          )}
        </Button>
        <Button
          variant={ButtonVariant.IconGrouped}
          title="Skip song"
          onClick={PlayerActions.skipSong}
        >
          <PhIcon type={PhIconType.Fill} icon="skip-forward" />
        </Button>
      </div>
      <div class={styles.additionalButtons}>
        <form class={styles.searchForm} onSubmit={onSearchFormSubmit}>
          <PlayerInput title="/q - by YT id, /r - random" placeholder="Search" name="searchInput" />
          <Button variant={ButtonVariant.Icon} title="Search">
            <PhIcon type={PhIconType.Bold} icon="magnifying-glass" />
          </Button>
        </form>
        <Button
          variant={ButtonVariant.Icon}
          title="Play random song"
          onClick={PlayerActions.playRandomSong}
        >
          <PhIcon type={PhIconType.Bold} icon="shuffle" />
        </Button>
        <Button variant={ButtonVariant.Icon} title="Queue" onClick={props.queueButtonAction}>
          <PhIcon type={PhIconType.Bold} icon="playlist" />
        </Button>
      </div>
    </div>
  );
}

export { PlayerControls };
