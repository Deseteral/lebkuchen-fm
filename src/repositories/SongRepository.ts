import { Db } from 'mongodb';
import Song from '../domain/Song';
import MongoConnection from '../clients/MongoConnection';

function getCollection() {
  const db = MongoConnection.get() as Db;
  const collection = db.collection('songs');
  return collection;
}

function insert(song: Song) {
  return getCollection().insertOne(song);
}

function getByName(name: string) {
  return getCollection().findOne({ name });
}

function getAll() {
  return getCollection().find({}).toArray();
}

function getByYoutubeId(youtubeId: string) {
  return getCollection().findOne({ youtubeId });
}

function getRandomSong() {
  return getCollection().count({})
    .then((n: number) => Math.floor(Math.random() * n))
    .then((r: number) => getCollection().find({}).limit(1).skip(r).toArray())
    .then((songs: Song[]) => songs[0]);
}

function update(song: Song) {
  return getCollection().updateOne({ _id: song._id }, song);
}

export default {
  insert,
  getByName,
  getAll,
  getByYoutubeId,
  update,
  getRandomSong,
};
