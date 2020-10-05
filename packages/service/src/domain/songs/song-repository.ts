import { Collection, InsertOneWriteOpResult, ReplaceWriteOpResult, WithId } from 'mongodb';
import * as Storage from '../../infrastructure/storage';
import Song from './song';

function getCollection(): Collection<Song> {
  return Storage.collection<Song>('songs');
}

function findAllOrderByTimesPlayedDesc(): Promise<Song[]> {
  return getCollection().find({}).sort({ timesPlayed: -1 }).toArray();
}

function findByName(name: string): Promise<Song | null> {
  return getCollection().findOne({ name });
}

function findByYoutubeId(youtubeId: string): Promise<Song | null> {
  return getCollection().findOne({ youtubeId });
}

function insert(song: Song): Promise<InsertOneWriteOpResult<WithId<Song>>> {
  return getCollection().insertOne(song);
}

function replace(song: Song): Promise<ReplaceWriteOpResult> {
  return getCollection().replaceOne({ _id: song._id }, song);
}

export {
  findAllOrderByTimesPlayedDesc,
  findByName,
  findByYoutubeId,
  insert,
  replace,
};
