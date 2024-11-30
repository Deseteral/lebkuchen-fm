import volumeLowIcon from '../../../../icons/volume-low-solid.svg';
import volumeHighIcon from '../../../../icons/volume-high-solid.svg';
import volumeMuteIcon from '../../../../icons/volume-xmark-solid.svg';
import styles from './VolumeWidget.module.css';
import { createEffect, createSignal, onCleanup, onMount } from 'solid-js';
import { EventStreamClient } from '../../../../services/event-stream-client';
import { LocalEventTypes, LocalPlayerStateUpdateEvent } from '../../../../types/local-events';

function VolumeWidget() {
  // TODO: Get volume from preferences stored in localStorage
  const [volume, setVolume] = createSignal(50);
  const [icon, setIcon] = createSignal(volumeHighIcon);

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
