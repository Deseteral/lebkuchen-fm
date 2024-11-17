import volumeLowIcon from '../../../../icons/volume-low-solid.svg';
import volumeHighIcon from '../../../../icons/volume-high-solid.svg';
import volumeMuteIcon from '../../../../icons/volume-xmark-solid.svg';
import styles from './VolumeWidget.module.css';
import { createEffect, createSignal } from 'solid-js';
import { PlayerStateService } from '../../../../apps/Player/services/player-state-service';

function VolumeWidget() {
  // TODO: Get volume from preferences stored in localStorage
  const currentVolume = PlayerStateService.get().volume;
  const [volume] = createSignal(currentVolume);
  const [icon, setIcon] = createSignal(volumeHighIcon);

  createEffect(() => {
    const changedVolume = volume();
    if (changedVolume === 0) {
      setIcon(volumeMuteIcon);
    } else if (changedVolume < 50) {
      setIcon(volumeLowIcon);
    } else {
      setIcon(volumeHighIcon);
    }
  });

  return (
    <button class={styles.buttonIcon}>
      <img class={styles.icon} src={icon()} alt="Ustawienia" />
    </button>
  );
}

export { VolumeWidget };
