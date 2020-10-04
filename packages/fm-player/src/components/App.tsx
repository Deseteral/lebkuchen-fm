import * as React from 'react';
import YouTubePlayer from './YouTubePlayer';
import * as EventStreamClient from '../services/event-stream-client';

function App() {
  React.useEffect(() => {
    EventStreamClient.connect();
  }, []);

  return (
    <>
      <div>LebkuchenFM</div>
      <YouTubePlayer />
    </>
  );
}

export default App;
