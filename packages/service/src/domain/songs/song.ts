import { ObjectId } from 'mongodb';

interface Song {
  _id?: ObjectId,
  name: string,
  youtubeId: string,
  timesPlayed: number,
  trimStartSeconds: (number | null),
  trimEndSeconds: (number | null),
}

export default Song;
