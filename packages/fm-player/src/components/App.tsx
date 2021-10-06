import * as React from 'react';
import { PlayerState } from 'lebkuchen-fm-service';
import YouTubePlayer from './YouTubePlayer';
import * as EventStreamClient from '../services/event-stream-client';
import * as SpeechService from '../services/speech-service';
import NowPlaying from './NowPlaying';
import * as PlayerStateService from '../services/player-state-service';

function App() {
  const [playerState, setPlayerState] = React.useState<PlayerState | null>(null);

  React.useEffect(() => {
    EventStreamClient.connect();
    SpeechService.initialize();

    PlayerStateService.onStateChange((nextState?: PlayerState) => {
      setPlayerState(nextState ? {
        currentlyPlaying: nextState.currentlyPlaying,
        queue: nextState.queue,
        isPlaying: nextState.isPlaying,
      } as PlayerState : null);
    });
  }, []);

  return (
    <div className="relative">
      <NowPlaying
        playerState={playerState}
      />
      <YouTubePlayer />
    </div>
  );
}

export default App;
