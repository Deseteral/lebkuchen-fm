import { ObjectId } from 'mongodb';

interface XSound {
  _id?: ObjectId,
  name: string,
  url: string,
  timesPlayed: number,
  tags?: string[],
}

export { XSound };
