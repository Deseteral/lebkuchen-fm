import MongoConnection from '../clients/MongoConnection';
import XSound from '../domain/XSound';

function getCollection() {
  const db = MongoConnection.get();
  const collection = db.collection('x');
  return collection;
}

function insert(sound: XSound) {
  return getCollection().insertOne(sound);
}

function getByName(name: string) {
  return getCollection().findOne({ name });
}

function getAll() {
  return getCollection().find({}).toArray();
}

export default {
  getByName,
  getAll,
  insert,
};
