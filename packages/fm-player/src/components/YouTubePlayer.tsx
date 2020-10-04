import * as React from 'react';
import * as YouTubePlayerService from '../services/youtube-player-service';

const PLAYER_CONTAINER_ELEMENT_ID = 'yt-player';

function YouTubePlayer() {
  React.useEffect(() => {
    YouTubePlayerService.initialize(PLAYER_CONTAINER_ELEMENT_ID);
  }, []);

  return (
    <div id={PLAYER_CONTAINER_ELEMENT_ID} />
  );
}

export default YouTubePlayer;
