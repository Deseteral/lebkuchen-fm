import YTPlayer from 'yt-player';
import * as PlayerStateService from './player-state-service';

function playNextVideo(player: YTPlayer) {
  const song = PlayerStateService.popFromQueueFront();
  if (song) {
    player.load(song.youtubeId);
    player.play();
  } else {
    player.stop();
  }
}

function initialize(domId: string) {
  const player = new YTPlayer(`#${domId}`);

  player.on('ended', () => {
    playNextVideo(player);
  });

  player.on('error', (event) => {
    console.error(event);
    playNextVideo(player);
  });

  player.on('unplayable', () => {
    playNextVideo(player);
  });

  PlayerStateService.on('songAddedToQueueFront', async () => {
    const ytPlayerState = player.getState();

    const isReadyToPlayNextVideo = (ytPlayerState !== 'playing');
    if (isReadyToPlayNextVideo) {
      playNextVideo(player);
    }
  });
}

export {
  initialize,
};
