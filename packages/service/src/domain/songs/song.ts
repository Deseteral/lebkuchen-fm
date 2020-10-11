import { ObjectID } from 'mongodb';

interface Song {
  _id?: ObjectID,
  name: string,
  youtubeId: string,
  timesPlayed: number,
  trimStartSeconds: (number | null),
  trimEndSeconds: (number | null),
}

export default Song;
