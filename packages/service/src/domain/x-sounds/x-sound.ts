import { ObjectID } from 'mongodb';

interface XSound {
  _id?: ObjectID,
  name: string,
  url: string,
  timesPlayed: number,
  tags?: string[],
}

export default XSound;
