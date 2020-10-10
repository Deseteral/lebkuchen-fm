import Song from '../songs/song';

interface CurrentlyPlaying {
  song: Song,
  time: number,
}

interface PlayerState {
  currentlyPlaying: (CurrentlyPlaying | null),
  queue: Song[],
  isPlaying: boolean,
  volume: number,
}

function makeDefaultPlayerState(): PlayerState {
  return {
    currentlyPlaying: null,
    queue: [],
    isPlaying: true,
    volume: 100,
  };
}

export default PlayerState;
export {
  makeDefaultPlayerState,
};
