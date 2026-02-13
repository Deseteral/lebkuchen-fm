interface Song {
  name: string;
  youtubeId: string;
  stream: {
    url: string;
  }
}

interface CurrentlyPlaying {
  song: Song | null;
  time: number;
}

interface PlayerState {
  currentlyPlaying: CurrentlyPlaying | null;
  queue: Song[];
  isPlaying: boolean;
  volume: number;
}

export { PlayerState, Song, CurrentlyPlaying };
