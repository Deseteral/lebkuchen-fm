import styles from './VolumeWidget.module.css';
import { createEffect, createSignal } from 'solid-js';
import { PlayerStateService } from '../../../../apps/Player/services/player-state-service';
import { PhIcon, PhIconType } from '@components/PhIcon/PhIcon';

enum VolumeIcon {
  Mute = 'speaker-simple-slash',
  Low = 'speaker-simple-low',
  High = 'speaker-simple-high',
}

function VolumeWidget() {
  const [icon, setIcon] = createSignal(VolumeIcon.High);

  createEffect(() => {
    const currentVolume = PlayerStateService.volume();
    if (currentVolume === 0) {
      setIcon(VolumeIcon.Mute);
    } else if (currentVolume < 50) {
      setIcon(VolumeIcon.Low);
    } else {
      setIcon(VolumeIcon.High);
    }
  });

  return (
    <button class={styles.buttonIcon}>
      <PhIcon type={PhIconType.Fill} icon={icon()} size={18} />
    </button>
  );
}

export { VolumeWidget };
