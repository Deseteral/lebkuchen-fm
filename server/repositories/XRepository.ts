import MongoConnection from '../clients/MongoConnection';
import XSound from '../domain/XSound';

function getCollection() {
  const db = MongoConnection.get();
  const collection = db.collection('x');
  return collection;
}

function getByName(name: string) {
  return getCollection().findOne({ name });
}

function getAll() : Promise<XSound[]> {
  return getCollection().find({}).toArray();
}

export default {
  getByName,
  getAll,
};
