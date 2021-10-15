import * as React from 'react';
import { PlayerState } from 'lebkuchen-fm-service';
import YouTubePlayer from './YouTubePlayer';
import * as EventStreamClient from '../services/event-stream-client';
import * as SpeechService from '../services/speech-service';
import NowPlaying from './NowPlaying/NowPlaying';
import * as PlayerStateService from '../services/player-state-service';
import { useFMStateContext } from '../context/FMStateContext';

function App() {
  const [playerState, setPlayerState] = React.useState<PlayerState | null>(null);
  const { dispatch } = useFMStateContext();

  React.useEffect(() => {
    EventStreamClient.connect();
    SpeechService.initialize();

    PlayerStateService.onStateChange((nextState?: PlayerState) => {
      if (!nextState) return;
      setPlayerState({
        currentlyPlaying: nextState.currentlyPlaying,
        queue: nextState.queue,
        isPlaying: nextState.isPlaying,
      } as PlayerState);
    });
  }, []);

  if (playerState === null) return (<div />);

  const onVolumeDown = () => dispatch({ id: 'ChangeVolumeEvent', isRelative: true, nextVolume: -1 });
  const onVolumeFifty = () => dispatch({ id: 'ChangeVolumeEvent', isRelative: false, nextVolume: 50 });

  return (
    <div className="relative">
      {playerState && (<NowPlaying playerState={playerState} />)}
      <YouTubePlayer />
      <button type="button" onClick={onVolumeDown}>VOLUME DOWN</button>
      <button type="button" onClick={onVolumeFifty}>VOLUME 50</button>
    </div>
  );
}

export default App;
