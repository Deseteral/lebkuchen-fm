import * as React from 'react';
import { PlayerState } from 'lebkuchen-fm-service';
import { YouTubePlayer } from './YouTubePlayer';
import * as EventStreamClient from '../services/event-stream-client';
import * as SpeechService from '../services/speech-service';
import { NowPlaying } from './NowPlaying/NowPlaying';
import * as PlayerStateService from '../services/player-state-service';
import { SongsQueue } from './SongsQueue/SongsQueue';
import { SoundIcon } from '../icons/SoundIcon';

function FmPlayer() {
  const [playerState, setPlayerState] = React.useState<PlayerState | null>(null);
  // const [isSoundBoardExpanded, setIsSoundBoardExpanded] = React.useState<boolean>(false);
  const soundBoardLayer = React.useRef<HTMLDivElement>(null);

  const expandSoundBoard = () => {
    if (soundBoardLayer.current) {
      soundBoardLayer.current.classList.toggle('w-0');
      soundBoardLayer.current.classList.toggle('w-11/12');
      soundBoardLayer.current.classList.toggle('expanded');
    }
  };

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
      <div ref={soundBoardLayer} className="sound-board-layer fixed top-0 bottom-0 right-0 w-0 bg-blue-500">
        <button onClick={expandSoundBoard} type="button" className="absolute sound-board-layer-button p-4 bg-blue-500 text-whit">
          <SoundIcon />
        </button>
      </div>
      <YouTubePlayer />
    </div>
  );
}

export { FmPlayer };
