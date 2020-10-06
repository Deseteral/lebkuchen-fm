import Song from './songs/song';

interface CurrentlyPlaying {
  song: Song,
  time: number,
}

interface PlayerState {
  currentlyPlaying: (CurrentlyPlaying | null),
  queue: Song[],
}

function makeDefaultPlayerState(): PlayerState {
  return {
    currentlyPlaying: null,
    queue: [],
  };
}

export default PlayerState;
export {
  makeDefaultPlayerState,
};
