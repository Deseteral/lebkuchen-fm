function play(url) {
  const audio = new Audio(url);
  audio.play();
}

export default {
  play,
};
