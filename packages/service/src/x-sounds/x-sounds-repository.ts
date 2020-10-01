import { Collection, InsertOneWriteOpResult, ReplaceWriteOpResult, WithId } from 'mongodb';
import * as Storage from '../infrastructure/storage';
import XSound from './x-sound';

function getCollection(): Collection<XSound> {
  return Storage.getDatabase().collection('x');
}

function insert(sound: XSound): Promise<InsertOneWriteOpResult<WithId<XSound>>> {
  return getCollection().insertOne(sound);
}

function findByName(name: string): Promise<XSound | null> {
  return getCollection().findOne({ name });
}

function findAll(): Promise<XSound[]> {
  return getCollection().find({}).toArray();
}

function replace(sound: XSound): Promise<ReplaceWriteOpResult> {
  return getCollection().replaceOne({ _id: sound._id }, sound);
}

export default {
  findByName,
  findAll,
  insert,
  replace,
};
