import { onMount, onCleanup } from 'solid-js';
import { YoutubePlayerService } from '../../services/youtube-player-service';
import { playRandomSongFromHistory, runCommand, skipSong } from '../../services/player-commands';
import { SocketConnectionClient } from '../../../../services/socket-connection-client-service';

const YOUTUBE_PLAYER_DOM_ID = 'youtube-player';

function YouTubePlayer() {
  onMount(() => {
    SocketConnectionClient.initializeConnection();

    YoutubePlayerService.initialize(YOUTUBE_PLAYER_DOM_ID);

    // @ts-ignore
    window.playRandom = () => {
      playRandomSongFromHistory();
    };
    // @ts-ignore
    window.skip = skipSong;
    // @ts-ignore
    window.runCommand = (command: string) => {
      runCommand(command);
    }
  });

  onCleanup(() => {
    SocketConnectionClient.disconnect();
    YoutubePlayerService.cleanup();
  });

  return (
    <div id={YOUTUBE_PLAYER_DOM_ID}/>
  );
}

export { YouTubePlayer };
