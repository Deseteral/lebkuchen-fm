import { MongoClient, Db } from 'mongodb';
import process from 'process';

const url = process.env['MONGO_URI'] || 'mongodb://localhost:27017';
const dbName = 'lebkuchen-fm';

let db: (Db | null) = null;

function connect() : Promise<void> {
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, (err, client) => {
      if (err) {
        console.log('Could not connect to MongoDB');
        reject(err);
        return;
      }

      db = client.db(dbName);
      console.log('Successfully connected to MongoDB');
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
