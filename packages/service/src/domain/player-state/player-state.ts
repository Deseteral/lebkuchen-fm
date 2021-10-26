import Song from '@service/domain/songs/song';

interface CurrentlyPlaying {
  song: Song,
  time: number,
}

interface SpokenMessage {
  text: string,
  timestamp: number,
}

interface Sample {
  url: string,
  timestamp: number,
}

interface PlayerState {
  currentlyPlaying: (CurrentlyPlaying | null),
  queue: Song[],
  isPlaying: boolean,
  volume: number,
  spokenMessage?: SpokenMessage,
  sample?: Sample,
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
