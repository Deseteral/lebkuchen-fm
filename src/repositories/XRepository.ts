import { Db } from 'mongodb';
import MongoConnection from '../clients/MongoConnection';

function getCollection() {
  const db = MongoConnection.get() as Db;
  const collection = db.collection('x');
  return collection;
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
};
