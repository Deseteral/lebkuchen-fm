import { onCleanup, onMount } from 'solid-js';
import { YoutubePlayerService } from '../../services/youtube-player-service';
import { EventStreamClient } from '../../../../services/event-stream-client';
import {
  LocalEventTypes,
  LocalWebsocketConnectionReadyEvent,
} from '../../../../types/local-events';
import { SocketConnectionClient } from '../../../../services/socket-connection-client';

const YOUTUBE_PLAYER_DOM_ID = 'youtube-player';

function YouTubePlayer() {
  const initializeYoutubePlayer = () => {
    if (SocketConnectionClient.ready() && !YoutubePlayerService.initialized()) {
      console.log('[YouTubePlayer] Service initializing');
      YoutubePlayerService.initialize(YOUTUBE_PLAYER_DOM_ID);
    }
  };

  const onWebsocketConnectionReady = () => {
    console.log('[YouTubePlayer] Websocket connection ready event');
    initializeYoutubePlayer();
  };

  const unsubscribeFromWebsocketConnectionReadyEvent = () => {
    EventStreamClient.unsubscribe<LocalWebsocketConnectionReadyEvent>(
      LocalEventTypes.LocalWebsocketConnectionReady,
      onWebsocketConnectionReady,
    );
  };

  EventStreamClient.subscribe<LocalWebsocketConnectionReadyEvent>(
    LocalEventTypes.LocalWebsocketConnectionReady,
    onWebsocketConnectionReady,
  );

  onMount(() => {
    initializeYoutubePlayer();
  });

  onCleanup(() => {
    YoutubePlayerService.cleanup();
    unsubscribeFromWebsocketConnectionReadyEvent();
  });

  return <div id={YOUTUBE_PLAYER_DOM_ID} />;
}

export { YouTubePlayer };
