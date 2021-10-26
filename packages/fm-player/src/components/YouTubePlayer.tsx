import * as React from 'react';
import * as Youtube from '../services/youtube-service';

const YOUTUBE_PLAYER_DOM_ID = 'youtube-player';

function YouTubePlayer() {
  React.useEffect(() => {
    Youtube.initialize(YOUTUBE_PLAYER_DOM_ID);
  }, []);

  return (
    <div>
      <div id={YOUTUBE_PLAYER_DOM_ID} />
    </div>
  );
}

export default YouTubePlayer;
