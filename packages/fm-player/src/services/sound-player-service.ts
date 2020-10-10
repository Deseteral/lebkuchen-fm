import { getState } from './player-state-service';

function playSound(soundUrl: string) {
  const audio = new Audio(soundUrl);
  audio.volume = (getState().volume / 100);
  audio.play();
}

export {
  playSound,
};
