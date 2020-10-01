import { MongoClient } from 'mongodb';
import * as Configuration from '../application/configuration';
import * as Logger from '../infrastructure/logger';

const client = new MongoClient(Configuration.read().MONGODB_URI, { useUnifiedTopology: true });

async function connect() {
  try {
    await client.connect();

    const databaseName = Configuration.read().DATABASE_NAME;
    await client.db(databaseName).command({ ping: 1 });

    Logger.info('Connected to MongoDB server', 'mongo-client');
  } finally {
    await client.close();
  }
}

export { connect, client };
