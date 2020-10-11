import * as React from 'react';
import * as YouTubePlayerService from '../services/youtube-player-service';

const YOUTUBE_PLAYER_DOM_ID = 'youtube-player';

function YouTubePlayer() {
  React.useEffect(() => {
    YouTubePlayerService.initialize(YOUTUBE_PLAYER_DOM_ID);
  }, []);

  return (
    <div id={YOUTUBE_PLAYER_DOM_ID} />
  );
}

export default YouTubePlayer;
