import { Song } from 'lebkuchen-fm-service';
import YTPlayer from 'yt-player';
import * as PlayerStateService from './player-state-service';

interface YTPlayerStateUpdateQueue {
  time: (number | null),
}

// Queued updates to the YouTube player state that can only be applied when the video is loaded and
// already playing. This is a workaround for YouTube player API lacking proper callback support for
// state changes.
const ytPlayerStateUpdateQueue: YTPlayerStateUpdateQueue = {
  time: null,
};

function playSong(player: YTPlayer, song: (Song | null), time = 0) {
  if (song) {
    PlayerStateService.getState().currentlyPlaying = {
      song,
      time,
    };

    player.load(song.youtubeId, true);
  } else {
    player.stop();
  }
}

function playNextSong(player: YTPlayer) {
  const song = PlayerStateService.popFromQueueFront();
  playSong(player, song);
}

function initialize(domId: string) {
  const player = new YTPlayer(`#${domId}`);

  PlayerStateService.on('playerStateReplaced', () => {
    const state = PlayerStateService.getState();

    if (state.currentlyPlaying) {
      const { song, time } = state.currentlyPlaying;
      playSong(player, song, time);
      ytPlayerStateUpdateQueue.time = time;
    }
  });

  player.on('playing', () => {
    if (ytPlayerStateUpdateQueue.time) {
      player.seek(ytPlayerStateUpdateQueue.time);
      ytPlayerStateUpdateQueue.time = null;
    }
  });

  player.on('timeupdate', (seconds) => {
    const state = PlayerStateService.getState();
    if (seconds > 0 && state.currentlyPlaying) {
      state.currentlyPlaying.time = seconds;
    }
  });

  PlayerStateService.on('songAddedToQueueFront', async () => {
    const ytPlayerState = player.getState();

    const isReadyToPlayNextVideo = (ytPlayerState !== 'playing');
    if (isReadyToPlayNextVideo) {
      playNextSong(player);
    }
  });

  player.on('ended', () => {
    playNextSong(player);
  });

  player.on('error', (event) => {
    console.error('YouTube player error', event);
    playNextSong(player);
  });

  player.on('unplayable', () => {
    playNextSong(player);
  });
}

export {
  initialize,
};
