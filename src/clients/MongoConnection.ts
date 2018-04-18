import { MongoClient, Db } from 'mongodb';
import process from 'process';

const url = process.env['MONGO_URI'] || 'mongodb://localhost:27017';
const dbName = 'lebkuchen-fm';

let db: (Db | null) = null;

function connect() {
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, (err, client) => {
      if (err) {
        reject(err);
        return;
      }

      console.log('Connected successfully to MongoDB');
      db = client.db(dbName);
      resolve();
    });
  });
}

function get() : (Db | null) {
  return db;
}

export default {
  get,
  connect,
};
