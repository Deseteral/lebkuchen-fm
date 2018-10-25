interface Song {
  _id?: string;
  name: string;
  youtubeId: string;
  trimStartSeconds: (number | null);
  trimEndSeconds: (number | null);
  timesPlayed: number;
  playNext?: boolean;
}

export default Song;
