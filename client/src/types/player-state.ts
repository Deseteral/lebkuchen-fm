interface Song {
  name: string;
  youtubeId: string;
  timesPlayed: number;
  trimStartSeconds: number | null;
  trimEndSeconds: number | null;
  stream?: {
    url: string;
  };
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
