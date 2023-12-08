import { Song, SpeedControl } from 'lebkuchen-fm-service';
import YTPlayer from 'yt-player';
import * as PlayerStateService from './player-state-service';

let player: YTPlayer;
const { done } = PlayerStateService;

interface YTPlayerStateUpdateQueue {
  time: (number | null),
}

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
  done();
}

function playNextSong() {
  const song = PlayerStateService.popFromQueueFront();
  playSong(song);
  done();
}

function pause() {
  player.pause();
  PlayerStateService.getState().isPlaying = false;
  done();
}

function resume() {
  player.play();
  PlayerStateService.getState().isPlaying = true;
  done();
}

function setVolume(nextVolume: number) {
  player.setVolume(nextVolume);
  done();
}

function setSpeed(nextSpeed: SpeedControl) {
  switch (nextSpeed) {
    case 0:
      player.setPlaybackRate(1);
      done();
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
      done();
    } break;
    default:
      break;
  }
}

function rewindTo(time: number) {
  player.seek(time);
  done();
}

function rewindBy(time: number) {
  const state = PlayerStateService.getState();
  const actualTime = state.currentlyPlaying?.time;

  if (actualTime === undefined) {
    return done();
  }

  const timeAfterRewind = Math.ceil(actualTime + time);
  if (timeAfterRewind < 0) {
    return rewindTo(0);
  }

  return rewindTo(timeAfterRewind);
}

function initialize(playerContainerDomId: string) {
  player = new YTPlayer(`#${playerContainerDomId}`);

  PlayerStateService.on('playerStateReplaced', () => {
    const state = PlayerStateService.getState();

    player.setVolume(state.volume);
    player.setPlaybackQuality('highres');

    if (state.currentlyPlaying) {
      const { song, time } = state.currentlyPlaying;
      playSong(song, time);
      ytPlayerStateUpdateQueue.time = time;
    }
    done();
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
    done();
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
  initialize,
  resume,
  pause,
  playNextSong,
  setVolume,
  setSpeed,
  rewindTo,
  rewindBy,
};
