import { onMount, onCleanup } from 'solid-js';
import { NativePlayerService } from '../../services/native-player-service';
import styles from '../../Player.module.css';

function NativePlayer() {
  let videoRef!: HTMLVideoElement;

  onMount(() => {
    NativePlayerService.initialize(videoRef);
  });

  onCleanup(() => {
    NativePlayerService.cleanup();
  });

  return (
    <video
      ref={(el) => {
        videoRef = el;
      }}
      class={styles.video}
      controls
    />
  );
}

export { NativePlayer };
