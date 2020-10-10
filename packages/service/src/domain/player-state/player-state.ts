import Song from '../songs/song';

interface CurrentlyPlaying {
  song: Song,
  time: number,
}

interface PlayerState {
  currentlyPlaying: (CurrentlyPlaying | null),
  queue: Song[],
  isPlaying: boolean,
}

function makeDefaultPlayerState(): PlayerState {
  return {
    currentlyPlaying: null,
    queue: [],
    isPlaying: true,
  };
}

export default PlayerState;
export {
  makeDefaultPlayerState,
};
