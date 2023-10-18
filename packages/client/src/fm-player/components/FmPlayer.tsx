import * as React from 'react';
import { PlayerState } from 'lebkuchen-fm-service';
import { YouTubePlayer } from './YouTubePlayer';
import * as EventStreamClient from '../services/event-stream-client';
import * as SpeechService from '../services/speech-service';
import { NowPlaying } from './NowPlaying/NowPlaying';
import * as PlayerStateService from '../services/player-state-service';
import { SongsQueue } from './SongsQueue/SongsQueue';
import { SoundBoardWidget } from './SoundBoardWidget';

function FmPlayer() {
  const [playerState, setPlayerState] = React.useState<PlayerState | null>(null);

  React.useEffect(() => {
    const eventStreamDisconnect = EventStreamClient.connect();
    SpeechService.initialize();

    PlayerStateService.onStateChange((nextState?: PlayerState) => {
      if (!nextState) return;
      setPlayerState({
        currentlyPlaying: nextState.currentlyPlaying,
        queue: nextState.queue,
        isPlaying: nextState.isPlaying,
      } as PlayerState);
    });

    return () => eventStreamDisconnect();
  }, []);

  if (playerState === null) return (<div />);

  return (
    <div className="relative">
      {playerState && (<NowPlaying playerState={playerState} />)}
      {playerState && (<SongsQueue playerState={playerState} />)}
      <SoundBoardWidget />
      <YouTubePlayer />
    </div>
  );
}

export { FmPlayer };
