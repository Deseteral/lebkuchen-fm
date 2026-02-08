import styles from './VolumeWidget.module.css';
import { createEffect, createSignal, onCleanup, onMount } from 'solid-js';
import { EventStreamClient } from '../../../../services/event-stream-client';
import { LocalEventTypes, LocalPlayerStateUpdateEvent } from '../../../../types/local-events';
import { PhIcon, PhIconType } from '@components/PhIcon/PhIcon';

enum VolumeIcon {
  Mute = 'speaker-simple-slash',
  Low = 'speaker-simple-low',
  High = 'speaker-simple-high',
}

function VolumeWidget() {
  // TODO: Get volume from preferences stored in localStorage
  const [volume, setVolume] = createSignal(50);
  const [icon, setIcon] = createSignal(VolumeIcon.High);

  const handleVolumeChange = (event: LocalPlayerStateUpdateEvent) => {
    const playerState = event.state;
    if (playerState?.volume && playerState.volume !== volume()) {
      setVolume(playerState.volume);
    }
  };

  onMount(() => {
    EventStreamClient.subscribe<LocalPlayerStateUpdateEvent>(
      LocalEventTypes.LocalPlayerStateUpdate,
      handleVolumeChange,
    );
  });

  onCleanup(() => {
    EventStreamClient.unsubscribe<LocalPlayerStateUpdateEvent>(
      LocalEventTypes.LocalPlayerStateUpdate,
      handleVolumeChange,
    );
  });

  createEffect(() => {
    const changedVolume = volume();
    if (changedVolume === 0) {
      setIcon(VolumeIcon.Mute);
    } else if (changedVolume < 50) {
      setIcon(VolumeIcon.Low);
    } else {
      setIcon(VolumeIcon.High);
    }
  });

  return (
    <button class={styles.buttonIcon}>
      <PhIcon type={PhIconType.Fill} icon={icon()} />
    </button>
  );
}

export { VolumeWidget };
