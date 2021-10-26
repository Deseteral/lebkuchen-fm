import { EventData, Song, SpeedControl } from 'lebkuchen-fm-service';
import YTPlayer from 'yt-player';

let player: YTPlayer;

function playSong(song: (Song | null), isPlaying: boolean) {
  if (song) {
    player.load(song.youtubeId, isPlaying);
  } else {
    player.pause();
  }
}

function pause() {
  player.pause();
}

function resume() {
  player.play();
}

function setVolume(nextVolume: number) {
  player.setVolume(nextVolume);
  player.unMute();
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

  const dispatchResumeEvent = () => window.dispatchEvent(
    new CustomEvent<EventData>('fm-command', { detail: { id: 'ResumeEvent' } }),
  );

  const dispatchPauseEvent = () => window.dispatchEvent(
    new CustomEvent<EventData>('fm-command', { detail: { id: 'PauseEvent' } }),
  );

  const dispatchSkipEvent = () => window.dispatchEvent(
    new CustomEvent<EventData>('fm-command', { detail: { id: 'SkipEvent', skipAll: false, amount: 1 } }),
  );

  player.on('playing', dispatchResumeEvent);
  player.on('paused', dispatchPauseEvent);
  player.on('buffering', dispatchResumeEvent);
  player.on('ended', dispatchSkipEvent);
  player.on('error', dispatchSkipEvent);
  player.on('unplayable', dispatchSkipEvent);
}

export {
  initialize,
  pause,
  resume,
  playSong,
  setVolume,
  setSpeed,
};
