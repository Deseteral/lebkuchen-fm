import { Db } from 'mongodb';
import Song from '../domain/Song';
import MongoConnection from '../clients/MongoConnection';

function insert(song: Song) {
  const db = MongoConnection.get() as Db;
  const collection = db.collection('songs');
  collection.insertOne(song);
}

function getByName(name: string) {
  const db = MongoConnection.get() as Db;
  const collection = db.collection('songs');
  return collection.findOne({ name });
}

export default {
  insert,
  getByName,
};
