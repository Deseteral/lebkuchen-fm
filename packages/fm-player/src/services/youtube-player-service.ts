import { Song } from 'lebkuchen-fm-service';
import YTPlayer from 'yt-player';
import * as PlayerStateService from './player-state-service';

let player: YTPlayer;

interface YTPlayerStateUpdateQueue {
  time: (number | null),
}

type SpeedControl = (-1 | 0 | 1);

// Queued updates to the YouTube player state that can only be applied when the video is loaded and
// already playing. This is a workaround for YouTube player API lacking proper callback support for
// state changes.
const ytPlayerStateUpdateQueue: YTPlayerStateUpdateQueue = {
  time: null,
};

function playSong(song: (Song | null), time = 0) {
  if (song) {
    const state = PlayerStateService.getState();
    state.currentlyPlaying = {
      song,
      time,
    };

    player.load(song.youtubeId, state.isPlaying);
  } else {
    player.stop();
  }
}

function playNextSong() {
  const song = PlayerStateService.popFromQueueFront();
  playSong(song);
}

function pause() {
  player.pause();
  PlayerStateService.getState().isPlaying = false;
}

function resume() {
  player.play();
  PlayerStateService.getState().isPlaying = true;
}

function setVolume(nextVolume: number) {
  player.setVolume(nextVolume);
}

function setSpeed(nextSpeed: SpeedControl) {
  switch (nextSpeed) {
    case 0:
      player.setPlaybackRate(1);
      return;
    case -1:
    case 1: {
      const available = player.getAvailablePlaybackRates();
      const current = player.getPlaybackRate();
      const indexOfCurrent = available.indexOf(current);

      const newSpeed = available[indexOfCurrent + nextSpeed];
      if (!Number.isNaN(newSpeed)) {
        player.setPlaybackRate(newSpeed);
      }
    } break;
    default:
      break;
  }
}

function initialize(playerContainerDomId: string) {
  player = new YTPlayer(`#${playerContainerDomId}`);

  PlayerStateService.on('playerStateReplaced', () => {
    const state = PlayerStateService.getState();

    player.setVolume(state.volume);

    if (state.currentlyPlaying) {
      const { song, time } = state.currentlyPlaying;
      playSong(song, time);
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
      playNextSong();
    }
  });

  player.on('ended', () => {
    playNextSong();
  });

  player.on('error', (event) => {
    console.error('YouTube player error', event);
    playNextSong();
  });

  player.on('unplayable', () => {
    playNextSong();
  });
}

export {
  SpeedControl,
  initialize,
  pause,
  resume,
  playNextSong,
  setVolume,
  setSpeed,
};
