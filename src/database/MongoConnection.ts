import { MongoClient, Db } from 'mongodb';

const url = 'mongodb://localhost:27017';
const dbName = 'LebkuchenFM';

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
