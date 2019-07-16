import Song from '../domain/Song';
import MongoConnection from '../clients/MongoConnection';

function getCollection() {
  const db = MongoConnection.get();
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
  return getCollection().find({}).sort({ timesPlayed: -1 }).toArray();
}

function getByYoutubeId(youtubeId: string) {
  return getCollection().findOne({ youtubeId });
}

function replace(song: Song) {
  return getCollection().replaceOne({ _id: song._id }, song);
}

export default {
  insert,
  getByName,
  getAll,
  getByYoutubeId,
  replace,
};
