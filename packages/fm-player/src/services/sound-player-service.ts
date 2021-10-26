function playSound(soundUrl: string, playerVolume: number) {
  const audio = new Audio(soundUrl);
  audio.volume = (playerVolume / 100);
  audio.play();
}

export {
  playSound,
};
