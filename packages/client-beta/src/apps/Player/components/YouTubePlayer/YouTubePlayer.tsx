import { onMount, onCleanup } from 'solid-js';
import { YoutubePlayerService } from '../../services/youtube-player-service';
import { SocketConnectionClient } from '../../../../services/socket-connection-client';

const YOUTUBE_PLAYER_DOM_ID = 'youtube-player';

function YouTubePlayer() {
  onMount(() => {
    YoutubePlayerService.initialize(YOUTUBE_PLAYER_DOM_ID);
  });

  onCleanup(() => {
    SocketConnectionClient.disconnect();
    YoutubePlayerService.cleanup();
  });

  return <div id={YOUTUBE_PLAYER_DOM_ID} />;
}

export { YouTubePlayer };
