import * as React from "react";
import youtubePlayer from '../../services/youtubePlayer';

class YoutubePlayer extends React.Component {

  public componentDidMount() {
    youtubePlayer.initPlayer('yt-player');
  }

  public render() {
    return(
      <div className="player-container">
        <div id="yt-player" />
      </div>
    );
  }
}

export default YoutubePlayer;
