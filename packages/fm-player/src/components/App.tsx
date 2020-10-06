import * as React from 'react';
import YouTubePlayer from './YouTubePlayer';
import * as EventStreamClient from '../services/event-stream-client';
import * as SpeechService from '../services/speech-service';

function App() {
  React.useEffect(() => {
    EventStreamClient.connect();
    SpeechService.initialize();
  }, []);

  return (
    <>
      <div>LebkuchenFM</div>
      <YouTubePlayer />
    </>
  );
}

export default App;
