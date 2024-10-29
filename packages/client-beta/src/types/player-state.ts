import { ObjectId } from 'mongodb';

interface Song {
  _id?: ObjectId;
  name: string;
  youtubeId: string;
  timesPlayed: number;
  trimStartSeconds: number | null;
  trimEndSeconds: number | null;
}

interface CurrentlyPlaying {
  song: Song | null;
  time: number;
}

interface PlayerState {
  currentlyPlaying: (CurrentlyPlaying | null);
  queue: Song[];
  isPlaying: boolean;
  volume: number;
}

export {
  PlayerState,
  Song,
  CurrentlyPlaying,
};
