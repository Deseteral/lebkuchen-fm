import { Collection } from 'mongodb';
import * as Storage from '../../infrastructure/storage';
import XSound from './x-sound';

function getCollection(): Collection<XSound> {
  return Storage.collection<XSound>('x');
}

function findAllOrderByNameAsc(): Promise<XSound[]> {
  return getCollection().find({}).sort({ name: 1 }).toArray();
}

function findByName(name: string): Promise<XSound | null> {
  return getCollection().findOne({ name });
}

async function insert(sound: XSound): Promise<void> {
  await getCollection().insertOne(sound);
}

async function replace(sound: XSound): Promise<void> {
  await getCollection().replaceOne({ _id: sound._id }, sound);
}

export {
  findByName,
  findAllOrderByNameAsc,
  insert,
  replace,
};
