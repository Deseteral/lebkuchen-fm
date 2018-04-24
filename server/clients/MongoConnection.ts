import { MongoClient, Db } from 'mongodb';
import Configuration from '../application/Configuration';

let db: (Db | null) = null;

function connect() : Promise<void> {
  return new Promise((resolve, reject) => {
    MongoClient.connect(Configuration.MONGODB_URI, (err, client) => {
      if (err) {
        console.error('Could not connect to MongoDB');
        reject(err);
        return;
      }

      db = client.db(Configuration.DATABASE_NAME);
      console.log('Successfully connected to MongoDB');
      resolve();
    });
  });
}

function get() : Db {
  return db as Db;
}

export default {
  get,
  connect,
};
