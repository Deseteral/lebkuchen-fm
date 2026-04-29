import { onCleanup, onMount } from 'solid-js';
import { YoutubePlayerService } from '../../services/youtube-player-service';
import { EventStreamClient } from '../../../../services/event-stream-client';
import {
  LocalEventTypes,
  LocalWebSocketConnectionReadyEvent,
} from '../../../../types/local-events';
import { SocketConnectionClient } from '../../../../services/socket-connection-client';

const YOUTUBE_PLAYER_DOM_ID = 'youtube-player';

function YouTubePlayer() {
  const initializeYoutubePlayer = () => {
    if (SocketConnectionClient.isReady() && !YoutubePlayerService.isInitialized()) {
      console.log('[YouTubePlayer] Service initializing.');
      YoutubePlayerService.initialize(YOUTUBE_PLAYER_DOM_ID);
    }
  };

  const onWebSocketConnectionReady = () => {
    console.log('[YouTubePlayer] WebSocket connection ready event.');
    initializeYoutubePlayer();
  };

  onMount(() => {
    initializeYoutubePlayer();
    EventStreamClient.subscribe<LocalWebSocketConnectionReadyEvent>(
      LocalEventTypes.LocalWebSocketConnectionReady,
      onWebSocketConnectionReady,
    );
  });

  onCleanup(() => {
    YoutubePlayerService.cleanup();
    EventStreamClient.unsubscribe<LocalWebSocketConnectionReadyEvent>(
      LocalEventTypes.LocalWebSocketConnectionReady,
      onWebSocketConnectionReady,
    );
  });

  return <div id={YOUTUBE_PLAYER_DOM_ID} />;
}

export { YouTubePlayer };
