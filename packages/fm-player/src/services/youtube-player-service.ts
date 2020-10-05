import YouTubePlayerFactory from 'youtube-player';
import { YouTubePlayer } from 'youtube-player/dist/types';
import YouTubePlayerStates from 'youtube-player/dist/constants/PlayerStates';
import { Song } from 'lebkuchen-fm-service';
import * as PlayerStateService from './player-state-service';

function playVideo(player: YouTubePlayer, song: Song) {
  player.loadVideoById(song.youtubeId);
  player.playVideo();
}

function playNextVideo(player: YouTubePlayer) {
  const song = PlayerStateService.popFromQueueFront();
  if (song) {
    playVideo(player, song);
  } else {
    player.stopVideo();
  }
}

function initialize(domId: string) {
  const player = YouTubePlayerFactory(domId);

  player.on('stateChange', (event) => {
    if (event.data === YouTubePlayerStates.ENDED) {
      playNextVideo(player);
    }
  });

  player.on('error', (event) => {
    console.error(event);
    playNextVideo(player);
  });

  PlayerStateService.on('songAddedToQueueFront', () => {
    const youTubePlayerState = player.getPlayerState();
    const playerIsReadyToPlayNextVideo = (
      (youTubePlayerState === YouTubePlayerStates.ENDED) ||
      (youTubePlayerState === YouTubePlayerStates.VIDEO_CUED)
    );

    if (playerIsReadyToPlayNextVideo) {
      playNextVideo(player);
    }
  });
}

export {
  initialize,
};
