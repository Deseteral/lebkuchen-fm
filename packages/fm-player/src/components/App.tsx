import * as React from 'react';
import { EventData } from 'lebkuchen-fm-service';
import * as Youtube from '../services/youtube-service';
import YouTubePlayer from './YouTubePlayer';
import * as EventStreamClient from '../services/event-stream-client';
import * as SpeechService from '../services/speech-service';
import NowPlaying from './NowPlaying/NowPlaying';
import { useFMStateContext } from '../context/FMStateContext';
import usePrevious from '../hooks/usePrevious';
import { playSound } from '../services/sound-player-service';

function App() {
  const { state, dispatch } = useFMStateContext();
  const prevState = usePrevious(state);

  React.useEffect(() => {
    const processCommand = (event: CustomEvent<EventData>) => {
      const { detail } = event;
      dispatch(detail);

      if (detail.id === 'ChangeSpeedEvent') {
        Youtube.setSpeed(detail.nextSpeed);
      }
    };

    EventStreamClient.connect();
    SpeechService.initialize();
    window.addEventListener('fm-command', processCommand);

    return () => {
      window.removeEventListener('fm-command', processCommand);
    };
  }, [dispatch]);

  React.useEffect(() => {
    console.log('newstate', state);
    const {
      currentlyPlaying,
      isPlaying,
      spokenMessage,
      sample,
    } = state;

    if (currentlyPlaying && currentlyPlaying !== prevState?.currentlyPlaying) {
      Youtube.playSong(currentlyPlaying.song, state.isPlaying);
    }

    if (isPlaying !== prevState?.isPlaying) {
      Youtube[isPlaying ? 'resume' : 'pause']();
    }

    if (spokenMessage && spokenMessage !== prevState?.spokenMessage) {
      SpeechService.say(spokenMessage.text, state.volume);
    }

    if (sample && sample !== prevState?.sample) {
      playSound(sample.url, state.volume);
    }

    Youtube.setVolume(state.volume);
  }, [state, prevState]);

  return (
    <div className="relative">
      <NowPlaying playerState={state} />
      <YouTubePlayer />
    </div>
  );
}

export default App;
