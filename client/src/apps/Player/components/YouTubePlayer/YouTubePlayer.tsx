import { onCleanup, onMount } from 'solid-js';
import { PlayerStateService } from '../../services/player-state-service';

const YOUTUBE_PLAYER_DOM_ID = 'youtube-player';

function YouTubePlayer() {
  onMount(() => {
    PlayerStateService.initializePlayer(YOUTUBE_PLAYER_DOM_ID);
  });

  onCleanup(() => {
    PlayerStateService.destroyPlayer();
  });

  return <div id={YOUTUBE_PLAYER_DOM_ID} />;
}

export { YouTubePlayer };
