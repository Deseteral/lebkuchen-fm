import { Db } from 'mongodb';
import Song from '../domain/Song';
import MongoConnection from '../database/MongoConnection';

function insert(song: Song) {
  const db = MongoConnection.get() as Db;
  console.log(song);
  const collection = db.collection('songs');
  collection.insertOne(song);
}

export default {
  insert,
};
