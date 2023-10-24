import { getUserPreference } from './user-preferences-service';
import { getState } from './player-state-service';

function playSound(soundUrl: string) {
  if (getUserPreference('sound-player-mute', false)) {
    return;
  }

  const audio = new Audio(soundUrl);
  audio.volume = (getState().volume / 100);
  audio.play();
}

export {
  playSound,
};
