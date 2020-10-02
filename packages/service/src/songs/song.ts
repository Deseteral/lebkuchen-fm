import { ObjectID } from 'mongodb';

interface Song {
  _id?: ObjectID;
  name: string;
  youtubeId: string;
  trimStartSeconds: (number | null);
  trimEndSeconds: (number | null);
  timesPlayed: number;
}

export default Song;
