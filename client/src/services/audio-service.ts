export function playAudioFromUrl(url: string, volume: number): void {
  const audio = new Audio(url);
  audio.volume = volume / 100;
  audio.play();
}
