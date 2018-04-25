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

function getAll() : Promise<XSound[]> {
  return getCollection().find({}).toArray();
}

function replace(sound: XSound) {
  return getCollection().replaceOne({ _id: sound._id }, sound);
}

export default {
  getByName,
  getAll,
  insert,
  replace,
};
