import Song from '../songs/song';

interface PlayerState {
  queue: Song[],
}

function makeDefaultPlayerState(): PlayerState {
  return {
    queue: [],
  };
}

export default PlayerState;
export {
  makeDefaultPlayerState,
};
